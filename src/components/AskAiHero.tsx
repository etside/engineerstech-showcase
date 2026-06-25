import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AskAiHero() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) nav(`/ai-discover?q=${encodeURIComponent(q.trim())}`);
      }}
      className="glass-card p-2 flex items-center gap-2 max-w-xl mx-auto"
    >
      <div className="pl-3 text-primary-light"><Sparkles className="w-4 h-4" /></div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ask AI: 'a Bangladesh team for HIPAA-ready SaaS…'"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-3"
      />
      <button className="btn-gradient text-sm" type="submit">
        Discover <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}