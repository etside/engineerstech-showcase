import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BrandSettings } from "@/components/BrandingEditor";

const defaultBrand: BrandSettings = {
  siteName: "engineersTech",
  tagline: "AI Discovery Platform",
  description: "The business directory built for the LLM era. Get discovered by AI, not just search.",
  logo_url: null,
  favicon_url: null,
  og_image_url: null,
  primary_color: "#6366f1",
  font_display: "DM Sans",
  font_body: "Inter",
  twitter_handle: "@engineerstech",
  company_url: "https://engineerstechbd.com",
};

export function useBrandSettings() {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("value")
        .eq("key", "brand_settings")
        .maybeSingle();
      if (!error && data?.value) {
        setBrand({ ...defaultBrand, ...(data.value as Partial<BrandSettings>) });
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading && brand) {
      // Update HTML head elements dynamically
      document.title = `${brand.siteName} — ${brand.tagline}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", brand.description);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", `${brand.siteName} — ${brand.tagline}`);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", brand.description);

      if (brand.og_image_url) {
        const ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute("content", brand.og_image_url);
        const twitterImg = document.querySelector('meta[name="twitter:image"]');
        if (twitterImg) twitterImg.setAttribute("content", brand.og_image_url);
      }

      if (brand.favicon_url) {
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = brand.favicon_url;
      }
    }
  }, [brand, loading]);

  return { brand, loading };
}