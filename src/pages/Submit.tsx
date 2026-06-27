import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OnboardingStepper from "@/components/OnboardingStepper";
import { useTranslation } from "react-i18next";
import { ClipboardList, CreditCard, ShieldCheck, Rocket } from "lucide-react";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Submit() {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [f, setF] = useState({ name: "", tagline: "", description: "", website: "", email: "", category: "software", country: "Bangladesh", services: "", evidence: "" });
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<Array<{ slug: string; name: string }>>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    supabase.from("categories").select("slug,name").order("name").then(({ data }) => setCats(data || []));
  }, []);

  if (authed === false) {
    return <div className="container-tight py-20 text-center"><p className="mb-4">Sign in to submit a listing.</p><button className="btn-gradient" onClick={() => nav("/auth?mode=signup")}>Sign in</button></div>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const slug = slugify(f.name) + "-" + Math.random().toString(36).slice(2, 6);
    const { data: biz, error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      claimed_by: user.id,
      slug,
      name: f.name,
      tagline: f.tagline,
      description: f.description,
      website: f.website,
      email: f.email,
      category: f.category,
      country: f.country,
      services: f.services.split(",").map((s) => s.trim()).filter(Boolean),
      is_active: false,
      verification_status: "pending",
    }).select("id").maybeSingle();
    setLoading(false);
    if (error) return toast.error(error.message);
    // Save ownership/verification evidence for admin review
    if (biz && f.evidence.trim()) {
      const { data: claim } = await supabase.from("business_claims").insert({
        business_id: biz.id, user_id: user.id, evidence: f.evidence,
        status: "pending", claim_type: "initial",
      }).select("id").maybeSingle();
      if (claim) {
        await supabase.from("claim_audit_log").insert({
          claim_id: claim.id, business_id: biz.id, actor_id: user.id, actor_role: "owner",
          action: "submitted", notes: "Initial submission with evidence",
        });
      }
    }
    toast.success("Listing saved — choose a plan to continue");
    nav(`/pricing?biz=${biz?.id ?? ""}`);
  }

  return (
    <section className="container-tight py-12 max-w-2xl">
      <h1 className="display-2 mb-2">Submit your business</h1>
      <p className="text-muted-foreground mb-8">
        Step 1 of 3: Fill in your business details. Next, choose a paid plan and pay via SSLCommerz.
        Listings go live only after admin verification (usually under 24h).
      </p>
      <div className="glass-card p-5 mb-6">
        <div className="text-xs uppercase tracking-wider text-primary-light font-semibold mb-3">{t("vendorGuide.title")}</div>
        <ol className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { I: ClipboardList, t: t("vendorGuide.s1"), d: t("vendorGuide.s1d") },
            { I: CreditCard, t: t("vendorGuide.s2"), d: t("vendorGuide.s2d") },
            { I: ShieldCheck, t: t("vendorGuide.s3"), d: t("vendorGuide.s3d") },
            { I: Rocket, t: t("vendorGuide.s4"), d: t("vendorGuide.s4d") },
          ].map((s, i) => (
            <li key={i} className="flex gap-3 rounded-lg p-3 bg-muted/30 border border-border">
              <s.I className="w-4 h-4 text-primary-light mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">{s.t}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="mb-6">
        <OnboardingStepper state={{ submitted: false, paid: false, verified: false, live: false }} />
      </div>
      <form onSubmit={submit} className="glass-card p-6 space-y-4">
        {[
          { k: "name", l: "Business name", req: true },
          { k: "tagline", l: "Tagline" },
          { k: "website", l: "Website" },
          { k: "email", l: "Contact email" },
          { k: "country", l: "Country" },
          { k: "services", l: "Services (comma-separated)" },
        ].map((field) => (
          <div key={field.k}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{field.l}</label>
            <input
              required={field.req}
              value={(f as Record<string, string>)[field.k]}
              onChange={(e) => setF({ ...f, [field.k]: e.target.value })}
              className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
            />
          </div>
        ))}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</label>
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm">
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Description</label>
          <textarea required value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={5} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Ownership / verification evidence <span className="text-primary-light">*</span>
          </label>
          <textarea
            required
            value={f.evidence}
            onChange={(e) => setF({ ...f, evidence: e.target.value })}
            rows={4}
            placeholder="Your role, company email domain, LinkedIn, business registration #, or anything that proves you're authorized to list this business."
            className="mt-1 w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Reviewed by our admin team before your listing goes live.</p>
        </div>
        <button disabled={loading} className="btn-gradient w-full justify-center">{loading ? "Saving…" : "Continue to payment →"}</button>
        <p className="text-[11px] text-muted-foreground text-center">All listings require a paid plan. You'll pick a tier on the next step.</p>
      </form>
    </section>
  );
}