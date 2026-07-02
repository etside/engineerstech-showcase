import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  author_id: string;
  business_id: string;
  created_at: string;
  businesses?: { name: string; slug: string };
  reviewer_name?: string;
}

export default function ReviewsModerationUI() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "rejected">("pending");
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  useEffect(() => {
    loadReviews();
  }, [filter]);

  async function loadReviews() {
    setLoading(true);
    let q = (supabase as any)
      .from("reviews")
      .select("id,rating,title,body,status,author_id,business_id,created_at,businesses(name,slug)")
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      q = q.eq("status", "pending");
    } else if (filter === "rejected") {
      q = q.eq("status", "rejected");
    }

    const { data, error } = await q.limit(50);
    if (error) {
      toast.error("Failed to load reviews");
      console.error(error);
    } else {
      setReviews(((data || []) as unknown) as Review[]);
    }
    setLoading(false);
  }

  async function approveReview(id: string) {
    const { error } = await (supabase as any)
      .from("reviews")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to approve review");
    } else {
      toast.success("Review approved");
      setReviews(reviews.filter((r) => r.id !== id));
    }
  }

  async function rejectReview(id: string) {
    const reason = rejectionReason[id] || "Violates community guidelines";
    const { error } = await (supabase as any)
      .from("reviews")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to reject review");
    } else {
      toast.success("Review rejected");
      setReviews(reviews.filter((r) => r.id !== id));
      setRejectionReason({ ...rejectionReason, [id]: "" });
    }
  }

  const stats = {
    pending: reviews.filter((r) => r.status === "pending").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold gradient-text">{stats.pending}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Pending Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold text-amber-400">{stats.rejected}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "rejected"].map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab as typeof filter)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No reviews to moderate</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{r.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      For <a href={`/business/${r.businesses?.slug}`} className="text-primary-light hover:underline">{r.businesses?.name}</a> • {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {r.status === "pending" && <Badge variant="outline">Pending</Badge>}
                    {r.status === "approved" && <Badge variant="outline" className="bg-green-500/15 text-green-400 border-green-500/30">Approved</Badge>}
                    {r.status === "rejected" && <Badge variant="outline" className="bg-red-500/15 text-red-400 border-red-500/30">Rejected</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground/80">{r.body}</p>

                <div className="flex gap-2 flex-wrap">
                  {r.status === "pending" && (
                    <>
                      <Button size="sm" variant="default" onClick={() => approveReview(r.id)}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectReview(r.id)}>
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {r.status !== "pending" && (
                    <Button size="sm" variant="outline" onClick={() => approveReview(r.id)}>
                      Approve Again
                    </Button>
                  )}
                </div>

                {r.status === "pending" && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Rejection Reason (if applicable)</label>
                    <Textarea
                      placeholder="Explain why this review is being rejected..."
                      value={rejectionReason[r.id] || ""}
                      onChange={(e) => setRejectionReason({ ...rejectionReason, [r.id]: e.target.value })}
                      className="text-xs h-20"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
