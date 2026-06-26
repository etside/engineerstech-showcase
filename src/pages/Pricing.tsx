import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { invokeFn } from "@/lib/fn";

type Tier = { id: string; slug: string; name: string; price_usd: number; price_bdt: number | null; billing_period: string; features: string[]; display_order: number; is_active: boolean };

export default function Pricing() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const nav = useNavigate();
  const [params] = useSearchParams();
  const bizParam = params.get("biz");

  useEffect(() => {
    supabase.from("pricing_tiers").select("*").eq("is_active", true).order("display_order")
      .then(({ data }) => {
        let rows = ((data as unknown) as Tier[]) || [];
        // Payment is mandatory for every new listing — hide free tier in submission flow
        if (bizParam) rows = rows.filter((t) => t.price_usd > 0);
        setTiers(rows);
      });
  }, []);

  async function choose(t: Tier) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { nav(`/auth?mode=signup&next=/pricing`); return; }
    if (t.slug === "enterprise") { nav("/contact"); return; }
    if (t.price_usd === 0) { nav("/submit"); return; }
    let businessId = bizParam;
    if (!businessId) {
      const { data: bizes } = await supabase.from("businesses").select("id,name").or(`owner_id.eq.${user.id},claimed_by.eq.${user.id}`).limit(1);
      if (!bizes?.length) { toast("Create a listing first"); nav("/submit"); return; }
      businessId = bizes[0].id;
    }
    try {
      const res = await invokeFn<{ gatewayUrl: string }>("sslcz-init", { businessId, tierSlug: t.slug, returnOrigin: window.location.origin });
      window.location.href = res.gatewayUrl;
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <section className="container-tight py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-eyebrow mb-3 justify-center"><Sparkles className="w-3.5 h-3.5" /> Pricing</div>
        <h1 className="display-1 mb-4">
          {bizParam ? <>Step 2 of 3 — <span className="gradient-text">Choose your plan</span></> : <>Simple, AI-discovery-first <span className="gradient-text">pricing.</span></>}
        </h1>
        <p className="text-lg text-muted-foreground">
          {bizParam
            ? "All listings require a paid plan. After payment, our admin team verifies your submission and your listing goes live."
            : "Every listing on geoListed is paid. Pay in USD or BDT via SSLCommerz."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {tiers.map((t) => {
          const featured = t.slug === "pro" || t.slug === "featured";
          return (
          <div key={t.id} className={`glass-card p-8 relative ${featured ? "border-primary/60 shadow-2xl shadow-primary/20" : ""}`}>
            {featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider gradient-bg text-white">
                Most popular
              </div>
            )}
            <div className="font-display font-semibold text-lg">{t.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display font-bold text-4xl">{t.price_usd === 0 ? "Free" : t.slug === "enterprise" ? "Custom" : `$${t.price_usd}`}</span>
              <span className="text-muted-foreground text-sm">{t.price_usd > 0 && t.slug !== "enterprise" ? `/${t.billing_period === "yearly" ? "yr" : "mo"}` : ""}</span>
            </div>
            {t.price_bdt && t.price_usd > 0 && <div className="text-xs text-muted-foreground">or ৳{t.price_bdt}/mo</div>}
            <p className="text-sm text-muted-foreground mt-3 mb-6">{t.slug === "free" ? "Get listed for free." : t.slug === "pro" ? "For vendors serious about AI discovery." : t.slug === "featured" ? "Top placements + featured everywhere." : "Multi-brand / multi-location teams."}</p>
            <button onClick={() => choose(t)} className={(featured ? "btn-gradient" : "btn-ghost") + " w-full justify-center"}>
              {t.price_usd === 0 ? "Get started" : t.slug === "enterprise" ? "Contact sales" : "Upgrade"}
            </button>
            <ul className="mt-7 space-y-2.5">
              {(t.features || []).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        })}
      </div>
      <p className="text-xs text-muted-foreground text-center mt-8">
        Already a member? <Link to="/dashboard" className="underline">Manage subscriptions →</Link>
      </p>
    </section>
  );
}
