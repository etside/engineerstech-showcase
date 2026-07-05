import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

// ─── Top announcement banner (like FundedNext's top strip) ───────────────────
function AnnouncementBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative z-50 bg-primary/95 text-primary-foreground text-center text-xs font-semibold py-2.5 px-4">
      <div className="container-tight flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/80 animate-pulse shrink-0" />
        <span>
          🚀 AI-powered GEO scoring now live — get your tech business discovered by LLMs&nbsp;
          <Link to="/how-it-works" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Learn how →
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
];

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
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

  // Primary nav links (FundedNext style: minimal, 3-4 top-level items)
  const primaryLinks = [
    { to: "/listings",   label: t("nav.listings")   },
    { to: "/categories", label: t("nav.categories") },
    { to: "/how-it-works", label: "How It Works" },
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
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-display font-extrabold text-[15px] tracking-tight leading-none">
                <span className="text-foreground">engineers</span>
                <span className="gradient-text">Tech</span>
              </span>
            </Link>

            {/* ── Desktop Navigation (FundedNext: clean, few items, "More" dropdown) ── */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1">
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
              {/* Language toggle (EN-style like FundedNext) */}
              <LanguageToggle />

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
                  <Link
                    to="/submit"
                    className="hidden md:inline-flex btn-gradient shimmer-btn text-sm py-2 px-5"
                  >
                    {t("nav.addListing")}
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
                  {/* FundedNext pattern: plain "Login" link + solid CTA button */}
                  <Link
                    to="/auth"
                    className="hidden md:inline-flex px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200"
                  >
                    {t("nav.signIn")}
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="hidden md:inline-flex btn-gradient shimmer-btn text-sm py-2 px-5"
                  >
                    Get Started
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
        {menuOpen && (
          <div className="lg:hidden border-t border-border/50 bg-background/98 backdrop-blur-2xl animate-fade-in">
            <div className="container-tight py-4 flex flex-col gap-1">
              {[...primaryLinks, ...moreLinks].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
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
                    <Link to="/submit"    className="btn-gradient text-sm py-2.5">{t("nav.addListing")}</Link>
                    <button onClick={signOut} className="btn-ghost text-sm py-2.5 col-span-2">
                      {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth"            className="btn-ghost text-sm py-2.5">Login</Link>
                    <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-sm py-2.5">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
