import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, HeartHandshake, Clock, ShieldCheck, Globe2, Users,
  Building2, MapPin, Headphones,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { businessApi, categoryApi } from "@/lib/api";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import {
  HeroSection, TrustedSection, StatsRibbon, RecognitionSection, AiDiscoverySection,
} from "./HomeSections1";
import {
  FeaturedSection, CategoriesSection, HowItWorksSection, CommunitySection,
} from "./HomeSections2";

interface Business {
  id: string; slug: string; name: string; tagline?: string | null;
  logo_url?: string | null; rating?: number | null; review_count?: number | null;
  geo_score?: number | null; is_verified?: boolean | null;
  location?: string | null; services?: string[] | null; category?: string | null;
}

// ─── "Powered by a global team" section (FundedNext: team/company metrics) ────
function GlobalTeamSection() {
  const teamStats = [
    { icon: Users,    value: 50,  suffix: "+",  label: "Team Members",     desc: "Across all hubs" },
    { icon: Building2, value: 5, suffix: "",    label: "Global Offices",   desc: "Regional presence" },
    { icon: MapPin,   value: 17,  suffix: "+",  label: "Countries Served", desc: "And growing" },
    { icon: Clock,    value: 24,  suffix: "/7", label: "Operations",       desc: "Always running" },
  ];

  return (
    <section className="py-20 bg-card/20 border-y border-border/30">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-eyebrow mb-4">
              <Globe2 className="w-3.5 h-3.5" /> Our team
            </div>
            <h2 className="display-2">
              Powered by a <span className="gradient-text">global team</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mt-3 leading-relaxed">
              Dozens of engineers, designers, and community managers — across multiple hubs —
              focused on one thing: engineersTech users.
            </p>
          </div>
          <Link to="/about" className="btn-ghost text-sm shrink-0 self-start md:self-auto">
            Company <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {teamStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="glass-card p-6 text-center group card-lift">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <s.icon className="w-5 h-5 text-primary-light" />
              </div>
              <div className="font-display font-black text-3xl gradient-text mb-0.5">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm font-semibold text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Support section (FundedNext: "Support that never clocks out") ─────────────
function SupportSection() {
  // Language flags matching FundedNext's language strip
  const languages = [
    { flag: "🇧🇩", lang: "Bangla" },
    { flag: "🇬🇧", lang: "English" },
    { flag: "🇮🇳", lang: "Hindi" },
    { flag: "🇸🇦", lang: "Arabic" },
    { flag: "🇫🇷", lang: "French" },
    { flag: "🇨🇳", lang: "Chinese" },
    { flag: "🇯🇵", lang: "Japanese" },
    { flag: "🇩🇪", lang: "German" },
  ];

  return (
    <section className="container-tight py-24">
      <div className="glass-card p-10 md:p-14 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(142_76%_45%/0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text content */}
          <div>
            <div className="section-eyebrow mb-5">
              <Headphones className="w-3.5 h-3.5" /> Support
            </div>
            {/* FundedNext: 2-line bold headline */}
            <h2 className="display-2 mb-2">
              Support that never
            </h2>
            <h2 className="display-2 mb-5">
              <span className="gradient-text">clocks out</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-md">
              Our support team operates 24 hours a day, 7 days a week. Day or night, the first
              response to your question arrives in under 25 seconds.
            </p>

            {/* Languages spoken row (FundedNext pattern) */}
            <div className="mb-7">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                Languages spoken
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {languages.map((l) => (
                  <span
                    key={l.lang}
                    title={l.lang}
                    className="text-xl cursor-default hover:scale-110 transition-transform duration-200"
                    aria-label={l.lang}
                  >
                    {l.flag}
                  </span>
                ))}
                <span className="text-sm text-muted-foreground font-semibold">+ more</span>
              </div>
            </div>

            {/* CTAs (FundedNext: Get Support + Read FAQs) */}
            <div className="flex gap-3">
              <Link to="/contact" className="btn-gradient text-sm py-2.5 px-5">
                Get Support
              </Link>
              <Link to="/faq" className="btn-ghost text-sm py-2.5 px-5">
                Read FAQs
              </Link>
            </div>
          </div>

          {/* Right: support stats + agent photo placeholder */}
          <div className="space-y-4">
            {/* Support team image placeholder */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-card border border-border/50 h-40 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="text-4xl mb-2">🎧</div>
                <p className="text-sm text-muted-foreground font-semibold">engineersTech support team</p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, stat: "98%",  label: "Customer satisfaction score" },
                { icon: Clock,       stat: "<25s",  label: "Avg. response time" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                    <item.icon className="w-4.5 h-4.5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-xl gradient-text">{item.stat}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA section (FundedNext: "Start your challenge") ──────────────────
function CtaSection() {
  return (
    <section className="container-tight py-24">
      <Reveal
        as="div"
        className="relative overflow-hidden rounded-3xl text-center"
        style={{
          background:
            "linear-gradient(135deg, hsl(142 76% 18%) 0%, hsl(160 50% 12%) 50%, hsl(142 60% 20%) 100%)",
        }}
      >
        {/* Grid pattern overlay (FundedNext CTA background) */}
        <div className="absolute inset-0 cta-grid-pattern pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(142_76%_45%/0.25),transparent_60%)] pointer-events-none" />
        {/* Orbs */}
        <div className="orb w-[350px] h-[350px] -top-24 -left-12 bg-primary/20" aria-hidden />
        <div className="orb w-[400px] h-[400px] -bottom-24 -right-12 bg-primary/15" aria-hidden />

        <div className="relative px-8 py-20 md:py-24">
          {/* FundedNext: "Start your challenge" style */}
          <h2 className="display-2 text-white mb-4">
            Start your
            <span className="block text-primary-light">engineersTech journey</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Thousands of engineers are already discovering top-rated tech vendors through
            engineersTech. The only one missing from that list is you. Your listing is open now.
          </p>

          {/* Trust stats row */}
          <div className="flex flex-wrap items-center justify-center gap-10 mb-10">
            {[
              { value: 500,  suffix: "+", label: "Verified" },
              { value: 98,   suffix: "%", label: "Satisfaction" },
              { value: 50,   suffix: "K+", label: "Users" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl font-extrabold text-white">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/60 uppercase tracking-wider font-semibold mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* FundedNext CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth?mode=signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-xl shadow-black/30 shimmer-btn"
            >
              List Your Business <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm border border-white/25 text-white hover:bg-white/10 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Main Home page ────────────────────────────────────────────────────────────
export default function Home() {
  const { content } = useHomepageContent();
  const [featured, setFeatured] = useState<Business[]>([]);
  const [cats, setCats] = useState<{ slug: string; name: string; icon: string | null }[]>([]);

  useEffect(() => {
    categoryApi.list().then((data) => {
      setCats(data.slice(0, 12) as never);
    });
    businessApi.featured(3).then((data) => {
      setFeatured(data as unknown as Business[]);
    });
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "engineersTech",
    url: "https://engineerstechbd.com",
    description:
      "AI-powered business directory for engineers & tech professionals. GEO-optimized for LLM discovery.",
    sameAs: [
      "https://twitter.com/engineerstech",
      "https://linkedin.com/company/engineerstech",
    ],
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />

      {/* 1. Hero — FundedNext: 2-line headline, trust badges, inline stats, CTAs */}
      <HeroSection content={content} />

      {/* 2. Trusted marquee */}
      <TrustedSection />

      {/* 3. Horizontal stats ribbon */}
      <StatsRibbon />

      {/* 4. "Recognized globally" award marquee (FundedNext pattern) */}
      <RecognitionSection />

      {/* 5. AI Discovery features */}
      <AiDiscoverySection content={content} />

      {/* 6. Featured / "Choose your next discovery" (FundedNext: challenge cards) */}
      <FeaturedSection content={content} featured={featured} />

      {/* 7. Categories */}
      <CategoriesSection cats={cats} />

      {/* 8. How It Works */}
      <HowItWorksSection content={content} />

      {/* 9. Community (Discord + YouTube) */}
      <CommunitySection />

      {/* 10. "Powered by a global team" */}
      <GlobalTeamSection />

      {/* 11. Support that never clocks out (FundedNext pattern) */}
      <SupportSection />

      {/* 12. Final CTA — "Start your challenge" */}
      <CtaSection />
    </>
  );
}
