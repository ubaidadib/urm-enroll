import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { m } from "motion/react";
import {
  Building2,
  Clock,
  GraduationCap,
  Globe2,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  Languages,
  Shield,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";
import { Breadcrumbs } from "../components/layout/breadcrumbs";
import { ProgramCardModern, UniversityCardModern } from "../components/ui/modern-cards";
import { PageTabs } from "../components/ui/page-tabs";
import { QuickStatsBar } from "../components/ui/quick-stats-bar";
import { getDestinationBySlug, type LangKey } from "@/data/destinations";
import { UNIVERSITIES, type University, type Program } from "@/data/universities";

// ── helpers ──────────────────────────────────────────────────────────────────
function getUniversitiesForCountry(country: string): University[] {
  return UNIVERSITIES.filter((u) => u.country === country);
}

function getAllPrograms(universities: University[]): Array<Program & { universityName: string; universityId: string; universityLogo: string; universityCoverPhoto: string }> {
  return universities.flatMap((u) =>
    u.programs.map((p) => ({ ...p, universityName: u.name, universityId: u.id, universityLogo: u.logo, universityCoverPhoto: u.coverPhoto }))
  );
}

// ── sub-components ───────────────────────────────────────────────────────────
function UniversityCard({ uni }: { uni: University }) {
  const { t } = useLanguage();
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/universities/${uni.id}`}
        className="block p-5 rounded-2xl border border-border/50 bg-bg-surface hover:shadow-md hover:-translate-y-0.5 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-bg-secondary border border-border/50 flex items-center justify-center">
            {uni.logo ? (
              <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain p-1" loading="lazy" />
            ) : (
              <Building2 className="w-6 h-6 text-text-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-text-primary text-base leading-tight mb-1 group-hover:text-accent-primary-text transition-colors">
              {uni.name}
            </h3>
            <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              {uni.city}{uni.country ? `, ${uni.country}` : ""}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {uni.programs.slice(0, 4).map((prog) => (
                <span
                  key={prog.id}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-accent-primary/10 text-accent-primary-text border border-accent-primary/20 font-semibold"
                >
                  {prog.name}
                </span>
              ))}
              {uni.programs.length > 4 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-bg-secondary border border-border/50 text-text-muted font-semibold">
                  +{uni.programs.length - 4} {t<string>("destinations.detail.more")}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary-text group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>
      </Link>
    </m.div>
  );
}

function ProgramRow({ prog }: { prog: Program & { universityName: string } }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-bg-surface hover:shadow-sm transition-shadow">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
        <GraduationCap className="w-5 h-5 text-accent-primary-text" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-text-primary text-sm leading-tight">{prog.name}</p>
        <p className="text-xs text-text-muted truncate">{prog.universityName}</p>
      </div>
      <div className="shrink-0 text-end">
        <p className="text-xs font-bold text-text-secondary">{prog.duration}</p>
        {prog.tuitionPerYear > 0 && (
          <p className="text-[10px] text-text-muted">{prog.tuitionCurrency} {prog.tuitionPerYear.toLocaleString()}/yr</p>
        )}
      </div>
    </div>
  );
}

// ── CountryDetailPage ────────────────────────────────────────────────────────
export function CountryDetailPage() {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const { t, language, dir } = useLanguage();
  const lang = (language as LangKey) || "en";

  const dest = countrySlug ? getDestinationBySlug(countrySlug) : undefined;
  const universities = dest ? getUniversitiesForCountry(dest.code) : [];
  const allPrograms = getAllPrograms(universities);

  const [activeTab, setActiveTab] = useState("overview");

  if (!dest) {
    return <Navigate to="/destinations" replace />;
  }

  const tx = (key: string, fallback: string): string => {
    try {
      const value = t<string>(key);
      return value && value !== key ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const tabs = [
    { id: "overview", label: tx("destinations.detail.overview", "Overview") },
    { id: "universities", label: `${tx("destinations.detail.universities", "Universities")} (${universities.length > 0 ? universities.length : dest.universities})` },
    { id: "programs", label: `${tx("destinations.detail.programs", "Programs")} (${allPrograms.length > 0 ? allPrograms.length : "—"})` },
    { id: "requirements", label: tx("destinations.detail.requirements", "Requirements") },
  ];

  const stats = [
    {
      icon: Building2,
      value: universities.length > 0 ? String(universities.length) : String(dest.universities),
      label: tx("destinations.detail.universities", "Universities"),
    },
    { icon: Clock, value: dest.visaTimeline, label: tx("destinations.detail.visaTimeline", "Visa Timeline") },
    { icon: TrendingUp, value: `${dest.successRate}%`, label: tx("destinations.detail.successRate", "Success Rate") },
    { icon: GraduationCap, value: dest.avgTuitionFee, label: tx("destinations.detail.avgTuition", "Avg. Tuition") },
  ];

  return (
    <main className="min-h-screen bg-bg-primary" dir={dir}>
      <SeoManager
        title={`Study in ${dest.name.en} — URM Enroll`}
        description={dest.tagline[lang]}
        path={`/destinations/${dest.slug}`}
        breadcrumbs={[
          { name: tx("seo.siteName", "URM Enroll"), path: "/" },
          { name: tx("header.nav.destinations", "Destinations"), path: "/destinations" },
          { name: dest.name[lang], path: `/destinations/${dest.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] page-hero-offset pb-2">
        <Breadcrumbs
          items={[
            { label: tx("common.home", "Home"), href: "/" },
            { label: tx("header.nav.destinations", "Destinations"), href: "/destinations" },
            { label: dest.name[lang], href: `/destinations/${dest.slug}` },
          ]}
        />
      </div>

      {/* Hero section */}
      <div className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 h-96 lg:h-72 xl:h-80">
          <img
            src={dest.image}
            alt={dest.name[lang]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-background-primary" />
        </div>

        <div className="relative max-w-7xl mx-auto px-[var(--content-gutter)] pt-12 lg:pt-8 pb-0">
          {/* Back link */}
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {tx("destinations.detail.allDestinations", "All Destinations")}
          </Link>

          {/* Country header */}
          <div className="flex items-end gap-6 pb-8 lg:pb-7">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl sm:text-5xl" role="img" aria-hidden="true">
                  {dest.flag}
                </span>
                <div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                    {dest.name[lang]}
                  </h1>
                  <p className="text-white/70 text-lg mt-1">{dest.tagline[lang]}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {dest.languageLevels.map((level) => (
                  <span
                    key={level}
                    className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-xs font-black tracking-wide"
                  >
                    {level}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-lg bg-white/20 border border-white/30 text-white text-xs font-black tracking-wide">
                  {dest.region[lang]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] -mt-2">
        <QuickStatsBar stats={stats} />
      </div>

      {/* Tabs */}
      <PageTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        ariaLabel={`${dest.name[lang]} information tabs`}
        stickyTopClass="top-16"
      />

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-[var(--content-gutter)] py-10">
        {/* ── Overview ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Key benefits */}
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="text-2xl font-black text-text-primary mb-4">
                  {tx("destinations.detail.whyStudy", "Why Study in")} {dest.name[lang]}?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.keyBenefits[lang].map((benefit, i) => (
                    <m.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-bg-surface"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary font-medium">{benefit}</span>
                    </m.div>
                  ))}
                </div>
              </section>

              {/* Top programs preview */}
              <section>
                <h2 className="text-xl font-black text-text-primary mb-3">{t<string>("destinations.detail.topPrograms")}</h2>
                <div className="flex flex-wrap gap-2">
                  {dest.topPrograms.map((prog) => (
                    <span
                      key={prog}
                      className="px-3 py-1.5 rounded-xl border border-accent-primary/30 bg-accent-primary/10 text-accent-primary-text text-sm font-bold"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </section>

              {/* Recommended for */}
              <section className="p-5 rounded-2xl border border-accent-tech/30 bg-accent-tech/5">
                <h2 className="text-sm font-black text-accent-tech uppercase tracking-wide mb-2">
                  {tx("destinations.detail.bestFor", "Best For")}
                </h2>
                <p className="text-text-secondary text-sm">{dest.recommendedFor[lang]}</p>
              </section>
            </div>

            {/* Visa insights sidebar */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-border/50 bg-bg-surface">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-accent-primary-text" />
                  <h3 className="font-black text-text-primary">{t<string>("destinations.detail.visaInsights")}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {dest.visaInsights[lang]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-xl bg-bg-secondary border border-border/50">
                    <div className="text-lg font-black text-accent-primary-text">{dest.visaTimeline}</div>
                    <div className="text-[10px] uppercase tracking-wide text-text-muted font-semibold mt-0.5">{t<string>("destinations.detail.processing")}</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-bg-secondary border border-border/50">
                    <div className="text-lg font-black text-accent-success">{dest.successRate}%</div>
                    <div className="text-[10px] uppercase tracking-wide text-text-muted font-semibold mt-0.5">{t<string>("destinations.detail.approvals")}</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border/50 bg-bg-surface">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-5 h-5 text-accent-tech" />
                  <h3 className="font-black text-text-primary">{t<string>("destinations.detail.languageLevels")}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dest.languageLevels.map((level) => (
                    <span
                      key={level}
                      className="px-3 py-1 rounded-lg bg-accent-tech/10 border border-accent-tech/30 text-accent-tech text-sm font-black"
                    >
                      {level}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-text-muted">{dest.complianceCheckpoint[lang]}</p>
              </div>

              {/* CTA */}
              <Link
                to="/contact"
                className="block w-full text-center px-6 py-4 rounded-2xl bg-accent-primary text-ink font-black text-sm hover:opacity-90 transition-opacity"
              >
                {tx("destinations.detail.startApplication", "Start Application")} →
              </Link>
              <button
                onClick={() => setActiveTab("universities")}
                className="block w-full text-center px-6 py-3 rounded-2xl border border-border/50 bg-bg-surface text-text-primary font-bold text-sm hover:border-accent-primary hover:text-accent-primary-text transition-colors"
              >
                {tx("destinations.detail.browseUniversities", "Browse Universities")}
              </button>
            </div>
          </div>
        )}

        {/* ── Universities ──────────────────────────────────────────────── */}
        {activeTab === "universities" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-text-primary">
                {tx("destinations.detail.universitiesIn", "Universities in")} {dest.name[lang]}
              </h2>
              {universities.length === 0 && (
                <span className="text-sm text-text-muted">
                  {dest.universities} {tx("destinations.detail.universitiesViaNetwork", "universities available via our network")}
                </span>
              )}
            </div>
            {universities.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {universities.map((uni) => (
                  <UniversityCardModern
                    key={uni.id}
                    id={uni.id}
                    countryCode={uni.countryCode}
                    name={uni.name}
                    country={uni.country}
                    city={uni.city}
                    programsCount={uni.programsCount}
                    logo={uni.logo}
                    coverPhoto={uni.coverPhoto}
                    ranking={uni.ranking}
                    type={uni.type}
                    established={uni.established}
                    description={uni.description}
                    website={uni.website}
                    size="compact"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border/50 rounded-2xl">
                <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-black text-text-primary mb-2">
                  {dest.universities}+ {tx("destinations.detail.universitiesAvailable", "Universities Available")}
                </h3>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  Access {dest.directAgreements} direct agreements and {dest.platformAccess} platform universities in {dest.name[lang]}.
                </p>
                <Link
                  to="/universities"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-ink font-black text-sm hover:opacity-90 transition-opacity"
                >
                  {tx("destinations.detail.browseAllUniversities", "Browse All Universities")} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Programs ──────────────────────────────────────────────────── */}
        {activeTab === "programs" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-text-primary">
                {tx("destinations.detail.programsIn", "Programs in")} {dest.name[lang]}
              </h2>
            </div>
            {allPrograms.length > 0 ? (
              <div className="space-y-3">
                {allPrograms.map((prog) => (
                  <ProgramCardModern
                    key={prog.id}
                    id={prog.id}
                    universityId={prog.universityId}
                    name={prog.name}
                    university={prog.universityName}
                    universityLogo={prog.universityLogo}
                    coverPhoto={prog.coverPhoto || prog.universityCoverPhoto}
                    degreeLevel={prog.degreeLevel}
                    field={prog.field}
                    duration={prog.duration}
                    language={prog.language}
                    tuitionPerYear={prog.tuitionPerYear}
                    tuitionCurrency={prog.tuitionCurrency}
                    description={prog.description}
                    requirements={prog.requirements}
                    size="compact"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border/50 rounded-2xl">
                <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-black text-text-primary mb-2">
                  {tx("destinations.detail.programsViaNetwork", "Programs Available via Network")}
                </h3>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  {tx("destinations.detail.programsViaNetworkDesc", "Access hundreds of programs and more.")}
                </p>
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-ink font-black text-sm hover:opacity-90 transition-opacity"
                >
                  {tx("destinations.detail.browseAllPrograms", "Browse All Programs")} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Requirements ─────────────────────────────────────────────── */}
        {activeTab === "requirements" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-black text-text-primary mb-4">
                {tx("destinations.detail.admissionRequirements", "Admission Requirements")}
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-border/50 bg-bg-surface">
                  <h3 className="font-black text-text-primary mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-accent-tech" />
                    {tx("destinations.detail.languageLevelsRequired", "Language Levels Required")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dest.languageLevels.map((level) => (
                      <span
                        key={level}
                        className="px-3 py-1.5 rounded-xl bg-accent-tech/10 border border-accent-tech/30 text-accent-tech font-black text-sm"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-border/50 bg-bg-surface">
                  <h3 className="font-black text-text-primary mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent-primary-text" />
                    {tx("destinations.detail.compliance", "Compliance Checkpoint")}
                  </h3>
                  <p className="text-sm text-text-secondary">{dest.complianceCheckpoint[lang]}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-text-primary mb-4">
                {tx("destinations.detail.visaProcess", "Visa Process")}
              </h2>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-border/50 bg-bg-surface">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {dest.visaInsights[lang]}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border border-border/50 bg-bg-surface text-center">
                    <div className="text-2xl font-black text-accent-primary-text mb-1">{dest.visaTimeline}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wide font-semibold">{t<string>("destinations.detail.visaTime")}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/50 bg-bg-surface text-center">
                    <div className="text-2xl font-black text-accent-success mb-1">{dest.successRate}%</div>
                    <div className="text-xs text-text-muted uppercase tracking-wide font-semibold">{t<string>("destinations.detail.successRate")}</div>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-4 rounded-2xl bg-accent-primary text-ink font-black text-sm hover:opacity-90 transition-opacity"
                >
                  {tx("destinations.detail.getVisaSupport", "Get Visa Support")} →
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
