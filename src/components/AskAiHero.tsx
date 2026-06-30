import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  "HIPAA-ready SaaS team in Bangladesh",
  "Top Shopify Plus agencies for DTC brands",
  "AI consultants for regulated fintech",
  "Mobile app studios under $50/hr",
  "Cybersecurity firms with SOC 2 expertise",
  "Generative AI partners for retail",
];

export default function AskAiHero() {
  const [q, setQ] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (q) return;
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % SUGGESTIONS.length), 3200);
    return () => clearInterval(id);
  }, [q]);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) nav(`/ai-discover?q=${encodeURIComponent(q.trim())}`);
        }}
        className="glass-card p-2 flex items-center gap-2 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
      >
        <div className="pl-3 text-primary-light">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Ask AI: "${SUGGESTIONS[placeholderIdx]}"`}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-3 transition-all"
          aria-label="Ask AI for a recommendation"
        />
        <button className="btn-gradient shimmer-btn text-sm" type="submit">
          Discover <ArrowRight className="w-4 h-4" />
        </button>
      </form>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Try:</span>
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => nav(`/ai-discover?q=${encodeURIComponent(s)}`)}
            className="text-xs px-3 py-1.5 rounded-full bg-muted/30 hover:bg-primary/15 border border-border/60 hover:border-primary/40 text-foreground/80 hover:text-foreground transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}