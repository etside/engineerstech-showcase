export default function ApiDocs() {
  return (
    <section className="container-tight py-16 space-y-8 max-w-3xl">
      <div>
        <h1 className="display-1">Developer & LLM APIs</h1>
        <p className="text-muted-foreground text-lg mt-3">Read-only endpoints that serve the verified directory to humans, MCP clients, and LLMs.</p>
      </div>
      <div className="glass-card p-6 space-y-3">
        <h2 className="font-display text-xl font-semibold">Public LLM feed</h2>
        <code className="block text-xs bg-muted/40 p-3 rounded-lg">GET /functions/v1/geo-feed</code>
        <p className="text-sm text-muted-foreground">Returns the full JSON-LD <code>ItemList</code> of every active, verified listing. Cached for 5 minutes.</p>
      </div>
      <div className="glass-card p-6 space-y-3">
        <h2 className="font-display text-xl font-semibold">LLM discovery file</h2>
        <code className="block text-xs bg-muted/40 p-3 rounded-lg">GET /llms.txt</code>
        <p className="text-sm text-muted-foreground">Tells LLMs what's on this site and which endpoints to ingest.</p>
      </div>
      <div className="glass-card p-6 space-y-3">
        <h2 className="font-display text-xl font-semibold">MCP server (ChatGPT / Claude tools)</h2>
        <code className="block text-xs bg-muted/40 p-3 rounded-lg">POST /functions/v1/mcp-server</code>
        <p className="text-sm text-muted-foreground">Streamable HTTP MCP transport. Tools: <code>search_businesses</code>, <code>get_business</code>, <code>list_categories</code>, <code>recommend_for_intent</code>. Configure bearer tokens in <code>/admin/mcp</code>.</p>
      </div>
      <div className="glass-card p-6 space-y-3">
        <h2 className="font-display text-xl font-semibold">AI recommendation</h2>
        <code className="block text-xs bg-muted/40 p-3 rounded-lg">POST /functions/v1/geo-recommend  &#123; intent: "string" &#125;</code>
        <p className="text-sm text-muted-foreground">Returns an AI-ranked shortlist of vendors for a buyer intent. Powered by Lovable AI.</p>
      </div>
    </section>
  );
}
