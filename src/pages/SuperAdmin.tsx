import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RequireAdmin from "@/components/RequireAdmin";
import { ShieldCheck, KeyRound, Wallet, Users, Sparkles, ServerCog, BadgeCheck } from "lucide-react";

type Setting = { key: string; value: any; description?: string | null; is_secret?: boolean };

const SETTING_GROUPS: Array<{ title: string; icon: any; keys: Array<{ key: string; label: string; type: "text" | "number" | "bool" | "secret"; help?: string }> }> = [
  {
    title: "Public billing controls",
    icon: Wallet,
    keys: [
      { key: "billing_visible", label: "Show pricing on public site", type: "bool", help: "Hide all pricing until you turn it on." },
      { key: "billing_margin_pct", label: "Margin % on top of AI/processing costs", type: "number", help: "Applied to vendor-facing prices." },
    ],
  },
  {
    title: "AI / LLM",
    icon: Sparkles,
    keys: [
      { key: "ai_default_model", label: "Default Lovable AI model", type: "text", help: "Used by geo-recommend & summarizer." },
    ],
  },
  {
    title: "SSLCommerz payment gateway",
    icon: KeyRound,
    keys: [
      { key: "sslcz_store_id", label: "Store ID", type: "secret" },
      { key: "sslcz_store_passwd", label: "Store password", type: "secret" },
      { key: "sslcz_sandbox", label: "Use sandbox", type: "bool" },
    ],
  },
];

function Inner() {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [users, setUsers] = useState<Array<{ user_id: string; role: string; email?: string }>>([]);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantRole, setGrantRole] = useState<"admin" | "super_admin" | "business_owner" | "user">("admin");
  const [bizSlug, setBizSlug] = useState("");

  async function load() {
    const { data } = await supabase.from("platform_settings").select("*");
    const map: Record<string, Setting> = {};
    (data || []).forEach((s: any) => (map[s.key] = s));
    setSettings(map);
    const { data: r } = await supabase.from("user_roles").select("user_id, role").order("role");
    setUsers((r as any[]) || []);
  }
  useEffect(() => { load(); }, []);

  async function saveSetting(key: string, raw: any, type: string) {
    let value: any = raw;
    if (type === "number") value = Number(raw);
    if (type === "bool") value = !!raw;
    if (type === "text" || type === "secret") value = String(raw);
    const { error } = await supabase.from("platform_settings")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success(`Saved ${key}`);
    load();
  }

  async function grantBizFree() {
    if (!bizSlug.trim()) return;
    const { data: biz } = await supabase.from("businesses").select("id").eq("slug", bizSlug.trim()).maybeSingle();
    if (!biz) return toast.error("Business slug not found");
    const { error } = await supabase.from("businesses").update({
      verification_status: "verified", is_active: true,
    }).eq("id", biz.id);
    if (error) return toast.error(error.message);
    toast.success("Business marked live (free grant)");
    setBizSlug("");
  }

  async function grantRoleByUserId(userId: string, role: typeof grantRole) {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    load();
  }

  async function revokeRole(userId: string, role: string) {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    if (error) return toast.error(error.message);
    toast.success("Revoked");
    load();
  }

  return (
    <section className="container-tight py-12 space-y-8">
      <header>
        <div className="flex items-center gap-2 text-primary-light text-xs uppercase tracking-wider font-semibold">
          <ShieldCheck className="w-4 h-4" /> Super Admin CMS
        </div>
        <h1 className="display-2 mt-1">Platform controls</h1>
        <p className="text-muted-foreground">Manage payment gateway keys, billing visibility, AI models, roles, and free MCP grants.</p>
      </header>

      {SETTING_GROUPS.map((g) => (
        <div key={g.title} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <g.icon className="w-4 h-4 text-primary-light" />
            <h2 className="font-display font-semibold">{g.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {g.keys.map((k) => {
              const cur = settings[k.key]?.value;
              return (
                <SettingRow
                  key={k.key}
                  label={k.label}
                  type={k.type}
                  help={k.help}
                  value={cur}
                  onSave={(v) => saveSetting(k.key, v, k.type)}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BadgeCheck className="w-4 h-4 text-primary-light" />
          <h2 className="font-display font-semibold">Grant business live access (free / waived payment)</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Use this to push a vetted business to live + MCP indexing without a paid subscription.
        </p>
        <div className="flex gap-2 flex-wrap">
          <input value={bizSlug} onChange={(e) => setBizSlug(e.target.value)} placeholder="business-slug"
            className="flex-1 min-w-[260px] h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm" />
          <button onClick={grantBizFree} className="btn-gradient text-sm">Mark verified + live</button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary-light" />
          <h2 className="font-display font-semibold">Role management</h2>
        </div>
        <div className="grid md:grid-cols-[1fr_180px_140px] gap-2 mb-4">
          <input value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} placeholder="user id (UUID)"
            className="h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm" />
          <select value={grantRole} onChange={(e) => setGrantRole(e.target.value as any)}
            className="h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm">
            <option value="user">user</option>
            <option value="business_owner">business_owner</option>
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <button onClick={() => grantEmail && grantRoleByUserId(grantEmail.trim(), grantRole)} className="btn-gradient text-sm">Grant</button>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">
          Tip: ask the user to sign in once; their UUID appears in Backend → Users. Paste it here.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground"><tr><th className="text-left py-2">User ID</th><th className="text-left">Role</th><th></th></tr></thead>
            <tbody>
              {users.map((u, i) => (
              <tr key={i} className="border-t border-border/60">
                  <td className="py-2 font-mono text-xs">{u.user_id}</td>
                  <td><span className="text-[10px] uppercase px-2 py-0.5 rounded bg-primary/15 text-primary-light border border-primary/30">{u.role}</span></td>
                  <td className="text-right"><button onClick={() => revokeRole(u.user_id, u.role as any)} className="btn-ghost text-xs">Revoke</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <ServerCog className="w-4 h-4 text-primary-light" />
          <h2 className="font-display font-semibold">MCP server connection</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">Manage the ChatGPT Apps / Claude / Lovable MCP bearer token and connection.</p>
        <Link to="/admin/mcp" className="btn-gradient text-sm">Open MCP admin</Link>
      </div>
    </section>
  );
}

function SettingRow({ label, type, help, value, onSave }:
  { label: string; type: string; help?: string; value: any; onSave: (v: any) => void }) {
  const [v, setV] = useState<any>(value ?? (type === "bool" ? false : ""));
  useEffect(() => { setV(value ?? (type === "bool" ? false : "")); }, [value, type]);
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</label>
      {type === "bool" ? (
        <div className="mt-2 flex items-center gap-2">
          <input type="checkbox" checked={!!v} onChange={(e) => setV(e.target.checked)} />
          <span className="text-sm">{v ? "Enabled" : "Disabled"}</span>
        </div>
      ) : (
        <input
          type={type === "secret" ? "password" : type === "number" ? "number" : "text"}
          value={v}
          onChange={(e) => setV(type === "number" ? e.target.value : e.target.value)}
          className="mt-2 w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
        />
      )}
      {help && <p className="text-[11px] text-muted-foreground mt-1">{help}</p>}
      <button onClick={() => onSave(v)} className="btn-ghost text-xs mt-3">Save</button>
    </div>
  );
}

export default function SuperAdmin() {
  return <RequireAdmin requireSuper><Inner /></RequireAdmin>;
}