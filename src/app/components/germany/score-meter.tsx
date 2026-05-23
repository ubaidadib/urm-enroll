import { useEffect, useMemo, useState } from "react";
import { animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useLanguage } from "@/i18n/language-context";

type Props = {
  scorePercent: number;
  totalPoints: number;
  maxPoints: number;
  variant?: "A" | "B";
};

/** Animated radial score meter. Uses Chancenkarte gold accent. */
export function ScoreMeter({ scorePercent, totalPoints, maxPoints, variant = "A" }: Props) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const stroke = 8;
  const r = 78;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(scorePercent, 100) / 100) * c;
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (latest) => Math.round(latest));
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const gradientId = useMemo(
    () => `urm-chancenkarte-gradient-${variant}-${Math.round(scorePercent)}`,
    [scorePercent, variant],
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      progress.set(scorePercent);
      setAnimatedPercent(scorePercent);
      return;
    }
    const controls = animate(progress, scorePercent, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setAnimatedPercent(Math.round(latest));
      },
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setAnimatedPercent(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [progress, rounded, scorePercent, shouldReduceMotion]);

  return (
    <div className="relative w-56 h-56 mx-auto" aria-label="score">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d678" />
            <stop offset="100%" stopColor="#b48b1f" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(11,21,48,0.08)" strokeWidth={stroke} />
        <m.circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] uppercase tracking-[0.22em] text-text-muted">
          {t<string>("eligibilityQuiz.result.score")}
        </span>
        <span className="text-4xl font-extrabold text-text-primary mt-1">{animatedPercent}%</span>
        <span className="text-xs text-text-secondary mt-1">
          {totalPoints} {t<string>("eligibilityQuiz.result.outOf")} {maxPoints} {t<string>("eligibilityQuiz.result.pointsLabel")}
        </span>
      </div>
    </div>
  );
}
