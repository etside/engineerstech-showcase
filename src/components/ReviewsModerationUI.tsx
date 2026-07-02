import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Star, CheckCircle, XCircle } from "lucide-react";
import { reviewApi, Review } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ReviewWithBusiness extends Review {
  businesses?: { name: string; slug: string };
}

export default function ReviewsModerationUI() {
  const [reviews, setReviews] = useState<ReviewWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "rejected">("pending");
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function loadReviews() {
    setLoading(true);
    try {
      const params: { status?: string; limit: number } = { limit: 50 };
      if (filter === "pending") params.status = "pending";
      else if (filter === "rejected") params.status = "rejected";
      const data = await reviewApi.list(params);
      setReviews((data || []) as ReviewWithBusiness[]);
    } catch {
      toast.error("Failed to load reviews");
    }
    setLoading(false);
  }

  async function approveReview(id: string) {
    try {
      await reviewApi.update(id, { status: "approved" });
      toast.success("Review approved");
      setReviews(reviews.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to approve review");
    }
  }

  async function rejectReview(id: string) {
    try {
      await reviewApi.update(id, { status: "rejected" });
      toast.success("Review rejected");
      setReviews(reviews.filter((r) => r.id !== id));
      setRejectionReason({ ...rejectionReason, [id]: "" });
    } catch {
      toast.error("Failed to reject review");
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
