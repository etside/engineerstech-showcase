import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  { q: "What is Generative Engine Optimization (GEO)?", a: "GEO is the practice of optimizing your content and data so LLMs (ChatGPT, Claude, DeepSeek, Qwen) cite you in their answers. It's the AI-era successor to SEO." },
  { q: "How do you get my business in front of LLMs?", a: "We emit structured JSON-LD on every listing, expose a public API LLMs can ingest, and submit our directory to AI training partners." },
  { q: "Is there a free tier?", a: "Yes — the Starter plan is free forever and includes a verified profile, up to 10 reviews, and standard JSON-LD output." },
  { q: "How are reviews verified?", a: "Every review is moderated by a hybrid AI + human pipeline that checks for authenticity, sentiment manipulation, and policy compliance." },
  { q: "Can I track LLM mentions?", a: "On the Growth and Enterprise plans, your dashboard shows how often each major LLM surfaces your business in benchmark queries." },
  { q: "Do you support multi-location businesses?", a: "Yes. Enterprise customers get multi-listing management, custom schema, and dedicated API quotas." },
];

export default function FAQ() {
  return (
    <section className="container-tight py-16">
      <div className="max-w-2xl mb-12">
        <div className="section-eyebrow mb-3"><HelpCircle className="w-3.5 h-3.5" /> Frequently asked</div>
        <h1 className="display-1 mb-4">Questions, <span className="gradient-text">answered.</span></h1>
      </div>
      <div className="max-w-3xl glass-card p-2 md:p-4">
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`} className="border-border/40">
              <AccordionTrigger className="text-left font-display font-medium hover:no-underline px-4">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground px-4 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
