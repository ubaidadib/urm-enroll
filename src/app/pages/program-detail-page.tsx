import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { m } from "motion/react";
import {
  Globe,
  BookOpen,
  Calendar,
  Award,
  Check,
  Clock,
  DollarSign,
  FileText,
  Briefcase,
  MapPin,
  AlertCircle,
  Loader2,
  User,
  GraduationCap as GraduationCapIcon,
  ChevronDown,
  ArrowRight as ArrowRightIcon,
  Upload,
  CheckCircle2,
  Send,
} from "lucide-react";

const NATIONALITIES = [
  "Afghan","Albanian","Algerian","Andorran","Angolan","Argentine","Armenian","Australian",
  "Austrian","Azerbaijani","Bahraini","Bangladeshi","Belarusian","Belgian","Bolivian",
  "Bosnian","Brazilian","British","Bulgarian","Cambodian","Cameroonian","Canadian",
  "Chilean","Chinese","Colombian","Congolese","Croatian","Cuban","Cypriot","Czech",
  "Danish","Dutch","Ecuadorian","Egyptian","Emirati","Eritrean","Estonian","Ethiopian",
  "Filipino","Finnish","French","Georgian","German","Ghanaian","Greek","Guatemalan",
  "Hungarian","Icelandic","Indian","Indonesian","Iranian","Iraqi","Irish","Israeli",
  "Italian","Jamaican","Japanese","Jordanian","Kazakhstani","Kenyan","Kuwaiti","Kyrgyz",
  "Latvian","Lebanese","Libyan","Lithuanian","Luxembourgish","Macedonian","Malaysian",
  "Maltese","Mauritanian","Mexican","Moldovan","Mongolian","Moroccan","Namibian",
  "Nepalese","New Zealander","Nigerian","Norwegian","Omani","Pakistani","Palestinian",
  "Panamanian","Peruvian","Polish","Portuguese","Qatari","Romanian","Russian","Rwandan",
  "Saudi","Senegalese","Serbian","Singaporean","Slovak","Slovenian","Somali",
  "South African","South Korean","Spanish","Sri Lankan","Sudanese","Swedish","Swiss",
  "Syrian","Taiwanese","Tajik","Tanzanian","Thai","Tunisian","Turkish","Ugandan",
  "Ukrainian","Uruguayan","Uzbek","Venezuelan","Vietnamese","Yemeni","Zambian","Zimbabwean",
].sort();
import {
  formatIntakeDates,
  formatSeasonsList,
} from "@/lib/courses/formatCourseDisplay";
import { useLanguage } from "@/i18n/language-context";
import { useComparison } from "@/app/context/comparison-context";
import { useFavorites } from "@/app/context/favorites-context";
import { SeoManager } from "../seo/seo-manager";
import { Breadcrumb } from "../components/ui/breadcrumb";
import { ProgramCardModern } from "../components/ui/modern-cards";
import { ProgramCardSkeleton } from "../components/ui/skeleton";
import { PageTabs } from "../components/ui/page-tabs";
import { QuickStatsBar, type QuickStatItem } from "../components/ui/quick-stats-bar";
import { HorizontalScrollCarousel } from "../components/ui/horizontal-scroll-carousel";
import { TurnstileWidget } from "../components/ui/turnstile-widget";
import { UNIVERSITIES } from "@/data/universities";
import { trackPageView } from "@/utils/tracking";
import { getPublicEnv } from "@/lib/env";
import { submitApplication } from "@/lib/application-submit";

type Tab = "overview" | "curriculum" | "requirements" | "career-outcomes" | "apply";

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

type RequirementsBlock = { heading?: string; bullets: string[]; paragraphs: string[] };

function parseRequirementsBlocks(raw: unknown): RequirementsBlock[] {
  if (typeof raw !== "string" || !raw.trim()) return [];

  const lines = raw
    .replace(/\t+/g, " ")
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: RequirementsBlock[] = [];
  let current: RequirementsBlock = { bullets: [], paragraphs: [] };

  const push = () => {
    if (current.heading || current.bullets.length || current.paragraphs.length) {
      blocks.push(current);
    }
    current = { bullets: [], paragraphs: [] };
  };

  for (const line of lines) {
    if (/:\s*$/.test(line) && line.length < 120 && !/^[•\-*–]/.test(line)) {
      push();
      current.heading = line.replace(/:\s*$/, "").trim();
      continue;
    }

    if (/^[•\-*–]\s*/.test(line)) {
      current.bullets.push(line.replace(/^[•\-*–]\s*/, "").trim());
      continue;
    }

    current.paragraphs.push(line);
  }

  push();
  return blocks;
}

/**
 * Program Detail Page
 * Displays comprehensive information about a specific program
 */
