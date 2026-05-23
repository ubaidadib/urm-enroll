import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { m } from "motion/react";
import {
  MapPin,
  GraduationCap,
  Globe,
  Users,
  Calendar,
  Award,
  BookOpen,
  ExternalLink,
  Check,
  Download,
  Share2,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { SeoManager } from "../seo/seo-manager";
import { FavoriteButton } from "../components/ui/favorite-button";
import { Breadcrumb } from "../components/ui/breadcrumb";
import { ImageWithFallback } from "../components/ui/image-with-fallback";
import { ProgramCardModern, UniversityCardModern } from "../components/ui/modern-cards";
import { ProgramCardSkeleton, UniversityCardSkeleton } from "../components/ui/skeleton";
import { PageTabs } from "../components/ui/page-tabs";
import { QuickStatsBar } from "../components/ui/quick-stats-bar";
import { HorizontalScrollCarousel } from "../components/ui/horizontal-scroll-carousel";
import { getUniversityById, getFeaturedUniversities, UNIVERSITIES } from "@/data/universities";
import { trackPageView } from "@/utils/tracking";
import type { University } from "@/data/universities";

type Tab = "overview" | "programs" | "campus" | "requirements" | "location";

/**
 * University Detail Page (Enhanced)
 * Displays comprehensive information about a specific university with tabs
 */
export function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [programsTabLoading, setProgramsTabLoading] = useState(false);
  const [relatedUniversitiesLoading, setRelatedUniversitiesLoading] = useState(true);

  const university = useMemo(() => getUniversityById(id || ""), [id]);

  useEffect(() => {
    if (university) {
      trackPageView({ page: "university_detail" });
    }
  }, [university?.id]);

  useEffect(() => {
    setRelatedUniversitiesLoading(true);
    const timer = setTimeout(() => setRelatedUniversitiesLoading(false), 260);
    return () => clearTimeout(timer);
  }, [university?.id]);

  useEffect(() => {
    if (activeTab !== "programs") {
      return;
    }

    setProgramsTabLoading(true);
    const timer = setTimeout(() => setProgramsTabLoading(false), 260);
    return () => clearTimeout(timer);
  }, [activeTab, university?.id]);

  if (!university) {
    return <Navigate to="/universities" replace />;
  }

  // Get related universities
  const relatedUniversities = useMemo(() => {
    return UNIVERSITIES.filter(
      (u) =>
        u.id !== university.id &&
        (u.country === university.country ||
          Math.abs(u.ranking - university.ranking) < 50)
    )
      .sort((a, b) => a.ranking - b.ranking)
      .slice(0, 4);
  }, [university]);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "programs", label: "Programs", icon: GraduationCap },
    { id: "campus", label: "Campus", icon: MapPin },
    { id: "requirements", label: "Requirements", icon: Check },
    { id: "location", label: "Location", icon: Globe },
  ];

  return (
    <>
      <SeoManager
        title={`${university.name} | URM Enroll`}
        description={university.description}
        path={`/universities/${university.id}`}
      />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Breadcrumbs */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-4 pb-6 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("header.nav.universities"), href: "/universities" },
                { label: university.name },
              ]}
            />
          </div>
        </div>


        {/* Hero Banner */}
        <section className="relative h-96 md:h-112.5 overflow-hidden bg-ink">
          <ImageWithFallback
            src={university.coverPhoto}
            alt={university.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[40px_40px]" />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-ink/80" />

          {/* Content Overlay */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute inset-0 flex items-end"
          >
            <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-6">
                  <div className="flex items-end gap-6">
                    {/* Logo */}
                    <div className="w-24 h-24 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                      <ImageWithFallback
                        src={university.logo}
                        alt={`${university.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="text-white">
                      <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        {university.name}
                      </h1>
                      <div className="flex items-center gap-6 text-lg opacity-90 flex-wrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          <span>
                            {university.city}, {university.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          <span>Ranking #{university.ranking}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 shrink-0">
                    <FavoriteButton
                      type="university"
                      item={university}
                      className="min-h-11 min-w-11 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    />
                    <button
                      aria-label="Share university"
                      className="rounded-lg border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </section>

        <QuickStatsBar
          stats={[
            { icon: Calendar, label: "Founded", value: university.established.toString() },
            { icon: BookOpen, label: "Programs", value: university.programsCount.toString() },
            { icon: Globe, label: "Languages", value: university.languages.length.toString() },
            { icon: Users, label: "Type", value: university.type.charAt(0).toUpperCase() + university.type.slice(1) },
            { icon: Award, label: "Ranking", value: `#${university.ranking}` },
          ]}
        />

        <PageTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as Tab)}
          ariaLabel="University detail sections"
        />

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="page-container">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <m.div
                id="tabpanel-overview"
                role="tabpanel"
                aria-labelledby="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  About {university.name}
                </h2>

                {/* Description */}
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-3xl">
                  {university.description}
                </p>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                  <HighlightCard
                    title="Accreditation"
                    description="Internationally recognized accreditation"
                    icon={Award}
                  />
                  <HighlightCard
                    title="Global Network"
                    description={`${university.languages.length} languages of instruction`}
                    icon={Globe}
                  />
                  <HighlightCard
                    title="Diverse Programs"
                    description={`${university.programsCount}+ academic programs`}
                    icon={BookOpen}
                  />
                  <HighlightCard
                    title="Established"
                    description={`${new Date().getFullYear() - university.established} years of excellence`}
                    icon={Calendar}
                  />
                </div>

                {/* Campus Photos */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Campus Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((idx) => (
                    <m.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="h-48 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-pointer"
                    >
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-${1506905925346 + idx}?auto=format&fit=crop&q=80&w=500`}
                        alt={`${university.name} campus ${idx}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </m.div>
                  ))}
                </div>
              </m.div>
            )}

            {/* Programs Tab */}
            {activeTab === "programs" && (
              <m.div
                id="tabpanel-programs"
                role="tabpanel"
                aria-labelledby="tab-programs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  Programs Offered
                </h2>

                {programsTabLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <ProgramCardSkeleton key={`university-program-skeleton-${index}`} />
                    ))}
                  </div>
                ) : university.programs.length > 0 ? (
                  <HorizontalScrollCarousel
                    title="Programs at this University"
                    viewAllHref="/programs"
                    items={university.programs.map((program) => (
                      <ProgramCardModern
                        key={program.id}
                        id={program.id}
                        universityId={university.id}
                        name={program.name}
                        university={university.name}
                        universityLogo={university.logo}
                        coverPhoto={program.coverPhoto || university.coverPhoto}
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
                  />
                ) : (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-950 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-400">
                      No programs available at the moment
                    </p>
                  </div>
                )}
              </m.div>
            )}

            {/* Campus Tab */}
            {activeTab === "campus" && (
              <m.div
                id="tabpanel-campus"
                role="tabpanel"
                aria-labelledby="tab-campus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  Campus Life
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Facilities & Resources
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Modern library and research centers",
                        "State-of-the-art laboratories",
                        "Student accommodation",
                        "Sports and recreation facilities",
                        "Cafeteria and dining services",
                        "Career development center",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                        >
                          <Check className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Student Support
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "International student support services",
                        "Academic advising and mentoring",
                        "Scholarship opportunities",
                        "Student clubs and organizations",
                        "Health and wellness services",
                        "Career placement support",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                        >
                          <Check className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </m.div>
            )}

            {/* Requirements Tab */}
            {activeTab === "requirements" && (
              <m.div
                id="tabpanel-requirements"
                role="tabpanel"
                aria-labelledby="tab-requirements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  Admission Requirements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Academic Requirements */}
                  <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Academic Requirements
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "High school diploma or equivalent",
                        "Minimum GPA: 3.0",
                        "Official transcripts",
                        "SAT or ACT scores (if applicable)",
                        "Bachelor's degree (for Master's programs)",
                      ].map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                        >
                          <Check className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Language Requirements */}
                  <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Language Requirements
                    </h3>
                    <ul className="space-y-4">
                      {[
                        "TOEFL: 80+ (if taught in English)",
                        "IELTS: 6.5+ (if taught in English)",
                        `${university.languages[0]} proficiency B1+ level (if applicable)`,
                        "English proficiency certificate",
                        "Language placement test",
                      ].map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                        >
                          <Check className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Application Info */}
                <div className="p-6 rounded-xl bg-accent-primary/5 border border-accent-primary/20">
                  <div className="flex items-start gap-4 mb-4">
                    <Calendar className="w-6 h-6 text-accent-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                        Application Deadline
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        Spring intake: December 31 | Fall intake: June 30
                      </p>
                    </div>
                  </div>
                </div>

                <button className="mt-8 px-6 py-3 rounded-lg bg-accent-primary text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Brochure
                </button>
              </m.div>
            )}

            {/* Location Tab */}
            {activeTab === "location" && (
              <m.div
                id="tabpanel-location"
                role="tabpanel"
                aria-labelledby="tab-location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  Location & Contact
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Map Placeholder */}
                  <div className="h-96 rounded-xl overflow-hidden bg-linear-to-br from-bg-secondary to-bg-tertiary flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">
                        Interactive map of {university.name}
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        {university.city}, {university.country}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Get in Touch
                    </h3>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-accent-primary shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Address
                          </p>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {university.city}, {university.country}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                        <Phone className="w-5 h-5 text-accent-primary shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Phone
                          </p>
                          <p className="text-slate-900 dark:text-white font-medium">
                            +49 123 456 789
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                        <Mail className="w-5 h-5 text-accent-primary shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Email
                          </p>
                          <p className="text-slate-900 dark:text-white font-medium">
                            admissions@{university.name.toLowerCase().replace(/\s+/g, "")}. de
                          </p>
                        </div>
                      </div>

                      {university.website && (
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Globe className="w-5 h-5 text-accent-primary shrink-0 mt-1" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                              Website
                            </p>
                            <p className="text-slate-900 dark:text-white font-medium hover:underline">
                              {university.website}
                            </p>
                          </div>
                        </a>
                      )}
                    </div>

                    <button className="mt-6 w-full px-6 py-3 rounded-lg bg-accent-primary text-white font-medium hover:shadow-lg transition-all">
                      Contact Admissions
                    </button>
                  </div>
                </div>
              </m.div>
            )}
          </div>
        </section>

        {/* Related Universities */}
        {relatedUniversities.length > 0 && (
          <section className="py-12 md:py-16 border-t border-slate-200 dark:border-slate-800">
            <div className="page-container">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  Similar Universities
                </h2>
                {relatedUniversitiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <UniversityCardSkeleton key={`related-university-skeleton-${index}`} />
                    ))}
                  </div>
                ) : (
                  <HorizontalScrollCarousel
                    title="Related Universities"
                    viewAllHref="/universities"
                    items={relatedUniversities.map((uni) => (
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
                        languages={uni.languages.slice(0, 2)}
                        established={uni.established}
                        description={uni.description}
                        website={uni.website}
                        size="compact"
                        onViewDetails={() => navigate(`/universities/${uni.id}`)}
                      />
                    ))}
                  />
                )}
              </m.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-linear-to-r from-accent-primary/10 via-accent-tech/5 to-transparent py-12 md:py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="page-container-narrow text-center">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Apply to {university.name}?
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Get personalized guidance from our admission experts to start your academic journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/contact")}
                  className="px-8 py-3 rounded-lg bg-accent-primary text-white font-medium hover:shadow-lg transition-all"
                >
                  Contact Advisor
                </button>
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </m.div>
          </div>
        </section>
      </main>
    </>
  );
}

/**
 * Highlight Card Component
 */
function HighlightCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Award;
}) {
  return (
    <m.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center"
    >
      <Icon className="w-8 h-8 text-accent-primary mx-auto mb-4" />
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </m.div>
  );
}

