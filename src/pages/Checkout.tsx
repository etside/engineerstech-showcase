import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import { cartApi, orderApi, type CartResponse } from "@/lib/api";
import { useAuth } from "@/lib/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { setPageMeta } from "@/lib/seo";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.show,
  });

  useEffect(() => {
    setPageMeta("Checkout | Marketplace", "Complete your order");
  }, []);

  const [form, setForm] = useState({
    buyer_name: user?.email?.split("@")[0] || "",
    buyer_email: user?.email || "",
    buyer_phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Bangladesh",
    payment_method: "cod",
    notes: "",
  });

  const placeOrder = useMutation({
    mutationFn: () => orderApi.create({
      shipping_address: {
        name: form.buyer_name,
        line1: form.address_line1,
        line2: form.address_line2,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,
      },
      buyer_email: form.buyer_email,
      buyer_phone: form.buyer_phone,
      buyer_name: form.buyer_name,
      payment_method: form.payment_method,
      notes: form.notes,
    }),
    onSuccess: (order) => {
      toast({ title: "Order placed!", description: `Order ${order.order_number} has been placed successfully.` });
      navigate(`/orders/${order.id}`);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-tight py-12">
          <div className="h-8 w-48 bg-muted/30 rounded animate-pulse mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted/30 rounded animate-pulse" />)}</div>
            <div className="h-64 bg-muted/30 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2 space-y-8">
            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" /> Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input name="buyer_name" value={form.buyer_name} onChange={handleChange} placeholder="Full Name" required className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input name="buyer_email" value={form.buyer_email} onChange={handleChange} placeholder="Email" type="email" required className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input name="buyer_phone" value={form.buyer_phone} onChange={handleChange} placeholder="Phone" className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 sm:col-span-2" />
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <input name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="Address Line 1" required className="w-full px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <input name="address_line2" value={form.address_line2} onChange={handleChange} placeholder="Address Line 2 (optional)" className="w-full px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input name="state" value={form.state} onChange={handleChange} placeholder="State / Division" className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <input name="postal_code" value={form.postal_code} onChange={handleChange} placeholder="Postal Code" className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h2>
              <div className="space-y-2">
                {[
                  { value: "cod", label: "Cash on Delivery" },
                  { value: "bkash", label: "bKash" },
                  { value: "nagad", label: "Nagad" },
                  { value: "rocket", label: "Rocket" },
                  { value: "sslcommerz", label: "Card / Online Payment" },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.payment_method === opt.value ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}>
                    <input type="radio" name="payment_method" value={opt.value} checked={form.payment_method === opt.value} onChange={handleChange} className="accent-primary" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Order notes (optional)" rows={3}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </div>

          {/* Order summary */}
          <div className="glass-card rounded-xl p-6 border border-border/30 h-fit">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="font-medium">৳{item.line_total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border/30 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>Varies</span></div>
              <div className="flex justify-between font-bold text-foreground text-lg pt-2 border-t border-border/30">
                <span>Total</span><span>৳{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => placeOrder.mutate()} disabled={placeOrder.isPending}
              className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {placeOrder.isPending ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
