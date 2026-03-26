import { projects } from "@/data/projects";

export async function downloadBrochurePDF() {
  // Dynamically import html2pdf
  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.createElement("div");
  element.style.fontFamily = "Arial, sans-serif";
  element.style.padding = "0";
  element.style.color = "#1e293b";
  element.style.background = "#fff";

  element.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Arial, sans-serif; }
      .page { padding: 48px; max-width: 794px; }
      .header { background: linear-gradient(135deg, #1e3a6e 0%, #2563eb 60%, #0ea5e9 100%); color: white; padding: 48px; border-radius: 0; }
      .header h1 { font-size: 32px; font-weight: 900; margin-bottom: 8px; }
      .header p { font-size: 14px; opacity: 0.85; margin-bottom: 6px; }
      .section { padding: 40px 48px; }
      .section-title { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
      .tag { font-size: 10px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
      .text { font-size: 13px; color: #475569; line-height: 1.7; }
      .vm-grid { display: flex; gap: 24px; margin-top: 16px; }
      .vm-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
      .vm-card h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
      .vm-card p { font-size: 12px; color: #64748b; line-height: 1.6; }
      .divider { height: 1px; background: #e2e8f0; margin: 0 48px; }
      .project-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
      .project-card h3 { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 4px; }
      .project-tagline { font-size: 12px; font-weight: 600; color: #2563eb; margin-bottom: 8px; }
      .project-desc { font-size: 12px; color: #64748b; line-height: 1.6; margin-bottom: 12px; }
      .features { list-style: none; }
      .features li { font-size: 11px; color: #475569; padding: 2px 0; padding-left: 16px; position: relative; }
      .features li::before { content: "✓"; position: absolute; left: 0; color: #2563eb; font-weight: 700; }
      .url-tag { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px; margin-top: 8px; }
      .services-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
      .service-chip { background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 600; padding: 6px 14px; border-radius: 100px; }
      .contact-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
      .contact-item { font-size: 12px; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; }
      .footer-bar { background: #1e293b; color: white; padding: 24px 48px; font-size: 11px; }
      .badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; font-size: 10px; font-weight: 600; padding: 4px 12px; border-radius: 100px; margin-bottom: 12px; }
    </style>

    <!-- COVER -->
    <div class="header">
      <div class="badge">AI-Driven Software Engineering · Since 2017</div>
      <h1>engineersTech</h1>
      <p style="font-size:18px;font-weight:700;margin-bottom:16px;">#drivenByEngineers</p>
      <p style="font-size:20px;font-weight:900;margin-bottom:12px;">WE BUILD SOFTWARE THAT DRIVES YOUR BUSINESS FORWARD</p>
      <p>Enterprise-grade software solutions from a lean team of skilled engineers.</p>
      <p>More value, affordable cost, powered by AI.</p>
      <p style="margin-top:16px;font-size:11px;opacity:0.7;">Reg. No: TRAD/DNCC/025495/2025</p>
    </div>

    <!-- ABOUT -->
    <div class="section">
      <div class="tag">What is engineersTech?</div>
      <h2 class="section-title">A Software Engineering Company Built by Engineers</h2>
      <p class="text" style="margin-top:12px;">
        engineersTech is a software engineering company built by engineers. Our team combines strong technical 
        expertise with practical problem-solving to design and build reliable, scalable digital products for modern businesses.
        <br/><br/>
        Since 2017, we've delivered enterprise-grade software for clients across multiple countries. By combining solid 
        engineering practices with AI-assisted workflows, we help businesses launch better products faster and more efficiently.
        We bring international expertise from 10+ countries while delivering solutions that truly work for Bangladeshi businesses.
      </p>
    </div>

    <div class="divider"></div>

    <!-- VISION & MISSION -->
    <div class="section">
      <div class="tag">Our Purpose</div>
      <h2 class="section-title">Vision &amp; Mission</h2>
      <div class="vm-grid">
        <div class="vm-card">
          <h3>🎯 Our Vision</h3>
          <p>To democratize enterprise-grade software by making it accessible and affordable for businesses of all sizes. 
          We combine skilled engineering with AI-driven workflows to deliver maximum value at minimal cost.</p>
        </div>
        <div class="vm-card">
          <h3>⭐ Our Mission</h3>
          <p>To become Bangladesh's most trusted software engineering company — known for technical excellence, innovation, 
          and building products that genuinely transform businesses.</p>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- PRODUCTS -->
    <div class="section">
      <div class="tag">Featured Products</div>
      <h2 class="section-title">Our Six Independent Platforms</h2>
      <div style="margin-top:20px;">
        ${projects.map(p => `
          <div class="project-card">
            <h3>${p.icon} ${p.name}</h3>
            <div class="project-tagline">${p.tagline}</div>
            <p class="project-desc">${p.description}</p>
            <ul class="features">
              ${p.features.slice(0, 4).map(f => `<li>${f}</li>`).join("")}
            </ul>
            <div class="url-tag">🌐 ${p.liveUrl}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="divider"></div>

    <!-- SERVICES -->
    <div class="section">
      <div class="tag">Our Services</div>
      <h2 class="section-title">What We Do</h2>
      <div class="services-grid">
        <div class="service-chip">Enterprise &amp; SaaS Solutions</div>
        <div class="service-chip">Web &amp; Mobile Applications</div>
        <div class="service-chip">UI/UX, Graphics &amp; Motion</div>
        <div class="service-chip">Consultation &amp; Strategy</div>
        <div class="service-chip">AI-Assisted Development</div>
        <div class="service-chip">CRM / HRM / ERP Systems</div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- CONTACT -->
    <div class="section">
      <div class="tag">Contact</div>
      <h2 class="section-title">Get In Touch</h2>
      <div class="contact-grid">
        <div class="contact-item">📍 Uttara, Dhaka-1230</div>
        <div class="contact-item">✉️ info@engineerstechbd.com</div>
        <div class="contact-item">🌐 engineerstechbd.com</div>
        <div class="contact-item">📞 +880 1873-722228</div>
        <div class="contact-item">📞 +880 1689-877007</div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer-bar">
      <strong>engineersTech</strong> · #drivenByEngineers · Reg. No: TRAD/DNCC/025495/2025 · © ${new Date().getFullYear()} All rights reserved.
    </div>
  `;

  const opt = {
    margin: 0,
    filename: "engineersTech_Brochure.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  await html2pdf().set(opt).from(element).save();
}
