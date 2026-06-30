import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

function AnnouncementBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative z-50 bg-gradient-to-r from-primary/90 via-primary to-primary-glow/90 text-white text-center text-xs font-semibold py-2.5 px-4">
      <div className="container-tight flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
        <span>
          🚀 New: AI-powered GEO scoring now live — get your tech business discovered by LLMs&nbsp;
          <Link to="/how-it-works" className="underline underline-offset-2 hover:text-white/80 transition-colors">
            Learn how →
          </Link>
        </span>
      </div>
      <button
        onClick={onClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(true);
  const links = [
    { to: "/listings", label: t("nav.listings") },
    { to: "/categories", label: t("nav.categories") },
    { to: "/leaderboards", label: t("nav.leaderboards") },
    { to: "/ai-discover", label: t("nav.aiDiscover") },
    { to: "/for-vendors", label: t("nav.forVendors") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/pricing", label: t("nav.pricing") },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const apply = async (u: any) => {
      setUser(u ? { id: u.id, email: u.email } : null);
      if (u) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
        const roles = (data || []).map((r: any) => r.role);
        setIsAdmin(roles.includes("admin") || roles.includes("super_admin"));
        setIsSuper(roles.includes("super_admin"));
      } else { setIsAdmin(false); setIsSuper(false); }
    };
    supabase.auth.getUser().then(({ data }) => apply(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => apply(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() { await supabase.auth.signOut(); window.location.href = "/"; }

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      {showBanner && <AnnouncementBanner onClose={() => setShowBanner(false)} />}
      <header
        className={cn(
          "transition-all duration-500 ease-spring",
          scrolled
            ? "bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-xl shadow-black/20"
            : "bg-background/60 backdrop-blur-md"
        )}
      >
        <div className="container-tight">
          <div className="h-[68px] flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-105 group-hover:shadow-primary/60 transition-all ease-spring">
                <Zap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-none">
                <div className="font-display font-extrabold text-base tracking-tight">
                  <span className="text-foreground">engineers</span><span className="animated-gradient-text">Tech</span>
                </div>
                <div className="text-[9px] text-muted-foreground font-semibold tracking-[0.2em] uppercase mt-0.5">
                  AI Discovery
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-spring",
                      isActive
                        ? "text-primary-light bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <LanguageToggle />
              {user ? (
                <>
                  <Link to="/dashboard" className="hidden md:inline-flex btn-ghost text-sm py-2 px-3.5">
                    {t("nav.dashboard")}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="hidden md:inline-flex btn-ghost text-sm py-2 px-3.5">
                      {t("nav.admin")}
                    </Link>
                  )}
                  {isSuper && (
                    <Link to="/super-admin" className="hidden md:inline-flex btn-ghost text-sm py-2 px-3.5 text-primary-light">
                      {t("nav.superAdmin")}
                    </Link>
                  )}
                  <button onClick={signOut} className="hidden md:inline-flex btn-ghost text-sm py-2 px-3.5">
                    {t("nav.signOut")}
                  </button>
                  <Link to="/submit" className="hidden md:inline-flex btn-gradient shimmer-btn text-sm py-2.5 px-5">
                    {t("nav.addListing")}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth" className="hidden md:inline-flex btn-ghost text-sm py-2 px-3.5">
                    {t("nav.signIn")}
                  </Link>
                  <Link to="/auth?mode=signup" className="hidden md:inline-flex btn-gradient shimmer-btn text-sm py-2.5 px-5">
                    {t("nav.listYourBusiness")}
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border/60 bg-background/98 backdrop-blur-2xl animate-fade-in">
            <div className="container-tight py-4 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary-light" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border/60">
                {user ? (
                  <>
                    <Link to="/dashboard" className="btn-ghost text-sm py-2.5">{t("nav.dashboard")}</Link>
                    {isAdmin && <Link to="/admin" className="btn-ghost text-sm py-2.5">{t("nav.admin")}</Link>}
                    {isSuper && (
                      <Link to="/super-admin" className="btn-ghost text-sm py-2.5 col-span-2 text-primary-light">
                        {t("nav.superAdmin")}
                      </Link>
                    )}
                    <Link to="/submit" className="btn-gradient shimmer-btn text-sm py-2.5 col-span-2">
                      {t("nav.addListing")}
                    </Link>
                    <button onClick={signOut} className="btn-ghost text-sm py-2.5 col-span-2">
                      {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="btn-ghost text-sm py-2.5">{t("nav.signIn")}</Link>
                    <Link to="/auth?mode=signup" className="btn-gradient shimmer-btn text-sm py-2.5">
                      {t("nav.listYourBusiness")}
                    </Link>
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
