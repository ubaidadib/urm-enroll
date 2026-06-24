import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { m } from "motion/react";
import { Search, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import { UNIVERSITIES } from "@/data/universities";
import { ProgramCardModern } from "../components/ui/modern-cards";
import { SeoManager } from "../seo/seo-manager";
import { trackPageView } from "@/utils/tracking";
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

const PROGRAM_TYPE_OPTIONS: Array<{ id: ProgramTabId; label: string }> = [
  { id: "global", label: "Global" },
  { id: "internships", label: "Internships" },
  { id: "scholarships", label: "Scholarships" },
  { id: "research", label: "Research" },
  { id: "careers", label: "Careers" },
];

const FIELD_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "business", label: "Business & Management" },
  { value: "engineering", label: "Engineering" },
  { value: "computer-science", label: "Computer Science & IT" },
  { value: "medicine", label: "Medicine & Health" },
  { value: "design", label: "Design & Arts" },
  { value: "languages", label: "Languages" },
  { value: "law", label: "Law" },
  { value: "science", label: "Natural Sciences" },
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
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        No matching programs
      </p>
      <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
        Adjust the filters and try again.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-400">
        Search by program name, organization, level, pathway, city, or country to narrow the catalog.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-xl btn-gold-primary px-5 py-3 text-sm font-semibold"
      >
        <X className="h-4 w-4" />
        Reset filters
      </button>
    </div>
  );
}

export function ProgramsPage() {
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

  useEffect(() => {
    trackPageView({ page: "programs-premium" });
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
  }, []);

  const organizations = useMemo(
    () => [...new Set(listings.map((listing) => listing.organization).filter((value) => isMeaningfulText(value)))].sort((a, b) => a.localeCompare(b)),
    [listings],
  );

  const contractTypes = useMemo(
    () => [...new Set(listings.map((listing) => listing.contractType).filter((value) => isMeaningfulText(value)))].sort((a, b) => a.localeCompare(b)),
    [listings],
  );

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
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-linear-to-br from-cyan-200/35 to-transparent blur-3xl dark:from-cyan-900/20" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-linear-to-tr from-amber-200/30 to-transparent blur-3xl dark:from-amber-900/15" />
        </div>

        <div className="relative z-10 px-[var(--content-gutter)] pb-12 sm:pb-16 page-hero-offset">
          <div className="mx-auto max-w-7xl">
            <m.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Global program catalog
              </p>
              <h1 className="mt-3 max-w-3xl text-2xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
                Find the right program for your future.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Browse thousands of bachelor's, master's, and postgraduate programs from universities worldwide. Filter by location, intake period, and tuition to narrow your search.
              </p>
            </m.section>

            <m.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-8 rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20 space-y-3"
            >
              {/* Row 1 — Search bar (full width) */}
              <label className="relative block">
                <span className="sr-only">Search programs</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by program name, university, city, country…"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </label>

              {/* Row 2 — Dropdowns */}
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                <label className="relative block">
                  <span className="sr-only">Field of study</span>
                  <select
                    value={fieldFilter}
                    onChange={(event) => {
                      setFieldFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-slate-400 dark:bg-slate-950 dark:text-white ${
                      fieldFilter
                        ? "border-accent-tech/50 bg-accent-tech/5 text-slate-900 font-semibold dark:border-accent-tech/60 dark:bg-accent-tech/10"
                        : "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800"
                    }`}
                  >
                    <option value="">All fields of study</option>
                    {FIELD_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>

                <label className="relative block">
                  <span className="sr-only">Program type</span>
                  <select
                    value={programType ?? ""}
                    onChange={(event) => {
                      setProgramType(event.target.value ? (event.target.value as ProgramTabId) : null);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">All program types</option>
                    {PROGRAM_TYPE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>

                <label className="relative block">
                  <span className="sr-only">Organization</span>
                  <select
                    value={organizationFilter}
                    onChange={(event) => {
                      setOrganizationFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">All organizations</option>
                    {organizations.map((organization) => (
                      <option key={organization} value={organization}>
                        {organization}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </label>

                <label className="relative block">
                  <span className="sr-only">Contract type</span>
                  <select
                    value={contractTypeFilter}
                    onChange={(event) => {
                      setContractTypeFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="">All contract types</option>
                    {contractTypes.map((contractType) => (
                      <option key={contractType} value={contractType}>
                        {contractType}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-accent-tech/50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-accent-tech/50 dark:hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Active filters bar */}
              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Active:</span>
                  {fieldFilter && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tech/10 border border-accent-tech/25 px-3 py-1 text-xs font-semibold capitalize text-accent-tech dark:bg-accent-tech/15">
                      {FIELD_OPTIONS.find((f) => f.value === fieldFilter)?.label ?? fieldFilter.replace(/-/g, " ")}
                      <button type="button" onClick={() => { setFieldFilter(""); setCurrentPage(1); }} className="hover:text-red-500 transition-colors" aria-label="Remove field filter">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {programType && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {PROGRAM_TYPE_OPTIONS.find((p) => p.id === programType)?.label ?? programType}
                      <button type="button" onClick={() => { setProgramType(null); setCurrentPage(1); }} className="hover:text-red-500 transition-colors" aria-label="Remove type filter">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {organizationFilter && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                      {organizationFilter}
                      <button type="button" onClick={() => { setOrganizationFilter(""); setCurrentPage(1); }} className="hover:text-red-500 transition-colors" aria-label="Remove organization filter">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                </div>
              ) : null}
            </m.section>

            <section className="mt-10">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Showing {showingStart}-{showingEnd} of {filteredListings.length} programs
                  </p>
                  <h2 className="mt-1 text-3xl font-black text-slate-950 dark:text-white capitalize">
                    {filteredListings.length === 0 ? "No programs found" : fieldFilter ? `${fieldFilter.replace(/-/g, " ")} Programs` : "Programs"}
                  </h2>
                </div>
                <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
                  Intake dates, fees, and location are sourced directly from the university. Contact the university for the most up-to-date details.
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
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      {paginationItems.map((item, index) =>
                        item === "ellipsis" ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
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
                                : "border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
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
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
                      >
                        Next
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
