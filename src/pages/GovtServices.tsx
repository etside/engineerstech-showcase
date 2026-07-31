import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Landmark, ChevronRight, ArrowRight, Shield, FileText, Users, Heart, Baby, Globe, Briefcase, Building2, Clock } from "lucide-react";
import { govtServices, govtServiceCategories, type GovtService } from "@/data/bangladeshGovtServices";
import { setPageMeta } from "@/lib/seo";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  nationality: Globe,
  business: Briefcase,
  personal: Heart,
  "birth-certificate": Baby,
};

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "id-card": FileText,
  "book-open": FileText,
  globe: Globe,
  "shield-check": Shield,
  "credit-card": FileText,
  "building-2": Building2,
  briefcase: Briefcase,
  hash: FileText,
  "file-text": FileText,
  receipt: FileText,
  ship: FileText,
  factory: Building2,
  users: Users,
  "file-x": FileText,
  heart: Heart,
  "file-minus": FileText,
  "pen-line": FileText,
  "map-pin": FileText,
  baby: Baby,
  clock: FileText,
  "edit-3": FileText,
  copy: FileText,
  "check-circle": Shield,
};

function ServiceCard({ service }: { service: GovtService }) {
  const Icon = SERVICE_ICONS[service.icon] || FileText;
  return (
    <Link
      to={`/govt-services/${service.slug}`}
      className="glass-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary-light" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{service.name}</h3>
            {service.isFeatured && (
              <span className="shrink-0 bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-medium">Featured</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{service.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {service.fees}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {service.timeline}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}

function CategoryCard({ category, count }: { category: typeof govtServiceCategories[number]; count: number }) {
  const Icon = CATEGORY_ICONS[category.slug] || FileText;
  return (
    <Link
      to={`/govt-services?cat=${category.slug}`}
      className="glass-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary-light" />
      </div>
      <h3 className="font-display font-semibold text-base mb-1">{category.label}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{category.description}</p>
      <span className="text-xs text-primary font-medium">{count} services available</span>
    </Link>
  );
}

export default function GovtServices() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat) setSelectedCategory(cat);
  }, []);

  useEffect(() => {
    setPageMeta(
      "Bangladesh Government Services | engineersTech",
      "Complete guide to Bangladesh government legal services — nationality, business registration, personal certificates, birth certificate registration and more.",
      "https://engineerstechbd.com/govt-services",
    );
  }, []);

  const filteredServices = govtServices.filter((s) => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-16 border-b border-border/30">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Bangladesh Govt. Services</h1>
              <p className="text-muted-foreground mt-1">Your complete guide to government legal services</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-4">
            Browse all legal services provided by the Government of Bangladesh — from nationality and citizenship
            to business registration, personal certificates, and birth certificate registration.
          </p>
        </div>
      </section>

      <div className="container-tight py-8">
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>

        {/* Category Cards */}
        {!search && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {govtServiceCategories.map((cat) => {
              const count = govtServices.filter((s) => s.category === cat.slug).length;
              return (
                <CategoryCard
                  key={cat.slug}
                  category={cat}
                  count={count}
                />
              );
            })}
          </div>
        )}

        {/* Active Category Filter */}
        {selectedCategory && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Showing:</span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {govtServiceCategories.find((c) => c.slug === selectedCategory)?.label}
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No services found</h3>
              <p className="text-muted-foreground mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{govtServices.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Services</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{govtServiceCategories.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Categories</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{govtServices.filter((s) => s.onlineUrl).length}</div>
            <div className="text-xs text-muted-foreground mt-1">Available Online</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{govtServices.filter((s) => s.fees === "Free").length}</div>
            <div className="text-xs text-muted-foreground mt-1">Free Services</div>
          </div>
        </div>
      </div>
    </div>
  );
}
