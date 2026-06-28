import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  /** Target number to count to. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to render (default 0). */
  decimals?: number;
  /** Thousands separators (default true). */
  separator?: boolean;
  /** Animation duration in ms (default 1400). */
  duration?: number;
  className?: string;
};

/**
 * Reusable animated counter. Counts from 0 to `value` with an ease-out curve the
 * first time it scrolls into view. Respects prefers-reduced-motion (renders the
 * final value immediately) and is safe in prerender (settles to the real value).
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = true,
  duration = 1400,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduceMotion]);

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: separator,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
