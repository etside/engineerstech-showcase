import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RequireAdmin from "@/components/RequireAdmin";
import ReviewsModerationUI from "@/components/ReviewsModerationUI";
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
  async function updateBusiness(id: string, patch: any) {
    const { error } = await supabase.from("businesses").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated"); load();
  }
  async function verifyBusiness(id: string) {
    const { error } = await supabase.from("businesses").update({ verification_status: "verified", is_verified: true }).eq("id", id);
    if (error) return toast.error(error.message);
    await (supabase.rpc as any)("refresh_business_active", { _business_id: id }).catch(() => null);
    toast.success("Verified. Listing will go live once payment is active.");
    load();
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
            <Button size="sm" variant="outline" onClick={() => updateBusiness(b.id, { is_active: !b.is_active })}>{b.is_active ? "Hide" : "Activate"}</Button>
            <Button size="sm" variant="outline" onClick={() => verifyBusiness(b.id)}>Verify</Button>
            <select value={b.tier} onChange={(e) => updateBusiness(b.id, { tier: e.target.value })} className="text-xs rounded border px-2 bg-background">
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
  const [openId, setOpenId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [docsReq, setDocsReq] = useState("");
  const [audits, setAudits] = useState<Record<string, any[]>>({});
  async function load() {
    const { data } = await supabase.from("business_claims")
      .select("id,evidence,status,rejection_reason,additional_docs_requested,claim_type,user_id,reviewed_at,created_at,business_id,businesses(name,slug)")
      .order("created_at", { ascending: false }).limit(100);
    setRows(data || []);
  }
  useEffect(() => { load(); }, []);
  async function loadAudit(bizId: string) {
    const { data } = await supabase.from("claim_audit_log")
      .select("id,action,actor_role,notes,created_at").eq("business_id", bizId)
      .order("created_at", { ascending: false });
    setAudits((a) => ({ ...a, [bizId]: data || [] }));
  }
  async function decide(
    claim: any,
    status: "approved" | "rejected" | "needs_more_info",
    extra: { rejection_reason?: string; additional_docs_requested?: string; notes?: string } = {},
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    const patch: any = { status, reviewed_at: new Date().toISOString(), reviewed_by: user?.id };
    if (extra.rejection_reason) patch.rejection_reason = extra.rejection_reason;
    if (extra.additional_docs_requested) patch.additional_docs_requested = extra.additional_docs_requested;
    const { error } = await supabase.from("business_claims").update(patch).eq("id", claim.id);
    if (error) return toast.error(error.message);
    if (status === "approved") {
      await supabase.from("businesses").update({
        claimed_by: claim.user_id,
        verification_status: "verified",
        is_verified: true,
      }).eq("id", claim.business_id);
      // Activate if also paid (RPC checks both)
      await (supabase.rpc as any)("refresh_business_active", { _business_id: claim.business_id });
    } else if (status === "rejected") {
      await supabase.from("businesses").update({ verification_status: "rejected", is_verified: false, is_active: false }).eq("id", claim.business_id);
    } else {
      await supabase.from("businesses").update({ verification_status: "needs_more_info" }).eq("id", claim.business_id);
    }
    await supabase.from("claim_audit_log").insert({
      claim_id: claim.id, business_id: claim.business_id, actor_id: user?.id, actor_role: "admin",
      action: status, notes: extra.notes || extra.rejection_reason || extra.additional_docs_requested || null,
    });
    toast.success("Claim " + status.replace(/_/g, " "));
    setOpenId(null); setReason(""); setDocsReq("");
    load();
  }
  return (
    <div className="space-y-2">
      {rows.map((c) => (
        <div key={c.id} className="glass-card p-4 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="font-semibold flex items-center gap-2">
              <Link to={`/business/${c.businesses?.slug}`} className="hover:text-primary-light">{c.businesses?.name}</Link>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">{c.claim_type}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{c.evidence}</p>
            <div className="text-[11px] text-muted-foreground mt-1">
              Status: <span className="font-semibold">{c.status}</span>
              {c.reviewed_at && <> · reviewed {new Date(c.reviewed_at).toLocaleString()}</>}
            </div>
            {c.rejection_reason && <div className="text-[11px] text-rose-400 mt-1">Rejection: {c.rejection_reason}</div>}
            {c.additional_docs_requested && <div className="text-[11px] text-amber-400 mt-1">Requested: {c.additional_docs_requested}</div>}
            <button onClick={() => { loadAudit(c.business_id); setOpenId(openId === c.id ? null : c.id); }}
              className="text-[11px] text-primary-light hover:underline mt-2">
              {openId === c.id ? "Hide" : "View"} audit trail
            </button>
            {openId === c.id && (
              <ul className="mt-2 space-y-1 border-l-2 border-border pl-3">
                {(audits[c.business_id] || []).map((a) => (
                  <li key={a.id} className="text-[11px]">
                    <span className="font-semibold capitalize">{a.action.replace(/_/g," ")}</span>
                    <span className="text-muted-foreground"> · {a.actor_role} · {new Date(a.created_at).toLocaleString()}</span>
                    {a.notes && <div className="text-muted-foreground">— {a.notes}</div>}
                  </li>
                ))}
                {!(audits[c.business_id] || []).length && <li className="text-[11px] text-muted-foreground">No audit entries yet.</li>}
              </ul>
            )}
          </div>
          {(c.status === "pending" || c.status === "needs_more_info") && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => decide(c, "approved", { notes: "Approved by admin" })}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => {
                const r = window.prompt("Reason for rejection:");
                if (r) decide(c, "rejected", { rejection_reason: r });
              }}>Reject</Button>
              <Button size="sm" variant="outline" onClick={() => {
                const r = window.prompt("What additional documents are required?");
                if (r) decide(c, "needs_more_info", { additional_docs_requested: r });
              }}>Request docs</Button>
            </div>
          )}
        </div>
      ))}
      {!rows.length && <p className="text-muted-foreground">No claims.</p>}
    </div>
  );
}

