import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JsonLd from "@/components/JsonLd";

interface Category {
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
}

function toPascal(s: string) {
  return s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

export default function Categories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("categories")
      .select("slug,name,icon,description")
      .order("name")
      .then(({ data }) => {
        setCats((data as Category[]) ?? []);
        setLoading(false);
      });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Business Categories",
    hasPart: cats.map((c) => ({ "@type": "Thing", name: c.name, url: `/listings?category=${c.slug}` })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="container-tight pt-8 pb-20">
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow mb-3"><Icons.LayoutGrid className="w-3.5 h-3.5" /> Categories</div>
          <h1 className="display-2 mb-3">Find vendors by <span className="gradient-text">expertise</span></h1>
          <p className="text-muted-foreground">Explore {cats.length} verified business categories — each indexed for AI discovery.</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="glass-card p-6 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cats.map((c) => {
              const Icon = (Icons as Record<string, unknown>)[toPascal(c.icon || "folder")] as React.ComponentType<{ className?: string }> | undefined;
              return (
                <Link
                  key={c.slug}
                  to={`/listings?category=${c.slug}`}
                  className="glass-card p-6 group hover:border-primary/50 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {Icon ? <Icon className="w-5 h-5 text-primary-light" /> : <Icons.Folder className="w-5 h-5 text-primary-light" />}
                  </div>
                  <h3 className="font-display font-semibold text-base mb-1">{c.name}</h3>
                  {c.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}