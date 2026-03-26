import etLogo from "@/assets/et-logo-white.png";

export default function FooterSection({ onDownloadPDF }: { onDownloadPDF: () => void }) {
  return (
    <footer id="contact" className="bg-secondary text-secondary-foreground">
      {/* CTA Band */}
      <div className="bg-primary py-14">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Let's discuss your project and see how our team of engineers can bring your vision to life — affordably and efficiently.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://engineerstechbd.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-white text-base py-3.5 px-8"
            >
              Get in Touch
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="https://wa.me/8801873722228"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border-2 border-white/60 text-white hover:bg-white/10 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black" style={{ background: "hsl(217 91% 55%)" }}>
                  eT
                </div>
                <div>
                  <div className="font-black text-xl text-secondary-foreground">
                    engineers<span style={{ color: "hsl(217 91% 55%)" }}>Tech</span>
                  </div>
                  <div className="text-xs text-secondary-foreground/60">#drivenByEngineers</div>
                </div>
              </div>
              <p className="text-secondary-foreground/70 text-sm leading-relaxed max-w-xs mb-4">
                A software engineering company built by engineers. Delivering enterprise-grade solutions since 2017.
              </p>
              <div className="text-xs text-secondary-foreground/50 mb-6">
                Reg. No: <span className="font-semibold text-secondary-foreground/70">TRAD/DNCC/025495/2025</span>
              </div>
              <button onClick={onDownloadPDF} className="btn-primary text-sm py-2.5 px-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Brochure
              </button>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-bold text-secondary-foreground mb-4 text-sm uppercase tracking-widest">Products</h4>
              <ul className="space-y-2.5">
                {[
                  { name: "GlowUp", url: "https://glowupbd.com" },
                  { name: "Fund", url: "https://fund.engineerstechbd.com" },
                  { name: "DCard", url: "https://dcard.engineerstechbd.com" },
                  { name: "Coursellm", url: "https://coursellm.engineerstechbd.com" },
                  { name: "Inventory & POS", url: "https://demo.engineerstechbd.com/dashboard" },
                  { name: "Accounts", url: "https://accounts.engineerstechbd.com" },
                ].map((p) => (
                  <li key={p.name}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                    >
                      {p.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-secondary-foreground mb-4 text-sm uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3">
                {[
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    ),
                    text: "Uttara, Dhaka-1230",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    ),
                    text: "info@engineerstechbd.com",
                    href: "mailto:info@engineerstechbd.com",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    ),
                    text: "engineerstechbd.com",
                    href: "https://engineerstechbd.com",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    ),
                    text: "+880 1873-722228",
                    href: "tel:+8801873722228",
                  },
                  {
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    ),
                    text: "+880 1689-877007",
                    href: "tel:+8801689877007",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 flex-shrink-0">{item.icon}</span>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-sm text-secondary-foreground/70">{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/50">
              © {new Date().getFullYear()} engineersTech. All rights reserved. #drivenByEngineers
            </p>
            <div className="flex items-center gap-4">
              <a href="https://engineerstechbd.com" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">
                Website
              </a>
              <a href="mailto:info@engineerstechbd.com" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">
                Email Us
              </a>
              <a href="https://wa.me/8801873722228" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
