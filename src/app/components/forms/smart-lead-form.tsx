import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageCircle,
  User,
  GraduationCap,
  Building2,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { trackFormStart, trackStepCompletion, trackFormSubmit, trackCTA, trackFormDropOff, trackExperimentView, trackExperimentConversion } from "@/utils/tracking";
import { getPublicEnv } from "@/lib/env";
import { TurnstileWidget } from "../ui/turnstile-widget";
import { useExperiment } from "@/hooks/useExperiment";
import { submitLead } from "@/services/lead-service";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type UserType = "student" | "agent" | "";
type FormStep = 1 | 2 | 3 | 4 | 5;
type Status = "idle" | "submitting" | "success" | "error";

interface FormData {
  // Step 1 — Basic Info
  fullName: string;
  email: string;
  phone: string;
  // Step 2 — User Type
  userType: UserType;
  // Step 3 — Student
  destination: string;
  fieldOfStudy: string;
  budgetRange: string;
  languageLevel: string;
  // Step 3 — Agent
  agencyName: string;
  monthlyVolume: string;
  targetDestinations: string;
  existingPartnerships: string;
  // Step 4 — Qualification
  timeline: string;
  readiness: string;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  phone: "",
  userType: "",
  destination: "",
  fieldOfStudy: "",
  budgetRange: "",
  languageLevel: "",
  agencyName: "",
  monthlyVolume: "",
  targetDestinations: "",
  existingPartnerships: "",
  timeline: "",
  readiness: "",
};

const WHATSAPP_NUMBER = "96170585052";
const TOTAL_STEPS = 5;

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".");
}

