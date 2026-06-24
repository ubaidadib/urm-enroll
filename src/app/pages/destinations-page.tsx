import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { DiscoveryBridgeSection, buildDiscoveryQuery } from "../components/ui/discovery-nav";
import { EnhancedSearch } from "../components/ui/enhanced-search";
import { ContextualPageHeader } from "../components/ui/contextual-page-header";
import { SeoManager } from "../seo/seo-manager";
import { useLanguage } from "@/i18n/language-context";
import { DESTINATIONS, type Destination, type LangKey } from "@/data/destinations";
import { UNIVERSITIES } from "@/data/universities";
import { usePersonalization } from "@/hooks/usePersonalization";
import { Building2, Globe2, GraduationCap, ChevronRight } from "lucide-react";

// ── helpers ─────────────────────────────────────────────────────────────────
function getTotalPrograms(): number {
  return UNIVERSITIES.reduce((acc, u) => acc + u.programs.length, 0);
}
function getProgramsForCountry(countryCode: string): number {
  return UNIVERSITIES.filter((u) => u.country === countryCode).reduce(
    (acc, u) => acc + u.programs.length,
    0
  );
}
function getUniversitiesForCountry(countryCode: string): number {
  return UNIVERSITIES.filter((u) => u.country === countryCode).length;
}

