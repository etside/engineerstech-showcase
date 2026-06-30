import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import BusinessCard from "@/components/BusinessCard";
import JsonLd from "@/components/JsonLd";
import { categories, industries } from "@/data/mockBusinesses";
import { supabase } from "@/integrations/supabase/client";

interface Business {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  category: string;
  industry?: string | null;
  services?: string[] | null;
  website?: string | null;
  rating?: number | null;
  review_count?: number | null;
  geo_score?: number | null;
  is_verified?: boolean | null;
  logo_url?: string | null;
  location?: string | null;
}

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>(params.get("category") || "All");
  const [ind, setInd] = useState<string>("All");
  const [sort, setSort] = useState<"geo" | "rating" | "reviews">("geo");
  const [dbCats, setDbCats] = useState<{ slug: string; name: string }[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("categories").select("slug,name").order("name").then(({ data }) => {
      if (data) setDbCats(data as { slug: string; name: string }[]);
    });
    supabase
      .from("businesses_public" as any)
      .select(
        "id,slug,name,tagline,logo_url,category,industry,services,website,rating,review_count,geo_score,is_verified,location",
      )
      .eq("is_active", true)
      .order("geo_score", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        if (data) setBusinesses(data as unknown as Business[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (cat === "All") next.delete("category"); else next.set("category", cat);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  const filtered = useMemo(() => {
    const catName = dbCats.find((c) => c.slug === cat)?.name;
    let r = businesses.filter((b) => {
      const text = `${b.name} ${b.tagline ?? ""} ${(b.services || []).join(" ")}`;
      const matchQ = !query || text.toLowerCase().includes(query.toLowerCase());
      const matchC = cat === "All" || b.category === cat || b.category === catName;
      const matchI = ind === "All" || b.industry === ind;
      return matchQ && matchC && matchI;
    });
    r = r.sort((a, b) => sort === "rating" ? (b.rating || 0) - (a.rating || 0) : sort === "reviews" ? (b.review_count || 0) - (a.review_count || 0) : (b.geo_score || 0) - (a.geo_score || 0));
    return r;
  }, [query, cat, ind, sort, dbCats, businesses]);

  // JSON-LD ItemList for LLM ingestion
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verified Business Listings",
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 20).map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: b.name,
        description: b.tagline,
        url: `https://geolisted.example.com/business/${b.slug}`,
        aggregateRating: { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.review_count },
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />

      <section className="container-tight pt-8 pb-16">
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow mb-3"><Sparkles className="w-3.5 h-3.5" /> Directory</div>
          <h1 className="display-2 mb-3">Browse <span className="gradient-text">{businesses.length}+</span> AI-ready businesses</h1>
          <p className="text-muted-foreground">Every listing is structured, verified, and indexed for LLM discovery.</p>
        </div>

        {/* Filter bar */}
        <div className="glass-card p-4 md:p-5 mb-8 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services, companies, skills…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/40 border border-border focus:border-primary focus:outline-none text-sm placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid grid-cols-2 lg:flex gap-2">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none">
              <option value="All">All Categories</option>
              {dbCats.length > 0
                ? dbCats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)
                : categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={ind} onChange={(e) => setInd(e.target.value)} className="h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none">
              <option value="All">All Industries</option>
              {industries.map((i) => <option key={i}>{i}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as "geo" | "rating" | "reviews")} className="h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none col-span-2 lg:col-span-1">
              <option value="geo">Sort: GEO Score</option>
              <option value="rating">Sort: Rating</option>
              <option value="reviews">Sort: Reviews</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5 text-sm">
          <div className="text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> results</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Ranked for AI discovery
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-16 text-center text-muted-foreground">
            No listings match your filters. Try clearing them.
          </div>
        )}
      </section>
    </>
  );
}
