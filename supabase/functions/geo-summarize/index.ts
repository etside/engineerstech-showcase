import { corsHeaders, json } from "../_shared/cors.ts";
import { supaService, getSetting, getUserFromAuthHeader } from "../_shared/supa.ts";
import { aiChat } from "../_shared/ai.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const user = await getUserFromAuthHeader(req.headers.get("Authorization"));
    if (!user) return json({ error: "Auth required" }, 401);

    // Rate-limit per-user to protect AI costs
    const rl = await checkRateLimit(`geo-summarize:user:${user.id}`, 10, 60);
    if (!rl.allowed) return json({ error: "Rate limit exceeded" }, 429);

    const { businessId } = await req.json();
    if (!businessId) return json({ error: "businessId required" }, 400);

    const s = supaService();
    const { data: b } = await s.from("businesses").select("id,name,owner_id,claimed_by").eq("id", businessId).maybeSingle();
    if (!b) return json({ error: "Not found" }, 404);

    // Permission: owner, claimer, or admin
    const { data: roles } = await s.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = (roles || []).some((r) => r.role === "admin");
    if (!isAdmin && b.owner_id !== user.id && b.claimed_by !== user.id) {
      return json({ error: "Forbidden" }, 403);
    }

    const { data: reviews } = await s
      .from("reviews")
      .select("rating,title,body")
      .eq("business_id", businessId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!reviews?.length) {
      const summary = { pros: [], cons: [], sentiment: "neutral", sample_size: 0 };
      await s.from("businesses").update({ ai_summary: summary, ai_summary_updated_at: new Date().toISOString() }).eq("id", businessId);
      return json({ summary });
    }

    const model = await getSetting("ai_default_model", "google/gemini-3-flash-preview");
    const raw = await aiChat({
      model: model as string,
      system:
        'Summarize customer reviews into STRICT JSON: {"pros":string[],"cons":string[],"sentiment":"positive|neutral|negative","headline":string}. Max 5 pros and 3 cons, short phrases.',
      prompt: `Business: ${b.name}\n\nReviews:\n${reviews.map((r) => `- (${r.rating}/5) ${r.title || ""} ${r.body || ""}`).join("\n")}`,
      responseFormat: "json_object",
    });
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json({ error: "AI bad JSON", raw }, 502);
    }
    const summary = { ...parsed, sample_size: reviews.length };
    await s.from("businesses").update({ ai_summary: summary, ai_summary_updated_at: new Date().toISOString() }).eq("id", businessId);
    return json({ summary });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});