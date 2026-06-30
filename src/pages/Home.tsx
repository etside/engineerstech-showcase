import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowRight, Sparkles, Bot, Search, Star, ShieldCheck, Zap, BarChart3, Globe2, MessageSquare, Award, TrendingUp, LayoutGrid } from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import TrustMarquee from "@/components/TrustMarquee";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import AskAiHero from "@/components/AskAiHero";
import { supabase } from "@/integrations/supabase/client";
import { useHomepageContent } from "@/hooks/useHomepageContent";

interface Business {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  logo_url?: string | null;
  rating?: number | null;
  review_count?: number | null;
  geo_score?: number | null;
  is_verified?: boolean | null;
  location?: string | null;
  services?: string[] | null;
  category?: string | null;
}

const defaultFeatured: Business[] = [];

function toPascal(s: string) {
  return s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot, Sparkles, MessageSquare, BarChart3, Globe2, ShieldCheck, Search, Star, Zap, Award, TrendingUp, LayoutGrid, ArrowRight,
};

export default function Home() {
  const { content } = useHomepageContent();
  const [featured, setFeatured] = useState<Business[]>([]);
  const [cats, setCats] = useState<{ slug: string; name: string; icon: string | null }[]>([]);

  useEffect(() => {
    supabase.from("categories").select("slug,name,icon").order("name").limit(12).then(({ data }) => {
      if (data) setCats(data as never);
    });
    supabase
      .from("businesses_public" as any)
      .select("id,slug,name,tagline,logo_url,rating,review_count,geo_score,is_verified,location,services,category")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("geo_score", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setFeatured(data as unknown as Business[]);
      });
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "geoListed",
    url: "https://geolisted.app",
    description: "Next-generation business listing and AI discovery platform optimized for Generative Engine Optimization (GEO).",
    sameAs: ["https://twitter.com/geolisted", "https://linkedin.com/company/geolisted"],
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />

      {/* HERO */}
      <section className="relative overflow-hidden -mt-20 pt-32 pb-24">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),_transparent_60%)]" />
        <div className="absolute inset-0 hero-grid-overlay opacity-40 pointer-events-none" aria-hidden />
        <div className="orb orb-1 w-[420px] h-[420px] -top-32 -left-20 bg-primary/40" aria-hidden />
        <div className="orb orb-2 w-[520px] h-[520px] top-20 -right-32 bg-primary-glow/30" aria-hidden />
        <div className="container-tight relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="badge-pill mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
              {content.hero.badge}
            </div>
            <h1 className="display-1 text-balance mb-6 animate-slide-up">
              {content.hero.title}{" "}
              <span className="animated-gradient-text">{content.hero.highlightedTitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up">
              {content.hero.subtitle}
            </p>
            <div className="mb-8 animate-slide-up">
              <AskAiHero />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
              <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-base">
                {content.hero.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/listings" className="btn-ghost text-base">
                <Search className="w-4 h-4" /> {content.hero.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {content.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="glass-card card-lift p-6 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="container-tight">
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Trusted by ambitious teams</span>
        </div>
        <TrustMarquee />
      </section>

      {/* AI DISCOVERY */}
      <section className="container-tight py-24">
        <div className="max-w-2xl mb-14">
          <div className="section-eyebrow mb-4"><Sparkles className="w-3.5 h-3.5" /> AI Discovery</div>
          <h2 className="display-2 mb-4">Built for the way <span className="gradient-text">people search now.</span></h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            85% of B2B buyers now start research with an LLM. Generative Engine Optimization
            (GEO) is the discipline of being the answer — not just a link.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.aiFeatures.map(({ icon, title, desc }) => {
            const Icon = iconMap[icon] || Bot;
            return (
              <Reveal key={title} className="glass-card card-lift p-6 group hover:border-primary/50">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 ease-spring">
                  <Icon className="w-5 h-5 text-primary-light" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="container-tight py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-eyebrow mb-4"><Award className="w-3.5 h-3.5" /> {content.featuredSection.eyebrow}</div>
            <h2 className="display-2"><span className="gradient-text">{content.featuredSection.title}</span> {content.featuredSection.highlightedTitle}</h2>
          </div>
          <Link to="/listings" className="btn-ghost text-sm hidden md:inline-flex">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <BusinessCard business={b} />
            </Reveal>
          ))}
          {!featured.length && <div className="glass-card p-8 text-center text-muted-foreground">Loading featured vendors…</div>}
        </div>
      </section>

      {/* CATEGORIES */}
      {cats.length > 0 && (
        <section className="container-tight py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-eyebrow mb-4"><LayoutGrid className="w-3.5 h-3.5" /> Browse by category</div>
              <h2 className="display-2">Find the right <span className="gradient-text">expertise.</span></h2>
            </div>
            <Link to="/categories" className="btn-ghost text-sm hidden md:inline-flex">
              All categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cats.map((c, i) => {
              const Icon = (Icons as Record<string, unknown>)[toPascal(c.icon || "folder")] as React.ComponentType<{ className?: string }> | undefined;
              return (
                <Reveal key={c.slug} delay={i * 40}>
                  <Link to={`/listings?category=${c.slug}`} className="glass-card card-lift p-4 flex items-center gap-3 hover:border-primary/50 group">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-500 ease-spring">
                      {Icon ? <Icon className="w-4 h-4 text-primary-light" /> : <Icons.Folder className="w-4 h-4 text-primary-light" />}
                    </div>
                    <span className="text-sm font-medium truncate">{c.name}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="container-tight py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-eyebrow mb-4 justify-center"><Zap className="w-3.5 h-3.5" /> How it works</div>
          <h2 className="display-2">From listing to <span className="gradient-text">LLM citation</span> in 24 hours.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {content.howItWorks.map((s, i) => (
            <Reveal key={s.number} delay={i * 120} className="glass-card card-lift p-7 relative overflow-hidden">
              <div className="absolute -top-4 -right-2 font-display text-7xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">{s.number}</div>
              <h3 className="font-display font-semibold text-lg mb-2 relative">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEW SYSTEM */}
      <section className="container-tight py-24">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="section-eyebrow mb-4"><Star className="w-3.5 h-3.5" /> {content.reviewSection.eyebrow}</div>
              <h2 className="display-2 mb-4">{content.reviewSection.title}<br /><span className="gradient-text">{content.reviewSection.highlightedTitle}</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {content.reviewSection.subtitle}
              </p>
              <div className="flex gap-2">
                <Link to="/listings" className="btn-gradient text-sm">Read reviews</Link>
                <Link to="/auth" className="btn-ghost text-sm">Leave a review</Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { tag: "Pro · 142 mentions", text: "Exceptional engineering quality, ships on time.", c: "emerald" },
                { tag: "Pro · 98 mentions", text: "Deep AI/LLM expertise across regulated domains.", c: "emerald" },
                { tag: "Con · 12 mentions", text: "Higher rate than offshore alternatives.", c: "amber" },
              ].map((r) => (
                <div key={r.text} className="glass-card p-4 flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${r.c === "emerald" ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <div>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider ${r.c === "emerald" ? "text-emerald-400" : "text-amber-400"}`}>{r.tag}</div>
                    <p className="text-sm text-foreground/90 mt-1">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-tight py-24">
        <Reveal as="div" className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_70%)]" />
          <div className="orb orb-1 w-[300px] h-[300px] -top-20 -left-10 bg-white/20" aria-hidden />
          <div className="orb orb-2 w-[360px] h-[360px] -bottom-20 -right-10 bg-white/15" aria-hidden />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium mb-6 backdrop-blur">
              <TrendingUp className="w-3.5 h-3.5" /> {content.ctaSection.badge}
            </div>
            <h2 className="display-2 text-white mb-4 text-balance">{content.ctaSection.title}</h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto mb-8">
              {content.ctaSection.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="shimmer-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-white text-primary hover:bg-white/90 transition-all">
                {content.ctaSection.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-white/30 text-white hover:bg-white/10 transition-all">
                {content.ctaSection.ctaSecondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
