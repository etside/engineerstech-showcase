import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ArrowRight, Sparkles, ShoppingCart } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

// ─── 8-bladed glowing violet star icon ──────────────────────────────────────
function VioletStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.09 8.26L20.18 8.63L15.54 12.74L17.12 19.02L12 15.77L6.88 19.02L8.46 12.74L3.82 8.63L9.91 8.26L12 2Z"
        fill="url(#starGrad)"
        opacity="0.9"
      />
      <path
        d="M12 2L14.09 8.26L20.18 8.63L15.54 12.74L17.12 19.02L12 15.77L6.88 19.02L8.46 12.74L3.82 8.63L9.91 8.26L12 2Z"
        stroke="#D946EF"
        strokeWidth="0.5"
        strokeOpacity="0.4"
        fill="none"
      />
    </svg>
  );
}

// ─── Top announcement banner ───────────────────────────────────────────────
function AnnouncementBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative z-50 bg-primary/95 text-primary-foreground text-center text-xs font-semibold py-2.5 px-4">
      <div className="container-tight flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/80 animate-pulse shrink-0" />
        <span>
          AI-powered GEO scoring now live — get your tech business discovered by LLMs&nbsp;
          <Link to="/how-it-works" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Learn more
          </Link>
        </span>
      </div>
      <button
        onClick={onClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/20 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── "More" dropdown items ────────────────────────────────────────────────────
const moreLinks = [
  { to: "/leaderboards", label: "Leaderboards" },
  { to: "/ai-discover",  label: "AI Discover" },
  { to: "/for-vendors",  label: "For Vendors" },
  { to: "/blog",         label: "Blog" },
  { to: "/pricing",      label: "Pricing" },
  { to: "/api-docs",     label: "LLM / MCP API" },
  { to: "/orders",       label: "My Orders" },
];

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200"
      >
        More <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-border/60 bg-card/98 backdrop-blur-2xl shadow-xl shadow-black/40 py-1.5 z-50 animate-fade-in">
          {moreLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAdmin, isSuperAdmin, logout } = useAuth();
  const [showBanner, setShowBanner] = useState(true);
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const { pathname }                = useLocation();

  const primaryLinks = [
    { to: "/products",              label: "Products" },
    { to: "/marketplace-services",  label: "Services" },
    { to: "/listings",              label: "Vendors" },
    { to: "/categories",            label: "Categories" },
    { to: "/how-it-works",          label: "How It Works" },
    { to: "/resources",             label: "Resources" },
  ];

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function signOut() {
    await logout();
    window.location.href = "/";
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      {showBanner && <AnnouncementBanner onClose={() => setShowBanner(false)} />}

      <header
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-lg shadow-black/30"
            : "bg-background/70 backdrop-blur-xl"
        )}
      >
        <div className="container-tight">
          <div className="h-16 flex items-center justify-between gap-6">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <VioletStar className="w-7 h-7 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] group-hover:scale-110 transition-transform duration-200" />
              <span className="font-display font-extrabold text-[15px] tracking-tight leading-none">
                <span className="text-foreground">engineers</span>
                <span className="gradient-text">Tech</span>
              </span>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {primaryLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary-light bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <MoreDropdown />
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2 shrink-0">
              <LanguageToggle />
              <Link
                to="/cart"
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>

              {user ? (
                <>
                  {(isAdmin || isSuperAdmin) && (
                    <Link
                      to={isSuperAdmin ? "/super-admin" : "/admin"}
                      className="hidden md:inline-flex px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="hidden md:inline-flex btn-ghost text-sm py-2 px-4"
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <Link to="/submit" className="hidden md:inline-flex pill-cta">
                    Start Selling
                    <span className="pill-cta-arrow">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="hidden md:inline-flex px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200"
                  >
                    {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="hidden md:inline-flex px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200"
                  >
                    {t("nav.signIn")}
                  </Link>
                  <Link to="/auth?mode=signup" className="hidden md:inline-flex pill-cta">
                    Start Selling
                    <span className="pill-cta-arrow">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                className="lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={cn(
            "lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-2xl overflow-hidden transition-all duration-300 ease-spring",
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
          )}
          style={{ pointerEvents: menuOpen ? "auto" : "none" }}
        >
          <div className="container-tight py-4 flex flex-col gap-1">
            {[...primaryLinks, { to: "/pricing", label: "Pricing" }, ...moreLinks, { to: "/cart", label: "Cart" }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary-light"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border/50">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn-ghost text-sm py-2.5">{t("nav.dashboard")}</Link>
                  <Link to="/submit"    className="btn-gradient text-sm py-2.5">Start Selling</Link>
                  <button onClick={signOut} className="btn-ghost text-sm py-2.5 col-span-2">
                    {t("nav.signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth"            className="btn-ghost text-sm py-2.5">Login</Link>
                  <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-sm py-2.5">Start Selling</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
