import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ArrowRight, Award, LayoutGrid, Zap, Star,
  Users, Youtube, MessagesSquare, CheckCircle,
} from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
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

// ─── Featured / Plans section (FundedNext: "Choose your next challenge") ──────
export function FeaturedSection({
  content,
  featured,
}: {
  content: ReturnType<typeof useHomepageContent>["content"];
  featured: Business[];
}) {
  // FundedNext-style stats above the cards
  const planStats = [
    { value: 316,  suffix: "M+",   label: "Total Listings" },
    { value: 40,   suffix: "hrs",  label: "Avg. processing time" },
    { value: 450,  suffix: "K+",   label: "engineersTech Accounts" },
    { value: 98,   suffix: "%",    label: "Satisfaction" },
  ];

  return (
    <section className="py-20 bg-card/20 border-y border-border/30">
      <div className="container-tight">
        {/* Section header (FundedNext: left-aligned headline + right CTA) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <div>
            <div className="section-eyebrow mb-4">
              <Award className="w-3.5 h-3.5" /> {content.featuredSection.eyebrow}
            </div>
            <h2 className="display-2">
              Choose your <span className="gradient-text">next discovery</span>
            </h2>
          </div>
          <Link to="/listings" className="btn-ghost text-sm shrink-0 self-start md:self-auto">
            See all listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* FundedNext: stats row above cards */}
        <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-10 text-sm">
          {planStats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-lg text-foreground">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-muted-foreground text-xs">{s.label}</span>
            </div>
          ))}
          <Link to="/listings" className="btn-outline-green text-xs py-1.5 px-4 ml-auto hidden md:inline-flex">
            Discover Listings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Business cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <BusinessCard business={b} />
            </Reveal>
          ))}
          {!featured.length && (
            <div className="glass-card p-8 text-center text-muted-foreground col-span-3">
              Loading featured vendors…
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Categories section ───────────────────────────────────────────────────────
export function CategoriesSection({
  cats,
}: {
  cats: { slug: string; name: string; icon: string | null }[];
}) {
  if (!cats.length) return null;
  return (
    <section className="container-tight py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="section-eyebrow mb-4">
            <LayoutGrid className="w-3.5 h-3.5" /> Browse by category
          </div>
          <h2 className="display-2">
            Find the right <span className="gradient-text">expertise.</span>
          </h2>
        </div>
        <Link to="/categories" className="btn-ghost text-sm hidden md:inline-flex">
          All categories <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {cats.map((c, i) => {
          const Icon = (Icons as Record<string, unknown>)[toPascal(c.icon || "folder")] as
            | React.ComponentType<{ className?: string }>
            | undefined;
          return (
            <Reveal key={c.slug} delay={i * 40}>
              <Link
                to={`/listings?category=${c.slug}`}
                className="glass-card card-lift p-4 flex items-center gap-3 hover:border-primary/50 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-300 shrink-0">
                  {Icon ? (
                    <Icon className="w-4 h-4 text-primary-light" />
                  ) : (
                    <Icons.Folder className="w-4 h-4 text-primary-light" />
                  )}
                </div>
                <span className="text-sm font-semibold truncate">{c.name}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ─── How It Works section ─────────────────────────────────────────────────────
export function HowItWorksSection({
  content,
}: {
  content: ReturnType<typeof useHomepageContent>["content"];
}) {
  return (
    <section className="container-tight py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-eyebrow mb-4 justify-center">
          <Zap className="w-3.5 h-3.5" /> How it works
        </div>
        <h2 className="display-2">
          From listing to <span className="gradient-text">LLM citation</span> in 24 hours.
        </h2>
        <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
          Three steps is all it takes. No technical setup. No ongoing management. We handle the AI
          optimization automatically.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {content.howItWorks.map((s, i) => (
          <Reveal key={s.number} delay={i * 120} className="glass-card card-lift p-7 relative overflow-hidden group">
            <div className="absolute -top-4 -right-2 font-display text-8xl font-black text-primary/8 group-hover:text-primary/15 transition-colors select-none">
              {s.number}
            </div>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
              {i === 0 && <CheckCircle className="w-5 h-5 text-primary-foreground" />}
              {i === 1 && <Zap className="w-5 h-5 text-primary-foreground" />}
              {i === 2 && <Star className="w-5 h-5 text-primary-foreground" />}
            </div>
            <h3 className="font-display font-bold text-xl mb-2 relative">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed relative">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── Community section (FundedNext: "A community that adds value") ────────────
export function CommunitySection() {
  return (
    <section className="container-tight py-24">
      {/* Section header — matches FundedNext layout exactly */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-eyebrow mb-4 justify-center">
          <Users className="w-3.5 h-3.5" /> Community
        </div>
        <h2 className="display-2">
          A community that <span className="gradient-text">adds value</span>
        </h2>
        <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
          Join engineersTech members discussing markets, reviewing tech vendors, and learning from
          real engineering experience every day
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Discord card (FundedNext: image-style with community stats) */}
        <Reveal className="glass-card card-lift relative overflow-hidden group hover:border-[#5865F2]/40">
          {/* Background gradient overlay like FundedNext */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-transparent to-purple-900/10 pointer-events-none" />
          {/* Faux screenshot area (FundedNext shows a community screenshot) */}
          <div className="h-40 bg-gradient-to-br from-[#5865F2]/20 to-[#23272A]/60 flex items-center justify-center border-b border-border/40 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="grid grid-cols-3 gap-2 p-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-8 h-2 rounded bg-[#5865F2]/60" />
                ))}
              </div>
            </div>
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center">
              <MessagesSquare className="w-7 h-7 text-[#5865F2]" />
            </div>
          </div>

          <div className="p-7 relative">
            <h3 className="font-display font-bold text-xl mb-2">Discord community</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Real-time discussion with engineers worldwide. Ask questions, share ideas, and stay
              connected with the engineering community.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="font-display font-black text-xl text-foreground">
                  <AnimatedCounter value={5} suffix="K+" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Members</div>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div className="text-center">
                <div className="font-display font-black text-xl text-foreground">24/7</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Active</div>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div className="text-center">
                <div className="font-display font-black text-xl text-foreground">
                  <AnimatedCounter value={12} />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Channels</div>
              </div>
            </div>

            {/* FundedNext pattern: two server buttons */}
            <div className="flex gap-2">
              <a
                href="https://discord.gg/engineerstech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-4 flex-1 justify-center"
              >
                Main Server
              </a>
              <a
                href="https://discord.gg/engineerstech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-4 flex-1 justify-center"
              >
                Dev Server
              </a>
            </div>
          </div>
        </Reveal>

        {/* YouTube card */}
        <Reveal delay={80} className="glass-card card-lift relative overflow-hidden group hover:border-red-500/40">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/8 via-transparent to-red-900/6 pointer-events-none" />
          {/* Faux thumbnail area */}
          <div className="h-40 bg-gradient-to-br from-red-900/30 to-gray-900/60 flex items-center justify-center border-b border-border/40 relative overflow-hidden">
            <div className="absolute inset-0 flex items-end justify-start p-4 opacity-30">
              <div className="space-y-1.5">
                <div className="w-32 h-2 rounded bg-white/30" />
                <div className="w-20 h-1.5 rounded bg-white/20" />
              </div>
            </div>
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <Youtube className="w-7 h-7 text-red-500" />
            </div>
          </div>

          <div className="p-7 relative">
            <h3 className="font-display font-bold text-xl mb-2">YouTube community</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Subscribe to vendor spotlights, GEO tutorials, and real case studies. New content
              every week on the engineersTech YouTube channel.
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="font-display font-black text-xl text-foreground">
                  <AnimatedCounter value={2.1} suffix="K" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Subscribers</div>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div className="text-center">
                <div className="font-display font-black text-xl text-foreground">
                  <AnimatedCounter value={80} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Videos</div>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div className="text-center">
                <div className="font-display font-black text-xl text-foreground">Weekly</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Uploads</div>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="https://youtube.com/@engineerstech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-4 flex-1 justify-center"
              >
                Subscribe
              </a>
              <a
                href="https://youtube.com/@engineerstech"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs py-2 px-4 flex-1 justify-center"
              >
                Watch Now
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
