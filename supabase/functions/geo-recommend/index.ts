import { corsHeaders, json } from "../_shared/cors.ts";
import { supaService, getSetting } from "../_shared/supa.ts";
import { aiChat } from "../_shared/ai.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const { intent, category, limit = 6 } = await req.json();
    if (!intent || typeof intent !== "string") return json({ error: "intent required" }, 400);

    const s = supaService();
    // Candidate pool: FTS + category filter, top by geo_score
    let q = s
      .from("businesses")
      .select("id,slug,name,tagline,description,services,category,industry,rating,review_count,geo_score,tier,is_verified")
      .eq("is_active", true)
      .order("geo_score", { ascending: false })
      .limit(40);
    if (category) q = q.eq("category", category);
    const { data: candidates, error } = await q;
    if (error) throw error;

    if (!candidates?.length) return json({ recommendations: [], message: "No businesses yet" });

    const model = await getSetting("ai_default_model", "google/gemini-3-flash-preview");
    const compact = candidates.map((c) => ({
      id: c.id,
      name: c.name,
      tagline: c.tagline,
      services: c.services,
      category: c.category,
      rating: c.rating,
      tier: c.tier,
    }));

    const ai = await aiChat({
      model: model as string,
      system:
        "You are a B2B discovery assistant. Given a buyer intent and candidates, return STRICT JSON: {\"recommendations\":[{\"businessId\":string,\"score\":number(1-10),\"reason\":string}]} ordered best first. Only return ids from the candidates list. Max " +
        limit +
        " items.",
      prompt: `Intent: ${intent}\n\nCandidates: ${JSON.stringify(compact)}`,
      responseFormat: "json_object",
    });

    let parsed: { recommendations: Array<{ businessId: string; score: number; reason: string }> };
    try {
      parsed = JSON.parse(ai);
    } catch {
      return json({ error: "AI returned invalid JSON", raw: ai }, 502);
    }

    const byId = new Map(candidates.map((c) => [c.id, c]));
    const enriched = (parsed.recommendations || [])
      .filter((r) => byId.has(r.businessId))
      .slice(0, limit)
      .map((r, i) => ({ ...r, position: i + 1, business: byId.get(r.businessId) }));

    // Log
    await s.from("ai_recommendations_log").insert(
      enriched.map((e) => ({
        business_id: e.businessId,
        intent,
        score: e.score,
        position: e.position,
      })),
    );

    return json({ recommendations: enriched });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});