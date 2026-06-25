const CLIENTS = ["Acme Corp","Lumen Labs","ByteForge","NorthWind","Vertex AI","Helios","Stratosphere","Lattice","Quanta","Orbital","Pinecone","Ironclad"];

export default function TrustMarquee() {
  const logos = [...CLIENTS, ...CLIENTS];
  return (
    <div className="relative overflow-hidden py-8 border-y border-border/40">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex items-center gap-12 marquee-track" style={{ width: "max-content" }}>
        {logos.map((c, i) => (
          <div key={`${c}-${i}`} className="font-display text-xl font-semibold text-muted-foreground/60 hover:text-foreground transition-colors whitespace-nowrap">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
