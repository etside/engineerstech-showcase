import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { invokeFn } from "@/lib/fn";

type Rec = {
  businessId: string;
  score: number;
  reason: string;
  position: number;
  business: { slug: string; name: string; tagline: string; category: string; rating: number };
};

export default function AiDiscover() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run(intent: string) {
    setLoading(true); setErr(null); setRecs([]);
    try {
      const data = await invokeFn<{ recommendations: Rec[] }>("geo-recommend", { intent, limit: 6 });
      setRecs(data.recommendations || []);
    } catch (e) { setErr((e as Error).message); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (initial) run(initial); }, []);

  return (
    <section className="container-tight pt-12 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="section-eyebrow mb-3 justify-center"><Sparkles className="w-3.5 h-3.5" /> AI Discovery</div>
        <h1 className="display-2 mb-4">Describe what you need.<br /><span className="gradient-text">We'll match you to vetted vendors.</span></h1>
      </div>
      <form
        className="glass-card p-2 flex gap-2 max-w-2xl mx-auto mb-10"
        onSubmit={(e) => { e.preventDefault(); setParams({ q }); run(q); }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. 'A team that builds HIPAA-compliant LLM apps'"
          className="flex-1 bg-transparent outline-none px-3 py-3 text-sm"
        />
        <button className="btn-gradient text-sm" disabled={loading || !q.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Ask AI <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      {err && <div className="glass-card p-4 text-sm text-red-400 max-w-2xl mx-auto">{err}</div>}

      <div className="space-y-3 max-w-3xl mx-auto">
        {recs.map((r) => (
          <Link
            key={r.businessId}
            to={`/business/${r.business.slug}`}
            className="glass-card p-5 block hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-primary-light font-semibold">#{r.position} · score {r.score}/10</div>
                <h3 className="font-display font-semibold text-lg mt-1">{r.business.name}</h3>
                <div className="text-sm text-muted-foreground">{r.business.tagline}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground/85 border-l-2 border-primary/40 pl-3 mt-3">{r.reason}</p>
          </Link>
        ))}
        {!loading && !recs.length && initial && !err && (
          <div className="text-center text-muted-foreground">No matches yet — try a different intent.</div>
        )}
      </div>
    </section>
  );
}