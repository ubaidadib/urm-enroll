/**
 * Universities Discovery Page — Premium 2026 Redesign
 * Cinematic · Editorial · Gen Z · Immersive
 */

import { useState, useMemo, useEffect } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  GraduationCap, Globe2, MapPin, Search, SearchX, SlidersHorizontal,
  Sparkles, ArrowRight, ChevronLeft, ChevronRight, Building2,
  Flame, X, TrendingUp, Zap, BookOpen,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { UniversityCardSkeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { FilterDrawer } from "../components/ui/filter-drawer";
import { FilterPanel } from "../components/ui/filter-panel";
import { DiscoveryBridgeSection, buildDiscoveryQuery } from "../components/ui/discovery-nav";
import { UNIVERSITIES, type University } from "@/data/universities";
import { trackPageView } from "@/utils/tracking";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  germany: "DE",
  italy: "IT",
  spain: "ES",
  france: "FR",
  malta: "MT",
  cyprus: "CY",
  canada: "CA",
  "united states": "US",
  usa: "US",
  turkey: "TR",
  georgia: "GE",
  hungary: "HU",
  latvia: "LV",
  netherlands: "NL",
  switzerland: "CH",
  austria: "AT",
  denmark: "DK",
  sweden: "SE",
  finland: "FI",
  belgium: "BE",
  poland: "PL",
  portugal: "PT",
  ireland: "IE",
  romania: "RO",
  bulgaria: "BG",
  greece: "GR",
  lithuania: "LT",
  estonia: "EE",
  czechia: "CZ",
  "czech republic": "CZ",
  slovakia: "SK",
  slovenia: "SI",
  croatia: "HR",
  serbia: "RS",
  bosnia: "BA",
  "bosnia and herzegovina": "BA",
  montenegro: "ME",
  albania: "AL",
  "north macedonia": "MK",
  norway: "NO",
  iceland: "IS",
  luxembourg: "LU",
};

