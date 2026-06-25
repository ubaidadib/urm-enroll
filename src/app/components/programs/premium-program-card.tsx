import { useState } from "react";
import { m } from "motion/react";
import { ArrowUpRight, Bookmark, BriefcaseBusiness, Coins, Sparkles, Timer, Trophy } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

interface PremiumProgramCardProps {
  id: string;
  name: string;
  university: string;
  country: string;
  degreeLevel: string;
  field: string;
  duration: string;
  language: string;
  tuitionPerYear: number;
  tuitionCurrency: string;
  coverPhoto?: string;
  aiMatch: number;
  salaryRange: string;
  employabilityScore: number;
  visaFriendly: boolean;
  scholarshipsAvailable: boolean;
  trending: boolean;
  onOpen: () => void;
}

function formatTuition(value: number, currency: string) {
  if (value <= 0) return "—";
  const normalized = currency || "EUR";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalized,
    maximumFractionDigits: 0,
  }).format(value);
}

// Generate realistic gradient backgrounds based on field
const fieldGradients: Record<string, string> = {
  "computer-science": "from-blue-600 via-blue-500 to-cyan-500",
  engineering: "from-orange-600 via-orange-500 to-yellow-500",
  medicine: "from-red-600 via-pink-500 to-red-400",
  business: "from-green-600 via-emerald-500 to-teal-500",
  design: "from-rose-600 via-pink-500 to-rose-400",
  "data-science": "from-indigo-600 via-blue-500 to-cyan-400",
  law: "from-slate-700 via-slate-600 to-blue-600",
  arts: "from-amber-600 via-orange-500 to-yellow-500",
};

export function PremiumProgramCard({
  name,
  university,
  country,
  degreeLevel,
  field,
  duration,
  language,
  tuitionPerYear,
  tuitionCurrency,
  coverPhoto,
  aiMatch,
  salaryRange,
  employabilityScore,
  visaFriendly,
  scholarshipsAvailable,
  trending,
  onOpen,
}: PremiumProgramCardProps) {
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [compared, setCompared] = useState(false);

  // Fallback gradient if coverPhoto is not available
  const defaultGradient = fieldGradients[field.toLowerCase()] || "from-blue-600 via-blue-500 to-cyan-500";
  const bgGradient = coverPhoto ? "" : `bg-gradient-to-br ${defaultGradient}`;

  return (
    <m.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-border/70 bg-white dark:bg-bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_40px_rgba(15,23,42,0.14)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_24px_56px_rgba(15,23,42,0.2)] transition-shadow duration-300"
    >
      {/* Hover glow effect */}
      <div className="pointer-events-none absolute -inset-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute left-[12%] top-[20%] h-44 w-44 rounded-full bg-brand-steel-400/15 dark:bg-brand-steel-400/25 blur-3xl" />
        <div className="absolute right-[10%] top-[28%] h-44 w-44 rounded-full bg-brand-gold-400/15 dark:bg-brand-gold-400/25 blur-3xl" />
      </div>

      {/* Image section with overlay */}
      <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={`${name} cover`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${defaultGradient} transition-transform duration-500 group-hover:scale-110`} />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badges container */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <div className="rounded-full border border-white/30 bg-black/40 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white line-clamp-1">
            {university}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="rounded-full bg-gradient-to-r from-brand-steel-400 to-brand-steel-500 px-3 py-1 text-[11px] font-black text-white shadow-lg">
              {aiMatch}% Match
            </div>
            {trending ? (
              <div className="rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 px-3 py-1 text-[11px] font-black text-brand-navy-950 shadow-lg">
                🔥 Trending
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">{t<string>("card.program.salaryTrajectory")}</p>
            <p className="text-base font-bold text-white">{salaryRange}</p>
          </div>
          <div className="rounded-lg border border-white/30 bg-white/15 backdrop-blur-md px-2.5 py-1.5 text-xs font-semibold text-white">
            📍 {country}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="relative p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-black leading-tight text-gray-900 dark:text-text-primary">
          {name}
        </h3>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full border border-gray-300 dark:border-border bg-gray-100 dark:bg-bg-secondary/60 px-2.5 py-1 text-gray-700 dark:text-text-secondary capitalize">
            {degreeLevel}
          </span>
          <span className="rounded-full border border-gray-300 dark:border-border bg-gray-100 dark:bg-bg-secondary/60 px-2.5 py-1 text-gray-700 dark:text-text-secondary capitalize line-clamp-1">
            {field.replace("-", " ")}
          </span>
          <span className="rounded-full border border-gray-300 dark:border-border bg-gray-100 dark:bg-bg-secondary/60 px-2.5 py-1 text-gray-700 dark:text-text-secondary">
            {language}
          </span>
        </div>

        {/* Key metrics grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-lg border border-gray-200 dark:border-border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-bg-secondary/60 dark:to-bg-secondary/40 p-3">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-gray-600 dark:text-text-muted font-medium">
              <Coins className="h-3.5 w-3.5" />
              Tuition
            </p>
            <p className="font-bold text-gray-900 dark:text-text-primary text-sm">
              {formatTuition(tuitionPerYear, tuitionCurrency)}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-bg-secondary/60 dark:to-bg-secondary/40 p-3">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-gray-600 dark:text-text-muted font-medium">
              <Timer className="h-3.5 w-3.5" />
              Duration
            </p>
            <p className="font-bold text-gray-900 dark:text-text-primary text-sm">{duration}</p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-bg-secondary/60 dark:to-bg-secondary/40 p-3">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-gray-600 dark:text-text-muted font-medium">
              <Trophy className="h-3.5 w-3.5" />
              Employability
            </p>
            <p className="font-bold text-gray-900 dark:text-text-primary text-sm">{employabilityScore}/100</p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-bg-secondary/60 dark:to-bg-secondary/40 p-3">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-gray-600 dark:text-text-muted font-medium">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Support
            </p>
            <p className="font-bold text-gray-900 dark:text-text-primary text-sm">
              {visaFriendly ? "✓ Visa" : "Standard"}
              {scholarshipsAvailable ? " + 🎓" : ""}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSaved((current) => !current)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
              saved
                ? "border-brand-gold-400 bg-brand-gold-100 text-brand-navy-900 dark:bg-brand-gold-100/20 dark:border-brand-gold-400 dark:text-brand-gold-400"
                : "border-gray-300 dark:border-border text-gray-700 dark:text-text-secondary hover:border-brand-gold-300 dark:hover:border-brand-gold-400/50"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </button>

          <button
            type="button"
            onClick={() => setCompared((current) => !current)}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
              compared
                ? "border-brand-steel-400 bg-brand-steel-100 text-brand-navy-900 dark:bg-brand-steel-100/20 dark:border-brand-steel-400 dark:text-brand-steel-400"
                : "border-gray-300 dark:border-border text-gray-700 dark:text-text-secondary hover:border-brand-steel-300 dark:hover:border-brand-steel-400/50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Compare
          </button>

          <button
            type="button"
            onClick={onOpen}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-brand-navy-900 to-brand-navy-800 dark:from-text-primary dark:to-brand-gold-600 px-4 text-xs font-bold text-white dark:text-bg-surface transition-all hover:shadow-lg active:scale-95"
          >
            Preview
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </m.article>
  );
}
