import { m } from "motion/react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { QuizResult } from "@/data/germany/eligibilityQuiz";
import { ScoreMeter } from "./score-meter";

type ConfidenceTier = "high" | "medium" | "low";

const titleKey = (v: QuizResult["verdict"]) => {
  if (v === "highly_eligible") return "eligibilityQuiz.result.titleHighlyEligible";
  if (v === "potentially_eligible") return "eligibilityQuiz.result.titlePotentiallyEligible";
  return "eligibilityQuiz.result.titleNeedsImprovement";
};

const subtitleKey = (v: QuizResult["verdict"]) => {
  if (v === "highly_eligible") return "eligibilityQuiz.result.subtitleHighlyEligible";
  if (v === "potentially_eligible") return "eligibilityQuiz.result.subtitlePotentiallyEligible";
  return "eligibilityQuiz.result.subtitleNeedsImprovement";
};

const confidenceTier = (result: QuizResult): ConfidenceTier => {
  if (result.verdict === "highly_eligible" || result.scorePercent >= 70) return "high";
  if (result.verdict === "potentially_eligible" || result.scorePercent >= 45) return "medium";
  return "low";
};

export function EligibilityScoreCard({
  result,
  variant = "A",
}: {
  result: QuizResult;
  variant?: "A" | "B";
}) {
  const { t } = useLanguage();
  const isPositive = result.verdict !== "needs_improvement";
  const confidence = confidenceTier(result);

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-background-surface p-8 md:p-10 shadow-[0_30px_60px_-30px_rgba(11,21,48,0.25)]"
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col items-center">
          <ScoreMeter
            scorePercent={result.scorePercent}
            totalPoints={result.totalPoints}
            maxPoints={result.maxPoints}
            variant={variant}
          />
          <span
            className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              result.meetsChancenkarteMinimum
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {result.meetsChancenkarteMinimum ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            {result.meetsChancenkarteMinimum
              ? t<string>("eligibilityQuiz.result.thresholdMet")
              : t<string>("eligibilityQuiz.result.thresholdMissed")}
          </span>

          <div className="mt-4 w-full rounded-2xl border border-border bg-background-elevated p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">Mission status</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {result.meetsChancenkarteMinimum ? "Mission passed" : "Mission in progress"}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {result.meetsChancenkarteMinimum
                ? "You crossed the minimum Chancenkarte points threshold."
                : "You still have a path. Use the action plan below to improve your profile."}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-primary-strong">
            {t<string>("eligibilityQuiz.result.badge")}
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-text-primary leading-tight">
            {t<string>(titleKey(result.verdict))}
          </h2>
          <p className="mt-3 text-text-secondary leading-relaxed">
            {t<string>(subtitleKey(result.verdict))}
          </p>

          <div
            className={`mt-4 rounded-2xl border p-4 ${
              variant === "B"
                ? "border-accent-primary/30 bg-accent-primary/5"
                : "border-border bg-background-elevated"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t<string>("eligibilityQuiz.result.confidenceLabel")}
            </p>
            <p className="mt-1 text-sm font-semibold text-text-primary">
              {t<string>(`eligibilityQuiz.result.confidence.${confidence}`)}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {t<string>(`eligibilityQuiz.result.confidenceNote.${confidence}`)}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              {t<string>("eligibilityQuiz.result.categoryBreakdown")}
            </p>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {result.categories.map((c) => {
                const pct = c.maxPoints > 0 ? Math.round((c.points / c.maxPoints) * 100) : 0;
                return (
                  <m.div
                    key={c.step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24 }}
                    className="p-3 rounded-xl border border-border bg-background-elevated"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">
                        {t<string>(`eligibilityQuiz.stepNames.${c.step}`)}
                      </span>
                      <span className="text-text-secondary">
                        {c.points}/{c.maxPoints}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                      <m.div
                        className={`h-full rounded-full ${
                          isPositive
                            ? "bg-linear-to-r from-accent-primary to-accent-primary-strong"
                            : "bg-amber-500"
                        }`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </m.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {result.missingRequirements.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t<string>("eligibilityQuiz.result.missingTitle")}
          </p>
          <ul className="mt-3 space-y-1.5">
            {result.missingRequirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {t<string>(`eligibilityQuiz.result.requirements.${req}`)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {t<string>("eligibilityQuiz.result.actionsTitle")}
        </p>
        <ul className="mt-3 space-y-1.5">
          {result.recommendedActions.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {t<string>(`eligibilityQuiz.result.actions.${a}`)}
            </li>
          ))}
        </ul>
      </div>
    </m.div>
  );
}
