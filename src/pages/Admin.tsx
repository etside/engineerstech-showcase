import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { adminApi, businessApi, categoryApi, reviewApi, contactApi } from "@/lib/api";
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
      try {
        const d = await adminApi.dashboard();
        setStats({
          businesses: d.total_businesses || 0,
          pendingClaims: (d as any).pending_claims || 0,
          pendingReviews: d.pending_reviews || 0,
          subs: d.total_subscribers || 0,
        });
      } catch { /* silent */ }
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
        <a href="/api/feed" target="_blank" className="btn-ghost text-xs">Public LLM feed</a>
      </CardContent></Card>
    </div>
  );
}

function ListingsAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  async function load() {
    try {
      const res = await businessApi.list({ limit: 100, status: "" });
      setRows(res.data || []);
    } catch { /* silent */ }
  }
  useEffect(() => { load(); }, []);
  async function updateBusiness(id: string, patch: any) {
    try {
      await businessApi.update(id, patch);
      toast.success("Updated"); load();
    } catch (err) { toast.error((err as Error).message); }
  }
  async function verifyBusiness(id: string) {
    try {
      await businessApi.update(id, { status: "approved", is_verified: true });
      toast.success("Verified. Listing is now live.");
      load();
    } catch (err) { toast.error((err as Error).message); }
  }
  return (
    <div className="space-y-2">
      {rows.map((b) => (
        <div key={b.id} className="glass-card p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <Link to={`/business/${b.slug}`} className="font-semibold hover:text-primary-light">{b.name}</Link>
            <div className="text-xs text-muted-foreground">{b.tier || b.status} · {b.verification_status || b.status} · ★{Number(b.rating).toFixed(1)} ({b.review_count})</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => updateBusiness(b.id, { status: b.status === "approved" ? "pending" : "approved" })}>{b.status === "approved" ? "Hide" : "Approve"}</Button>
            <Button size="sm" variant="outline" onClick={() => verifyBusiness(b.id)}>Verify</Button>
            <select value={b.tier || b.status} onChange={(e) => updateBusiness(b.id, { tier: e.target.value })} className="text-xs rounded border px-2 bg-background">
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

  async function load() {
    try {
      const data = await adminApi.claims();
      setRows((data as any) || []);
    } catch { /* silent */ }
  }
  useEffect(() => { load(); }, []);

  async function decide(claim: any, status: string) {
    try {
      await adminApi.reviewClaim(claim.id, status);
      toast.success("Claim " + status.replace(/_/g, " "));
      setOpenId(null);
      load();
    } catch (err) { toast.error((err as Error).message); }
  }

  return (
    <div className="space-y-2">
      {rows.map((c: any) => (
        <div key={c.id} className="glass-card p-4 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="font-semibold flex items-center gap-2">
              <span className="hover:text-primary-light">{c.business_name || c.business_id}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">{c.claim_type || "initial"}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{c.evidence}</p>
            <div className="text-[11px] text-muted-foreground mt-1">
              Status: <span className="font-semibold">{c.status}</span>
              {c.reviewed_at && <> · reviewed {new Date(c.reviewed_at).toLocaleString()}</>}
            </div>
            {c.rejection_reason && <div className="text-[11px] text-rose-400 mt-1">Rejection: {c.rejection_reason}</div>}
            {c.additional_docs_requested && <div className="text-[11px] text-amber-400 mt-1">Requested: {c.additional_docs_requested}</div>}
          </div>
          {(c.status === "pending" || c.status === "needs_more_info") && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => decide(c, "approved")}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => decide(c, "rejected")}>Reject</Button>
              <Button size="sm" variant="outline" onClick={() => decide(c, "needs_more_info")}>Request docs</Button>
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
  async function load() {
    try {
      const d = await adminApi.getSettings();
      const tiers = (d as any)?.pricing_tiers || [];
      setRows(tiers);
    } catch { /* silent */ }
  }
  useEffect(() => { load(); }, []);
  async function save(t: any) {
    try {
      const settings = await adminApi.getSettings();
      const tiers = ((settings as any)?.pricing_tiers || []).map((row: any) => row.id === t.id ? { ...row, ...t } : row);
      await adminApi.updateSettings({ pricing_tiers: tiers });
      toast.success("Saved"); load();
    } catch (err) { toast.error((err as Error).message); }
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
    try {
      const d = await adminApi.getSettings();
      const blogPosts = (d as any)?.blog_posts || [];
      setPosts(blogPosts);
    } catch { /* silent */ }
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
    try {
      const settings = await adminApi.getSettings();
      let blogPosts = (settings as any)?.blog_posts || [];
      if (draft.id) {
        blogPosts = blogPosts.map((p: any) => p.id === draft.id ? { ...p, ...payload } : p);
      } else {
        blogPosts = [{ ...payload, id: crypto.randomUUID() }, ...blogPosts];
      }
      await adminApi.updateSettings({ blog_posts: blogPosts });
      toast.success("Blog post saved");
      load();
      startNew();
    } catch (err) { toast.error((err as Error).message); }
  }

  async function removePost() {
    if (!draft.id) return;
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const settings = await adminApi.getSettings();
      const blogPosts = ((settings as any)?.blog_posts || []).filter((p: any) => p.id !== draft.id);
      await adminApi.updateSettings({ blog_posts: blogPosts });
      toast.success("Deleted");
      load();
      startNew();
    } catch (err) { toast.error((err as Error).message); }
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
    try {
      const d = await adminApi.getSettings();
      const contents = (d as any)?.page_contents || [];
      setRows(contents.map((row: any) => ({ ...row, editValue: typeof row.value === "object" ? JSON.stringify(row.value, null, 2) : String(row.value) })));
    } catch { /* silent */ }
  }

  useEffect(() => { load(); }, []);

  async function saveRow(row: any) {
    let parsedValue: any = row.editValue;
    if (parsedValue.trim().startsWith("[") || parsedValue.trim().startsWith("{")) {
      try { parsedValue = JSON.parse(parsedValue); } catch { return toast.error("Invalid JSON"); }
    }
    try {
      const settings = await adminApi.getSettings();
      const contents = ((settings as any)?.page_contents || []).map((r: any) =>
        r.id === row.id ? { ...r, value: parsedValue, updated_at: new Date().toISOString() } : r
      );
      await adminApi.updateSettings({ page_contents: contents });
      toast.success("Saved");
      load();
    } catch (err) { toast.error((err as Error).message); }
  }

  async function createRow() {
    if (!newKey.trim()) return toast.error("Enter a key");
    let parsedValue: any = newValue;
    if (newValue.trim().startsWith("[") || newValue.trim().startsWith("{")) {
      try { parsedValue = JSON.parse(newValue); } catch { return toast.error("Invalid JSON"); }
    }
    try {
      const settings = await adminApi.getSettings();
      const contents = [...((settings as any)?.page_contents || []), { id: crypto.randomUUID(), page, key: newKey.trim(), value: parsedValue, updated_at: new Date().toISOString() }];
      await adminApi.updateSettings({ page_contents: contents });
      toast.success("Created");
      setNewKey("");
      setNewValue("");
      load();
    } catch (err) { toast.error((err as Error).message); }
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

function CategoryAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [draft, setDraft] = useState({ id: "", name: "", slug: "", icon: "" });

  async function load() {
    try {
      const data = await categoryApi.list();
      setRows(data || []);
    } catch { /* silent */ }
  }
  useEffect(() => { load(); }, []);

  function startNew() {
    setDraft({ id: "", name: "", slug: "", icon: "" });
  }

  function editRow(row: any) {
    setDraft({ id: row.id, name: row.name || "", slug: row.slug || "", icon: row.icon || "" });
  }

  async function save() {
    if (!draft.name.trim()) return toast.error("Name is required");
    if (!draft.slug.trim()) return toast.error("Slug is required");
    // Categories are managed through the admin settings endpoint
    try {
      const settings = await adminApi.getSettings();
      const categories = (settings as any)?.categories || [];
      if (draft.id) {
        const updated = categories.map((c: any) => c.id === draft.id ? { ...c, name: draft.name, slug: draft.slug, icon: draft.icon } : c);
        await adminApi.updateSettings({ categories: updated });
      } else {
        const newCat = { id: crypto.randomUUID(), name: draft.name, slug: draft.slug, icon: draft.icon };
        await adminApi.updateSettings({ categories: [...categories, newCat] });
      }
      toast.success(draft.id ? "Category updated" : "Category created");
      load();
      startNew();
    } catch (err) { toast.error((err as Error).message); }
  }

  async function removeCategory(id: string) {
    if (!window.confirm("Delete this category?")) return;
    try {
      const settings = await adminApi.getSettings();
      const categories = ((settings as any)?.categories || []).filter((c: any) => c.id !== id);
      await adminApi.updateSettings({ categories });
      toast.success("Deleted");
      load();
      if (draft.id === id) startNew();
    } catch (err) { toast.error((err as Error).message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-lg">Category management</h2>
          <p className="text-sm text-muted-foreground">Add, edit, or remove business categories.</p>
        </div>
        <Button size="sm" onClick={startNew}>New category</Button>
      </div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="glass-card p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{r.icon || "\u{1F4C1}"}</span>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.slug}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => editRow(r)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => removeCategory(r.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {!rows.length && <p className="text-muted-foreground text-sm">No categories yet.</p>}
        </div>
        <div className="glass-card p-6 space-y-3">
          <div className="text-sm font-semibold">{draft.id ? "Edit category" : "New category"}</div>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Name</label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Restaurants" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Slug</label>
              <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="restaurants" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Icon (emoji)</label>
              <Input value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} placeholder="e.g. \u{1F37D}\u{FE0F}" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={save}>Save</Button>
              {draft.id && <Button size="sm" variant="outline" onClick={startNew}>Cancel</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactMessagesAdmin() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const settings = await adminApi.getSettings();
      const messages = (settings as any)?.contact_messages || [];
      setRows(messages);
    } catch { /* silent */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!window.confirm("Delete this message?")) return;
    try {
      const settings = await adminApi.getSettings();
      const messages = ((settings as any)?.contact_messages || []).filter((m: any) => m.id !== id);
      await adminApi.updateSettings({ contact_messages: messages });
      toast.success("Deleted");
      load();
    } catch (err) { toast.error((err as Error).message); }
  }

  if (loading) return <div className="text-muted-foreground text-sm py-8 text-center">Loading messages...</div>;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{rows.length} message{rows.length !== 1 ? "s" : ""}</p>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>
      {rows.map((m) => (
        <div key={m.id} className="glass-card p-5 space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold">{m.name}</div>
              <a href={`mailto:${m.email}`} className="text-xs text-primary-light hover:underline">{m.email}</a>
              {m.subject && <div className="text-xs text-muted-foreground mt-0.5">Subject: {m.subject}</div>}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
              <Button size="sm" variant="outline" onClick={() => remove(m.id)}>Delete</Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap border-t border-border pt-3">{m.message}</p>
        </div>
      ))}
      {!rows.length && <p className="text-muted-foreground text-sm">No messages yet.</p>}
    </div>
  );
}

function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, any>>({});

  async function load() {
    try {
      const data = await adminApi.getSettings();
      setSettings((data as Record<string, any>) || {});
    } catch { /* silent */ }
  }
  useEffect(() => { load(); }, []);

  async function save(key: string, value: any) {
    try {
      await adminApi.updateSettings({ [key]: value });
      toast.success(`${key} saved`);
      load();
    } catch (err) { toast.error((err as Error).message); }
  }

  const rows = Object.entries(settings).filter(([k]) => !["pricing_tiers", "blog_posts", "page_contents", "categories", "contact_messages"].includes(k));

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Includes SSLCommerz credentials, AI defaults, GEO weights, MCP global config.</p>
      {rows.map(([key, val]) => {
        const s = { key, value: val, is_secret: key.includes("passwd") || key.includes("secret") || key.includes("api_key"), description: "" };
        const isBool = typeof s.value === "boolean";
        const isObj = typeof s.value === "object" && s.value !== null;
        return (
          <div key={s.key} className="glass-card p-4 space-y-2">
            <Label className="font-mono text-xs">{s.key}{s.is_secret && <span className="ml-2 text-[10px] uppercase text-amber-400">secret</span>}</Label>
            {isBool ? (
              <div className="flex items-center gap-2"><Switch checked={s.value} onCheckedChange={(v) => { save(s.key, v); }} /></div>
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
          <Link to="/admin/mcp" className="btn-ghost text-sm">MCP server</Link>
        </div>
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-5"><Overview /></TabsContent>
          <TabsContent value="listings" className="pt-5"><ListingsAdmin /></TabsContent>
          <TabsContent value="claims" className="pt-5"><ClaimsAdmin /></TabsContent>
          <TabsContent value="reviews" className="pt-5"><ReviewsAdmin /></TabsContent>
          <TabsContent value="blog" className="pt-5"><BlogAdmin /></TabsContent>
          <TabsContent value="content" className="pt-5"><ContentAdmin /></TabsContent>
          <TabsContent value="categories" className="pt-5"><CategoryAdmin /></TabsContent>
          <TabsContent value="pricing" className="pt-5"><PricingAdmin /></TabsContent>
          <TabsContent value="messages" className="pt-5"><ContactMessagesAdmin /></TabsContent>
          <TabsContent value="settings" className="pt-5"><SettingsAdmin /></TabsContent>
        </Tabs>
      </section>
    </RequireAdmin>
  );
}
