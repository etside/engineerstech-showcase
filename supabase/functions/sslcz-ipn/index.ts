import { corsHeaders } from "../_shared/cors.ts";
import { supaService, getSetting } from "../_shared/supa.ts";

function redirect(origin: string, status: string, tranId?: string) {
  const u = new URL("/dashboard", origin);
  u.searchParams.set("payment", status);
  if (tranId) u.searchParams.set("tran_id", tranId);
  return new Response(null, { status: 302, headers: { ...corsHeaders, Location: u.toString() } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const origin = url.searchParams.get("origin") || "https://geolisted.app";
  let payload: Record<string, string> = {};
  if (req.method === "POST") {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      form.forEach((v, k) => (payload[k] = String(v)));
    } else if (ct.includes("application/json")) {
      payload = await req.json();
    }
  }

  const tranId = payload.tran_id || url.searchParams.get("tran_id") || "";
  const valId = payload.val_id || "";

  // Browser redirect targets (success/fail/cancel) — just bounce.
  if (status && status !== "success") {
    return redirect(origin, status, tranId);
  }

  if (!tranId) return new Response("missing tran_id", { status: 400, headers: corsHeaders });

  const s = supaService();

  try {
    // Validate with SSLCommerz if we have a val_id
    if (valId) {
      const storeId = await getSetting<string>("sslcz_store_id", "");
      const storePw = await getSetting<string>("sslcz_store_password", "");
      const sandbox = await getSetting<boolean>("sslcz_sandbox", true);
      const validatorBase = sandbox
        ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
        : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";
      const vUrl = `${validatorBase}?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(storeId)}&store_passwd=${encodeURIComponent(storePw)}&format=json`;
      const vr = await fetch(vUrl);
      const vd = await vr.json();
      if (vd.status !== "VALID" && vd.status !== "VALIDATED") {
        await s.from("subscriptions").update({ status: "inactive", raw_payload: vd, updated_at: new Date().toISOString() }).eq("sslcz_tran_id", tranId);
        return status ? redirect(origin, "fail", tranId) : new Response("invalid", { status: 400, headers: corsHeaders });
      }
    }

    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: sub } = await s
      .from("subscriptions")
      .update({
        status: "active",
        sslcz_val_id: valId,
        valid_from: new Date().toISOString(),
        valid_until: validUntil,
        raw_payload: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("sslcz_tran_id", tranId)
      .select("business_id,tier")
      .maybeSingle();

    if (sub) {
      await s.from("businesses").update({ tier: sub.tier, updated_at: new Date().toISOString() }).eq("id", sub.business_id);
      // Activate listing only if verified AND paid
      await s.rpc("refresh_business_active", { _business_id: sub.business_id } as any).catch(() => null);
    }

    return status ? redirect(origin, "success", tranId) : new Response("OK", { headers: corsHeaders });
  } catch (e) {
    return new Response(`error: ${(e as Error).message}`, { status: 500, headers: corsHeaders });
  }
});