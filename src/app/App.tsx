import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { Preloader } from "./components/layout/preloader";
import { SectionSkeleton } from "./components/layout/section-skeleton";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { LanguageProvider, useLanguage } from "@/i18n/language-context";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BookingModalProvider } from "./components/ui/booking-modal";
import { ComparisonProvider } from "./context/comparison-context";
import { FavoritesProvider } from "./context/favorites-context";
import { AppShell } from "./components/layout/app-shell";
import { FocusShell } from "./components/layout/focus-shell";
import { MIRROR_CATALOG_READY_EVENT } from "@/lib/mirror-catalog";
import { LegalPage } from "./pages/legal-page";
import { LegalNotFound } from "./pages/not-found-page";
import type { SupportedLanguage } from "../i18n/types";

const HomePage = lazy(() => import("./pages/home-page.tsx").then((mod) => ({ default: mod.HomePage })));
const ServicesPage = lazy(() => import("./pages/services-page.tsx").then((mod) => ({ default: mod.ServicesPage })));
const DestinationsPage = lazy(() => import("./pages/destinations-page.tsx").then((mod) => ({ default: mod.DestinationsPage })));
const NursingPage = lazy(() => import("./pages/nursing-page.tsx").then((mod) => ({ default: mod.NursingPage })));
const PartnershipsPage = lazy(() => import("./pages/partnerships-page.tsx").then((mod) => ({ default: mod.PartnershipsPage })));
const AboutPage = lazy(() => import("./pages/about-page.tsx").then((mod) => ({ default: mod.AboutPage })));
const ContactPage = lazy(() => import("./pages/contact-page.tsx").then((mod) => ({ default: mod.ContactPage })));
const QuizPage = lazy(() => import("./pages/quiz-page.tsx").then((mod) => ({ default: mod.QuizPage })));
const NursingAssessmentPage = lazy(() =>
  import("./pages/nursing-assessment-page.tsx").then((mod) => ({ default: mod.NursingAssessmentPage }))
);
const ResourcesPage = lazy(() => import("./pages/resources-page.tsx").then((mod) => ({ default: mod.ResourcesPage })));
const UniversitiesPage = lazy(() => import("./pages/universities-page.tsx").then((mod) => ({ default: mod.UniversitiesPage })));
const UniversityDetailPage = lazy(() =>
  import("./pages/university-detail-page.tsx").then((mod) => ({ default: mod.UniversityDetailPage }))
);
const ProgramsPage = lazy(() => import("./pages/programs-page.tsx").then((mod) => ({ default: mod.ProgramsPage })));
const ProgramDetailPage = lazy(() => import("./pages/program-detail-page.tsx").then((mod) => ({ default: mod.ProgramDetailPage })));
const ComparePage = lazy(() => import("./pages/compare-page.tsx").then((mod) => ({ default: mod.ComparePage })));
const SavedPage = lazy(() => import("./pages/saved-page.tsx").then((mod) => ({ default: mod.SavedPage })));
const HowToApplyGermanUniversityPage = lazy(() =>
  import("./pages/articles/how-to-apply-german-university.tsx").then((mod) => ({ default: mod.HowToApplyGermanUniversityPage }))
);
const StudentVisaGermanyGuidePage = lazy(() =>
  import("./pages/articles/student-visa-germany-guide.tsx").then((mod) => ({ default: mod.StudentVisaGermanyGuidePage }))
);
const FreeUniversitiesGermanyPage = lazy(() =>
  import("./pages/articles/free-universities-germany.tsx").then((mod) => ({ default: mod.FreeUniversitiesGermanyPage }))
);
const CountryDetailPage = lazy(() =>
  import("./pages/country-detail-page.tsx").then((mod) => ({ default: mod.CountryDetailPage }))
);

