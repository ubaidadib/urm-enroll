import {
  Heart,
  ArrowRight,
  Clock3,
  Globe2,
  CalendarDays,
  MapPin,
  Building2,
  Cpu,
  Wrench,
  HeartPulse,
  Briefcase,
  Palette,
  FlaskConical,
  Scale,
  GraduationCap,
  Check,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useComparison } from "@/app/context/comparison-context";
import { useFavorites } from "@/app/context/favorites-context";
import { useLanguage } from "@/i18n/language-context";

type CardSize = "default" | "compact";

type ProgramCardModernProps = {
  id?: string;
  universityId?: string;
  name: string;
  university: string;
  universityLogo?: string;
  degreeLevel: string;
  field: string;
  duration: string;
  language: string;
  tuitionPerYear: number;
  tuitionCurrency?: string;
  coverPhoto?: string;
  description?: string;
  requirements?: string[];
  showCompare?: boolean;
  size?: CardSize;
  variant?: "default" | "compact" | "list" | "catalog";
  pathname?: string;
  locationLabel?: string | null;
  intakeLabel?: string | null;
  levelName?: string | null;
  feesLabel?: string | null;
  hasSale?: boolean;
  salePercentage?: number | null;
  isSeasonal?: boolean;
  onClick?: () => void;
  onApply?: () => void;
};

type UniversityCardModernProps = {
  id?: string;
  countryCode?: string;
  name: string;
  country: string;
  city: string;
  programsCount: number;
  logo?: string;
  coverPhoto?: string;
  ranking?: number;
  type?: string;
  languages?: string[];
  established?: number;
  description?: string;
  website?: string;
  size?: CardSize;
  variant?: "default" | "compact" | "list" | "featured";
  onClick?: () => void;
  onViewDetails?: () => void;
};

const FIELD_STYLES = {
  engineering: { wrapper: "from-sky-600 via-cyan-500 to-blue-500", icon: Wrench },
  medicine: { wrapper: "from-emerald-600 via-teal-500 to-cyan-500", icon: HeartPulse },
  business: { wrapper: "from-amber-500 via-orange-500 to-yellow-500", icon: Briefcase },
  arts: { wrapper: "from-rose-600 via-pink-500 to-rose-400", icon: Palette },
  science: { wrapper: "from-cyan-600 via-blue-500 to-indigo-500", icon: FlaskConical },
  law: { wrapper: "from-slate-700 via-slate-600 to-indigo-600", icon: Scale },
  "computer-science": { wrapper: "from-indigo-600 via-sky-500 to-cyan-500", icon: Cpu },
  default: { wrapper: "from-accent-primary via-accent-tech to-accent-primary", icon: GraduationCap },
} as const;

const DEGREE_BADGES = {
  bachelor: "bg-sky-500/20 text-sky-300 border-sky-400/35",
  master: "bg-emerald-500/20 text-emerald-300 border-emerald-400/35",
  phd: "bg-accent-tech/20 text-accent-tech border-accent-tech/35",
  certificate: "bg-amber-500/20 text-amber-300 border-amber-400/35",
} as const;

const UNIVERSITY_TYPE_BADGES = {
  public: "bg-accent-tech/12 text-accent-tech border-accent-tech/35",
  private: "bg-accent-primary/12 text-accent-primary border-accent-primary/35",
  international: "bg-accent-tech/12 text-accent-tech border-accent-tech/35",
} as const;

const COUNTRY_FLAGS: Record<string, string> = {
  Germany: "🇩🇪",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  France: "🇫🇷",
  Malta: "🇲🇹",
  Cyprus: "🇨🇾",
  Canada: "🇨🇦",
  "United States": "🇺🇸",
  Turkey: "🇹🇷",
  Georgia: "🇬🇪",
  Hungary: "🇭🇺",
  Latvia: "🇱🇻",
  Netherlands: "🇳🇱",
  Switzerland: "🇨🇭",
  Austria: "🇦🇹",
  Denmark: "🇩🇰",
  Sweden: "🇸🇪",
  Finland: "🇫🇮",
  Belgium: "🇧🇪",
};

function formatProgramsLabel(template: string, count: number) {
  return template.replace("{{count}}", String(count));
}

function toCardSize(size?: CardSize, variant?: "default" | "compact" | "list" | "featured" | "catalog") {
  if (size) return size;
  if (variant === "compact") return "compact";
  return "default";
}

