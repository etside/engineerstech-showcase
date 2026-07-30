import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ShoppingCart, ChevronLeft, Package, Truck, Shield } from "lucide-react";
import { productApi, cartApi, type Product, type ProductVariant } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { setPageMeta } from "@/lib/seo";
import { useEffect } from "react";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productApi.get(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (product) setPageMeta(`${product.name} | Marketplace`, product.short_description || product.description?.slice(0, 160));
  }, [product]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const addToCart = useMutation({
    mutationFn: () => cartApi.add({
      product_id: product!.id,
      variant_id: selectedVariant?.id || null,
      quantity,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to cart", description: `${product!.name} has been added to your cart.` });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-tight py-8">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-muted/30 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted/30 rounded w-3/4" />
              <div className="h-4 bg-muted/30 rounded w-1/2" />
              <div className="h-10 bg-muted/30 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link to="/products" className="text-primary mt-4 inline-block hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  const images = (Array.isArray(product.images) ? product.images : []).filter(Boolean);
  if (product.featured_image) images.unshift(product.featured_image);
  const displayPrice = selectedVariant?.price ?? product.price;
  const hasDiscount = product.compare_at_price && product.compare_at_price > displayPrice;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/products" className="hover:text-primary flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Products</Link>
          <span>/</span>
          {product.category_name && <><Link to={`/products?category=${product.category_slug}`} className="hover:text-primary">{product.category_name}</Link><span>/</span></>}
          <span className="text-foreground truncate">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-muted/30 border border-border/30">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedImage === i ? 'border-primary' : 'border-border/30'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.name}</h1>

            {product.vendor_name && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {product.vendor_name.charAt(0)}
                </span>
                <span className="text-sm text-muted-foreground">by <span className="text-foreground font-medium">{product.vendor_name}</span></span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
              <span className="text-sm text-muted-foreground">{product.sales_count} sold</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-foreground">
                {product.currency === 'BDT' ? '৳' : '$'}{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.currency === 'BDT' ? '৳' : '$'}{product.compare_at_price!.toLocaleString()}
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="text-muted-foreground mt-4">{product.short_description}</p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: ProductVariant) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedVariant?.id === v.id ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 hover:border-primary/50'}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-foreground mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/50 transition-colors">-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted/50 transition-colors">+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={() => addToCart.mutate()} disabled={addToCart.isPending || product.stock <= 0}
              className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all">
              <ShoppingCart className="w-5 h-5" />
              {addToCart.isPending ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/30">
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-xs text-muted-foreground">Quality Assured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 pt-8 border-t border-border/30">
            <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}
      </div>
    </div>
  );
}
