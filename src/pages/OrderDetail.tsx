import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react";
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

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.get(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (order) setPageMeta(`Order ${order.order_number} | Marketplace`, "Order details");
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-tight py-12">
          <div className="h-8 w-48 bg-muted/30 rounded animate-pulse mb-8" />
          <div className="h-64 bg-muted/30 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Order not found</h2>
          <Link to="/orders" className="text-primary mt-4 inline-block hover:underline">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);
  const shipping = order.shipping_address as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/orders" className="hover:text-primary flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Orders</Link>
          <span>/</span>
          <span className="text-foreground">{order.order_number}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Order {order.order_number}</h1>
          <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Status Progress */}
        <div className="glass-card rounded-xl p-6 border border-border/30 mb-8">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {i === 0 && <Package className="w-4 h-4" />}
                  {i === 1 && <CheckCircle className="w-4 h-4" />}
                  {i === 2 && <Truck className="w-4 h-4" />}
                  {i === 3 && <Package className="w-4 h-4" />}
                </div>
                <span className="text-xs mt-2 capitalize text-center">{step}</span>
                {i < statusSteps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} style={{ zIndex: -1 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Items */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">Items</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 glass-card rounded-xl border border-border/30">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.product_name}</h3>
                    {item.variant_name && <p className="text-sm text-muted-foreground">{item.variant_name}</p>}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-semibold text-foreground">৳{item.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 border border-border/30">
              <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{order.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>৳{order.shipping_amount.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-foreground text-lg pt-2 border-t border-border/30">
                  <span>Total</span><span>৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {shipping && (
              <div className="glass-card rounded-xl p-6 border border-border/30">
                <h2 className="text-lg font-bold text-foreground mb-3">Shipping Address</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  {shipping.name && <p className="font-medium text-foreground">{shipping.name}</p>}
                  {shipping.line1 && <p>{shipping.line1}</p>}
                  {shipping.line2 && <p>{shipping.line2}</p>}
                  <p>{[shipping.city, shipping.state, shipping.postal_code].filter(Boolean).join(', ')}</p>
                  {shipping.country && <p>{shipping.country}</p>}
                </div>
              </div>
            )}

            {order.buyer_email && (
              <div className="glass-card rounded-xl p-6 border border-border/30">
                <h2 className="text-lg font-bold text-foreground mb-3">Contact</h2>
                <div className="text-sm text-muted-foreground space-y-1">
                  {order.buyer_name && <p className="font-medium text-foreground">{order.buyer_name}</p>}
                  <p>{order.buyer_email}</p>
                  {order.buyer_phone && <p>{order.buyer_phone}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
