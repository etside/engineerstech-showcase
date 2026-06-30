import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import {
  ArrowRight, Award, LayoutGrid, Zap, Star,
  Users, Youtube, MessagesSquare, Clock, CheckCircle,
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

function FeaturedSection({
  content, featured,
}: {
  content: ReturnType<typeof useHomepageContent>["content"];
  featured: Business[];
}) {
  return (
    <section className="container-tight py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="section-eyebrow mb-4"><Award className="w-3.5 h-3.5" /> {content.featuredSection.eyebrow}</div>
          <h2 className="display-2">
            <span className="gradient-text">{content.featuredSection.title}</span>{" "}
            {content.featuredSection.highlightedTitle}
          </h2>
        </div>
        <Link to="/listings" className="btn-ghost text-sm hidden md:inline-flex">
          See all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((b, i) => (
          <Reveal key={b.id} delay={i * 80}><BusinessCard business={b} /></Reveal>
        ))}
        {!featured.length && (
          <div className="glass-card p-8 text-center text-muted-foreground col-span-3">
            Loading featured vendors…
          </div>
        )}
      </div>
    </section>
  );
}

function CategoriesSection({ cats }: { cats: { slug: string; name: string; icon: string | null }[] }) {
  if (!cats.length) return null;
  return (
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
              <Link
                to={`/listings?category=${c.slug}`}
                className="glass-card card-lift p-4 flex items-center gap-3 hover:border-primary/50 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-500 ease-spring shrink-0">
                  {Icon ? <Icon className="w-4 h-4 text-primary-light" /> : <Icons.Folder className="w-4 h-4 text-primary-light" />}
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

function HowItWorksSection({ content }: { content: ReturnType<typeof useHomepageContent>["content"] }) {
  return (
    <section className="container-tight py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-eyebrow mb-4 justify-center"><Zap className="w-3.5 h-3.5" /> How it works</div>
        <h2 className="display-2">
          From listing to <span className="gradient-text">LLM citation</span> in 24 hours.
        </h2>
        <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
          Three steps is all it takes. No technical setup. No ongoing management. We handle the AI optimization automatically.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {content.howItWorks.map((s, i) => (
          <Reveal key={s.number} delay={i * 120} className="glass-card card-lift p-7 relative overflow-hidden group">
            <div className="absolute -top-4 -right-2 font-display text-8xl font-black text-primary/8 group-hover:text-primary/15 transition-colors select-none">
              {s.number}
            </div>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-5 shadow-lg shadow-primary/30">
              {i === 0 && <CheckCircle className="w-5 h-5 text-white" />}
              {i === 1 && <Zap className="w-5 h-5 text-white" />}
              {i === 2 && <Star className="w-5 h-5 text-white" />}
            </div>
            <h3 className="font-display font-bold text-xl mb-2 relative">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed relative">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="container-tight py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="section-eyebrow mb-4 justify-center"><Users className="w-3.5 h-3.5" /> Community</div>
        <h2 className="display-2">A community that <span className="gradient-text">adds value</span></h2>
        <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
          Join engineers and tech professionals discussing industry trends, sharing experiences,
          and discovering the best tools and vendors every day.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {/* Discord */}
        <Reveal className="glass-card card-lift p-8 group hover:border-[#5865F2]/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/8 via-transparent to-purple-600/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#5865F2/10,_transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/15 border border-[#5865F2]/30 flex items-center justify-center mb-5">
              <MessagesSquare className="w-6 h-6 text-[#5865F2]" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Discord Community</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Real-time discussion with engineers worldwide. Ask questions, share project experiences,
              and get vetted vendor recommendations from the community.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-foreground font-display">
                  <AnimatedCounter value={5} suffix="K+" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Members</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-foreground font-display">24/7</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Active</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-foreground font-display">
                  <AnimatedCounter value={12} />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Channels</div>
              </div>
            </div>
            <a href="#" className="btn-ghost text-sm w-full justify-center">
              Join Discord Server →
            </a>
          </div>
        </Reveal>

        {/* YouTube */}
        <Reveal delay={80} className="glass-card card-lift p-8 group hover:border-red-500/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/6 via-transparent to-red-900/4 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(0_80%_50%/0.08),_transparent_60%)] pointer-events-none" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-5">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">YouTube Channel</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Subscribe to vendor spotlights, GEO tutorials, and real case studies from top-rated
              tech firms. New content every week.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-foreground font-display">
                  <AnimatedCounter value={2.1} suffix="K" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Subscribers</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-foreground font-display">
                  <AnimatedCounter value={80} suffix="+" />
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Videos</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-foreground font-display">Weekly</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Uploads</div>
              </div>
            </div>
            <a href="#" className="btn-ghost text-sm w-full justify-center">
              Visit YouTube Channel →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { FeaturedSection, CategoriesSection, HowItWorksSection, CommunitySection };
