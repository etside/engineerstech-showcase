import { corsHeaders, json } from "../_shared/cors.ts";
import { supaService, getSetting, getUserFromAuthHeader } from "../_shared/supa.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const user = await getUserFromAuthHeader(req.headers.get("Authorization"));
    if (!user) return json({ error: "Auth required" }, 401);

    const { businessId, tierSlug, returnOrigin } = await req.json();
    if (!businessId || !tierSlug) return json({ error: "businessId & tierSlug required" }, 400);

    const s = supaService();
    const { data: biz } = await s.from("businesses").select("id,name,owner_id,claimed_by").eq("id", businessId).maybeSingle();
    if (!biz) return json({ error: "Business not found" }, 404);
    if (biz.owner_id !== user.id && biz.claimed_by !== user.id) return json({ error: "Forbidden" }, 403);

    const { data: tier } = await s.from("pricing_tiers").select("*").eq("slug", tierSlug).maybeSingle();
    if (!tier) return json({ error: "Tier not found" }, 404);

    const storeId = await getSetting<string>("sslcz_store_id", "");
    const storePw = await getSetting<string>("sslcz_store_password", "");
    const sandbox = await getSetting<boolean>("sslcz_sandbox", true);
    if (!storeId || !storePw) {
      return json({ error: "SSLCommerz not configured. Admin must set credentials in /admin/settings." }, 503);
    }

    const amount = Number(tier.price_bdt ?? tier.price_usd ?? 0) || 1;
    const tranId = `geo_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
    const currency = tier.price_bdt ? "BDT" : "USD";
    const origin = returnOrigin || new URL(req.url).origin;
    const fnBase = `${Deno.env.get("SUPABASE_URL")}/functions/v1`;

    // Create pending subscription
    await s.from("subscriptions").insert({
      business_id: businessId,
      tier: tierSlug,
      status: "pending",
      sslcz_tran_id: tranId,
      amount,
      currency,
    });

    const form = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePw,
      total_amount: amount.toFixed(2),
      currency,
      tran_id: tranId,
      success_url: `${fnBase}/sslcz-ipn?status=success&origin=${encodeURIComponent(origin)}`,
      fail_url: `${fnBase}/sslcz-ipn?status=fail&origin=${encodeURIComponent(origin)}`,
      cancel_url: `${fnBase}/sslcz-ipn?status=cancel&origin=${encodeURIComponent(origin)}`,
      ipn_url: `${fnBase}/sslcz-ipn`,
      cus_name: user.email?.split("@")[0] ?? "Customer",
      cus_email: user.email ?? "noreply@geolisted.app",
      cus_add1: "N/A",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: "0000000000",
      shipping_method: "NO",
      product_name: `${tier.name} subscription — ${biz.name}`,
      product_category: "Subscription",
      product_profile: "non-physical-goods",
    });

    const gateway = sandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const res = await fetch(gateway, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
    const data = await res.json();
    if (data.status !== "SUCCESS") return json({ error: "Init failed", data }, 502);
    return json({ gatewayUrl: data.GatewayPageURL, sessionKey: data.sessionkey, tranId });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});