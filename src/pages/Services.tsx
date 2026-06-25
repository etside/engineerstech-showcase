import { Bot, Search, BarChart3, Globe2, MessageSquare, Sparkles, ShieldCheck, Languages } from "lucide-react";

const services = [
  { Icon: Bot, title: "AI Recommendation Chatbot", d: "Conversational discovery for buyers — describe a problem, get matched to the right vendors." },
  { Icon: Globe2, title: "LLM Data API (JSON-LD)", d: "Public, structured business data endpoint built for ChatGPT, Claude, DeepSeek & Qwen." },
  { Icon: Sparkles, title: "GEO Optimization", d: "We optimize every listing for citation in AI-generated answers — not just search rankings." },
  { Icon: MessageSquare, title: "Conversational Review Collection", d: "AI-guided chat interface that captures structured, useful reviews 3× faster than forms." },
  { Icon: BarChart3, title: "Vendor LLM Analytics", d: "Dashboard tracking how often LLMs mention your brand & how you rank in AI recommendations." },
  { Icon: Search, title: "Sentiment Summarization", d: "Auto-generated pros / cons / themes from hundreds of reviews — for humans and machines." },
  { Icon: ShieldCheck, title: "Trust & Moderation", d: "AI + human moderation pipeline keeps reviews verified and listings high-quality." },
  { Icon: Languages, title: "Multi-lingual AI Translation", d: "Reviews and listing content auto-translated across 30+ languages with context-aware AI." },
];

export default function Services() {
  return (
    <section className="container-tight py-16">
      <div className="max-w-2xl mb-12">
        <div className="section-eyebrow mb-3"><Sparkles className="w-3.5 h-3.5" /> Platform Services</div>
        <h1 className="display-1 mb-4">Every tool you need to be <span className="gradient-text">AI-discoverable.</span></h1>
        <p className="text-lg text-muted-foreground">From listing to citation — one platform, AI-native.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map(({ Icon, title, d }) => (
          <div key={title} className="glass-card p-6 group hover:border-primary/50 transition-all duration-500 ease-spring hover:-translate-y-1">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-5 h-5 text-primary-light" />
            </div>
            <div className="font-display font-semibold mb-2">{title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
