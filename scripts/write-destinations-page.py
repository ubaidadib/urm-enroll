#!/usr/bin/env python3
"""Script to overwrite destinations-page.tsx with the new CountryCard grid design."""

content = r"""import { useEffect, useMemo, useState } from "react";
import { m } from "motion/react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { PageHero } from "../components/ui/page-hero";
import { SeoManager } from "../seo/seo-manager";
import { useLanguage } from "@/i18n/language-context";
import { DESTINATIONS, type Destination, type LangKey } from "@/data/destinations";
import { UNIVERSITIES } from "@/data/universities";
import { usePersonalization } from "@/hooks/usePersonalization";
import { Building2, Globe2, GraduationCap, Search, ChevronRight } from "lucide-react";

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
        className="block rounded-2xl overflow-hidden border border-border bg-background-surface hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
              <div className="text-lg font-black text-text-primary">
                {displayUnis}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-text-muted font-semibold">
                Universities
              </div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-lg font-black text-text-primary">
                {progCount > 0 ? progCount : "—"}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-text-muted font-semibold">
                Programs
              </div>
            </div>
            <div className="text-center">
              <div className="text-base font-black text-text-primary leading-tight">
                {dest.avgTuitionFee.split("–")[0].trim()}
              </div>
              <div className="text-[10px] uppercase tracking-wide text-text-muted font-semibold">
                Avg. Tuition
              </div>
            </div>
          </div>

          {/* Language levels */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {dest.languageLevels.map((level) => (
              <span
                key={level}
                className="px-2 py-0.5 rounded-md text-[10px] font-black border bg-background-primary border-border text-text-secondary tracking-wide"
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
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm font-black text-accent-primary group-hover:underline">
              Explore {dest.name[lang]}
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all" />
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

  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [langFilter, setLangFilter] = useState<LangFilter>("all");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");

  useEffect(() => {
    recordSignal({ type: "page_view", page: "/destinations" });
  }, [recordSignal]);

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
  const pillActive = "bg-accent-primary text-white border-accent-primary";
  const pillInactive =
    "bg-background-surface text-text-secondary border-border hover:border-accent-primary hover:text-accent-primary";

  return (
    <main className="min-h-screen bg-background-primary" dir={dir}>
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

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-2">
        <Breadcrumbs
          items={[
            { label: tx("common.home", "Home"), href: "/" },
            {
              label: tx("header.nav.destinations", "Destinations"),
              href: "/destinations",
            },
          ]}
        />
      </div>

      {/* Hero */}
      <PageHero
        badge={{ icon: "🌍", text: "Study Destinations" }}
        headline={tx(
          "destinations.listing.headline",
          "Choose Your Study Destination"
        )}
        subtitle={tx(
          "destinations.listing.subtitle",
          "Explore universities and programs by country — find the perfect place to build your future"
        )}
        size="compact"
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
      />

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-20 bg-background-primary/95 backdrop-blur-sm border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-shrink-0 w-full md:w-64">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-9 pe-4 py-2 rounded-xl border border-border bg-background-surface text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

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
              <div className="w-px h-8 self-center bg-border hidden md:block" />
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
              <div className="w-px h-8 self-center bg-border hidden md:block" />
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
          <p className="text-xs text-text-muted mt-2">
            Showing{" "}
            <strong className="text-text-primary">{filtered.length}</strong> of{" "}
            <strong className="text-text-primary">{DESTINATIONS.length}</strong>{" "}
            destinations
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-black text-text-primary mb-2">
              No destinations match
            </h3>
            <p className="text-text-secondary mb-6">
              Try adjusting or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setAccessFilter("all");
                setLangFilter("all");
                setRegionFilter("all");
              }}
              className="px-6 py-3 rounded-xl bg-accent-primary text-white font-black text-sm hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => (
              <CountryCard key={dest.code} dest={dest} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
"""

with open(
    "/Users/ubaidadib/Desktop/urm-enroll/src/app/pages/destinations-page.tsx",
    "w",
    encoding="utf-8",
) as f:
    f.write(content)

print(f"Written {len(content)} chars")
