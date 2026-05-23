import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { m } from "motion/react";
import { BookmarkX, GraduationCap, Building2 } from "lucide-react";
import { useFavorites, type FavoriteUniversity, type FavoriteProgram } from "@/app/context/favorites-context";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";
import { UniversityCardModern, ProgramCardModern } from "../components/ui/modern-cards";
import { UniversityCardSkeleton, ProgramCardSkeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/ui/empty-state";
import { PageTabs } from "../components/ui/page-tabs";
import { ContextualPageHeader } from "../components/ui/contextual-page-header";

export function SavedPage() {
  const { favorites, removeAllFavoritesByType } = useFavorites();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"universities" | "programs">("universities");
  const [isLoading, setIsLoading] = useState(true);

  const hasUniversities = favorites.universities.length > 0;
  const hasPrograms = favorites.programs.length > 0;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 260);
    return () => clearTimeout(timer);
  }, [tab, favorites.programs.length, favorites.universities.length]);

  const universitiesForCards = useMemo<Array<FavoriteUniversity & { programs: never[] }>>(
    () => favorites.universities.map((u: FavoriteUniversity) => ({ ...u, programs: [] as never[] })),
    [favorites.universities]
  );

  const tabs = [
    {
      id: "universities",
      label: `${t<string>("favorites.savedUniversities")} (${favorites.universities.length})`,
      icon: Building2,
    },
    {
      id: "programs",
      label: `${t<string>("favorites.savedPrograms")} (${favorites.programs.length})`,
      icon: GraduationCap,
    },
  ];

  const hasItemsInActiveTab = tab === "universities" ? hasUniversities : hasPrograms;

  return (
    <>
      <SeoManager title={t<string>("favorites.title")} description={t<string>("favorites.subtitle")} path="/saved" />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <ContextualPageHeader
          badge={t<string>("favorites.hero.badge")}
          title={t<string>("favorites.title")}
          description={t<string>("favorites.subtitle")}
          breadcrumbs={[
            { label: t<string>("common.home"), href: "/" },
            { label: t<string>("favorites.title"), href: "/saved" },
          ]}
          stats={[
            { icon: Building2, value: `${favorites.universities.length}`, label: t<string>("favorites.savedUniversities") },
            { icon: GraduationCap, value: `${favorites.programs.length}`, label: t<string>("favorites.savedPrograms") },
          ]}
        />

        <PageTabs
          tabs={tabs}
          activeTab={tab}
          onChange={(id) => setTab(id as "universities" | "programs")}
          stickyTopClass="top-24"
        />

        <section className="py-10">
          <div className="page-container">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => removeAllFavoritesByType(tab === "universities" ? "university" : "program")}
                disabled={!hasItemsInActiveTab}
                className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label={t<string>("favorites.removeAll")}
              >
                {t<string>("favorites.removeAll")}
              </button>
            </div>

            {tab === "universities" && (
              <m.div
                role="tabpanel"
                id="tabpanel-universities"
                aria-labelledby="tab-universities"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <UniversityCardSkeleton key={`saved-university-skeleton-${index}`} />
                    ))}
                  </div>
                ) : !hasUniversities ? (
                  <EmptyState
                    icon={BookmarkX}
                    title={t<string>("favorites.emptyUniversitiesTitle")}
                    description={t<string>("favorites.emptyUniversitiesDescription")}
                    cta={{ label: t<string>("header.nav.universities"), href: "/universities" }}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {universitiesForCards.map((university) => (
                      <UniversityCardModern
                        key={university.id}
                        id={university.id}
                        countryCode={university.countryCode}
                        name={university.name}
                        country={university.country}
                        city={university.city}
                        programsCount={university.programsCount}
                        logo={university.logo}
                        coverPhoto={university.coverPhoto}
                        ranking={university.ranking}
                        type={university.type}
                        languages={university.languages.slice(0, 3)}
                        established={university.established}
                        description={university.description}
                        website={university.website}
                        size="compact"
                        onViewDetails={() => navigate(`/universities/${university.id}`)}
                      />
                    ))}
                  </div>
                )}
              </m.div>
            )}

            {tab === "programs" && (
              <m.div
                role="tabpanel"
                id="tabpanel-programs"
                aria-labelledby="tab-programs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <ProgramCardSkeleton key={`saved-program-skeleton-${index}`} />
                    ))}
                  </div>
                ) : !hasPrograms ? (
                  <EmptyState
                    icon={BookmarkX}
                    title={t<string>("favorites.emptyProgramsTitle")}
                    description={t<string>("favorites.emptyProgramsDescription")}
                    cta={{ label: t<string>("header.nav.programs"), href: "/programs" }}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.programs.map((program: FavoriteProgram) => (
                      <ProgramCardModern
                        key={program.id}
                        id={program.id}
                        universityId={program.universityId}
                        name={program.name}
                        university={program.universityName}
                        universityLogo={program.universityLogo}
                        degreeLevel={program.degreeLevel}
                        field={program.field}
                        duration={program.duration}
                        language={program.language}
                        tuitionPerYear={program.tuitionPerYear}
                        tuitionCurrency={program.tuitionCurrency}
                        description={program.description}
                        requirements={program.requirements}
                        size="compact"
                        onApply={() => navigate(`/programs/${program.id}`)}
                      />
                    ))}
                  </div>
                )}
              </m.div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

