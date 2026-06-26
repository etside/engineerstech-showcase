import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles, ExternalLink, TrendingUp, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { invokeFn } from "@/lib/fn";
import OnboardingStepper from "@/components/OnboardingStepper";
import VerificationPanel from "@/components/VerificationPanel";

type Biz = { id: string; slug: string; name: string; tier: string; verification_status: string; rating: number; review_count: number; geo_score: number; is_active: boolean };

export default function Dashboard() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [items, setItems] = useState<Biz[]>([]);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let ch: ReturnType<typeof supabase.channel> | null = null;
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
      const ids = (data || []).map((d: any) => d.id);
      if (ids.length) {
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("business_id,status")
          .in("business_id", ids)
          .eq("status", "active");
        setPaidIds(new Set((subs || []).map((s: any) => s.business_id)));
        // realtime: refresh on any change to my businesses
        ch = supabase.channel(`biz-${user.id}-${Math.random().toString(36).slice(2,8)}`)
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "businesses" }, (payload: any) => {
            if (!ids.includes(payload.new?.id)) return;
            setItems((prev) => prev.map((p) => p.id === payload.new.id ? { ...p, ...payload.new } : p));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions" }, async () => {
            const { data: s2 } = await supabase.from("subscriptions").select("business_id,status").in("business_id", ids).eq("status", "active");
            setPaidIds(new Set((s2 || []).map((s: any) => s.business_id)));
          })
          .subscribe();
      }
    })();
    const p = params.get("payment");
    if (p === "success") toast.success("Payment complete — subscription active");
    else if (p === "fail") toast.error("Payment failed");
    else if (p === "cancel") toast("Payment cancelled");
    return () => { if (ch) supabase.removeChannel(ch); };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

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
        {items.map((b) => {
          const paid = paidIds.has(b.id);
          const verified = b.verification_status === "verified";
          const live = b.is_active && verified && paid;
          return (
          <div key={b.id} className="glass-card p-5">
            <div className="mb-4">
              <OnboardingStepper state={{ submitted: true, paid, verified, live }} />
            </div>
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
                {!paid
                  ? <button onClick={() => nav(`/pricing?biz=${b.id}`)} className="btn-gradient text-xs"><CreditCard className="w-3 h-3" /> Pay & activate</button>
                  : b.tier === "pro"
                    ? <button onClick={() => upgrade(b.id, "featured")} className="btn-gradient text-xs">Upgrade to Featured</button>
                    : null}
              </div>
            </div>
            <div className="mt-4">
              <VerificationPanel businessId={b.id} />
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}