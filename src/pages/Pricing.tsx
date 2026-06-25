import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  { name: "Starter", price: "$0", period: "forever", desc: "Get your business on the directory.", cta: "Get started",
    features: ["Basic verified profile","Up to 10 reviews","Standard JSON-LD output","Community support"], highlight: false },
  { name: "Growth", price: "$49", period: "/mo", desc: "For vendors serious about AI discovery.", cta: "Start 14-day trial",
    features: ["Featured placement in category","Unlimited reviews","Enhanced GEO optimization","AI review summarization","LLM visibility analytics","Priority moderation"], highlight: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For multi-brand / multi-location teams.", cta: "Contact sales",
    features: ["Multi-listing management","Dedicated LLM API quota","Custom JSON-LD schema","SSO & SOC2 documents","Dedicated success manager","White-label review widgets"], highlight: false },
];

export default function Pricing() {
  return (
    <section className="container-tight py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-eyebrow mb-3 justify-center"><Sparkles className="w-3.5 h-3.5" /> Pricing</div>
        <h1 className="display-1 mb-4">Simple, AI-discovery-first <span className="gradient-text">pricing.</span></h1>
        <p className="text-lg text-muted-foreground">Start free. Upgrade when AI starts driving you leads.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {tiers.map((t) => (
          <div key={t.name} className={`glass-card p-8 relative ${t.highlight ? "border-primary/60 shadow-2xl shadow-primary/20" : ""}`}>
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider gradient-bg text-white">
                Most popular
              </div>
            )}
            <div className="font-display font-semibold text-lg">{t.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display font-bold text-4xl">{t.price}</span>
              <span className="text-muted-foreground text-sm">{t.period}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3 mb-6">{t.desc}</p>
            <Link to="/auth?mode=signup" className={t.highlight ? "btn-gradient w-full justify-center" : "btn-ghost w-full justify-center"}>{t.cta}</Link>
            <ul className="mt-7 space-y-2.5">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
