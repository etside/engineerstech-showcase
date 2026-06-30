import { useEffect, useRef, useState } from "react";

type Props = { value: string; durationMs?: number };

/**
 * Animates the numeric portion of a value string ("12k+", "94%", "32M", "180k").
 * Preserves any prefix/suffix characters around the digits.
 */
export default function AnimatedCounter({ value, durationMs = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (!Number.isFinite(target)) {
      setDisplay(value);
      return;
    }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let rafId = 0;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = target * eased;
        const formatted = target >= 100 ? Math.round(cur).toString() : cur.toFixed(target % 1 === 0 ? 0 : 1);
        setDisplay(`${prefix}${formatted}${suffix}`);
        if (p < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && start()),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [value, durationMs]);

  return <span ref={ref}>{display}</span>;
}