function normalizeField(field: string) {
  const normalized = field.toLowerCase();
  if (normalized.includes("computer")) return "computer-science";
  if (normalized.includes("engineering")) return "engineering";
  if (normalized.includes("medicine") || normalized.includes("biomedical")) return "medicine";
  if (normalized.includes("business")) return "business";
  if (normalized.includes("art") || normalized.includes("design")) return "arts";
  if (normalized.includes("science")) return "science";
  if (normalized.includes("law")) return "law";
  return "default";
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function universityInitials(value: string) {
  const words = value
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (words.length >= 2) {
    const firstInitial = words[0]?.charAt(0) ?? "";
    const secondInitial = words[1]?.charAt(0) ?? "";
    return `${firstInitial}${secondInitial}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase() || "UN";
}

export function ProgramCardModern({
  id,
  universityId,
  name,
  university,
  universityLogo,
  degreeLevel,
  field,
  duration,
  language,
  tuitionPerYear,
  tuitionCurrency = "EUR",
  coverPhoto,
  description = "",
  requirements = [],
  showCompare = false,
  size,
  variant,
  pathname,
  locationLabel,
  intakeLabel,
  levelName,
  feesLabel,
  hasSale = false,
  salePercentage,
  isSeasonal = false,
  onClick,
  onApply,
}: ProgramCardModernProps) {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const cardSize = toCardSize(size, variant);
  const fieldStyle = FIELD_STYLES[normalizeField(field) as keyof typeof FIELD_STYLES] ?? FIELD_STYLES.default;
  const FieldIcon = fieldStyle.icon;
  const badgeClass = DEGREE_BADGES[(degreeLevel.toLowerCase() as keyof typeof DEGREE_BADGES) ?? "bachelor"] ?? DEGREE_BADGES.bachelor;
  const saved = id ? isFavorite("program", id) : false;
  const compared = id ? isInComparison(id) : false;
  const isRtl = dir === "rtl";
  const [logoFailed, setLogoFailed] = useState(false);
  const programPath = pathname || (id ? `/programs/${id}` : "");
  const shouldShowCatalogMeta = Boolean(locationLabel || intakeLabel || levelName);
  const shouldShowUniversityRow = Boolean(university.trim());
  // feesLabel is already null when fees are unknown — don't convert zero amounts to "Free"
  const displayFees = feesLabel;

  const handleToggleFavorite = () => {
    if (!id || !universityId) return;
    if (saved) {
      removeFavorite("program", id);
      return;
    }

    addFavorite("program", {
      id,
      name,
      degreeLevel: degreeLevel.toLowerCase() as "bachelor" | "master" | "phd" | "certificate",
      field,
      duration,
      language,
      tuitionPerYear,
      tuitionCurrency,
      description,
      requirements,
      universityId,
      universityName: university,
      universityLogo: universityLogo ?? "",
    });
  };

  const handleToggleCompare = () => {
    if (!id || !universityId) return;
    if (compared) {
      removeFromComparison(id);
      return;
    }

    addToComparison({
      id,
      name,
      degreeLevel: degreeLevel.toLowerCase() as "bachelor" | "master" | "phd" | "certificate",
      duration,
      language,
      field,
      tuitionPerYear,
      requirements,
      universityId,
      universityName: university,
      universityLogo: universityLogo ?? "",
      rating: 4.6,
      deadline: "June 30",
    });
  };

  const openUniversity = () => {
    if (universityId) navigate(`/universities/${universityId}`);
  };

  const openProgram = () => {
    if (onApply) {
      onApply();
      return;
    }
    if (id) {
      navigate(`/programs/${id}`);
      return;
    }
    onClick?.();
  };

  if (cardSize === "compact") {
    return (
      <article className={`group flex h-20 items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-background-surface/85 backdrop-blur-sm px-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] ${isRtl ? "flex-row-reverse text-right" : ""}`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br text-white ${fieldStyle.wrapper}`}>
          <FieldIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          <div className={`mt-1 flex items-center gap-2 text-xs text-text-secondary ${isRtl ? "flex-row-reverse" : ""}`}>
            <span className="truncate">{university}</span>
            <span className={`rounded-full border px-2 py-0.5 font-semibold ${badgeClass}`}>{titleCase(degreeLevel)}</span>
          </div>
        </div>
        <button type="button" onClick={openProgram} className="text-accent-tech">
          <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
        </button>
      </article>
    );
  }

  if (variant === "catalog") {
    const accentBar =
      degreeLevel?.toLowerCase() === "phd" || degreeLevel?.toLowerCase().includes("doctor")
        ? "from-accent-tech to-brand-navy-700"
        : degreeLevel?.toLowerCase() === "master" || degreeLevel?.toLowerCase().includes("postgrad") || degreeLevel?.toLowerCase().includes("master")
          ? "from-emerald-400 to-teal-500"
          : degreeLevel?.toLowerCase() === "bachelor" || degreeLevel?.toLowerCase().includes("undergrad") || degreeLevel?.toLowerCase().includes("bachelor")
            ? "from-sky-400 to-blue-500"
            : "from-amber-400 to-orange-400";

    return (
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 surface-card ${isRtl ? "text-right" : "text-left"}`}
      >
        <div className={`h-1 w-full bg-linear-to-r ${accentBar}`} />

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className={`flex items-start gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className="min-w-0 flex-1">
              {(hasSale || isSeasonal) && (
                <div className={`mb-2 flex flex-wrap gap-1.5 ${isRtl ? "flex-row-reverse" : ""}`}>
                  {hasSale && salePercentage != null && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50">
                      {salePercentage}% OFF
                    </span>
                  )}
                  {isSeasonal && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50">
                      Rolling intake
                    </span>
                  )}
                </div>
              )}
              {programPath ? (
                <Link to={programPath} className="group/link">
                  <h2 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover/link:text-accent-tech dark:text-white dark:group-hover/link:text-accent-tech">
                    {name}
                  </h2>
                </Link>
              ) : (
                <h2 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 dark:text-white">
                  {name}
                </h2>
              )}
            </div>
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={t<string>("card.program.saveProgram")}
              className={`shrink-0 rounded-full p-1.5 transition-colors ${saved ? "text-accent-primary dark:text-accent-primary" : "text-slate-300 hover:text-accent-primary dark:text-slate-600 dark:hover:text-accent-primary"}`}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            </button>
          </div>

          {shouldShowUniversityRow && (
            <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                {universityLogo && !logoFailed ? (
                  <img src={universityLogo} alt="" className="h-full w-full object-contain" onError={() => setLogoFailed(true)} />
                ) : (
                  <span className="text-[11px] font-bold text-accent-tech dark:text-accent-tech">{universityInitials(university)}</span>
                )}
              </div>
              <p className="min-w-0 truncate text-[13px] font-semibold text-slate-700 dark:text-slate-200">{university}</p>
            </div>
          )}

          {shouldShowCatalogMeta && (
            <div className={`flex flex-wrap items-center gap-1.5 ${isRtl ? "flex-row-reverse" : ""}`}>
              {levelName && (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}>
                  {levelName}
                </span>
              )}
              {locationLabel && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {locationLabel}
                </span>
              )}
              {intakeLabel && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                  <CalendarDays className="h-3 w-3 shrink-0" />
                  {intakeLabel}
                </span>
              )}
            </div>
          )}

          <div className="flex-1" />

          <div className={`flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className="min-w-0">
              {displayFees ? (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t<string>("common.approx")}</p>
                  <p className="mt-0.5 truncate text-base font-bold text-accent-primary dark:text-accent-primary">{displayFees}</p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{t<string>("card.program.tuitionLabel")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-400 dark:text-slate-500">{t<string>("card.program.contactUniversity")}</p>
                </>
              )}
            </div>

            {programPath ? (
              <Link
                to={programPath}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong px-4 py-2 text-[13px] font-semibold text-ink shadow-sm transition hover:shadow-[0_8px_20px_rgba(212,175,55,0.35)]"
              >
                {t<string>("card.program.explore")}
                <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={openProgram}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-accent-primary to-accent-primary-strong px-4 py-2 text-[13px] font-semibold text-ink shadow-sm transition hover:shadow-[0_8px_20px_rgba(212,175,55,0.35)]"
              >
                {t<string>("card.program.explore")}
                <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-background-surface/85 backdrop-blur-lg transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] ${isRtl ? "text-right" : "text-left"}`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute -right-10 top-10 w-28 h-28 rounded-full bg-accent-primary/20 blur-2xl" />
        <div className="absolute -left-10 bottom-6 w-28 h-28 rounded-full bg-accent-tech/18 blur-2xl" />
      </div>

      <div className={`relative h-30 overflow-hidden bg-linear-to-br ${fieldStyle.wrapper} text-white`}>
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/placeholder-image.svg";
            }}
          />
        ) : null}

        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/20 to-transparent" />

        <div className={`relative z-10 flex items-start justify-between gap-3 p-5 ${isRtl ? "flex-row-reverse" : ""}`}>
          <div className="w-11 h-11 rounded-xl border border-white/25 bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <FieldIcon className="h-5 w-5" />
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] font-semibold ${badgeClass}`}>
            {titleCase(degreeLevel)}
          </span>
        </div>
      </div>

      <div className="relative z-10 p-5 md:p-6">
        <h3 className="line-clamp-2 text-base md:text-lg font-bold leading-snug text-text-primary">{name}</h3>

        <div className={`mt-3 flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          <div className="w-7 h-7 rounded-full border border-border/60 overflow-hidden bg-background-primary flex items-center justify-center">
            {universityLogo ? (
              <img src={universityLogo} alt={university} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-3.5 w-3.5 text-text-muted" />
            )}
          </div>
          <button type="button" onClick={openUniversity} className="truncate text-xs text-text-secondary hover:text-text-primary transition-colors">
            {university}
          </button>
        </div>

        <div className={`mt-4 flex flex-wrap items-center gap-3 text-[11px] text-text-muted ${isRtl ? "flex-row-reverse" : ""}`}>
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{duration}</span>
          <span className="inline-flex items-center gap-1"><Globe2 className="h-3.5 w-3.5" />{language}</span>
          <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" />{field}</span>
        </div>

        <div className="mt-4 rounded-xl border border-border/60 bg-background-primary/70 p-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">{t<string>("card.program.tuitionFrom")}</p>
          {(() => {
            const effectiveFees = feesLabel || (tuitionPerYear > 0 ? `${tuitionCurrency || "EUR"} ${tuitionPerYear.toLocaleString()}` : null);

            return (
              <p className={`mt-1 text-base font-bold ${!effectiveFees ? "text-text-muted" : "text-text-primary"}`}>
                {effectiveFees ?? "—"}
              </p>
            );
          })()}
          <p className="text-[10px] text-text-muted">{t<string>("card.program.perYear")}</p>
        </div>

        {showCompare && id ? (
          <button
            type="button"
            onClick={handleToggleCompare}
            className={`mt-4 inline-flex items-center gap-2 text-xs font-semibold text-text-secondary ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <span className={`w-4 h-4 rounded border flex items-center justify-center ${compared ? "border-accent-tech bg-accent-tech text-ink" : "border-border bg-background-primary text-transparent"}`}>
              <Check className="h-3 w-3" />
            </span>
            {t<string>("card.program.compare")}
          </button>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold transition-colors ${saved ? "bg-accent-primary/15 text-accent-primary" : "text-text-primary hover:bg-background-hover"}`}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            {t<string>("card.program.saveProgram")}
          </button>

          <button
            type="button"
            onClick={openProgram}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent-primary to-accent-tech px-3 py-2.5 text-sm font-semibold text-ink"
          >
            {t<string>("card.program.viewProgram")}
            <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function UniversityCardModern({
  id,
  countryCode,
  name,
  country,
  city,
  programsCount,
  logo,
  coverPhoto,
  ranking,
  type,
  description = "",
  established,
  website,
  languages = [],
  size,
  variant,
  onClick,
  onViewDetails,
}: UniversityCardModernProps) {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const cardSize = toCardSize(size, variant);
  const isFeaturedVariant = variant === "featured";
  const saved = id ? isFavorite("university", id) : false;
  const programsLabel = formatProgramsLabel(t<string>("card.university.programs"), programsCount);
  const flag = COUNTRY_FLAGS[country] ?? countryCode ?? "";
  const normalizedType = (type || "").trim().toLowerCase();
  const hasTypeBadge = normalizedType === "public" || normalizedType === "private" || normalizedType === "international";
  const typeBadge = hasTypeBadge
    ? UNIVERSITY_TYPE_BADGES[normalizedType as keyof typeof UNIVERSITY_TYPE_BADGES]
    : null;
  const hasRanking = Number.isFinite(ranking) && Number(ranking) > 0 && Number(ranking) < 9000;
  const hasEstablished = Number.isFinite(established) && Number(established) > 0;
  const isRtl = dir === "rtl";

  const handleFavorite = () => {
    if (!id) return;
    if (saved) {
      removeFavorite("university", id);
      return;
    }
    addFavorite("university", {
      id,
      name,
      city,
      country,
      countryCode: countryCode ?? "",
      type: (hasTypeBadge ? normalizedType : "private") as "public" | "private" | "international",
      logo: logo ?? "",
      coverPhoto: coverPhoto ?? "",
      programsCount,
      languages: [],
      established: established ?? 0,
      ranking: ranking ?? 0,
      description,
      website,
    });
  };

  const openUniversity = () => {
    if (onViewDetails) {
      onViewDetails();
      return;
    }
    if (id) {
      navigate(`/universities/${id}`);
      return;
    }
    onClick?.();
  };

  if (cardSize === "compact") {
    return (
      <article className={`group flex h-20 items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-background-surface/85 backdrop-blur-sm px-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(8,21,48,0.12)] ${isRtl ? "flex-row-reverse text-right" : ""}`}>
        <div className="w-10 h-10 rounded-xl border border-border/60 bg-background-primary overflow-hidden flex items-center justify-center">
          <img
            src={logo || coverPhoto || "/placeholder-image.svg"}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/placeholder-image.svg";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          <p className="truncate text-xs text-text-secondary">{city}, {country}</p>
        </div>
        <button type="button" onClick={openUniversity} className="text-accent-tech">
          <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
        </button>
      </article>
    );
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-lg transition-all hover:-translate-y-1 surface-card ${isRtl ? "text-right" : "text-left"}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -right-8 top-12 h-28 w-28 rounded-full bg-accent-primary/18 blur-2xl" />
        <div className="absolute -left-8 bottom-10 h-28 w-28 rounded-full bg-accent-tech/16 blur-2xl" />
      </div>

      <div
        className={`relative overflow-hidden bg-linear-to-br from-brand-steel-700 via-brand-steel-600 to-brand-steel-500 ${
          isFeaturedVariant ? "h-48" : "h-40"
        }`}
      >
        {coverPhoto ? (
          <img src={coverPhoto} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <img
            src={logo || "/placeholder-image.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/placeholder-image.svg";
            }}
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/30 to-black/5" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/12" />

        <div className={`absolute top-3 ${isRtl ? "right-3" : "left-3"}`}>
          <span className="rounded-full border border-white/30 bg-black/25 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white">
            {flag ? `${flag} ` : ""}{country}
          </span>
        </div>

        <div className={`absolute top-3 ${isRtl ? "left-3" : "right-3"}`}>
          <span className="rounded-full border border-white/30 bg-black/25 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white">
            {programsLabel}
          </span>
        </div>

        <div className={`absolute ${isFeaturedVariant ? "-bottom-5" : "-bottom-4"} ${isRtl ? "right-4" : "left-4"}`}>
          <div className={`${isFeaturedVariant ? "w-12 h-12" : "w-11 h-11"} rounded-xl border border-white/35 bg-white overflow-hidden shadow-lg flex items-center justify-center`}>
            {logo ? <img src={logo} alt={name} className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-text-muted" />}
          </div>
        </div>
      </div>

      <div className={`relative z-10 ${isFeaturedVariant ? "p-6 pt-8" : "p-5 pt-7"}`}>
        <h3 className={`${isFeaturedVariant ? "text-lg md:text-xl" : "text-base md:text-lg"} font-bold text-text-primary line-clamp-1`}>{name}</h3>
        <p className={`mt-1 inline-flex items-center gap-1.5 text-xs text-text-muted ${isRtl ? "flex-row-reverse" : ""}`}>
          <MapPin className="h-3.5 w-3.5" />
          {city}, {country}
        </p>

        <div className={`mt-3 flex flex-wrap items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          {hasTypeBadge && typeBadge ? (
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${typeBadge}`}>{titleCase(normalizedType)}</span>
          ) : null}
          {hasRanking ? (
            <span className="rounded-full border border-border bg-background-primary px-2.5 py-1 text-[10px] font-semibold text-text-secondary">
              {t<string>("card.university.ranking")} #{Number(ranking)}
            </span>
          ) : null}
          {hasEstablished ? (
            <span className="rounded-full border border-border bg-background-primary px-2.5 py-1 text-[10px] font-semibold text-text-secondary">
              Est. {Number(established)}
            </span>
          ) : null}
        </div>

        {description ? <p className="mt-3 text-xs leading-relaxed text-text-secondary line-clamp-2">{description}</p> : null}

        {isFeaturedVariant && languages.length > 0 ? (
          <div className={`mt-3 inline-flex flex-wrap items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
            {languages.slice(0, 2).map((language) => (
              <span key={language} className="rounded-full border border-border/70 bg-background-primary/70 px-2.5 py-1 text-[10px] font-semibold text-text-secondary">
                {language}
              </span>
            ))}
          </div>
        ) : null}

        <div className={`grid grid-cols-[44px_1fr] gap-3 ${description || (isFeaturedVariant && languages.length > 0) ? "mt-5" : "mt-4"}`}>
          <button
            type="button"
            onClick={handleFavorite}
            className={`h-11 w-11 rounded-xl border border-border transition-colors flex items-center justify-center ${saved ? "bg-accent-primary/15 text-accent-primary" : "text-text-primary hover:bg-background-hover"}`}
            aria-label={t<string>("card.university.saveUniversity")}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={openUniversity}
            className="h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent-primary to-accent-tech px-4 text-sm font-semibold text-ink"
          >
            {t<string>("card.university.viewUniversity")}
            <ArrowRight className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}
