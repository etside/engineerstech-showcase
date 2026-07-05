import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { adminApi, uploadApi } from "@/lib/api";
import { Upload, Trash2, Link as LinkIcon, Eye, Palette, RefreshCw } from "lucide-react";

export interface BrandSettings {
  siteName: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  primary_color: string;
  font_display: string;
  font_body: string;
  twitter_handle: string;
  company_url: string;
}

export const defaultBrand: BrandSettings = {
  siteName: "engineersTech",
  tagline: "AI Discovery",
  description: "The business directory built for the LLM era. Get discovered by AI, not just search.",
  logo_url: null,
  favicon_url: null,
  og_image_url: null,
  primary_color: "#22c55e",
  font_display: "DM Sans",
  font_body: "Inter",
  twitter_handle: "@engineerstech",
  company_url: "https://engineerstechbd.com",
};

const COLOR_PRESETS = [
  { name: "Green",   hex: "#22c55e" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Teal",    hex: "#14b8a6" },
  { name: "Blue",    hex: "#3b82f6" },
  { name: "Indigo",  hex: "#6366f1" },
  { name: "Violet",  hex: "#8b5cf6" },
  { name: "Orange",  hex: "#f97316" },
  { name: "Rose",    hex: "#f43f5e" },
];

export function hexToHsl(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch { return "142 76% 45%"; }
}

export function injectPrimaryColor(hex: string) {
  if (!hex || hex.length < 7) return;
  try {
    const hsl = hexToHsl(hex);
    const [h, s, lRaw] = hsl.split(" ");
    const l = parseFloat(lRaw);
    const root = document.documentElement;
    root.style.setProperty("--primary",       hsl);
    root.style.setProperty("--ring",          hsl);
    root.style.setProperty("--accent",        hsl);
    root.style.setProperty("--hero-glow-1",   hsl);
    root.style.setProperty("--primary-light", `${h} ${s} ${Math.min(l + 15, 92)}%`);
    root.style.setProperty("--primary-glow",  `${h} ${s} ${Math.min(l + 8,  88)}%`);
  } catch { /* ignore */ }
}

export default function BrandingEditor() {
  const [brand, setBrand]         = useState<BrandSettings>(defaultBrand);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const logoRef    = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const ogRef      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const settings = await adminApi.getSettings();
        const data = (settings.brand_settings ?? settings.brand) as Partial<BrandSettings> | undefined;
        if (data) {
          const merged = { ...defaultBrand, ...data };
          setBrand(merged);
          injectPrimaryColor(merged.primary_color);
        }
      } catch { /* keep defaults */ }
    })();
  }, []);

  useEffect(() => {
    if (brand.primary_color.length === 7) injectPrimaryColor(brand.primary_color);
  }, [brand.primary_color]);

  function update(field: keyof BrandSettings, value: string | null) {
    setBrand((p) => ({ ...p, [field]: value }));
  }

  async function uploadFile(
    ref: React.RefObject<HTMLInputElement | null>,
    field: "logo_url" | "favicon_url" | "og_image_url"
  ) {
    const file = ref.current?.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const { url } = await uploadApi.upload(file);
      update(field, url);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(`Upload failed: ${(err as Error).message}`);
    }
    setUploading(null);
    if (ref.current) ref.current.value = "";
  }

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateSettings({ brand_settings: brand });
      toast.success("Brand settings saved!");
    } catch (err) {
      toast.error((err as Error).message);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Branding & Identity</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Site name, colors, fonts, and logos. Color changes apply live.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setBrand(defaultBrand); injectPrimaryColor(defaultBrand.primary_color); toast.info("Defaults loaded — save to persist."); }} className="btn-ghost text-sm py-2 px-4">
            <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Reset
          </button>
          <button onClick={() => setShowPreview((v) => !v)} className="btn-ghost text-sm py-2 px-4">
            <Eye className="w-3.5 h-3.5 inline mr-1.5" /> {showPreview ? "Hide preview" : "Preview"}
          </button>
          <button onClick={save} disabled={saving} className="btn-gradient text-sm py-2 px-5">
            {saving ? "Saving…" : "Save branding"}
          </button>
        </div>
      </div>

      {/* Live Preview Bar */}
      {showPreview && (
        <div className="glass-card p-5 border-primary/30">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-bold">Live Preview</div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{ background: brand.primary_color }}>
              {brand.siteName.charAt(0)}
            </div>
            <div>
              <div className="font-display font-extrabold text-base">
                <span className="text-foreground">{brand.siteName}</span>
              </div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase font-semibold">{brand.tagline}</div>
            </div>
            <button className="px-4 py-1.5 rounded-lg text-sm font-bold text-white" style={{ background: brand.primary_color }}>
              Get Started
            </button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-semibold border" style={{ borderColor: brand.primary_color, color: brand.primary_color }}>
              Learn More
            </button>
            <div className="flex gap-2 ml-auto">
              {COLOR_PRESETS.map((p) => (
                <button key={p.hex} title={p.name} onClick={() => update("primary_color", p.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${brand.primary_color === p.hex ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
                  style={{ background: p.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: text + color */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary-light">Identity</div>
            <BField label="Site name"        value={brand.siteName}       onChange={(v) => update("siteName", v)} />
            <BField label="Tagline"          value={brand.tagline}        onChange={(v) => update("tagline", v)} />
            <BTextarea label="Meta description" value={brand.description} onChange={(v) => update("description", v)} />
            <BField label="Twitter handle"   value={brand.twitter_handle} onChange={(v) => update("twitter_handle", v)} />
            <BField label="Company URL"      value={brand.company_url}    onChange={(v) => update("company_url", v)} />
          </div>

          <div className="glass-card p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary-light flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" /> Color & Typography
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">Primary color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={brand.primary_color}
                  onChange={(e) => update("primary_color", e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5" />
                <input type="text" value={brand.primary_color} maxLength={7}
                  onChange={(e) => update("primary_color", e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:border-primary/60" />
                <div className="w-10 h-10 rounded-lg border border-border shrink-0" style={{ background: brand.primary_color }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Changes apply live in the browser. Save to persist.</p>
            </div>
            <BField label="Display font (headlines)" value={brand.font_display} onChange={(v) => update("font_display", v)} />
            <BField label="Body font"                value={brand.font_body}    onChange={(v) => update("font_body", v)} />
          </div>
        </div>

        {/* Right: uploads */}
        <div className="space-y-4">
          <UploadSlot label="Logo" hint="SVG or PNG, transparent bg recommended"
            url={brand.logo_url} uploading={uploading === "logo_url"}
            inputRef={logoRef} accept="image/*"
            onChange={() => uploadFile(logoRef, "logo_url")}
            onRemove={() => update("logo_url", null)}
            onCopy={() => { navigator.clipboard.writeText(brand.logo_url!); toast.success("Copied"); }}
            previewClass="h-16" />

          <UploadSlot label="Favicon" hint="ICO or PNG 32×32 / 64×64"
            url={brand.favicon_url} uploading={uploading === "favicon_url"}
            inputRef={faviconRef} accept="image/*"
            onChange={() => uploadFile(faviconRef, "favicon_url")}
            onRemove={() => update("favicon_url", null)}
            onCopy={() => { navigator.clipboard.writeText(brand.favicon_url!); toast.success("Copied"); }}
            previewClass="h-10 w-10" />

          <UploadSlot label="OG / Social share image" hint="1200×630 JPG or PNG"
            url={brand.og_image_url} uploading={uploading === "og_image_url"}
            inputRef={ogRef} accept="image/*"
            onChange={() => uploadFile(ogRef, "og_image_url")}
            onRemove={() => update("og_image_url", null)}
            onCopy={() => { navigator.clipboard.writeText(brand.og_image_url!); toast.success("Copied"); }}
            previewClass="h-20 w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

function UploadSlot({ label, hint, url, uploading, inputRef, accept, onChange, onRemove, onCopy, previewClass }: {
  label: string; hint: string; url: string | null; uploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>; accept: string;
  onChange: () => void; onRemove: () => void; onCopy: () => void; previewClass: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
      <div className="text-[11px] text-muted-foreground/60 mb-3">{hint}</div>
      {url ? (
        <div className="relative inline-block mb-3">
          <img src={url} alt={label} className={`rounded-lg border border-border ${previewClass}`} />
          <button onClick={onRemove} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center">
            <Trash2 className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()}
          className="mb-3 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center h-20 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
          <Upload className="w-5 h-5 text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Click or drag to upload</p>
        </div>
      )}
      <div className="flex gap-2">
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-ghost text-xs py-1.5 px-3">
          <Upload className="w-3 h-3 inline mr-1" />{uploading ? "Uploading…" : url ? "Replace" : "Upload"}
        </button>
        {url && (
          <button onClick={onCopy} className="btn-ghost text-xs py-1.5 px-3">
            <LinkIcon className="w-3 h-3 inline mr-1" />Copy URL
          </button>
        )}
      </div>
    </div>
  );
}

function BField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary/60 transition-colors" />
    </div>
  );
}

function BTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-y focus:outline-none focus:border-primary/60 transition-colors" />
    </div>
  );
}
