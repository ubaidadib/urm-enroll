import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { m } from "motion/react";
import { Search, ChevronDown, X, ChevronLeft, ChevronRight, Sparkles, GraduationCap, Building2, Globe2 } from "lucide-react";
import { UNIVERSITIES } from "@/data/universities";
import { ProgramCardModern } from "../components/ui/modern-cards";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { SeoManager } from "../seo/seo-manager";
import { useLanguage } from "@/i18n/language-context";
import { trackPageView } from "@/utils/tracking";
import { MIRROR_CATALOG_READY_EVENT } from "@/lib/mirror-catalog";
import {
  formatDisplayFees,
  formatIntakeDates,
  formatLevelName,
  formatLocationLabel,
  formatPathwayName,
  formatSeasonsList,
  formatUniversityLogo,
  formatUniversityName,
  inferProgramTabId,
  isMeaningfulText,
  type ProgramTabId,
} from "@/lib/courses/formatCourseDisplay";

type PaginationItem = number | "ellipsis";

type RawProgramRecord = Record<string, unknown> & {
  id?: unknown;
  name?: unknown;
  title?: unknown;
  degreeLevel?: unknown;
  field?: unknown;
  duration?: unknown;
  language?: unknown;
  tuitionPerYear?: unknown;
  tuitionCurrency?: unknown;
  description?: unknown;
  requirements?: unknown;
  coverPhoto?: unknown;
  sale_percentage?: unknown;
  is_seasonal?: unknown;
};

type ProgramListing = {
  id: string;
  slug: string;
  universityId: string;
  programName: string;
  universityName: string | null;
  universityLogo: string | null;
  locationLabel: string | null;
  feesLabel: string | null;
  intakeLabel: string | null;
  levelName: string | null;
  pathwayName: string;
  tabId: ProgramTabId;
  hasSale: boolean;
  salePercentage: number | null;
  isSeasonal: boolean;
  country: string;
  city: string;
  organization: string;
  contractType: string;
  duration: string;
  language: string;
  field: string;
  description: string;
  coverPhoto: string | undefined;
  tuitionPerYear: number;
  tuitionCurrency: string;
  requirements: string[];
  rawProgram: RawProgramRecord;
};

const ITEMS_PER_PAGE = 12;

const PROGRAM_TYPE_OPTIONS: Array<{ id: ProgramTabId; labelKey: string }> = [
  { id: "global", labelKey: "programs.listing.filters.programTypes.global" },
  { id: "internships", labelKey: "programs.listing.filters.programTypes.internships" },
  { id: "scholarships", labelKey: "programs.listing.filters.programTypes.scholarships" },
  { id: "research", labelKey: "programs.listing.filters.programTypes.research" },
  { id: "careers", labelKey: "programs.listing.filters.programTypes.careers" },
];

const FIELD_OPTIONS: Array<{ value: string; labelKey: string }> = [
  { value: "business", labelKey: "programs.listing.filters.fields.business" },
  { value: "engineering", labelKey: "programs.listing.filters.fields.engineering" },
  { value: "computer-science", labelKey: "programs.listing.filters.fields.computerScience" },
  { value: "medicine", labelKey: "programs.listing.filters.fields.medicine" },
  { value: "design", labelKey: "programs.listing.filters.fields.design" },
  { value: "languages", labelKey: "programs.listing.filters.fields.languages" },
  { value: "law", labelKey: "programs.listing.filters.fields.law" },
  { value: "science", labelKey: "programs.listing.filters.fields.science" },
];

/**
 * Keyword-based field matching — works even when raw program data has no `field` property.
 * Checks program name and description for subject-area keywords.
 */
