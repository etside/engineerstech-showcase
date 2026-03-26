import { clients } from "@/data/projects";

export default function ClientsSection() {
  const allClients = [...clients.local, ...clients.international, ...clients.local, ...clients.international];

  return (
    <section id="clients" className="py-20 md:py-28 section-alt overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <div className="tag-label mb-3">Our Major Clients</div>
          <h2 className="section-title mb-4">Partners In Success</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Trusted by businesses across Bangladesh and around the world.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden mb-12">
          <div className="flex gap-6 marquee-track" style={{ width: "max-content" }}>
            {allClients.map((client, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center bg-white rounded-2xl border border-border px-6 py-4 h-16 min-w-[160px] shadow-sm"
              >
                <span className="text-sm font-semibold text-foreground text-center">{client}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🇧🇩</span>
              <h3 className="text-lg font-bold text-foreground">Local Clients</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {clients.local.map((client) => (
                <div key={client} className="bg-white rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground text-center shadow-sm">
                  {client}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌍</span>
              <h3 className="text-lg font-bold text-foreground">International Clients</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {clients.international.map((client) => (
                <div key={client} className="bg-white rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground text-center shadow-sm">
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              quote: "engineersTech did an amazing job with this design. I really like how they interpreted our brand. I hope to work with them again soon!",
              name: "Jeremy Nathan",
              role: "CEO, Industracom, USA",
            },
            {
              quote: "Excellent eye for design and attention to detail. They turned a quick project around within hours — impressive work!",
              name: "Freda Lin",
              role: "Marketing Specialist, Ample, Canada",
            },
            {
              quote: "Extremely passionate, talented, and achievers. Very good engineers and deliver projects on time. An absolute privilege to work with them.",
              name: "Mynul Hasan",
              role: "Senior Auditor, Intertek Bangladesh",
            },
          ].map((t, i) => (
            <div key={i} className="card-base p-6">
              <div className="text-primary text-3xl mb-4">"</div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm bg-primary">
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
