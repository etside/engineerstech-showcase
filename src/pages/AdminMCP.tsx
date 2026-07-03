import { useEffect, useMemo, useState } from "react";
import { authApi, adminApi, type AiListing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Copy, RefreshCw, ShieldCheck, ShieldAlert, Zap, Bot,
  Code2, MessageSquare, Smartphone, Globe, BarChart2,
  Key, Trash2, Plus, Eye, EyeOff, CheckCircle2, XCircle,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type McpConfig = {
  id: string;
  server_name: string;
  api_token: string;
  enabled: boolean;
  allow_write: boolean;
  hidden_tools: string[];
  rate_limit: number;
  expires_at?: string | null;
  token_last_rotated_at?: string | null;
};

type OAuthClient = {
  id: string;
  client_name: string;
  scopes: string;
  redirect_uris: string[];
  grant_types: string[];
  token_endpoint_auth_method: string;
  created_at: string;
};

type Analytics = {
  total_calls: number;
  by_tool: { tool_name: string; calls: number }[];
  by_client: { client_id: string; calls: number }[];
  daily: { day: string; calls: number }[];
};

const ALL_TOOLS = [
  { name: "search_businesses",    label: "Search Businesses",   write: false },
  { name: "get_business",         label: "Get Business",        write: false },
  { name: "list_categories",      label: "List Categories",     write: false },
  { name: "recommend_for_intent", label: "Recommend for Intent",write: false },
  { name: "submit_business",      label: "Submit Business",     write: true  },
  { name: "write_review",         label: "Write Review",        write: true  },
];

// ─────────────────────────────────────────────
// Tiny helpers
// ─────────────────────────────────────────────
function randomToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
}

