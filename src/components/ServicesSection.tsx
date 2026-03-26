const services = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "Enterprise & SaaS Solutions",
    description: "CRM, HRM, ERP and large-scale customized software built for your business operations. We architect systems that scale with your growth.",
    tags: ["CRM", "HRM", "ERP", "SaaS", "Custom Software"],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: "Web & Mobile Applications",
    description: "Cross-platform Android & iOS apps alongside responsive web apps that perform flawlessly on any device and under any load.",
    tags: ["React", "React Native", "iOS", "Android", "PWA"],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    title: "UI/UX, Graphics & Motion",
    description: "Pixel-perfect interfaces, brand identity design, and engaging motion graphics that captivate users and strengthen your brand.",
    tags: ["UI/UX", "Brand Identity", "Motion Design", "Prototyping"],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Consultation & Strategy",
    description: "Technical consulting, product roadmapping, and strategic planning to accelerate your digital transformation with confidence.",
    tags: ["Product Strategy", "Tech Consulting", "Roadmapping", "Architecture Review"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 section-alt">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <div className="tag-label mb-3">Our Services</div>
          <h2 className="section-title mb-4">What We Do</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            End-to-end engineering solutions that transform ideas into scalable products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="card-base p-8 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-primary transition-all duration-300 group-hover:scale-110" style={{ background: "hsl(217 91% 96%)" }}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="badge-blue">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
