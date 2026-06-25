import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function Submit() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [f, setF] = useState({ name: "", tagline: "", description: "", website: "", email: "", category: "software", country: "Bangladesh", services: "" });
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<Array<{ slug: string; name: string }>>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    supabase.from("categories").select("slug,name").order("name").then(({ data }) => setCats(data || []));
  }, []);

  if (authed === false) {
    return <div className="container-tight py-20 text-center"><p className="mb-4">Sign in to submit a listing.</p><button className="btn-gradient" onClick={() => nav("/auth?mode=signup")}>Sign in</button></div>;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const slug = slugify(f.name) + "-" + Math.random().toString(36).slice(2, 6);
    const { error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      claimed_by: user.id,
      slug,
      name: f.name,
      tagline: f.tagline,
      description: f.description,
      website: f.website,
      email: f.email,
      category: f.category,
      country: f.country,
      services: f.services.split(",").map((s) => s.trim()).filter(Boolean),
      is_active: false,
      verification_status: "pending",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Listing submitted — pending admin approval");
    nav("/dashboard");
  }

  return (
    <section className="container-tight py-12 max-w-2xl">
      <h1 className="display-2 mb-2">Submit your business</h1>
      <p className="text-muted-foreground mb-8">Listings go live after admin verification (usually under 24 hours).</p>
      <form onSubmit={submit} className="glass-card p-6 space-y-4">
        {[
          { k: "name", l: "Business name", req: true },
          { k: "tagline", l: "Tagline" },
          { k: "website", l: "Website" },
          { k: "email", l: "Contact email" },
          { k: "country", l: "Country" },
          { k: "services", l: "Services (comma-separated)" },
        ].map((field) => (
          <div key={field.k}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{field.l}</label>
            <input
              required={field.req}
              value={(f as Record<string, string>)[field.k]}
              onChange={(e) => setF({ ...f, [field.k]: e.target.value })}
              className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
            />
          </div>
        ))}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</label>
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="mt-1 w-full h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm">
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Description</label>
          <textarea required value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={5} className="mt-1 w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm" />
        </div>
        <button disabled={loading} className="btn-gradient w-full justify-center">{loading ? "Submitting…" : "Submit listing"}</button>
      </form>
    </section>
  );
}