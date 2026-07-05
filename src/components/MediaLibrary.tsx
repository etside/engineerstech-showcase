import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { adminApi, uploadApi } from "@/lib/api";
import { Upload, Trash2, Link as LinkIcon, Image as ImageIcon, RefreshCw, Search } from "lucide-react";

interface MediaFile {
  url: string;
  filename: string;
  size?: number;
  uploaded_at?: string;
}

export default function MediaLibrary() {
  const [files, setFiles]         = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const settings = await adminApi.getSettings();
      const media = ((settings as any).media_library || []) as MediaFile[];
      setFiles(media.reverse()); // newest first
    } catch { /* silent */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const results: MediaFile[] = [];
    for (const file of Array.from(fileList)) {
      try {
        const { url, filename } = await uploadApi.upload(file);
        results.push({ url, filename, uploaded_at: new Date().toISOString() });
        toast.success(`Uploaded: ${filename}`);
      } catch (err) {
        toast.error(`Failed: ${file.name} — ${(err as Error).message}`);
      }
    }
    if (results.length) {
      // Persist to media_library in settings
      try {
        const settings = await adminApi.getSettings();
        const existing = ((settings as any).media_library || []) as MediaFile[];
        await adminApi.updateSettings({ media_library: [...existing, ...results] });
      } catch { /* silent */ }
      await load();
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function deleteFile(url: string) {
    if (!window.confirm("Remove this file from the media library?")) return;
    try {
      const settings = await adminApi.getSettings();
      const existing = ((settings as any).media_library || []) as MediaFile[];
      await adminApi.updateSettings({ media_library: existing.filter((f) => f.url !== url) });
      toast.success("Removed from library");
      load();
    } catch (err) { toast.error((err as Error).message); }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }, []);

  const filtered = files.filter((f) =>
    !search || f.filename.toLowerCase().includes(search.toLowerCase())
  );

  const isImage = (url: string) =>
    /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?|$)/i.test(url);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl">Media Library</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload images and files. Copy URLs for use in branding, blog posts, and listings.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost text-sm py-2 px-4">
            <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" /> Refresh
          </button>
          <button onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-gradient text-sm py-2 px-5">
            <Upload className="w-3.5 h-3.5 inline mr-1.5" />
            {uploading ? "Uploading…" : "Upload files"}
          </button>
          <input ref={inputRef} type="file" accept="image/*,video/*,.pdf,.svg" multiple className="hidden"
            onChange={(e) => uploadFiles(e.target.files)} />
        </div>
      </div>

      {/* Drag-drop upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-10 cursor-pointer transition-all ${
          dragOver
            ? "border-primary bg-primary/10"
            : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
        }`}
      >
        <Upload className={`w-8 h-8 mb-3 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
        <p className="font-semibold text-sm text-foreground">
          {dragOver ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          or click to browse — images, SVG, PDF supported
        </p>
        {uploading && (
          <div className="mt-3 flex items-center gap-2 text-primary text-sm font-semibold">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Uploading…
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search files…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl bg-muted/30 border border-border text-sm focus:outline-none focus:border-primary/60"
        />
      </div>

      {/* File count */}
      <div className="text-xs text-muted-foreground">
        {filtered.length} file{filtered.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-sm text-muted-foreground py-12 text-center">Loading media library…</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? "No files match your search." : "No files uploaded yet. Drag & drop or click Upload."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((f) => (
            <div key={f.url} className="glass-card group overflow-hidden rounded-xl border border-border/60 hover:border-primary/40 transition-colors">
              {/* Thumbnail */}
              <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                {isImage(f.url) ? (
                  <img src={f.url} alt={f.filename} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex flex-col items-center gap-1 p-3 text-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-mono truncate w-full">
                      {f.filename.split(".").pop()?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Meta + actions */}
              <div className="p-2.5">
                <p className="text-[11px] text-foreground font-medium truncate" title={f.filename}>
                  {f.filename}
                </p>
                {f.uploaded_at && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(f.uploaded_at).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => copyUrl(f.url)}
                    className="flex-1 flex items-center justify-center gap-1 text-[10px] py-1.5 rounded-lg bg-muted/40 hover:bg-primary/15 hover:text-primary-light transition-colors font-semibold"
                    title="Copy URL"
                  >
                    <LinkIcon className="w-3 h-3" /> Copy
                  </button>
                  <button
                    onClick={() => deleteFile(f.url)}
                    className="flex items-center justify-center w-7 rounded-lg bg-muted/40 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
