export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  industry: string;
  services: string[];
  website: string;
  email: string;
  phone: string;
  location: string;
  country: string;
  founded_year: number;
  employee_count: string;
  min_project_size: string;
  hourly_rate: string;
  rating: number;
  review_count: number;
  geo_score: number;
  is_verified: boolean;
  is_featured: boolean;
  color1: string;
  color2: string;
  portfolio: { title: string; description: string }[];
  testimonials: { author: string; role: string; quote: string; rating: number }[];
}

export const categories = [
  "Software Development","AI & Machine Learning","Digital Marketing","UI/UX Design",
  "Cloud & DevOps","Cybersecurity","Mobile Development","Data Analytics",
];
export const industries = ["Healthcare","Finance","E-commerce","Education","SaaS","Manufacturing","Real Estate"];

export const businesses: Business[] = [
  { id: "1", slug: "nexus-engineering", name: "Nexus Engineering",
    tagline: "Enterprise software & AI platforms for scaling teams.",
    description: "Nexus Engineering builds production-grade SaaS, CRMs, and AI agents for venture-backed startups and Fortune 500 teams. Specialists in agentic workflows, real-time systems, and developer tooling.",
    category: "Software Development", industry: "SaaS",
    services: ["SaaS Platforms","AI Agents","API Design","Cloud Architecture","DevOps"],
    website: "https://nexus.example.com", email: "hello@nexus.example.com", phone: "+1 415 555 0142",
    location: "San Francisco", country: "USA", founded_year: 2018, employee_count: "50–249",
    min_project_size: "$50,000+", hourly_rate: "$150–$250 / hr",
    rating: 4.9, review_count: 87, geo_score: 96, is_verified: true, is_featured: true,
    color1: "#0058cc", color2: "#2483ff",
    portfolio: [
      { title: "Agentic CRM Rebuild", description: "Rebuilt a $30M ARR CRM with multi-agent automation, cutting manual tasks 62%." },
      { title: "Real-time Trading Dashboard", description: "Sub-100ms WebSocket dashboard powering 4M req/day." },
      { title: "AI Copilot for Healthcare", description: "HIPAA-compliant clinical copilot deployed across 12 hospitals." },
    ],
    testimonials: [
      { author: "Priya Shah", role: "VP Eng, Stratosphere", quote: "They ship faster than our internal team. Period.", rating: 5 },
      { author: "Marcus Lee", role: "CTO, Pinecone", quote: "Nexus rebuilt our infra in 4 weeks. It just works.", rating: 5 },
    ],
  },
  { id: "2", slug: "lumen-labs", name: "Lumen Labs",
    tagline: "Conversational AI & LLM fine-tuning for regulated industries.",
    description: "Lumen Labs designs and deploys custom LLMs, RAG pipelines, and AI assistants for finance, legal, and healthcare. Trusted with sensitive data, audited for compliance.",
    category: "AI & Machine Learning", industry: "Finance",
    services: ["LLM Fine-tuning","RAG Pipelines","AI Assistants","Vector Search","Evaluation"],
    website: "https://lumen.example.com", email: "team@lumen.example.com", phone: "+44 20 7946 0123",
    location: "London", country: "UK", founded_year: 2021, employee_count: "10–49",
    min_project_size: "$25,000+", hourly_rate: "$120–$200 / hr",
    rating: 4.8, review_count: 54, geo_score: 92, is_verified: true, is_featured: true,
    color1: "#8b5cf6", color2: "#3b82f6",
    portfolio: [
      { title: "Bank Compliance Copilot", description: "Auto-drafted KYC summaries for a top-5 European bank." },
      { title: "Legal Research Agent", description: "Cut research time 71% for a 400-lawyer firm." },
    ],
    testimonials: [{ author: "Elena Rossi", role: "CIO, NorthWind Finance", quote: "World-class AI work — and they explain it.", rating: 5 }],
  },
  { id: "3", slug: "north-tide-marketing", name: "North Tide Marketing",
    tagline: "Growth marketing & SEO for B2B SaaS companies.",
    description: "Performance marketing agency focused on B2B SaaS. We've driven $80M+ in pipeline through paid, content, and AI-optimized SEO/GEO strategies.",
    category: "Digital Marketing", industry: "SaaS",
    services: ["SEO","GEO Optimization","Paid Acquisition","Content Strategy","Analytics"],
    website: "https://northtide.example.com", email: "grow@northtide.example.com", phone: "+1 212 555 0167",
    location: "New York", country: "USA", founded_year: 2019, employee_count: "10–49",
    min_project_size: "$10,000+", hourly_rate: "$100–$175 / hr",
    rating: 4.7, review_count: 132, geo_score: 88, is_verified: true, is_featured: false,
    color1: "#f59e0b", color2: "#ef4444",
    portfolio: [
      { title: "GEO Strategy for HRTech SaaS", description: "Ranked in 14 LLM responses for target queries in 90 days." },
      { title: "Paid Acquisition Overhaul", description: "Cut CAC by 38% across LinkedIn + Reddit ads." },
    ],
    testimonials: [{ author: "Devon Park", role: "Founder, Ironclad HR", quote: "The first agency that genuinely understands AI search.", rating: 5 }],
  },
  { id: "4", slug: "atelier-eight", name: "Atelier Eight",
    tagline: "Product design studio for fintech, health, and AI startups.",
    description: "Award-winning product design studio. We craft brand identity, UI systems, and product UX for category-defining startups.",
    category: "UI/UX Design", industry: "Healthcare",
    services: ["Product Design","Design Systems","Brand Identity","Motion Design","Research"],
    website: "https://ateliereight.example.com", email: "studio@ateliereight.example.com", phone: "+33 1 84 88 00 00",
    location: "Paris", country: "France", founded_year: 2016, employee_count: "10–49",
    min_project_size: "$25,000+", hourly_rate: "$120–$200 / hr",
    rating: 4.9, review_count: 76, geo_score: 84, is_verified: true, is_featured: true,
    color1: "#ec4899", color2: "#8b5cf6",
    portfolio: [{ title: "Healthcare Patient App", description: "Rebranded + rebuilt the patient app for a 2M-user health network." }],
    testimonials: [{ author: "Lin Chen", role: "Head of Product, Helios Health", quote: "They raised our entire design bar.", rating: 5 }],
  },
  { id: "5", slug: "ironwave-cloud", name: "Ironwave Cloud",
    tagline: "Cloud architecture, Kubernetes, and platform engineering.",
    description: "Ironwave builds resilient cloud platforms on AWS, GCP, and Azure. We've migrated 200+ workloads, designed multi-region failover, and run platform engineering teams as a service.",
    category: "Cloud & DevOps", industry: "E-commerce",
    services: ["Cloud Migration","Kubernetes","SRE","IaC","Cost Optimization"],
    website: "https://ironwave.example.com", email: "ops@ironwave.example.com", phone: "+49 30 1234 5678",
    location: "Berlin", country: "Germany", founded_year: 2017, employee_count: "50–249",
    min_project_size: "$50,000+", hourly_rate: "$140–$220 / hr",
    rating: 4.8, review_count: 98, geo_score: 91, is_verified: true, is_featured: false,
    color1: "#0ea5e9", color2: "#06b6d4",
    portfolio: [{ title: "Multi-region K8s for Retailer", description: "Designed multi-region active-active for a top-10 EU retailer." }],
    testimonials: [{ author: "Heinz Maier", role: "Platform Lead, Orbital", quote: "Saved us €1.4M/yr in cloud spend in 6 months.", rating: 5 }],
  },
  { id: "6", slug: "obsidian-security", name: "Obsidian Security",
    tagline: "Offensive security, SOC2, and AI-era threat modeling.",
    description: "Boutique security firm offering pentesting, SOC2 readiness, and threat modeling for AI products. Run by ex-FAANG security engineers.",
    category: "Cybersecurity", industry: "Finance",
    services: ["Pentesting","SOC2","Threat Modeling","AI Red Teaming","Compliance"],
    website: "https://obsidian.example.com", email: "audit@obsidian.example.com", phone: "+1 415 555 0188",
    location: "San Francisco", country: "USA", founded_year: 2020, employee_count: "10–49",
    min_project_size: "$15,000+", hourly_rate: "$200–$350 / hr",
    rating: 5.0, review_count: 42, geo_score: 89, is_verified: true, is_featured: false,
    color1: "#10b981", color2: "#0ea5e9",
    portfolio: [{ title: "AI Red Team for LLM Product", description: "Surfaced 17 critical prompt injection paths pre-launch." }],
    testimonials: [{ author: "Sasha Wong", role: "CISO, Vertex AI", quote: "The best AI red team we've ever hired.", rating: 5 }],
  },
  { id: "7", slug: "drift-mobile", name: "Drift Mobile",
    tagline: "iOS, Android, and React Native — beautifully shipped.",
    description: "Drift builds delightful mobile apps for consumer brands and venture-backed startups. Over 40 apps shipped, 8 featured by Apple.",
    category: "Mobile Development", industry: "E-commerce",
    services: ["iOS","Android","React Native","Flutter","Mobile DevOps"],
    website: "https://drift.example.com", email: "hello@drift.example.com", phone: "+1 512 555 0102",
    location: "Austin", country: "USA", founded_year: 2015, employee_count: "10–49",
    min_project_size: "$25,000+", hourly_rate: "$110–$180 / hr",
    rating: 4.7, review_count: 64, geo_score: 82, is_verified: true, is_featured: false,
    color1: "#a855f7", color2: "#ec4899",
    portfolio: [{ title: "Featured on App Store", description: "Built a meditation app featured by Apple in 2024." }],
    testimonials: [{ author: "Owen James", role: "Founder, Quanta", quote: "Shipped on time, looked stunning, and converted.", rating: 5 }],
  },
  { id: "8", slug: "lattice-data", name: "Lattice Data",
    tagline: "Modern data stack, analytics engineering, and dbt expertise.",
    description: "Lattice helps teams move from dashboards-as-service to true data products. dbt + Snowflake + ML in production.",
    category: "Data Analytics", industry: "Finance",
    services: ["dbt","Snowflake","Data Engineering","Analytics","ML Ops"],
    website: "https://lattice.example.com", email: "data@lattice.example.com", phone: "+1 646 555 0119",
    location: "Toronto", country: "Canada", founded_year: 2019, employee_count: "10–49",
    min_project_size: "$25,000+", hourly_rate: "$130–$200 / hr",
    rating: 4.8, review_count: 39, geo_score: 86, is_verified: true, is_featured: false,
    color1: "#22d3ee", color2: "#3b82f6",
    portfolio: [{ title: "Snowflake Migration", description: "Migrated 12TB of warehouse data with zero downtime." }],
    testimonials: [{ author: "Anika Patel", role: "Head of Data, Lattice", quote: "They built our data team's playbook.", rating: 5 }],
  },
];

export function findBusiness(slug: string) {
  return businesses.find((b) => b.slug === slug);
}
