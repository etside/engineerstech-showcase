import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw, FileText, History } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Claim = {
  id: string;
  business_id: string;
  status: string;
  evidence: string;
  rejection_reason: string | null;
  additional_docs_requested: string | null;
  claim_type: string;
  created_at: string;
  reviewed_at: string | null;
};

type Audit = {
  id: string;
  action: string;
  actor_role: string;
  notes: string | null;
  created_at: string;
};

export default function VerificationPanel({ businessId }: { businessId: string }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [evidence, setEvidence] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data: c } = await supabase
      .from("business_claims")
      .select("id,business_id,status,evidence,rejection_reason,additional_docs_requested,claim_type,created_at,reviewed_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });
    setClaims((c as Claim[]) || []);
    const { data: a } = await supabase
      .from("claim_audit_log")
      .select("id,action,actor_role,notes,created_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(20);
    setAudits((a as Audit[]) || []);
  }

  useEffect(() => { load(); }, [businessId]);

  // realtime: claim updates
  useEffect(() => {
    const ch = supabase.channel(`claims-${businessId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "business_claims", filter: `business_id=eq.${businessId}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "claim_audit_log", filter: `business_id=eq.${businessId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [businessId]);

  const latest = claims[0];
  const canResubmit = !latest || latest.status === "rejected" || latest.status === "needs_more_info";

  async function resubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!evidence.trim()) return toast.error("Add some evidence");
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }
    const { data: ins, error } = await supabase.from("business_claims").insert({
      business_id: businessId,
      user_id: user.id,
      evidence,
      status: "pending",
      claim_type: latest ? "resubmission" : "initial",
    }).select("id").maybeSingle();
    if (error) { setBusy(false); return toast.error(error.message); }
    if (ins) {
      await supabase.from("claim_audit_log").insert({
        claim_id: ins.id, business_id: businessId, actor_id: user.id, actor_role: "owner",
        action: latest ? "resubmitted" : "submitted",
        notes: "Owner submitted verification evidence",
      });
      // Reset listing back to pending review
      await supabase.from("businesses").update({ verification_status: "pending" }).eq("id", businessId);
    }
    setEvidence("");
    setBusy(false);
    toast.success("Evidence submitted — admin will review shortly");
    load();
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
