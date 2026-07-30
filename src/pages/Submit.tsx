import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi, businessApi, categoryApi } from "@/lib/api";
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
  const [f, setF] = useState({
    name: "", tagline: "", description: "", website: "", email: "", category: "software", country: "Bangladesh", services: "", evidence: "",
    phone: "", location: "", industry: "", founded_year: "", employee_count: "", hourly_rate: "", min_project_size: "",
    social_linkedin: "", social_twitter: "", social_github: "",
  });
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<Array<{ slug: string; name: string }>>([]);

  useEffect(() => {
    authApi.me().then(({ user }) => setAuthed(!!user));
    categoryApi.list().then((data) => setCats((data || []).map((c: any) => ({ slug: c.slug, name: c.name }))));
  }, []);

  if (authed === false) {
    return <div className="container-tight py-20 text-center"><p className="mb-4">Sign in to start selling.</p><button className="btn-gradient" onClick={() => nav("/auth?mode=signup")}>Sign in</button></div>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { user } = await authApi.me();
    if (!user) return;
    const slug = slugify(f.name) + "-" + Math.random().toString(36).slice(2, 6);
    try {
      const { id } = await businessApi.create({
        name: f.name,
        slug,
        description: f.description,
        short_description: f.tagline,
        website: f.website,
        email: f.email,
        phone: f.phone || undefined,
        category_name: f.category,
        country: f.country,
        services: f.services.split(",").map((s) => s.trim()).filter(Boolean),
        social_links: {
          linkedin: f.social_linkedin || undefined,
          twitter: f.social_twitter || undefined,
          github: f.social_github || undefined,
        },
        tags: [f.industry, f.location].filter(Boolean),
      });
      setLoading(false);
      toast.success("Store saved -- choose a plan to continue");
      nav(`/pricing?biz=${id ?? ""}`);
    } catch (err) {
      setLoading(false);
      toast.error((err as Error).message);
    }
  }

  return (
    <section className="container-tight py-12 max-w-2xl">
      <h1 className="display-2 mb-2">Start selling on engineersTech</h1>
      <p className="text-muted-foreground mb-8">
        Step 1 of 3: Fill in your store details. Next, choose a plan and set up payment.
        Your store goes live after a quick verification (usually under 24h).
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
        {/* Basic Info */}
        {[
          { k: "name", l: "Store name", req: true },
          { k: "tagline", l: "Tagline" },
          { k: "website", l: "Website" },
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

        {/* Contact Info */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Contact email</label>
          <input
            type="email"
            required
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone</label>
          <input
            type="tel"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
            placeholder="+880-1XXXXXXXXX"
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Location (city / address)</label>
          <input
            value={f.location}
            onChange={(e) => setF({ ...f, location: e.target.value })}
            placeholder="e.g. Dhaka, Bangladesh"
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {/* Business Details */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</label>
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm">
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Industry</label>
          <input
            value={f.industry}
            onChange={(e) => setF({ ...f, industry: e.target.value })}
            placeholder="e.g. FinTech, HealthTech, E-commerce"
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Services (comma-separated)</label>
          <input
            value={f.services}
            onChange={(e) => setF({ ...f, services: e.target.value })}
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Description</label>
          <textarea required value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={5} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Founded year</label>
            <input
              type="number"
              min={1900}
              max={2026}
              value={f.founded_year}
              onChange={(e) => setF({ ...f, founded_year: e.target.value })}
              placeholder="e.g. 2020"
              className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Employee count</label>
            <select value={f.employee_count} onChange={(e) => setF({ ...f, employee_count: e.target.value })} className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm">
              <option value="">Select...</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Hourly rate</label>
            <input
              value={f.hourly_rate}
              onChange={(e) => setF({ ...f, hourly_rate: e.target.value })}
              placeholder="e.g. $50-100/hr"
              className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Minimum project size</label>
            <input
              value={f.min_project_size}
              onChange={(e) => setF({ ...f, min_project_size: e.target.value })}
              placeholder="e.g. $1,000"
              className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">LinkedIn URL</label>
          <input
            type="url"
            value={f.social_linkedin}
            onChange={(e) => setF({ ...f, social_linkedin: e.target.value })}
            placeholder="https://linkedin.com/company/..."
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Twitter URL</label>
          <input
            type="url"
            value={f.social_twitter}
            onChange={(e) => setF({ ...f, social_twitter: e.target.value })}
            placeholder="https://twitter.com/..."
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">GitHub URL</label>
          <input
            type="url"
            value={f.social_github}
            onChange={(e) => setF({ ...f, social_github: e.target.value })}
            placeholder="https://github.com/..."
            className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {/* Evidence */}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Seller verification <span className="text-primary-light">*</span>
          </label>
          <textarea
            required
            value={f.evidence}
            onChange={(e) => setF({ ...f, evidence: e.target.value })}
            rows={4}
            placeholder="Your role, business email, LinkedIn profile, or business registration to verify you're authorized to sell."
            className="mt-1 w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Reviewed by our admin team before your listing goes live.</p>
        </div>
        <button disabled={loading} className="btn-gradient w-full justify-center">{loading ? "Saving..." : "Continue to plan selection"}</button>
        <p className="text-[11px] text-muted-foreground text-center">Free plan available. Upgrade anytime for more features.</p>
      </form>
    </section>
  );
}
