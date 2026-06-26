import { Link } from "react-router-dom";
import OnboardingStepper from "@/components/OnboardingStepper";
import { Search, Sparkles, Star, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="container-tight py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="display-1">How it works</h1>
        <p className="text-muted-foreground text-lg mt-4">
          A directory built for the AI era. Buyers discover trusted vendors through humans and LLMs alike.
        </p>
      </div>

      <div>
        <h2 className="display-3 mb-4">For vendors</h2>
        <OnboardingStepper state={{ submitted: true, paid: true, verified: true, live: false }} />
        <ol className="grid md:grid-cols-4 gap-3 mt-6 text-sm">
          <li className="glass-card p-4"><span className="text-primary-light font-bold">1.</span> <Link to="/submit" className="hover:text-primary-light">Submit</Link> your listing with proof of ownership.</li>
          <li className="glass-card p-4"><span className="text-primary-light font-bold">2.</span> <Link to="/pricing" className="hover:text-primary-light">Pay</Link> for the tier that fits — secured by SSLCommerz.</li>
          <li className="glass-card p-4"><span className="text-primary-light font-bold">3.</span> Our admin team verifies your evidence (≤ 24h).</li>
          <li className="glass-card p-4"><span className="text-primary-light font-bold">4.</span> Go live — discoverable in directory + AI feed.</li>
        </ol>
      </div>

      <div>
        <h2 className="display-3 mb-4">For buyers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          {[
            { i: Search, t: "Search the directory", d: "Filter by category, industry, geography, and GEO score." },
            { i: Sparkles, t: "Ask the AI", d: "Describe your problem on /ai-discover and get a shortlist." },
            { i: ShieldCheck, t: "Trust the verification", d: "Every listing is admin-verified and rating-aggregated." },
            { i: Star, t: "Read real reviews", d: "Verified-only reviews summarized into pros and watch-outs." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="glass-card p-4">
              <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center mb-3"><Icon className="w-4 h-4 text-white" /></div>
              <div className="font-semibold">{t}</div>
              <p className="text-muted-foreground mt-1">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
