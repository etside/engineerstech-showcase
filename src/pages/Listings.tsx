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
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

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
    setPage(1);
  }, [query, cat, ind, sort]);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

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
        url: `https://engineerstechbd.com/business/${b.slug}`,
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
          {paginated.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card p-16 text-center text-muted-foreground">
            No listings match your filters. Try clearing them.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-muted/40 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "ellipsis" ? (
                  <span key={`e-${i}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      item === safePage
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-muted/40 hover:bg-muted"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-muted/40 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </>
  );
}
