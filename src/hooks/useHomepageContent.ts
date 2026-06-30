import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageContent {
  hero: {
    badge: string;
    title: string;
    highlightedTitle: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: Array<{ value: string; label: string }>;
  aiFeatures: Array<{ icon: string; title: string; desc: string }>;
  featuredSection: {
    eyebrow: string;
    title: string;
    highlightedTitle: string;
  };
  howItWorks: Array<{ number: string; title: string; desc: string }>;
  reviewSection: {
    eyebrow: string;
    title: string;
    highlightedTitle: string;
    subtitle: string;
  };
  ctaSection: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

export const defaultHomepageContent: HomepageContent = {
  hero: {
    badge: "Indexed by ChatGPT · Claude · DeepSeek · Qwen",
    title: "Get discovered by",
    highlightedTitle: "AI, not just search.",
    subtitle:
      "The business directory built for the LLM era. List your services once — we structure your data for humans and the AIs they ask for recommendations.",
    ctaPrimary: "List your business",
    ctaSecondary: "Browse directory",
  },
  stats: [
    { value: "12k+", label: "Verified Businesses" },
    { value: "180k", label: "Trusted Reviews" },
    { value: "94%", label: "AI Discovery Rate" },
    { value: "32M", label: "LLM API Calls / mo" },
  ],
  aiFeatures: [
    { icon: "Bot", title: "AI Recommendation Engine", desc: "Conversational discovery — describe a need, get matched to vetted vendors." },
    { icon: "Sparkles", title: "GEO-Optimized Listings", desc: "Every profile ships JSON-LD, so LLMs cite you in their answers." },
    { icon: "MessageSquare", title: "Review Sentiment AI", desc: "Auto-summarized pros & cons from hundreds of reviews in seconds." },
    { icon: "BarChart3", title: "LLM Visibility Analytics", desc: "Track how often ChatGPT, Claude, and Qwen mention your brand." },
    { icon: "Globe2", title: "Public LLM Data API", desc: "Structured JSON-LD endpoint ready for ingestion by any LLM crawler." },
    { icon: "ShieldCheck", title: "Verified & Moderated", desc: "Human + AI moderation keeps the marketplace high-trust." },
  ],
  featuredSection: {
    eyebrow: "Featured Vendors",
    title: "AI-ready",
    highlightedTitle: "businesses",
  },
  howItWorks: [
    { number: "01", title: "Claim your listing", desc: "Create a structured profile with services, pricing, portfolio, and case studies." },
    { number: "02", title: "We optimize for LLMs", desc: "Our pipeline emits JSON-LD, schema.org, and AI-readable summaries to public endpoints." },
    { number: "03", title: "Get cited by AI", desc: "ChatGPT, Claude, DeepSeek, and Qwen surface your brand in relevant recommendation queries." },
  ],
  reviewSection: {
    eyebrow: "Reviews that AIs trust",
    title: "Verified reviews,",
    highlightedTitle: "AI-summarized.",
    subtitle: "Every review is moderated, sentiment-analyzed, and distilled into pros/cons summaries that both humans and LLMs can parse instantly.",
  },
  ctaSection: {
    badge: "Limited founding member pricing",
    title: "Be the answer when AI is asked.",
    subtitle: "Join the directory built for the post-Google era. Get cited, get hired.",
    ctaPrimary: "Get listed free",
    ctaSecondary: "See pricing",
  },
};

function deepMerge<T extends Record<string, any>>(defaults: T, override: Partial<T>): T {
  const result = { ...defaults } as T;
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const defVal = defaults[key];
    const ovrVal = override[key];
    if (ovrVal === undefined || ovrVal === null) continue;
    if (Array.isArray(defVal) && Array.isArray(ovrVal)) {
      (result as any)[key] = ovrVal;
    } else if (typeof defVal === "object" && defVal !== null && typeof ovrVal === "object" && ovrVal !== null) {
      (result as any)[key] = deepMerge(defVal as any, ovrVal as any);
    } else {
      (result as any)[key] = ovrVal;
    }
  }
  return result;
}

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("value")
        .eq("key", "homepage_content")
        .maybeSingle();

      if (!error && data?.value) {
        const merged = deepMerge(defaultHomepageContent, data.value as Partial<HomepageContent>);
        setContent(merged);
      }
      setLoading(false);
    })();
  }, []);

  return { content, loading };
}