function ReviewsAdmin() {
  return <ReviewsModerationUI />;
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

function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [draft, setDraft] = useState({ id: "", title: "", slug: "", excerpt: "", cover_url: "", tags: "", body_md: "", published: false });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from("blog_posts").select("id,slug,title,excerpt,cover_url,tags,body_md,published,published_at").order("created_at", { ascending: false }).limit(100);
    setPosts(data || []);
  }

  useEffect(() => { load(); }, []);

  function startNew() {
    setDraft({ id: "", title: "", slug: "", excerpt: "", cover_url: "", tags: "", body_md: "", published: false });
    setSelectedId(null);
  }

  function editPost(post: any) {
    setDraft({
      id: post.id,
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      cover_url: post.cover_url || "",
      tags: (post.tags || []).join(", "),
      body_md: post.body_md || "",
      published: post.published || false,
    });
    setSelectedId(post.id);
  }

  async function save() {
    const payload = {
      title: draft.title.trim(),
      slug: draft.slug.trim(),
      excerpt: draft.excerpt.trim() || null,
      cover_url: draft.cover_url.trim() || null,
      tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
      body_md: draft.body_md,
      published: draft.published,
      published_at: draft.published ? new Date().toISOString() : null,
    };
    let error;
    if (draft.id) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", draft.id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success("Blog post saved");
    load();
    startNew();
  }

  async function removePost() {
    if (!draft.id) return;
    if (!window.confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", draft.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
    startNew();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-lg">Blog management</h2>
          <p className="text-sm text-muted-foreground">Create, edit, publish, and remove blog posts right from the admin dashboard.</p>
        </div>
        <Button size="sm" onClick={startNew}>New post</Button>
      </div>
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <div className="space-y-2">
          {posts.map((post) => (
            <button key={post.id} onClick={() => editPost(post)} className={`w-full text-left rounded-xl border p-4 ${selectedId === post.id ? "border-primary" : "border-border"}`}>
              <div className="font-semibold">{post.title || post.slug}</div>
              <div className="text-xs text-muted-foreground">{post.slug} · {post.published ? "Published" : "Draft"}</div>
            </button>
          ))}
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="grid gap-3">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Title</label>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Slug</label>
            <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Excerpt</label>
            <textarea value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm" />
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Cover URL</label>
            <Input value={draft.cover_url} onChange={(e) => setDraft({ ...draft, cover_url: e.target.value })} />
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Tags</label>
            <Input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="ai, geo, mcp" />
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Markdown body</label>
            <textarea value={draft.body_md} onChange={(e) => setDraft({ ...draft, body_md: e.target.value })} rows={8} className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm font-mono" />
            <div className="flex flex-wrap gap-2 items-center">
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Publish</label>
              <Button size="sm" onClick={save}>Save</Button>
              {draft.id && <Button size="sm" variant="outline" onClick={removePost}>Delete</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAdmin() {
  const PAGES = ["home", "contact"];
  const [page, setPage] = useState("home");
  const [rows, setRows] = useState<any[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function load() {
    const { data } = await supabase.from("page_contents" as any).select("id,page,key,value,updated_at").order("page").order("key");
    setRows((data || []).map((row: any) => ({ ...row, editValue: typeof row.value === "object" ? JSON.stringify(row.value, null, 2) : String(row.value) })));
  }

  useEffect(() => { load(); }, []);

  async function saveRow(row: any) {
    let parsedValue: any = row.editValue;
    if (parsedValue.trim().startsWith("[") || parsedValue.trim().startsWith("{")) {
      try { parsedValue = JSON.parse(parsedValue); } catch { return toast.error("Invalid JSON"); }
    }
    const { error } = await supabase.from("page_contents" as any).update({ value: parsedValue, updated_at: new Date().toISOString() }).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    load();
  }

  async function createRow() {
    if (!newKey.trim()) return toast.error("Enter a key");
    let parsedValue: any = newValue;
    if (newValue.trim().startsWith("[") || newValue.trim().startsWith("{")) {
      try { parsedValue = JSON.parse(newValue); } catch { return toast.error("Invalid JSON"); }
    }
    const { error } = await supabase.from("page_contents" as any).insert({ page, key: newKey.trim(), value: parsedValue });
    if (error) return toast.error(error.message);
    toast.success("Created");
    setNewKey("");
    setNewValue("");
    load();
  }

  const filteredRows = rows.filter((row) => row.page === page);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 items-center">
        {PAGES.map((p) => (
          <button key={p} onClick={() => setPage(p)} className={`px-4 py-2 rounded-full text-sm ${page === p ? "bg-primary text-white" : "border border-border bg-background"}`}>
            {p === "home" ? "Homepage" : "Contact page"}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4">
          {filteredRows.map((row) => (
            <div key={row.id} className="glass-card p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-semibold">{row.key}</div>
                  <div className="text-[11px] text-muted-foreground">Updated {new Date(row.updated_at).toLocaleString()}</div>
                </div>
                <button className="text-xs text-primary-light" onClick={() => saveRow(row)}>Save</button>
              </div>
              <textarea value={row.editValue} onChange={(e) => setRows(rows.map((r) => r.id === row.id ? { ...r, editValue: e.target.value } : r))} rows={5} className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm font-mono" />
            </div>
          ))}
          {!filteredRows.length && <div className="glass-card p-4 text-sm text-muted-foreground">No content entries yet for this page.</div>}
        </div>
        <div className="glass-card p-6 space-y-3">
          <div className="text-sm font-semibold">Add a new content entry</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Key</label>
              <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="hero_headline" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Value</label>
              <textarea value={newValue} onChange={(e) => setNewValue(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm font-mono" placeholder='Use JSON for arrays/objects, plain text otherwise.' />
            </div>
            <Button size="sm" onClick={createRow}>Create entry</Button>
          </div>
        </div>
      </div>
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