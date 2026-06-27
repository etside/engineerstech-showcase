import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

export default function NewsletterSignup() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, language: i18n.language?.slice(0, 2) || "en" });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      return toast.error(t("newsletter.error"));
    }
    setEmail("");
    toast.success(t("newsletter.success"));
  }

  return (
    <div className="glass-card p-6">
      <h3 className="font-display font-semibold text-lg mb-1">{t("newsletter.title")}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t("newsletter.subtitle")}</p>
      <form onSubmit={submit} className="flex gap-2 flex-wrap">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletter.placeholder")}
          className="flex-1 min-w-[200px] h-11 px-3 rounded-xl bg-muted/40 border border-border text-sm focus:border-primary focus:outline-none"
        />
        <button disabled={loading} className="btn-gradient text-sm">
          {loading ? "…" : t("newsletter.subscribe")}
        </button>
      </form>
    </div>
  );
}