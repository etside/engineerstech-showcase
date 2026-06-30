import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Sparkles } from "lucide-react";

type Business = {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  category?: string | null;
  services?: string[] | null;
  website?: string | null;
  rating?: number | null;
  review_count?: number | null;
  geo_score?: number | null;
  is_verified?: boolean | null;
  logo_url?: string | null;
  location?: string | null;
  color1?: string | null;
  color2?: string | null;
};

function gradientColors(name: string) {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color1 = `hsl(${hash % 360}, 72%, 45%)`;
  const color2 = `hsl(${(hash + 120) % 360}, 68%, 57%)`;
  return [color1, color2];
}

export default function BusinessCard({ business }: { business: Business }) {
  const [color1, color2] = gradientColors(business.name);
  const services = business.services ?? [];
  const location = business.location ?? business.category ?? "Remote";
  const rating = business.rating != null ? business.rating.toFixed(1) : "—";
  const reviews = business.review_count ?? 0;
  const score = business.geo_score ?? 0;

  return (
    <Link
      to={`/business/${business.slug}`}
      className="group glass-card p-6 flex flex-col gap-4 transition-all duration-500 ease-spring hover:border-primary/50 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${business.color1 ?? color1}, ${business.color2 ?? color2})` }}
          >
            {business.name.slice(0, 1)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-foreground group-hover:gradient-text transition-all">{business.name}</h3>
            <div className="text-xs text-muted-foreground mt-0.5">{business.category}</div>
          </div>
        </div>
        {business.is_verified && (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium" title="Verified">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{business.tagline ?? "Trusted AI and marketplace provider."}</p>

      <div className="flex flex-wrap gap-1.5">
        {services.slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] font-medium px-2 py-1 rounded-md bg-muted/40 text-foreground/80 border border-border/60">{s}</span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{rating}</span>
          <span className="text-muted-foreground">({reviews})</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        {score >= 80 && (
          <div className="flex items-center gap-1 text-primary-light" title={`GEO Score ${score}`}>
            <Sparkles className="w-3 h-3" />
            <span className="font-semibold">AI-Ready</span>
          </div>
        )}
      </div>
    </Link>
  );
}
