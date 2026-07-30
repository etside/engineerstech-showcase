import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Zap, Star, Bot, Globe2, BarChart3, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

const steps = [
  {
    number: "01",
    icon: CheckCircle,
    title: "Create your seller account",
    subtitle: "Takes 5 minutes",
    desc: "Sign up, fill in your business details, and set up your vendor storefront. Add your logo, description, and start listing your products or services.",
    details: [
      "Professional vendor storefront with your branding",
      "Product and service listings with images and descriptions",
      "Set pricing, inventory, and delivery options",
      "Accept payments securely through our platform",
    ],
  },
  {
    number: "02",
    icon: Zap,
    title: "List your products & services",
    subtitle: "Quick & guided",
    desc: "Add products with photos, variants, and pricing. List services with descriptions and delivery timelines. Our guided flow makes it easy to get everything right.",
    details: [
      "Product listings with images, variants, and stock tracking",
      "Service listings with pricing tiers and delivery estimates",
      "Category placement for better discoverability",
      "SEO-optimized listings that rank in search and AI",
    ],
  },
  {
    number: "03",
    icon: Star,
    title: "Start selling & grow",
    subtitle: "Ongoing & compounding",
    desc: "Receive orders, manage inventory, and track your performance. Use analytics to optimize your listings and grow your revenue on the platform.",
    details: [
      "Real-time sales and revenue analytics dashboard",
      "Order management and fulfillment tools",
      "Customer reviews and ratings build your reputation",
      "Promotions, bulk pricing, and upsell tools",
    ],
  },
];

const faqs = [
  { q: "How do I start selling?", a: "Sign up for a free account, set up your vendor profile, and start listing products or services. The whole process takes about 5 minutes." },
  { q: "What can I sell on engineersTech?", a: "Tech products (software, hardware, SaaS tools), professional services (development, design, consulting), and digital goods. All listings go through a quality review." },
  { q: "How do payments work?", a: "We handle checkout, payment processing, and fraud protection. You receive payouts directly to your bank account on a regular schedule." },
  { q: "Is there a fee to join?", a: "The Starter plan is free forever with up to 10 product listings. Growth plan at ৳1,999/month unlocks unlimited listings, analytics, and a verified badge." },
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
              Start selling in{" "}
              <span className="animated-gradient-text">three simple steps.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Join hundreds of vendors selling tech products and services on engineersTech.
              Set up your storefront, list your offerings, and reach buyers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-base px-7 py-3.5">
                Start selling <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/products" className="btn-ghost text-base px-7 py-3.5">Browse products</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container-tight py-16">
        <div className="space-y-6">
          {steps.map((s, i) => (
            <Reveal key={s.number} delay={i * 100}>
              <div className="glass-card card-lift p-8 md:p-10 group hover:border-primary/40 relative overflow-hidden transition-all duration-300">
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
            <h2 className="display-2 text-white mb-4">Ready to start selling?</h2>
            <p className="text-white/80 text-lg max-w-md mx-auto mb-8">
              Join hundreds of vendors reaching tech buyers worldwide.
            </p>
            <Link to="/auth?mode=signup" className="shimmer-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-primary hover:bg-white/92 transition-all">
              Start selling <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
