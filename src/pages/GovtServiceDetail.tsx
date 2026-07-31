import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Landmark, ChevronRight, Clock, Banknote, MapPin, ExternalLink, CheckCircle2, FileText, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { findGovtService, govtServices } from "@/data/bangladeshGovtServices";
import { setPageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export default function GovtServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = findGovtService(slug || "");

  useEffect(() => {
    if (service) {
      setPageMeta(
        `${service.name} | Bangladesh Govt. Services | engineersTech`,
        `${service.description} Learn about requirements, process, fees, and timeline for ${service.name} in Bangladesh.`,
        `https://engineerstechbd.com/govt-services/${service.slug}`,
      );
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Landmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
          <Link to="/govt-services" className="text-primary hover:underline font-medium">
            Browse all government services
          </Link>
        </div>
      </div>
    );
  }

  // Find related services (same category, excluding current)
  const relatedServices = govtServices
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "GovernmentOrganization",
      name: service.office,
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    serviceType: service.categoryLabel,
    offers: {
      "@type": "Offer",
      price: service.fees,
      priceCurrency: "BDT",
    },
    url: `https://engineerstechbd.com/govt-services/${service.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is required for ${service.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: service.requirements.join(". "),
        },
      },
      {
        "@type": "Question",
        name: `How long does ${service.name} take?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The processing time for ${service.name} is ${service.timeline}.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does ${service.name} cost?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The fee for ${service.name} is ${service.fees}.`,
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
              <Link to="/govt-services" className="hover:text-foreground transition-colors">Govt. Services</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{service.name}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="bg-gradient-to-br from-accent/10 via-background to-primary/10 py-12 border-b border-border/30">
          <div className="container-tight">
            <div className="flex items-center gap-2 mb-3">
              <Link to="/govt-services" className="text-sm text-primary hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                All Services
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{service.categoryLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{service.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{service.description}</p>
            <div className="flex items-center gap-4 mt-6">
              {service.onlineUrl && (
                <a
                  href={service.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Apply Online
                </a>
              )}
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
                  <FileText className="w-5 h-5 text-primary" />
                  Overview
                </h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {service.fullDescription.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-3 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Required Documents
                </h2>
                <ul className="space-y-3">
                  {service.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Step-by-Step Process
                </h2>
                <ol className="space-y-4">
                  {service.process.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">{i + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* FAQ */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">What documents are required?</h3>
                    <p className="text-sm text-muted-foreground">{service.requirements.join(". ")}.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">How long does it take?</h3>
                    <p className="text-sm text-muted-foreground">The processing time is {service.timeline}.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">How much does it cost?</h3>
                    <p className="text-sm text-muted-foreground">The fee is {service.fees}.</p>
                  </div>
                  <div className="border border-border/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Where do I apply?</h3>
                    <p className="text-sm text-muted-foreground">You can apply at {service.office}{service.onlineUrl ? " or online through the official portal" : ""}.</p>
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
                      <div className="text-xs text-muted-foreground">Fee</div>
                      <div className="text-sm font-medium text-foreground">{service.fees}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Timeline</div>
                      <div className="text-sm font-medium text-foreground">{service.timeline}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Office</div>
                      <div className="text-sm font-medium text-foreground">{service.office}</div>
                    </div>
                  </div>
                  {service.onlineUrl && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Online Portal</div>
                        <a
                          href={service.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
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
                        to={`/govt-services/${s.slug}`}
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
                <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team can help you understand the process and prepare your documents.
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
