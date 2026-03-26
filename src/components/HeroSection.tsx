import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection({ onDownloadPDF }: { onDownloadPDF: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1200} height={600} />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      {/* Animated decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "hsl(200 100% 70%)" }} />
      <div className="absolute bottom-32 left-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "hsl(217 91% 70%)" }} />

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Driven Software Engineering · Since 2017
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
            WE BUILD SOFTWARE THAT{" "}
            <span className="text-sky-300">DRIVES YOUR BUSINESS</span>{" "}
            FORWARD
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
            Enterprise-grade software solutions from a lean team of skilled engineers.
            More value, affordable cost, powered by AI.{" "}
            <span className="text-sky-300 font-semibold">#drivenByEngineers</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a href="#products" className="btn-white text-base py-3.5 px-8">
              Explore Our Products
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <button onClick={onDownloadPDF} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border-2 border-white/60 text-white hover:bg-white/10 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Brochure
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "7+", label: "Years Experience" },
              { value: "10+", label: "Countries Served" },
              { value: "100+", label: "Projects Delivered" },
              { value: "50+", label: "Happy Clients" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
}
