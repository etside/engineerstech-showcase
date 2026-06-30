// Simple rate-limit helper for edge functions.
// Uses Upstash Redis if UPSTASH_REDIS_REST_URL/TOKEN set, otherwise an in-memory fallback (dev).

type RateResult = { allowed: boolean; remaining: number; reset: number };

async function upstashIncr(key: string, windowSeconds: number) {
  const url = Deno.env.get("UPSTASH_REDIS_REST_URL");
  const token = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  // Use Redis LUA via REST to INCR and set expiry when first created.
  // Simpler approach: call INCR and then EXPIRE if ttl==-1
  const body = { command: ["INCR", key] };
  const r1 = await fetch(`${url}/command`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r1.ok) return null;
  const res1 = await r1.json();
  const count = Number(res1.result ?? 0);
  // set expire
  await fetch(`${url}/command`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ command: ["EXPIRE", key, String(windowSeconds)] }) });
  return count;
}

const memoryBuckets = new Map<string, { ts: number; count: number }>();

export async function checkRateLimit(key: string, limit = 60, windowSeconds = 60): Promise<RateResult> {
  // Try Upstash for production
  const up = await upstashIncr(key, windowSeconds);
  if (up !== null) {
    const remaining = Math.max(0, limit - up);
    return { allowed: up <= limit, remaining, reset: Date.now() + windowSeconds * 1000 };
  }
  // Memory fallback for dev
  const now = Date.now();
  const b = memoryBuckets.get(key);
  if (!b || now - b.ts > windowSeconds * 1000) {
    memoryBuckets.set(key, { ts: now, count: 1 });
    return { allowed: true, remaining: limit - 1, reset: now + windowSeconds * 1000 };
  }
  b.count += 1;
  memoryBuckets.set(key, b);
  return { allowed: b.count <= limit, remaining: Math.max(0, limit - b.count), reset: b.ts + windowSeconds * 1000 };
}

export async function checkApiMeter(userId: string, endpoint: string, limit = 1000, windowSeconds = 3600): Promise<RateResult> {
  const key = `meter:${userId}:${endpoint}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
  return checkRateLimit(key, limit, windowSeconds);
}

export default checkRateLimit;
