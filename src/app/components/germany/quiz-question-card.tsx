import { m } from "motion/react";
import { Check } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { QuizQuestion } from "@/data/germany/eligibilityQuiz";

type Props = {
  question: QuizQuestion;
  index: number;
  total: number;
  variant: "A" | "B";
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  error?: string;
};

export function QuizQuestionCard({
  question,
  index,
  total,
  variant,
  value,
  onChange,
  disabled = false,
  error,
}: Props) {
  const { t, dir } = useLanguage();
  const labelKey = `eligibilityQuiz.questions.${question.id}.label`;
  const helpKey = `eligibilityQuiz.questions.${question.id}.help`;
  const placeholderKey = `eligibilityQuiz.questions.${question.id}.placeholder`;

  const help = safeT(t, helpKey);
  const helperFallback = contextualHelper(question.id);
  const renderedHelp = help || helperFallback;

  return (
    <m.div
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      dir={dir}
      className="relative overflow-hidden rounded-[1.8rem] border border-white/45 bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(247,242,231,0.82))] p-5 md:p-7 shadow-[0_30px_56px_-30px_rgba(11,21,48,0.48)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(155deg,rgba(11,21,48,0.88),rgba(19,41,95,0.8))]"
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_68%)]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 bottom-0 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(11,21,48,0.08),transparent_68%)]"
        animate={{ y: [0, -6, 0], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center rounded-full border border-white/60 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-primary dark:border-white/15 dark:bg-white/5 dark:text-accent-primary-text">
          Q{index}/{total}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${
            variant === "B"
              ? "bg-accent-primary/10 text-[#7a5b10] dark:bg-accent-primary/20 dark:text-accent-primary-text"
              : "bg-black/6 text-text-primary dark:bg-white/10 dark:text-white"
          }`}
        >
          {variant === "B" ? "Mission prompt" : "Quick answer"}
        </span>
      </div>
      <h2 className="text-[1.12rem] md:text-[1.35rem] font-extrabold tracking-[-0.01em] text-text-primary leading-snug">
        {t<string>(labelKey)}
      </h2>
      {renderedHelp && (
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">{renderedHelp}</p>
      )}

      <div className="mt-6">
        {question.kind === "text" ? (
          <>
            <input
              type="text"
              value={value}
              list={question.suggestions?.length ? `${question.id}-suggestions` : undefined}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              placeholder={safeT(t, placeholderKey)}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full min-h-12 rounded-2xl border bg-white/75 px-4 py-3.5 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-primary/35 focus:border-accent-primary/55 transition-colors disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white/5 ${
                error ? "border-red-400" : "border-border"
              }`}
            />
            {question.suggestions?.length ? (
              <datalist id={`${question.id}-suggestions`}>
                {question.suggestions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            ) : null}
            {error && (
              <p className="mt-2 text-xs font-medium text-red-500" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <fieldset>
            <legend className="sr-only">{t<string>(labelKey)}</legend>
            <div className="grid sm:grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const selected = value === opt.value;
                return (
                  <m.button
                    type="button"
                    key={opt.value}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    onClick={() => onChange(opt.value)}
                    disabled={disabled}
                    aria-pressed={selected}
                    className={`group text-start min-h-16 rounded-2xl border px-4 py-3.5 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? "border-accent-primary/75 bg-[linear-gradient(135deg,rgba(243,214,120,0.22),rgba(212,175,55,0.16),rgba(11,21,48,0.08))] ring-2 ring-accent-primary/25 shadow-[0_20px_28px_-20px_rgba(11,21,48,0.8)]"
                        : "border-border bg-white/65 hover:border-accent-primary/45 hover:bg-white/85 dark:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-4 w-4 rounded-full border-2 shrink-0 transition-colors ${
                          selected
                            ? "border-accent-primary bg-accent-primary"
                            : "border-border group-hover:border-accent-primary/70"
                        }`}
                      />
                      <span className="grow text-sm font-medium text-text-primary leading-snug">
                        {t<string>(`eligibilityQuiz.questions.${question.id}.options.${opt.value}`)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          selected
                            ? "bg-accent-primary/20 text-[#7a5b10] dark:bg-accent-primary/20 dark:text-accent-primary-text"
                            : "bg-black/5 text-text-secondary dark:bg-white/10"
                        }`}
                      >
                        +{opt.points}
                      </span>
                      {selected && <Check className="ms-auto w-4 h-4 text-accent-primary-strong" />}
                    </span>
                  </m.button>
                );
              })}
            </div>
            {error && (
              <p className="mt-2 text-xs font-medium text-red-500" role="alert">
                {error}
              </p>
            )}
          </fieldset>
        )}
      </div>
    </m.div>
  );
}

/** Tolerates missing i18n keys without throwing in dev. */
function safeT(t: <T>(k: string) => T, key: string): string {
  try {
    const v = t<string>(key);
    return v ?? "";
  } catch {
    return "";
  }
}

function contextualHelper(id: QuizQuestion["id"]): string {
  if (id === "universityRecognised") {
    return "Anabin is Germany's official degree recognition database. If you are unsure, select uncertain and we help verify it.";
  }
  if (id === "germanLevel") {
    return "German level can be from Goethe, TELC, OSD, TestDaF, or equivalent proofs.";
  }
  if (id === "blockedAccount") {
    return "For Chancenkarte/job-seeker planning, many applicants prepare around EUR 13,100 for proof of funds.";
  }
  if (id === "relativesInGermany") {
    return "This is asked because family ties can improve practical settlement support in Germany.";
  }
  return "";
}
