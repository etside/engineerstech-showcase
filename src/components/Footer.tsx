import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, MessageCircle, ExternalLink } from "lucide-react";
import NewsletterSignup from "./NewsletterSignup";

// ─── Footer link columns ─────────────────────────────────────────────────────
const footerColumns = [
  {
    title: "Product",
    links: [
      { to: "/listings",     label: "Browse Listings" },
      { to: "/categories",   label: "Categories" },
      { to: "/pricing",      label: "Pricing" },
      { to: "/submit",       label: "List Your Business" },
      { to: "/leaderboards", label: "Leaderboards" },
      { to: "/faq",          label: "Help Centre (FAQ)" },
    ],
  },
  {
    title: "Our Data",
    links: [
      { to: "/how-it-works", label: "How GEO Works" },
      { to: "/ai-discover",  label: "AI Discover" },
      { to: "/api-docs",     label: "LLM / MCP API" },
      { to: "/services",     label: "Services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/blog",         label: "Blog" },
      { to: "/resources",    label: "Resources" },
      { to: "/for-vendors",  label: "For Vendors" },
      { to: "/about",        label: "About engineersTech" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/contact",        label: "Contact Us" },
      { to: "/about#news",     label: "News & Media" },
      { to: "/about#awards",   label: "Achievements" },
      { to: "/terms",          label: "Terms of Service" },
      { to: "/privacy",        label: "Privacy Policy" },
    ],
  },
];

const socials = [
  { Icon: Twitter,        label: "Twitter / X", href: "https://twitter.com/engineerstech" },
  { Icon: Linkedin,       label: "LinkedIn",    href: "https://linkedin.com/company/engineerstech" },
  { Icon: Github,         label: "GitHub",      href: "https://github.com/etside" },
  { Icon: MessageCircle,  label: "Discord",     href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/50">

      {/* ── Main footer body ── */}
      <div className="bg-card/20">
        <div className="container-tight py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 xl:gap-14">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-5 group w-fit">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(217,70,239,0.4)]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footerStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D946EF" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L14.09 8.26L20.18 8.63L15.54 12.74L17.12 19.02L12 15.77L6.88 19.02L8.46 12.74L3.82 8.63L9.91 8.26L12 2Z" fill="url(#footerStarGrad)" opacity="0.9" />
                </svg>
                <span className="font-display font-extrabold text-[15px] leading-none">
                  <span className="text-foreground">engineers</span>
                  <span className="gradient-text">Tech</span>
                </span>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                The AI-powered directory for engineers & tech professionals. Get discovered by LLMs,
                ranked by GEO score.
              </p>

              <div className="mb-6">
                <NewsletterSignup />
              </div>

              <div className="flex items-center gap-2">
                {socials.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-border/50 bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-primary-light hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* 4 link columns */}
            {footerColumns.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary-light mb-5">
                  {col.title}
                </div>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 inline-block"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legal text ── */}
      <div className="border-t border-border/30 bg-background/60">
        <div className="container-tight py-8">
          <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-4xl">
            engineersTech is an AI-powered business directory platform. All listings are provided
            for discovery and evaluation purposes only. engineersTech does not guarantee the
            accuracy, completeness, or availability of any listed business. Businesses are
            independently operated and not affiliated with engineersTech unless explicitly stated.
            GEO scoring is algorithmic and does not constitute a professional recommendation.
            engineersTech is a registered trademark of engineersTech Ltd.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-3 leading-relaxed max-w-4xl">
            Jurisdictional Notice: engineersTech services are available globally. Users are
            responsible for compliance with their local laws and regulations. Not a financial
            advisor · Not FDIC Insured · Past performance not indicative of future results.
          </p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border/30 bg-background/80">
        <div className="container-tight py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-xs text-muted-foreground text-center md:text-left">
              engineersTech™ ©{" "}{new Date().getFullYear()}{" "}·{" "}
              <a
                href="https://engineerstechbd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary-light transition-colors inline-flex items-center gap-1"
              >
                engineerstechbd.com <ExternalLink className="w-3 h-3" />
              </a>
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">LLM API operational</span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Trust & Security
                </Link>
                <span className="text-border">|</span>
                <Link to="/privacy#newsletter" className="hover:text-foreground transition-colors">
                  Subscribe to newsletter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
