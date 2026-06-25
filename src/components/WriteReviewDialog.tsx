import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WriteReviewDialog({ businessId, onDone }: { businessId: string; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Sign in to leave a review");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("reviews").insert({ business_id: businessId, author_id: user.id, rating, title, body });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Review posted");
    setOpen(false);
    setTitle(""); setBody(""); setRating(5);
    onDone?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Write a review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Write a review</DialogTitle></DialogHeader>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
              <Star className={`w-7 h-7 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full h-10 px-3 rounded-lg bg-muted/40 border border-border text-sm" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience…" rows={5} className="w-full px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm" />
        <Button onClick={submit} disabled={loading || !body.trim()}>{loading ? "Posting…" : "Post review"}</Button>
      </DialogContent>
    </Dialog>
  );
}