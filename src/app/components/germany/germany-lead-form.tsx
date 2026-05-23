import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { getPublicEnv } from "@/lib/env";
import { TurnstileWidget } from "../ui/turnstile-widget";
import { submitChancenkarteLead } from "@/services/chancenkarte-lead";
import type { QuizAnswers, QuizResult } from "@/data/germany/eligibilityQuiz";
import { trackFormSubmit, trackStepCompletion } from "@/utils/tracking";

export type GermanyLeadInput = {
  fullName: string;
  email: string;
  whatsapp: string;
  profession: string;
  country: string;
};

type Props = {
  answers: QuizAnswers;
  result: QuizResult;
  variant?: "A" | "B";
  /** Defaults are pre-filled from quiz answers when possible. */
  defaults?: Partial<GermanyLeadInput>;
  onGateStepChange?: (step: 1 | 2) => void;
  onSubmitted: () => void;
  sourcePath?: string;
};

function isValidEmail(value: string) {
  return /.+@.+\..+/.test(value);
}

export function GermanyLeadForm({
  answers,
  result,
  variant = "A",
  defaults,
  onGateStepChange,
  onSubmitted,
  sourcePath,
}: Props) {
  const { t, language, dir } = useLanguage();
  const { turnstileSiteKey } = getPublicEnv();

  const [data, setData] = useState<GermanyLeadInput>({
    fullName: defaults?.fullName ?? "",
    email: defaults?.email ?? "",
    whatsapp: defaults?.whatsapp ?? "",
    profession: defaults?.profession ?? answers.profession ?? "",
    country: defaults?.country ?? answers.residence ?? "",
  });
  const [touched, setTouched] = useState<Record<keyof GermanyLeadInput, boolean>>({
    fullName: false,
    email: false,
    whatsapp: false,
    profession: false,
    country: false,
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [gateStep, setGateStep] = useState<1 | 2>(1);

  useEffect(() => {
    onGateStepChange?.(gateStep);
  }, [gateStep, onGateStepChange]);

  const errorFor = (k: keyof GermanyLeadInput): string | undefined => {
    if (!touched[k]) return undefined;
    if (!data[k].trim()) return t<string>("eligibilityQuiz.gate.error.required");
    if (k === "email" && !isValidEmail(data[k]))
      return t<string>("eligibilityQuiz.gate.error.invalidEmail");
    return undefined;
  };

  const isStep1Valid =
    data.fullName.trim().length > 0 &&
    isValidEmail(data.email) &&
    data.whatsapp.trim().length > 0;

  const isStep2Valid =
    data.profession.trim().length > 0 &&
    data.country.trim().length > 0 &&
    (turnstileSiteKey ? turnstileToken.length > 0 : true);

  const isFormValid = isStep1Valid && isStep2Valid;

  const stepProgress = useMemo(() => (gateStep === 1 ? 50 : 100), [gateStep]);

  const handleNextStep = () => {
    setTouched((prev) => ({
      ...prev,
      fullName: true,
      email: true,
      whatsapp: true,
    }));
    if (!isStep1Valid) return;
    trackStepCompletion({ step: 91, page: "chancenkarte-eligibility-quiz" });
    setGateStep(2);
  };

  const handleSubmit = async () => {
    setTouched({
      fullName: true,
      email: true,
      whatsapp: true,
      profession: true,
      country: true,
    });
    if (!isFormValid) return;
    if (turnstileSiteKey && !turnstileToken) {
      setError(t<string>("eligibilityQuiz.gate.error.turnstile"));
      return;
    }

    setStatus("submitting");
    trackFormSubmit({ page: "chancenkarte-eligibility-quiz" });

    const ok = await submitChancenkarteLead({
      ...data,
      language,
      answers,
      result,
      turnstileToken,
      sourcePath,
    });

    if (ok) {
      trackStepCompletion({ step: 99, page: "chancenkarte-eligibility-quiz" });
      onSubmitted();
    } else {
      setStatus("error");
      setError(t<string>("eligibilityQuiz.gate.error.submit"));
    }
  };

  return (
    <m.section
      dir={dir}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-background-surface p-6 md:p-8 shadow-[0_30px_60px_-30px_rgba(11,21,48,0.2)]"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18),transparent_65%)]" />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-primary-strong">
        {variant === "B" ? "Mission Gate" : t<string>("eligibilityQuiz.gate.badge")}
      </p>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold text-text-primary leading-tight">
        {t<string>("eligibilityQuiz.gate.title")}
      </h2>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        {t<string>("eligibilityQuiz.gate.description")}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Tailored action plan
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-elevated px-3 py-1 text-[11px] font-semibold text-text-secondary">
          <ShieldCheck className="h-3.5 w-3.5 text-accent-primary-strong" />
          Privacy-first handling
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Gate step {gateStep}/2</span>
          <span>{stepProgress}%</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-border">
          <m.div
            className="h-full rounded-full bg-linear-to-r from-accent-primary to-accent-primary-strong"
            animate={{ width: `${stepProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {gateStep === 1 ? (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Field
            name="fullName"
            label={t<string>("eligibilityQuiz.gate.fields.fullName")}
            placeholder={t<string>("eligibilityQuiz.gate.placeholders.fullName")}
            value={data.fullName}
            onChange={(v) => setData((d) => ({ ...d, fullName: v }))}
            onBlur={() => setTouched((s) => ({ ...s, fullName: true }))}
            error={errorFor("fullName")}
          />
          <Field
            name="email"
            type="email"
            label={t<string>("eligibilityQuiz.gate.fields.email")}
            placeholder={t<string>("eligibilityQuiz.gate.placeholders.email")}
            value={data.email}
            onChange={(v) => setData((d) => ({ ...d, email: v }))}
            onBlur={() => setTouched((s) => ({ ...s, email: true }))}
            error={errorFor("email")}
          />
          <Field
            name="whatsapp"
            type="tel"
            label={t<string>("eligibilityQuiz.gate.fields.whatsapp")}
            placeholder={t<string>("eligibilityQuiz.gate.placeholders.whatsapp")}
            value={data.whatsapp}
            onChange={(v) => setData((d) => ({ ...d, whatsapp: v }))}
            onBlur={() => setTouched((s) => ({ ...s, whatsapp: true }))}
            error={errorFor("whatsapp")}
          />

          <button
            type="button"
            onClick={handleNextStep}
            className="sm:col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong px-6 py-3.5 text-sm font-bold text-slate-900 shadow-md transition-all hover:shadow-lg"
          >
            Continue to step 2
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              name="profession"
              label={t<string>("eligibilityQuiz.gate.fields.profession")}
              placeholder={t<string>("eligibilityQuiz.gate.placeholders.profession")}
              value={data.profession}
              onChange={(v) => setData((d) => ({ ...d, profession: v }))}
              onBlur={() => setTouched((s) => ({ ...s, profession: true }))}
              error={errorFor("profession")}
            />
            <Field
              name="country"
              label={t<string>("eligibilityQuiz.gate.fields.country")}
              placeholder={t<string>("eligibilityQuiz.gate.placeholders.country")}
              value={data.country}
              onChange={(v) => setData((d) => ({ ...d, country: v }))}
              onBlur={() => setTouched((s) => ({ ...s, country: true }))}
              error={errorFor("country")}
            />
          </div>

          {turnstileSiteKey && (
            <div className="mt-5">
              <TurnstileWidget siteKey={turnstileSiteKey} onTokenChange={setTurnstileToken} />
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setGateStep(1)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:bg-background-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              disabled={status === "submitting" || !isFormValid}
              onClick={handleSubmit}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong px-6 py-4 font-bold text-slate-900 shadow-[0_18px_40px_-12px_rgba(212,175,55,0.55)] transition-all hover:shadow-[0_22px_46px_-12px_rgba(212,175,55,0.75)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {t<string>("eligibilityQuiz.gate.submit")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-text-muted leading-relaxed">
        <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
        {t<string>("eligibilityQuiz.gate.consent")}
      </p>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium" role="alert">
          {error}
        </p>
      )}
    </m.section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={`urm-germany-${name}`}
        className="block text-[11px] font-semibold uppercase tracking-widest text-text-secondary"
      >
        {label}
      </label>
      <input
        id={`urm-germany-${name}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-xl border bg-background-elevated text-sm text-text-primary placeholder:text-text-secondary/55 focus:outline-none transition-colors ${
          error
            ? "border-red-400 ring-2 ring-red-400/15"
            : "border-border focus:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/25"
        }`}
      />
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
