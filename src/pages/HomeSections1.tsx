import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, Bot, Search, Star, ShieldCheck, Zap,
  BarChart3, Globe2, MessageSquare, Award, TrendingUp, LayoutGrid,
  Users, Clock, ThumbsUp, CircleCheckBig, Rocket, CheckCircle,
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

// ─── Floating Social Proof Badges (glassmorphism pills) ─────────────────────
function FloatingBadges() {
  const badges = [
    { icon: Star,    color: "text-amber-400",   text: "20,170 users joined engineersTech in the last 7 days" },
    { icon: CheckCircle, color: "text-emerald-400", text: "217+ Countries and locations covered" },
    { icon: Rocket,  color: "text-primary-light", text: "28.7B Keywords filtered" },
  ];

  return (
    <div className="flex flex-col gap-3 items-end mt-8 animate-fade-in">
      {badges.map((b, i) => (
        <div
          key={i}
          className="stat-pill"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <b.icon className={`w-4 h-4 ${b.color} shrink-0`} />
          <span className="text-white/90">{b.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Hero Planetary Visual (CSS-based futuristic graphic) ───────────────────
function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      {/* Deep space background glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 via-primary-glow/10 to-transparent blur-3xl" />

      {/* Grid/radar ring */}
      <div className="absolute inset-[15%] rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-[25%] rounded-full border border-primary-glow/15 animate-[spin_30s_linear_infinite_reverse]" />
      <div className="absolute inset-[35%] rounded-full border border-primary/10" />

      {/* Central emitter */}
      <div className="absolute inset-[40%] rounded-full bg-gradient-to-br from-primary/30 to-primary-glow/20 backdrop-blur-xl border border-primary/30 shadow-[0_0_60px_rgba(217,70,239,0.3)]" />

      {/* Planetary horizon line */}
      <div className="absolute bottom-[20%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute bottom-[18%] left-[15%] right-[15%] h-12 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-xl" />

      {/* Floating data points */}
      <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full bg-primary animate-float" />
      <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 rounded-full bg-primary-glow animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[30%] left-[12%] w-1 h-1 rounded-full bg-primary-light animate-float" style={{ animationDelay: "2s" }} />

      {/* Center icon */}
      <div className="relative z-10 w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-2xl shadow-primary/40">
        <Globe2 className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}

// ─── Hero Section (Two-Column Split) ────────────────────────────────────────
export function HeroSection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  return (
    <section className="relative overflow-hidden -mt-16 pt-28 md:pt-40 pb-20 md:pb-28">
      {/* Background layers */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 hero-grid-overlay opacity-10 pointer-events-none" aria-hidden />
      <div className="orb orb-1 w-[600px] h-[600px] -top-48 -left-32 bg-primary/15" aria-hidden />
      <div className="orb orb-2 w-[700px] h-[700px] top-10 -right-48 bg-primary-glow/10" aria-hidden />
      <div className="orb orb-3 w-[400px] h-[400px] bottom-0 left-1/2 -translate-x-1/2 bg-primary/8" aria-hidden />

      <div className="container-tight relative">
        {/* Two-column layout on desktop */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Typography & Action */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="badge-pill mb-8 animate-fade-in inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
              {content.hero.badge}
            </div>

            {/* Main Headline */}
            <h1 className="display-1 text-balance mb-6 animate-slide-up">
              The multivendor marketplace <span className="gradient-text">built for tech</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in">
              Buy and sell tech products, SaaS tools, and professional services — all in one marketplace.
              Hundreds of verified vendors, thousands of products, one trusted platform.
            </p>

            {/* Primary CTA — Pill button with purple arrow */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-10 animate-slide-up">
              <Link to="/auth?mode=signup" className="pill-cta text-base pl-7 pr-2 py-2">
                Start For Free
                <span className="pill-cta-arrow w-8 h-8">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </Link>
              <Link
                to="/how-it-works"
                className="btn-ghost text-base px-7 py-3 rounded-xl font-semibold"
              >
                How It Works
              </Link>
            </div>

            {/* AI search */}
            <div className="max-w-xl mx-auto lg:mx-0 mb-6 animate-fade-in">
              <AskAiHero />
            </div>
          </div>

          {/* Right Column: Visual & Stats */}
          <div className="relative flex flex-col items-center lg:items-end">
            {/* Hero Visual */}
            <HeroVisual />

            {/* Floating Social Proof Badges */}
            <FloatingBadges />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Trusted companies marquee (corporate logos) ────────────────────────────
export function TrustedSection() {
  return (
    <section className="container-tight pb-8">
      <div className="text-center mb-5">
        <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-bold">
          Trusted by leading companies worldwide
        </span>
      </div>
      <TrustMarquee />
    </section>
  );
}

// ─── Stats ribbon + Recognition Marquee ──────────────────────────────────────
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

// ─── "Recognized globally" section ──────────────────────────────────────────
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
