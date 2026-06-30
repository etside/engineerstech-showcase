import { Link } from "react-router-dom";
import { ExternalLink, BookOpen, Bot, Globe, Code, Shield, Server, Zap, ArrowRight } from "lucide-react";

const endpoints = [
  {
    icon: Globe,
    title: "Public LLM Feed (JSON-LD)",
    method: "GET",
    path: "/functions/v1/geo-feed",
    description: "Full structured directory of every active, verified business as schema.org ItemList. Optimized for LLM crawlers and knowledge graph ingestion.",
    queryParams: [
      { name: "category", type: "string", desc: "Filter by category slug" },
      { name: "minRating", type: "number", desc: "Minimum rating filter (0-5)" },
      { name: "limit", type: "number", desc: "Max results (default 200, max 500)" },
      { name: "format", type: "string", desc: "Response format: jsonld (default) or llms" },
    ],
    response: "JSON-LD ItemList with LocalBusiness items, aggregate ratings, services, and GEO metadata.",
    llmsTxt: "GET /llms.txt — Returns a plain-text index of all listings for LLM discovery.",
  },
  {
    icon: Bot,
    title: "AI Recommendation Engine",
    method: "POST",
    path: "/functions/v1/geo-recommend",
    description: "Natural language business matching. Describe a need, get AI-ranked vendor recommendations. Powered by Lovable AI Gateway.",
    requestBody: `{ "intent": "string (required)", "category": "string (optional)", "limit": 6 }`,
    response: `{ "recommendations": [{ "businessId": "uuid", "score": 1-10, "reason": "string", "position": 1, "business": { ... } }] }`,
    auth: "Supabase session token (Bearer) or anon with rate limiting",
  },
  {
    icon: Server,
    title: "MCP Server (ChatGPT / Claude)",
    method: "POST",
    path: "/functions/v1/mcp-server",
    description: "Model Context Protocol server using Streamable HTTP transport. Connect from ChatGPT Apps, Claude, or any MCP client. Exposes business data as LLM tools.",
    tools: [
      { name: "search_businesses", desc: "Search businesses by query, category, or location. Returns structured results with ratings and GEO scores." },
      { name: "get_business", desc: "Get full business profile by slug or ID. Includes services, reviews, and AI summary." },
      { name: "list_categories", desc: "List all available business categories." },
      { name: "recommend_for_intent", desc: "AI-powered recommendation: given a natural language intent, returns ranked vendor matches." },
    ],
    auth: "Bearer token (configured in /admin/mcp)",
    connectUrl: "URL: https://[project-ref].supabase.co/functions/v1/mcp-server",
  },
  {
    icon: Code,
    title: "Business API Keys",
    method: "GET",
    path: "/api/v1/businesses",
    description: "REST API for programmatic access to business listings. Rate-limited per key. Manage keys from the business dashboard.",
    auth: "X-API-Key header",
    rateLimit: "1,000 requests/hour per key",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    method: "—",
    path: "—",
    description: "All endpoints are protected by rate limiting, token validation, and row-level security. Public data is isolated via the businesses_public view.",
    features: [
      "Rate limiting via Upstash Redis (in-memory fallback)",
      "HIBP password breach checking on signup",
      "HMAC-SHA256 payment IPN verification",
      "MCP token expiry validation",
      "RLS on all database tables",
    ],
  },
];