const FIELD_KEYWORDS: Record<string, string[]> = {
  "business": ["business", "management", "marketing", "finance", "account", "mba", "commerce", "economics", "entrepreneur", "administration", "hospitality", "hotel", "tourism"],
  "engineering": ["engineer", "mechanical", "electrical", "civil", "chemical", "structural", "industrial", "aerospace", "manufacturing", "automotive"],
  "computer-science": ["computer", "software", "data science", "artificial intelligence", "machine learning", "information technology", "cyber", "programming", "network", "computing", "ict", "systems"],
  "medicine": ["medic", "nursing", "pharmacy", "dental", "health", "clinical", "physician", "surgeon", "physiother", "occupational therapy", "healthcare", "biomedic"],
  "healthcare": ["medic", "nursing", "pharmacy", "dental", "health", "clinical", "physiother", "care", "biomedic"],
  "design": ["design", "art", "creative", "visual", "graphic", "fashion", "architecture", "media", "film", "photography", "interior"],
  "languages": ["language", "linguist", "translation", "interpreting", "english", "german", "french", "arabic", "spanish", "italian", "applied language"],
  "law": ["law", "legal", "justice", "criminolog", "juris", "attorney", "legislation"],
  "science": ["biology", "chemistr", "physics", "mathemat", "statistics", "natural science", "environmental", "geolog", "biochem"],
};

function matchesFieldFilter(programName: string, description: string, storedField: string, fieldFilter: string): boolean {
  if (!fieldFilter) return true;
  // Exact match on stored field (handles static data with proper field values)
  if (storedField.toLowerCase() === fieldFilter.toLowerCase()) return true;
  // Keyword match on program name + description (handles live API data where field is blank/"general")
  const keywords = FIELD_KEYWORDS[fieldFilter.toLowerCase()];
  if (!keywords) return false;
  const searchText = `${programName} ${description}`.toLowerCase();
  return keywords.some((kw) => searchText.includes(kw));
}

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBoolean(value: unknown): boolean {
  return value === true;
}

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PaginationItem[] = [1];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) {
    items.push("ellipsis");
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    items.push(page);
  }

  if (windowEnd < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
}

function ProgramsEmptyState({ onReset }: { onReset: () => void }) {
  const { t } = useLanguage();

  return (
    <div className="rounded-[1.75rem] border border-dashed border-border/60 bg-bg-surface/80 px-6 py-16 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
        {t<string>("programs.listing.empty.noMatching")}
      </p>
      <h2 className="mt-3 text-3xl font-black text-text-primary">
        {t<string>("programs.listing.empty.adjustFilters")}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
        {t<string>("programs.listing.empty.searchHint")}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-xl btn-gold-primary px-5 py-3 text-sm font-semibold"
      >
        <X className="h-4 w-4" />
        {t<string>("programs.listing.empty.resetFilters")}
      </button>
    </div>
  );
}

