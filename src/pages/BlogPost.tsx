import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

type Post = { title: string; excerpt: string | null; content: string | null; cover_url: string | null; published_at: string | null; tags: string[] | null };

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("blog_posts").select("title,excerpt,content,cover_url,published_at,tags").eq("slug", slug!).eq("published", true).maybeSingle();
      setPost((data as Post) || null);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.published_at,
      keywords: (post.tags || []).join(", "),
      mainEntityOfPage: typeof window !== "undefined" ? window.location.href : "",
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = JSON.stringify(ld);
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, [post]);

  if (loading) return <div className="container-tight py-20">Loading…</div>;
  if (!post) return (
    <div className="container-tight py-20 text-center">
      <h1 className="display-3 mb-2">Post not found</h1>
      <Link to="/blog" className="btn-ghost text-sm">← Back to blog</Link>
    </div>
  );
  return (
    <article className="container-tight py-12 max-w-3xl">
      <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary-light">← All posts</Link>
      <h1 className="display-2 mt-3">{post.title}</h1>
      {post.excerpt && <p className="text-lg text-muted-foreground mt-3">{post.excerpt}</p>}
      <div className="text-xs text-muted-foreground mt-2">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</div>
      <div className="prose prose-invert max-w-none mt-8">
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      </div>
    </article>
  );
}