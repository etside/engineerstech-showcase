import { useState } from "react";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { contactApi } from "@/lib/api";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  return (
    <section className="container-tight py-16">
      <div className="max-w-2xl mb-12">
        <div className="section-eyebrow mb-3"><MessageSquare className="w-3.5 h-3.5" /> Contact</div>
        <h1 className="display-1 mb-4">Let's <span className="gradient-text">talk.</span></h1>
        <p className="text-lg text-muted-foreground">Questions about listings, the LLM API, or partnerships — we reply within one business day.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const name = (formData.get("name") as string || "").trim();
                const email = (formData.get("email") as string || "").trim();
                const subject = (formData.get("subject") as string || "").trim();
                const message = (formData.get("message") as string || "").trim();

                await contactApi.submit({ name, email, subject, message });

                toast.success("Message sent — we'll get back to you within a business day.");
                form.reset();
              } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to send message. Please try again.";
                toast.error(msg);
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                <input required name="name" className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border focus:border-primary focus:outline-none text-sm" placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                <input required type="email" name="email" className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border focus:border-primary focus:outline-none text-sm" placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Subject</label>
              <input name="subject" className="w-full h-11 px-3 rounded-xl bg-muted/40 border border-border focus:border-primary focus:outline-none text-sm" placeholder="What's this about?" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
              <textarea required name="message" rows={5} className="w-full p-3 rounded-xl bg-muted/40 border border-border focus:border-primary focus:outline-none text-sm resize-none" placeholder="Tell us what you need…" />
            </div>
            <button disabled={loading} className="btn-gradient">
              {loading ? "Sending…" : <>Send message <Send className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="glass-card p-6">
            <Mail className="w-5 h-5 text-primary-light mb-3" />
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</div>
            <a href="mailto:hello@engineerstechbd.com" className="text-sm hover:text-primary-light">hello@engineerstechbd.com</a>
          </div>
          <div className="glass-card p-6">
            <MapPin className="w-5 h-5 text-primary-light mb-3" />
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">HQ</div>
            <div className="text-sm">Remote-first · San Francisco / London</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