// ── CountryCard ──────────────────────────────────────────────────────────────
function CountryCard({ dest, lang }: { dest: Destination; lang: LangKey }) {
  const uniCount = getUniversitiesForCountry(dest.code);
  const progCount = getProgramsForCountry(dest.code);
  const displayUnis = uniCount > 0 ? uniCount : dest.universities;

  const tierLabel =
    dest.tier === 1 ? "Top Pick" : dest.tier === 2 ? "Growth" : "Fast Track";
  const tierStyle =
    dest.tier === 1
      ? "bg-accent-success/20 border-accent-success/30 text-accent-success"
      : dest.tier === 2
      ? "bg-accent-tech/20 border-accent-tech/30 text-accent-tech"
      : "bg-accent-primary/20 border-accent-primary/30 text-accent-primary";

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link
        to={`/destinations/${dest.slug}`}
        className="block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-accent-tech/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-tech"
        aria-label={`Explore ${dest.name[lang]}`}
      >
        {/* Hero image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={dest.image}
            alt={dest.name[lang]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 start-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${tierStyle}`}
            >
              {tierLabel}
            </span>
          </div>
          <div className="absolute bottom-0 start-0 end-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" role="img" aria-hidden="true">
                {dest.flag}
              </span>
              <h2 className="text-xl font-black text-white leading-tight">
                {dest.name[lang]}
              </h2>
            </div>
            <p className="text-white/80 text-sm leading-snug line-clamp-2">
              {dest.tagline[lang]}
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {displayUnis}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                Universities
              </div>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-800">
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {progCount > 0 ? progCount : "—"}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                Programs
              </div>
            </div>
            <div className="text-center">
              <div className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {(dest.avgTuitionFee.split("–")[0] ?? dest.avgTuitionFee).trim()}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                Avg. Tuition
              </div>
            </div>
          </div>

          {/* Language levels */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {dest.languageLevels.map((level) => (
              <span
                key={level}
                className="px-2 py-0.5 rounded-md text-[10px] font-black border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 tracking-wide"
              >
                {level}
              </span>
            ))}
          </div>

          {/* Top programs */}
          <div className="flex flex-wrap gap-1 mb-4">
            {dest.topPrograms.slice(0, 3).map((prog) => (
              <span
                key={prog}
                className="px-2 py-0.5 rounded-full text-[10px] bg-accent-primary/10 text-accent-primary border border-accent-primary/20 font-semibold"
              >
                {prog}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-sm font-black text-accent-tech group-hover:underline">
              Explore {dest.name[lang]}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-accent-tech group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </m.div>
  );
}

// ── filter types ─────────────────────────────────────────────────────────────
type AccessFilter = "all" | "scholarship";
type LangFilter = "all" | "English" | "German";
type RegionFilter = "all" | "Europe" | "Americas" | "Caucasus";

// ── DestinationsPage ─────────────────────────────────────────────────────────
export function DestinationsPage() {
  const { t, language, dir } = useLanguage();
  const lang = (language as LangKey) || "en";
  const { recordSignal } = usePersonalization();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>((searchParams.get("access") as AccessFilter) ?? "all");
  const [langFilter, setLangFilter] = useState<LangFilter>((searchParams.get("studyLang") as LangFilter) ?? "all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>((searchParams.get("region") as RegionFilter) ?? "all");

  useEffect(() => {
    recordSignal({ type: "page_view", page: "/destinations" });
  }, [recordSignal]);

  useEffect(() => {
    const nextSearch = searchParams.get("q") ?? "";
    const nextAccess = (searchParams.get("access") as AccessFilter) ?? "all";
    const nextStudyLang = (searchParams.get("studyLang") as LangFilter) ?? "all";
    const nextRegion = (searchParams.get("region") as RegionFilter) ?? "all";

    if (nextSearch !== search) setSearch(nextSearch);
    if (nextAccess !== accessFilter) setAccessFilter(nextAccess);
    if (nextStudyLang !== langFilter) setLangFilter(nextStudyLang);
    if (nextRegion !== regionFilter) setRegionFilter(nextRegion);
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (search.trim()) nextParams.set("q", search.trim());
    if (accessFilter !== "all") nextParams.set("access", accessFilter);
    if (langFilter !== "all") nextParams.set("studyLang", langFilter);
    if (regionFilter !== "all") nextParams.set("region", regionFilter);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [search, accessFilter, langFilter, regionFilter, searchParams, setSearchParams]);

  const tx = (key: string, fallback: string): string => {
    try {
      const value = t<string>(key);
      return value && value !== key ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const totalPrograms = getTotalPrograms();

  const filtered = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        d.name[lang].toLowerCase().includes(q) ||
        d.name.en.toLowerCase().includes(q) ||
        d.tagline[lang].toLowerCase().includes(q) ||
        d.region[lang].toLowerCase().includes(q);
      const matchesAccess =
        accessFilter === "all" ||
        (accessFilter === "scholarship" &&
          d.keyBenefits.en.some(
            (b) =>
              b.toLowerCase().includes("scholarship") ||
              b.toLowerCase().includes("stipend")
          ));
      const matchesLang =
        langFilter === "all" ||
        (langFilter === "English" &&
          d.keyBenefits.en.some((b) => b.toLowerCase().includes("english"))) ||
        (langFilter === "German" && d.iso === "DE");
      const matchesRegion =
        regionFilter === "all" || d.region.en === regionFilter;
      return matchesSearch && matchesAccess && matchesLang && matchesRegion;
    });
  }, [search, accessFilter, langFilter, regionFilter, lang]);

  const pillBase =
    "px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer whitespace-nowrap";
  const pillActive = "chip-active";
  const pillInactive =
    "bg-bg-surface text-text-muted border-border hover:border-accent-tech hover:text-accent-tech";
  const selectedCountry = filtered.length === 1 ? filtered.at(0)?.code : undefined;

  return (
    <main className="min-h-screen transition-colors duration-500 bg-bg-primary" dir={dir}>
      <SeoManager
        title={tx(
          "seo.sections.destinations.title",
          "Study Destinations — URM Enroll"
        )}
        description={tx(
          "seo.sections.destinations.description",
          "Explore universities and programs by country — find the perfect study destination."
        )}
        path="/destinations"
        breadcrumbs={[
          { name: tx("seo.siteName", "URM Enroll"), path: "/" },
          {
            name: tx("header.nav.destinations", "Destinations"),
            path: "/destinations",
          },
        ]}
      />


      <ContextualPageHeader
        badge="Study Destinations"
        title={tx(
          "destinations.listing.headline",
          "Choose Your Study Destination"
        )}
        description={tx(
          "destinations.listing.subtitle",
          "Explore universities and programs by country — find the perfect place to build your future"
        )}
        breadcrumbs={[
          { label: tx("common.home", "Home"), href: "/" },
          { label: tx("header.nav.destinations", "Destinations"), href: "/destinations" },
        ]}
        stats={[
          {
            icon: Globe2,
            value: `${DESTINATIONS.length}`,
            label: tx("destinations.stats.countries", "Countries"),
          },
          {
            icon: Building2,
            value: "1,400+",
            label: tx("destinations.stats.universities", "Universities"),
          },
          {
            icon: GraduationCap,
            value: totalPrograms > 0 ? `${totalPrograms}+` : "500+",
            label: "Programs",
          },
        ]}
        searchSlot={
          <EnhancedSearch
            variant="default"
            value={search}
            placeholder={t<string>("search.placeholder.destinations")}
            submitLabel={t<string>("search.button.label")}
            clearLabel={t<string>("search.clear")}
            onChange={setSearch}
            onSearch={setSearch}
          />
        }
      />

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-20 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`${pillBase} ${accessFilter === "all" ? pillActive : pillInactive}`}
                onClick={() => setAccessFilter("all")}
              >
                All
              </button>
              <button
                className={`${pillBase} ${accessFilter === "scholarship" ? pillActive : pillInactive}`}
                onClick={() => setAccessFilter("scholarship")}
              >
                Scholarship Available
              </button>
              <div className="w-px h-8 self-center bg-slate-200 dark:bg-slate-800 hidden md:block" />
              <button
                className={`${pillBase} ${langFilter === "all" ? pillActive : pillInactive}`}
                onClick={() => setLangFilter("all")}
              >
                All Languages
              </button>
              <button
                className={`${pillBase} ${langFilter === "English" ? pillActive : pillInactive}`}
                onClick={() => setLangFilter("English")}
              >
                English
              </button>
              <button
                className={`${pillBase} ${langFilter === "German" ? pillActive : pillInactive}`}
                onClick={() => setLangFilter("German")}
              >
                German
              </button>
              <div className="w-px h-8 self-center bg-slate-200 dark:bg-slate-800 hidden md:block" />
              <button
                className={`${pillBase} ${regionFilter === "all" ? pillActive : pillInactive}`}
                onClick={() => setRegionFilter("all")}
              >
                All Regions
              </button>
              <button
                className={`${pillBase} ${regionFilter === "Europe" ? pillActive : pillInactive}`}
                onClick={() => setRegionFilter("Europe")}
              >
                Europe
              </button>
              <button
                className={`${pillBase} ${regionFilter === "Americas" ? pillActive : pillInactive}`}
                onClick={() => setRegionFilter("Americas")}
              >
                Americas
              </button>
              <button
                className={`${pillBase} ${regionFilter === "Caucasus" ? pillActive : pillInactive}`}
                onClick={() => setRegionFilter("Caucasus")}
              >
                Caucasus
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Showing{" "}
            <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{DESTINATIONS.length}</strong>{" "}
            destinations
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <Globe2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              No destinations match
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setAccessFilter("all");
                setLangFilter("all");
                setRegionFilter("all");
              }}
              className="px-6 py-3 rounded-xl btn-gold-primary font-black text-sm hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((dest) => (
                <CountryCard key={dest.code} dest={dest} lang={lang} />
              ))}
            </div>
            <DiscoveryBridgeSection
              eyebrow={t<string>("discovery.bridge.destinations.eyebrow")}
              title={t<string>("discovery.bridge.destinations.title")}
              description={t<string>("discovery.bridge.destinations.description")}
              primaryCta={{
                label: t<string>("discovery.bridge.destinations.primary"),
                href: `/universities${buildDiscoveryQuery({ q: search, country: selectedCountry })}`,
              }}
              secondaryCta={{
                label: t<string>("discovery.bridge.destinations.secondary"),
                href: `/programs${buildDiscoveryQuery({ q: search, country: selectedCountry })}`,
              }}
            />
          </>
        )}
      </div>
    </main>
  );
}