const ChancenkartePage = lazy(() =>
  import("./pages/germany/chancenkarte-page.tsx").then((mod) => ({ default: mod.ChancenkartePage }))
);
const ChancenkarteEligibilityPage = lazy(() =>
  import("./pages/germany/chancenkarte-eligibility-page.tsx").then((mod) => ({ default: mod.ChancenkarteEligibilityPage }))
);
const ChancenkarteProcessPage = lazy(() =>
  import("./pages/germany/chancenkarte-process-page.tsx").then((mod) => ({ default: mod.ChancenkarteProcessPage }))
);
const ChancenkarteRequirementsPage = lazy(() =>
  import("./pages/germany/chancenkarte-requirements-page.tsx").then((mod) => ({ default: mod.ChancenkarteRequirementsPage }))
);
const ChancenkarteSuccessStoriesPage = lazy(() =>
  import("./pages/germany/chancenkarte-success-stories-page.tsx").then((mod) => ({ default: mod.ChancenkarteSuccessStoriesPage }))
);
const ChancenkarteFaqPage = lazy(() =>
  import("./pages/germany/chancenkarte-faq-page.tsx").then((mod) => ({ default: mod.ChancenkarteFaqPage }))
);
const GermanyJobsPage = lazy(() =>
  import("./pages/germany/germany-jobs-page.tsx").then((mod) => ({ default: mod.GermanyJobsPage }))
);
const GermanyRelocationPage = lazy(() =>
  import("./pages/germany/germany-relocation-page.tsx").then((mod) => ({ default: mod.GermanyRelocationPage }))
);

