import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Eye } from "lucide-react";
import { orderApi, type Order } from "@/lib/api";
import { useEffect } from "react";
import { setPageMeta } from "@/lib/seo";

function statusColor(status: string) {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "confirmed": return "bg-blue-100 text-blue-800";
    case "shipped": return "bg-purple-100 text-purple-800";
    case "delivered": return "bg-green-100 text-green-800";
    case "cancelled": return "bg-red-100 text-red-800";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.list,
  });

  useEffect(() => {
    setPageMeta("My Orders | Marketplace", "View your order history");
  }, []);

  const orders = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-tight py-12">
          <div className="h-8 w-48 bg-muted/30 rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted/30 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">No orders yet</h2>
          <p className="text-muted-foreground mt-2">Your order history will appear here</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="glass-card rounded-xl p-5 border border-border/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{order.order_number}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''} · ৳{order.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
