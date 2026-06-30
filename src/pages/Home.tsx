import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Clock, HeartHandshake, ShieldCheck } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import { supabase } from "@/integrations/supabase/client";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { HeroSection, TrustedSection, AiDiscoverySection, StatsRibbon } from "./HomeSections1";
import { FeaturedSection, CategoriesSection, HowItWorksSection, CommunitySection } from "./HomeSections2";

interface Business {
  id: string; slug: string; name: string; tagline?: string | null;
  logo_url?: string | null; rating?: number | null; review_count?: number | null;
  geo_score?: number | null; is_verified?: boolean | null;
  location?: string | null; services?: string[] | null; category?: string | null;
}

// ─── Support stats section ──────────────────────────────────────────────────
function SupportSection() {
  const items = [
    { icon: HeartHandshake, stat: "98%", label: "Customer satisfaction score", sub: "Verified by 2,400+ reviews" },
    { icon: Clock, stat: "<25s", label: "Avg. first response time", sub: "Our team replies fast, always" },
    { icon: ShieldCheck, stat: "500+", label: "Verified tech businesses", sub: "Manually reviewed & approved" },
  ];
  return (
    <section className="container-tight py-24">
      <div className="glass-card p-10 md:p-14 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-40 pointer-events-none" />
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-eyebrow mb-4">
              <HeartHandshake className="w-3.5 h-3.5" /> Support that never clocks out
            </div>
            <h2 className="display-2 mb-4">
              We're here<br />
              <span className="gradient-text">24 hours a day.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our dedicated support team helps businesses get listed, verified, and discovered.
              Whether you're a new vendor or an established firm, we're one message away.
            </p>
            <div className="flex gap-3">
              <Link to="/contact" className="btn-gradient text-sm">Get Support</Link>
              <Link to="/faq" className="btn-ghost text-sm">Read FAQs</Link>
            </div>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-5 glass-card p-5">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl gradient-text">{item.stat}</div>
                  <div className="font-semibold text-sm text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Reviews section ─────────────────────────────────────────────────────────
function ReviewsSection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  return (
    <section className="container-tight py-24">
      <div className="glass-card p-10 md:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--primary)/0.08),_transparent_60%)] pointer-events-none" />
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="section-eyebrow mb-4"><Star className="w-3.5 h-3.5" /> {content.reviewSection.eyebrow}</div>
            <h2 className="display-2 mb-4">
              {content.reviewSection.title}<br />
              <span className="gradient-text">{content.reviewSection.highlightedTitle}</span>
            </h2>
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
              { tag: "Pro · 142 mentions", text: "Exceptional engineering quality, ships on time every sprint.", c: "emerald" },
              { tag: "Pro · 98 mentions",  text: "Deep AI/LLM expertise across regulated enterprise domains.", c: "emerald" },
              { tag: "Con · 12 mentions",  text: "Higher rate than offshore-only alternatives.", c: "amber" },
            ].map((r) => (
              <div key={r.text} className="glass-card p-4 flex items-start gap-3">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${r.c === "emerald" ? "bg-emerald-400" : "bg-amber-400"}`} />
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${r.c === "emerald" ? "text-emerald-400" : "text-amber-400"}`}>
                    {r.tag}
                  </div>
                  <p className="text-sm text-foreground/90 mt-1">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA section ────────────────────────────────────────────────────────
function CtaSection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  const trustStats = [
    { value: 500, suffix: "+", label: "Verified" },
    { value: 98, suffix: "%", label: "Satisfaction" },
    { value: 50, suffix: "K+", label: "Users" },
  ];

  return (
    <section className="container-tight py-24">
      <Reveal
        as="div"
        className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 40%, hsl(270 60% 45%) 100%)",
        }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 cta-grid-pattern pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_65%)]" />
        <div className="orb orb-1 w-[350px] h-[350px] -top-24 -left-12 bg-white/15" aria-hidden />
        <div className="orb orb-2 w-[400px] h-[400px] -bottom-24 -right-12 bg-white/10" aria-hidden />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold mb-6 backdrop-blur">
            <TrendingUp className="w-3.5 h-3.5" /> {content.ctaSection.badge}
          </div>
          <h2 className="display-2 text-white mb-4 text-balance">{content.ctaSection.title}</h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">{content.ctaSection.subtitle}</p>

          {/* Trust stats row */}
          <div className="flex items-center justify-center gap-8 mb-10">
            {trustStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-extrabold text-white">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth?mode=signup"
              className="shimmer-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-primary hover:bg-white/92 transition-all shadow-xl shadow-black/20"
            >
              {content.ctaSection.ctaPrimary} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              {content.ctaSection.ctaSecondary}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── Main Home component ──────────────────────────────────────────────────────
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
    name: "engineersTech",
    url: "https://engineerstechbd.com",
    description: "AI-powered business directory for engineers & tech professionals. GEO-optimized for LLM discovery.",
    sameAs: ["https://twitter.com/engineerstech", "https://linkedin.com/company/engineerstech"],
  };

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <HeroSection content={content} />
      <TrustedSection />
      <StatsRibbon />
      <AiDiscoverySection content={content} />
      <FeaturedSection content={content} featured={featured} />
      <CategoriesSection cats={cats} />
      <HowItWorksSection content={content} />
      <CommunitySection />
      <SupportSection />
      <ReviewsSection content={content} />
      <CtaSection content={content} />
    </>
  );
}
