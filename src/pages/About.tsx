import { Link } from "react-router-dom";
import { ArrowRight, Users, Globe2, Award, Zap, Target, Heart } from "lucide-react";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

const team = [
  { name: "Rafiq Ahmed", role: "Co-Founder & CEO", bio: "Former SWE at BJIT. Built Bangladesh's first GEO-indexed tech directory." },
  { name: "Nadia Islam", role: "Co-Founder & CTO", bio: "AI/ML engineer. Architected the LLM pipeline that powers AI discovery." },
  { name: "Tanvir Hossain", role: "Head of Growth", bio: "Scaled 3 B2B SaaS platforms across Southeast Asia." },
  { name: "Sara Karim", role: "Head of Product", bio: "Former PM at Brain Station 23. Expert in developer-first product design." },
];

const values = [
  { icon: Target, title: "Accuracy first", desc: "Every listing is manually reviewed. We reject low-quality submissions so the directory stays trustworthy for buyers and AI alike." },
  { icon: Globe2, title: "Built for the AI era", desc: "We structure data in JSON-LD and schema.org from day one — not as an afterthought. LLMs can read every listing natively." },
  { icon: Heart, title: "Community-driven", desc: "The best recommendations come from real engineers who've worked with these vendors, not paid placements." },
  { icon: Award, title: "Bangladesh-first, globally minded", desc: "We started here because we know this market. But our platform and API serve the global B2B discovery ecosystem." },
];

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About engineersTech",
    description: "engineersTech is the AI-powered business directory for engineers and tech professionals in Bangladesh.",
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="orb orb-1 w-[400px] h-[400px] -top-32 -left-20 bg-primary/25" aria-hidden />
        <div className="container-tight relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-eyebrow mb-6 justify-center">
              <Zap className="w-3.5 h-3.5" /> Our story
            </div>
            <h1 className="display-1 mb-6">
              We believe every engineer deserves to be{" "}
              <span className="animated-gradient-text">found by AI.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              engineersTech was founded in 2024 by a team of software engineers frustrated with how
              hard it was to find quality tech vendors in Bangladesh — and how invisible local
              firms were to AI recommendation engines. We built the fix.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container-tight py-16">
        <div className="glass-card p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--primary)/0.08),_transparent_60%)] pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-eyebrow mb-4"><Target className="w-3.5 h-3.5" /> Our mission</div>
              <h2 className="display-2 mb-4">Make local tech expertise <span className="gradient-text">globally discoverable.</span></h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Bangladesh has thousands of world-class engineering firms, developers, and tech
                consultancies. But when a buyer in the US or UK asks ChatGPT for a recommendation,
                these firms are invisible. We change that.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "500+", label: "Verified businesses" },
                { stat: "44", label: "Tech categories" },
                { stat: "50K+", label: "Monthly searches" },
                { stat: "2026", label: "Founded" },
              ].map((s) => (
                <div key={s.label} className="glass-card p-5 text-center">
                  <div className="font-display font-extrabold text-3xl gradient-text">{s.stat}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-tight py-16">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="section-eyebrow mb-4 justify-center"><Heart className="w-3.5 h-3.5" /> Our values</div>
          <h2 className="display-2">What we stand for</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80} className="glass-card card-lift p-7 group hover:border-primary/40">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all">
                <v.icon className="w-5 h-5 text-primary-light" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-tight py-16">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="section-eyebrow mb-4 justify-center"><Users className="w-3.5 h-3.5" /> The team</div>
          <h2 className="display-2">Built by <span className="gradient-text">engineers</span>, for engineers.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 60} className="glass-card card-lift p-6 text-center group hover:border-primary/40">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white font-display font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform ease-spring">
                {m.name.charAt(0)}
              </div>
              <h3 className="font-display font-bold text-base mb-0.5">{m.name}</h3>
              <div className="text-xs text-primary-light font-semibold mb-3">{m.role}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight py-16 pb-24">
        <Reveal as="div" className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_65%)]" />
          <div className="relative">
            <h2 className="display-2 text-white mb-4">Ready to get discovered?</h2>
            <p className="text-white/80 text-lg max-w-md mx-auto mb-8">
              Join 500+ tech businesses already getting cited by AI recommendation engines.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="shimmer-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-primary hover:bg-white/92 transition-all">
                List your business free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all">
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
