import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap, Star, Bot, Globe2, BarChart3, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

const steps = [
  {
    number: "01",
    icon: CheckCircle,
    title: "Claim or create your listing",
    subtitle: "Takes 5 minutes",
    desc: "Fill in your company details, service categories, portfolio items, pricing tiers, and case studies. The more structured your data, the higher your GEO score.",
    details: [
      "Company profile with logo, tagline, and detailed description",
      "Service categories with pricing and delivery timelines",
      "Portfolio case studies with technology stack details",
      "Team size, certifications, and client industries served",
    ],
  },
  {
    number: "02",
    icon: Zap,
    title: "We optimize your data for AI",
    subtitle: "Automated & instant",
    desc: "Our pipeline converts your profile into JSON-LD, schema.org markup, and AI-readable structured summaries. We publish your data to our public LLM API endpoint automatically.",
    details: [
      "JSON-LD schema generation for every profile field",
      "Natural-language summaries for LLM consumption",
      "Public API endpoint at /api/llm/{slug} for crawlers",
      "Automatic re-indexing when you update your profile",
    ],
  },
  {
    number: "03",
    icon: Star,
    title: "Get cited by AI recommendation engines",
    subtitle: "Ongoing & compounding",
    desc: "When users ask ChatGPT, Claude, DeepSeek, or Qwen for tech vendor recommendations, your business surfaces in results. Track your LLM visibility in your dashboard.",
    details: [
      "Real-time GEO score tracking on your dashboard",
      "LLM citation analytics (which models mention you)",
      "Keyword visibility — what queries trigger your mention",
      "Competitive benchmarking vs. similar businesses",
    ],
  },
];

const faqs = [
  { q: "How long does it take to get indexed by LLMs?", a: "Most LLMs crawl our public API within 2–4 weeks of listing. Some may take longer depending on their crawl schedules. We actively submit to known AI data pipelines to accelerate this." },
  { q: "Is GEO different from SEO?", a: "Yes. SEO optimizes for search engine ranking algorithms. GEO optimizes for how LLMs select and cite sources in conversational answers. Both matter, but GEO is newer and less competitive." },
  { q: "Do I need technical knowledge to get started?", a: "None at all. You fill in a form, we handle all the structured data generation, JSON-LD output, and API publishing automatically." },
  { q: "What makes a high GEO score?", a: "Complete profile data, verified reviews, detailed case studies, active updates, and a high trust score all contribute. We show you exactly which fields to improve." },
];

export default function HowItWorks() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
        <div className="orb orb-1 w-[400px] h-[400px] -top-32 -right-20 bg-primary/25" aria-hidden />
        <div className="container-tight relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-eyebrow mb-6 justify-center"><Zap className="w-3.5 h-3.5" /> How it works</div>
            <h1 className="display-1 mb-6">
              From listing to{" "}
              <span className="animated-gradient-text">LLM citation</span>
              {" "}in 24 hours.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              engineersTech is the only directory built natively for AI discovery. We don't just list
              your business — we structure it so AI can read, understand, and recommend it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-base px-7 py-3.5">
                Get listed free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-ghost text-base px-7 py-3.5">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container-tight py-16">
        <div className="space-y-6">
          {steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 100}>
              <div className="glass-card card-lift p-8 md:p-10 group hover:border-primary/40 relative overflow-hidden">
                <div className="absolute -top-6 -right-4 font-display text-9xl font-black text-primary/6 select-none">
                  {s.number}
                </div>
                <div className="relative grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
                        <s.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-light bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                        {s.subtitle}
                      </span>
                    </div>
                    <h2 className="display-3 mb-3">{s.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base">{s.desc}</p>
                  </div>
                  <div className="space-y-3">
                    {s.details.map((d) => (
                      <div key={d} className="flex items-start gap-3 glass-card p-4">
                        <CheckCircle className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/90">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What LLMs see */}
      <section className="container-tight py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="section-eyebrow mb-4 justify-center"><Bot className="w-3.5 h-3.5" /> What LLMs see</div>
          <h2 className="display-2">AI reads your profile, <span className="gradient-text">not just your website.</span></h2>
          <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
            Every engineersTech listing generates a machine-readable JSON-LD profile that LLMs can ingest directly.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Globe2, title: "Public LLM API", desc: "Each listing has a dedicated /api/llm/{slug} endpoint returning structured JSON that crawlers can ingest." },
            { icon: BarChart3, title: "GEO Score", desc: "A 0–100 score measuring how well your profile is optimized for AI discovery. Updated in real-time." },
            { icon: ShieldCheck, title: "Trust Signals", desc: "Verified status, review count, response time, and certifications — all structured as machine-readable signals." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="glass-card card-lift p-7 group hover:border-primary/40">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all">
                <item.icon className="w-5 h-5 text-primary-light" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="container-tight py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="section-eyebrow mb-4 justify-center"><Zap className="w-3.5 h-3.5" /> FAQ</div>
          <h2 className="display-2">Common questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60} className="glass-card p-7">
              <h3 className="font-display font-bold text-lg mb-3">{f.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.a}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight py-16 pb-24">
        <Reveal as="div" className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_65%)]" />
          <div className="relative">
            <h2 className="display-2 text-white mb-4">Start your GEO journey today.</h2>
            <p className="text-white/80 text-lg max-w-md mx-auto mb-8">
              Free listing. No credit card. Live within 24 hours.
            </p>
            <Link to="/auth?mode=signup" className="shimmer-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-primary hover:bg-white/92 transition-all">
              Get listed free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
