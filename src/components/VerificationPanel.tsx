import { useEffect, useState, useRef } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw, FileText, History } from "lucide-react";
import { toast } from "sonner";
import { claimApi, businessApi, Claim, AuditLog } from "@/lib/api";

export default function VerificationPanel({ businessId }: { businessId: string }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [evidence, setEvidence] = useState("");
  const [busy, setBusy] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load() {
    try {
      const [c, a] = await Promise.all([
        claimApi.listByBusiness(businessId),
        claimApi.auditLog(businessId),
      ]);
      setClaims(c || []);
      setAudits(a || []);
    } catch {
      // Silently handle — claims may not be available
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [businessId]);

  // Poll for updates every 30s (replaces Supabase realtime)
  useEffect(() => {
    pollRef.current = setInterval(load, 30000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [businessId, load]);

  const latest = claims[0];
  const canResubmit = !latest || latest.status === "rejected" || latest.status === "needs_more_info";

  async function resubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!evidence.trim()) return toast.error("Add some evidence");
    setBusy(true);
    try {
      await claimApi.submit({
        business_id: businessId,
        evidence,
        claim_type: latest ? "resubmission" : "initial",
      });
      // Reset listing back to pending review
      await businessApi.update(businessId, { status: "pending" } as Record<string, unknown>);
      setEvidence("");
      toast.success("Evidence submitted — admin will review shortly");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
    setBusy(false);
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-light" />
          <h3 className="font-display font-semibold">Verification</h3>
        </div>
        {latest && (
          <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${
            latest.status === "approved" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : latest.status === "rejected" ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
            : latest.status === "needs_more_info" ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
            : "bg-primary/15 text-primary-light border-primary/30"
          }`}>{latest.status.replace(/_/g," ")}</span>
        )}
      </div>

      {latest?.status === "rejected" && latest.rejection_reason && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1"><ShieldAlert className="w-4 h-4" /> Rejection reason</div>
          <p className="text-muted-foreground">{latest.rejection_reason}</p>
        </div>
      )}

      {latest?.status === "needs_more_info" && latest.additional_docs_requested && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1"><FileText className="w-4 h-4" /> Documents requested</div>
          <p className="text-muted-foreground">{latest.additional_docs_requested}</p>
        </div>
      )}

      {canResubmit ? (
        <form onSubmit={resubmit} className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {latest ? "Resubmit evidence" : "Submit evidence"}
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={3}
            placeholder="Provide your role, business email domain, registration number, or links proving ownership."
            className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
          />
          <button disabled={busy} className="btn-gradient text-sm">
            <RefreshCw className="w-3.5 h-3.5" /> {busy ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      ) : latest?.status === "approved" ? (
        <p className="text-sm text-emerald-400">Verified by admin on {new Date(latest.reviewed_at!).toLocaleDateString()}.</p>
      ) : (
        <p className="text-sm text-muted-foreground">Your evidence is being reviewed. We typically respond within 24 hours.</p>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Verification history ({audits.length})</summary>
        <ul className="mt-3 space-y-2">
          {audits.map((a) => (
            <li key={a.id} className="text-xs border-l-2 border-border pl-3 py-1">
              <div className="font-semibold capitalize">{a.action.replace(/_/g," ")} <span className="text-muted-foreground font-normal">· {a.actor_role}</span></div>
              <div className="text-muted-foreground">{new Date(a.created_at).toLocaleString()}{a.notes ? ` — ${a.notes}` : ""}</div>
            </li>
          ))}
          {!audits.length && <li className="text-xs text-muted-foreground">No actions yet.</li>}
        </ul>
      </details>
    </div>
  );
}
