import { corsHeaders, json } from "../_shared/cors.ts";
import { supaService } from "../_shared/supa.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const minRating = parseFloat(url.searchParams.get("minRating") || "0");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "200"), 500);
  const format = url.searchParams.get("format") || "jsonld";

  // llms.txt index
  if (url.pathname.endsWith("/llms.txt") || format === "llms") {
    const s = supaService();
    const { data } = await s
      .from("businesses_public" as any)
      .select("slug,name,tagline,category")
      .eq("is_active", true)
      .order("geo_score", { ascending: false })
      .limit(limit);
    const base = url.origin;
    const body =
      `# geoListed — Business Directory\n\n> Verified businesses optimized for AI discovery.\n\n## Feed\n- [JSON-LD Feed](${base}/functions/v1/geo-feed)\n\n## Listings\n${(data || [])
        .map((b) => `- [${b.name}](${base.replace(/\.supabase\.co.*/, "")}/business/${b.slug}) — ${b.tagline ?? ""} (${b.category ?? ""})`)
        .join("\n")}\n`;
    return new Response(body, { headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" } });
  }

  try {
    const s = supaService();
    let q = s
      .from("businesses_public" as any)
      .select(
        "id,slug,name,tagline,description,services,category,industry,website,location,country,rating,review_count,geo_score,tier,is_verified,logo_url,is_active",
      )
      .eq("is_active", true)
      .gte("rating", minRating)
      .order("geo_score", { ascending: false })
      .limit(limit);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) throw error;

    const items = (data || []).map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        "@id": `https://geolisted.app/business/${b.slug}`,
        name: b.name,
        description: b.description || b.tagline,
        url: `https://geolisted.app/business/${b.slug}`,
        telephone: b.phone,
        email: b.email,
        address: b.location
          ? { "@type": "PostalAddress", addressLocality: b.location, addressCountry: b.country }
          : undefined,
        image: b.logo_url,
        aggregateRating: b.review_count
          ? {
              "@type": "AggregateRating",
              ratingValue: Number(b.rating || 0),
              reviewCount: b.review_count,
              bestRating: 5,
            }
          : undefined,
        makesOffer: (b.services || []).map((sv: string) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: sv },
        })),
        additionalProperty: [
          { "@type": "PropertyValue", name: "geo_score", value: b.geo_score },
          { "@type": "PropertyValue", name: "tier", value: b.tier },
          { "@type": "PropertyValue", name: "category", value: b.category },
          { "@type": "PropertyValue", name: "industry", value: b.industry },
        ],
        keywords: [b.category, b.industry, ...(b.services || [])].filter(Boolean).join(", "),
      },
    }));

    return json({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "geoListed — AI-Ready Business Directory",
      description: "Structured directory of verified businesses indexed for LLM discovery.",
      numberOfItems: items.length,
      itemListElement: items,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});