import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export default function Navbar() {
  const { t } = useTranslation();
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
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-spring",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      )}
    >
      <div className="container-tight">
        <div className="h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform ease-spring">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="font-display font-bold text-base tracking-tight text-foreground">
                geo<span className="gradient-text">Listed</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-medium tracking-wider uppercase">
                AI Discovery
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-spring",
                    isActive ? "text-foreground bg-muted/40" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" className="hidden md:inline-flex btn-ghost text-sm py-2 px-4">{t("nav.dashboard")}</Link>
                {isAdmin && <Link to="/admin" className="hidden md:inline-flex btn-ghost text-sm py-2 px-4">{t("nav.admin")}</Link>}
                {isSuper && <Link to="/super-admin" className="hidden md:inline-flex btn-ghost text-sm py-2 px-4 text-primary-light">{t("nav.superAdmin")}</Link>}
                <button onClick={signOut} className="hidden md:inline-flex btn-ghost text-sm py-2 px-4">{t("nav.signOut")}</button>
                <Link to="/submit" className="hidden md:inline-flex btn-gradient text-sm py-2 px-4">{t("nav.addListing")}</Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden md:inline-flex btn-ghost text-sm py-2 px-4">{t("nav.signIn")}</Link>
                <Link to="/auth?mode=signup" className="hidden md:inline-flex btn-gradient text-sm py-2 px-4">{t("nav.listYourBusiness")}</Link>
              </>
            )}
            <button
              type="button"
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-xl border border-border bg-card"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container-tight py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn("px-4 py-3 rounded-lg text-sm font-medium", isActive ? "bg-muted/40 text-foreground" : "text-muted-foreground")
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border/60">
                <Link to="/dashboard" className="btn-ghost text-sm py-2.5">{t("nav.dashboard")}</Link>
                {isAdmin && <Link to="/admin" className="btn-ghost text-sm py-2.5">{t("nav.admin")}</Link>}
                {isSuper && <Link to="/super-admin" className="btn-ghost text-sm py-2.5 col-span-2 text-primary-light">{t("nav.superAdmin")}</Link>}
                <Link to="/submit" className="btn-gradient text-sm py-2.5 col-span-2">{t("nav.addListing")}</Link>
                <button onClick={signOut} className="btn-ghost text-sm py-2.5 col-span-2">{t("nav.signOut")}</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border/60">
                <Link to="/auth" className="btn-ghost text-sm py-2.5">{t("nav.signIn")}</Link>
                <Link to="/auth?mode=signup" className="btn-gradient text-sm py-2.5">{t("nav.listYourBusiness")}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
