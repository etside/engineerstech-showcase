import { Link } from "react-router-dom";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

const sections = [
  { title: "Platform", links: [
    { to: "/listings", label: "Browse Listings" },
    { to: "/services", label: "Categories" },
    { to: "/pricing", label: "Pricing" },
    { to: "/auth?mode=signup", label: "List Your Business" },
  ]},
  { title: "AI Discovery", links: [
    { to: "/about", label: "How GEO Works" },
    { to: "/services", label: "LLM API" },
    { to: "/services", label: "Vendor Analytics" },
    { to: "/faq", label: "FAQ" },
  ]},
  { title: "Company", links: [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/privacy", label: "Privacy" },
    { to: "/terms", label: "Terms" },
  ]},
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-card/30 mt-24">
      <div className="container-tight py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold text-base">geo<span className="gradient-text">Listed</span></div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              The next-generation business discovery platform optimized for Generative
              Engine Optimization. Structured for humans, indexed for AI.
            </p>
            <div className="flex items-center gap-2">
              {[{ Icon: Twitter, label: "Twitter" }, { Icon: Linkedin, label: "LinkedIn" }, { Icon: Github, label: "GitHub" }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary-light hover:border-primary/50 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">{s.title}</div>
              <ul className="space-y-3">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-foreground/80 hover:text-primary-light transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} geoListed. Built for the AI-discovery era.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">LLM API operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
