// ChatGPT Apps–compatible MCP server (Streamable HTTP transport, JSON-RPC over HTTP).
// Exposes business listing data so LLMs can recommend businesses via Generative Engine Optimization.
//
// Connect from ChatGPT (developer mode) using:
//   URL:   https://<project-ref>.functions.supabase.co/mcp-server
//   Auth:  Bearer token (stored in the `mcp_config` table; manage from /admin/mcp)
//
// deno-lint-ignore-file no-explicit-any
import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const adminDb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, mcp-session-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
  "Access-Control-Expose-Headers": "mcp-session-id",
};

async function loadActiveConfig() {
  const { data, error } = await adminDb
    .from("mcp_config")
    .select("api_token, enabled, allow_write, server_name")
    .eq("enabled", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function extractToken(req: Request): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  const url = new URL(req.url);
  return url.searchParams.get("token");
}

/* ---------- MCP server + tool definitions ---------- */

const mcp = new McpServer({
  name: "geoListed-mcp",
  version: "1.0.0",
});

mcp.tool({
  name: "search_businesses",
  description:
    "Search verified business listings by free-text query, category, or industry. Returns ranked results with GEO scores so LLMs can recommend the best options.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Free-text search terms" },
      category: { type: "string", description: "Filter by category slug" },
      industry: { type: "string", description: "Filter by industry slug" },
      limit: { type: "number", minimum: 1, maximum: 50, default: 10 },
    },
  },
  handler: async (input: any) => {
    const limit = Math.min(Math.max(input?.limit ?? 10, 1), 50);
    let q = adminDb.from("businesses").select("*").eq("verified", true);
    if (input?.query) q = q.ilike("name", `%${input.query}%`);
    if (input?.category) q = q.eq("category", input.category);
    if (input?.industry) q = q.eq("industry", input.industry);
    const { data, error } = await q
      .order("geo_score", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
    };
  },
});

mcp.tool({
  name: "get_business",
  description: "Get a single business listing by id or slug.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      slug: { type: "string" },
    },
  },
  handler: async (input: any) => {
    if (!input?.id && !input?.slug) throw new Error("Provide id or slug");
    const q = adminDb.from("businesses").select("*");
    const { data, error } = input.id
      ? await q.eq("id", input.id).maybeSingle()
      : await q.eq("slug", input.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  },
});

mcp.tool({
  name: "list_categories",
  description: "List every distinct business category currently indexed.",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    const { data, error } = await adminDb
      .from("businesses")
      .select("category")
      .not("category", "is", null);
    if (error) throw new Error(error.message);
    const unique = Array.from(new Set((data ?? []).map((r: any) => r.category)));
    return { content: [{ type: "text", text: JSON.stringify(unique, null, 2) }] };
  },
});

mcp.tool({
  name: "recommend_for_intent",
  description:
    "Given a buyer's intent (e.g. 'I need a CRM for a 10-person sales team'), return the top matching businesses with reasoning data the LLM can cite.",
  inputSchema: {
    type: "object",
    properties: {
      intent: { type: "string", description: "Buyer's natural-language need" },
      limit: { type: "number", minimum: 1, maximum: 10, default: 5 },
    },
    required: ["intent"],
  },
  handler: async (input: any) => {
    const limit = Math.min(Math.max(input?.limit ?? 5, 1), 10);
    const { data, error } = await adminDb
      .from("businesses")
      .select("*")
      .eq("verified", true)
      .textSearch("name", input.intent, { type: "websearch", config: "english" })
      .order("geo_score", { ascending: false })
      .limit(limit);
    // textSearch may not match — fall back to keyword ilike on description.
    if (error || !data || data.length === 0) {
      const { data: fb } = await adminDb
        .from("businesses")
        .select("*")
        .eq("verified", true)
        .or(
          `name.ilike.%${input.intent}%,description.ilike.%${input.intent}%`,
        )
        .order("geo_score", { ascending: false })
        .limit(limit);
      return {
        content: [{ type: "text", text: JSON.stringify(fb ?? [], null, 2) }],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  },
});

/* ---------- HTTP routing ---------- */

const transport = new StreamableHttpTransport();
const app = new Hono();

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  await next();
  for (const [k, v] of Object.entries(corsHeaders)) c.res.headers.set(k, v);
});

// Health check (no auth) — handy for the admin panel "test connection" button.
app.get("/health", (c) => c.json({ ok: true, server: "geoListed-mcp" }));

// MCP endpoint — requires bearer token matching the active mcp_config row.
app.all("/*", async (c) => {
  const cfg = await loadActiveConfig();
  if (!cfg) {
    return c.json({ error: "MCP server not configured" }, 503);
  }
  const token = extractToken(c.req.raw);
  if (!token || token !== cfg.api_token) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": 'Bearer realm="mcp"',
        },
      },
    );
  }
  return await transport.handleRequest(c.req.raw, mcp);
});

Deno.serve(app.fetch);