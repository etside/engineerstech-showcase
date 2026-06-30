const BRANDS = [
  { name: "BJIT Group", tag: "Software" },
  { name: "Brain Station 23", tag: "Enterprise" },
  { name: "TigerIT Bangladesh", tag: "IT Services" },
  { name: "Cefalo Bangladesh", tag: "Development" },
  { name: "SJ Innovation", tag: "Agency" },
  { name: "Enosis Solutions", tag: "Consulting" },
  { name: "Kaz Software", tag: "Software" },
  { name: "Therap Services", tag: "Healthcare IT" },
  { name: "Dynamic Solution", tag: "Solutions" },
  { name: "Leads Corporation", tag: "Technology" },
  { name: "Creative IT", tag: "Training" },
  { name: "Augmedix BD", tag: "AI/ML" },
];

export default function TrustMarquee() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="overflow-hidden py-2">
      <div className="flex gap-4 marquee-track w-max">
        {items.map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default shrink-0 group"
          >
            <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-primary/30">
              {b.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {b.name}
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary-light border border-primary/20">
              {b.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