function validateStep(step: FormStep, data: FormData): boolean {
  switch (step) {
    case 1:
      return (
        data.fullName.trim().length > 0 &&
        isValidEmail(data.email) &&
        data.phone.trim().length > 0
      );
    case 2:
      return data.userType === "student" || data.userType === "agent";
    case 3:
      if (data.userType === "student") {
        return data.destination.trim().length > 0 && data.fieldOfStudy.trim().length > 0;
      }
      return (
        data.agencyName.trim().length > 0 &&
        data.monthlyVolume.trim().length > 0 &&
        data.targetDestinations.trim().length > 0
      );
    case 4:
      return data.timeline.trim().length > 0 && data.readiness.trim().length > 0;
    case 5:
      return true;
    default:
      return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Required fields per step (for touch-on-next validation reveal)    */
/* ------------------------------------------------------------------ */

function getRequiredFieldsForStep(step: FormStep, userType: UserType): (keyof FormData)[] {
  switch (step) {
    case 1:
      return ["fullName", "email", "phone"];
    case 2:
      return [];
    case 3:
      return userType === "agent"
        ? ["agencyName", "monthlyVolume", "targetDestinations"]
        : ["destination", "fieldOfStudy"];
    case 4:
      return ["timeline", "readiness"];
    default:
      return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Slide animation variants                                           */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -24 : 24, opacity: 0 }),
};

/* ------------------------------------------------------------------ */
/*  Reusable input component                                           */
/* ------------------------------------------------------------------ */

function FormInput({
  name,
  label,
  type = "text",
  required,
  value,
  onChange,
  active,
  onFocus,
  onBlur,
  optionalLabel,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  active: boolean;
  onFocus: () => void;
  onBlur: () => void;
  optionalLabel?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={`lead-${name}`} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {optionalLabel && <span className="text-text-secondary/60 ml-1 normal-case font-normal">{optionalLabel}</span>}
      </label>
      <input
        id={`lead-${name}`}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-xl border text-sm bg-bg-surface text-text-primary placeholder:text-text-secondary/50 transition-all duration-200 focus:outline-none ${
          error
            ? "border-red-400 ring-2 ring-red-400/20"
            : active
              ? "border-accent-primary ring-2 ring-accent-primary/20 shadow-sm"
              : "border-border/50 hover:border-border"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function FormSelect({
  name,
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  active,
  onFocus,
  onBlur,
  optionalLabel,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  active: boolean;
  onFocus: () => void;
  onBlur: () => void;
  optionalLabel?: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={`lead-${name}`} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {optionalLabel && <span className="text-text-secondary/60 ml-1 normal-case font-normal">{optionalLabel}</span>}
      </label>
      <select
        id={`lead-${name}`}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-xl border text-sm bg-bg-surface text-text-primary transition-all duration-200 focus:outline-none appearance-none ${
          error
            ? "border-red-400 ring-2 ring-red-400/20"
            : active
              ? "border-accent-primary ring-2 ring-accent-primary/20 shadow-sm"
              : "border-border/50 hover:border-border"
        } ${!value ? "text-text-secondary/50" : ""}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function SmartLeadForm() {
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";
  const { variant: formVariant, isVariantB: isFormB } = useExperiment("lead_form_steps");
  const [step, setStep] = useState<FormStep>(1);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [hasStartedTracking, setHasStartedTracking] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showExitIntent, setShowExitIntent] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const { turnstileSiteKey } = getPublicEnv();

  // Auto-focus first input on step change
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = formContainerRef.current?.querySelector<HTMLElement>("input, select");
      el?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, [step]);

  // Exit intent via visibilitychange on steps 2-4
  useEffect(() => {
    if (step < 2 || step > 4) return;
    const handler = () => {
      if (document.visibilityState === "hidden") {
        trackFormDropOff({ step, userType: formData.userType || undefined, page: "lead-form" });
        setShowExitIntent(true);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [step, formData.userType]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.currentTarget;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setError("");
      if (!hasStartedTracking) {
        trackFormStart({ page: "lead-form" });
        setHasStartedTracking(true);
      }

      // Urgent readiness → auto-fill timeline and skip to Step 5
      if (name === "readiness" && value === "urgent" && step === 4) {
        setFormData((prev) => ({
          ...prev,
          readiness: "urgent",
          timeline: prev.timeline || "this_month",
        }));
        trackStepCompletion({ step: 4, userType: formData.userType || undefined, page: "lead-form" });
        setDirection(1);
        setStep(5);
      }
    },
    [hasStartedTracking, step, formData.userType],
  );

  const isStepValid = useMemo(() => validateStep(step, formData), [step, formData]);

  const goNext = useCallback(() => {
    if (!isStepValid) {
      // Reveal inline errors on all required fields for this step
      const fields = getRequiredFieldsForStep(step, formData.userType);
      setTouched((prev) => {
        const next = { ...prev };
        for (const f of fields) next[f] = true;
        return next;
      });
      return;
    }
    trackStepCompletion({ step, userType: formData.userType || undefined, page: "lead-form" });
    const nextStep = Math.min(step + 1, TOTAL_STEPS) as FormStep;
    if (nextStep === 4) {
      trackExperimentView({ experiment: "lead_form_steps", variant: formVariant, page: "lead-form" });
    }
    setDirection(1);
    setStep(nextStep);
  }, [isStepValid, step, formData.userType, formVariant]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1) as FormStep);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!turnstileToken) {
      setError(t<string>("leadForm.error.turnstile"));
      return;
    }
    setStatus("submitting");
    trackFormSubmit({ userType: formData.userType || undefined, page: "lead-form" });
    trackExperimentConversion({ experiment: "lead_form_steps", variant: formVariant, action: "form_submit", page: "lead-form" });

    try {
      const result = await submitLead(formData, turnstileToken);
      if (result.success) {
        setStatus("success");
        trackStepCompletion({ step: 5, userType: formData.userType || undefined, page: "lead-form" });
      } else {
        setStatus("error");
        setError(t<string>("leadForm.error.submit"));
      }
    } catch {
      setStatus("error");
      setError(t<string>("leadForm.error.submit"));
    }
  }, [turnstileToken, formData, formVariant, t]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setStep(1);
    setDirection(1);
    setStatus("idle");
    setError("");
    setTurnstileToken("");
    setTurnstileResetKey((prev) => prev + 1);
    setHasStartedTracking(false);
  }, []);

  // ---- i18n helpers ----
  const stepLabels = t<string[]>("leadForm.steps");
  const destinationOptions = t<{ label: string; value: string }[]>("leadForm.student.destinationOptions");
  const budgetOptions = t<{ label: string; value: string }[]>("leadForm.student.budgetOptions");
  const languageLevelOptions = t<{ label: string; value: string }[]>("leadForm.student.languageLevelOptions");
  const volumeOptions = t<{ label: string; value: string }[]>("leadForm.agent.volumeOptions");
  const timelineOptions = t<{ label: string; value: string }[]>("leadForm.qualify.timelineOptions");
  const readinessOptions = t<{ label: string; value: string }[]>("leadForm.qualify.readinessOptions");

  const fieldFocus = (name: string) => ({
    active: activeField === name,
    onFocus: () => setActiveField(name),
    onBlur: () => {
      setActiveField(null);
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
  });

  const fieldError = (name: string, value: string, opts?: { email?: boolean }) => {
    if (!touched[name]) return undefined;
    if (!value.trim()) return t<string>("leadForm.error.required");
    if (opts?.email && !isValidEmail(value)) return t<string>("leadForm.error.invalidEmail");
    return undefined;
  };

  const optionalLabel = t<string>("leadForm.optional");

  /* ---------------------------------------------------------------- */
  /*  Success State                                                    */
  /* ---------------------------------------------------------------- */

  if (status === "success") {
    return (
      <section dir={dir} className="relative py-20 px-6 overflow-hidden bg-bg-primary transition-colors duration-500">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -right-48 w-200 h-200 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[160px]" />
        </div>
        <m.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative max-w-lg mx-auto text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary">{t<string>("leadForm.success.title")}</h3>
          <p className="text-text-secondary">{t<string>("leadForm.success.description")}</p>
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gold-primary text-sm font-bold hover:shadow-lg transition-all"
          >
            {t<string>("leadForm.success.reset")}
          </button>
        </m.div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main Render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <section
      dir={dir}
      className="relative py-20 px-6 overflow-hidden bg-bg-primary transition-colors duration-500"
      aria-label={t<string>("leadForm.ariaLabel")}
      id="lead-form"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-200 h-200 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[160px]" />
        <div className="absolute -bottom-48 -left-48 w-175 h-175 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[140px]" />
      </div>

      <div className="relative max-w-2xl mx-auto z-10">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary-text text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {t<string>("leadForm.badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
            {t<string>("leadForm.title")}
          </h2>
          <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto">
            {t<string>("leadForm.subtitle")}
          </p>
        </m.div>

        {/* Form Card */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border/30 bg-bg-surface/80 backdrop-blur-sm shadow-xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-secondary">
                {t<string>("leadForm.stepOf")
                  .replace("{current}", String(step))
                  .replace("{total}", String(TOTAL_STEPS))}
              </span>
              <span className="text-xs font-semibold text-accent-primary-text">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <m.div
                className="h-full bg-linear-to-r from-accent-primary to-accent-primary-strong rounded-full"
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            {/* Step Labels */}
            <div className="flex justify-between mt-2">
              {Array.isArray(stepLabels) && stepLabels.map((label, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    i + 1 <= step ? "text-accent-primary-text" : "text-text-secondary/40"
                  } ${i > 0 && i < (stepLabels.length ?? 0) - 1 ? "hidden sm:inline" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>
            {/* Required fields legend */}
            <p className="mt-3 text-[11px] text-text-secondary/60">
              <span className="text-red-500 font-semibold" aria-hidden="true">*</span>{" "}
              {t<string>("leadForm.requiredLegend")}
            </p>
          </div>

          {/* Step Content */}
          <div ref={formContainerRef} className="px-6 pb-6 min-h-80 flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {/* ---- Step 1: Basic Info ---- */}
              {step === 1 && (
                <m.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 space-y-5"
                >
                  <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.step1.title")}</h3>
                  <FormInput
                    name="fullName"
                    label={t<string>("leadForm.step1.fullName")}
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    error={fieldError("fullName", formData.fullName)}
                    {...fieldFocus("fullName")}
                  />
                  <FormInput
                    name="email"
                    label={t<string>("leadForm.step1.email")}
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldError("email", formData.email, { email: true })}
                    {...fieldFocus("email")}
                  />
                  <FormInput
                    name="phone"
                    label={t<string>("leadForm.step1.phone")}
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    error={fieldError("phone", formData.phone)}
                    {...fieldFocus("phone")}
                  />
                </m.div>
              )}

              {/* ---- Step 2: User Type ---- */}
              {step === 2 && (
                <m.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 space-y-5"
                >
                  <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.step2.title")}</h3>
                  <p className="text-sm text-text-secondary">{t<string>("leadForm.step2.subtitle")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student card */}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, userType: "student" }));
                        setError("");
                        if (!hasStartedTracking) {
                          trackFormStart({ page: "lead-form", userType: "student" });
                          setHasStartedTracking(true);
                        }
                      }}
                      className={`group relative p-6 rounded-2xl border-2 text-start transition-all duration-200 ${
                        formData.userType === "student"
                          ? "border-accent-primary bg-accent-primary/5 shadow-md shadow-accent-primary/10"
                          : "border-border/30 hover:border-border hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                        formData.userType === "student" ? "bg-accent-primary/10" : "bg-bg-secondary"
                      }`}>
                        <GraduationCap className={`w-6 h-6 ${formData.userType === "student" ? "text-accent-primary-text" : "text-text-secondary"}`} />
                      </div>
                      <h4 className="text-base font-bold text-text-primary">{t<string>("leadForm.step2.student.title")}</h4>
                      <p className="mt-1 text-xs text-text-secondary">{t<string>("leadForm.step2.student.description")}</p>
                      {formData.userType === "student" && (
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute top-3 ${isRtl ? "left-3" : "right-3"}`}
                        >
                          <CheckCircle2 className="w-5 h-5 text-accent-primary-text" />
                        </m.div>
                      )}
                    </button>

                    {/* Agent card */}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, userType: "agent" }));
                        setError("");
                        if (!hasStartedTracking) {
                          trackFormStart({ page: "lead-form", userType: "agent" });
                          setHasStartedTracking(true);
                        }
                      }}
                      className={`group relative p-6 rounded-2xl border-2 text-start transition-all duration-200 ${
                        formData.userType === "agent"
                          ? "border-accent-primary bg-accent-primary/5 shadow-md shadow-accent-primary/10"
                          : "border-border/30 hover:border-border hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                        formData.userType === "agent" ? "bg-accent-primary/10" : "bg-bg-secondary"
                      }`}>
                        <Building2 className={`w-6 h-6 ${formData.userType === "agent" ? "text-accent-primary-text" : "text-text-secondary"}`} />
                      </div>
                      <h4 className="text-base font-bold text-text-primary">{t<string>("leadForm.step2.agent.title")}</h4>
                      <p className="mt-1 text-xs text-text-secondary">{t<string>("leadForm.step2.agent.description")}</p>
                      {formData.userType === "agent" && (
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute top-3 ${isRtl ? "left-3" : "right-3"}`}
                        >
                          <CheckCircle2 className="w-5 h-5 text-accent-primary-text" />
                        </m.div>
                      )}
                    </button>
                  </div>
                </m.div>
              )}

              {/* ---- Step 3: Conditional Details ---- */}
              {step === 3 && formData.userType === "student" && (
                <m.div
                  key="step3-student"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 space-y-5"
                >
                  <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.step3.student.title")}</h3>
                  <p className="text-sm text-accent-primary-text/80 font-medium">{t<string>("leadForm.motivation.step3")}</p>
                  <FormSelect
                    name="destination"
                    label={t<string>("leadForm.step3.student.destination")}
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    options={Array.isArray(destinationOptions) ? destinationOptions : []}
                    placeholder={t<string>("leadForm.step3.student.destinationPlaceholder")}
                    error={fieldError("destination", formData.destination)}
                    {...fieldFocus("destination")}
                  />
                  <FormInput
                    name="fieldOfStudy"
                    label={t<string>("leadForm.step3.student.fieldOfStudy")}
                    required
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    error={fieldError("fieldOfStudy", formData.fieldOfStudy)}
                    {...fieldFocus("fieldOfStudy")}
                  />
                  <FormSelect
                    name="budgetRange"
                    label={t<string>("leadForm.step3.student.budget")}
                    value={formData.budgetRange}
                    onChange={handleChange}
                    options={Array.isArray(budgetOptions) ? budgetOptions : []}
                    placeholder={t<string>("leadForm.step3.student.budgetPlaceholder")}
                    optionalLabel={optionalLabel}
                    {...fieldFocus("budgetRange")}
                  />
                  <FormSelect
                    name="languageLevel"
                    label={t<string>("leadForm.step3.student.language")}
                    value={formData.languageLevel}
                    onChange={handleChange}
                    options={Array.isArray(languageLevelOptions) ? languageLevelOptions : []}
                    placeholder={t<string>("leadForm.step3.student.languagePlaceholder")}
                    optionalLabel={optionalLabel}
                    {...fieldFocus("languageLevel")}
                  />
                </m.div>
              )}

              {step === 3 && formData.userType === "agent" && (
                <m.div
                  key="step3-agent"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 space-y-5"
                >
                  <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.step3.agent.title")}</h3>
                  <p className="text-sm text-accent-primary-text/80 font-medium">{t<string>("leadForm.motivation.step3")}</p>
                  <FormInput
                    name="agencyName"
                    label={t<string>("leadForm.step3.agent.agencyName")}
                    required
                    value={formData.agencyName}
                    onChange={handleChange}
                    error={fieldError("agencyName", formData.agencyName)}
                    {...fieldFocus("agencyName")}
                  />
                  <FormSelect
                    name="monthlyVolume"
                    label={t<string>("leadForm.step3.agent.monthlyVolume")}
                    required
                    value={formData.monthlyVolume}
                    onChange={handleChange}
                    options={Array.isArray(volumeOptions) ? volumeOptions : []}
                    placeholder={t<string>("leadForm.step3.agent.volumePlaceholder")}
                    error={fieldError("monthlyVolume", formData.monthlyVolume)}
                    {...fieldFocus("monthlyVolume")}
                  />
                  <FormInput
                    name="targetDestinations"
                    label={t<string>("leadForm.step3.agent.targetDestinations")}
                    required
                    value={formData.targetDestinations}
                    onChange={handleChange}
                    error={fieldError("targetDestinations", formData.targetDestinations)}
                    {...fieldFocus("targetDestinations")}
                  />
                  <FormInput
                    name="existingPartnerships"
                    label={t<string>("leadForm.step3.agent.existingPartnerships")}
                    value={formData.existingPartnerships}
                    onChange={handleChange}
                    optionalLabel={optionalLabel}
                    {...fieldFocus("existingPartnerships")}
                  />
                </m.div>
              )}

              {/* ---- Step 4: Qualification ---- */}
              {step === 4 && (
                <m.div
                  key="step4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 space-y-5"
                >
                  <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.step4.title")}</h3>
                  <p className="text-sm text-accent-primary-text/80 font-medium">{t<string>("leadForm.motivation.step4")}</p>

                  {/* Variant B: readiness first, then timeline */}
                  {isFormB && (
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        {t<string>("leadForm.step4.readiness")}
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Array.isArray(readinessOptions) && readinessOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setFormData((prev) => ({ ...prev, readiness: opt.value })); setError(""); }}
                            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center ${
                              formData.readiness === opt.value
                                ? "border-accent-primary bg-accent-primary/5 text-accent-primary-text shadow-sm"
                                : "border-border/30 text-text-secondary hover:border-border"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t<string>("leadForm.step4.timeline")}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.isArray(timelineOptions) && timelineOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setFormData((prev) => ({ ...prev, timeline: opt.value })); setError(""); }}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-start ${
                            formData.timeline === opt.value
                              ? "border-accent-primary bg-accent-primary/5 text-accent-primary-text shadow-sm"
                              : "border-border/30 text-text-secondary hover:border-border"
                          }`}
                        >
                          <Clock className="w-4 h-4 shrink-0" />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Variant A (default): readiness after timeline */}
                  {!isFormB && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {t<string>("leadForm.step4.readiness")}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Array.isArray(readinessOptions) && readinessOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setFormData((prev) => ({ ...prev, readiness: opt.value })); setError(""); }}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center ${
                            formData.readiness === opt.value
                              ? "border-accent-primary bg-accent-primary/5 text-accent-primary-text shadow-sm"
                              : "border-border/30 text-text-secondary hover:border-border"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  )}
                </m.div>
              )}

              {/* ---- Step 5: Conversion ---- */}
              {step === 5 && (
                <m.div
                  key="step5"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 space-y-6"
                >
                  <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.step5.title")}</h3>
                  <p className="text-sm text-accent-primary-text/80 font-medium">{t<string>("leadForm.motivation.step5")}</p>
                  <p className="text-sm text-text-secondary">{t<string>("leadForm.step5.subtitle")}</p>

                  {/* Summary */}
                  <div className="rounded-xl bg-bg-secondary/60 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-text-secondary" />
                      <span className="font-medium text-text-primary">{formData.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-text-secondary" />
                      <span className="text-text-secondary">{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {formData.userType === "student" ? (
                        <GraduationCap className="w-4 h-4 text-accent-primary-text" />
                      ) : (
                        <Building2 className="w-4 h-4 text-accent-primary-text" />
                      )}
                      <span className="text-accent-primary-text font-medium">
                        {formData.userType === "student"
                          ? t<string>("leadForm.step2.student.title")
                          : t<string>("leadForm.step2.agent.title")}
                      </span>
                    </div>
                  </div>

                  {/* Turnstile */}
                  {turnstileSiteKey ? (
                    <TurnstileWidget
                      siteKey={turnstileSiteKey}
                      onTokenChange={setTurnstileToken}
                      resetKey={String(turnstileResetKey)}
                    />
                  ) : (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      {t<string>("leadForm.error.turnstileNotConfigured")} <code>VITE_TURNSTILE_SITE_KEY</code>.
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="button"
                    disabled={status === "submitting" || !turnstileToken}
                    onClick={handleSubmit}
                    className="group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong text-white text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{t<string>("leadForm.step5.submit")}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* WhatsApp alternative */}
                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/30" />
                    </div>
                    <span className="relative bg-bg-surface px-4 text-xs text-text-secondary font-medium">
                      {t<string>("leadForm.step5.or")}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t<string>("leadForm.step5.whatsappMessage").replace("{name}", formData.fullName))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTA({ type: "primary", context: formData.userType || "student", intentLevel: "high", variant: "inline" })}
                    className="group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#25D366]/10 text-[#25D366] text-sm font-bold hover:bg-[#25D366]/20 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{t<string>("leadForm.step5.whatsapp")}</span>
                  </a>
                </m.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <m.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-red-500 font-medium"
                role="alert"
              >
                {error}
              </m.p>
            )}

            {/* Navigation */}
            {step < 5 && (
              <div className={`flex items-center mt-8 ${step > 1 ? "justify-between" : "justify-end"}`}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-all ${isRtl ? "flex-row-reverse" : ""}`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t<string>("leadForm.nav.back")}
                  </button>
                )}
                <button
                  type="button"
                  aria-disabled={!isStepValid}
                  onClick={goNext}
                  className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary ${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <span>{t<string>("leadForm.nav.next")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </m.div>

        {/* Exit Intent Overlay */}
        <AnimatePresence>
          {showExitIntent && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            >
              <m.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-sm w-full rounded-2xl bg-bg-surface p-6 shadow-2xl space-y-4 text-center"
              >
                <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto" />
                <h3 className="text-lg font-bold text-text-primary">{t<string>("leadForm.exitIntent.title")}</h3>
                <p className="text-sm text-text-secondary">{t<string>("leadForm.exitIntent.description")}</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t<string>("leadForm.step5.whatsappMessage").replace("{name}", formData.fullName || ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA({ type: "primary", context: formData.userType || "student", intentLevel: "high", variant: "exit-intent" })}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#20BD5A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t<string>("leadForm.exitIntent.whatsapp")}
                </a>
                <button
                  type="button"
                  onClick={() => setShowExitIntent(false)}
                  className="w-full px-6 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                >
                  {t<string>("leadForm.exitIntent.dismiss")}
                </button>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
