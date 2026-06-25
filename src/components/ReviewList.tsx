import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Review = { id: string; rating: number; title: string | null; body: string | null; created_at: string };

export default function ReviewList({ businessId }: { businessId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    supabase
      .from("reviews")
      .select("id,rating,title,body,created_at")
      .eq("business_id", businessId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews((data as Review[]) || []));
  }, [businessId]);

  if (!reviews.length) return <p className="text-sm text-muted-foreground">No reviews yet. Be the first to write one.</p>;
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 rounded-xl bg-muted/20 border border-border/60">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: r.rating }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          {r.title && <div className="font-semibold text-sm mb-1">{r.title}</div>}
          <p className="text-sm text-foreground/85">{r.body}</p>
          <div className="text-[11px] text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}