const normalizeCountryKey = (countryName?: string) =>
  String(countryName || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const countryCodeToFlag = (countryCode?: string) => {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const formatMoneyCompact = (amount: number, currency = "EUR") => {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};

const getCountryFlag = (countryName?: string, countryCode?: string) => {
  const direct = countryCodeToFlag(countryCode);
  if (direct !== "🌍") return direct;

  const normalized = normalizeCountryKey(countryName);
  const mappedCode = COUNTRY_NAME_TO_ISO[normalized];
  return countryCodeToFlag(mappedCode);
};

const getUniversityInitials = (name: string) => {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
};

function UniversityHeroFallback({ university, compact = false }: { university: University; compact?: boolean }) {
  const initials = getUniversityInitials(university.name);
  const hasLogo = Boolean(university.logo);

  return (
    <div className="absolute inset-0 overflow-hidden bg-linear-to-br from-slate-100 via-slate-300 to-slate-600 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.46),transparent_42%),radial-gradient(circle_at_86%_74%,rgba(14,165,233,0.22),transparent_46%)]" />

      {hasLogo ? (
        <>
          <img
            src={university.logo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-72"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_38%)]" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-2xl border border-white/40 bg-white/20 dark:bg-black/25 text-white font-black tracking-[0.18em] backdrop-blur-sm ${compact ? "px-4 py-2 text-sm" : "px-8 py-5 text-3xl"}`}>
            {initials}
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.58)_100%)]" />
    </div>
  );
}

// ─── Trending Card (compact horizontal strip) ─────────────────────────────────

function TrendingUniversityCard({ university, index }: { university: University; index: number }) {
  const navigate = useNavigate();
  const flag = getCountryFlag(university.country, university.countryCode);
  const hasCoverPhoto = Boolean(university.coverPhoto);
  return (
    <m.button
      type="button"
      onClick={() => navigate(`/universities/${university.id}`)}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, scale: 1.015 }}
      className="group relative flex-shrink-0 w-[190px] overflow-hidden rounded-2xl cursor-pointer
        bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800
        shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.14)]
        transition-all duration-400 text-left"
    >
      <div className="relative h-[108px] overflow-hidden">
        <UniversityHeroFallback university={university} compact />
        {hasCoverPhoto ? (
          <img
            src={university.coverPhoto}
            alt={university.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-[1]"
            onError={(e) => {
              const image = e.currentTarget;
              image.onerror = null;
              image.style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/45 backdrop-blur-sm border border-white/20">
          <Flame className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-[10px] font-bold text-white">#{index + 1}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[12.5px] font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
          {university.name}
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{flag} {university.country}</p>
      </div>
    </m.button>
  );
}

// ─── Main Discovery Card ───────────────────────────────────────────────────────

function UniversityDiscoveryCard({
  university,
  index = 0,
  featured = false,
}: {
  university: University;
  index?: number;
  featured?: boolean;
}) {
  const navigate = useNavigate();
  const flag = getCountryFlag(university.country, university.countryCode);
  const hasCoverPhoto = Boolean(university.coverPhoto);
  const hasCourses = university.hasCourses ?? university.programsCount > 0;
  const startingTuition = typeof university.startingTuitionAmount === "number" && Number.isFinite(university.startingTuitionAmount) && university.startingTuitionAmount > 0
    ? university.startingTuitionAmount
    : null;
  const levels = Array.isArray(university.levels)
    ? university.levels.filter((l) => l && l.trim().length > 0).slice(0, 3)
    : [];
  const initials = getUniversityInitials(university.name);

  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.045, 0.35), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/universities/${university.id}`)}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer
        bg-white dark:bg-[#0d1829]
        border border-slate-200/80 dark:border-[#1a2a45]
        shadow-[0_1px_4px_rgba(8,21,48,0.06),0_4px_20px_rgba(8,21,48,0.06)]
        dark:shadow-[0_1px_4px_rgba(0,0,0,0.4),0_4px_20px_rgba(0,0,0,0.3)]
        hover:border-accent-tech/40 dark:hover:border-accent-tech/30
        hover:shadow-[0_8px_32px_rgba(8,21,48,0.12),0_2px_8px_rgba(8,21,48,0.08)]
        dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.4)]
        transition-all duration-400
        ${featured ? "sm:col-span-2" : ""}
      `}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-accent-tech/12 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent-primary/10 blur-2xl" />
      </div>

      {/* Hero image */}
      <div className={`relative overflow-hidden ${featured ? "h-[210px] sm:h-[240px]" : "h-[180px]"}`}>
        <UniversityHeroFallback university={university} />
        {hasCoverPhoto && (
          <img
            src={university.coverPhoto}
            alt={university.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-[1]"
            onError={(e) => { const img = e.currentTarget; img.onerror = null; img.style.display = "none"; }}
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-[2]" />

        {/* Type pill */}
        {university.type && (
          <div className="absolute top-3 right-3 z-[3] px-2.5 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/15">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/85 capitalize">
              {university.type}
            </span>
          </div>
        )}

        {/* Bottom row: logo + programs count */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] p-3.5 flex items-end justify-between gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-white border border-white/80 shadow-lg flex items-center justify-center overflow-hidden shrink-0">
            {university.logo ? (
              <img
                src={university.logo}
                alt=""
                className="w-8 h-8 object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).replaceWith(Object.assign(document.createElement("span"), { textContent: initials, className: "text-[9px] font-black text-slate-700" })); }}
              />
            ) : (
              <span className="text-[9px] font-black text-slate-700">{initials}</span>
            )}
          </div>
          {/* Programs count */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-brand-navy-800/85 backdrop-blur-sm border border-white/10">
            <GraduationCap className="w-3 h-3 text-accent-primary" />
            <span className="text-[11px] font-bold text-white">{university.programsCount}</span>
            <span className="text-[10px] text-white/70 font-medium">programs</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="relative z-10 p-4">
        {/* Name */}
        <h3 className="font-bold text-[0.95rem] leading-snug text-slate-900 dark:text-white line-clamp-2 group-hover:text-accent-tech transition-colors duration-300 mb-2">
          {university.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{[university.city, university.country].filter(Boolean).join(", ")}</span>
          <span className="ml-0.5">{flag}</span>
        </div>

        {/* Pill tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hasCourses ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20">
              ✓ Courses available
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              No active courses
            </span>
          )}

          {startingTuition !== null && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-accent-primary/10 text-amber-700 border border-accent-primary/25 dark:text-accent-primary dark:border-accent-primary/20">
              From {formatMoneyCompact(startingTuition, university.startingTuitionCurrency || "EUR")}/yr
            </span>
          )}

          {levels.map((level) => (
            <span key={level} className="inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-medium capitalize bg-accent-tech/8 text-accent-tech border border-accent-tech/20 dark:bg-accent-tech/12">
              {level}
            </span>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#1a2a45] pt-3.5">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            {university.city || university.country || "Global"}
          </p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/universities/${university.id}`); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-bold
              bg-brand-navy-800 dark:bg-brand-navy-700 text-white
              hover:bg-accent-tech hover:shadow-md hover:shadow-accent-tech/20
              transition-all duration-200"
          >
            View
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </m.article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function UniversitiesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [filterSearchQuery, setFilterSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(searchParams.get("country"));
  const [selectedType, setSelectedType] = useState<string | null>(searchParams.get("type"));
  const [sortBy, setSortBy] = useState<"name" | "programs">(
    (searchParams.get("sort") as "name" | "programs") ?? "name"
  );
  const [currentPage, setCurrentPage] = useState(() =>
    Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1)
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { trackPageView({ page: "universities" }); }, []);

  // URL → state sync
  useEffect(() => {
    const ns = searchParams.get("q") ?? "";
    const nc = searchParams.get("country");
    const nt = searchParams.get("type");
    const nso = (searchParams.get("sort") as "name" | "programs") ?? "name";
    const np = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
    if (ns !== searchQuery) setSearchQuery(ns);
    if (nc !== selectedCountry) setSelectedCountry(nc);
    if (nt !== selectedType) setSelectedType(nt);
    if (nso !== sortBy) setSortBy(nso);
    if (np !== currentPage) setCurrentPage(np);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // State → URL sync
  useEffect(() => {
    const p = new URLSearchParams();
    if (searchQuery.trim()) p.set("q", searchQuery.trim());
    if (selectedCountry) p.set("country", selectedCountry);
    if (selectedType) p.set("type", selectedType);
    if (sortBy !== "name") p.set("sort", sortBy);
    if (currentPage > 1) p.set("page", String(currentPage));
    if (p.toString() !== searchParams.toString()) setSearchParams(p, { replace: true });
  }, [searchQuery, selectedCountry, selectedType, sortBy, currentPage, searchParams, setSearchParams]);

  // Loading shimmer
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry, selectedType, sortBy, currentPage]);

  const countries = useMemo(
    () => [...new Set(UNIVERSITIES.map((u) => u.country).filter((country) => Boolean(country && country.trim().length > 0)))].sort(),
    []
  );
  const types = useMemo(
    () => [...new Set(UNIVERSITIES.map((u) => u.type).filter((type) => Boolean(type && type.trim().length > 0)))].sort(),
    []
  );
  const countryCodeByName = useMemo(() => {
    const mapping = new Map<string, string>();
    for (const university of UNIVERSITIES) {
      if (!university.country || !university.countryCode) continue;
      if (!mapping.has(university.country)) {
        mapping.set(university.country, university.countryCode);
      }
    }
    return mapping;
  }, []);
  const trendingCountries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const university of UNIVERSITIES) {
      const country = university.country?.trim();
      if (!country) continue;
      counts.set(country, (counts.get(country) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([country]) => country);
  }, []);
  const citiesCount = useMemo(() => new Set(UNIVERSITIES.map((u) => `${u.city},${u.country}`)).size, []);

  const filteredCountryOptions = useMemo(() => {
    const q = filterSearchQuery.trim().toLowerCase();
    return q ? countries.filter((c) => c.toLowerCase().includes(q)) : countries;
  }, [countries, filterSearchQuery]);

  const filteredTypeOptions = useMemo(() => {
    const q = filterSearchQuery.trim().toLowerCase();
    return q ? types.filter((tp) => tp.toLowerCase().includes(q)) : types;
  }, [types, filterSearchQuery]);

  const filteredUniversities = useMemo(() => {
    let r = UNIVERSITIES.slice();
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter((u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.country.toLowerCase().includes(q));
    }
    if (selectedCountry) r = r.filter((u) => u.country === selectedCountry);
    if (selectedType) r = r.filter((u) => u.type === selectedType);
    if (sortBy === "name") r.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "programs") r.sort((a, b) => b.programsCount - a.programsCount);
    return r;
  }, [searchQuery, selectedCountry, selectedType, sortBy]);

  const trendingUniversities = useMemo(
    () => [...UNIVERSITIES].sort((a, b) => b.programsCount - a.programsCount).slice(0, 8),
    []
  );

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUniversities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUniversities, currentPage]);

  const hasActiveFilters = !!(searchQuery || selectedCountry || selectedType);
  const activeFilterCount = [selectedCountry, selectedType].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCountry(null);
    setSelectedType(null);
    setCurrentPage(1);
  };

  return (
    <>
      <SeoManager
        title="Explore Universities | URM Enroll"
        description="Browse and explore top universities across Europe. Filter by country, type, and more to find your ideal institution."
        path="/universities"
      />

      <main className="relative min-h-screen bg-slate-50 dark:bg-[#080c14] overflow-x-hidden">

        {/* HERO */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="pointer-events-none absolute inset-0">
            <m.div
              className="absolute -top-32 -left-24 w-[38rem] h-[38rem] rounded-full bg-accent-tech/12 blur-[130px]"
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.div
              className="absolute -top-16 right-0 w-[44rem] h-[44rem] rounded-full bg-accent-primary/9 blur-[150px]"
              animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <div className="absolute bottom-0 left-1/3 w-[30rem] h-[22rem] rounded-full bg-accent-steel/7 blur-[110px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 premium-grid opacity-28" />

          <div className="relative z-10 mx-auto w-full max-w-[1540px] px-5 sm:px-8 lg:px-12">
            <div className="mb-8"><Breadcrumbs /></div>

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7">
                <m.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                    border border-slate-200 dark:border-slate-700/80
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl mb-7"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-tech" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {t<string>("universities.listing.hero.badge")}
                  </span>
                </m.div>

                <m.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(2.4rem,5.5vw,4.6rem)] font-black tracking-tight leading-[1.04]
                    text-slate-900 dark:text-white"
                >
                  {t<string>("universities.listing.hero.title")}
                </m.h1>

                <m.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 text-[clamp(1rem,1.4vw,1.18rem)] text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
                >
                  {t<string>("universities.listing.hero.subtitle")}
                </m.p>

                <m.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                >
                  <div className="relative flex items-center gap-3
                    rounded-2xl border border-slate-200 dark:border-slate-700/80
                    bg-white dark:bg-slate-900/90 backdrop-blur-xl
                    shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                    focus-within:border-accent-tech/60
                    focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.1),0_0_0_3px_rgba(32,168,231,0.14)]
                    dark:focus-within:shadow-[0_4px_32px_rgba(0,0,0,0.4),0_0_0_3px_rgba(32,168,231,0.18)]
                    transition-all duration-300 px-4 py-3"
                  >
                    <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder={t<string>("search.placeholder.universities")}
                      aria-label={t<string>("search.placeholder.universities")}
                      className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-[15px] outline-none min-w-0"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                        aria-label={t<string>("search.clear")}
                        className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center
                          text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => document.getElementById("universities-results")?.scrollIntoView({ behavior: "smooth" })}
                      className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-xl
                        bg-slate-900 dark:bg-white text-white dark:text-slate-900
                        text-sm font-bold transition-all duration-200
                        hover:bg-accent-tech hover:text-white dark:hover:bg-accent-tech dark:hover:text-white"
                    >
                      {t<string>("search.button.label")}
                    </button>
                  </div>
                </m.div>

                <m.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 flex flex-wrap items-center gap-2"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5" /> Trending:
                  </span>
                  {trendingCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(selectedCountry === country ? null : country);
                        setCurrentPage(1);
                        document.getElementById("universities-results")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                        ${selectedCountry === country
                          ? "bg-accent-tech text-white shadow-sm"
                          : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-accent-tech/50"
                        }`}
                    >
                      {getCountryFlag(country, countryCodeByName.get(country))} {country}
                    </button>
                  ))}
                </m.div>
              </div>

              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 grid gap-4"
              >
                <div className="glass-card rounded-[22px] p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-tech/15 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-accent-tech" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{UNIVERSITIES.length}+</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Verified universities</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card rounded-[22px] p-5 text-center">
                    <Globe2 className="w-6 h-6 mx-auto text-accent-primary mb-2" />
                    <p className="text-xl font-black text-slate-900 dark:text-white">{countries.length}+</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Countries</p>
                  </div>
                  <div className="glass-card rounded-[22px] p-5 text-center">
                    <MapPin className="w-6 h-6 mx-auto text-accent-steel mb-2" />
                    <p className="text-xl font-black text-slate-900 dark:text-white">{citiesCount}+</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Cities</p>
                  </div>
                </div>
                <div className="glass-card-light rounded-[22px] p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">AI-Powered Matching</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Find your perfect fit instantly</p>
                  </div>
                </div>
              </m.div>
            </div>
          </div>
        </section>

        {/* TRENDING CAROUSEL */}
        <section className="relative py-8 border-t border-slate-100 dark:border-slate-800/60">
          <div className="mx-auto w-full max-w-[1540px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 mb-5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Trending Now
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory">
              {trendingUniversities.map((uni, idx) => (
                <div key={uni.id} className="snap-start">
                  <TrendingUniversityCard university={uni} index={idx} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section id="universities-results" className="relative py-10 md:py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-24 w-60 h-60 rounded-full bg-accent-tech/7 blur-[80px]" />
            <div className="absolute -right-16 bottom-24 w-72 h-72 rounded-full bg-accent-primary/7 blur-[100px]" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[1540px] px-5 sm:px-8 lg:px-12">

            {/* Sticky filter bar */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-[72px] z-20 mb-8 -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12
                py-3 bg-slate-50/95 dark:bg-[#080c14]/95 backdrop-blur-xl
                border-b border-slate-200/60 dark:border-slate-800/60"
            >
              <div className="max-w-[1540px] mx-auto flex items-center gap-3 flex-wrap xl:flex-nowrap">
                <div className="relative hidden xl:flex items-center gap-2 flex-shrink-0">
                  <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Quick search…"
                    aria-label="Search universities"
                    className="h-9 w-48 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700/80
                      bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400
                      outline-none focus:border-accent-tech/60 transition-colors"
                  />
                </div>

                <div className="flex-1 overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-2 min-w-max">
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold
                        transition-all duration-200 whitespace-nowrap flex-shrink-0
                        ${!hasActiveFilters
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                          : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600"
                        }`}
                    >
                      All
                    </button>

                    {countries.map((country) => {
                      const active = selectedCountry === country;
                      return (
                        <button
                          key={country}
                          type="button"
                          onClick={() => { setSelectedCountry(active ? null : country); setCurrentPage(1); }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold
                            transition-all duration-200 whitespace-nowrap flex-shrink-0
                            ${active
                              ? "bg-accent-tech text-white shadow-sm"
                              : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-accent-tech/50"
                            }`}
                        >
                          {getCountryFlag(country, countryCodeByName.get(country))} {country}
                        </button>
                      );
                    })}

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0 mx-1" />

                    {types.map((type) => {
                      const active = selectedType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => { setSelectedType(active ? null : type); setCurrentPage(1); }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold capitalize
                            transition-all duration-200 whitespace-nowrap flex-shrink-0
                            ${active
                              ? "bg-accent-primary text-white shadow-sm"
                              : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-accent-primary/50"
                            }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full
                        text-xs font-bold text-accent-primary hover:text-accent-primary/80 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setCurrentPage(1); }}
                    aria-label="Sort universities"
                    className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80
                      bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300
                      outline-none focus:border-accent-tech/60 transition-colors cursor-pointer"
                  >
                    <option value="name">{t<string>("universities.listing.sort.name")}</option>
                    <option value="programs">{t<string>("universities.listing.sort.mostPrograms")}</option>
                  </select>
                </div>
              </div>
            </m.div>

            {/* Results header */}
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-7 flex items-center justify-between gap-4"
            >
              <div>
                <h2 className="inline-flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                  <Building2 className="w-5 h-5 text-accent-tech" />
                  {filteredUniversities.length} Universit{filteredUniversities.length !== 1 ? "ies" : "y"}
                  {hasActiveFilters && (
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1">matched</span>
                  )}
                </h2>
                {!isLoading && (
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {`Showing ${paginatedUniversities.length} of ${filteredUniversities.length}`}
                    {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                aria-label="Open filters"
                className="xl:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                  border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900
                  text-sm font-semibold text-slate-700 dark:text-slate-300
                  hover:border-accent-tech/60 transition-colors shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                    bg-accent-tech text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </m.div>

            {/* Grid / Skeleton / Empty */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {Array.from({ length: 9 }).map((_, i) => (
                  <UniversityCardSkeleton key={`skel-${i}`} />
                ))}
              </div>
            ) : filteredUniversities.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title={t<string>("universities.listing.empty.title")}
                description={t<string>("universities.listing.empty.description")}
                cta={{ label: t<string>("universities.listing.empty.clearFilters"), onClick: handleClearFilters }}
              />
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <m.div
                    key={`${searchQuery}-${selectedCountry}-${selectedType}-${currentPage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  >
                    {paginatedUniversities.map((university, index) => (
                      <UniversityDiscoveryCard
                        key={university.id}
                        university={university}
                        index={index}
                        featured={index === 0 && paginatedUniversities.length >= 3}
                      />
                    ))}
                  </m.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center justify-center gap-2 mb-12 flex-wrap"
                  >
                    <button
                      type="button"
                      onClick={() => { setCurrentPage(Math.max(1, currentPage - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                        border border-slate-200 dark:border-slate-700/80
                        bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300
                        hover:border-accent-tech/60 hover:text-accent-tech transition-all duration-200
                        disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 7) page = i + 1;
                        else if (currentPage <= 4) page = i + 1;
                        else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                        else page = currentPage - 3 + i;
                        if (page < 1 || page > totalPages) return null;
                        const isActive = page === currentPage;
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            aria-label={`Page ${page}`}
                            aria-current={isActive ? "page" : undefined}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200
                              ${isActive
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105"
                                : "border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-accent-tech/60 hover:text-accent-tech"
                              }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => { setCurrentPage(Math.min(totalPages, currentPage + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                        border border-slate-200 dark:border-slate-700/80
                        bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300
                        hover:border-accent-tech/60 hover:text-accent-tech transition-all duration-200
                        disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </m.div>
                )}

                {/* Scholarship CTA */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-12 relative overflow-hidden rounded-[32px]
                    bg-slate-900 dark:bg-slate-800/80
                    shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent-tech/28 blur-[80px]" />
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-accent-primary/22 blur-[80px]" />
                    <div className="absolute inset-0 premium-grid opacity-18" />
                  </div>
                  <div className="relative z-10 px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">Funding Available</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                        Find Your Perfect Scholarship
                      </h3>
                      <p className="mt-2 text-base text-white/60 max-w-lg">
                        Explore thousands of merit-based and need-based scholarships matched to your profile.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => navigate("/programs")}
                        className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl
                          bg-white text-slate-900 text-sm font-black
                          hover:bg-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Explore Programs
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </m.div>

                <DiscoveryBridgeSection
                  eyebrow={t<string>("discovery.bridge.universities.eyebrow")}
                  title={t<string>("discovery.bridge.universities.title")}
                  description={t<string>("discovery.bridge.universities.description")}
                  primaryCta={{
                    label: t<string>("discovery.bridge.universities.primary"),
                    href: `/programs${buildDiscoveryQuery({ q: searchQuery, country: selectedCountry })}`,
                  }}
                  secondaryCta={{
                    label: t<string>("discovery.bridge.universities.secondary"),
                    href: `/destinations${buildDiscoveryQuery({ q: selectedCountry ?? searchQuery })}`,
                  }}
                />
              </>
            )}
          </div>
        </section>

        {/* Mobile filter drawer */}
        <FilterDrawer
          open={isMobileFilterOpen}
          title={t<string>("universities.listing.filters.title")}
          onClose={() => setIsMobileFilterOpen(false)}
          onApply={() => setIsMobileFilterOpen(false)}
          onClearAll={handleClearFilters}
          applyLabel={t<string>("universities.listing.filters.apply")}
          clearAllLabel={t<string>("universities.listing.filters.clearAll")}
        >
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label={t<string>("universities.listing.filters.title")}
              value={filterSearchQuery}
              onChange={(e) => setFilterSearchQuery(e.target.value)}
              placeholder={t<string>("search.placeholder.global")}
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-900 pl-9 pr-3 text-sm text-slate-900 dark:text-white
                placeholder:text-slate-400 outline-none focus:border-accent-tech/60 transition-colors"
            />
          </div>
          <FilterPanel
            title={t<string>("universities.listing.filters.country")}
            items={filteredCountryOptions.map((c) => ({ id: c, label: c }))}
            selected={selectedCountry}
            onSelect={(val) => { setSelectedCountry(val); setCurrentPage(1); }}
          />
          <FilterPanel
            title={t<string>("universities.listing.filters.type")}
            items={filteredTypeOptions.map((tp) => ({ id: tp, label: tp.charAt(0).toUpperCase() + tp.slice(1) }))}
            selected={selectedType}
            onSelect={(val) => { setSelectedType(val); setCurrentPage(1); }}
          />
        </FilterDrawer>

        {/* Mobile sticky FAB */}
        <div className="xl:hidden fixed bottom-6 right-5 z-50">
          <m.button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open filters"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full
              bg-slate-900 dark:bg-white text-white dark:text-slate-900
              shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-sm font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent-tech text-white text-[10px] font-black
                inline-flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </m.button>
        </div>

      </main>
    </>
  );
}
