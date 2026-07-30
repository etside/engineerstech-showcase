import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Star, ShoppingCart } from "lucide-react";
import { productApi, type Product, type ProductCategory } from "@/lib/api";
import { setPageMeta } from "@/lib/seo";
import { useEffect } from "react";

function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.price;
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const images = Array.isArray(product.images) ? product.images : [];
  const image = product.featured_image || images[0] || null;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group glass-card rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            -{Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.name}</h3>
        {product.short_description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.short_description}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-foreground">
            {product.currency === 'BDT' ? '৳' : '$'}{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {product.currency === 'BDT' ? '৳' : '$'}{product.compare_at_price!.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating > 0 ? product.rating.toFixed(1) : 'New'}</span>
            {product.review_count > 0 && <span>({product.review_count})</span>}
          </div>
          {product.stock > 0 ? (
            <span className="text-xs text-emerald-600">In stock</span>
          ) : (
            <span className="text-xs text-red-500">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc" | "popular" | "rating">("newest");
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: productApi.categories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", { search, category, sort, page }],
    queryFn: () => productApi.list({ search, category_id: category, sort, page, per_page: 12 }),
  });

  useEffect(() => {
    setPageMeta("Products | EngineersTech Marketplace", "Browse products from verified vendors on EngineersTech");
  }, []);

  const products = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 border-b border-border/30">
        <div className="container-tight">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-2">Discover products from verified vendors worldwide</p>
        </div>
      </section>

      <div className="container-tight py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Categories</option>
            {categories?.map((c: ProductCategory) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Results count */}
        {data && (
          <p className="text-sm text-muted-foreground mb-6">{data.total} product{data.total !== 1 ? 's' : ''} found</p>
        )}

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden border border-border/30 animate-pulse">
                <div className="aspect-square bg-muted/30" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted/30 rounded w-3/4" />
                  <div className="h-3 bg-muted/30 rounded w-1/2" />
                  <div className="h-5 bg-muted/30 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No products found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 text-sm border border-border/50 rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
