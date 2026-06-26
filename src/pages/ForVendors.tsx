import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Users, Globe, Zap } from "lucide-react";

const features = [
  { i: TrendingUp, t: "GEO Score visibility", d: "Get found by ChatGPT, Claude, DeepSeek, and Qwen with our structured-data pipeline." },
  { i: ShieldCheck, t: "Verified-only directory", d: "Every vendor goes through admin verification, so buyers trust what they see." },
  { i: Sparkles, t: "AI-generated profile summaries", d: "We translate your reviews into pros, watch-outs, and ideal-fit buyer profiles." },
  { i: Users, t: "High-intent leads", d: "Buyers reach you after AI matching — not random cold pitches." },
  { i: Globe, t: "Global LLM feed", d: "Your listing is served via llms.txt + JSON-LD to every major model." },
  { i: Zap, t: "Instant activation", d: "Pay, get verified, go live in under 24 hours." },
];

export default function ForVendors() {
  return (
    <section className="container-tight py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/15 text-primary-light border border-primary/30 text-xs font-semibold uppercase tracking-wider">For service providers</span>
        <h1 className="display-1 mt-4">Sell to AI-first buyers</h1>
        <p className="text-muted-foreground text-lg mt-4">
          List your business once. Get discovered by humans on our directory and by every major LLM through our GEO pipeline.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link to="/submit" className="btn-gradient">List your business <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/pricing" className="btn-ghost">See pricing</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ i: Icon, t, d }) => (
          <div key={t} className="glass-card p-6">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-white" /></div>
            <h3 className="font-display font-semibold">{t}</h3>
            <p className="text-sm text-muted-foreground mt-2">{d}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 md:p-10 text-center">
        <h2 className="display-3">Ready when you are</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Submit → Pay → Admin verify → Live. The whole flow takes a few minutes plus our review.</p>
        <Link to="/submit" className="btn-gradient mt-6 inline-flex">Get started <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}
