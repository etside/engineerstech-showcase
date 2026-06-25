import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowRight, Sparkles, Bot, Search, Star, ShieldCheck, Zap, BarChart3, Globe2, MessageSquare, Award, TrendingUp, LayoutGrid } from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import TrustMarquee from "@/components/TrustMarquee";
import JsonLd from "@/components/JsonLd";
import { businesses } from "@/data/mockBusinesses";
import { supabase } from "@/integrations/supabase/client";

function toPascal(s: string) {
  return s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

const stats = [
  { value: "12k+", label: "Verified Businesses" },
  { value: "180k", label: "Trusted Reviews" },
  { value: "94%", label: "AI Discovery Rate" },
  { value: "32M", label: "LLM API Calls / mo" },
];

const aiFeatures = [
  { Icon: Bot, title: "AI Recommendation Engine", desc: "Conversational discovery — describe a need, get matched to vetted vendors." },
  { Icon: Sparkles, title: "GEO-Optimized Listings", desc: "Every profile ships JSON-LD, so LLMs cite you in their answers." },
  { Icon: MessageSquare, title: "Review Sentiment AI", desc: "Auto-summarized pros & cons from hundreds of reviews in seconds." },
  { Icon: BarChart3, title: "LLM Visibility Analytics", desc: "Track how often ChatGPT, Claude, and Qwen mention your brand." },
  { Icon: Globe2, title: "Public LLM Data API", desc: "Structured JSON-LD endpoint ready for ingestion by any LLM crawler." },
  { Icon: ShieldCheck, title: "Verified & Moderated", desc: "Human + AI moderation keeps the marketplace high-trust." },
];

export default function Home() {
  const featured = businesses.filter((b) => b.is_featured).slice(0, 3);
  const [cats, setCats] = useState<{ slug: string; name: string; icon: string | null }[]>([]);

  useEffect(() => {
    supabase.from("categories").select("slug,name,icon").order("name").limit(12).then(({ data }) => {
      if (data) setCats(data as never);
    });
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "geoListed",
    url: "https://geolisted.example.com",
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
        <div className="container-tight relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="badge-pill mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse" />
              Indexed by ChatGPT · Claude · DeepSeek · Qwen
            </div>
            <h1 className="display-1 text-balance mb-6 animate-slide-up">
              Get discovered by{" "}
              <span className="gradient-text">AI, not just search.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up">
              The business directory built for the LLM era. List your services once —
              we structure your data for humans <em>and</em> the AIs they ask for recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
              <Link to="/auth?mode=signup" className="btn-gradient text-base">
                List your business <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/listings" className="btn-ghost text-base">
                <Search className="w-4 h-4" /> Browse directory
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="glass-card p-6 text-center">
                <div className="font-display text-3xl md:text-4xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</div>
              </div>
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
          {aiFeatures.map(({ Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 group hover:border-primary/50 transition-all duration-500 ease-spring">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary-light" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="container-tight py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="section-eyebrow mb-4"><Award className="w-3.5 h-3.5" /> Featured Vendors</div>
            <h2 className="display-2"><span className="gradient-text">AI-ready</span> businesses</h2>
          </div>
          <Link to="/listings" className="btn-ghost text-sm hidden md:inline-flex">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((b) => <BusinessCard key={b.id} business={b} />)}
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
            {cats.map((c) => {
              const Icon = (Icons as Record<string, unknown>)[toPascal(c.icon || "folder")] as React.ComponentType<{ className?: string }> | undefined;
              return (
                <Link key={c.slug} to={`/listings?category=${c.slug}`} className="glass-card p-4 flex items-center gap-3 hover:border-primary/50 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20">
                    {Icon ? <Icon className="w-4 h-4 text-primary-light" /> : <Icons.Folder className="w-4 h-4 text-primary-light" />}
                  </div>
                  <span className="text-sm font-medium truncate">{c.name}</span>
                </Link>
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
          {[
            { n: "01", t: "Claim your listing", d: "Create a structured profile with services, pricing, portfolio, and case studies." },
            { n: "02", t: "We optimize for LLMs", d: "Our pipeline emits JSON-LD, schema.org, and AI-readable summaries to public endpoints." },
            { n: "03", t: "Get cited by AI", d: "ChatGPT, Claude, DeepSeek, and Qwen surface your brand in relevant recommendation queries." },
          ].map((s) => (
            <div key={s.n} className="glass-card p-7 relative overflow-hidden">
              <div className="absolute -top-4 -right-2 font-display text-7xl font-bold text-primary/10">{s.n}</div>
              <h3 className="font-display font-semibold text-lg mb-2 relative">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEW SYSTEM */}
      <section className="container-tight py-24">
        <div className="glass-card p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 hero-glow opacity-50 pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="section-eyebrow mb-4"><Star className="w-3.5 h-3.5" /> Reviews that AIs trust</div>
              <h2 className="display-2 mb-4">Verified reviews,<br /><span className="gradient-text">AI-summarized.</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Every review is moderated, sentiment-analyzed, and distilled into pros/cons
                summaries that both humans and LLMs can parse instantly.
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
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_70%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium mb-6 backdrop-blur">
              <TrendingUp className="w-3.5 h-3.5" /> Limited founding member pricing
            </div>
            <h2 className="display-2 text-white mb-4 text-balance">Be the answer when AI is asked.</h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto mb-8">
              Join the directory built for the post-Google era. Get cited, get hired.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?mode=signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-white text-primary hover:bg-white/90 transition-all">
                Get listed free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-white/30 text-white hover:bg-white/10 transition-all">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
