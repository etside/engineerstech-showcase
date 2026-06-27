import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language?.startsWith("bn") ? "en" : "bn";
  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground"
      aria-label="Toggle language"
      title="Switch language"
    >
      <Languages className="w-3.5 h-3.5" />
      {next === "bn" ? "বাংলা" : "EN"}
    </button>
  );
}