// Runs via predev/prebuild; writes public/sitemap.xml from static routes + DB categories + businesses.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = process.env.SITE_URL || "";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

type Entry = { path: string; lastmod?: string; changefreq?: string; priority?: string };

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/listings", changefreq: "daily", priority: "0.9" },
  { path: "/categories", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-discover", changefreq: "weekly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/submit", changefreq: "monthly", priority: "0.6" },
  { path: "/for-vendors", changefreq: "monthly", priority: "0.7" },
  { path: "/how-it-works", changefreq: "monthly", priority: "0.7" },
  { path: "/leaderboards", changefreq: "weekly", priority: "0.7" },
  { path: "/resources", changefreq: "weekly", priority: "0.6" },
  { path: "/api-docs", changefreq: "monthly", priority: "0.5" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/services", changefreq: "monthly", priority: "0.5" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

async function dynamicEntries(): Promise<Entry[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const db = createClient(SUPABASE_URL, SUPABASE_KEY);
    const [cats, biz] = await Promise.all([
      db.from("categories").select("slug,updated_at"),
      db
        .from("businesses")
        .select("slug,updated_at,is_active")
        .eq("is_active", true)
        .limit(5000),
    ]);
    const catEntries: Entry[] = (cats.data ?? []).flatMap((c: { slug: string; updated_at?: string }) => [
      { path: `/categories/${c.slug}`, changefreq: "daily", priority: "0.8", lastmod: c.updated_at },
      { path: `/listings?category=${c.slug}`, changefreq: "daily", priority: "0.6" },
    ]);
    const bizEntries: Entry[] = (biz.data ?? []).map((b: { slug: string; updated_at?: string }) => ({
      path: `/business/${b.slug}`,
      changefreq: "weekly",
      priority: "0.7",
      lastmod: b.updated_at,
    }));
    return [...catEntries, ...bizEntries];
  } catch (e) {
    console.warn("sitemap: dynamic fetch failed", e);
    return [];
  }
}

function render(entries: Entry[]) {
  const urls = entries.map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

(async () => {
  const all = [...staticEntries, ...(await dynamicEntries())];
  writeFileSync(resolve("public/sitemap.xml"), render(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
})();