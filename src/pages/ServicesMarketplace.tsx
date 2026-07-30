import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Clock, RefreshCw } from "lucide-react";
import { serviceApi, type Service } from "@/lib/api";
import { setPageMeta } from "@/lib/seo";
import { useEffect } from "react";

function ServiceCard({ service }: { service: Service }) {
  const priceLabel = service.price_type === 'fixed'
    ? `৳${(service.price ?? 0).toLocaleString()}`
    : service.price_type === 'hourly'
      ? `৳${(service.price ?? 0).toLocaleString()}/hr`
      : service.price_from ? `From ৳${service.price_from.toLocaleString()}` : 'Custom Quote';

  return (
    <Link to={`/services/${service.slug}`}
      className="group glass-card rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 bg-muted/30 overflow-hidden">
        {service.featured_image ? (
          <img src={service.featured_image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        {service.is_featured && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{service.name}</h3>
        {service.business_name && (
          <p className="text-sm text-muted-foreground mt-1">{service.business_name}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.short_description || service.description?.slice(0, 120)}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <span className="font-bold text-foreground">{priceLabel}</span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {service.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {service.rating.toFixed(1)}
              </span>
            )}
            {service.delivery_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {service.delivery_time}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesMarketplace() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["services", { search, page }],
    queryFn: () => serviceApi.list({ search, page, per_page: 12 }),
  });

  useEffect(() => {
    setPageMeta("Services | EngineersTech Marketplace", "Browse professional services from verified vendors");
  }, []);

  const services = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-12 border-b border-border/30">
        <div className="container-tight">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Professional Services</h1>
          <p className="text-muted-foreground mt-2">Find experts for your next project</p>
        </div>
      </section>

      <div className="container-tight py-8">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search services..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm" />
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden border border-border/30 animate-pulse">
                <div className="h-44 bg-muted/30" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted/30 rounded w-3/4" />
                  <div className="h-3 bg-muted/30 rounded w-1/2" />
                  <div className="h-3 bg-muted/30 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service: Service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No services found</h3>
            <p className="text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <span className="px-4 py-2 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
