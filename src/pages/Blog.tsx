import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Rss } from "lucide-react";

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_url: string | null; published_at: string | null; tags: string[] | null };

const FALLBACK: Post[] = [
  { id: "1", slug: "geo-vs-seo-the-2025-shift", title: "GEO vs SEO: The 2025 Discovery Shift", excerpt: "Why structured listings beat blue links in AI answers — and how to win citations in ChatGPT, Claude, Gemini & Perplexity.", cover_url: null, published_at: new Date().toISOString(), tags: ["GEO", "AI Search"] },
  { id: "2", slug: "llms-txt-explained", title: "llms.txt explained: a robots.txt for AI agents", excerpt: "A practical guide to declaring what your site offers to LLM crawlers, with a copy-paste template.", cover_url: null, published_at: new Date().toISOString(), tags: ["GEO", "Standards"] },
  { id: "3", slug: "mcp-for-vendors", title: "MCP for vendors: get your business into ChatGPT Apps", excerpt: "How the Model Context Protocol turns your listing into a tool any LLM can call in real time.", cover_url: null, published_at: new Date().toISOString(), tags: ["MCP", "Distribution"] },
  { id: "4", slug: "reviews-that-rank-in-ai", title: "Reviews that rank in AI answers", excerpt: "Schema, sentiment, and freshness — the three signals every LLM weighs when recommending vendors.", cover_url: null, published_at: new Date().toISOString(), tags: ["Reviews", "Trust"] },
  { id: "5", slug: "pricing-for-ai-discovery", title: "Pricing for AI discovery: pay-to-be-found done right", excerpt: "How modern directories balance paid placement, verification, and editorial trust.", cover_url: null, published_at: new Date().toISOString(), tags: ["Business"] },
  { id: "6", slug: "category-pages-for-llms", title: "Designing category pages LLMs actually cite", excerpt: "ItemList schema, breadcrumb JSON-LD, and the H1 patterns that consistently get picked up.", cover_url: null, published_at: new Date().toISOString(), tags: ["GEO", "Schema"] },
];

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("blog_posts").select("id,slug,title,excerpt,cover_url,published_at,tags").eq("published", true).order("published_at", { ascending: false }).limit(48);
      setPosts((data && data.length ? data : FALLBACK) as Post[]);
    })();
  }, []);
  return (
    <section className="container-tight py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary-light text-xs uppercase tracking-wider font-semibold"><Sparkles className="w-4 h-4" /> Insights</div>
          <h1 className="display-2 mt-1">GEO & AI-discovery blog</h1>
          <p className="text-muted-foreground max-w-2xl">Playbooks for ranking in ChatGPT, Claude, Gemini, Perplexity, DeepSeek & Qwen. Written for vendors, marketers and engineers.</p>
        </div>
        <a href="/rss.xml" className="btn-ghost text-sm inline-flex items-center gap-2"><Rss className="w-4 h-4" /> RSS</a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="glass-card p-6 hover:border-primary/40 transition-colors block">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{(p.tags || []).slice(0, 2).join(" · ") || "GEO"}</div>
            <h2 className="font-display font-semibold text-lg leading-snug">{p.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.excerpt}</p>
            <div className="text-xs text-muted-foreground mt-4">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}