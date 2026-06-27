import { m } from "motion/react";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { QUIZ_STEPS } from "@/data/germany/eligibilityQuiz";

type MissionPhase = "intro" | "quiz" | "bridge" | "gate" | "result";

type Props = {
  /** Phase index in [0..QUIZ_STEPS.length+1]. Gate = QUIZ_STEPS.length, Result = +1. */
  current: number;
  total: number;
  variant?: "A" | "B";
  currentPhase?: MissionPhase;
};

export function QuizStepper({ current, total, variant = "A", currentPhase = "quiz" }: Props) {
  const { t } = useLanguage();
  const percent = Math.min(100, Math.round(((current + 1) / total) * 100));
  const isQuizStep = current < QUIZ_STEPS.length;

  const phaseLabel = isQuizStep
    ? t<string>(`eligibilityQuiz.stepNames.${QUIZ_STEPS[current]}`)
    : current === QUIZ_STEPS.length
      ? t<string>("eligibilityQuiz.gate.badge")
      : t<string>("eligibilityQuiz.result.badge");

  const phasePill =
    currentPhase === "bridge"
      ? "Bridge"
      : currentPhase === "gate"
        ? "Lead Gate"
        : currentPhase === "result"
          ? "Result"
          : "Quiz";

  return (
    <div className="w-full rounded-3xl border border-white/35 bg-[linear-gradient(150deg,rgba(255,255,255,0.86),rgba(245,250,255,0.78))] p-4 md:p-5 shadow-[0_24px_44px_-30px_rgba(11,21,48,0.42)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(150deg,rgba(11,21,48,0.78),rgba(19,41,95,0.72))]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
          {t<string>("eligibilityQuiz.progress.step")} {Math.min(current + 1, total)}{" "}
          {t<string>("eligibilityQuiz.progress.of")} {total}
        </p>
        <p className="text-xs font-extrabold text-[#7a5b10] dark:text-accent-primary-text">
          {percent}
          {t<string>("eligibilityQuiz.progress.percent")}
        </p>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">{phaseLabel}</span>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
            variant === "B"
              ? "bg-accent-primary/10 text-[#7a5b10] dark:bg-accent-primary/20 dark:text-accent-primary-text"
              : "bg-accent-primary/10 text-text-primary dark:bg-white/10 dark:text-white"
          }`}
        >
          {phasePill}
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden bg-border/40 dark:bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={t<string>("eligibilityQuiz.progress.questionsCompleted")}
      >
        <m.div
          className="h-full rounded-full bg-[linear-gradient(120deg,#f3d678,#d4af37_55%,#8f6b13)]"
          animate={{
            width: `${percent}%`,
            boxShadow: ["0 0 0 rgba(212,175,55,0)", "0 0 22px rgba(212,175,55,0.35)", "0 0 0 rgba(212,175,55,0)"],
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="mt-4 hidden md:flex items-center justify-between gap-2">
        {QUIZ_STEPS.map((step, idx) => {
          const done = idx < current;
          const active = idx === current;
          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                  done
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : active
                      ? "chip-active border-accent-primary shadow-[0_12px_20px_-10px_rgba(212,175,55,0.35)]"
                      : "bg-white/65 border-border text-text-muted dark:bg-white/5"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </span>
              <span
                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                  active ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {t<string>(`eligibilityQuiz.stepNames.${step}`)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 md:hidden">
        {QUIZ_STEPS.map((step, idx) => {
          const done = idx < current;
          const active = idx === current;
          return (
            <span
              key={step}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                done
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : active
                    ? "bg-accent-primary/20 text-accent-primary-strong dark:text-accent-primary-text"
                    : "bg-background-elevated text-text-secondary"
              }`}
            >
              {t<string>(`eligibilityQuiz.stepNames.${step}`)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
