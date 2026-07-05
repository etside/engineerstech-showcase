import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, Bot, Search, Star, ShieldCheck, Zap,
  BarChart3, Globe2, MessageSquare, Award, TrendingUp, LayoutGrid,
  Users, Clock, ThumbsUp, CircleCheckBig,
} from "lucide-react";
import TrustMarquee from "@/components/TrustMarquee";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import AskAiHero from "@/components/AskAiHero";
import { useHomepageContent } from "@/hooks/useHomepageContent";

interface Business {
  id: string; slug: string; name: string; tagline?: string | null;
  logo_url?: string | null; rating?: number | null; review_count?: number | null;
  geo_score?: number | null; is_verified?: boolean | null;
  location?: string | null; services?: string[] | null; category?: string | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot, Sparkles, MessageSquare, BarChart3, Globe2, ShieldCheck,
  Search, Star, Zap, Award, TrendingUp, LayoutGrid, ArrowRight,
};

// ─── Trustpilot-style trust row (FundedNext pattern) ─────────────────────────
function TrustRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-7 animate-fade-in">
      {/* Trustpilot-style badge */}
      <a
        href="https://trustpilot.com"
        target="_blank"
        rel="noopener noreferrer"
        className="trust-badge group hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < 4 ? "fill-green-400 text-green-400" : "fill-green-400/60 text-green-400/60"}`}
            />
          ))}
        </div>
        <span className="font-bold text-foreground">4.5</span>
        <span className="text-muted-foreground text-xs">Trustpilot · 5k+ reviews</span>
      </a>

      {/* Community badge */}
      <div className="trust-badge">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-semibold text-foreground">Loved by 10k+</span>
        <span className="text-muted-foreground text-xs">engineers</span>
      </div>
    </div>
  );
}

