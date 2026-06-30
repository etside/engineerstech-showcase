import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Sparkles, ChevronRight, Star, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JsonLd from "@/components/JsonLd";

interface Category { slug: string; name: string; description: string | null; icon: string | null; }
interface Business {
  id: string; slug: string; name: string; tagline: string | null; logo_url: string | null;
  rating: number | null; review_count: number | null; geo_score: number | null;
  is_verified: boolean | null; location: string | null; services: string[] | null;
}

export default function CategoryDetail() {
  const { slug = "" } = useParams();
  const [cat, setCat] = useState<Category | null>(null);
  const [items, setItems] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: c } = await supabase.from("categories").select("slug,name,description,icon").eq("slug", slug).maybeSingle();
      if (!active) return;
      setCat(c as Category | null);
      if (c) {
        const { data: b } = await supabase
          .from("businesses_public" as any)
          .select("id,slug,name,tagline,logo_url,rating,review_count,geo_score,is_verified,location,services,is_active")
          .eq("is_active", true)
          .or(`category.eq.${(c as Category).name},category.eq.${slug}`)
          .order("geo_score", { ascending: false })
          .limit(50);
        if (active) setItems((b as unknown as Business[]) ?? []);
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [slug]);

  const title = cat ? `Top ${cat.name} companies — Verified, GEO-ranked` : "Category";
  const description = cat?.description ||
    `Browse verified ${cat?.name ?? ""} vendors with AI-ready profiles, ratings, and structured data optimized for ChatGPT, Claude, Perplexity, and DeepSeek.`;

  useEffect(() => {
    if (cat) {
      document.title = `${title} | geoListed`;
      const m = document.querySelector('meta[name="description"]') || document.createElement("meta");
      m.setAttribute("name", "description");
      m.setAttribute("content", description);
      document.head.appendChild(m);
    }
  }, [cat, title, description]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/business/${b.slug}`,
      item: {
        "@type": "LocalBusiness",
        "@id": `/business/${b.slug}`,
        name: b.name,
        description: b.tagline ?? undefined,
        image: b.logo_url ?? undefined,
        address: b.location ?? undefined,
        aggregateRating: b.review_count
          ? { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.review_count }
          : undefined,
      },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Categories", item: "/categories" },
      { "@type": "ListItem", position: 3, name: cat?.name ?? slug, item: `/categories/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={[itemList, breadcrumbs]} />
      <section className="container-tight pt-8 pb-20">
        <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{cat?.name ?? slug}</span>
        </nav>

        <header className="max-w-3xl mb-10">
          <div className="section-eyebrow mb-3"><Sparkles className="w-3.5 h-3.5" /> {cat?.name ?? "Category"}</div>
          <h1 className="display-2 mb-3">Top <span className="gradient-text">{cat?.name ?? slug}</span> companies</h1>
          <p className="text-muted-foreground">{description}</p>
        </header>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass-card h-40 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-muted-foreground mb-4">No verified listings yet in this category.</p>
            <Link to="/submit" className="text-primary-light hover:underline">List your business →</Link>
          </div>
        ) : (
          <ol className="grid md:grid-cols-2 gap-4">
            {items.map((b, i) => (
              <li key={b.id}>
                <Link to={`/business/${b.slug}`} className="glass-card p-5 flex gap-4 hover:border-primary/50 transition-all h-full">
                  <div className="text-2xl font-display font-bold text-primary-light/70 w-8">{i + 1}</div>
                  {b.logo_url ? (
                    <img src={b.logo_url} alt={`${b.name} logo`} className="w-12 h-12 rounded-lg object-cover bg-card" loading="lazy" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display font-semibold truncate">{b.name}</h2>
                      {b.is_verified && <ShieldCheck className="w-4 h-4 text-primary-light shrink-0" />}
                    </div>
                    {b.tagline && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{b.tagline}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {b.rating ? (<span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current text-yellow-500" />{Number(b.rating).toFixed(1)} ({b.review_count})</span>) : null}
                      {b.location && <span>· {b.location}</span>}
                      {b.geo_score != null && <span>· GEO {b.geo_score}</span>}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}

        <section className="mt-16 glass-card p-8">
          <h2 className="font-display text-xl font-semibold mb-3">How we rank {cat?.name ?? "this category"}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Rankings combine our GEO score (structured-data completeness, schema validity, citation readiness), verified reviews,
            response rate, and admin verification. Every profile is emitted as schema.org JSON-LD so LLMs like ChatGPT, Claude,
            Perplexity, DeepSeek, and Qwen can cite it directly.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link to="/how-it-works" className="text-primary-light hover:underline">Methodology</Link>
            <Link to="/leaderboards" className="text-primary-light hover:underline">Leaderboards</Link>
            <Link to="/api-docs" className="text-primary-light hover:underline">LLM feed & API</Link>
          </div>
        </section>
      </section>
    </>
  );
}