export function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [applicationStep, setApplicationStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [relatedProgramsLoading, setRelatedProgramsLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    nationality: "",
    phone: "",
    lastDegree: "",
    gpa: "",
    graduationYear: "",
    passportFile: "",
    transcriptFile: "",
  });

  const { turnstileSiteKey } = getPublicEnv();

  // Find the program and its university
  const { program, university } = useMemo(() => {
    for (const uni of UNIVERSITIES) {
      const prog = uni.programs.find((p) => p.id === id);
      if (prog) {
        return { program: prog, university: uni };
      }
    }
    return { program: undefined, university: undefined };
  }, [id]);

  useEffect(() => {
    if (program) {
      trackPageView({ page: "program_detail" });
    }
  }, [program?.id]);

  useEffect(() => {
    setRelatedProgramsLoading(true);
    const timer = setTimeout(() => setRelatedProgramsLoading(false), 260);
    return () => clearTimeout(timer);
  }, [program?.id]);

  if (!program || !university) {
    return <Navigate to="/programs" replace />;
  }

  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const selectedForCompare = isInComparison(program.id);
  const programSaved = isFavorite("program", program.id);

  const relatedPrograms = useMemo(() => {
    const sameField = UNIVERSITIES
      .filter((u) => u.id !== university.id)
      .flatMap((u) => u.programs.map((p) => ({ ...p, universityName: u.name, universityId: u.id, universityLogo: u.logo, universityCoverPhoto: u.coverPhoto })))
      .filter((p) => p.field === program.field)
      .slice(0, 3);

    if (sameField.length >= 3) {
      return sameField;
    }

    const fallback = UNIVERSITIES
      .filter((u) => u.id !== university.id)
      .flatMap((u) => u.programs.map((p) => ({ ...p, universityName: u.name, universityId: u.id, universityLogo: u.logo, universityCoverPhoto: u.coverPhoto })))
      .filter((p) => p.id !== program.id && !sameField.some((sp) => sp.id === p.id))
      .slice(0, 3 - sameField.length);

    return [...sameField, ...fallback];
  }, [program.field, university.id]);

  const requirementsRaw = useMemo(() => {
    // requirements is always [] from the mirror pipeline; the real requirements text
    // is stored in program.description (from Nexus requirements field via mappers.js)
    if (Array.isArray(program.requirements) && program.requirements.length > 0) {
      return program.requirements.join("\n");
    }
    if (typeof program.description === "string" && program.description.trim()) {
      return program.description.trim();
    }
    return "";
  }, [program.requirements, program.description]);

  const requirementBlocks = useMemo(
    () => parseRequirementsBlocks(requirementsRaw),
    [requirementsRaw],
  );

  const overviewParagraphs = useMemo(() => {
    const parts: string[] = [];

    // program.description likely contains raw requirements text from the pipeline.
    // Only surface it in Overview if it doesn't parse into requirement blocks.
    if (program.description?.trim() && requirementBlocks.length === 0) {
      parts.push(program.description.trim());
      return parts;
    }

    // Prefer "Other Information" block paragraphs (often contains a plain-text summary)
    const other = requirementBlocks.find((block) => /other information/i.test(block.heading ?? ""));
    if (other) {
      other.paragraphs.slice(0, 3).forEach((paragraph) => {
        if (paragraph.length < 400) parts.push(paragraph);
      });
    }

    // If still empty, surface the first 2 plain paragraphs from any block as a program summary
    if (parts.length === 0) {
      for (const block of requirementBlocks) {
        for (const paragraph of block.paragraphs) {
          if (paragraph.length > 20 && paragraph.length < 500) {
            parts.push(paragraph);
            if (parts.length >= 2) break;
          }
        }
        if (parts.length >= 2) break;
      }
    }

    return parts;
  }, [program.description, requirementBlocks]);

  const durationFromReqs = useMemo(() => {
    for (const block of requirementBlocks) {
      // Check bullets for duration info
      const durationBullet = block.bullets.find((bullet) => /\bduration\b/i.test(bullet));
      if (durationBullet) {
        // Extract value after "Duration:" or "Program Duration:" etc.
        const match = durationBullet.match(/(?:program\s+)?duration[:\s]+([^.•\n]+)/i);
        if (match?.[1]) return match[1].trim();
        return durationBullet.replace(/^[^:]+:\s*/i, "").trim();
      }
      // Check paragraphs
      const durationPara = block.paragraphs.find((entry) => /\bduration\b/i.test(entry));
      if (durationPara) {
        const match = durationPara.match(/(?:program\s+)?duration[:\s]+([^.•\n]+)/i);
        if (match?.[1]) return match[1].trim();
      }
    }

    return null;
  }, [requirementBlocks]);

  const languageFromReqs = useMemo(() => {
    if (program.language?.trim()) return program.language.trim();

    for (const block of requirementBlocks) {
      // Match bullets: "Study Language: English", "Language of Instruction: English", etc.
      const langBullet = block.bullets.find((bullet) =>
        /\bstudy\s+language\b|\blanguage\s+(?:of\s+)?(?:instruction|study)\b/i.test(bullet)
      );
      if (langBullet) {
        const match = langBullet.match(/(?:study\s+language|language\s+(?:of\s+)?(?:instruction|study))[:\s]+([^.•\n]+)/i);
        if (match?.[1]) return match[1].trim();
        return langBullet.replace(/^[^:]+:\s*/i, "").trim();
      }

      // Match paragraphs for "Study Language: English" style
      const paragraph = block.paragraphs.find((entry) =>
        /\bstudy\s+language\b|\blanguage\s+(?:of\s+)?(?:instruction|study)\b/i.test(entry)
      );
      if (paragraph) {
        const match = paragraph.match(/(?:study\s+language|language\s+(?:of\s+)?(?:instruction|study))[:\s]+([^.•\n]+)/i);
        if (match?.[1]) return match[1].trim();
      }
    }

    return null;
  }, [program.language, requirementBlocks]);

  const resolvedFeesLabel = (() => {
    // First try the structured fees object (now available from the pipeline)
    const fees = program.fees;
    if (fees) {
      const displayVal = Number(fees.display?.value);
      const displayCur = fees.display?.currency;
      if (displayVal > 0 && displayCur) return `${displayCur} ${displayVal.toLocaleString()}`;
      // fees.raw may be a JSON object from Supabase — guard against calling .trim() on non-strings
      if (typeof fees.raw === "string" && fees.raw.trim()) return fees.raw.trim();
      const baseVal = Number(fees.base);
      if (baseVal > 0) {
        const cur = fees.display?.currency || fees.original?.currency;
        return cur ? `${cur} ${baseVal.toLocaleString()}` : String(baseVal);
      }
      // Try original value as last resort
      const origVal = Number(fees.original?.value);
      const origCur = fees.original?.currency;
      if (origVal > 0 && origCur) return `${origCur} ${origVal.toLocaleString()}`;
    }
    if (program.feesText?.trim()) return program.feesText.trim();
    if (program.tuitionPerYear > 0) return `${program.tuitionCurrency || "EUR"} ${program.tuitionPerYear.toLocaleString()}`;
    return null;
  })();

  // Intake dates from the rich Nexus dates/seasons arrays
  const intakeLabels = formatIntakeDates(program.dates);
  const seasonLabels = formatSeasonsList(program.seasons);
  const firstIntake = intakeLabels[0] ?? (seasonLabels.length > 0 ? `${t<string>("programs.detail.intake")}: ${seasonLabels[0]}` : null);

  // Location from program-level city/country (more accurate than university-level)
  const programCity = (program.city as Record<string, unknown>)?.name as string | undefined;
  const programCountry = (program.country as Record<string, unknown>)?.name as string | undefined;
  const locationLabel = programCity && programCountry
    ? `${programCity}, ${programCountry}`
    : programCity || programCountry || `${university.city}${university.country ? `, ${university.country}` : ""}` || null;

  const stats: QuickStatItem[] = [
    resolvedFeesLabel
      ? { icon: DollarSign, label: t<string>("programs.detail.keyInfo.tuition"), value: resolvedFeesLabel }
      : { icon: DollarSign, label: t<string>("card.program.tuitionLabel"), value: "Contact university" },
    durationFromReqs ? { icon: Clock, label: t<string>("programs.detail.keyInfo.duration"), value: durationFromReqs } : null,
    languageFromReqs ? { icon: Globe, label: t<string>("programs.detail.keyInfo.language"), value: languageFromReqs } : null,
    firstIntake ? { icon: Calendar, label: t<string>("programs.detail.keyInfo.intake"), value: firstIntake } : null,
    locationLabel ? { icon: MapPin, label: t<string>("programs.detail.keyInfo.location"), value: locationLabel } : null,
  ].filter((item): item is QuickStatItem => Boolean(item));

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplicationSubmit = useCallback(async () => {
    setSubmitStatus("submitting");
    setSubmitError(null);

    const result = await submitApplication({
      fullName: formData.fullName,
      email: formData.email,
      nationality: formData.nationality,
      phone: formData.phone,
      lastDegree: formData.lastDegree,
      gpa: formData.gpa,
      graduationYear: formData.graduationYear,
      programId: program.id,
      programName: program.name,
      universityName: university.name,
      turnstileToken: turnstileToken || undefined,
    });

    if (result.ok) {
      setSubmitStatus("success");
    } else {
      setSubmitStatus("error");
      setSubmitError(result.error);
    }
  }, [formData, program.id, program.name, university.name, turnstileToken]);

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "overview", label: t<string>("programs.detail.tabs.overview"), icon: BookOpen },
    { id: "curriculum", label: t<string>("programs.detail.tabs.curriculum"), icon: Calendar },
    { id: "requirements", label: t<string>("programs.detail.tabs.requirements"), icon: Award },
    { id: "career-outcomes", label: t<string>("programs.detail.tabs.careerOutcomes"), icon: Globe },
    { id: "apply", label: t<string>("programs.detail.tabs.apply"), icon: FileText },
  ];

  const degreeColors: Record<string, string> = {
    bachelor: "bg-accent-tech/10 text-accent-tech border-accent-tech/40",
    master: "bg-success/10 text-success border-success/30",
    phd: "bg-accent-steel/10 text-accent-steel border-accent-steel/30",
    certificate: "bg-warning/10 text-warning border-warning/30",
  };

  return (
    <>
      <SeoManager
        title={`${program.name} at ${university.name} | URM Enroll`}
        description={program.description}
        path={`/programs/${program.id}`}
      />

      <main className="min-h-screen bg-bg-primary">
        {/* Breadcrumbs */}
        <div className="border-b border-border/50 px-[var(--content-gutter)] pb-6 page-hero-offset">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb
              items={[
                { label: t<string>("common.home"), href: "/" },
                { label: t<string>("header.nav.programs"), href: "/programs" },
                { label: program.name },
              ]}
            />
          </div>
        </div>


        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-brand-navy-900/5 to-white py-14 md:py-20 lg:py-12 xl:py-14 dark:from-slate-950 dark:via-brand-navy-900/20 dark:to-slate-900">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-accent-tech/8 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent-primary/6 blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${degreeColors[program.degreeLevel] || degreeColors.bachelor}`}>
                    {(program.level as Record<string, unknown>)?.name as string || program.degreeLevel.charAt(0).toUpperCase() + program.degreeLevel.slice(1)}
                  </span>
                  {typeof (program.pathway as Record<string, unknown> | null)?.name === "string" && (
                    <span className="inline-flex items-center rounded-full border border-border/50 bg-bg-surface px-3 py-1 text-sm font-medium text-text-secondary shadow-sm">
                      {(program.pathway as Record<string, string>).name}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-bg-surface px-3 py-1 text-sm font-medium text-text-secondary shadow-sm">
                    {COUNTRY_FLAGS[university.country] ?? ""} {university.country}
                  </span>
                </div>

                <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-text-primary md:text-4xl lg:text-5xl">
                  {program.name}
                </h1>

                <div className="mb-8 flex items-center gap-3">
                  {university.logo && !logoError ? (
                    <img
                      src={university.logo}
                      alt=""
                      onError={() => setLogoError(true)}
                      className="h-10 w-10 rounded-lg border border-border/50 bg-bg-surface object-contain p-1 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-tech/10 text-[11px] font-bold text-accent-tech dark:bg-accent-tech/15 dark:text-accent-tech">
                      {university.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/universities/${university.id}`)}
                    className="text-base font-semibold text-accent-tech hover:underline dark:text-accent-tech"
                  >
                    {university.name}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {durationFromReqs && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary shadow-sm">
                      <Clock className="h-4 w-4 text-accent-tech" /> {durationFromReqs}
                    </div>
                  )}
                  {languageFromReqs && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary shadow-sm">
                      <Globe className="h-4 w-4 text-accent-tech" /> {languageFromReqs}
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-bg-surface px-3 py-1.5 text-sm font-bold shadow-sm">
                    <DollarSign className="h-4 w-4 text-accent-primary" />
                    <span className={resolvedFeesLabel ? "text-text-primary" : "text-text-muted"}>
                      {resolvedFeesLabel ? `${resolvedFeesLabel}/yr` : "Contact for fees"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:w-72 xl:w-80">
                <div className="rounded-2xl border border-border/50 bg-bg-surface p-6 shadow-[0_8px_32px_rgba(8,21,48,0.10)]">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-primary dark:text-accent-primary">Ready to apply?</p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setActiveTab("apply")}
                      className="w-full rounded-xl bg-brand-navy-800 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent-tech hover:shadow-[0_8px_20px_rgba(79,107,138,0.30)]"
                    >
                      {t<string>("programs.detail.applyCta")}
                    </button>
                    <button
                      onClick={() => {
                        if (selectedForCompare) {
                          removeFromComparison(program.id);
                          return;
                        }

                        addToComparison({
                          id: program.id,
                          name: program.name,
                          degreeLevel: program.degreeLevel,
                          duration: program.duration,
                          language: program.language,
                          field: program.field,
                          tuitionPerYear: program.tuitionPerYear,
                          requirements: program.requirements,
                          universityId: university.id,
                          universityName: university.name,
                          universityLogo: university.logo,
                          rating: 4.6,
                        });
                      }}
                      className={`w-full rounded-xl border py-3 text-sm font-semibold transition ${selectedForCompare ? "border-accent-tech/40 bg-accent-tech/8 text-accent-tech dark:border-accent-tech/40 dark:bg-accent-tech/12 dark:text-accent-tech" : "border-border/50 text-text-secondary hover:bg-bg-secondary"}`}
                    >
                      {selectedForCompare ? "✓ Added to Compare" : t<string>("card.program.compare")}
                    </button>
                    <button
                      onClick={() => {
                        if (programSaved) {
                          removeFavorite("program", program.id);
                          return;
                        }

                        addFavorite("program", {
                          id: program.id,
                          name: program.name,
                          degreeLevel: program.degreeLevel,
                          field: program.field,
                          duration: program.duration,
                          language: program.language,
                          tuitionPerYear: program.tuitionPerYear,
                          description: program.description,
                          requirements: program.requirements,
                          universityId: university.id,
                          universityName: university.name,
                          universityLogo: university.logo,
                        });
                      }}
                      className={`w-full rounded-xl border py-3 text-sm font-semibold transition ${programSaved ? "border-accent-primary/40 bg-accent-primary/8 text-amber-700 dark:border-accent-primary/40 dark:bg-accent-primary/12 dark:text-accent-primary" : "border-border/50 text-text-secondary hover:bg-bg-secondary"}`}
                    >
                      {programSaved ? "♥ Saved" : t<string>("programs.detail.saveProgram")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <QuickStatsBar
          stats={stats}
        />

        <PageTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as Tab)}
          ariaLabel="Program detail sections"
        />

        {/* Tab Content */}
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
                <div className="max-w-3xl space-y-8">
                  {overviewParagraphs.length > 0 ? (
                    <div className="space-y-4">
                      {overviewParagraphs.map((paragraph, index) => (
                        <p key={index} className="text-lg leading-relaxed text-text-secondary">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center">
                      <p className="text-text-muted">{t<string>("programs.detail.empty.description")}</p>
                      <p className="mt-2 text-sm text-text-muted">
                        {t<string>("programs.detail.empty.contactUniversity").replace("{{university}}", university.name)}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[
                      locationLabel && { label: t<string>("programs.detail.location"), value: locationLabel },
                      durationFromReqs && { label: t<string>("programs.detail.keyInfo.duration"), value: durationFromReqs },
                      languageFromReqs && { label: t<string>("programs.detail.keyInfo.language"), value: languageFromReqs },
                      program.degreeLevel && {
                        label: t<string>("programs.detail.degreeLevel"),
                        value: (program.level as Record<string, unknown>)?.name as string || program.degreeLevel.charAt(0).toUpperCase() + program.degreeLevel.slice(1),
                      },
                      typeof (program.pathway as Record<string, unknown> | null)?.name === "string" && {
                        label: t<string>("programs.detail.pathway"),
                        value: (program.pathway as Record<string, string>).name,
                      },
                      firstIntake && { label: t<string>("programs.detail.nextIntake"), value: firstIntake },
                      program.toefl_score && program.toefl_score > 0 && {
                        label: t<string>("programs.detail.minToefl"),
                        value: String(program.toefl_score),
                      },
                    ]
                      .filter((item): item is { label: string; value: string } => Boolean(item))
                      .map((item) => (
                        <div key={item.label} className="rounded-xl border border-border/30 bg-bg-secondary/80 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.label}</p>
                          <p className="mt-1 text-sm font-semibold text-text-primary">{item.value}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </m.div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <m.div
                id="tabpanel-curriculum"
                role="tabpanel"
                aria-labelledby="tab-curriculum"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-6 text-3xl font-bold">{t<string>("programs.detail.sections.curriculumTitle")}</h2>
                <div className="rounded-2xl border border-dashed border-border/50 p-12 text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-text-disabled" />
                  <p className="font-semibold text-text-primary">{t<string>("programs.detail.sections.curriculumEmpty")}</p>
                  <p className="mt-2 text-sm text-text-muted">
                    {t<string>("programs.detail.sections.curriculumContact").replace("{{university}}", university.name)}
                  </p>
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
                <div className="space-y-10 max-w-3xl">
                  {/* Intake dates section — from rich Nexus dates/seasons data */}
                  {(intakeLabels.length > 0 || seasonLabels.length > 0) && (
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-5">{t<string>("programs.detail.sections.intakesDates")}</h2>
                      <div className="rounded-2xl border border-border/50 bg-bg-surface p-6">
                        <ul className="space-y-2">
                          {[...intakeLabels, ...seasonLabels].map((label, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 shrink-0 text-accent-tech" />
                              <span className="text-text-primary font-medium">{label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Admission requirements */}
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-5">{t<string>("programs.detail.sections.admissionRequirements")}</h2>
                    {requirementBlocks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center">
                        <p className="text-text-muted">{t<string>("programs.detail.sections.noRequirements")}</p>
                        <p className="mt-2 text-sm text-text-muted">{t<string>("programs.detail.sections.contactUniversity")}</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {requirementBlocks.map((block, index) => (
                          <div key={index} className="rounded-2xl border border-border/50 bg-bg-surface p-6">
                            {block.heading && (
                              <h3 className="text-lg font-bold text-text-primary mb-4">{block.heading}</h3>
                            )}
                            {block.paragraphs.map((paragraph, paragraphIndex) => (
                              <p key={paragraphIndex} className="text-text-secondary mb-3 leading-relaxed">{paragraph}</p>
                            ))}
                            {block.bullets.length > 0 && (
                              <ul className="space-y-2 mt-2">
                                {block.bullets.map((bullet, bulletIndex) => (
                                  <li key={bulletIndex} className="flex items-start gap-3">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-tech" />
                                    <span className="text-text-secondary">{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Additional info */}
                  {(program.toefl_score || program.address) && (
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-5">{t<string>("programs.detail.sections.additionalInfo")}</h2>
                      <div className="rounded-2xl border border-border/50 bg-bg-surface p-6">
                        <dl className="space-y-3">
                          {program.toefl_score && program.toefl_score > 0 && (
                            <div className="flex items-center gap-3">
                              <dt className="text-[11px] font-bold uppercase tracking-widest text-text-muted w-28 shrink-0">{t<string>("programs.detail.minToefl")}</dt>
                              <dd className="text-sm font-semibold text-text-primary">{program.toefl_score}</dd>
                            </div>
                          )}
                          {program.address && (
                            <div className="flex items-center gap-3">
                              <dt className="text-[11px] font-bold uppercase tracking-widest text-text-muted w-28 shrink-0">{t<string>("programs.detail.sections.campus")}</dt>
                              <dd className="text-sm font-semibold text-text-primary">{program.address}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </m.div>
            )}

            {/* Career Outcomes Tab */}
            {activeTab === "career-outcomes" && (
              <m.div
                id="tabpanel-career-outcomes"
                role="tabpanel"
                aria-labelledby="tab-career-outcomes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t<string>("programs.detail.sections.careerOutcomesTitle")}</h2>
                <div className="rounded-2xl border border-dashed border-border/50 p-12 text-center">
                  <Briefcase className="w-12 h-12 text-text-disabled mx-auto mb-4" />
                  <p className="font-semibold text-text-primary">{t<string>("programs.detail.sections.careerOutcomesEmpty")}</p>
                  <p className="mt-2 text-sm text-text-muted">Visit {university.name}'s website for graduate employment statistics.</p>
                </div>
              </m.div>
            )}

            {/* Apply Tab */}
            {activeTab === "apply" && (
              <m.div
                id="tabpanel-apply"
                role="tabpanel"
                aria-labelledby="tab-apply"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-text-primary mb-1">
                    Apply to <span className="text-accent-tech">{university.name}</span>
                  </h2>
                  <p className="text-sm text-text-muted">{t<string>("apply.form.helper.completeSteps")}</p>
                </div>

                {submitStatus === "success" ? (
                  <ApplicationSuccess
                    programName={program.name}
                    onBackToProgram={() => {
                      setSubmitStatus("idle");
                      setApplicationStep(1);
                      setFormData({ fullName: "", email: "", nationality: "", phone: "", lastDegree: "", gpa: "", graduationYear: "", passportFile: "", transcriptFile: "" });
                      setTurnstileToken("");
                    }}
                  />
                ) : (
                  <>

                {/* Progress Stepper */}
                <div className="mb-8">
                  <div className="flex items-center gap-0">
                    {[
                      { num: 1, label: t<string>("apply.form.steps.personalInfo") },
                      { num: 2, label: t<string>("apply.form.steps.academicBackground") },
                      { num: 3, label: t<string>("apply.form.steps.uploadDocuments") },
                      { num: 4, label: t<string>("apply.form.steps.reviewSubmit") },
                    ].map(({ num, label }, idx) => (
                      <div key={num} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                            applicationStep > num
                              ? "bg-accent-tech text-white"
                              : applicationStep === num
                                ? "bg-brand-navy-800 text-white shadow-[0_0_0_4px_rgba(79,107,138,0.2)]"
                                : "bg-bg-secondary text-text-muted"
                          }`}>
                            {applicationStep > num ? <Check className="h-4 w-4" /> : num}
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider hidden sm:block ${
                            applicationStep === num ? "text-brand-navy-700 dark:text-accent-tech" : "text-text-muted"
                          }`}>{label}</span>
                        </div>
                        {idx < 3 && (
                          <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${
                            applicationStep > num ? "bg-accent-tech" : "bg-border/40"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Steps */}
                <div className="max-w-2xl mb-12">
                  {applicationStep === 1 && (
                    <ApplicationStep1
                      formData={formData}
                      onChange={updateFormField}
                      onSaveDraft={() => window.localStorage.setItem("program-application-draft", JSON.stringify(formData))}
                      onNext={() => setApplicationStep(2)}
                    />
                  )}
                  {applicationStep === 2 && (
                    <ApplicationStep2
                      formData={formData}
                      onChange={updateFormField}
                      onSaveDraft={() => window.localStorage.setItem("program-application-draft", JSON.stringify(formData))}
                      onNext={() => setApplicationStep(3)}
                      onPrev={() => setApplicationStep(1)}
                    />
                  )}
                  {applicationStep === 3 && (
                    <ApplicationStep3
                      formData={formData}
                      onChange={updateFormField}
                      onSaveDraft={() => window.localStorage.setItem("program-application-draft", JSON.stringify(formData))}
                      onNext={() => setApplicationStep(4)}
                      onPrev={() => setApplicationStep(2)}
                    />
                  )}
                  {applicationStep === 4 && (
                    <ApplicationStep4
                      formData={formData}
                      turnstileSiteKey={turnstileSiteKey}
                      turnstileToken={turnstileToken}
                      onTurnstileChange={setTurnstileToken}
                      submitStatus={submitStatus}
                      submitError={submitError}
                      onSaveDraft={() => window.localStorage.setItem("program-application-draft", JSON.stringify(formData))}
                      onPrev={() => setApplicationStep(3)}
                      onSubmit={handleApplicationSubmit}
                    />
                  )}
                </div>
                  </>
                )}
              </m.div>
            )}
          </div>
        </section>

        {/* Related Programs */}
        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="page-container">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-text-primary mb-8">
                {t<string>("programs.detail.sections.relatedTitle")}
              </h2>
              {relatedProgramsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ProgramCardSkeleton key={`related-program-skeleton-${index}`} />
                  ))}
                </div>
              ) : (
                <HorizontalScrollCarousel
                  title={t<string>("programs.detail.sections.relatedTitle")}
                  viewAllHref="/programs"
                  items={relatedPrograms.map((prog) => (
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
                      onApply={() => navigate(`/programs/${prog.id}`)}
                    />
                  ))}
                />
              )}
            </m.div>
          </div>
        </section>
      </main>
    </>
  );
}

/** Shared input style for the apply form */
const inputCls = "w-full px-4 py-3.5 rounded-xl border-2 border-border/50 bg-bg-surface/80 text-text-primary placeholder:text-text-muted text-sm font-medium focus:border-accent-primary focus:outline-none focus:ring-4 focus:ring-accent-primary/10 transition-all duration-200";
const labelCls = "block text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted mb-2";

/**
 * Application Step Components
 */
function ApplicationStep1({
  formData,
  onChange,
  onSaveDraft,
  onNext,
}: {
  formData: Record<string, string>;
  onChange: (field: "fullName" | "email" | "nationality" | "phone", value: string) => void;
  onSaveDraft: () => void;
  onNext: () => void;
}) {
  const { t } = useLanguage();
  const canProceed = (formData.fullName ?? "").trim().length >= 2 && /\S+@\S+\.\S+/.test(formData.email ?? "") && (formData.nationality ?? "").length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-border/30">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">{t<string>("apply.form.steps.personalInfoTitle")}</h3>
          <p className="text-xs text-text-muted mt-0.5">{t<string>("apply.form.steps.personalInfoSubtitle")}</p>
        </div>
      </div>

      <div>
        <label className={labelCls}>{t<string>("apply.form.fields.fullNameLabel")} <span className="text-red-400">*</span></label>
        <input
          type="text"
          placeholder={t<string>("apply.form.placeholders.passportName")}
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          className={inputCls}
          autoComplete="name"
        />
      </div>

      <div>
        <label className={labelCls}>{t<string>("apply.form.fields.emailLabel")} <span className="text-red-400">*</span></label>
        <input
          type="email"
          placeholder={t<string>("apply.form.placeholders.email")}
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputCls}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{t<string>("apply.form.fields.nationalityLabel")} <span className="text-red-400">*</span></label>
          <div className="relative">
            <select
              value={formData.nationality}
              onChange={(e) => onChange("nationality", e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer pr-10`}
            >
              <option value="">{t<string>("apply.form.placeholders.selectNationality")}</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t<string>("apply.form.fields.phoneLabel")}</label>
          <input
            type="tel"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputCls}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSaveDraft} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all">
          {t<string>("apply.form.saveDraft")}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 text-white text-sm font-bold hover:bg-accent-tech transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t<string>("apply.form.continue")} <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ApplicationStep2({
  formData,
  onChange,
  onSaveDraft,
  onNext,
  onPrev,
}: {
  formData: Record<string, string>;
  onChange: (field: "lastDegree" | "gpa" | "graduationYear", value: string) => void;
  onSaveDraft: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const canProceed = (formData.lastDegree ?? "").trim().length >= 2;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-border/30">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 flex items-center justify-center shrink-0">
          <GraduationCapIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">{t<string>("apply.form.steps.academicBackgroundTitle")}</h3>
          <p className="text-xs text-text-muted mt-0.5">{t<string>("apply.form.steps.academicBackgroundSubtitle")}</p>
        </div>
      </div>

      <div>
        <label className={labelCls}>{t<string>("apply.form.fields.highestDegree")} <span className="text-red-400">*</span></label>
        <div className="relative">
          <select
            value={formData.lastDegree}
            onChange={(e) => onChange("lastDegree", e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer pr-10`}
          >
            <option value="">Select your highest degree…</option>
            <option value="High School Diploma">{t<string>("apply.form.degreeOptions.highSchool")}</option>
            <option value="Associate Degree">{t<string>("apply.form.degreeOptions.associate")}</option>
            <option value="Bachelor's Degree">{t<string>("apply.form.degreeOptions.bachelor")}</option>
            <option value="Master's Degree">{t<string>("apply.form.degreeOptions.master")}</option>
            <option value="PhD / Doctorate">{t<string>("apply.form.degreeOptions.phd")}</option>
            <option value="Professional Degree (MD/JD/etc.)">Professional Degree (MD / JD / etc.)</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>{t<string>("apply.form.fields.gpa")}</label>
          <input
            type="text"
            placeholder={t<string>("apply.form.placeholders.gpa")}
            value={formData.gpa}
            onChange={(e) => onChange("gpa", e.target.value)}
            className={inputCls}
          />
          <p className="mt-1.5 text-[11px] text-text-muted">{t<string>("apply.form.gpaHint")}</p>
        </div>
        <div>
          <label className={labelCls}>{t<string>("apply.form.fields.graduationYear")}</label>
          <div className="relative">
            <select
              value={formData.graduationYear}
              onChange={(e) => onChange("graduationYear", e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer pr-10`}
            >
              <option value="">Select year…</option>
              {Array.from({ length: 20 }, (_, i) => currentYear - i).map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
              <option value="Not yet graduated">{t<string>("apply.form.degreeOptions.notGraduated")}</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSaveDraft} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all">
          {t<string>("apply.form.saveDraft")}
        </button>
        <button onClick={onPrev} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all">
          ← {t<string>("leadForm.nav.back")}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 text-white text-sm font-bold hover:bg-accent-tech transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t<string>("apply.form.continue")} <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ApplicationStep3({
  formData,
  onChange,
  onSaveDraft,
  onNext,
  onPrev,
}: {
  formData: Record<string, string>;
  onChange: (field: "passportFile" | "transcriptFile", value: string) => void;
  onSaveDraft: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { t } = useLanguage();
  const docs = [
    {
      field: "passportFile" as const,
      label: t<string>("apply.form.documents.passport"),
      hint: "Colour scan, valid for at least 6 months",
      icon: FileText,
      value: formData.passportFile,
    },
    {
      field: "transcriptFile" as const,
      label: t<string>("apply.form.documents.transcript"),
      hint: "Official or certified copy from your institution",
      icon: GraduationCapIcon,
      value: formData.transcriptFile,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-border/30">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 flex items-center justify-center shrink-0">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">{t<string>("apply.form.steps.uploadDocumentsTitle")}</h3>
          <p className="text-xs text-text-muted mt-0.5">PDF, JPG or PNG · max 10 MB each</p>
        </div>
      </div>

      <div className="space-y-4">
        {docs.map(({ field, label, hint, icon: Icon, value }) => (
          <label
            key={field}
            className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              value
                ? "border-accent-tech bg-accent-tech/5 dark:bg-accent-tech/10"
                : "border-border/50 bg-bg-surface/60 hover:border-accent-primary/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              value ? "bg-accent-tech/20" : "bg-bg-secondary"
            }`}>
              {value
                ? <CheckCircle2 className="w-6 h-6 text-accent-tech" />
                : <Icon className="w-6 h-6 text-text-muted" />
              }
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-primary">{label}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {value ? <span className="text-accent-tech font-semibold truncate block">{value}</span> : hint}
              </p>
            </div>
            <div className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              value
                ? "bg-accent-tech/20 text-accent-tech"
                : "bg-bg-secondary text-text-muted group-hover:bg-accent-primary/10 group-hover:text-accent-primary"
            }`}>
              {value ? t<string>("apply.form.documents.change") : t<string>("apply.form.documents.browse")}
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => onChange(field, e.target.files?.[0]?.name || "")}
              className="sr-only"
            />
          </label>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 flex gap-3">
        <span className="text-lg leading-none">📋</span>
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          {t<string>("apply.form.documents.laterNote")}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onSaveDraft} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all">
          {t<string>("apply.form.saveDraft")}
        </button>
        <button onClick={onPrev} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all">
          ← {t<string>("leadForm.nav.back")}
        </button>
        <button
          onClick={onNext}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 text-white text-sm font-bold hover:bg-accent-tech transition-all"
        >
          {t<string>("apply.form.steps.reviewSubmit")} <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ApplicationStep4({
  formData,
  turnstileSiteKey,
  turnstileToken,
  onTurnstileChange,
  submitStatus,
  submitError,
  onSaveDraft,
  onPrev,
  onSubmit,
}: {
  formData: Record<string, string>;
  turnstileSiteKey: string;
  turnstileToken: string;
  onTurnstileChange: (token: string) => void;
  submitStatus: "idle" | "submitting" | "error";
  submitError: string | null;
  onSaveDraft: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}) {
  const { t } = useLanguage();
  const isSubmitting = submitStatus === "submitting";
  const canSubmit = !isSubmitting && (turnstileSiteKey ? Boolean(turnstileToken) : true);

  const reviewRows = [
    { label: t<string>("apply.form.fields.fullNameLabel"), value: formData.fullName },
    { label: t<string>("apply.form.fields.email"), value: formData.email },
    { label: t<string>("apply.form.fields.nationalityLabel"), value: formData.nationality },
    { label: t<string>("apply.form.fields.phoneLabel"), value: formData.phone || "—" },
    { label: t<string>("apply.form.fields.highestDegree"), value: formData.lastDegree },
    { label: t<string>("apply.form.fields.gpa"), value: formData.gpa || "—" },
    { label: t<string>("apply.form.fields.graduationYear"), value: formData.graduationYear || "—" },
    { label: t<string>("apply.form.documents.passport"), value: formData.passportFile || "To be provided" },
    { label: t<string>("apply.form.documents.transcript"), value: formData.transcriptFile || "To be provided" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-border/30">
        <div className="w-10 h-10 rounded-xl bg-brand-navy-800 dark:bg-brand-navy-700 flex items-center justify-center shrink-0">
          <Send className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">{t<string>("apply.form.steps.reviewSummary")}</h3>
          <p className="text-xs text-text-muted mt-0.5">{t<string>("apply.form.steps.reviewSubtitle")}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="px-4 py-2.5 bg-bg-secondary/80">
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">{t<string>("apply.form.steps.applicationSummary")}</p>
        </div>
        <div className="divide-y divide-border/30">
          {reviewRows.map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3 px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted w-28 shrink-0 pt-0.5">{label}</span>
              <span className="text-sm font-medium text-text-primary flex-1 break-all">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {turnstileSiteKey && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{t<string>("apply.form.steps.securityCheck")}</p>
          <TurnstileWidget siteKey={turnstileSiteKey} onTokenChange={onTurnstileChange} />
        </div>
      )}

      {submitStatus === "error" && submitError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onSaveDraft} disabled={isSubmitting} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all disabled:opacity-40">
          {t<string>("apply.form.saveDraft")}
        </button>
        <button onClick={onPrev} disabled={isSubmitting} className="px-5 py-3 rounded-xl border-2 border-border/50 text-text-secondary text-sm font-semibold hover:border-border transition-all disabled:opacity-40">
          ← {t<string>("leadForm.nav.back")}
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-primary text-ink text-sm font-black hover:brightness-105 hover:shadow-[0_8px_24px_rgba(212,175,55,0.35)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> {t<string>("quiz.submitting")}</>
          ) : (
            <><Send className="h-4 w-4" /> {t<string>("apply.form.submit")}</>
          )}
        </button>
      </div>
    </div>
  );
}

function ApplicationSuccess({ programName, onBackToProgram }: { programName: string; onBackToProgram: () => void }) {
  const { t } = useLanguage();

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-lg"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy-800 to-brand-navy-950 p-8 text-center shadow-[0_24px_48px_rgba(8,21,48,0.32)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent-primary/15 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent-tech/20 blur-2xl" />
        </div>
        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/20 border border-accent-primary/30">
            <CheckCircle2 className="h-8 w-8 text-accent-primary" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">{t<string>("apply.form.applicationSent")} 🎉</h3>
          <p className="text-brand-steel-200 dark:text-brand-steel-300 mb-1 text-sm">
            Your application for <strong className="text-white">{programName}</strong> has been received.
          </p>
          <p className="text-brand-steel-400 mb-6 text-xs">
            A confirmation email is on its way. Expect a response within 2–5 business days.
          </p>
          <button
            onClick={onBackToProgram}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold transition-all"
          >
            ← Apply to Another Program
          </button>
        </div>
      </div>
    </m.div>
  );
}
