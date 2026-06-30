import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HomepageContent, defaultHomepageContent } from "@/hooks/useHomepageContent";

export default function HomepageEditor() {
  const [content, setContent] = useState<HomepageContent>(defaultHomepageContent);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

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
    })();
  }, []);

  function updateSection(path: string, value: any) {
    setContent((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function updateArrayItem(section: keyof HomepageContent, index: number, key: string, value: any) {
    setContent((prev) => {
      const next = structuredClone(prev);
      const arr = next[section] as any[];
      if (arr[index]) {
        arr[index][key] = value;
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("platform_settings").upsert(
      { key: "homepage_content", value: content as any },
      { onConflict: "key" }
    );
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Homepage content saved!");
    }
    setSaving(false);
  }

  async function resetDefaults() {
    setContent(structuredClone(defaultHomepageContent));
    toast.info("Defaults loaded — click Save to persist.");
  }

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "stats", label: "Stats" },
    { id: "aiFeatures", label: "AI Features" },
    { id: "featuredSection", label: "Featured" },
    { id: "howItWorks", label: "How It Works" },
    { id: "reviewSection", label: "Reviews" },
    { id: "ctaSection", label: "CTA" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display font-semibold text-lg">Homepage Content CMS</h2>
          <p className="text-sm text-muted-foreground">
            Edit every text block on the public homepage. Changes go live immediately after saving.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefaults} className="btn-ghost text-sm">Reset defaults</button>
          <button onClick={save} disabled={saving} className="btn-gradient text-sm">
            {saving ? "Saving…" : "Save all changes"}
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 flex-wrap border-b border-border pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSection(t.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSection === t.id
                ? "bg-primary/15 text-primary-light border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero section */}
      {activeSection === "hero" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Hero Section</h3>
          <Field label="Badge" value={content.hero.badge} onChange={(v) => updateSection("hero.badge", v)} />
          <Field label="Title (before highlight)" value={content.hero.title} onChange={(v) => updateSection("hero.title", v)} />
          <Field label="Highlighted title" value={content.hero.highlightedTitle} onChange={(v) => updateSection("hero.highlightedTitle", v)} />
          <TextareaField label="Subtitle" value={content.hero.subtitle} onChange={(v) => updateSection("hero.subtitle", v)} />
          <Field label="Primary CTA" value={content.hero.ctaPrimary} onChange={(v) => updateSection("hero.ctaPrimary", v)} />
          <Field label="Secondary CTA" value={content.hero.ctaSecondary} onChange={(v) => updateSection("hero.ctaSecondary", v)} />
        </div>
      )}

      {/* Stats section */}
      {activeSection === "stats" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Stat Cards</h3>
          <p className="text-xs text-muted-foreground">Up to 4 stats shown in the hero section.</p>
          {content.stats.map((stat, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Card #{i + 1}</div>
              <Field label="Value" value={stat.value} onChange={(v) => updateArrayItem("stats", i, "value", v)} />
              <Field label="Label" value={stat.label} onChange={(v) => updateArrayItem("stats", i, "label", v)} />
            </div>
          ))}
        </div>
      )}

      {/* AI Features section */}
      {activeSection === "aiFeatures" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">AI Features Cards</h3>
          <p className="text-xs text-muted-foreground">These are the 6 feature cards under the AI Discovery section.</p>
          {content.aiFeatures.map((f, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Feature #{i + 1}</div>
              <Field label="Icon name (Lucide)" value={f.icon} onChange={(v) => updateArrayItem("aiFeatures", i, "icon", v)} />
              <Field label="Title" value={f.title} onChange={(v) => updateArrayItem("aiFeatures", i, "title", v)} />
              <TextareaField label="Description" value={f.desc} onChange={(v) => updateArrayItem("aiFeatures", i, "desc", v)} />
            </div>
          ))}
        </div>
      )}

      {/* Featured section */}
      {activeSection === "featuredSection" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Featured Vendors Section</h3>
          <Field label="Eyebrow" value={content.featuredSection.eyebrow} onChange={(v) => updateSection("featuredSection.eyebrow", v)} />
          <Field label="Title" value={content.featuredSection.title} onChange={(v) => updateSection("featuredSection.title", v)} />
          <Field label="Highlighted title" value={content.featuredSection.highlightedTitle} onChange={(v) => updateSection("featuredSection.highlightedTitle", v)} />
        </div>
      )}

      {/* How It Works section */}
      {activeSection === "howItWorks" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">How It Works Steps</h3>
          {content.howItWorks.map((step, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Step #{i + 1}</div>
              <Field label="Number" value={step.number} onChange={(v) => updateArrayItem("howItWorks", i, "number", v)} />
              <Field label="Title" value={step.title} onChange={(v) => updateArrayItem("howItWorks", i, "title", v)} />
              <TextareaField label="Description" value={step.desc} onChange={(v) => updateArrayItem("howItWorks", i, "desc", v)} />
            </div>
          ))}
        </div>
      )}

      {/* Review section */}
      {activeSection === "reviewSection" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Review Section</h3>
          <Field label="Eyebrow" value={content.reviewSection.eyebrow} onChange={(v) => updateSection("reviewSection.eyebrow", v)} />
          <Field label="Title" value={content.reviewSection.title} onChange={(v) => updateSection("reviewSection.title", v)} />
          <Field label="Highlighted title" value={content.reviewSection.highlightedTitle} onChange={(v) => updateSection("reviewSection.highlightedTitle", v)} />
          <TextareaField label="Subtitle" value={content.reviewSection.subtitle} onChange={(v) => updateSection("reviewSection.subtitle", v)} />
        </div>
      )}

      {/* CTA section */}
      {activeSection === "ctaSection" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Call-to-Action Section</h3>
          <Field label="Badge" value={content.ctaSection.badge} onChange={(v) => updateSection("ctaSection.badge", v)} />
          <Field label="Title" value={content.ctaSection.title} onChange={(v) => updateSection("ctaSection.title", v)} />
          <TextareaField label="Subtitle" value={content.ctaSection.subtitle} onChange={(v) => updateSection("ctaSection.subtitle", v)} />
          <Field label="Primary CTA" value={content.ctaSection.ctaPrimary} onChange={(v) => updateSection("ctaSection.ctaPrimary", v)} />
          <Field label="Secondary CTA" value={content.ctaSection.ctaSecondary} onChange={(v) => updateSection("ctaSection.ctaSecondary", v)} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-y"
      />
    </div>
  );
}

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