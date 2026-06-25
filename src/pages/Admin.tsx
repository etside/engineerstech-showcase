import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RequireAdmin from "@/components/RequireAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Overview() {
  const [stats, setStats] = useState({ businesses: 0, pendingClaims: 0, pendingReviews: 0, subs: 0 });
  useEffect(() => {
    (async () => {
      const [b, c, r, s] = await Promise.all([
        supabase.from("businesses").select("id", { count: "exact", head: true }),
        supabase.from("business_claims").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      setStats({ businesses: b.count || 0, pendingClaims: c.count || 0, pendingReviews: r.count || 0, subs: s.count || 0 });
    })();
  }, []);
  const tiles = [
    { l: "Listings", v: stats.businesses }, { l: "Pending claims", v: stats.pendingClaims },
    { l: "Pending reviews", v: stats.pendingReviews }, { l: "Active subscriptions", v: stats.subs },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((t) => (
        <Card key={t.l}><CardContent className="p-5"><div className="text-3xl font-bold gradient-text">{t.v}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{t.l}</div></CardContent></Card>
      ))}
      <Card className="sm:col-span-2 lg:col-span-4"><CardHeader><CardTitle>Quick links</CardTitle></CardHeader><CardContent className="flex gap-2 flex-wrap">
        <Link to="/admin/mcp" className="btn-ghost text-xs">MCP server config</Link>
        <a href="/functions/v1/geo-feed" target="_blank" className="btn-ghost text-xs">Public LLM feed</a>
      </CardContent></Card>
    </div>
  );
}

function ListingsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from("businesses").select("id,name,slug,tier,verification_status,is_active,rating,review_count").order("created_at", { ascending: false }).limit(100);
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);
  async function upd(id: string, patch: any) {
    const { error } = await supabase.from("businesses").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated"); load();
  }
  return (
    <div className="space-y-2">
      {rows.map((b) => (
        <div key={b.id} className="glass-card p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Link to={`/business/${b.slug}`} className="font-semibold hover:text-primary-light">{b.name}</Link>
            <div className="text-xs text-muted-foreground">{b.tier} · {b.verification_status} · ★{Number(b.rating).toFixed(1)} ({b.review_count})</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => upd(b.id, { is_active: !b.is_active })}>{b.is_active ? "Hide" : "Activate"}</Button>
            <Button size="sm" variant="outline" onClick={() => upd(b.id, { verification_status: "verified", is_verified: true, is_active: true })}>Verify</Button>
            <select value={b.tier} onChange={(e) => upd(b.id, { tier: e.target.value })} className="text-xs rounded border px-2 bg-background">
              {["free","pro","featured","enterprise"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClaimsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from("business_claims").select("id,evidence,status,created_at,business_id,businesses(name,slug)").order("created_at", { ascending: false }).limit(100);
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);
  async function decide(id: string, status: string, bizId: string, userId?: string) {
    const { error } = await supabase.from("business_claims").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    if (status === "approved" && userId) await supabase.from("businesses").update({ claimed_by: userId }).eq("id", bizId);
    toast.success("Claim " + status); load();
  }
  return (
    <div className="space-y-2">
      {rows.map((c) => (
        <div key={c.id} className="glass-card p-4 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="font-semibold">{c.businesses?.name}</div>
            <p className="text-sm text-muted-foreground mt-1">{c.evidence}</p>
            <div className="text-[11px] text-muted-foreground mt-1">{c.status}</div>
          </div>
          {c.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => decide(c.id, "approved", c.business_id)}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => decide(c.id, "rejected", c.business_id)}>Reject</Button>
            </div>
          )}
        </div>
      ))}
      {!rows.length && <p className="text-muted-foreground">No claims.</p>}
    </div>
  );
}

function ReviewsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from("reviews").select("id,rating,title,body,status,created_at,business_id,businesses(name,slug)").order("created_at", { ascending: false }).limit(100);
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);
  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated"); load();
  }
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="glass-card p-4 flex justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">{r.businesses?.name} · ★{r.rating} · {r.status}</div>
            <div className="font-semibold text-sm">{r.title}</div>
            <p className="text-sm text-muted-foreground">{r.body}</p>
          </div>
          <div className="flex gap-2">
            {r.status !== "approved" && <Button size="sm" onClick={() => setStatus(r.id, "approved")}>Approve</Button>}
            {r.status !== "hidden" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "hidden")}>Hide</Button>}
          </div>
        </div>
      ))}
      {!rows.length && <p className="text-muted-foreground">No reviews.</p>}
    </div>
  );
}

function PricingAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() { const { data } = await supabase.from("pricing_tiers").select("*").order("display_order"); setRows(data || []); }
  useEffect(() => { load(); }, []);
  async function save(t: any) {
    const { error } = await supabase.from("pricing_tiers").update({ name: t.name, price_usd: t.price_usd, price_bdt: t.price_bdt, is_active: t.is_active }).eq("id", t.id);
    if (error) toast.error(error.message); else { toast.success("Saved"); load(); }
  }
  return (
    <div className="space-y-3">
      {rows.map((t) => (
        <div key={t.id} className="glass-card p-4 grid sm:grid-cols-5 gap-2 items-center">
          <Input value={t.name} onChange={(e) => setRows(rows.map((r) => r.id === t.id ? { ...r, name: e.target.value } : r))} />
          <Input type="number" value={t.price_usd} onChange={(e) => setRows(rows.map((r) => r.id === t.id ? { ...r, price_usd: parseFloat(e.target.value) } : r))} placeholder="USD" />
          <Input type="number" value={t.price_bdt ?? ""} onChange={(e) => setRows(rows.map((r) => r.id === t.id ? { ...r, price_bdt: parseFloat(e.target.value) } : r))} placeholder="BDT" />
          <div className="flex items-center gap-2"><Switch checked={t.is_active} onCheckedChange={(v) => setRows(rows.map((r) => r.id === t.id ? { ...r, is_active: v } : r))} /><span className="text-xs">Active</span></div>
          <Button size="sm" onClick={() => save(t)}>Save</Button>
        </div>
      ))}
    </div>
  );
}

function SettingsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() { const { data } = await supabase.from("platform_settings").select("*").order("key"); setRows(data || []); }
  useEffect(() => { load(); }, []);
  async function save(key: string, value: any) {
    const { error } = await supabase.from("platform_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    if (error) toast.error(error.message); else toast.success(`${key} saved`);
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Includes SSLCommerz credentials, AI defaults, GEO weights, MCP global config.</p>
      {rows.map((s) => {
        const isBool = typeof s.value === "boolean";
        const isObj = typeof s.value === "object" && s.value !== null;
        return (
          <div key={s.key} className="glass-card p-4 space-y-2">
            <Label className="font-mono text-xs">{s.key}{s.is_secret && <span className="ml-2 text-[10px] uppercase text-amber-400">secret</span>}</Label>
            <p className="text-xs text-muted-foreground">{s.description}</p>
            {isBool ? (
              <div className="flex items-center gap-2"><Switch checked={s.value} onCheckedChange={(v) => { save(s.key, v); load(); }} /></div>
            ) : isObj ? (
              <textarea defaultValue={JSON.stringify(s.value, null, 2)} rows={4} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-xs font-mono" onBlur={(e) => { try { save(s.key, JSON.parse(e.target.value)); } catch { toast.error("Invalid JSON"); } }} />
            ) : (
              <div className="flex gap-2">
                <Input defaultValue={String(s.value)} type={s.is_secret ? "password" : "text"} onBlur={(e) => save(s.key, e.target.value)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Admin() {
  return (
    <RequireAdmin>
      <section className="container-tight py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="display-3">Admin</h1>
            <p className="text-muted-foreground">Full CMS for listings, reviews, billing, pricing, and platform config.</p>
          </div>
          <Link to="/admin/mcp" className="btn-ghost text-sm">MCP server →</Link>
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-5"><Overview /></TabsContent>
          <TabsContent value="listings" className="pt-5"><ListingsAdmin /></TabsContent>
          <TabsContent value="claims" className="pt-5"><ClaimsAdmin /></TabsContent>
          <TabsContent value="reviews" className="pt-5"><ReviewsAdmin /></TabsContent>
          <TabsContent value="pricing" className="pt-5"><PricingAdmin /></TabsContent>
          <TabsContent value="settings" className="pt-5"><SettingsAdmin /></TabsContent>
        </Tabs>
      </section>
    </RequireAdmin>
  );
}