import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({ value, duration = 1800, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  // Parse numeric value, keep suffix/prefix from string if needed
  const raw = typeof value === "string" ? value : String(value);
  const numericMatch = raw.match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const autoSuffix = raw.replace(/[\d.]/g, "").trim();

  useEffect(() => {
    if (started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function animateCount() {
    const isDecimal = numericValue % 1 !== 0;
    const decimals = isDecimal ? 1 : 0;
    const start = 0;
    const end = numericValue;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(end.toFixed(decimals));
    }

    requestAnimationFrame(tick);
  }

  const finalSuffix = suffix || autoSuffix;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{finalSuffix}
    </span>
  );
}
