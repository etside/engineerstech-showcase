import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ArrowRight, Sparkles, Bot, Search, Star, ShieldCheck, Zap,
  BarChart3, Globe2, MessageSquare, Award, TrendingUp, LayoutGrid,
  Users, Clock, CheckCircle, HeartHandshake, Youtube, MessagesSquare,
  BadgePercent, Trophy, Percent, ThumbsUp, CircleCheckBig,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import TrustMarquee from "@/components/TrustMarquee";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import AskAiHero from "@/components/AskAiHero";
import { supabase } from "@/integrations/supabase/client";
import { useHomepageContent } from "@/hooks/useHomepageContent";

interface Business {
  id: string; slug: string; name: string; tagline?: string | null;
  logo_url?: string | null; rating?: number | null; review_count?: number | null;
  geo_score?: number | null; is_verified?: boolean | null;
  location?: string | null; services?: string[] | null; category?: string | null;
}

function toPascal(s: string) {
  return s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot, Sparkles, MessageSquare, BarChart3, Globe2, ShieldCheck,
  Search, Star, Zap, Award, TrendingUp, LayoutGrid, ArrowRight,
};

// ─── Sub-sections ──────────────────────────────────────────────────────────────

const promoSlides = [
  {
    icon: BadgePercent,
    title: "Deposit Bonus",
    desc: "Get 20% extra credit on your first listing. Limited time offer.",
    gradient: "from-emerald-600/20 to-primary/20",
    borderColor: "border-emerald-500/30",
  },
  {
    icon: Percent,
    title: "25% Off Premium",
    desc: "Upgrade to premium placement and save 25% this quarter.",
    gradient: "from-blue-600/20 to-primary/20",
    borderColor: "border-blue-500/30",
  },
  {
    icon: Trophy,
    title: "95% Reward Share",
    desc: "Top-rated vendors earn 95% of referral rewards. Join now.",
    gradient: "from-amber-600/20 to-primary/20",
    borderColor: "border-amber-500/30",
  },
];

function PromoCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promoSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = promoSlides[current];
  const Icon = slide.icon;

  return (
    <div className={`glass-card p-4 flex items-center gap-4 mb-10 max-w-2xl mx-auto animate-fade-in bg-gradient-to-r ${slide.gradient} ${slide.borderColor}`}>
      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm text-foreground">{slide.title}</div>
        <div className="text-xs text-muted-foreground">{slide.desc}</div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)}
          className="w-7 h-7 rounded-full border border-border bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          aria-label="Previous promotion"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % promoSlides.length)}
          className="w-7 h-7 rounded-full border border-border bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          aria-label="Next promotion"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function TrustPills() {
  const pills = [
    { icon: Star, label: "4.8 Trustpilot", color: "text-emerald-400" },
    { icon: ThumbsUp, label: "4.9 PropFirmMatch", color: "text-blue-400" },
    { icon: CircleCheckBig, label: "2,400+ Reviews", color: "text-amber-400" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6 animate-slide-up">
      {pills.map((p) => (
        <div key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-muted/20 text-xs font-semibold text-muted-foreground">
          <p.icon className={`w-3.5 h-3.5 ${p.color}`} />
          {p.label}
        </div>
      ))}
    </div>
  );
}

function HeroSection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  return (
    <section className="relative overflow-hidden -mt-20 pt-44 pb-32">
      {/* Backgrounds */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 hero-grid-overlay opacity-30 pointer-events-none" aria-hidden />
      <div className="orb orb-1 w-[500px] h-[500px] -top-40 -left-24 bg-primary/30" aria-hidden />
      <div className="orb orb-2 w-[600px] h-[600px] top-20 -right-40 bg-primary-glow/20" aria-hidden />

      <div className="container-tight relative">
        {/* Promo Carousel */}
        <PromoCarousel />

        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="badge-pill mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
            {content.hero.badge}
          </div>

          {/* Headline */}
          <h1 className="display-1 text-balance mb-6 animate-slide-up">
            {content.hero.title}{" "}
            <span className="animated-gradient-text">{content.hero.highlightedTitle}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up">
            {content.hero.subtitle}
          </p>

          {/* AI search bar */}
          <div className="mb-10 animate-slide-up">
            <AskAiHero />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
            <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-base px-7 py-3.5">
              {content.hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/how-it-works" className="btn-ghost text-base px-7 py-3.5">
              How It Works
            </Link>
          </div>

          {/* Trust Pills */}
          <TrustPills />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
          {content.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="stat-card card-lift">
              <div className="font-display text-3xl md:text-4xl font-extrabold gradient-text mb-1">
                <AnimatedCounter value={s.value} />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustedSection() {
  return (
    <section className="container-tight pb-4">
      <div className="text-center mb-5">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-bold">
          Trusted by top tech companies in Bangladesh
        </span>
      </div>
      <TrustMarquee />
    </section>
  );
}

function AiDiscoverySection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
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
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 ease-spring">
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

function StatsRibbon() {
  const stats = [
    { icon: ShieldCheck, value: 500, suffix: "+", label: "Verified Businesses", desc: "Manually reviewed" },
    { icon: Users, value: 50, suffix: "K+", label: "Monthly Users", desc: "Growing every day" },
    { icon: ThumbsUp, value: 98, suffix: "%", label: "Satisfaction", desc: "Customer rating" },
    { icon: Clock, value: 24, suffix: "h", label: "Avg. Processing", desc: "Fast turnaround" },
  ];

  return (
    <section className="container-tight py-12">
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="glass-card card-lift p-6 text-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 ease-spring">
                  <s.icon className="w-5 h-5 text-primary-light" />
                </div>
                <div className="font-display text-3xl md:text-4xl font-extrabold gradient-text mb-1">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-0.5">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export { HeroSection, TrustedSection, AiDiscoverySection, StatsRibbon };
