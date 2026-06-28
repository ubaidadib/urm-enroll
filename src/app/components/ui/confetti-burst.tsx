import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

// Dependency-free, brand-gold confetti burst. Fire it by changing `trigger`
// (e.g. a counter or timestamp) on a success moment — lead submitted, quiz
// passed, eligibility confirmed. No-op under prefers-reduced-motion.

const COLORS = ["#f3d678", "#d4af37", "#b48b1f", "#ffffff", "#4F6B8A"];

type Piece = {
  id: string;
  dx: number;
  dy: number;
  rotate: number;
  color: string;
  scale: number;
  delay: number;
};

type ConfettiBurstProps = {
  /** Change this value to fire a burst. Falsy = nothing. */
  trigger: number | string | null | undefined;
  count?: number;
  /** Vertical origin as a fraction of viewport height (0–1). */
  originY?: number;
};

export function ConfettiBurst({ trigger, count = 32, originY = 0.42 }: ConfettiBurstProps) {
  const reduceMotion = useReducedMotion();
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger || reduceMotion) return;

    // Deterministic spread (no Math.random) so bursts are consistent.
    const next: Piece[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count;
      const spread = 140 + ((i * 53) % 120);
      return {
        id: `${trigger}-${i}`,
        dx: Math.cos(angle) * spread,
        dy: Math.sin(angle) * spread * 0.6 + 120 + ((i * 31) % 160), // bias downward (gravity)
        rotate: (i * 73) % 360,
        color: COLORS[i % COLORS.length] ?? "#d4af37",
        scale: 0.6 + ((i % 4) * 0.25),
        delay: (i % 6) * 0.025,
      };
    });

    setPieces(next);
    const timeout = window.setTimeout(() => setPieces([]), 1500);
    return () => window.clearTimeout(timeout);
  }, [trigger, count, reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {pieces.map((p) => (
          <m.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: p.scale }}
            animate={{ opacity: 0, x: p.dx, y: p.dy, rotate: p.rotate }}
            transition={{ duration: 1.2, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ left: "50%", top: `${originY * 100}%`, backgroundColor: p.color }}
            className="absolute h-3 w-1.5 rounded-[2px]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
