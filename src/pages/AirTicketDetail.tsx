import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Plane, ChevronRight, Clock, Banknote, CheckCircle2, ExternalLink, ArrowLeft, Share2, Bookmark, Plane as PlaneIcon, Tag } from "lucide-react";
import { findAirTicketService, airTicketServices } from "@/data/airTicketServices";
import { setPageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export default function AirTicketDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = findAirTicketService(slug || "");

  useEffect(() => {
    if (service) {
      setPageMeta(
        `${service.name} — Air Ticket Services | engineersTech`,
        `${service.description} Features, airlines, pricing, and processing time for ${service.name}.`,
        `https://engineerstechbd.com/air-tickets/${service.slug}`,
      );
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
          <Link to="/air-tickets" className="text-primary hover:underline font-medium">
            Browse all air ticket services
          </Link>
        </div>
      </div>
    );
  }

  // Find related services (same category, excluding current)
  const relatedServices = airTicketServices
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "engineersTech",
      url: "https://engineerstechbd.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    serviceType: service.categoryLabel,
    offers: {
      "@type": "Offer",
      price: service.priceRange,
      priceCurrency: "BDT",
    },
    url: `https://engineerstechbd.com/air-tickets/${service.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${service.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: service.description,
        },
      },
      {
        "@type": "Question",
        name: `How much does ${service.name} cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The price range for ${service.name} is ${service.priceRange}.`,
        },
      },
      {
        "@type": "Question",
        name: `How long does ${service.name} take?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Processing time for ${service.name} is ${service.processingTime}.`,
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
              <Link to="/air-tickets" className="hover:text-foreground transition-colors">Air Tickets</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{service.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-12 border-b border-border/30">
          <div className="container-tight">
            <div className="flex items-center gap-2 mb-3">
              <Link to="/air-tickets" className="text-sm text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                All Services
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{service.categoryLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{service.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{service.description}</p>
            <div className="flex items-center gap-4 mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plane className="w-4 h-4" />
                Book Now
              </Link>
              <button className="inline-flex items-center gap-2 border border-border/50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                <Bookmark className="w-4 h-4" />
                Save
              </button>
              <button className="inline-flex items-center gap-2 border border-border/50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
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
                  <Plane className="w-5 h-5 text-primary" />
                  Overview
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {service.fullDescription.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-3 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  What's Included
                </h2>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Airlines */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Airlines & Partners
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.airlines.map((airline) => (
                    <span key={airline} className="text-sm bg-muted/50 text-muted-foreground px-3 py-1.5 rounded-full border border-border/30">
                      {airline}
                    </span>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">How do I book this service?</h3>
                    <p className="text-sm text-muted-foreground">Contact us through our booking form or call our support team. We'll guide you through the process and confirm your booking.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">What payment methods are accepted?</h3>
                    <p className="text-sm text-muted-foreground">We accept bKash, Nagad, Rocket, bank transfers, and credit/debit cards. Payment details will be provided at the time of booking.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Can I cancel or change my booking?</h3>
                    <p className="text-sm text-muted-foreground">Yes, most bookings can be modified or cancelled subject to airline policies. Contact us for assistance with changes.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Do I get an e-ticket?</h3>
                    <p className="text-sm text-muted-foreground">Yes, all confirmed bookings come with an e-ticket delivered via email and SMS within minutes of confirmation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="glass-card rounded-xl p-6 sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Quick Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Price Range</div>
                      <div className="text-sm font-medium text-foreground">{service.priceRange}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Processing Time</div>
                      <div className="text-sm font-medium text-foreground">{service.processingTime}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Airlines</div>
                      <div className="text-sm font-medium text-foreground">{service.airlines.join(", ")}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="text-xs text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-[11px] bg-muted/50 text-muted-foreground px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">Related Services</h3>
                  <div className="space-y-3">
                    {relatedServices.map((s) => (
                      <Link
                        key={s.id}
                        to={`/air-tickets/${s.slug}`}
                        className="block p-3 rounded-lg border border-border/30 hover:border-primary/50 transition-all group"
                      >
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">Ready to Book?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get in touch with our travel experts for the best deals and personalized assistance.
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
