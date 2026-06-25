import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function ClaimButton({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to claim"); setLoading(false); return; }
    const { error } = await supabase.from("business_claims").insert({ business_id: businessId, user_id: user.id, evidence });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Claim submitted — admin will review");
    setOpen(false); setEvidence("");
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