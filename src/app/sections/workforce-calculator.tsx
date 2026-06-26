import { useState, useMemo } from "react";
import { m } from "motion/react";
import { useLanguage } from "@/i18n/language-context";
import {
  Calculator,
  TrendingUp,
  Clock,
  Euro,
  GraduationCap,
  Languages,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Static Config ──────────────────────────────────────────────────────── */

type LangKey = "en" | "ar" | "de";

interface LanguageOption {
  id: "A2" | "B1" | "B2";
  label: { en: string; ar: string; de: string };
  months: number;
  cost: number;
}

interface ExperienceOption {
  id: "0-2" | "3-5" | "5+";
  label: { en: string; ar: string; de: string };
  salaryBonus: number;
  timeReduction: number;
}

interface SpecialtyOption {
  id: "general" | "icu" | "geriatric" | "surgical";
  label: { en: string; ar: string; de: string };
  demandMultiplier: number;
  salaryBase: number;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "A2", label: { en: "Starting at A2", ar: "البداية من A2", de: "Start ab A2" }, months: 10, cost: 4500 },
  { id: "B1", label: { en: "Starting at B1", ar: "البداية من B1", de: "Start ab B1" }, months: 6, cost: 2800 },
  { id: "B2", label: { en: "Already B2", ar: "بالفعل B2", de: "Bereits B2" }, months: 0, cost: 0 },
];

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  { id: "0-2", label: { en: "0–2 years", ar: "٠–٢ سنوات", de: "0–2 Jahre" }, salaryBonus: 0, timeReduction: 0 },
  { id: "3-5", label: { en: "3–5 years", ar: "٣–٥ سنوات", de: "3–5 Jahre" }, salaryBonus: 4000, timeReduction: 1 },
  { id: "5+", label: { en: "5+ years", ar: "+٥ سنوات", de: "5+ Jahre" }, salaryBonus: 8000, timeReduction: 2 },
];

const SPECIALTY_OPTIONS: SpecialtyOption[] = [
  { id: "general", label: { en: "General Nursing", ar: "تمريض عام", de: "Allgemeine Pflege" }, demandMultiplier: 1.0, salaryBase: 38000 },
  { id: "icu", label: { en: "Intensive Care (ICU)", ar: "العناية المركزة", de: "Intensivpflege (ICU)" }, demandMultiplier: 1.35, salaryBase: 45000 },
  { id: "geriatric", label: { en: "Geriatric Care", ar: "رعاية المسنين", de: "Altenpflege" }, demandMultiplier: 1.5, salaryBase: 40000 },
  { id: "surgical", label: { en: "Surgical Nursing", ar: "تمريض جراحي", de: "OP-Pflege" }, demandMultiplier: 1.2, salaryBase: 43000 },
];

const BASE_RECOGNITION_MONTHS = 10;
const BASE_VISA_MONTHS = 2;
const PROGRAM_FEE = 3500;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatEuro(value: number): string {
  return `€${value.toLocaleString("de-DE")}`;
}

/* ─── Selector Button ────────────────────────────────────────────────────── */

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
        active
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-sm"
          : "border-border/50 text-text-secondary hover:border-border"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Result Card ────────────────────────────────────────────────────────── */

function ResultCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Euro;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-5 rounded-2xl surface-card overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl -translate-y-6 translate-x-6"
        style={{ backgroundColor: accent }}
      />
      <Icon className="w-4 h-4 mb-3" style={{ color: accent }} />
      <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">
        {label}
      </div>
      <div className="text-2xl font-black text-text-primary leading-tight">
        {value}
      </div>
      <div className="text-xs text-text-muted mt-1">{sub}</div>
    </m.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export function WorkforceCalculator() {
  const { t, language, dir } = useLanguage();
  const lang = (language as LangKey) || "en";
  const isRtl = dir === "rtl";

  const [langLevel, setLangLevel] = useState<"A2" | "B1" | "B2">("A2");
  const [experience, setExperience] = useState<"0-2" | "3-5" | "5+">("0-2");
  const [specialty, setSpecialty] = useState<"general" | "icu" | "geriatric" | "surgical">("general");

  const results = useMemo(() => {
    const langOpt = LANGUAGE_OPTIONS.find((o) => o.id === langLevel) ?? LANGUAGE_OPTIONS[0]!;
    const expOpt = EXPERIENCE_OPTIONS.find((o) => o.id === experience) ?? EXPERIENCE_OPTIONS[0]!;
    const specOpt = SPECIALTY_OPTIONS.find((o) => o.id === specialty) ?? SPECIALTY_OPTIONS[0]!;

    const languageMonths = langOpt.months;
    const recognitionMonths = Math.max(6, BASE_RECOGNITION_MONTHS - expOpt.timeReduction);
    const visaMonths = BASE_VISA_MONTHS;
    const totalMonths = languageMonths + recognitionMonths + visaMonths;

    const annualSalary = specOpt.salaryBase + expOpt.salaryBonus;
    const monthlySalary = Math.round(annualSalary / 12);

    const totalInvestment = langOpt.cost + PROGRAM_FEE;
    const firstYearNet = annualSalary - totalInvestment;
    const fiveYearEarnings = annualSalary * 5 - totalInvestment;

    const demandScore = Math.round(specOpt.demandMultiplier * 100);

    return {
      totalMonths,
      languageMonths,
      recognitionMonths,
      visaMonths,
      annualSalary,
      monthlySalary,
      totalInvestment,
      firstYearNet,
      fiveYearEarnings,
      demandScore,
    };
  }, [langLevel, experience, specialty]);

  return (
    <section
      id="eligibility"
      className="py-28 bg-bg-primary relative overflow-hidden transition-colors duration-500"
      aria-labelledby="calculator-heading"
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-emerald-400/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-blue-400/4 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 ${isRtl ? "rtl-text" : ""}`}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border/50 rounded-full mb-6"
          >
            <Calculator className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              {t<string>("workforceCalculator.badge")}
            </span>
          </m.div>

          <m.h2
            id="calculator-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-text-primary mb-6 tracking-tight"
          >
            {t<string>("workforceCalculator.title")}
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            {t<string>("workforceCalculator.description")}
          </m.p>
        </div>

        {/* Calculator Body */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid lg:grid-cols-12 gap-8"
        >
          {/* ── INPUT PANEL ── */}
          <div className="lg:col-span-5 space-y-8 p-8 rounded-3xl bg-bg-secondary/60 border border-border/50">
            {/* Language Level */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted mb-4">
                <Languages className="w-3.5 h-3.5" />
                {t<string>("workforceCalculator.inputs.language")}
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <OptionButton
                    key={opt.id}
                    active={langLevel === opt.id}
                    onClick={() => setLangLevel(opt.id)}
                  >
                    {opt.label[lang]}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                {t<string>("workforceCalculator.inputs.experience")}
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <OptionButton
                    key={opt.id}
                    active={experience === opt.id}
                    onClick={() => setExperience(opt.id)}
                  >
                    {opt.label[lang]}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                {t<string>("workforceCalculator.inputs.specialty")}
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTY_OPTIONS.map((opt) => (
                  <OptionButton
                    key={opt.id}
                    active={specialty === opt.id}
                    onClick={() => setSpecialty(opt.id)}
                  >
                    {opt.label[lang]}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                {t<string>("workforceCalculator.disclaimer")}
              </p>
            </div>
          </div>

          {/* ── RESULTS PANEL ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard
                icon={Euro}
                label={t<string>("workforceCalculator.results.annualSalary")}
                value={formatEuro(results.annualSalary)}
                sub={`${formatEuro(results.monthlySalary)} / ${t<string>("workforceCalculator.results.perMonth")}`}
                accent="#10b981"
              />
              <ResultCard
                icon={Clock}
                label={t<string>("workforceCalculator.results.totalTimeline")}
                value={`${results.totalMonths} ${t<string>("workforceCalculator.results.months")}`}
                sub={t<string>("workforceCalculator.results.toFirstDay")}
                accent="#3b82f6"
              />
              <ResultCard
                icon={TrendingUp}
                label={t<string>("workforceCalculator.results.fiveYearNet")}
                value={formatEuro(results.fiveYearEarnings)}
                sub={t<string>("workforceCalculator.results.afterInvestment")}
                accent="#4F6B8A"
              />
              <ResultCard
                icon={Briefcase}
                label={t<string>("workforceCalculator.results.demandIndex")}
                value={`${results.demandScore}%`}
                sub={t<string>("workforceCalculator.results.marketDemand")}
                accent="#f59e0b"
              />
            </div>

            {/* Timeline Breakdown */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl surface-card shadow-sm"
            >
              <h4 className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-5">
                {t<string>("workforceCalculator.timeline.title")}
              </h4>

              <div className="space-y-3">
                {[
                  {
                    label: t<string>("workforceCalculator.timeline.language"),
                    months: results.languageMonths,
                    color: "#f59e0b",
                    pct: results.languageMonths / results.totalMonths,
                  },
                  {
                    label: t<string>("workforceCalculator.timeline.recognition"),
                    months: results.recognitionMonths,
                    color: "#3b82f6",
                    pct: results.recognitionMonths / results.totalMonths,
                  },
                  {
                    label: t<string>("workforceCalculator.timeline.visa"),
                    months: results.visaMonths,
                    color: "#10b981",
                    pct: results.visaMonths / results.totalMonths,
                  },
                ].map((phase) => (
                  <div key={phase.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-text-primary">
                        {phase.label}
                      </span>
                      <span className="text-xs font-bold text-text-muted tabular-nums">
                        {phase.months} {t<string>("workforceCalculator.results.months")}
                      </span>
                    </div>
                    <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                      <m.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: phase.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${phase.pct * 100}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Investment breakdown */}
              <div className="mt-6 pt-5 border-t border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold text-text-primary">
                    {t<string>("workforceCalculator.results.totalInvestment")}
                  </span>
                </div>
                <span className="text-lg font-black text-text-primary tabular-nums">
                  {formatEuro(results.totalInvestment)}
                </span>
              </div>
            </m.div>

            {/* CTA */}
            <Link
              to="/contact?topic=nursing&action=application&destination=Germany#contact-form"
              className={`group flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl btn-gold-primary text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <span>{t<string>("workforceCalculator.cta")}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
