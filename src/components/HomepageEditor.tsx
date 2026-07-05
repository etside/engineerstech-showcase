import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";
import { HomepageContent, defaultHomepageContent } from "@/hooks/useHomepageContent";

// Deep merge utility
function deepMerge<T extends Record<string, any>>(defaults: T, override: Partial<T>): T {
  const result = { ...defaults } as T;
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const defVal = defaults[key];
    const ovrVal = override[key];
    if (ovrVal === undefined || ovrVal === null) continue;
    if (Array.isArray(defVal) && Array.isArray(ovrVal)) {
      (result as any)[key] = ovrVal;
    } else if (typeof defVal === "object" && defVal !== null && typeof ovrVal === "object") {
      (result as any)[key] = deepMerge(defVal as any, ovrVal as any);
    } else {
      (result as any)[key] = ovrVal;
    }
  }
  return result;
}

// Field components
function HField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary/60" />
    </div>
  );
}

function HTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-y focus:outline-none focus:border-primary/60" />
    </div>
  );
}

export default function HomepageEditor() {
  const [content, setContent]         = useState<HomepageContent>(defaultHomepageContent);
  const [saving, setSaving]           = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    (async () => {
      try {
        const settings = await adminApi.getSettings();
        const homepage = settings.homepage_content as Partial<HomepageContent> | undefined;
        if (homepage) setContent(deepMerge(defaultHomepageContent, homepage));
      } catch { /* keep defaults */ }
    })();
  }, []);

  function updateSection(path: string, value: any) {
    setContent((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function updateArrayItem(section: keyof HomepageContent, index: number, key: string, value: any) {
    setContent((prev) => {
      const next = structuredClone(prev);
      const arr = next[section] as any[];
      if (arr[index]) arr[index][key] = value;
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateSettings({ homepage_content: content });
      toast.success("Homepage content saved!");
    } catch (err) { toast.error((err as Error).message); }
    setSaving(false);
  }

  const tabs = [
    { id: "hero",          label: "Hero" },
    { id: "stats",         label: "Stats" },
    { id: "aiFeatures",    label: "AI Features" },
    { id: "featuredSection", label: "Featured" },
    { id: "howItWorks",    label: "How It Works" },
    { id: "community",     label: "Community" },
    { id: "globalTeam",    label: "Global Team" },
    { id: "support",       label: "Support" },
    { id: "reviewSection", label: "Reviews" },
    { id: "ctaSection",    label: "CTA" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display font-bold text-xl">Homepage Content CMS</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Edit every text block on the public homepage. Changes go live after saving.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setContent(structuredClone(defaultHomepageContent)); toast.info("Defaults loaded — save to persist."); }}
            className="btn-ghost text-sm">Reset defaults</button>
          <button onClick={save} disabled={saving} className="btn-gradient text-sm">
            {saving ? "Saving…" : "Save all changes"}
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 flex-wrap border-b border-border pb-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveSection(t.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeSection === t.id
                ? "bg-primary/15 text-primary-light border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Hero ── */}
      {activeSection === "hero" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Hero Section</h3>
          <HField label="Badge"              value={content.hero.badge}            onChange={(v) => updateSection("hero.badge", v)} />
          <HField label="Title (line 1)"     value={content.hero.title}            onChange={(v) => updateSection("hero.title", v)} />
          <HField label="Highlighted title (line 2)" value={content.hero.highlightedTitle} onChange={(v) => updateSection("hero.highlightedTitle", v)} />
          <HTextarea label="Subtitle"        value={content.hero.subtitle}         onChange={(v) => updateSection("hero.subtitle", v)} />
          <HField label="Primary CTA label"  value={content.hero.ctaPrimary}       onChange={(v) => updateSection("hero.ctaPrimary", v)} />
          <HField label="Secondary CTA label" value={content.hero.ctaSecondary}   onChange={(v) => updateSection("hero.ctaSecondary", v)} />
        </div>
      )}

      {/* ── Stats ── */}
      {activeSection === "stats" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Stat Cards</h3>
          <p className="text-xs text-muted-foreground">Shown in hero section and stats ribbon.</p>
          {content.stats.map((stat, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">Stat #{i + 1}</div>
              <HField label="Value (e.g. 500+)"  value={stat.value} onChange={(v) => updateArrayItem("stats", i, "value", v)} />
              <HField label="Label"              value={stat.label} onChange={(v) => updateArrayItem("stats", i, "label", v)} />
            </div>
          ))}
        </div>
      )}

      {/* ── AI Features ── */}
      {activeSection === "aiFeatures" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">AI Features Cards</h3>
          <p className="text-xs text-muted-foreground">6 feature cards in the AI Discovery section.</p>
          {content.aiFeatures.map((f, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">Feature #{i + 1}</div>
              <HField label="Lucide icon name" value={f.icon}  onChange={(v) => updateArrayItem("aiFeatures", i, "icon", v)} />
              <HField label="Title"            value={f.title} onChange={(v) => updateArrayItem("aiFeatures", i, "title", v)} />
              <HTextarea label="Description"   value={f.desc}  onChange={(v) => updateArrayItem("aiFeatures", i, "desc", v)} />
            </div>
          ))}
        </div>
      )}

      {/* ── Featured Section ── */}
      {activeSection === "featuredSection" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Featured Vendors Section</h3>
          <HField label="Eyebrow"          value={content.featuredSection.eyebrow}          onChange={(v) => updateSection("featuredSection.eyebrow", v)} />
          <HField label="Title"            value={content.featuredSection.title}            onChange={(v) => updateSection("featuredSection.title", v)} />
          <HField label="Highlighted title" value={content.featuredSection.highlightedTitle} onChange={(v) => updateSection("featuredSection.highlightedTitle", v)} />
        </div>
      )}

      {/* ── How It Works ── */}
      {activeSection === "howItWorks" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">How It Works Steps</h3>
          {content.howItWorks.map((step, i) => (
            <div key={i} className="border border-border rounded-xl p-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">Step #{i + 1}</div>
              <HField label="Number (e.g. 01)" value={step.number} onChange={(v) => updateArrayItem("howItWorks", i, "number", v)} />
              <HField label="Title"            value={step.title}  onChange={(v) => updateArrayItem("howItWorks", i, "title", v)} />
              <HTextarea label="Description"   value={step.desc}   onChange={(v) => updateArrayItem("howItWorks", i, "desc", v)} />
            </div>
          ))}
        </div>
      )}

      {/* ── Community (new) ── */}
      {activeSection === "community" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Community Section</h3>
          <p className="text-xs text-muted-foreground">Discord and YouTube community section.</p>
          <div className="border border-border rounded-xl p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">Section header</div>
            <HField label="Eyebrow label" value={(content as any).communitySection?.eyebrow ?? "Community"}
              onChange={(v) => updateSection("communitySection.eyebrow", v)} />
            <HField label="Headline"      value={(content as any).communitySection?.title ?? "A community that adds value"}
              onChange={(v) => updateSection("communitySection.title", v)} />
            <HTextarea label="Subtitle"   value={(content as any).communitySection?.subtitle ?? "Join engineersTech members discussing industry trends."}
              onChange={(v) => updateSection("communitySection.subtitle", v)} />
          </div>
          <div className="border border-border rounded-xl p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">Discord card</div>
            <HField label="Title"       value={(content as any).communitySection?.discordTitle ?? "Discord community"}
              onChange={(v) => updateSection("communitySection.discordTitle", v)} />
            <HTextarea label="Body text" value={(content as any).communitySection?.discordBody ?? "Real-time discussion with engineers worldwide."}
              onChange={(v) => updateSection("communitySection.discordBody", v)} />
            <HField label="Discord invite URL" value={(content as any).communitySection?.discordUrl ?? "https://discord.gg/engineerstech"}
              onChange={(v) => updateSection("communitySection.discordUrl", v)} />
          </div>
          <div className="border border-border rounded-xl p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">YouTube card</div>
            <HField label="Title"       value={(content as any).communitySection?.youtubeTitle ?? "YouTube community"}
              onChange={(v) => updateSection("communitySection.youtubeTitle", v)} />
            <HTextarea label="Body text" value={(content as any).communitySection?.youtubeBody ?? "Subscribe to vendor spotlights and GEO tutorials."}
              onChange={(v) => updateSection("communitySection.youtubeBody", v)} />
            <HField label="YouTube channel URL" value={(content as any).communitySection?.youtubeUrl ?? "https://youtube.com/@engineerstech"}
              onChange={(v) => updateSection("communitySection.youtubeUrl", v)} />
          </div>
        </div>
      )}

      {/* ── Global Team (new) ── */}
      {activeSection === "globalTeam" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Global Team Section</h3>
          <p className="text-xs text-muted-foreground">"Powered by a global team" section stats.</p>
          <HField label="Headline"  value={(content as any).globalTeamSection?.title ?? "Powered by a global team"}
            onChange={(v) => updateSection("globalTeamSection.title", v)} />
          <HTextarea label="Subtitle" value={(content as any).globalTeamSection?.subtitle ?? "Dozens of engineers across multiple hubs, focused on one thing: engineersTech users."}
            onChange={(v) => updateSection("globalTeamSection.subtitle", v)} />
          {[
            { key: "teamMembers",   label: "Team members count" },
            { key: "globalOffices", label: "Global offices count" },
            { key: "countries",     label: "Countries served count" },
            { key: "operations",    label: "Operations label (e.g. 24/7)" },
          ].map((f) => (
            <HField key={f.key} label={f.label}
              value={(content as any).globalTeamSection?.[f.key] ?? ""}
              onChange={(v) => updateSection(`globalTeamSection.${f.key}`, v)} />
          ))}
        </div>
      )}

      {/* ── Support (new) ── */}
      {activeSection === "support" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Support Section</h3>
          <p className="text-xs text-muted-foreground">"Support that never clocks out" section.</p>
          <HField label="Headline line 1" value={(content as any).supportSection?.headline1 ?? "Support that never"}
            onChange={(v) => updateSection("supportSection.headline1", v)} />
          <HField label="Headline line 2 (highlighted)" value={(content as any).supportSection?.headline2 ?? "clocks out"}
            onChange={(v) => updateSection("supportSection.headline2", v)} />
          <HTextarea label="Body paragraph" value={(content as any).supportSection?.body ?? "Our support team operates 24 hours a day, 7 days a week."}
            onChange={(v) => updateSection("supportSection.body", v)} />
          <HField label="Satisfaction stat (e.g. 98%)" value={(content as any).supportSection?.satisfactionStat ?? "98%"}
            onChange={(v) => updateSection("supportSection.satisfactionStat", v)} />
          <HField label="Response time stat (e.g. <25s)" value={(content as any).supportSection?.responseStat ?? "<25s"}
            onChange={(v) => updateSection("supportSection.responseStat", v)} />
          <HField label="Primary CTA label" value={(content as any).supportSection?.ctaPrimary ?? "Get Support"}
            onChange={(v) => updateSection("supportSection.ctaPrimary", v)} />
          <HField label="Secondary CTA label" value={(content as any).supportSection?.ctaSecondary ?? "Read FAQs"}
            onChange={(v) => updateSection("supportSection.ctaSecondary", v)} />
        </div>
      )}

      {/* ── Review Section ── */}
      {activeSection === "reviewSection" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Reviews Section</h3>
          <HField label="Eyebrow"           value={content.reviewSection.eyebrow}          onChange={(v) => updateSection("reviewSection.eyebrow", v)} />
          <HField label="Title"             value={content.reviewSection.title}            onChange={(v) => updateSection("reviewSection.title", v)} />
          <HField label="Highlighted title" value={content.reviewSection.highlightedTitle} onChange={(v) => updateSection("reviewSection.highlightedTitle", v)} />
          <HTextarea label="Subtitle"       value={content.reviewSection.subtitle}         onChange={(v) => updateSection("reviewSection.subtitle", v)} />
        </div>
      )}

      {/* ── CTA ── */}
      {activeSection === "ctaSection" && (
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-semibold">Final Call-to-Action</h3>
          <HField label="Badge"             value={content.ctaSection.badge}      onChange={(v) => updateSection("ctaSection.badge", v)} />
          <HField label="Title"             value={content.ctaSection.title}      onChange={(v) => updateSection("ctaSection.title", v)} />
          <HTextarea label="Subtitle"       value={content.ctaSection.subtitle}   onChange={(v) => updateSection("ctaSection.subtitle", v)} />
          <HField label="Primary CTA"       value={content.ctaSection.ctaPrimary} onChange={(v) => updateSection("ctaSection.ctaPrimary", v)} />
          <HField label="Secondary CTA"     value={content.ctaSection.ctaSecondary} onChange={(v) => updateSection("ctaSection.ctaSecondary", v)} />
        </div>
      )}
    </div>
  );
}
