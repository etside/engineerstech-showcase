export default function VisionMissionSection() {
  return (
    <section id="vision-mission" className="py-20 md:py-28 section-alt">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <div className="tag-label mb-3">Our Purpose</div>
          <h2 className="section-title">Vision &amp; Mission</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Vision */}
          <div className="card-base p-8 group relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ background: "hsl(217 91% 55%)" }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "hsl(217 91% 96%)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="4"/>
                <line x1="21.17" y1="8" x2="11.99" y2="8"/>
                <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
                <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
              </svg>
            </div>
            <div className="tag-label mb-3">Our Vision</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Democratize Enterprise Software</h3>
            <p className="text-muted-foreground leading-relaxed">
              To democratize enterprise-grade software by making it accessible and affordable for businesses
              of all sizes. We combine skilled engineering with AI-driven workflows to deliver maximum value
              at minimal cost.
            </p>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {["Accessible", "Affordable", "AI-Driven", "Maximum Value"].map((tag) => (
                  <span key={tag} className="badge-blue text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="card-base p-8 group relative overflow-hidden border-primary/20" style={{ borderColor: "hsl(217 91% 55% / 0.2)" }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ background: "hsl(217 91% 55%)" }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "hsl(217 91% 96%)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="tag-label mb-3">Our Mission</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Bangladesh's Most Trusted Engineering Co.</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become Bangladesh's most trusted software engineering company — known for technical excellence,
              innovation, and building products that genuinely transform businesses.
            </p>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {["Technical Excellence", "Innovation", "Trust", "Transformation"].map((tag) => (
                  <span key={tag} className="badge-blue text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
