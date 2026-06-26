import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Sparkles, Star } from "lucide-react";
import { businesses as mock } from "@/data/mockBusinesses";

export default function Leaderboards() {
  const [tab, setTab] = useState<"geo" | "rated" | "reviewed">("geo");
  const [list, setList] = useState(mock);
  useEffect(() => {
    const arr = [...mock].sort((a, b) =>
      tab === "rated" ? b.rating - a.rating
      : tab === "reviewed" ? b.review_count - a.review_count
      : b.geo_score - a.geo_score
    );
    setList(arr);
  }, [tab]);

  return (
    <section className="container-tight py-16 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-amber-400" />
        <div>
          <h1 className="display-2">Leaderboards</h1>
          <p className="text-muted-foreground">The top vendors right now, by signal.</p>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[{ k: "geo", l: "GEO score", i: Sparkles }, { k: "rated", l: "Highest rated", i: Star }, { k: "reviewed", l: "Most reviewed", i: Trophy }].map(({ k, l, i: Icon }) => (
          <button key={k} onClick={() => setTab(k as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition ${tab === k ? "bg-primary/15 text-primary-light border-primary/40" : "border-border text-muted-foreground hover:text-foreground"}`}>
            <Icon className="w-3.5 h-3.5" /> {l}
          </button>
        ))}
      </div>
      <ol className="space-y-2">
        {list.slice(0, 25).map((b, i) => (
          <li key={b.slug} className="glass-card p-4 flex items-center gap-4">
            <div className="w-8 text-center font-display font-bold gradient-text">{i + 1}</div>
            <Link to={`/business/${b.slug}`} className="flex-1 font-semibold hover:text-primary-light">{b.name}</Link>
            <div className="text-xs text-muted-foreground hidden sm:block">{b.category}</div>
            <div className="text-sm font-mono w-20 text-right">
              {tab === "rated" ? `★ ${b.rating.toFixed(1)}` : tab === "reviewed" ? `${b.review_count} rev` : `GEO ${b.geo_score}`}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