function LocaleRoute() {
  const { lang } = useParams();
  const { setLanguageForRoute } = useLanguage();

  useEffect(() => {
    if (lang === "en" || lang === "ar" || lang === "de") {
      setLanguageForRoute(lang as SupportedLanguage);
    }
  }, [lang, setLanguageForRoute]);

  if (lang !== "en" && lang !== "ar" && lang !== "de") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setCatalogVersion] = useState(0);

  useEffect(() => {
    const handleCatalogReady = () => {
      setCatalogVersion((version) => version + 1);
    };

    window.addEventListener(MIRROR_CATALOG_READY_EVENT, handleCatalogReady);
    return () => window.removeEventListener(MIRROR_CATALOG_READY_EVENT, handleCatalogReady);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <ComparisonProvider>
            <BookingModalProvider>
            <ErrorBoundary>
              <LazyMotion features={domAnimation} strict>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <AnimatePresence mode="wait">
                    {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
                  </AnimatePresence>

                  {!isLoading && (
                    <Suspense fallback={<SectionSkeleton />}>
                      <Routes>
                        <Route element={<AppShell />}>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/services" element={<ServicesPage />} />
                          <Route path="/programs" element={<ProgramsPage />} />
                          <Route path="/programs/:id" element={<ProgramDetailPage />} />
                          <Route path="/compare" element={<ComparePage />} />
                          <Route path="/saved" element={<SavedPage />} />
                          <Route path="/destinations" element={<DestinationsPage />} />
                                                    <Route path="/destinations/:countrySlug" element={<CountryDetailPage />} />
                          <Route path="/universities" element={<UniversitiesPage />} />
                          <Route path="/universities/:id" element={<UniversityDetailPage />} />
                          <Route path="/nursing" element={<NursingPage />} />
                          <Route path="/nursing-assessment" element={<NursingAssessmentPage />} />
                          <Route path="/germany-jobs" element={<GermanyJobsPage />} />
                          <Route path="/germany-relocation" element={<GermanyRelocationPage />} />
                          <Route path="/chancenkarte" element={<ChancenkartePage />} />
                          <Route path="/chancenkarte/eligibility" element={<ChancenkarteEligibilityPage />} />
                          <Route path="/chancenkarte/process" element={<ChancenkarteProcessPage />} />
                          <Route path="/chancenkarte/requirements" element={<ChancenkarteRequirementsPage />} />
                          <Route path="/chancenkarte/success-stories" element={<ChancenkarteSuccessStoriesPage />} />
                          <Route path="/chancenkarte/faq" element={<ChancenkarteFaqPage />} />
                          <Route path="/partnerships" element={<PartnershipsPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/resources" element={<ResourcesPage />} />
                          <Route
                            path="/resources/how-to-apply-german-university"
                            element={<HowToApplyGermanUniversityPage />}
                          />
                          <Route
                            path="/resources/student-visa-germany-guide"
                            element={<StudentVisaGermanyGuidePage />}
                          />
                          <Route
                            path="/resources/free-universities-germany"
                            element={<FreeUniversitiesGermanyPage />}
                          />
                          <Route path="/privacy" element={<LegalPage pageKey="privacy" />} />
                          <Route path="/terms" element={<LegalPage pageKey="terms" />} />
                          <Route path="/cookies" element={<LegalPage pageKey="cookies" />} />
                          <Route path="/impressum" element={<LegalPage pageKey="impressum" />} />
                          <Route path="*" element={<LegalNotFound />} />
                        </Route>

                        <Route element={<FocusShell />}>
                          <Route path="/quiz" element={<QuizPage />} />
                        </Route>

                        <Route path="/:lang" element={<LocaleRoute />}>
                          <Route element={<AppShell />}>
                            <Route index element={<HomePage />} />
                            <Route path="services" element={<ServicesPage />} />
                            <Route path="programs" element={<ProgramsPage />} />
                            <Route path="programs/:id" element={<ProgramDetailPage />} />
                            <Route path="compare" element={<ComparePage />} />
                            <Route path="saved" element={<SavedPage />} />
                            <Route path="destinations" element={<DestinationsPage />} />
                                                        <Route path="destinations/:countrySlug" element={<CountryDetailPage />} />
                            <Route path="universities" element={<UniversitiesPage />} />
                            <Route path="universities/:id" element={<UniversityDetailPage />} />
                            <Route path="nursing" element={<NursingPage />} />
                            <Route path="nursing-assessment" element={<NursingAssessmentPage />} />
                            <Route path="germany-jobs" element={<GermanyJobsPage />} />
                            <Route path="germany-relocation" element={<GermanyRelocationPage />} />
                            <Route path="chancenkarte" element={<ChancenkartePage />} />
                            <Route path="chancenkarte/eligibility" element={<ChancenkarteEligibilityPage />} />
                            <Route path="chancenkarte/process" element={<ChancenkarteProcessPage />} />
                            <Route path="chancenkarte/requirements" element={<ChancenkarteRequirementsPage />} />
                            <Route path="chancenkarte/success-stories" element={<ChancenkarteSuccessStoriesPage />} />
                            <Route path="chancenkarte/faq" element={<ChancenkarteFaqPage />} />
                            <Route path="partnerships" element={<PartnershipsPage />} />
                            <Route path="about" element={<AboutPage />} />
                            <Route path="contact" element={<ContactPage />} />
                            <Route path="resources" element={<ResourcesPage />} />
                            <Route
                              path="resources/how-to-apply-german-university"
                              element={<HowToApplyGermanUniversityPage />}
                            />
                            <Route
                              path="resources/student-visa-germany-guide"
                              element={<StudentVisaGermanyGuidePage />}
                            />
                            <Route
                              path="resources/free-universities-germany"
                              element={<FreeUniversitiesGermanyPage />}
                            />
                            <Route path="privacy" element={<LegalPage pageKey="privacy" />} />
                            <Route path="terms" element={<LegalPage pageKey="terms" />} />
                            <Route path="cookies" element={<LegalPage pageKey="cookies" />} />
                            <Route path="impressum" element={<LegalPage pageKey="impressum" />} />
                            <Route path="*" element={<LegalNotFound />} />
                          </Route>

                          <Route element={<FocusShell />}>
                            <Route path="quiz" element={<QuizPage />} />
                          </Route>
                        </Route>
                      </Routes>
                    </Suspense>
                  )}
                </BrowserRouter>
              </LazyMotion>
            </ErrorBoundary>
            </BookingModalProvider>
          </ComparisonProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
