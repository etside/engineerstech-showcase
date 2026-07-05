import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { defaultBrand, hexToHsl, injectPrimaryColor } from "@/components/BrandingEditor";
import type { BrandSettings } from "@/components/BrandingEditor";

function applyBrandToHead(brand: BrandSettings) {
  const title = `${brand.siteName} — ${brand.tagline}`;
  document.title = title;
  const set = (sel: string, attr: string, val: string) => {
    document.querySelector(sel)?.setAttribute(attr, val);
  };
  set('meta[name="description"]',         "content", brand.description);
  set('meta[property="og:title"]',         "content", title);
  set('meta[property="og:description"]',   "content", brand.description);
  set('meta[name="twitter:title"]',        "content", title);
  set('meta[name="twitter:description"]',  "content", brand.description);
  if (brand.og_image_url) {
    set('meta[property="og:image"]',  "content", brand.og_image_url);
    set('meta[name="twitter:image"]', "content", brand.og_image_url);
  }
  if (brand.favicon_url) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = brand.favicon_url;
  }
}

export function useBrandSettings() {
  const [brand, setBrand]     = useState<BrandSettings>(defaultBrand);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const settings = await adminApi.getSettings();
        // Fix: was reading settings.brand — correct key is brand_settings
        const data = (settings.brand_settings ?? settings.brand) as Partial<BrandSettings> | undefined;
        if (data) setBrand({ ...defaultBrand, ...data });
      } catch { /* keep defaults */ }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      injectPrimaryColor(brand.primary_color);
      applyBrandToHead(brand);
    }
  }, [brand, loading]);

  return { brand, loading };
}
