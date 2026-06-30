import { corsHeaders, json } from "../_shared/cors.ts";

// Edge function: minimal HaveIBeenPwned PwnedPasswords k-anonymity check.
// POST { password: string }

function sha1Hex(str: string) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  return crypto.subtle.digest("SHA-1", data).then((buf) => {
    const a = Array.from(new Uint8Array(buf));
    return a.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const { password } = await req.json();
    if (!password || typeof password !== "string") return json({ error: "password required" }, 400);
    const hash = await sha1Hex(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!res.ok) return json({ error: "hibp lookup failed" }, 502);
    const body = await res.text();
    const lines = body.split(/\r?\n/);
    for (const line of lines) {
      const [suf, count] = line.split(":");
      if (!suf) continue;
      if (suf.toUpperCase() === suffix.toUpperCase()) {
        return json({ pwned: true, count: Number(count) });
      }
    }
    return json({ pwned: false, count: 0 });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
