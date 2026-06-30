import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Copy, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";

type McpConfig = {
  id: string;
  server_name: string;
  api_token: string;
  enabled: boolean;
  allow_write: boolean;
  updated_at: string;
  expires_at?: string | null;
};

function randomToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminMCP() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [cfg, setCfg] = useState<McpConfig | null>(null);
  const [serverName, setServerName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [allowWrite, setAllowWrite] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
  const mcpUrl = useMemo(
    () => `https://${projectRef}.functions.supabase.co/mcp-server`,
    [projectRef],
  );

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      setAuthorized(isAdmin);
      if (isAdmin) await refresh();
      setLoading(false);
    })();
  }, []);

  async function refresh() {
    const { data, error } = await supabase
      .from("mcp_config")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return toast.error(error.message);
    if (data) {
      setCfg(data as McpConfig);
      setServerName(data.server_name);
      setEnabled(data.enabled);
      setAllowWrite(data.allow_write);
    }
  }

  async function save() {
    if (!cfg) return;
    const { error } = await supabase
      .from("mcp_config")
      .update({ server_name: serverName, enabled, allow_write: allowWrite })
      .eq("id", cfg.id);
    if (error) return toast.error(error.message);
    toast.success("MCP settings saved");
    await refresh();
  }

  async function rotateToken() {
    if (!cfg) return;
    const token = randomToken(32);
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await (supabase as any)
      .from("mcp_config")
      .update({ api_token: token, expires_at: expires, token_last_rotated_at: new Date().toISOString() })
      .eq("id", cfg.id);
    if (error) return toast.error(error.message);
    toast.success("API token rotated. Update your ChatGPT connector.");
    await refresh();
  }

  async function testConnection() {
    setTestStatus("Testing…");
    try {
      const res = await fetch(`${mcpUrl}/health`);
      const json = await res.json();
      setTestStatus(res.ok ? `OK · ${json.server}` : `Failed (${res.status})`);
    } catch (e) {
      setTestStatus(`Failed: ${(e as Error).message}`);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  if (loading) return <div className="container py-16">Loading…</div>;
  if (!authorized) {
    return (
      <div className="container py-16 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5" /> Admin access required
            </CardTitle>
            <CardDescription>
              You must be signed in as an admin to manage the MCP server.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldCheck className="size-7 text-primary" /> ChatGPT Apps MCP Server
        </h1>
        <p className="text-muted-foreground">
          Configure the Model Context Protocol endpoint that ChatGPT, Claude, and other
          LLMs use to read your verified business listings.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>Paste these values into ChatGPT → Settings → Connectors → Developer mode.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Server URL</Label>
            <div className="flex gap-2">
              <Input value={mcpUrl} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={() => copy(mcpUrl, "URL")}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bearer token</Label>
            <div className="flex gap-2">
              <Input
                value={cfg?.api_token ?? ""}
                readOnly
                type={showToken ? "text" : "password"}
                className="font-mono text-xs"
              />
              <Button variant="outline" onClick={() => setShowToken((s) => !s)}>
                {showToken ? "Hide" : "Show"}
              </Button>
              <Button variant="outline" size="icon" onClick={() => copy(cfg?.api_token ?? "", "Token")}>
                <Copy className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={rotateToken} title="Rotate token">
                <RefreshCw className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Send as <code>Authorization: Bearer &lt;token&gt;</code> or <code>?token=…</code> query param.
            </p>
            {cfg?.expires_at && (
              <p className="text-xs text-muted-foreground">Token expires: {new Date(cfg.expires_at).toLocaleString()}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={testConnection}>Test connection</Button>
            {testStatus && <span className="text-sm text-muted-foreground">{testStatus}</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="server_name">Server name</Label>
            <Input id="server_name" value={serverName} onChange={(e) => setServerName(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Enabled</p>
              <p className="text-sm text-muted-foreground">Turn the MCP endpoint on or off.</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Allow write tools</p>
              <p className="text-sm text-muted-foreground">Let LLMs create or update listings (advanced).</p>
            </div>
            <Switch checked={allowWrite} onCheckedChange={setAllowWrite} />
          </div>
          <Button onClick={save}>Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exposed tools</CardTitle>
          <CardDescription>What ChatGPT can call once connected.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li><code className="font-mono">search_businesses</code> — query/category/industry search ranked by GEO score</li>
            <li><code className="font-mono">get_business</code> — fetch a single listing by id or slug</li>
            <li><code className="font-mono">list_categories</code> — distinct category list</li>
            <li><code className="font-mono">recommend_for_intent</code> — natural-language recommendations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}