// ─────────────────────────────────────────────
// Connection card data (one per client type)
// ─────────────────────────────────────────────
function useConnectionCards(mcpUrl: string, cfg: McpConfig | null) {
  return useMemo(() => {
    const token     = cfg?.api_token ?? "<your-token>";
    const origin    = window.location.origin;
    const oauthBase = `${origin}/api/oauth`;

    return [
      // ── ChatGPT Apps ──────────────────────────────────────────────────────
      {
        id: "chatgpt",
        label: "ChatGPT Apps",
        icon: <Bot className="size-5 text-green-400" />,
        badge: "OAuth 2.1 + PKCE",
        color: "border-green-500/30",
        description:
          "ChatGPT Deep Research & Connectors require OAuth 2.1 with PKCE. " +
          "Plain bearer tokens are NOT accepted by ChatGPT.",
        steps: [
          "ChatGPT → Settings → Beta Features → turn on Developer Mode",
          "Go to Connectors → Add connector → Remote MCP",
          `Server URL: ${mcpUrl}`,
          "Auth type: OAuth 2.1 (PKCE)",
          `Authorization URL: ${oauthBase}/authorize`,
          `Token URL: ${oauthBase}/token`,
          `Register a client first: POST ${oauthBase}/register`,
          "Scopes: mcp:read  (+ mcp:write for write tools)",
          "Save → Authorize → tools appear in chat",
        ],
        snippet: JSON.stringify(
          {
            type: "remote_mcp",
            server_url: mcpUrl,
            auth: {
              type: "oauth2_pkce",
              authorization_url: `${oauthBase}/authorize`,
              token_url: `${oauthBase}/token`,
              scopes: ["mcp:read"],
            },
            well_known: `${origin}/api/.well-known/oauth-authorization-server`,
          },
          null, 2,
        ),
        docsUrl: "https://platform.openai.com/docs/guides/tools-connectors-mcp",
      },

      // ── Claude Desktop / Claude Code ──────────────────────────────────────
      {
        id: "claude",
        label: "Claude Desktop / Code",
        icon: <MessageSquare className="size-5 text-orange-400" />,
        badge: "Bearer Token",
        color: "border-orange-500/30",
        description:
          "Claude Desktop (macOS/Windows) and Claude Code both read " +
          "claude_desktop_config.json. Use the HTTP transport with a bearer token.",
        steps: [
          "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
          "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
          'Add the block below under "mcpServers"',
          "Restart Claude — the tools appear in the tool picker",
        ],
        snippet: JSON.stringify(
          {
            mcpServers: {
              "engineerstech": {
                type: "http",
                url: mcpUrl,
                headers: { Authorization: `Bearer ${token}` },
              },
            },
          },
          null, 2,
        ),
        docsUrl: "https://modelcontextprotocol.io/quickstart/user",
      },

      // ── VS Code / GitHub Copilot ──────────────────────────────────────────
      {
        id: "vscode",
        label: "VS Code / Copilot",
        icon: <Code2 className="size-5 text-blue-400" />,
        badge: "Bearer Token",
        color: "border-blue-500/30",
        description:
          "VS Code 1.99+ with GitHub Copilot extension supports MCP. " +
          "Add .vscode/mcp.json to your workspace or the user-level settings.",
        steps: [
          "Ensure VS Code ≥ 1.99 with GitHub Copilot Chat extension",
          "Create .vscode/mcp.json (workspace) or edit User Settings JSON",
          'In Copilot Chat click the tools icon → "Add MCP Server"',
          "Or paste the snippet below into .vscode/mcp.json",
        ],
        snippet: JSON.stringify(
          {
            servers: {
              "engineerstech": {
                type: "http",
                url: mcpUrl,
                headers: { Authorization: `Bearer ${token}` },
              },
            },
          },
          null, 2,
        ),
        docsUrl: "https://code.visualstudio.com/docs/copilot/chat/mcp-servers",
      },

      // ── Cursor / Windsurf ─────────────────────────────────────────────────
      {
        id: "cursor",
        label: "Cursor / Windsurf",
        icon: <Zap className="size-5 text-violet-400" />,
        badge: "Bearer Token",
        color: "border-violet-500/30",
        description:
          "Cursor 0.45+ and Windsurf both use the same JSON config format. " +
          "Only the file path differs.",
        steps: [
          "Cursor: ~/.cursor/mcp.json  (or Settings → MCP → Edit config)",
          "Windsurf: ~/.codeium/windsurf/mcp_config.json",
          "Paste the block below and save",
          "Reload the IDE — tools appear in the AI panel",
        ],
        snippet: JSON.stringify(
          {
            mcpServers: {
              "engineerstech": {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${token}` },
              },
            },
          },
          null, 2,
        ),
        docsUrl: "https://docs.cursor.com/context/model-context-protocol",
      },

      // ── WeChat Mini Program ───────────────────────────────────────────────
      {
        id: "wechat",
        label: "WeChat Mini Program",
        icon: <Smartphone className="size-5 text-emerald-400" />,
        badge: "HTTP + Bearer",
        color: "border-emerald-500/30",
        description:
          "Use Tencent CloudBase mp-skills to wrap MCP tools as Mini Program AI Skills. " +
          "A Cloud Function proxies requests so the bearer token stays server-side.",
        steps: [
          "WeChat Official Platform → AI Capabilities → Development Mode → Enable",
          "WeChat DevTools Nightly build required",
          "npm i @cloudbase/mp-cloudbase-sdk in your cloud functions folder",
          "Deploy the Cloud Function below as mcp-proxy",
          "Whitelist your domain: Mini Program settings → request domain",
          "Call wx.cloud.callFunction({ name:'mcp-proxy', data:{tool,arguments} })",
        ],
        snippet:
`// cloudfunctions/mcp-proxy/index.js
const fetch = require('node-fetch');
const MCP_URL   = '${mcpUrl}';
const MCP_TOKEN = process.env.MCP_TOKEN; // set in CloudBase env vars

exports.main = async (event = {}) => {
  const body = {
    jsonrpc: '2.0', id: 1,
    method: 'tools/call',
    params: { name: event.tool, arguments: event.arguments ?? {} },
  };
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${MCP_TOKEN}\`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
};`,
        docsUrl: "https://docs.cloudbase.net/en/mp-skill/recipe-0-create-ai-miniprogram",
      },

      // ── Custom Agent / cURL ───────────────────────────────────────────────
      {
        id: "custom",
        label: "Custom Agent / cURL",
        icon: <Globe className="size-5 text-sky-400" />,
        badge: "JSON-RPC 2.0",
        color: "border-sky-500/30",
        description:
          "Any HTTP client speaking JSON-RPC 2.0 works. " +
          "Spec: 2025-11-25 stable (2026-07-28 RC accepted additively).",
        steps: [
          `POST ${mcpUrl}`,
          "Header: Content-Type: application/json",
          "Header: Authorization: Bearer <token>",
          'Body: {"jsonrpc":"2.0","id":1,"method":"tools/call","params":{...}}',
          "Response: result.content[0].text contains JSON",
        ],
        snippet:
`curl -X POST ${mcpUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_businesses",
      "arguments": { "query": "software agency Dhaka", "limit": 5 }
    }
  }'`,
        docsUrl: "https://modelcontextprotocol.io/specification/2025-11-25",
      },
    ];
  }, [mcpUrl, cfg]);
}

// ─────────────────────────────────────────────
// ConnectionCard component
// ─────────────────────────────────────────────
type CardDef = ReturnType<typeof useConnectionCards>[0];

function ConnectionCard({ card }: { card: CardDef }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className={`border ${card.color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            {card.icon} {card.label}
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">{card.badge}</Badge>
        </div>
        <CardDescription className="text-xs leading-relaxed">{card.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <Button variant="outline" size="sm" className="h-7 text-xs"
          onClick={() => setOpen((v) => !v)}>
          {open ? "Hide config" : "Show config"}
        </Button>
        {open && (
          <div className="space-y-3">
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              {card.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <div className="relative group">
              <pre className="bg-muted/40 border border-border rounded-lg p-3 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-60">
                {card.snippet}
              </pre>
              <Button size="icon" variant="ghost"
                className="absolute top-2 right-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyText(card.snippet, "Config snippet")}>
                <Copy className="size-3" />
              </Button>
            </div>
            {card.docsUrl && (
              <a href={card.docsUrl} target="_blank" rel="noreferrer"
                className="text-[11px] text-primary hover:underline">
                Official docs ↗
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// Tab: Overview + Token management
// ─────────────────────────────────────────────
function TabOverview({
  cfg, mcpUrl, onRefresh,
}: { cfg: McpConfig; mcpUrl: string; onRefresh: () => void }) {
  const [serverName, setServerName] = useState(cfg.server_name);
  const [enabled, setEnabled]       = useState(cfg.enabled);
  const [allowWrite, setAllowWrite] = useState(cfg.allow_write);
  const [rateLimit, setRateLimit]   = useState(String(cfg.rate_limit ?? 60));
  const [showToken, setShowToken]   = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateMcp({ server_name: serverName, enabled, allow_write: allowWrite, rate_limit: parseInt(rateLimit) });
      toast.success("MCP settings saved");
      onRefresh();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  }

  async function rotateToken() {
    const token   = randomToken();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    try {
      await adminApi.updateMcp({
        api_token: token, expires_at: expires,
        token_last_rotated_at: new Date().toISOString(),
      });
      toast.success("Token rotated — update all connected clients");
      onRefresh();
    } catch (e) { toast.error((e as Error).message); }
  }

  async function testConn() {
    setTestStatus("Testing…");
    try {
      const res  = await fetch(`${mcpUrl}/health`);
      const json = await res.json();
      setTestStatus(res.ok ? `✓ ${json.server ?? "OK"} · v${json.version}` : `✗ HTTP ${res.status}`);
    } catch (e) { setTestStatus(`✗ ${(e as Error).message}`); }
  }

  return (
    <div className="space-y-4">
      {/* Server URL + Token */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Connection details</CardTitle>
          <CardDescription className="text-xs">
            Paste these into your AI client. Token acts as Bearer auth for clients
            that do not use OAuth (Claude, VS Code, Cursor, Windsurf, custom cURL).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">MCP Server URL</Label>
            <div className="flex gap-2">
              <Input value={mcpUrl} readOnly className="font-mono text-xs h-8" />
              <Button variant="outline" size="icon" className="size-8"
                onClick={() => copyText(mcpUrl, "Server URL")}>
                <Copy className="size-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Bearer token</Label>
            <div className="flex gap-2">
              <Input
                value={cfg.api_token ?? ""}
                readOnly
                type={showToken ? "text" : "password"}
                className="font-mono text-xs h-8"
              />
              <Button variant="outline" size="icon" className="size-8"
                onClick={() => setShowToken((s) => !s)}>
                {showToken ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              </Button>
              <Button variant="outline" size="icon" className="size-8"
                onClick={() => copyText(cfg.api_token ?? "", "Token")}>
                <Copy className="size-3" />
              </Button>
              <Button variant="outline" size="icon" className="size-8"
                title="Rotate token" onClick={rotateToken}>
                <RefreshCw className="size-3" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Send as <code>Authorization: Bearer &lt;token&gt;</code> or <code>?token=…</code>
            </p>
            {cfg.expires_at && (
              <p className="text-[10px] text-amber-400">
                Expires: {new Date(cfg.expires_at).toLocaleString()}
              </p>
            )}
            {cfg.token_last_rotated_at && (
              <p className="text-[10px] text-muted-foreground">
                Last rotated: {new Date(cfg.token_last_rotated_at).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={testConn}>Test connection</Button>
            {testStatus && (
              <span className={`text-xs ${testStatus.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
                {testStatus}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Server settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="sname" className="text-xs">Server name</Label>
            <Input id="sname" value={serverName} className="h-8"
              onChange={(e) => setServerName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rl" className="text-xs">Rate limit (requests / minute)</Label>
            <Input id="rl" type="number" value={rateLimit} className="h-8 w-28"
              onChange={(e) => setRateLimit(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Enabled</p>
              <p className="text-xs text-muted-foreground">Toggle the MCP endpoint on/off globally</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Allow write tools</p>
              <p className="text-xs text-muted-foreground">
                Expose submit_business and write_review to connected clients
              </p>
            </div>
            <Switch checked={allowWrite} onCheckedChange={setAllowWrite} />
          </div>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Tools visibility
// ─────────────────────────────────────────────
function TabTools({
  cfg, onRefresh,
}: { cfg: McpConfig; onRefresh: () => void }) {
  const [hidden, setHidden] = useState<string[]>(cfg.hidden_tools ?? []);

  function toggle(name: string) {
    setHidden((h) => h.includes(name) ? h.filter((x) => x !== name) : [...h, name]);
  }

  async function save() {
    try {
      await adminApi.updateMcp({ hidden_tools: hidden });
      toast.success("Tool visibility updated");
      onRefresh();
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Exposed tools</CardTitle>
        <CardDescription className="text-xs">
          Toggle which tools are visible to connected AI clients.
          Write tools also require "Allow write tools" to be enabled.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {ALL_TOOLS.map((t) => {
          const isHidden = hidden.includes(t.name);
          return (
            <div key={t.name}
              className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                {isHidden
                  ? <XCircle className="size-4 text-muted-foreground" />
                  : <CheckCircle2 className="size-4 text-green-400" />}
                <div>
                  <p className="text-sm font-mono">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {t.label} · {t.write ? "write" : "read-only"}
                  </p>
                </div>
              </div>
              <Switch checked={!isHidden} onCheckedChange={() => toggle(t.name)} />
            </div>
          );
        })}
        <Button size="sm" className="mt-2" onClick={save}>Save tool config</Button>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// Tab: OAuth Clients
// ─────────────────────────────────────────────
function TabOAuthClients() {
  const [clients, setClients] = useState<OAuthClient[]>([]);
  const [name, setName]       = useState("");
  const [redirect, setRedirect] = useState("");
  const [scopes, setScopes]   = useState("mcp:read");
  const [adding, setAdding]   = useState(false);

  async function load() {
    try {
      const data = await adminApi.mcpClients();
      setClients(data as OAuthClient[]);
    } catch { /* silent */ }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim() || !redirect.trim()) {
      toast.error("Client name and redirect URI are required");
      return;
    }
    setAdding(true);
    try {
      await adminApi.mcpCreateClient({
        client_name: name.trim(),
        redirect_uris: redirect.split(",").map((s) => s.trim()).filter(Boolean),
        scope: scopes,
        grant_types: ["authorization_code"],
      });
      toast.success("OAuth client registered");
      setName(""); setRedirect(""); setScopes("mcp:read");
      await load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setAdding(false); }
  }

  async function remove(id: string) {
    try {
      await adminApi.mcpDeleteClient(id);
      toast.success("Client deleted");
      await load();
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registered OAuth 2.1 clients</CardTitle>
          <CardDescription className="text-xs">
            ChatGPT and other OAuth-only clients need a registered client_id here.
            PKCE is always required — no client_secret needed for public clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {clients.length === 0 && (
            <p className="text-xs text-muted-foreground">No clients registered yet.</p>
          )}
          {clients.map((c) => (
            <div key={c.id}
              className="flex items-start justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{c.client_name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{c.id}</p>
                <p className="text-[10px] text-muted-foreground">
                  Scopes: {c.scopes} · Auth: {c.token_endpoint_auth_method}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Redirects: {(c.redirect_uris ?? []).join(", ")}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" className="size-7"
                  onClick={() => copyText(c.id, "Client ID")}>
                  <Copy className="size-3" />
                </Button>
                <Button variant="outline" size="icon" className="size-7 text-destructive"
                  onClick={() => remove(c.id)}>
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-1">
            <Plus className="size-4" /> Register new client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Client name</Label>
            <Input value={name} className="h-8"
              placeholder="e.g. ChatGPT Connector"
              onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Redirect URIs (comma-separated)</Label>
            <Input value={redirect} className="h-8"
              placeholder="https://chatgpt.com/aip/p/…/oauth/callback"
              onChange={(e) => setRedirect(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Scopes</Label>
            <Input value={scopes} className="h-8"
              placeholder="mcp:read mcp:write"
              onChange={(e) => setScopes(e.target.value)} />
          </div>
          <Button size="sm" onClick={add} disabled={adding}>
            {adding ? "Registering…" : "Register client"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Analytics
// ─────────────────────────────────────────────
function TabAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    adminApi.mcpAnalytics()
      .then((d) => setData(d as Analytics))
      .catch(() => { /* silent */ });
  }, []);

  if (!data) return <p className="text-xs text-muted-foreground">Loading analytics…</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total calls", value: data.total_calls },
          { label: "Tools",       value: data.by_tool.length },
          { label: "Clients",     value: data.by_client.length },
          { label: "Days tracked",value: data.daily.length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Calls by tool</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.by_tool.map((t) => (
              <div key={t.tool_name}
                className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{t.tool_name}</span>
                <Badge variant="secondary">{t.calls}</Badge>
              </div>
            ))}
            {!data.by_tool.length && (
              <p className="text-xs text-muted-foreground">No calls yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Calls by client</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.by_client.map((c) => (
              <div key={c.client_id}
                className="flex items-center justify-between text-xs">
                <span className="font-mono truncate text-muted-foreground max-w-[160px]">
                  {c.client_id}
                </span>
                <Badge variant="secondary">{c.calls}</Badge>
              </div>
            ))}
            {!data.by_client.length && (
              <p className="text-xs text-muted-foreground">No clients yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Daily calls (last 30 days)</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-20">
            {data.daily.map((d) => {
              const max = Math.max(...data.daily.map((x) => x.calls), 1);
              const pct = Math.round((d.calls / max) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-primary/60 rounded-t transition-all hover:bg-primary"
                    style={{ height: `${pct}%`, minHeight: "2px" }}
                  />
                  <span className="absolute -top-5 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {d.day}: {d.calls}
                  </span>
                </div>
              );
            })}
            {!data.daily.length && (
              <p className="text-xs text-muted-foreground">No data yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: Client connection guide (all cards)
// ─────────────────────────────────────────────
function TabConnections({ cards }: { cards: CardDef[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {cards.map((c) => <ConnectionCard key={c.id} card={c} />)}
    </div>
  );
}

// ─────────────────────────────────────────────
// Tab: AI Listing Management
// ─────────────────────────────────────────────
function TabAiListings() {
  const [rows, setRows] = useState<AiListing[]>([]);
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.aiListings();
      setRows(data);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function toggle(id: string, enabled: boolean) {
    try {
      await adminApi.toggleAiListing(id, enabled);
      toast.success(enabled ? "AI listing enabled" : "AI listing disabled");
      setRows((r) => r.map((b) => b.id === id
        ? { ...b, ai_listing_enabled: enabled, ai_listing_source: "admin" }
        : b,
      ));
    } catch (e) { toast.error((e as Error).message); }
  }

  const filtered = rows.filter((b) => {
    if (filter === "enabled"  && !b.ai_listing_enabled) return false;
    if (filter === "disabled" &&  b.ai_listing_enabled) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) &&
        !b.owner_email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total:   rows.length,
    enabled: rows.filter((b) => b.ai_listing_enabled).length,
    paid:    rows.filter((b) => b.ai_listing_source === "paid").length,
    admin:   rows.filter((b) => b.ai_listing_source === "admin").length,
  };

  const tierColor = (tier: string) => ({
    enterprise: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    featured:   "bg-purple-500/15 text-purple-400 border-purple-500/30",
    pro:        "bg-blue-500/15 text-blue-400 border-blue-500/30",
    free:       "bg-muted text-muted-foreground",
  }[tier] ?? "bg-muted text-muted-foreground");

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total businesses", value: counts.total, color: "" },
          { label: "AI listing ON",    value: counts.enabled, color: "text-green-400" },
          { label: "Paid (auto)",      value: counts.paid,   color: "text-blue-400" },
          { label: "Admin promoted",   value: counts.admin,  color: "text-violet-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search name or owner email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-56 text-xs"
        />
        {(["all", "enabled", "disabled"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"}
            className="h-7 text-xs capitalize"
            onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={load}>
          <RefreshCw className="size-3 mr-1" /> Refresh
        </Button>
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">How AI listing works:</strong>{" "}
        Businesses on <span className="text-blue-400">Pro / Featured / Enterprise</span> plans are
        automatically included in MCP tool results when they pay (source: <em>paid</em>).
        Admins can also manually enable or disable any business regardless of tier (source: <em>admin</em>).
        Only <span className="text-green-400">AI listing enabled</span> businesses appear when
        ChatGPT, Claude, Cursor or any MCP client calls <code>search_businesses</code> or{" "}
        <code>recommend_for_intent</code>.
      </div>

      {/* Business rows */}
      {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-xs text-muted-foreground">No businesses match the filter.</p>
      )}
      <div className="space-y-2">
        {filtered.map((b) => (
          <div key={b.id}
            className={`flex items-center justify-between gap-3 flex-wrap rounded-lg border p-3 transition-colors ${
              b.ai_listing_enabled ? "border-green-500/30 bg-green-500/5" : "border-border"
            }`}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm truncate">{b.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tierColor(b.tier)}`}>
                  {b.tier}
                </span>
                {b.ai_listing_enabled && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    b.ai_listing_source === "paid"
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                      : "bg-violet-500/15 text-violet-400 border-violet-500/30"
                  }`}>
                    {b.ai_listing_source === "paid" ? "paid" : "admin"}
                  </span>
                )}
                {b.is_verified && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    verified
                  </span>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {b.category_name} · ★{Number(b.rating).toFixed(1)} ({b.review_count}) · {b.owner_email}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">
                {b.ai_listing_enabled ? "In AI index" : "Hidden from AI"}
              </span>
              <Switch
                checked={b.ai_listing_enabled}
                onCheckedChange={(v) => toggle(b.id, v)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Default export — AdminMCP page
// ─────────────────────────────────────────────
export default function AdminMCP() {
  const [loading,    setLoading]    = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [cfg,        setCfg]        = useState<McpConfig | null>(null);

  const mcpUrl = useMemo(() => `${window.location.origin}/api/mcp-server`, []);
  const cards  = useConnectionCards(mcpUrl, cfg);

  useEffect(() => {
    (async () => {
      try {
        const { user } = await authApi.me();
        if (!user) { setAuthorized(false); setLoading(false); return; }
        const isAdmin = (user.roles ?? []).some(
          (r) => r === "admin" || r === "super_admin",
        );
        setAuthorized(isAdmin);
        if (isAdmin) await refresh();
      } catch { setAuthorized(false); }
      setLoading(false);
    })();
  }, []);

  async function refresh() {
    try {
      const data = await adminApi.mcpConfig();
      if (data) setCfg(data as McpConfig);
    } catch (e) { toast.error((e as Error).message); }
  }

  if (loading) {
    return (
      <div className="container py-16 text-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="container py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              Admin access required
            </CardTitle>
            <CardDescription>
              You must be signed in as an admin or super_admin to manage the MCP server.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="size-6 text-primary" />
          MCP Server — Admin CMS
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your Model Context Protocol server (spec 2025-11-25). Configure tokens,
          OAuth clients, tool visibility, and get ready-to-paste connection configs for
          ChatGPT, Claude, VS Code, Cursor, WeChat, and any custom agent.
        </p>
        <div className="flex items-center gap-2 pt-1">
          {cfg?.enabled
            ? <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="size-3 mr-1" /> Live
              </Badge>
            : <Badge variant="outline" className="text-muted-foreground">
                <XCircle className="size-3 mr-1" /> Disabled
              </Badge>}
          <span className="text-xs text-muted-foreground font-mono">{mcpUrl}</span>
          <Button variant="ghost" size="icon" className="size-6"
            onClick={() => copyText(mcpUrl, "Server URL")}>
            <Copy className="size-3" />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      {cfg && (
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview"    className="text-xs gap-1"><Key className="size-3" />Token & Settings</TabsTrigger>
            <TabsTrigger value="connect"     className="text-xs gap-1"><Globe className="size-3" />Connect Clients</TabsTrigger>
            <TabsTrigger value="ai-listings" className="text-xs gap-1"><Bot className="size-3" />AI Listings</TabsTrigger>
            <TabsTrigger value="tools"       className="text-xs gap-1"><Zap className="size-3" />Tools</TabsTrigger>
            <TabsTrigger value="oauth"       className="text-xs gap-1"><ShieldCheck className="size-3" />OAuth Clients</TabsTrigger>
            <TabsTrigger value="analytics"   className="text-xs gap-1"><BarChart2 className="size-3" />Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <TabOverview cfg={cfg} mcpUrl={mcpUrl} onRefresh={refresh} />
          </TabsContent>

          <TabsContent value="connect" className="mt-4">
            <TabConnections cards={cards} />
          </TabsContent>

          <TabsContent value="ai-listings" className="mt-4">
            <TabAiListings />
          </TabsContent>

          <TabsContent value="tools" className="mt-4">
            <TabTools cfg={cfg} onRefresh={refresh} />
          </TabsContent>

          <TabsContent value="oauth" className="mt-4">
            <TabOAuthClients />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <TabAnalytics />
          </TabsContent>
        </Tabs>
      )}

      {!cfg && (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">No MCP config found. Initialize it:</p>
            <Button onClick={async () => {
              await adminApi.updateMcp({
                server_name: "engineersTech MCP",
                api_token: randomToken(),
                enabled: true,
                allow_write: false,
                rate_limit: 60,
              });
              await refresh();
            }}>Initialize MCP server</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
