import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Link as LinkIcon } from "lucide-react";

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

const defaultBrand: BrandSettings = {
  siteName: "engineersTech",
  tagline: "AI Discovery",
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

export default function BrandingEditor() {
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const ogRef = useRef<HTMLInputElement>(null);

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
    })();
  }, []);

  function update(field: keyof BrandSettings, value: any) {
    setBrand((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(ref: React.RefObject<HTMLInputElement | null>, field: "logo_url" | "favicon_url" | "og_image_url") {
    const file = ref.current?.files?.[0];
    if (!file) return;
    setUploading(field);
    const ext = file.name.split(".").pop();
    const path = `branding/${field}_${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("logos").upload(path, file, {
      cacheControl: "31536000",
      upsert: true,
    });
    if (uploadErr) {
      toast.error(`Upload failed: ${uploadErr.message}`);
      setUploading(null);
      return;
    }
    const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
    update(field, urlData.publicUrl);
    setUploading(null);
    toast.success(`${field} uploaded`);
    if (ref.current) ref.current.value = "";
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("platform_settings").upsert(
      { key: "brand_settings", value: brand as any },
      { onConflict: "key" }
    );
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Brand settings saved!");
    }
    setSaving(false);
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display font-semibold text-lg">Branding & Logo</h2>
          <p className="text-sm text-muted-foreground">Site identity used in OG tags, browser title, logo, and JSON-LD.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-gradient text-sm">
          {saving ? "Saving…" : "Save branding"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Field label="Site name" value={brand.siteName} onChange={(v) => update("siteName", v)} />
          <Field label="Tagline" value={brand.tagline} onChange={(v) => update("tagline", v)} />
          <TextareaField label="Meta description" value={brand.description} onChange={(v) => update("description", v)} />
          <Field label="Twitter handle" value={brand.twitter_handle} onChange={(v) => update("twitter_handle", v)} />
          <Field label="Company URL" value={brand.company_url} onChange={(v) => update("company_url", v)} />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Primary color (hex)</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={brand.primary_color} onChange={(e) => update("primary_color", e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
              <input type="text" value={brand.primary_color} onChange={(e) => update("primary_color", e.target.value)} className="flex-1 h-10 px-3 rounded-lg bg-background border border-border text-sm font-mono" />
            </div>
          </div>
          <Field label="Display font" value={brand.font_display} onChange={(v) => update("font_display", v)} />
          <Field label="Body font" value={brand.font_body} onChange={(v) => update("font_body", v)} />
        </div>

        <div className="space-y-5">
          {/* Logo upload */}
          <div className="border border-border rounded-xl p-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">Logo</label>
            {brand.logo_url && (
              <div className="relative mb-3 inline-block">
                <img src={brand.logo_url} alt="Logo" className="h-16 rounded-lg border border-border" />
                <button onClick={() => update("logo_url", null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={() => uploadFile(logoRef, "logo_url")} />
              <button onClick={() => logoRef.current?.click()} disabled={uploading === "logo_url"} className="btn-ghost text-xs">
                {uploading === "logo_url" ? "Uploading…" : <><Upload className="w-3 h-3 inline mr-1" /> Upload logo</>}
              </button>
              {brand.logo_url && (
                <button onClick={() => { navigator.clipboard.writeText(brand.logo_url!); toast.success("URL copied"); }} className="btn-ghost text-xs">
                  <LinkIcon className="w-3 h-3 inline mr-1" /> Copy URL
                </button>
              )}
            </div>
          </div>

          {/* Favicon upload */}
          <div className="border border-border rounded-xl p-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">Favicon</label>
            {brand.favicon_url && (
              <div className="relative mb-3 inline-block">
                <img src={brand.favicon_url} alt="Favicon" className="h-10 w-10 rounded border border-border" />
                <button onClick={() => update("favicon_url", null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={() => uploadFile(faviconRef, "favicon_url")} />
              <button onClick={() => faviconRef.current?.click()} disabled={uploading === "favicon_url"} className="btn-ghost text-xs">
                {uploading === "favicon_url" ? "Uploading…" : <><Upload className="w-3 h-3 inline mr-1" /> Upload favicon</>}
              </button>
            </div>
          </div>

          {/* OG Image upload */}
          <div className="border border-border rounded-xl p-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-2">OG Image (social share)</label>
            {brand.og_image_url && (
              <div className="relative mb-3 inline-block">
                <img src={brand.og_image_url} alt="OG" className="h-20 rounded-lg border border-border" />
                <button onClick={() => update("og_image_url", null)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input ref={ogRef} type="file" accept="image/*" className="hidden" onChange={() => uploadFile(ogRef, "og_image_url")} />
              <button onClick={() => ogRef.current?.click()} disabled={uploading === "og_image_url"} className="btn-ghost text-xs">
                {uploading === "og_image_url" ? "Uploading…" : <><Upload className="w-3 h-3 inline mr-1" /> Upload OG image</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm" />
    </div>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm resize-y" />
    </div>
  );
}