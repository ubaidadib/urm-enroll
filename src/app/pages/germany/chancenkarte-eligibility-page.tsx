import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, m } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  CalendarDays,
  MessageCircle,
  CircleCheck,
  Sparkles,
  Clock3,
  BarChart3,
  Flag,
  X,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../../seo/seo-manager";
import { Breadcrumbs } from "../../components/layout/breadcrumbs";
import { QuizStepper } from "../../components/germany/quiz-stepper";
import { QuizQuestionCard } from "../../components/germany/quiz-question-card";
import { EligibilityScoreCard } from "../../components/germany/eligibility-score-card";
import { GermanyLeadForm } from "../../components/germany/germany-lead-form";
import { useLocalizedPath } from "../../components/germany/useLocalizedPath";
import {
  QUIZ_QUESTIONS,
  QUIZ_STEPS,
  computeQuizResult,
  type QuizAnswers,
  type QuizQuestion,
  type QuizStepId,
} from "@/data/germany/eligibilityQuiz";
import { trackCTA } from "@/utils/tracking";
import {
  buildMilestone,
  useEligibilityMissionTracking,
  useEligibilityMissionVariant,
  type MilestoneState,
  type MissionPhase,
} from "../../components/germany/use-eligibility-mission";

type StickyAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function ChancenkarteEligibilityPage() {
  const { t, dir } = useLanguage();
  const localizedPath = useLocalizedPath();
  const { variant, isVariantB } = useEligibilityMissionVariant();
  const {
    trackMissionStart,
    trackMissionStepComplete,
    trackGateProgress,
    trackGateSubmitted,
    trackResultReveal,
    trackStickyCTA,
  } = useEligibilityMissionTracking(variant);

  const [phase, setPhase] = useState<MissionPhase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [milestone, setMilestone] = useState<MilestoneState | null>(null);
  const [milestoneId, setMilestoneId] = useState(0);

  const currentStep: QuizStepId =
    (QUIZ_STEPS[stepIndex] ?? QUIZ_STEPS[0]) as QuizStepId;
  const questionsForStep: QuizQuestion[] = useMemo(
    () =>
      QUIZ_QUESTIONS.filter((q) => q.step === currentStep).filter((q) => {
        if (
          currentStep === "education" &&
          q.id === "vocationalTraining" &&
          ["phd", "master", "bachelor"].includes(answers.degreeType ?? "")
        ) {
          return false;
        }
        return true;
      }),
    [answers.degreeType, currentStep],
  );

  const totalPhases = QUIZ_STEPS.length + 2; // quiz steps + gate + result
  const phaseIndex =
    phase === "intro"
      ? 0
      : phase === "quiz"
        ? stepIndex
        : phase === "gate"
          ? QUIZ_STEPS.length
          : QUIZ_STEPS.length + 1;

  const optionalQuestionIds = new Set<QuizQuestion["id"]>(["relativesInGermany"]);

  /** All required (non-text) questions in this step must have an answer. */
  const isStepValid = useMemo(() => {
    return questionsForStep.every((q) => {
      const v = answers[q.id];
      if (optionalQuestionIds.has(q.id)) return true;
      if (q.kind === "text") return (v ?? "").trim().length > 0;
      return v !== undefined && v !== "";
    });
  }, [questionsForStep, answers]);

  const result = useMemo(() => computeQuizResult(answers), [answers]);

  const totalQuestionsInStep = questionsForStep.length;
  const answeredQuestionsInStep = useMemo(
    () => questionsForStep.filter((q) => (answers[q.id] ?? "").toString().trim().length > 0).length,
    [questionsForStep, answers],
  );

  const missionTitle = isVariantB ? "Mission Chancenkarte" : "Chancenkarte Check";

  const openMilestone = useCallback((type: Parameters<typeof buildMilestone>[0]) => {
    setMilestoneId((prev) => {
      const id = prev + 1;
      setMilestone(buildMilestone(type, id));
      return id;
    });
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                          */
  /* ---------------------------------------------------------------- */

  const setAnswer = useCallback((id: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (!isStepValid) return;
    trackMissionStepComplete(stepIndex + 1);
    openMilestone("step_complete");
    if (stepIndex < QUIZ_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase("gate");
    }
  }, [isStepValid, stepIndex, openMilestone, trackMissionStepComplete]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    else setPhase("intro");
  }, [stepIndex]);

  const startQuiz = useCallback(() => {
    trackMissionStart();
    openMilestone("mission_start");
    setPhase("quiz");
  }, [openMilestone, trackMissionStart]);

  const onLeadSubmitted = useCallback(() => {
    trackGateSubmitted();
    trackResultReveal();
    openMilestone("gate_complete");
    setSubmitted(true);
    setPhase("result");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [openMilestone, trackGateSubmitted, trackResultReveal]);

  const retake = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    setPhase("intro");
    setSubmitted(false);
  }, []);

  const onGateStepChange = useCallback(
    (gateStep: 1 | 2) => {
      trackGateProgress(gateStep);
    },
    [trackGateProgress],
  );

  useEffect(() => {
    if (phase === "quiz" && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stepIndex, phase]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <main dir={dir} className="bg-slate-50 dark:bg-slate-950">
      <SeoManager
        path="/chancenkarte/eligibility"
        pageKey="chancenkarteEligibility"
        breadcrumbs={[
          { name: t<string>("common.home"), path: "/" },
          { name: t<string>("chancenkarte.hub.breadcrumb"), path: "/chancenkarte" },
          { name: t<string>("eligibilityQuiz.intro.badge"), path: "/chancenkarte/eligibility" },
        ]}
      />

      <section className="relative isolate overflow-hidden pt-32 pb-20 px-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-accent-tech/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[34rem] h-[34rem] bg-accent-success/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs
            items={[
              { label: t<string>("common.home"), href: localizedPath("/") },
              { label: t<string>("chancenkarte.hub.breadcrumb"), href: localizedPath("/chancenkarte") },
              { label: "Eligibility", href: localizedPath("/chancenkarte/eligibility") },
            ]}
          />

          {phase !== "intro" && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-5 py-4 shadow-sm hover:border-accent-tech/30 transition-all">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Quiz format</p>
                <p className="mt-2 flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-accent-primary-strong" />
                  {isVariantB ? "Mission checkpoints" : "18 quick taps"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-5 py-4 shadow-sm hover:border-accent-tech/30 transition-all">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Time</p>
                <p className="mt-2 flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                  <Clock3 className="h-4 w-4 text-accent-primary-strong" />
                  {t<string>("eligibilityQuiz.intro.estimatedTime")}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-5 py-4 shadow-sm hover:border-accent-tech/30 transition-all">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Score model</p>
                <p className="mt-2 flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                  <BarChart3 className="h-4 w-4 text-accent-primary-strong" />
                  Real points logic
                </p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <IntroPanel
                key="intro"
                onStart={startQuiz}
                title={missionTitle}
                variant={variant}
              />
            )}

            {phase === "quiz" && (
              <m.div
                key={`step-${stepIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <QuizStepper
                  current={phaseIndex}
                  total={totalPhases}
                  variant={variant}
                  currentPhase={phase}
                />

                <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm backdrop-blur">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-tech">
                        {t<string>(`eligibilityQuiz.stepNames.${currentStep}`)}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t<string>(`eligibilityQuiz.stepIntros.${currentStep}`)}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>
                        {answeredQuestionsInStep}/{totalQuestionsInStep}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(120deg,#f3d678,#d4af37_55%,#8f6b13)] transition-all duration-300"
                      style={{
                        width: `${
                          totalQuestionsInStep > 0
                            ? Math.round((answeredQuestionsInStep / totalQuestionsInStep) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {questionsForStep.map((q, index) => (
                    <QuizQuestionCard
                      key={q.id}
                      question={q}
                      index={index + 1}
                      total={questionsForStep.length}
                      variant={variant}
                      value={answers[q.id] ?? ""}
                      onChange={(v) => setAnswer(q.id, v)}
                    />
                  ))}
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rtl:flex-row-reverse"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t<string>("eligibilityQuiz.nav.back")}
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!isStepValid}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(120deg,#f3d678,#d4af37_55%,#8f6b13)] px-6 py-3 text-sm font-extrabold text-slate-900 shadow-[0_18px_30px_-12px_rgba(11,21,48,0.45)] hover:shadow-[0_24px_40px_-14px_rgba(11,21,48,0.55)] disabled:cursor-not-allowed disabled:opacity-50 transition-all rtl:flex-row-reverse"
                  >
                    {stepIndex === QUIZ_STEPS.length - 1
                      ? "Review mission"
                      : t<string>("eligibilityQuiz.nav.next")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </m.div>
            )}

            {phase === "gate" && (
              <m.div
                key="gate"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <QuizStepper
                  current={phaseIndex}
                  total={totalPhases}
                  variant={variant}
                  currentPhase={phase}
                />
                <div className="mt-6">
                  <GermanyLeadForm
                    answers={answers}
                    result={result}
                    variant={variant}
                    defaults={{
                      profession: answers.profession ?? "",
                      country: answers.residence ?? "",
                    }}
                    onGateStepChange={onGateStepChange}
                    onSubmitted={onLeadSubmitted}
                    sourcePath="/chancenkarte/eligibility"
                  />
                </div>
              </m.div>
            )}

            {phase === "result" && (
              <m.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <QuizStepper
                  current={phaseIndex}
                  total={totalPhases}
                  variant={variant}
                  currentPhase={phase}
                />
                <div className="mt-6">
                  <EligibilityScoreCard result={result} variant={variant} />
                </div>

                {submitted && (
                  <p className="mt-4 text-center text-sm text-emerald-600 dark:text-emerald-400">
                    {t<string>("eligibilityQuiz.result.sharedCopy")}
                  </p>
                )}

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {t<string>("eligibilityQuiz.result.ctaHelper")}
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <Link
                      to={localizedPath("/contact")}
                      onClick={() =>
                        trackCTA({
                          type: "primary",
                          context: "germany",
                          intentLevel: "high",
                          variant: "quiz-result",
                        })
                      }
                      className="group flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong text-slate-900 font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <CalendarDays className="w-4 h-4" />
                      {t<string>("eligibilityQuiz.result.cta.primary")}
                    </Link>
                    <a
                      href="https://wa.me/96170585052"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackCTA({
                          type: "secondary",
                          context: "germany",
                          intentLevel: "high",
                          variant: "quiz-result-whatsapp",
                        })
                      }
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#1c8c46] dark:text-[#25D366] font-bold hover:bg-[#25D366]/20 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t<string>("eligibilityQuiz.result.cta.whatsapp")}
                    </a>
                    <button
                      type="button"
                      onClick={retake}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      {t<string>("eligibilityQuiz.result.cta.retake")}
                    </button>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {milestone && (
              <m.div
                key={milestone.id}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-x-4 top-24 z-[60] mx-auto max-w-md rounded-2xl border border-accent-primary/35 bg-[linear-gradient(145deg,#0b1530,#13295f)] px-4 py-3 text-white shadow-[0_30px_40px_-20px_rgba(11,21,48,0.8)]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-accent-primary/20 p-1.5">
                    <Flag className="h-4 w-4 text-accent-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{milestone.title}</p>
                    <p className="mt-0.5 text-xs text-white/75">{milestone.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMilestone(null)}
                    className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label="Dismiss milestone"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <StickyMissionFooter
        phase={phase}
        action={getStickyAction({
          phase,
          stepIndex,
          isStepValid,
          totalSteps: QUIZ_STEPS.length,
          onStart: startQuiz,
          onNext: goNext,
          onRetake: retake,
          trackStickyCTA,
        })}
      />

    </main>
  );
}

function IntroPanel({
  onStart,
  title,
  variant,
}: {
  onStart: () => void;
  title: string;
  variant: "A" | "B";
}) {
  const { t } = useLanguage();
  const bullets = t<readonly string[]>("eligibilityQuiz.intro.bullets");
  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/40 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(247,242,231,0.82))] p-6 sm:p-8 md:p-12 shadow-[0_40px_70px_-34px_rgba(11,21,48,0.45)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(11,21,48,0.88),rgba(19,41,95,0.82))]"
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.24),transparent_64%)]"
        animate={{ y: [0, 10, 0], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(11,21,48,0.12),transparent_62%)]"
        animate={{ y: [0, -8, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-primary-strong">
        {variant === "B" ? "Mission mode" : t<string>("eligibilityQuiz.intro.badge")}
      </p>
      <h1 className="mt-3 text-[2rem] leading-[1.04] sm:text-[2.7rem] md:text-[3.2rem] font-black tracking-[-0.03em] text-slate-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[0.98rem] text-slate-600 dark:text-slate-400 leading-relaxed">
        {t<string>("eligibilityQuiz.intro.subtitle")}
      </p>

      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {Array.isArray(bullets) &&
          bullets.map((b) => (
            <li
              key={b}
              className="rounded-2xl border border-white/50 bg-white dark:bg-slate-900/40 px-3 py-2.5 text-sm font-medium text-slate-900 backdrop-blur dark:border-white/10 dark:text-white"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-primary align-middle" /> {" "}
              {b}
            </li>
          ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(125deg,#f3d678,#d4af37_56%,#8f6b13)] px-6 py-3.5 text-slate-900 font-extrabold shadow-[0_20px_42px_-12px_rgba(11,21,48,0.45)] hover:translate-y-[-1px] hover:shadow-[0_28px_52px_-12px_rgba(11,21,48,0.55)] transition-all"
        >
          {variant === "B" ? "Launch mission" : t<string>("eligibilityQuiz.intro.cta")}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <span className="rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs text-slate-400 dark:border-white/15 dark:bg-white/5">
          {t<string>("eligibilityQuiz.intro.estimatedTime")}
        </span>
      </div>
    </m.div>
  );
}

function StickyMissionFooter({
  phase,
  action,
}: {
  phase: MissionPhase;
  action: StickyAction | null;
}) {
  if (!action || phase === "result") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-accent-primary/20 bg-[linear-gradient(120deg,rgba(11,21,48,0.94),rgba(19,41,95,0.94))] p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-primary">Mission control</p>
          <p className="truncate text-sm font-semibold text-white">
            {phase === "intro" ? "Start your mission" : "Continue to next checkpoint"}
          </p>
        </div>
        <button
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(125deg,#f3d678,#d4af37_55%,#8f6b13)] px-4 py-2.5 text-sm font-extrabold text-slate-900 transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getStickyAction({
  phase,
  stepIndex,
  isStepValid,
  totalSteps,
  onStart,
  onNext,
  onRetake,
  trackStickyCTA,
}: {
  phase: MissionPhase;
  stepIndex: number;
  isStepValid: boolean;
  totalSteps: number;
  onStart: () => void;
  onNext: () => void;
  onRetake: () => void;
  trackStickyCTA: (kind: "continue" | "book" | "retake", phase: MissionPhase) => void;
}): StickyAction | null {
  if (phase === "intro") {
    return {
      label: "Start",
      onClick: () => {
        trackStickyCTA("continue", phase);
        onStart();
      },
    };
  }
  if (phase === "quiz") {
    return {
      label: stepIndex === totalSteps - 1 ? "Review" : "Next",
      onClick: () => {
        trackStickyCTA("continue", phase);
        onNext();
      },
      disabled: !isStepValid,
    };
  }
  if (phase === "gate") {
    return null;
  }
  return {
    label: "Retake",
    onClick: () => {
      trackStickyCTA("retake", phase);
      onRetake();
    },
  };
}
