import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap, BarChart3, Globe2, Star, ShieldCheck, TrendingUp, Users, Award } from "lucide-react";
import Reveal from "@/components/Reveal";

const benefits = [
  {
    icon: Globe2,
    title: "Get discovered by AI",
    desc: "When buyers ask ChatGPT or Claude for tech vendor recommendations, your GEO-optimized listing surfaces. We publish structured JSON-LD to our public LLM API automatically.",
  },
  {
    icon: BarChart3,
    title: "Real analytics dashboard",
    desc: "Track profile views, AI citation events, review sentiment trends, and conversion rates. Know exactly which keywords and LLMs are sending you traffic.",
  },
  {
    icon: Star,
    title: "Verified reviews build trust",
    desc: "Collect and display verified client reviews. Our AI summarizes them into pros/cons — the format LLMs prefer when citing your brand in recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Verified badge & trust signals",
    desc: "Go through our verification process and earn a Verified badge. Verified listings rank higher in AI results and convert at 3× the rate of unverified ones.",
  },
  {
    icon: Users,
    title: "Lead generation built in",
    desc: "Buyers contact you directly through your listing. No middleman, no commission. You own the relationship from day one.",
  },
  {
    icon: TrendingUp,
    title: "GEO score tracking",
    desc: "Your real-time score shows how AI-ready your profile is. Follow our checklist to improve it and watch your citation rate climb.",
  },
];

const plans = [
  {
    name: "Free",
    price: "৳0",
    period: "forever",
    highlight: false,
    features: [
      "Basic company profile",
      "1 service category",
      "Up to 3 portfolio items",
      "GEO score (read-only)",
      "Public LLM API listing",
      "Community support",
    ],
    cta: "Get started free",
    href: "/auth?mode=signup",
  },
  {
    name: "Growth",
    price: "৳1,999",
    period: "per month",
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Free",
      "Unlimited service categories",
      "Unlimited portfolio & case studies",
      "GEO score optimization tips",
      "Priority AI indexing",
      "Analytics dashboard",
      "Review management",
      "Verified badge (after review)",
      "Priority support",
    ],
    cta: "Start 14-day free trial",
    href: "/auth?mode=signup&plan=growth",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    highlight: false,
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "Custom LLM API integration",
      "White-glove onboarding",
      "SLA guarantee",
      "Custom analytics reports",
    ],
    cta: "Contact sales",
    href: "/contact",
  },
];

const testimonials = [
  {
    quote: "Within 3 months of listing on engineersTech, we started appearing in ChatGPT answers for 'Bangladesh software outsourcing'. Our inbound increased 40%.",
    name: "Rafiqul Hasan",
    title: "CEO, TechCraft BD",
    initials: "RH",
  },
  {
    quote: "The GEO score dashboard is a game changer. It shows us exactly what to fix to improve our AI visibility. Incredibly actionable.",
    name: "Sumaiya Chowdhury",
    title: "Marketing Director, CodeLab BD",
    initials: "SC",
  },
];

export default function ForVendors() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
        <div className="orb orb-1 w-[450px] h-[450px] -top-36 -left-24 bg-primary/28" aria-hidden />
        <div className="orb orb-2 w-[400px] h-[400px] top-16 -right-32 bg-primary-glow/18" aria-hidden />
        <div className="container-tight relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-eyebrow mb-6 justify-center">
              <Award className="w-3.5 h-3.5" /> For vendors & tech businesses
            </div>
            <h1 className="display-1 mb-6">
              Grow your tech business with{" "}
              <span className="animated-gradient-text">AI-powered discovery.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              engineersTech is the only directory that structures your profile for LLM recommendation
              engines. List once — get cited by ChatGPT, Claude, DeepSeek, and Qwen automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-base px-7 py-3.5">
                List your business free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/how-it-works" className="btn-ghost text-base px-7 py-3.5">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="container-tight pb-16">
        <div className="glass-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
            {[
              { stat: "500+", label: "Listed businesses" },
              { stat: "3×", label: "Higher conversion rate" },
              { stat: "40%", label: "Avg. inbound increase" },
              { stat: "24h", label: "Time to go live" },
            ].map((s) => (
              <div key={s.label} className="text-center px-6 py-2">
                <div className="font-display font-extrabold text-3xl gradient-text">{s.stat}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container-tight py-16">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="section-eyebrow mb-4 justify-center"><Zap className="w-3.5 h-3.5" /> Platform benefits</div>
          <h2 className="display-2">Everything you need to <span className="gradient-text">get found.</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 60} className="glass-card card-lift p-7 group hover:border-primary/40">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 ease-spring">
                <b.icon className="w-5 h-5 text-primary-light" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container-tight py-16" id="pricing">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="section-eyebrow mb-4 justify-center"><TrendingUp className="w-3.5 h-3.5" /> Pricing</div>
          <h2 className="display-2">Simple, transparent <span className="gradient-text">pricing.</span></h2>
          <p className="text-muted-foreground text-lg mt-4">Start free. Scale when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className={`glass-card p-7 flex flex-col h-full relative ${p.highlight ? "border-primary/50 green-glow" : ""}`}>
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-pill text-[10px] px-3 py-1">{p.badge}</span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{p.name}</div>
                  <div className="font-display font-extrabold text-4xl text-foreground">{p.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.period}</div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={p.href}
                  className={p.highlight ? "btn-gradient shimmer-btn text-sm w-full justify-center" : "btn-ghost text-sm w-full justify-center"}
                >
                  {p.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-tight py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="section-eyebrow mb-4 justify-center"><Star className="w-3.5 h-3.5" /> What vendors say</div>
          <h2 className="display-2">Real results from <span className="gradient-text">real businesses.</span></h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80} className="glass-card card-lift p-8">
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-primary-light fill-primary-light" />
                ))}
              </div>
              <blockquote className="text-foreground/90 leading-relaxed mb-6 text-sm italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/30">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.title}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight py-16 pb-24">
        <Reveal as="div" className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_65%)]" />
          <div className="relative">
            <h2 className="display-2 text-white mb-4">Join 500+ businesses getting found by AI.</h2>
            <p className="text-white/80 text-lg max-w-md mx-auto mb-8">
              Free listing. No credit card. Live within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="shimmer-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-primary hover:bg-white/92 transition-all">
                List your business free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all">
                Talk to sales
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
