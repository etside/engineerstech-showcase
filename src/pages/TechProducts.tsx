import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Laptop, ChevronRight, Tag, Clock, Zap, Star, ArrowRight, Cpu, Gamepad2, Keyboard, Watch, Cable, Monitor } from "lucide-react";
import { techProducts, techProductCategories, type TechProduct } from "@/data/techProducts";
import { setPageMeta } from "@/lib/seo";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  laptops: Laptop,
  gaming: Gamepad2,
  components: Cpu,
  peripherals: Keyboard,
  wearables: Watch,
  accessories: Cable,
};

const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: Laptop,
  "gamepad-2": Gamepad2,
  cpu: Cpu,
  "hard-drive": Cpu,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Keyboard,
  headphones: Watch,
  watch: Watch,
  speaker: Zap,
  "arrow-up": ArrowRight,
  "plug-zap": Cable,
  cable: Cable,
  camera: Monitor,
  lightbulb: Zap,
};

function ProductCard({ product }: { product: TechProduct }) {
  const Icon = PRODUCT_ICONS[product.icon] || Laptop;
  return (
    <Link
      to={`/tech-products/${product.slug}`}
      className="glass-card rounded-xl p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary-light" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{product.name}</h3>
            {product.availability === "preorder" && (
              <span className="shrink-0 bg-amber-500/10 text-amber-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">Preorder</span>
            )}
            {product.discount && (
              <span className="shrink-0 bg-green-500/10 text-green-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">{product.discount}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Tag className="w-3 h-3" />
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="line-through">{product.originalPrice}</span>
            )}
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {product.brand}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.specs.slice(0, 3).map((spec) => (
              <span key={spec} className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full">{spec}</span>
            ))}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}

function CategoryCard({ category, count }: { category: typeof techProductCategories[number]; count: number }) {
  const Icon = CATEGORY_ICONS[category.slug] || Laptop;
  return (
    <Link
      to={`/tech-products?cat=${category.slug}`}
      className="glass-card rounded-xl p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary-light" />
      </div>
      <h3 className="font-display font-semibold text-base mb-1">{category.label}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{category.description}</p>
      <span className="text-xs text-primary font-medium">{count} products</span>
    </Link>
  );
}

export default function TechProducts() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat) setSelectedCategory(cat);
  }, []);

  useEffect(() => {
    setPageMeta(
      "Tech Products — Trending Gadgets, Laptops & Components | engineersTech",
      "Shop trending tech in Bangladesh — laptops, gaming gear, PC components, peripherals, wearables, and accessories. Preorder the latest gadgets.",
      "https://engineerstechbd.com/tech-products",
    );
  }, []);

  const filteredProducts = techProducts.filter((p) => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-16 border-b border-border/30">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Laptop className="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Tech Products</h1>
              <p className="text-muted-foreground mt-1">Trending gadgets, laptops & components for preorder</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-4">
            Shop the latest tech in Bangladesh — from powerful laptops and gaming gear
            to PC components, peripherals, and smart accessories. Preorder now for the best deals.
          </p>
        </div>
      </section>

      <div className="container-tight py-8">
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search laptops, components, accessories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>

        {/* Category Cards */}
        {!search && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {techProductCategories.map((cat) => {
              const count = techProducts.filter((p) => p.category === cat.slug).length;
              return (
                <CategoryCard
                  key={cat.slug}
                  category={cat}
                  count={count}
                />
              );
            })}
          </div>
        )}

        {/* Active Category Filter */}
        {selectedCategory && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Showing:</span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {techProductCategories.find((c) => c.slug === selectedCategory)?.label}
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-20">
              <Laptop className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No products found</h3>
              <p className="text-muted-foreground mt-1">Try a different search term or category</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{techProducts.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Products</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{techProductCategories.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Categories</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{techProducts.filter((p) => p.availability === "preorder").length}</div>
            <div className="text-xs text-muted-foreground mt-1">Preorders Open</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{techProducts.filter((p) => p.discount).length}</div>
            <div className="text-xs text-muted-foreground mt-1">On Sale</div>
          </div>
        </div>
      </div>
    </div>
  );
}
