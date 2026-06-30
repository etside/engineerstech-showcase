import { corsHeaders } from "../_shared/cors.ts";
import { supaService, getSetting } from "../_shared/supa.ts";

// Minimal SendGrid-backed email sender. Expects POST JSON: { to, subject, html, text }
// Reads smtp_provider and smtp_api_key and smtp_from from platform_settings.

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const to = body.to;
    const subject = body.subject || "No subject";
    const html = body.html;
    const text = body.text;

    if (!to) return new Response("missing to", { status: 400, headers: corsHeaders });

    const provider = await getSetting<string>("smtp_provider", "sendgrid");
    const apiKey = await getSetting<string>("smtp_api_key", "");
    const from = await getSetting<string>("smtp_from", "noreply@example.com");
    const fromName = await getSetting<string>("smtp_from_name", "GeoListed");

    if (!apiKey) return new Response("SMTP not configured", { status: 500, headers: corsHeaders });

    if (provider === "sendgrid") {
      const payload: any = {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from, name: fromName },
        subject,
      };
      if (html) payload.content = [{ type: "text/html", value: html }];
      else if (text) payload.content = [{ type: "text/plain", value: text }];

      const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error("SendGrid error:", { status: r.status, body: txt });
        return new Response(`sendgrid error: ${r.status}`, { status: 502, headers: corsHeaders });
      }
      return new Response(JSON.stringify({ success: true, to }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response("unsupported provider", { status: 400, headers: corsHeaders });
  } catch (e) {
    return new Response(`error: ${(e as Error).message}`, { status: 500, headers: corsHeaders });
  }
});
