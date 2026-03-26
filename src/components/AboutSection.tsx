const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Belgium",
  "Australia", "Japan", "China", "UAE", "Singapore", "Malaysia",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="tag-label mb-4">What is engineersTech?</div>
            <h2 className="section-title mb-6">
              A Software Engineering Company{" "}
              <span className="gradient-text">Built by Engineers</span>
            </h2>
            <p className="section-subtitle mb-6 leading-relaxed">
              engineersTech is a software engineering company built by engineers. Our team
              combines strong technical expertise with practical problem-solving to design
              and build reliable, scalable digital products for modern businesses.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Since 2017, we've delivered enterprise-grade software for clients across
              multiple countries. By combining solid engineering practices with
              AI-assisted workflows, we help businesses launch better products faster
              and more efficiently.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["AI-Assisted Workflows", "Enterprise Grade", "Scalable Architecture", "Clean Code"].map((tag) => (
                <span key={tag} className="badge-blue">{tag}</span>
              ))}
            </div>
            <a
              href="https://engineerstechbd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Visit Our Website
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          {/* Right: Global Presence Card */}
          <div className="relative">
            <div className="card-base p-8">
              <div className="tag-label mb-4">Global Projects, Local Impact</div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                With experience across 10+ countries, our team brings international expertise
                to every project while delivering solutions that truly work for Bangladeshi businesses.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {COUNTRIES.map((country) => (
                  <div key={country} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{country}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Registration Number:{" "}
                  <span className="font-semibold text-foreground">TRAD/DNCC/025495/2025</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg text-center">
              <div className="text-2xl font-black">7+</div>
              <div className="text-xs font-medium opacity-90">Years</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
