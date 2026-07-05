import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, List, Tag, Mail, Search, ArrowLeft } from "lucide-react";
import { setPageMeta } from "@/lib/seo";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageMeta(
      "404 — Page Not Found | engineersTech",
      "The page you are looking for does not exist. Browse our business directory, categories, or contact us for help.",
    );
  }, []);

  const helpfulLinks = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/listings", label: "Listings", Icon: List },
    { to: "/categories", label: "Categories", Icon: Tag },
    { to: "/contact", label: "Contact", Icon: Mail },
  ];

  return (
    <section className="container-tight py-24 text-center">
      <div
        className="gradient-text font-display font-bold leading-none mb-4"
        style={{ fontSize: "clamp(6rem, 20vw, 12rem)" }}
        aria-hidden="true"
      >
        404
      </div>

      <h1 className="display-2 mb-4">Page not found</h1>

      <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
        The page you were looking for doesn't exist, was moved, or the link is incorrect.
      </p>

      <div className="glass-card p-5 max-w-md mx-auto mb-10 text-left">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 shrink-0" />
          Looking for a specific business? Try searching our directory:
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
            if (q) navigate(`/listings?q=${encodeURIComponent(q)}`);
          }}
          className="flex gap-2"
        >
          <input
            name="q"
            type="text"
            placeholder="Search businesses, services…"
            className="flex-1 h-10 px-3 rounded-xl bg-muted/40 border border-border focus:border-primary focus:outline-none text-sm placeholder:text-muted-foreground"
          />
          <button type="submit" className="btn-gradient px-4 py-2 text-sm">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {helpfulLinks.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition-colors"
          >
            <Icon className="w-4 h-4 text-muted-foreground" />
            {label}
          </Link>
        ))}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </section>
  );
}
