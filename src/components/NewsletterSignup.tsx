import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { newsletterApi } from "@/lib/api";

export default function NewsletterSignup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      setEmail("");
      toast.success(t("newsletter.success"));
    } catch (err) {
      const msg = (err as Error).message || "";
      if (!msg.includes("duplicate")) {
        toast.error(t("newsletter.error"));
      }
    }
    setLoading(false);
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