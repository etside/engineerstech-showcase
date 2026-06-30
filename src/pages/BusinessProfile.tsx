import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Globe, Mail, Phone, ShieldCheck, Sparkles, Users, Calendar, DollarSign, ArrowLeft, Check, ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ReviewList from "@/components/ReviewList";
import { supabase } from "@/integrations/supabase/client";

type Business = {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  category?: string | null;
  industry?: string | null;
  services?: string[] | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  founded_year?: number | null;
  employee_count?: string | null;
  min_project_size?: string | null;
  hourly_rate?: string | null;
  rating?: number | null;
  review_count?: number | null;
  geo_score?: number | null;
  is_verified?: boolean | null;
  ai_summary?: string | null;
};

export default function BusinessProfile() {
  const { slug = "" } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("businesses_public" as any)
        .select(
          "id,slug,name,tagline,description,logo_url,category,industry,services,website,email,phone,location,country,founded_year,employee_count,min_project_size,hourly_rate,rating,review_count,geo_score,is_verified,ai_summary"
        )
        .eq("slug", slug)
        .maybeSingle();
      if (!active) return;
      if (error) {
        console.error(error);
        setBusiness(null);
      } else {
        setBusiness(data as unknown as Business | null);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return <div className="container-tight py-32 text-center">Loading listing…</div>;
  }

  if (!business) {
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
    name: business.name,
    description: business.description ?? business.tagline ?? "Verified AI-ready business listing.",
    url: `https://geolisted.example.com/business/${business.slug}`,
    telephone: business.phone ?? undefined,
    email: business.email ?? undefined,
    address: business.location ? { "@type": "PostalAddress", addressLocality: business.location, addressCountry: business.country ?? undefined } : undefined,
    foundingDate: business.founded_year ? String(business.founded_year) : undefined,
    priceRange: business.hourly_rate ?? undefined,
    aggregateRating: business.rating != null && business.review_count != null ? { "@type": "AggregateRating", ratingValue: business.rating, reviewCount: business.review_count, bestRating: 5 } : undefined,
    makesOffer: business.services?.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
  };

  const serviceItems = business.services ?? [];
  const displayRating = business.rating != null ? business.rating.toFixed(1) : "—";
  const displayReviews = business.review_count ?? 0;
  const displayLocation = business.location ? `${business.location}${business.country ? `, ${business.country}` : ""}` : business.category ?? "Remote";
  const hasWebsite = Boolean(business.website);
  const hasContact = Boolean(business.email);

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="container-tight pt-6 pb-12">
        <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to directory
        </Link>

        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.15),_transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row gap-6 md:items-start">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-3xl text-white shadow-2xl shrink-0 bg-gradient-to-br from-primary to-indigo-500">
              {business.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="display-3 font-bold">{business.name}</h1>
                {business.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
                {business.geo_score != null && business.geo_score >= 80 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-primary/15 text-primary-light border border-primary/30">
                    <Sparkles className="w-3 h-3" /> AI Discovery · {business.geo_score}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-lg">{business.tagline ?? "Verified business optimized for AI and marketplace discovery."}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold">{displayRating}</span><span className="text-muted-foreground">({displayReviews} reviews)</span></div>
                {displayLocation && <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-4 h-4" /> {displayLocation}</div>}
                {business.employee_count && <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-4 h-4" /> {business.employee_count} people</div>}
                {business.founded_year && <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-4 h-4" /> Est. {business.founded_year}</div>}
              </div>
            </div>
            <div className="flex md:flex-col gap-2 md:w-48">
              {hasContact && (
                <a href={`mailto:${business.email}`} className="btn-gradient text-sm flex-1 justify-center">Contact</a>
              )}
              {hasWebsite && (
                <a href={business.website} target="_blank" rel="noreferrer" className="btn-ghost text-sm flex-1 justify-center">
                  <Globe className="w-4 h-4" /> Visit
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {business.description && (
              <div className="glass-card p-7">
                <h2 className="font-display text-xl font-semibold mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{business.description}</p>
              </div>
            )}

            {serviceItems.length > 0 && (
              <div className="glass-card p-7">
                <h2 className="font-display text-xl font-semibold mb-4">Services</h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {serviceItems.map((service) => (
                    <div key={service} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card p-7 border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
                <h2 className="font-display text-lg font-semibold">AI Summary</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {business.ai_summary || "This listing is optimized for AI discovery and structured recommendation."}
              </p>
            </div>

            <div className="glass-card p-7">
              <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>
              <ReviewList businessId={business.id} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="glass-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">At a glance</div>
              <div className="space-y-3 text-sm">
                {business.employee_count && <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Team:</span><span className="ml-auto font-medium">{business.employee_count}</span></div>}
                {business.min_project_size && <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Min project:</span><span className="ml-auto font-medium">{business.min_project_size}</span></div>}
                {business.hourly_rate && <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Hourly:</span><span className="ml-auto font-medium">{business.hourly_rate}</span></div>}
                {business.founded_year && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Founded:</span><span className="ml-auto font-medium">{business.founded_year}</span></div>}
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Contact</div>
              <div className="space-y-3 text-sm">
                {business.website && (
                  <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary-light transition-colors break-all"><Globe className="w-4 h-4 shrink-0" /> {business.website.replace(/^https?:\/\//, "")}</a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-2 hover:text-primary-light transition-colors break-all"><Mail className="w-4 h-4 shrink-0" /> {business.email}</a>
                )}
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center gap-2 hover:text-primary-light transition-colors"><Phone className="w-4 h-4 shrink-0" /> {business.phone}</a>
                )}
              </div>
            </div>

            {business.geo_score != null && (
              <div className="glass-card p-6 border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary-light" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-primary-light">GEO Score · {business.geo_score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full gradient-bg" style={{ width: `${business.geo_score}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-3">Optimized for ChatGPT, Claude, DeepSeek, and Qwen recommendation queries.</p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
