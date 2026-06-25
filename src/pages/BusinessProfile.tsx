import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Globe, Mail, Phone, ShieldCheck, Sparkles, Users, Calendar, DollarSign, ArrowLeft, Check, ChevronRight } from "lucide-react";
import { findBusiness } from "@/data/mockBusinesses";
import JsonLd from "@/components/JsonLd";

export default function BusinessProfile() {
  const { slug = "" } = useParams();
  const b = findBusiness(slug);

  if (!b) {
    return (
      <div className="container-tight py-32 text-center">
        <h1 className="display-2 mb-4">Listing not found</h1>
        <Link to="/listings" className="btn-gradient">Back to directory</Link>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: b.name,
    description: b.description,
    url: `https://geolisted.example.com/business/${b.slug}`,
    telephone: b.phone,
    email: b.email,
    address: { "@type": "PostalAddress", addressLocality: b.location, addressCountry: b.country },
    foundingDate: String(b.founded_year),
    priceRange: b.hourly_rate,
    aggregateRating: { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.review_count, bestRating: 5 },
    review: b.testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.author },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.quote,
    })),
    makesOffer: b.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="container-tight pt-6 pb-12">
        <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to directory
        </Link>

        {/* Header */}
        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(circle at 80% 20%, ${b.color2}40, transparent 50%)` }} />
          <div className="relative flex flex-col md:flex-row gap-6 md:items-start">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-3xl text-white shadow-2xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${b.color1}, ${b.color2})` }}
            >
              {b.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="display-3 font-bold">{b.name}</h1>
                {b.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
                {b.geo_score >= 80 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-primary/15 text-primary-light border border-primary/30">
                    <Sparkles className="w-3 h-3" /> AI Discovery · {b.geo_score}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-lg">{b.tagline}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{b.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({b.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-4 h-4" /> {b.location}, {b.country}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-4 h-4" /> {b.employee_count} people</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-4 h-4" /> Est. {b.founded_year}</div>
              </div>
            </div>
            <div className="flex md:flex-col gap-2 md:w-48">
              <a href={`mailto:${b.email}`} className="btn-gradient text-sm flex-1 justify-center">Contact</a>
              <a href={b.website} target="_blank" rel="noreferrer" className="btn-ghost text-sm flex-1 justify-center">
                <Globe className="w-4 h-4" /> Visit
              </a>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-7">
              <h2 className="font-display text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{b.description}</p>
            </div>

            <div className="glass-card p-7">
              <h2 className="font-display text-xl font-semibold mb-4">Services</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {b.services.map((s) => (
                  <div key={s} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <Check className="w-4 h-4 text-primary-light shrink-0" />
                    <span className="text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-7">
              <h2 className="font-display text-xl font-semibold mb-4">Selected work</h2>
              <div className="space-y-3">
                {b.portfolio.map((p) => (
                  <div key={p.title} className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/40 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display font-semibold">{p.title}</div>
                        <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-light group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="glass-card p-7 border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
                <h2 className="font-display text-lg font-semibold">AI Review Summary</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Auto-generated from {b.review_count} verified reviews.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Pros</div>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />Ships on time, every time</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />Senior team — no juniors hidden in invoices</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />Strong communication & async docs</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Watch-outs</div>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex gap-2"><span className="w-4 h-4 mt-0.5 shrink-0">•</span>Premium pricing vs. offshore</li>
                    <li className="flex gap-2"><span className="w-4 h-4 mt-0.5 shrink-0">•</span>Booked 4–6 weeks in advance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="glass-card p-7">
              <h2 className="font-display text-xl font-semibold mb-4">Client testimonials</h2>
              <div className="space-y-4">
                {b.testimonials.map((t) => (
                  <div key={t.author} className="p-4 rounded-xl bg-muted/20 border border-border/60">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed mb-3">"{t.quote}"</p>
                    <div className="text-xs text-muted-foreground">— {t.author}, {t.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="glass-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">At a glance</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Team:</span><span className="ml-auto font-medium">{b.employee_count}</span></div>
                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Min project:</span><span className="ml-auto font-medium">{b.min_project_size}</span></div>
                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Hourly:</span><span className="ml-auto font-medium">{b.hourly_rate}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Founded:</span><span className="ml-auto font-medium">{b.founded_year}</span></div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Contact</div>
              <div className="space-y-3 text-sm">
                <a href={b.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary-light transition-colors break-all"><Globe className="w-4 h-4 shrink-0" /> {b.website.replace("https://","")}</a>
                <a href={`mailto:${b.email}`} className="flex items-center gap-2 hover:text-primary-light transition-colors break-all"><Mail className="w-4 h-4 shrink-0" /> {b.email}</a>
                <a href={`tel:${b.phone}`} className="flex items-center gap-2 hover:text-primary-light transition-colors"><Phone className="w-4 h-4 shrink-0" /> {b.phone}</a>
              </div>
            </div>

            <div className="glass-card p-6 border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary-light" />
                <span className="text-xs uppercase tracking-wider font-semibold text-primary-light">GEO Score · {b.geo_score}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                <div className="h-full gradient-bg" style={{ width: `${b.geo_score}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Optimized for ChatGPT, Claude, DeepSeek, and Qwen recommendation queries.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
