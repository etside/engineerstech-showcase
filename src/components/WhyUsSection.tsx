const reasons = [
  {
    icon: "🏗️",
    title: "Scalable Code, Clean Architecture",
    description: "We write code that grows with you. No shortcuts, no tech debt — just clean, maintainable systems built to last.",
  },
  {
    icon: "🤖",
    title: "AI-Assisted Workflows",
    description: "Our AI-integrated development process means faster delivery, better quality, and more value per dollar.",
  },
  {
    icon: "🚀",
    title: "We Treat Every Project Like Our Own",
    description: "Your success drives us. We're invested in outcomes, not just deliverables — we celebrate your wins.",
  },
  {
    icon: "💬",
    title: "Clear Communication, No Surprises",
    description: "Transparent timelines, regular updates, and honest conversations. You're always in the loop.",
  },
  {
    icon: "🌍",
    title: "Global Experience, Local Expertise",
    description: "10+ countries of experience brought to your doorstep. International standards, Bangladeshi prices.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery, Enterprise Quality",
    description: "Lean team, efficient process. We move fast without breaking things — backed by solid engineering practices.",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: "hsl(217 91% 55%)" }} />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="tag-label mb-4">Why engineersTech?</div>
            <h2 className="section-title mb-6">
              Engineering Excellence You Can{" "}
              <span className="gradient-text">Count On</span>
            </h2>
            <p className="section-subtitle mb-8 leading-relaxed">
              We're not just a dev shop. We're engineers who care deeply about the products
              we build and the businesses we help grow.
            </p>
            <a
              href="https://engineerstechbd.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
            >
              Start a Project
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <div key={i} className="card-base p-5 group hover:border-primary/30 transition-all">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {reason.icon}
                </div>
                <h4 className="font-bold text-foreground text-sm mb-2 leading-tight">{reason.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
