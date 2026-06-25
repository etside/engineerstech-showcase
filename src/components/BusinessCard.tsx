import { Link } from "react-router-dom";
import { Star, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { Business } from "@/data/mockBusinesses";

export default function BusinessCard({ business }: { business: Business }) {
  return (
    <Link
      to={`/business/${business.slug}`}
      className="group glass-card p-6 flex flex-col gap-4 transition-all duration-500 ease-spring hover:border-primary/50 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${business.color1}, ${business.color2})` }}
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

      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{business.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {business.services.slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] font-medium px-2 py-1 rounded-md bg-muted/40 text-foreground/80 border border-border/60">{s}</span>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{business.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({business.review_count})</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{business.location}</span>
        </div>
        {business.geo_score >= 80 && (
          <div className="flex items-center gap-1 text-primary-light" title={`GEO Score ${business.geo_score}`}>
            <Sparkles className="w-3 h-3" />
            <span className="font-semibold">AI-Ready</span>
          </div>
        )}
      </div>
    </Link>
  );
}
