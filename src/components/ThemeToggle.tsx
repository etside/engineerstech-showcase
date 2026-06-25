import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-300 ease-spring"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4 text-primary-light" /> : <Moon className="w-4 h-4 text-primary" />}
    </button>
  );
}