// ─── Inline hero stats row (FundedNext: numbers + labels side by side) ────────
function HeroStats() {
  const stats = [
    { value: 500, suffix: "+", label: "Verified Businesses" },
    { value: 50,  suffix: "K+", label: "Monthly Users" },
    { value: 98,  suffix: "%", label: "Satisfaction" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 mt-10 animate-slide-up">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-6">
          <div className="hero-stat">
            <div className="hero-stat-value gradient-text">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
          {i < stats.length - 1 && (
            <div className="w-px h-10 bg-border/60" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Hero Section (FundedNext: large 2-line headline, trust row, stats, CTAs) ──
export function HeroSection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  return (
    <section className="relative overflow-hidden -mt-16 pt-40 pb-28">
      {/* Background layers */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 hero-grid-overlay opacity-20 pointer-events-none" aria-hidden />
      <div className="orb orb-1 w-[600px] h-[600px] -top-48 -left-32 bg-primary/20" aria-hidden />
      <div className="orb orb-2 w-[700px] h-[700px] top-10 -right-48 bg-primary-glow/12" aria-hidden />
      <div className="orb orb-3 w-[400px] h-[400px] bottom-0 left-1/2 -translate-x-1/2 bg-primary/10" aria-hidden />

      <div className="container-tight relative">
        <div className="max-w-4xl mx-auto text-center">

          {/* FundedNext: small badge above headline */}
          <div className="badge-pill mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
            {content.hero.badge}
          </div>

          {/* FundedNext: large 2-line bold headline */}
          <h1 className="display-1 text-balance mb-0 animate-slide-up">
            {content.hero.title}
          </h1>
          <h1 className="display-1 text-balance mb-8 animate-slide-up">
            <span className="animated-gradient-text">{content.hero.highlightedTitle}</span>
          </h1>

          {/* FundedNext: inline trust pills with icons (one-time fee, 24/7, etc) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in">
            {[
              { label: "Rewards in 24h",     sub: "or get 100 pts extra" },
              { label: "One-time listing",    sub: "No recurring costs" },
              { label: "24/7 support",        sub: "in 4 languages" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center px-5 py-3 rounded-xl bg-card/60 border border-border/50 backdrop-blur text-center min-w-[120px]">
                <span className="text-sm font-bold text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{item.sub}</span>
              </div>
            ))}
          </div>

          {/* CTAs (FundedNext: solid green + ghost outline) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-slide-up">
            <Link
              to="/auth?mode=signup"
              className="btn-gradient shimmer-btn text-base px-8 py-3.5 rounded-xl font-bold"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="btn-ghost text-base px-8 py-3.5 rounded-xl font-semibold"
            >
              How It Works
            </Link>
          </div>

          {/* AI search */}
          <div className="max-w-2xl mx-auto mb-6 animate-fade-in">
            <AskAiHero />
          </div>

          {/* Trust row with badges (Trustpilot + community) */}
          <TrustRow />

          {/* Inline hero stats */}
          <HeroStats />
        </div>
      </div>
    </section>
  );
}

// ─── Trusted companies marquee ────────────────────────────────────────────────
export function TrustedSection() {
  return (
    <section className="container-tight pb-6">
      <div className="text-center mb-5">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-bold">
          Trusted by top tech companies
        </span>
      </div>
      <TrustMarquee />
    </section>
  );
}

// ─── Stats ribbon + Recognition Marquee (FundedNext scrolling award strip) ────
const awardsData = [
  { label: "Bangladesh #1 Tech Directory", icon: "🏆" },
  { label: "AI-Powered GEO",              icon: "🤖" },
  { label: "GEO Certified 2026",          icon: "✅" },
  { label: "Top Rated Platform",          icon: "⭐" },
  { label: "500+ Verified Listings",      icon: "🔒" },
  { label: "50K+ Monthly Users",          icon: "🚀" },
  { label: "Best Tech Directory 2026",    icon: "🥇" },
  { label: "Community Choice Award",      icon: "🎖️" },
];

// Horizontal stats counter row (FundedNext: $306M+, 40 hours, 550%)
function StatsCounterRow() {
  const stats = [
    { value: 500,  suffix: "+",   label: "Total Listings",       sublabel: "Verified businesses" },
    { value: 24,   suffix: "h",   label: "Avg. Processing Time", sublabel: "Fast turnaround" },
    { value: 98,   suffix: "%",   label: "Satisfaction Score",   sublabel: "Customer rating" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 py-8 border-y border-border/40">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-10 md:gap-16">
          <div className="text-center">
            <div className="font-display font-black text-3xl md:text-4xl text-foreground">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm font-semibold text-foreground/80 mt-0.5">{s.label}</div>
          </div>
          {i < stats.length - 1 && <div className="hidden md:block w-px h-12 bg-border/50" />}
        </div>
      ))}
    </div>
  );
}

export function StatsRibbon() {
  return (
    <section className="container-tight py-0">
      <StatsCounterRow />
    </section>
  );
}

// ─── "Recognized globally" section — award marquee (FundedNext pattern) ───────
export function RecognitionSection() {
  return (
    <section className="py-16 border-y border-border/30 bg-card/20">
      <div className="container-tight mb-8 text-center">
        <h2 className="display-3 mb-2">Recognized globally</h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          From winning awards to 100+ global partnerships, engineers and tech professionals
          choose engineersTech daily. One community. Growing every day.
        </p>
      </div>

      {/* Scrolling award strip (FundedNext marquee) */}
      <div className="overflow-hidden">
        <div className="py-3 relative">
          <div className="flex gap-3 whitespace-nowrap marquee-track">
            {[...awardsData, ...awardsData].map((a, i) => (
              <div key={i} className="award-strip shrink-0 cursor-default">
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row below marquee (FundedNext repeats stats under recognition) */}
      <div className="container-tight mt-8">
        <StatsCounterRow />
      </div>
    </section>
  );
}

// ─── AI Discovery feature section ────────────────────────────────────────────
export function AiDiscoverySection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  return (
    <section className="container-tight py-24">
      <div className="max-w-2xl mb-14">
        <div className="section-eyebrow mb-4">
          <Sparkles className="w-3.5 h-3.5" /> AI Discovery
        </div>
        <h2 className="display-2 mb-4">
          Built for the way{" "}
          <span className="gradient-text">people search now.</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          85% of B2B buyers now start research with an LLM. Generative Engine Optimization (GEO)
          is the discipline of being the answer — not just a link. engineersTech structures your
          data so AI cites your business first.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.aiFeatures.map(({ icon, title, desc }, i) => {
          const Icon = iconMap[icon] || Bot;
          return (
            <Reveal key={title} delay={i * 60} className="glass-card card-lift p-6 group hover:border-primary/40">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-5 h-5 text-primary-light" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
