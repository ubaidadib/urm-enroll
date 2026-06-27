import { useState, useMemo, useEffect, forwardRef } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  BookOpen,
  Globe,
  Star,
  ArrowRight,
  Clock,
  Banknote,
  Search,
  HeartPulse,
  Languages,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";
import type { ProgramType, Program } from "@/lib/programs";
import {
  getProgramsByCountryAndType,
  getCountriesForType,
} from "@/lib/programs";
import { getCountryMeta } from "@/data/destinations";

/* ── Country metadata (derived from shared data) ── */
const COUNTRY_META = getCountryMeta();

/* ── Program type options ── */
const PROGRAM_TYPES: { type: ProgramType; icon: typeof GraduationCap; color: string }[] = [
  { type: "bachelor", icon: GraduationCap, color: "#3b82f6" },
  { type: "master", icon: BookOpen, color: "#a855f7" },
  { type: "nursing", icon: HeartPulse, color: "#10b981" },
  { type: "language", icon: Languages, color: "#f59e0b" },
];

const TYPE_ICONS: Record<ProgramType, typeof GraduationCap> = {
  bachelor: GraduationCap,
  master: BookOpen,
  nursing: HeartPulse,
  language: Languages,
};

export function FindYourProgram() {
  const { t, language: lang, dir } = useLanguage();
  const tx = (key: string, fb: string) => {
    const val = t<string>(key);
    return val === key ? fb : val;
  };

  const location = useLocation();
  const [selectedType, setSelectedType] = useState<ProgramType | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  /* Countries available for the selected program type */
  const availableCountries = useMemo(
    () => (selectedType ? getCountriesForType(selectedType) : []),
    [selectedType],
  );

  /* Pre-select program type from ?type= query param */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") as ProgramType | null;
    if (typeParam && PROGRAM_TYPES.some((p) => p.type === typeParam)) {
      setSelectedType(typeParam);
    }
  }, [location.search]);

  /* Pre-select country from ?country= query param */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const countryParam = params.get("country");
    if (countryParam && availableCountries.includes(countryParam)) {
      setSelectedCountry(countryParam);
    }
  }, [location.search, availableCountries]);

  /* Scroll into view when targeted by hash */
  useEffect(() => {
    if (location.hash === "#find-your-program") {
      const el = document.getElementById("find-your-program");
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }, [location.hash]);

  /* Programs filtered by type + country */
  const programs = useMemo(() => {
    if (!selectedCountry || !selectedType) return [];
    return getProgramsByCountryAndType(selectedCountry, selectedType);
  }, [selectedCountry, selectedType]);

  const getLocalizedText = (obj: { en: string; ar: string; de: string }) =>
    obj[lang as keyof typeof obj] || obj.en;

  const countryMeta = selectedCountry ? COUNTRY_META[selectedCountry] : null;

  /* Current step */
  const currentStep = !selectedType ? 1 : !selectedCountry ? 2 : 3;

  /* Reset handlers */
  const handleTypeSelect = (type: ProgramType) => {
    if (selectedType === type) {
      setSelectedType(null);
      setSelectedCountry(null);
    } else {
      setSelectedType(type);
      setSelectedCountry(null);
    }
  };

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(selectedCountry === code ? null : code);
  };

  return (
    <section
      dir={dir}
      id="find-your-program"
      className="relative py-24 bg-bg-primary overflow-hidden transition-colors duration-500"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-1/4 w-150 h-150 rounded-full bg-accent-primary/5 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-125 h-125 rounded-full bg-accent-tech/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-3 sm:px-6 3xl:px-8">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 mb-6">
            <Search className="w-3.5 h-3.5 text-accent-primary-text" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-accent-primary-text">
              {tx("findProgram.badge", "Find Your Study Program")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-3">
            {tx("findProgram.title", "What Do You Want to Become?")}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {tx("findProgram.subtitle", "Choose your program type, pick a country, and discover your perfect study path.")}
          </p>


        </m.div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                  ${currentStep >= step
                    ? "bg-accent-primary text-white shadow-md shadow-accent-primary/25"
                    : "bg-surface-glass/10 text-text-muted border border-border/30"
                  }
                `}
              >
                {step}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline transition-colors duration-300 ${
                  currentStep >= step ? "text-accent-primary-text" : "text-text-muted"
                }`}
              >
                {step === 1
                  ? tx("findProgram.step1Label", "Program")
                  : step === 2
                  ? tx("findProgram.step2Label", "Country")
                  : tx("findProgram.step3Label", "Results")}
              </span>
              {step < 3 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 rounded-full transition-colors duration-300 ${
                    currentStep > step ? "bg-accent-primary" : "bg-border/30"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Program Type ── */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/15 text-accent-primary-text text-[10px] font-bold">
              1
            </span>
            {tx("findProgram.step1", "What do you want to study?")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROGRAM_TYPES.map(({ type, icon: Icon, color }) => {
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`
                    group relative flex flex-col items-center gap-3 p-5 rounded-2xl text-sm font-medium
                    transition-all duration-200 border cursor-pointer
                    ${isActive
                      ? "border-accent-primary/40 bg-accent-primary/10 shadow-sm"
                      : "border-border/30 bg-surface-glass/5 hover:border-border/60 hover:bg-surface-glass/10"
                    }
                  `}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <span className={isActive ? "text-accent-primary-text font-semibold" : "text-text-secondary"}>
                    {tx(`findProgram.types.${type}`, type.charAt(0).toUpperCase() + type.slice(1))}
                  </span>
                </button>
              );
            })}
          </div>
        </m.div>

        {/* ── Step 2: Country Selection (dynamic) ── */}
        <AnimatePresence mode="wait">
          {selectedType && (
            <m.div
              key={`countries-${selectedType}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-tech/15 text-accent-tech text-[10px] font-bold">
                  2
                </span>
                {tx("findProgram.step2", "Where do you want to study?")}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableCountries.map((code) => {
                  const meta = COUNTRY_META[code];
                  if (!meta) return null;
                  const isActive = selectedCountry === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleCountrySelect(code)}
                      className={`
                        group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200 border
                        ${isActive
                          ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary-text shadow-sm"
                          : "bg-surface-glass/5 border-border/30 text-text-secondary hover:border-border/60 hover:bg-surface-glass/10"
                        }
                      `}
                    >
                      <span className="text-base">{meta.flag}</span>
                      <span>{meta.name}</span>
                    </button>
                  );
                })}
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* ── Step 3: Program Results ── */}
        <AnimatePresence mode="wait">
          {selectedCountry && countryMeta && programs.length > 0 && (
            <m.div
              key={`programs-${selectedCountry}-${selectedType}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-primary/15 text-accent-primary-text text-[10px] font-bold">
                  3
                </span>
                {tx("findProgram.step3", "Available Programs")}
                <span className="ml-1 text-text-muted font-normal normal-case tracking-normal">
                  ({programs.length})
                </span>
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <AnimatePresence mode="popLayout">
                  {programs.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      accent={countryMeta.accent}
                      lang={lang}
                      getLocalizedText={getLocalizedText}
                      tx={tx}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Step 4: CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                <Link
                  to={`/destinations?country=${selectedCountry}${selectedType ? `&type=${selectedType}` : ""}`}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-linear-to-r from-accent-primary to-accent-primary-strong text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-accent-primary/25 transition-all duration-300"
                >
                  <span>{tx("findProgram.ctaUniversities", "View Universities")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-text-secondary hover:text-accent-primary-text transition-colors"
                >
                  <span>{tx("findProgram.ctaApply", "Apply Now")}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Empty state for step 3 (country selected but no programs) */}
        {selectedCountry && programs.length === 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-sm text-text-muted">
              {tx("findProgram.noResults", "No programs found for the selected filters.")}
            </p>
          </m.div>
        )}

        {/* Hint when nothing selected */}
        {!selectedType && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-sm text-text-muted">
              {tx("findProgram.hint", "Select a program type above to begin your journey")}
            </p>
          </m.div>
        )}
      </div>
    </section>
  );
}

/* ── Program Card (carried over from program-explorer) ── */
const ProgramCard = forwardRef<
  HTMLDivElement,
  {
    program: Program;
    accent: string;
    lang: string;
    getLocalizedText: (obj: { en: string; ar: string; de: string }) => string;
    tx: (key: string, fb: string) => string;
  }
>(function ProgramCard({ program, accent, lang, getLocalizedText, tx }, ref) {
  const Icon = TYPE_ICONS[program.type];
  return (
    <m.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative overflow-hidden p-5 rounded-2xl border border-border/55 bg-background-surface/82 backdrop-blur-xl hover:border-accent-tech/45 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(8,26,57,0.24)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -right-8 top-8 w-24 h-24 rounded-full bg-accent-primary/16 blur-2xl" />
        <div className="absolute -left-8 bottom-6 w-24 h-24 rounded-full bg-accent-tech/16 blur-2xl" />
      </div>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <Icon className="w-3 h-3" />
          {tx(`findProgram.types.${program.type}`, program.type)}
        </div>
        {program.featured && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-bold uppercase">
              {tx("findProgram.featured", "Featured")}
            </span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-semibold text-text-primary mb-1.5 leading-snug">
        {getLocalizedText(program.title)}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">
        {getLocalizedText(program.description)}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3 text-text-muted" />
          {program.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <Banknote className="w-3 h-3 text-text-muted" />
          {program.tuition.amount} {program.tuition.currency}/{program.tuition.period}
        </span>
        <span className="inline-flex items-center gap-1">
          <Globe className="w-3 h-3 text-text-muted" />
          {program.language.join(", ")}
        </span>
      </div>
    </m.div>
  );
});
