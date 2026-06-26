import { Link } from "react-router-dom";
import { BookOpen, FileText, Sparkles, Code } from "lucide-react";

const items = [
  { i: BookOpen, t: "Buyer's guide to AI-discovery directories", d: "How GEO is changing B2B buying.", to: "/how-it-works" },
  { i: Sparkles, t: "What is GEO (Generative Engine Optimization)?", d: "A primer for vendors and marketers.", to: "/how-it-works" },
  { i: FileText, t: "Vendor handbook", d: "Best practices to score 90+ on GEO.", to: "/for-vendors" },
  { i: Code, t: "Developer docs — MCP & JSON-LD feed", d: "Wire any LLM into our directory.", to: "/api-docs" },
];

export default function Resources() {
  return (
    <section className="container-tight py-16 space-y-6">
      <div>
        <h1 className="display-1">Resources</h1>
        <p className="text-muted-foreground text-lg mt-3">Guides, playbooks, and APIs for buyers, vendors, and builders.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(({ i: Icon, t, d, to }) => (
          <Link key={t} to={to} className="glass-card p-6 hover:border-primary/40 transition-colors block">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-white" /></div>
            <div className="font-display font-semibold text-lg">{t}</div>
            <p className="text-sm text-muted-foreground mt-2">{d}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
