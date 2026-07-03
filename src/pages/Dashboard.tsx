import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles, ExternalLink, TrendingUp, CreditCard,
  Bot, CheckCircle2, Info,
} from "lucide-react";
import { authApi, businessApi } from "@/lib/api";
import { invokeFn } from "@/lib/fn";
import OnboardingStepper from "@/components/OnboardingStepper";
import VerificationPanel from "@/components/VerificationPanel";

type Biz = {
  id: string;
  slug: string;
  name: string;
  tier: string;
  verification_status: string;
  rating: number;
  review_count: number;
  geo_score: number;
  is_active: boolean;
  ai_listing_enabled: boolean;
  ai_listing_source: "paid" | "admin" | null;
  short_description?: string;
  website?: string;
  city?: string;
  country?: string;
  category_name?: string;
};

export default function Dashboard() {
  const [searchParams]           = useSearchParams();
  const nav                      = useNavigate();
  const [items, setItems]        = useState<Biz[]>([]);
  const [authed, setAuthed]      = useState<boolean | null>(null);
  const [userId, setUserId]      = useState<string | null>(null);

  useEffect(() => {
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    (async () => {
      const { user } = await authApi.me();
      if (!user) { setAuthed(false); return; }
      setAuthed(true);
      setUserId(user.id);

      async function fetchMyBiz() {
        const res    = await businessApi.list({ limit: 100, status: "" });
        const allBiz = (res.data || []) as any[];
        return allBiz.filter((b: any) => b.owner_id === user!.id) as Biz[];
      }

      setItems(await fetchMyBiz());

      pollTimer = setInterval(async () => {
        try { setItems(await fetchMyBiz()); } catch { /* silent */ }
      }, 30_000);
    })();

    const p = searchParams.get("payment");
    if (p === "success") toast.success("Payment complete — subscription active");
    else if (p === "fail")   toast.error("Payment failed. Please try again.");
    else if (p === "cancel") toast("Payment cancelled.");

    return () => { if (pollTimer) clearInterval(pollTimer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function regen(id: string) {
    toast.promise(
      invokeFn("geo-summarize", { businessId: id }),
      {
        loading: "Refreshing AI summary…",
        success: "AI summary updated",
        error:   (e) => (e as Error).message,
      },
    );
  }

  async function upgrade(id: string, tier: string) {
    try {
      const data = await invokeFn<{ gatewayUrl: string }>("sslcz-init", {
        businessId:   id,
        tierSlug:     tier,
        returnOrigin: window.location.origin,
      });
      window.location.href = data.gatewayUrl;
    } catch (e) { toast.error((e as Error).message); }
  }

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (authed === false) {
    return (
      <div className="container-tight py-20 text-center space-y-4">
        <p className="text-muted-foreground">Sign in to manage your listings.</p>
        <Link className="btn-gradient" to="/auth">Sign in</Link>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="container-tight py-20 text-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <section className="container-tight py-12 space-y-6">

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="display-3">Vendor Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your business listings and AI visibility.
          </p>
        </div>
        <Link to="/submit" className="btn-gradient text-sm">+ New listing</Link>
      </div>

      {/* ── How AI listing works info box ──────────────────────────────────── */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3">
        <Info className="size-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="text-foreground font-semibold">AI &amp; GEO SEO listing</span> —
            upgrade to <strong className="text-blue-400">Pro, Featured, or Enterprise</strong> to
            have your business automatically included in ChatGPT, Claude, Cursor, and other
            AI tools that connect to our MCP server.
          </p>
          <p className="text-xs">
            Once you pay, your listing is queued for admin review. After verification your business
            will appear in AI search results across all connected clients.
          </p>
        </div>
      </div>

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {items.length === 0 && (
        <div className="glass-card p-10 text-center space-y-4">
          <p className="text-muted-foreground">You haven't submitted any listings yet.</p>
          <Link to="/submit" className="btn-gradient text-sm">Create your first listing</Link>
        </div>
      )}

      {/* ── Listing cards ──────────────────────────────────────────────────── */}
      <div className="grid gap-5">
        {items.map((b) => {
          const isPaid   = b.tier !== "free";
          const verified = b.verification_status === "verified";
          const live     = b.is_active && verified && isPaid;

          return (
            <div key={b.id} className="glass-card p-5 space-y-4">

              {/* Onboarding progress tracker */}
              <OnboardingStepper
                state={{ submitted: true, paid: isPaid, verified, live }}
              />

              {/* Business summary row */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2 min-w-0">

                  {/* Name + badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-lg leading-tight">
                      {b.name}
                    </h3>

                    {/* Tier */}
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-primary/15 text-primary-light border border-primary/30">
                      {b.tier}
                    </span>

                    {/* Verification */}
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${
                      verified
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}>
                      {b.verification_status}
                    </span>

                    {/* AI listing */}
                    {b.ai_listing_enabled ? (
                      <span className="text-[10px] px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30 flex items-center gap-1">
                        <Bot className="size-2.5" />
                        In AI index
                        {b.ai_listing_source === "admin" && " (admin promoted)"}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded border bg-muted text-muted-foreground">
                        Not in AI index
                      </span>
                    )}

                    {!b.is_active && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      GEO score: {b.geo_score ?? 0}
                    </span>
                    <span>★ {Number(b.rating).toFixed(1)} ({b.review_count} reviews)</span>
                    {b.category_name && <span>📂 {b.category_name}</span>}
                    {(b.city || b.country) && (
                      <span>📍 {[b.city, b.country].filter(Boolean).join(", ")}</span>
                    )}
                    {b.website && (
                      <a href={b.website} target="_blank" rel="noreferrer"
                        className="text-primary hover:underline truncate max-w-[200px]">
                        {b.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>

                  {/* Short description */}
                  {b.short_description && (
                    <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                      {b.short_description}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Link to={`/business/${b.slug}`} className="btn-ghost text-xs">
                    <ExternalLink className="w-3 h-3" /> View listing
                  </Link>
                  <button onClick={() => regen(b.id)} className="btn-ghost text-xs">
                    <Sparkles className="w-3 h-3" /> Refresh AI summary
                  </button>
                  {!isPaid && (
                    <button
                      onClick={() => nav(`/pricing?biz=${b.id}`)}
                      className="btn-gradient text-xs">
                      <CreditCard className="w-3 h-3" /> Choose plan & activate
                    </button>
                  )}
                  {isPaid && b.tier === "pro" && (
                    <button
                      onClick={() => upgrade(b.id, "featured")}
                      className="btn-gradient text-xs">
                      Upgrade to Featured
                    </button>
                  )}
                  {isPaid && b.tier === "featured" && (
                    <button
                      onClick={() => upgrade(b.id, "enterprise")}
                      className="btn-gradient text-xs">
                      Upgrade to Enterprise
                    </button>
                  )}
                </div>
              </div>

              {/* Upgrade prompt for free tier */}
              {!isPaid && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex items-start gap-3">
                  <Bot className="size-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">
                      Not yet in the AI index.
                    </span>{" "}
                    Upgrade to <strong>Pro, Featured, or Enterprise</strong> to have your
                    business listed in ChatGPT, Claude, Cursor, Windsurf, and other MCP-connected
                    AI tools. Admin will activate your AI listing after verifying your payment.{" "}
                    <button
                      onClick={() => nav(`/pricing?biz=${b.id}`)}
                      className="text-primary underline">
                      See plans →
                    </button>
                  </div>
                </div>
              )}

              {/* Already in AI index — success state */}
              {b.ai_listing_enabled && (
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">
                      Your business is live in the AI index.
                    </span>{" "}
                    It will appear when users query ChatGPT, Claude, Cursor, Windsurf, and any
                    other AI tool connected to the engineersTech MCP server.
                  </p>
                </div>
              )}

              {/* Verification panel */}
              <VerificationPanel businessId={b.id} />

            </div>
          );
        })}
      </div>
    </section>
  );
}
