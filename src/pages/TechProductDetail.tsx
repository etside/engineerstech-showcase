import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Laptop, ChevronRight, Tag, CheckCircle2, Clock, Zap, ArrowLeft, Share2, Bookmark, ShoppingCart } from "lucide-react";
import { findTechProduct, techProducts } from "@/data/techProducts";
import { setPageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export default function TechProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = findTechProduct(slug || "");

  useEffect(() => {
    if (product) {
      setPageMeta(
        `${product.name} — Tech Products | engineersTech`,
        `${product.description} Price: ${product.price}. Specs, features, and preorder details for ${product.name} in Bangladesh.`,
        `https://engineerstechbd.com/tech-products/${product.slug}`,
      );
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Laptop className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/tech-products" className="text-primary hover:underline font-medium">
            Browse all tech products
          </Link>
        </div>
      </div>
    );
  }

  // Find related products (same category, excluding current)
  const relatedProducts = techProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price.replace(/[৳,]/g, ""),
      priceCurrency: "BDT",
      availability: product.availability === "in-stock"
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
    url: `https://engineerstechbd.com/tech-products/${product.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the price of ${product.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The price of ${product.name} is ${product.price}.${product.discount ? ` Currently available at ${product.discount}.` : ""}`,
        },
      },
      {
        "@type": "Question",
        name: `What are the specs of ${product.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: product.specs.join(". ") + ".",
        },
      },
      {
        "@type": "Question",
        name: `Is ${product.name} available for preorder?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: product.availability === "preorder"
            ? `Yes, ${product.name} is available for preorder. Estimated availability: ${product.estimatedAvailability || "Coming soon"}.`
            : `Yes, ${product.name} is currently in stock and ready to ship.`,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b border-border/30">
          <div className="container-tight py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/tech-products" className="hover:text-foreground transition-colors">Tech Products</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-12 border-b border-border/30">
          <div className="container-tight">
            <div className="flex items-center gap-2 mb-3">
              <Link to="/tech-products" className="text-sm text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                All Products
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{product.categoryLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{product.description}</p>

            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="text-sm font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">{product.discount}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.availability === "preorder" ? "Preorder Now" : "Buy Now"}
              </Link>
              <button className="inline-flex items-center gap-2 border border-border/50 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
              <button className="inline-flex items-center gap-2 border border-border/50 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container-tight py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Overview
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {product.fullDescription.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-3 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Key Specs */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Key Specifications
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/30">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-sm text-muted-foreground">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">How do I place a preorder?</h3>
                    <p className="text-sm text-muted-foreground">Click "Preorder Now" and our team will contact you to confirm your order and payment details. A partial deposit may be required for preorders.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">When will this product be available?</h3>
                    <p className="text-sm text-muted-foreground">{product.availability === "preorder" ? `Estimated availability: ${product.estimatedAvailability || "Coming soon"}. We'll notify you as soon as it's in stock.` : "This product is currently in stock and ready to ship within 1-3 business days."}</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Do you offer warranty?</h3>
                    <p className="text-sm text-muted-foreground">Yes, all products come with the manufacturer's official warranty. Duration varies by product — typically 1-3 years. Extended warranty options are also available.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">What payment methods are accepted?</h3>
                    <p className="text-sm text-muted-foreground">We accept bKash, Nagad, Rocket, bank transfers, and credit/debit cards. EMI options are available for orders above ৳30,000.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="glass-card rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Product Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="text-sm font-medium text-foreground">{product.price}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Brand</div>
                      <div className="text-sm font-medium text-foreground">{product.brand}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Availability</div>
                      <div className="text-sm font-medium text-foreground capitalize">
                        {product.availability === "preorder" ? `Preorder (${product.estimatedAvailability || "TBA"})` : "In Stock"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="text-xs text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-[11px] bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Related Products</h3>
                  <div className="space-y-3">
                    {relatedProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/tech-products/${p.slug}`}
                        className="block p-3 rounded-lg border border-border/30 hover:border-primary/50 transition-all group"
                      >
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                        <p className="text-xs font-medium text-primary mt-1">{p.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">Need Help Ordering?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team can help you with product recommendations, compatibility checks, and bulk orders.
                </p>
                <Link
                  to="/contact"
                  className="block text-center bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
