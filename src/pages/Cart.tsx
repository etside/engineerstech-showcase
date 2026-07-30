import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { cartApi, type CartItem as CartItemType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { setPageMeta } from "@/lib/seo";

function CartItemRow({ item }: { item: CartItemType }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: (qty: number) => cartApi.update(item.id, qty),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: () => cartApi.remove(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Removed", description: "Item removed from cart" });
    },
  });

  return (
    <div className="flex gap-4 py-4 border-b border-border/30">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
        {item.featured_image || item.variant_image ? (
          <img src={item.variant_image || item.featured_image || ""} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.slug}`} className="font-medium text-foreground hover:text-primary truncate block">{item.name}</Link>
        {item.variant_name && <p className="text-sm text-muted-foreground mt-0.5">{item.variant_name}</p>}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => updateMutation.mutate(item.quantity - 1)} disabled={item.quantity <= 1}
              className="w-7 h-7 rounded border border-border/50 flex items-center justify-center hover:bg-muted/50 disabled:opacity-50">
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button onClick={() => updateMutation.mutate(item.quantity + 1)}
              className="w-7 h-7 rounded border border-border/50 flex items-center justify-center hover:bg-muted/50">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">৳{item.line_total.toLocaleString()}</span>
            <button onClick={() => removeMutation.mutate()} className="text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.show,
  });

  useEffect(() => {
    setPageMeta("Cart | Marketplace", "Your shopping cart");
  }, []);

  const items = data?.items ?? [];
  const subtotal = data?.subtotal ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-tight py-12">
          <div className="h-8 w-48 bg-muted/30 rounded animate-pulse mb-8" />
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />)}</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground mt-2">Browse our marketplace and add items to your cart</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-12">
        <h1 className="text-2xl font-bold text-foreground mb-8">Shopping Cart ({data?.item_count} items)</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="md:col-span-2">
            {items.map((item: CartItemType) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Order summary */}
          <div className="glass-card rounded-xl p-6 border border-border/30 h-fit">
            <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
              <div className="border-t border-border/30 pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-foreground text-lg">৳{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="mt-3 w-full py-2 text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