export default function ApiDocs() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    name: "geoListed Public API",
    description: "Read-only endpoints serving the verified business directory to humans, MCP clients, and LLMs.",
    documentation: "https://geolisted.app/api-docs",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      <section className="container-tight py-12 space-y-10 max-w-4xl">
        {/* Header */}
        <div>
          <div className="section-eyebrow mb-3"><Code className="w-3.5 h-3.5" /> Developer & LLM APIs</div>
          <h1 className="display-1 mb-4">APIs for <span className="gradient-text">humans and AI</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Read-only endpoints that serve the verified directory to humans, MCP clients, and LLMs.
            Every endpoint is designed for <strong>Generative Engine Optimization (GEO)</strong> —
            making your data discoverable by ChatGPT, Claude, DeepSeek, Qwen, and more.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-2">
          <a href="/llms.txt" target="_blank" className="btn-ghost text-sm">
            <BookOpen className="w-3.5 h-3.5" /> llms.txt <ExternalLink className="w-3 h-3" />
          </a>
          <a href="/functions/v1/geo-feed" target="_blank" className="btn-ghost text-sm">
            <Globe className="w-3.5 h-3.5" /> JSON-LD Feed <ExternalLink className="w-3 h-3" />
          </a>
          <Link to="/admin/mcp" className="btn-ghost text-sm">
            <Server className="w-3.5 h-3.5" /> MCP Config
          </Link>
        </div>

        {/* Endpoints */}
        {endpoints.map((ep) => (
          <div key={ep.title} className="glass-card p-6 md:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <ep.icon className="w-5 h-5 text-primary-light" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl font-semibold mb-1">{ep.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{ep.description}</p>
              </div>
            </div>

            {/* Method + Path */}
            {ep.path !== "—" && (
              <div className="flex items-center gap-2 text-sm">
                {ep.method !== "—" && (
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    ep.method === "GET" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"
                  }`}>
                    {ep.method}
                  </span>
                )}
                <code className="text-xs bg-muted/40 px-3 py-1.5 rounded-lg font-mono">{ep.path}</code>
              </div>
            )}

            {/* Query params */}
            {ep.queryParams && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Query Parameters</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border/60"><th className="text-left py-1.5 text-muted-foreground font-medium">Name</th><th className="text-left py-1.5 text-muted-foreground font-medium">Type</th><th className="text-left py-1.5 text-muted-foreground font-medium">Description</th></tr></thead>
                    <tbody>
                      {ep.queryParams.map((p) => (
                        <tr key={p.name} className="border-b border-border/30">
                          <td className="py-1.5 font-mono">{p.name}</td>
                          <td className="py-1.5 text-muted-foreground">{p.type}</td>
                          <td className="py-1.5 text-muted-foreground">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request body */}
            {ep.requestBody && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Request Body</div>
                <pre className="text-xs bg-muted/40 p-3 rounded-lg overflow-x-auto font-mono">{ep.requestBody}</pre>
              </div>
            )}

            {/* Response */}
            {ep.response && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Response</div>
                <pre className="text-xs bg-muted/40 p-3 rounded-lg overflow-x-auto font-mono">{ep.response}</pre>
              </div>
            )}

            {/* MCP Tools */}
            {ep.tools && (
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Available Tools</div>
                <div className="space-y-2">
                  {ep.tools.map((t) => (
                    <div key={t.name} className="flex items-start gap-2 text-sm">
                      <Zap className="w-3.5 h-3.5 text-primary-light mt-0.5 shrink-0" />
                      <div>
                        <code className="text-xs font-semibold">{t.name}</code>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auth */}
            {ep.auth && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                <span>Auth: <code className="text-foreground font-mono">{ep.auth}</code></span>
              </div>
            )}

            {/* Extra info */}
            {ep.llmsTxt && <p className="text-xs text-muted-foreground"><Globe className="w-3 h-3 inline" /> {ep.llmsTxt}</p>}
            {ep.connectUrl && <p className="text-xs text-muted-foreground"><Server className="w-3 h-3 inline" /> {ep.connectUrl}</p>}
            {ep.rateLimit && <p className="text-xs text-muted-foreground">Rate limit: {ep.rateLimit}</p>}

            {/* Security features */}
            {ep.features && (
              <div className="flex flex-wrap gap-1.5">
                {ep.features.map((f) => (
                  <span key={f} className="text-[10px] px-2 py-1 rounded-md bg-muted/40 text-muted-foreground border border-border/60">{f}</span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* GEO Integration Guide */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary-light" />
            <h2 className="font-display text-xl font-semibold">GEO Integration Guide</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            To ensure your business listings are discovered by LLMs, follow these best practices:
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary-light text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <strong>Claim & verify your listing</strong>
                <p className="text-muted-foreground text-xs">Verified businesses rank higher in AI recommendations. Complete the verification workflow from your dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary-light text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <strong>Optimize your profile</strong>
                <p className="text-muted-foreground text-xs">Add detailed services, case studies, and testimonials. The AI recommendation engine uses this data to match you with buyer intents.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary-light text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <strong>Get indexed by LLMs</strong>
                <p className="text-muted-foreground text-xs">Our JSON-LD feed and MCP server are crawled by ChatGPT, Claude, DeepSeek, and Qwen. Your profile is automatically included when you're verified and active.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary-light text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
              <div>
                <strong>Monitor your visibility</strong>
                <p className="text-muted-foreground text-xs">Track how often your brand appears in LLM responses via the analytics dashboard. Use the AI Discovery page to test queries.</p>
              </div>
            </div>
          </div>
          <Link to="/ai-discover" className="btn-gradient text-sm inline-flex items-center gap-1">
            Try AI Discovery <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* MCP Connection Example */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary-light" />
            <h2 className="font-display text-xl font-semibold">Connecting from ChatGPT / Claude</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            To connect this MCP server to ChatGPT Apps (developer mode) or Claude:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-muted/40 p-4 rounded-xl space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">MCP Configuration</div>
              <pre className="text-xs font-mono whitespace-pre-wrap">{`{
  "mcpServers": {
    "geolisted": {
      "url": "https://[project-ref].supabase.co/functions/v1/mcp-server",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_TOKEN"
      }
    }
  }
}`}</pre>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
              <li>Generate an MCP token from the <Link to="/admin/mcp" className="text-primary-light underline">MCP admin page</Link></li>
              <li>Add the configuration to your MCP client (ChatGPT Apps, Claude desktop, etc.)</li>
              <li>The LLM can now search businesses, get profiles, list categories, and recommend vendors</li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}