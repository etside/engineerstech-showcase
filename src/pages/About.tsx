import { Link } from "react-router-dom";
import { Sparkles, Target, Heart, Zap } from "lucide-react";

export default function About() {
  return (
    <section className="container-tight py-16">
      <div className="max-w-3xl mb-16">
        <div className="section-eyebrow mb-3"><Sparkles className="w-3.5 h-3.5" /> About</div>
        <h1 className="display-1 mb-6 text-balance">We're building the directory <span className="gradient-text">AI quotes from.</span></h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Search is moving from blue links to AI answers. The next decade of B2B discovery
          happens inside ChatGPT, Claude, and dozens of vertical LLMs. We make sure the right
          businesses are part of that answer.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-20">
        {[
          { Icon: Target, t: "Mission", d: "Make every business — large or small — discoverable in the age of AI search." },
          { Icon: Heart, t: "Values", d: "Trust, transparency, and structured truth. We index what's real, never what's loudest." },
          { Icon: Zap, t: "Approach", d: "Human-quality reviews + machine-readable schema + an API the LLMs actually use." },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="glass-card p-7">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-primary-light" />
            </div>
            <div className="font-display text-lg font-semibold mb-2">{t}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 md:p-16 text-center">
        <h2 className="display-2 mb-4">Want in?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">List your business and ride the wave of generative discovery.</p>
        <Link to="/auth?mode=signup" className="btn-gradient">Get started free</Link>
      </div>
    </section>
  );
}