export function ProgramsPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [programType, setProgramType] = useState<ProgramTabId | null>(() => {
    const value = searchParams.get("type");
    return PROGRAM_TYPE_OPTIONS.some((option) => option.id === value) ? (value as ProgramTabId) : null;
  });
  const [organizationFilter, setOrganizationFilter] = useState(searchParams.get("organization") ?? "");
  const [contractTypeFilter, setContractTypeFilter] = useState(searchParams.get("contractType") ?? "");
  const [fieldFilter, setFieldFilter] = useState(searchParams.get("field") ?? "");
  const [currentPage, setCurrentPage] = useState(() => {
    const parsed = Number.parseInt(searchParams.get("page") ?? "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  });
  const [catalogVersion, setCatalogVersion] = useState(0);

  useEffect(() => {
    trackPageView({ page: "programs-premium" });
  }, []);

  useEffect(() => {
    const handleCatalogReady = () => setCatalogVersion((version) => version + 1);
    window.addEventListener(MIRROR_CATALOG_READY_EVENT, handleCatalogReady);
    return () => window.removeEventListener(MIRROR_CATALOG_READY_EVENT, handleCatalogReady);
  }, []);

  const listings = useMemo<ProgramListing[]>(() => {
    return UNIVERSITIES.flatMap((university) => {
      const universityPrograms = Array.isArray(university.programs) ? university.programs : [];

      return universityPrograms.map((program) => {
        const rawProgram = program as RawProgramRecord;
        const displayProgram: RawProgramRecord = {
          ...rawProgram,
          university: typeof rawProgram.university === "object" && rawProgram.university !== null
            ? rawProgram.university
            : { name: university.name, logo: university.logo },
          country: rawProgram.country ?? { name: university.country },
          city: rawProgram.city ?? { name: university.city },
        };

        const programName = isMeaningfulText(rawProgram.name)
          ? toTrimmedString(rawProgram.name)
          : isMeaningfulText(rawProgram.title)
            ? toTrimmedString(rawProgram.title)
            : "Untitled program";
        const universityName = formatUniversityName(displayProgram) ?? (isMeaningfulText(university.name) ? university.name.trim() : null);
        const locationLabel = formatLocationLabel(displayProgram);
        const feesLabel = formatDisplayFees(displayProgram);
        const intakeLabel = formatIntakeDates(displayProgram.dates)[0] ?? formatSeasonsList(displayProgram.seasons)[0] ?? null;
        const levelName = formatLevelName(displayProgram);
        const pathwayName = formatPathwayName(displayProgram);
        const organization = universityName ?? "—";
        const city = toTrimmedString(typeof displayProgram.city === "object" && displayProgram.city !== null
          ? (displayProgram.city as Record<string, unknown>).name
          : displayProgram.city) || "—";
        const country = toTrimmedString(typeof displayProgram.country === "object" && displayProgram.country !== null
          ? (displayProgram.country as Record<string, unknown>).name
          : displayProgram.country) || "—";

        return {
          id: String(rawProgram.id ?? `${university.id}-${programName}`),
          slug: String(rawProgram.id ?? `${university.id}-${programName}`),
          universityId: university.id,
          programName,
          universityName,
          universityLogo: formatUniversityLogo(displayProgram) ?? (isMeaningfulText(university.logo) ? university.logo.trim() : null),
          locationLabel,
          feesLabel,
          intakeLabel,
          levelName,
          pathwayName,
          tabId: inferProgramTabId(displayProgram),
          hasSale: toBoolean(displayProgram.has_sale),
          salePercentage: Number.isFinite(Number(rawProgram.sale_percentage)) ? Number(rawProgram.sale_percentage) : null,
          isSeasonal: toBoolean(rawProgram.is_seasonal),
          country,
          city,
          organization,
          contractType: pathwayName,
          duration: toTrimmedString(rawProgram.duration),
          language: toTrimmedString(rawProgram.language),
          field: toTrimmedString(rawProgram.field) || "general",
          description: toTrimmedString(rawProgram.description),
          coverPhoto: toTrimmedString(rawProgram.coverPhoto) || undefined,
          tuitionPerYear: toNumber(rawProgram.tuitionPerYear),
          tuitionCurrency: toTrimmedString(rawProgram.tuitionCurrency) || "EUR",
          requirements: Array.isArray(rawProgram.requirements) ? rawProgram.requirements.map((value) => String(value)) : [],
          rawProgram: displayProgram,
        };
      });
    });
  }, [catalogVersion]);

  const organizations = useMemo(
    () => [...new Set(listings.map((listing) => listing.organization).filter((value) => isMeaningfulText(value)))].sort((a, b) => a.localeCompare(b)),
    [listings],
  );

  const contractTypes = useMemo(
    () => [...new Set(listings.map((listing) => listing.contractType).filter((value) => isMeaningfulText(value)))].sort((a, b) => a.localeCompare(b)),
    [listings],
  );

  const fieldCount = FIELD_OPTIONS.length;

  const filteredListings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return listings.filter((listing) => {
      if (normalizedQuery) {
        const haystack = [
          listing.programName,
          listing.levelName,
          listing.pathwayName,
          listing.city,
          listing.country,
          listing.organization,
          listing.contractType,
        ]
          .filter((value): value is string => Boolean(value))
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      if (programType && listing.tabId !== programType) {
        return false;
      }

      if (organizationFilter && listing.organization !== organizationFilter) {
        return false;
      }

      if (contractTypeFilter && listing.contractType !== contractTypeFilter) {
        return false;
      }

      if (fieldFilter && !matchesFieldFilter(listing.programName, listing.description, listing.field, fieldFilter)) {
        return false;
      }

      return true;
    });
  }, [listings, searchQuery, programType, organizationFilter, contractTypeFilter, fieldFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const visibleListings = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, safeCurrentPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (programType) params.set("type", programType);
    if (organizationFilter) params.set("organization", organizationFilter);
    if (contractTypeFilter) params.set("contractType", contractTypeFilter);
    if (fieldFilter) params.set("field", fieldFilter);
    if (safeCurrentPage > 1) params.set("page", String(safeCurrentPage));

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [searchQuery, programType, organizationFilter, contractTypeFilter, fieldFilter, safeCurrentPage, searchParams, setSearchParams]);

  const hasActiveFilters = Boolean(searchQuery.trim() || programType || organizationFilter || contractTypeFilter || fieldFilter);
  const showingStart = filteredListings.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = filteredListings.length === 0 ? 0 : Math.min(filteredListings.length, safeCurrentPage * ITEMS_PER_PAGE);
  const paginationItems = buildPaginationItems(safeCurrentPage, totalPages);

  const resetFilters = () => {
    setSearchQuery("");
    setProgramType(null);
    setOrganizationFilter("");
    setContractTypeFilter("");
    setFieldFilter("");
    setCurrentPage(1);
  };

  return (
    <>
      <SeoManager
        title="Discover Global Programs | URM Enroll"
        description="Browse thousands of bachelor's, master's, and postgraduate programs worldwide. Filter by location, intake date, and tuition to find your perfect program."
        path="/programs"
      />

      <main className="relative min-h-screen overflow-hidden bg-bg-primary">
        <section className="relative overflow-hidden page-hero-offset-listing page-hero-pb-compact px-[var(--content-gutter)] border-b border-border/50 bg-bg-secondary">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-[32rem] h-[32rem] rounded-full bg-accent-tech/8 blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] rounded-full bg-accent-primary/8 blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>
          </div>

          <div className="page-hero-inner">
            <div className="page-hero-crumb-gap">
              <Breadcrumbs
                items={[
                  { label: t<string>("common.home"), href: "/" },
                  { label: t<string>("header.nav.programs"), href: "/programs" },
                ]}
              />
            </div>

            <div className="page-hero-grid">
              <div className="page-hero-main">
                <m.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border/50 bg-bg-surface shadow-sm page-hero-badge-gap"
                >
                  <Sparkles className="w-4 h-4 text-accent-tech" />
                  <span className="text-xs font-bold uppercase tracking-widest text-text-primary">
                    {t<string>("programs.listing.hero.badge")}
                  </span>
                </m.div>

                <m.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.75rem] 3xl:text-[4.5rem] 4xl:text-[5.5rem] font-bold tracking-tight leading-[1.08] text-text-primary"
                >
                  {t<string>("programs.listing.hero.title")}
                </m.h1>

                <m.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 lg:mt-3 text-base sm:text-lg text-text-secondary leading-relaxed"
                >
                  {t<string>("programs.listing.hero.subtitle")}
                </m.p>
              </div>

              <m.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="page-hero-aside grid gap-3"
              >
                <div className="rounded-2xl p-4 flex items-center gap-3 bg-bg-surface/80 backdrop-blur-md border border-border/50 shadow-sm">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-accent-tech/10 border border-accent-tech/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-accent-tech" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-text-primary">{listings.length}+</p>
                    <p className="text-sm text-text-muted">{t<string>("programs.listing.hero.stats.programs")}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 flex items-center gap-3 bg-bg-surface/80 backdrop-blur-md border border-border/50 shadow-sm">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-text-primary">{organizations.length}+</p>
                    <p className="text-sm text-text-muted">{t<string>("programs.listing.hero.stats.universities")}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 flex items-center gap-3 bg-bg-surface/80 backdrop-blur-md border border-border/50 shadow-sm">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-accent-success/10 border border-accent-success/20 flex items-center justify-center">
                    <Globe2 className="w-5 h-5 text-accent-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-text-primary">{fieldCount}</p>
                    <p className="text-sm text-text-muted">{t<string>("programs.listing.hero.stats.fields")}</p>
                  </div>
                </div>
              </m.div>
            </div>

            <m.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-5 lg:mt-6 rounded-2xl border border-border/60 bg-bg-surface/90 p-4 sm:p-5 shadow-sm backdrop-blur space-y-3"
            >
              {/* Row 1 — Search bar (full width) */}
              <label className="relative block">
                <span className="sr-only">{t<string>("programs.listing.filters.searchPrograms")}</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={t<string>("programs.listing.filters.extendedPlaceholder")}
                  className="w-full rounded-2xl border border-border/50 bg-bg-secondary px-11 py-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary/40"
                />
              </label>

              {/* Row 2 — Dropdowns */}
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                <label className="relative block">
                  <span className="sr-only">{t<string>("programs.listing.filters.fieldOfStudy")}</span>
                  <select
                    value={fieldFilter}
                    onChange={(event) => {
                      setFieldFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-accent-primary/40 text-text-primary ${
                      fieldFilter
                        ? "border-accent-tech/50 bg-accent-tech/8 font-semibold"
                        : "border-border/50 bg-bg-secondary"
                    }`}
                  >
                    <option value="">{t<string>("programs.listing.filters.allFields")}</option>
                    {FIELD_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t<string>(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                </label>

                <label className="relative block">
                  <span className="sr-only">{t<string>("programs.listing.filters.programType")}</span>
                  <select
                    value={programType ?? ""}
                    onChange={(event) => {
                      setProgramType(event.target.value ? (event.target.value as ProgramTabId) : null);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none rounded-2xl border border-border/50 bg-bg-secondary px-4 py-3 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/40"
                  >
                    <option value="">{t<string>("programs.listing.filters.allTypes")}</option>
                    {PROGRAM_TYPE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {t<string>(option.labelKey)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                </label>

                <label className="relative block">
                  <span className="sr-only">{t<string>("programs.listing.filters.organization")}</span>
                  <select
                    value={organizationFilter}
                    onChange={(event) => {
                      setOrganizationFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none rounded-2xl border border-border/50 bg-bg-secondary px-4 py-3 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/40"
                  >
                    <option value="">{t<string>("programs.listing.filters.allOrganizations")}</option>
                    {organizations.map((organization) => (
                      <option key={organization} value={organization}>
                        {organization}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                </label>

                <label className="relative block">
                  <span className="sr-only">{t<string>("programs.listing.filters.contractType")}</span>
                  <select
                    value={contractTypeFilter}
                    onChange={(event) => {
                      setContractTypeFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none rounded-2xl border border-border/50 bg-bg-secondary px-4 py-3 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/40"
                  >
                    <option value="">{t<string>("programs.listing.filters.allContractTypes")}</option>
                    {contractTypes.map((contractType) => (
                      <option key={contractType} value={contractType}>
                        {contractType}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                </label>
              </div>

              {/* Row 3 — Quick-select field chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {FIELD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFieldFilter(fieldFilter === option.value ? "" : option.value);
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      fieldFilter === option.value
                        ? "border-accent-tech bg-accent-tech text-white shadow-sm"
                        : "border-border/60 bg-bg-secondary text-text-secondary hover:border-accent-tech/50 hover:text-text-primary"
                    }`}
                  >
                    {t<string>(option.labelKey)}
                  </button>
                ))}
              </div>

              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
                  <span className="text-xs text-text-muted font-medium">{t<string>("programs.listing.filters.active")}</span>
                  {fieldFilter && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tech/10 border border-accent-tech/25 px-3 py-1 text-xs font-semibold capitalize text-accent-tech dark:bg-accent-tech/15">
                      {FIELD_OPTIONS.find((f) => f.value === fieldFilter) ? t<string>(FIELD_OPTIONS.find((f) => f.value === fieldFilter)!.labelKey) : fieldFilter.replace(/-/g, " ")}
                      <button type="button" onClick={() => { setFieldFilter(""); setCurrentPage(1); }} className="hover:text-red-500 transition-colors" aria-label={t<string>("common.aria.removeFieldFilter")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {programType && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary border border-border/60 px-3 py-1 text-xs font-semibold text-text-secondary">
                      {PROGRAM_TYPE_OPTIONS.find((p) => p.id === programType) ? t<string>(PROGRAM_TYPE_OPTIONS.find((p) => p.id === programType)!.labelKey) : programType}
                      <button type="button" onClick={() => { setProgramType(null); setCurrentPage(1); }} className="hover:text-red-500 transition-colors" aria-label={t<string>("common.aria.removeTypeFilter")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {organizationFilter && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary border border-border/60 px-3 py-1 text-xs font-semibold text-text-secondary">
                      {organizationFilter}
                      <button type="button" onClick={() => { setOrganizationFilter(""); setCurrentPage(1); }} className="hover:text-red-500 transition-colors" aria-label={t<string>("common.aria.removeOrganizationFilter")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border/60 px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t<string>("programs.listing.filters.clearAll")}
                  </button>
                </div>
              ) : null}
            </m.section>
          </div>
        </section>

        <div className="relative z-10 px-[var(--content-gutter)]">
          <div className="mx-auto max-w-7xl">
            <section className="mt-10 pb-12">
              <div className="flex flex-col gap-3 border-b border-border/50 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-secondary">
                    {t<string>("programs.listing.results.showing")} {showingStart}-{showingEnd} {t<string>("programs.listing.results.of")} {filteredListings.length} {t<string>("programs.listing.results.items")}
                  </p>
                  <h2 className="mt-1 text-3xl font-black text-text-primary capitalize">
                    {filteredListings.length === 0 ? t<string>("programs.listing.results.noProgramsFound") : fieldFilter ? `${fieldFilter.replace(/-/g, " ")} ${t<string>("programs.listing.results.items")}` : t<string>("programs.listing.results.items")}
                  </h2>
                </div>
                <p className="max-w-xl text-sm text-text-muted">
                  {t<string>("programs.listing.results.footerNote")}
                </p>
              </div>

              {filteredListings.length === 0 ? (
                <div className="mt-8">
                  <ProgramsEmptyState onReset={resetFilters} />
                </div>
              ) : (
                <>
                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                    {visibleListings.map((listing, index) => (
                      <m.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.03 }}
                        className="h-full"
                      >
                        <ProgramCardModern
                          id={listing.id}
                          universityId={listing.universityId}
                          name={listing.programName}
                          university={listing.universityName ?? ""}
                          universityLogo={listing.universityLogo ?? undefined}
                          degreeLevel={toTrimmedString(listing.rawProgram.degreeLevel) || "bachelor"}
                          field={listing.field}
                          duration={listing.duration}
                          language={listing.language}
                          tuitionPerYear={listing.tuitionPerYear}
                          tuitionCurrency={listing.tuitionCurrency}
                          coverPhoto={listing.coverPhoto}
                          description={listing.description}
                          requirements={listing.requirements}
                          variant="catalog"
                          locationLabel={listing.locationLabel}
                          intakeLabel={listing.intakeLabel}
                          levelName={listing.levelName}
                          feesLabel={listing.feesLabel}
                          hasSale={listing.hasSale}
                          salePercentage={listing.salePercentage}
                          isSeasonal={listing.isSeasonal}
                          pathname={`/programs/${listing.slug}`}
                        />
                      </m.div>
                    ))}
                  </div>

                  {totalPages > 1 ? (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                        disabled={safeCurrentPage === 1}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-border/60 px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t<string>("programs.listing.results.previous")}
                      </button>

                      {paginationItems.map((item, index) =>
                        item === "ellipsis" ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-sm text-text-muted">
                            ...
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setCurrentPage(item)}
                            className={`h-11 min-w-11 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                              item === safeCurrentPage
                                ? "chip-active border-transparent"
                                : "border-border/60 text-text-secondary hover:border-border-strong hover:text-text-primary"
                            }`}
                          >
                            {item}
                          </button>
                        ),
                      )}

                      <button
                        type="button"
                        onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                        disabled={safeCurrentPage === totalPages}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-border/60 px-4 text-sm font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {t<string>("programs.listing.results.next")}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
