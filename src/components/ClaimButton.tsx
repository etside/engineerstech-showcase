import { useState } from "react";
import { toast } from "sonner";
import { claimApi, authApi } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function ClaimButton({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const { user } = await authApi.me();
      if (!user) { toast.error("Sign in to claim"); setLoading(false); return; }
      await claimApi.submit({ business_id: businessId, evidence, claim_type: "initial" });
      toast.success("Claim submitted — admin will review");
      setOpen(false); setEvidence("");
    } catch (err) {
      toast.error((err as Error).message);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><ShieldCheck className="w-4 h-4 mr-1" /> Claim listing</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Claim this business</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Tell us how you're connected (role, company email domain, social proof).</p>
        <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} rows={5} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm" />
        <Button onClick={submit} disabled={loading || !evidence.trim()}>{loading ? "Submitting…" : "Submit claim"}</Button>
      </DialogContent>
    </Dialog>
  );
}
