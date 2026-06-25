import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, ExternalLink, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { invokeFn } from "@/lib/fn";

type Biz = { id: string; slug: string; name: string; tier: string; verification_status: string; rating: number; review_count: number; geo_score: number; is_active: boolean };

export default function Dashboard() {
  const [params] = useSearchParams();
  const [items, setItems] = useState<Biz[]>([]);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthed(false); return; }
      setAuthed(true);
      const { data } = await supabase
        .from("businesses")
        .select("id,slug,name,tier,verification_status,rating,review_count,geo_score,is_active")
        .or(`owner_id.eq.${user.id},claimed_by.eq.${user.id}`)
        .order("updated_at", { ascending: false });
      setItems((data as Biz[]) || []);
    })();
    const p = params.get("payment");
    if (p === "success") toast.success("Payment complete — subscription active");
    else if (p === "fail") toast.error("Payment failed");
    else if (p === "cancel") toast("Payment cancelled");
  }, []);

  async function regen(id: string) {
    toast.promise(invokeFn("geo-summarize", { businessId: id }), { loading: "Summarizing reviews…", success: "AI summary refreshed", error: (e) => (e as Error).message });
  }

  async function upgrade(id: string, tier: string) {
    try {
      const data = await invokeFn<{ gatewayUrl: string }>("sslcz-init", { businessId: id, tierSlug: tier, returnOrigin: window.location.origin });
      window.location.href = data.gatewayUrl;
    } catch (e) { toast.error((e as Error).message); }
  }

  if (authed === false) return <div className="container-tight py-20 text-center"><Link className="btn-gradient" to="/auth">Sign in</Link></div>;

  return (
    <section className="container-tight py-12 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="display-3">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings, reviews, and AI visibility.</p>
        </div>
        <Link to="/submit" className="btn-gradient text-sm">+ New listing</Link>
      </div>

      {!items.length && (
        <div className="glass-card p-10 text-center">
          <p className="mb-4 text-muted-foreground">No listings yet.</p>
          <Link to="/submit" className="btn-gradient text-sm">Create your first listing</Link>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((b) => (
          <div key={b.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-lg">{b.name}</h3>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-primary/15 text-primary-light border border-primary/30">{b.tier}</span>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${b.verification_status === "verified" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"}`}>
                    {b.verification_status}
                  </span>
                  {!b.is_active && <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">inactive</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex gap-4">
                  <span><TrendingUp className="w-3 h-3 inline" /> GEO {b.geo_score}</span>
                  <span>★ {Number(b.rating).toFixed(1)} ({b.review_count})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/business/${b.slug}`} className="btn-ghost text-xs"><ExternalLink className="w-3 h-3" /> View</Link>
                <button onClick={() => regen(b.id)} className="btn-ghost text-xs"><Sparkles className="w-3 h-3" /> Refresh AI summary</button>
                {b.tier === "free" && <button onClick={() => upgrade(b.id, "pro")} className="btn-gradient text-xs">Upgrade to Pro</button>}
                {b.tier === "pro" && <button onClick={() => upgrade(b.id, "featured")} className="btn-gradient text-xs">Upgrade to Featured</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}