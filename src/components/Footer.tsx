import { Link } from "react-router-dom";
import { Zap, Twitter, Github, Linkedin, MessageCircle, ExternalLink, Users, Globe2, MapPin, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import NewsletterSignup from "./NewsletterSignup";
import AnimatedCounter from "./AnimatedCounter";
import Reveal from "./Reveal";

const awards = [
  { label: "Bangladesh #1 Tech Directory", icon: "🏆" },
  { label: "AI-Powered GEO", icon: "🤖" },
  { label: "GEO Certified 2026", icon: "✅" },
  { label: "Top Rated Platform", icon: "⭐" },
  { label: "500+ Verified Listings", icon: "🔒" },
  { label: "50K+ Monthly Users", icon: "🚀" },
];

export default function Footer() {
  const { t } = useTranslation();

  const sections = [
    {
      title: "Platform",
      links: [
        { to: "/listings", label: "Browse Listings" },
        { to: "/categories", label: "Categories" },
        { to: "/pricing", label: "Pricing" },
        { to: "/submit", label: "List Your Business" },
        { to: "/blog", label: "Blog" },
        { to: "/leaderboards", label: "Leaderboards" },
      ],
    },
    {
      title: "AI & GEO",
      links: [
        { to: "/how-it-works", label: "How GEO Works" },
        { to: "/ai-discover", label: "AI Discover" },
        { to: "/api-docs", label: "LLM / MCP API" },
        { to: "/resources", label: "Resources" },
        { to: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Company",
      links: [
        { to: "/about", label: "About engineersTech" },
        { to: "/for-vendors", label: "For Vendors" },
        { to: "/contact", label: "Contact Us" },
        { to: "/blog", label: "Blog & News" },
        { to: "/services", label: "Services" },
      ],
    },
    {
      title: "Legal",
      links: [
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/terms", label: "Terms of Service" },
        { to: "/faq", label: "Cookie Policy" },
        { to: "/faq", label: "Disclaimer" },
      ],
    },
  ];

  const socials = [
    { Icon: Twitter, label: "Twitter / X", href: "#" },
    { Icon: Linkedin, label: "LinkedIn", href: "#" },
    { Icon: Github, label: "GitHub", href: "#" },
    { Icon: MessageCircle, label: "Discord", href: "#" },
  ];

  return (
    <footer className="relative mt-24 border-t border-border/60">
      {/* Award strip */}
      <div className="border-b border-border/40 overflow-hidden bg-muted/20">
        <div className="py-4 relative">
          <div className="flex gap-4 whitespace-nowrap marquee-track">
            {[...awards, ...awards].map((a, i) => (
              <div key={i} className="award-strip transition-all cursor-default shrink-0">
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Presence Stats */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="container-tight py-8">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, value: 6000, suffix: "+", label: "Team Members", desc: "Worldwide talent" },
                { icon: Globe2, value: 50, suffix: "+", label: "Global Offices", desc: "Across continents" },
                { icon: MapPin, value: 1700, suffix: "+", label: "Countries Served", desc: "Global reach" },
                { icon: Clock, value: 24, suffix: "/7", label: "Operations", desc: "Never stops" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 80} className="text-center group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 ease-spring">
                    <s.icon className="w-[18px] h-[18px] text-primary-light" />
                  </div>
                  <div className="font-display text-2xl font-extrabold gradient-text mb-0.5">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-sm font-semibold text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-card/40">
        <div className="container-tight py-16">
          <div className="grid lg:grid-cols-5 gap-10 xl:gap-14">

            {/* Brand col */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-105 transition-transform ease-spring">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="font-display font-extrabold text-base leading-none">
                  <span className="text-foreground">engineers</span><span className="gradient-text">Tech</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The AI-powered directory for engineers & tech professionals in Bangladesh and beyond.
                Get discovered by LLMs, ranked by GEO score.
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
                    className="w-9 h-9 rounded-lg border border-border bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-primary-light hover:border-primary/50 hover:bg-primary/10 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {sections.map((s) => (
              <div key={s.title}>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light mb-5">
                  {s.title}
                </div>
                <ul className="space-y-3">
                  {s.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-0.5 inline-block"
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

      {/* Bottom bar */}
      <div className="border-t border-border/60 bg-background/80">
        <div className="container-tight py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://engineerstechbd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary-light transition-colors inline-flex items-center gap-1"
              >
                engineersTech <ExternalLink className="w-3 h-3" />
              </a>
              . All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">LLM API operational</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <span className="text-border">·</span>
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <span className="text-border">·</span>
                <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
