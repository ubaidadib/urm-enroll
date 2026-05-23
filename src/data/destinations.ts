// ─── Shared Destination Data ────────────────────────────────────────────────
// Single source of truth for all destination/country data across the platform.
// Consumed by: destinations-page, destinations-compact, destination-comparison,
//              find-your-program

export type LangKey = "en" | "ar" | "de";

export type I18nString = Record<LangKey, string>;
export type I18nStringArray = Record<LangKey, string[]>;

export type TierKey = 1 | 2 | 3;

// ─── Tier Meta ───────────────────────────────────────────────────────────────

export const TIER_META: Record<TierKey, {
  label: I18nString;
  tagline: I18nString;
  ctaLabel: I18nString;
  ctaIntent: "high" | "medium" | "low";
  badge: string;
  badgeSolid: string;
}> = {
  1: {
    label: { en: "Core Market", ar: "سوق أساسي", de: "Kernmarkt" },
    tagline: { en: "Top destinations with strong visa pathways", ar: "وجهات رئيسية مع مسارات تأشيرة قوية", de: "Top-Ziele mit starken Visa-Wegen" },
    ctaLabel: { en: "Apply Now", ar: "قدّم الآن", de: "Jetzt bewerben" },
    ctaIntent: "high",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    badgeSolid: "#10b981",
  },
  2: {
    label: { en: "Growth Market", ar: "سوق نمو", de: "Wachstumsmarkt" },
    tagline: { en: "High-quality European alternatives", ar: "بدائل أوروبية عالية الجودة", de: "Hochwertige europäische Alternativen" },
    ctaLabel: { en: "Explore Options", ar: "استكشف الخيارات", de: "Optionen erkunden" },
    ctaIntent: "medium",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    badgeSolid: "#3b82f6",
  },
  3: {
    label: { en: "Fast-Track", ar: "مسار سريع", de: "Schnellstart" },
    tagline: { en: "Flexible and faster admission routes", ar: "مسارات قبول مرنة وأسرع", de: "Flexible und schnellere Zulassungswege" },
    ctaLabel: { en: "Start Quickly", ar: "ابدأ بسرعة", de: "Schnell starten" },
    ctaIntent: "low",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    badgeSolid: "#f59e0b",
  },
};

// ─── Destination Type ────────────────────────────────────────────────────────

export interface Destination {
  code: string;           // Full name key (e.g. "Germany")
  iso: string;            // ISO 3166-1 alpha-2 (e.g. "DE")
  slug: string;           // URL-safe slug (e.g. "germany")
  flag: string;           // Emoji flag
  tier: TierKey;
  name: I18nString;
  tagline: I18nString;
  image: string;
  universities: number;
  directAgreements: number;
  platformAccess: number;
  nexusBaseScore: number;
  languageLevels: string[];
  visaTimeline: string;
  successRate: number;
  avgTuitionFee: string;
  topPrograms: string[];
  complianceCheckpoint: I18nString;
  keyBenefits: I18nStringArray;
  visaInsights: I18nString;
  recommendedFor: I18nString;
  accentClass: string;
  accentSolid: string;
  region: I18nString;
  highlight: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const DESTINATIONS: Destination[] = [
  // ── Tier 1: Core Markets ──────────────────────────────────────────────────
  {
    code: "Germany",
    iso: "DE",
    slug: "germany",
    flag: "🇩🇪",
    tier: 1,
    name: { en: "Germany", ar: "ألمانيا", de: "Deutschland" },
    tagline: { en: "Europe's Education Powerhouse", ar: "قوة التعليم الأوروبية", de: "Europas Bildungsmacht" },
    image: "https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?auto=format&fit=crop&q=80&w=1200",
    universities: 600,
    directAgreements: 50,
    platformAccess: 600,
    nexusBaseScore: 92,
    languageLevels: ["A2", "B1", "B2"],
    visaTimeline: "6–10 wks",
    successRate: 94,
    avgTuitionFee: "€0–3,000 / yr",
    topPrograms: ["Engineering", "Medicine", "Business", "Natural Sciences"],
    complianceCheckpoint: { en: "Recognition + APS validation", ar: "الاعتراف + تحقق APS", de: "Anerkennung + APS-Prüfung" },
    keyBenefits: {
      en: ["Tuition-free public universities", "Strong visa pathway for MENA students", "Direct institutional partnerships", "Post-study work permit (18 months)"],
      ar: ["جامعات حكومية مجانية", "مسار تأشيرة قوي لطلبة MENA", "شراكات مؤسسية مباشرة", "تصريح عمل بعد الدراسة (18 شهراً)"],
      de: ["Studiengebührenfreie staatliche Unis", "Starker Visa-Weg für MENA-Studierende", "Direkte institutionelle Partnerschaften", "Arbeitserlaubnis nach dem Studium (18 Monate)"],
    },
    visaInsights: {
      en: "German student visa via embassy with APS verification. 6–10 week processing. Blocked account (€11,208/yr) required.",
      ar: "تأشيرة طالب ألمانية عبر السفارة مع تحقق APS. معالجة 6-10 أسابيع. حساب مجمّد (€11,208/سنة) مطلوب.",
      de: "Deutsches Studenten­visum über die Botschaft mit APS-Prüfung. 6–10 Wochen Bearbeitung. Sperrkonto (11.208 €/Jahr) erforderlich.",
    },
    recommendedFor: {
      en: "Academically strong students seeking affordable, world-class European education",
      ar: "الطلبة المتفوقين أكاديمياً الباحثين عن تعليم أوروبي عالمي بتكلفة معقولة",
      de: "Leistungsstarke Studierende, die eine erschwingliche, erstklassige europäische Ausbildung suchen",
    },
    accentClass: "from-emerald-500 to-teal-400",
    accentSolid: "#10b981",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: true,
  },
  {
    code: "Italy",
    iso: "IT",
    slug: "italy",
    flag: "🇮🇹",
    tier: 1,
    name: { en: "Italy", ar: "إيطاليا", de: "Italien" },
    tagline: { en: "Scholarships & Public University Excellence", ar: "منح دراسية وتميز الجامعات الحكومية", de: "Stipendien & öffentliche Universitäts-Exzellenz" },
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&q=80&w=1200",
    universities: 90,
    directAgreements: 15,
    platformAccess: 120,
    nexusBaseScore: 86,
    languageLevels: ["B1", "B2"],
    visaTimeline: "4–8 wks",
    successRate: 90,
    avgTuitionFee: "€0–4,000 / yr",
    topPrograms: ["Engineering", "Architecture", "Medicine", "Design"],
    complianceCheckpoint: { en: "Dichiarazione di Valore + pre-enrollment", ar: "Dichiarazione di Valore + تسجيل مسبق", de: "Dichiarazione di Valore + Vor-Einschreibung" },
    keyBenefits: {
      en: ["Low/zero tuition at public universities", "Merit-based regional scholarships (DSU)", "English-taught programs available", "EU residency pathway"],
      ar: ["رسوم منخفضة/مجانية في الجامعات الحكومية", "منح إقليمية على أساس الجدارة (DSU)", "برامج باللغة الإنجليزية متاحة", "مسار إقامة أوروبي"],
      de: ["Niedrige/keine Studiengebühren an öffentlichen Unis", "Leistungsbasierte regionale Stipendien (DSU)", "Englischsprachige Programme verfügbar", "EU-Aufenthaltspfad"],
    },
    visaInsights: {
      en: "Italian student visa via consulate with Dichiarazione di Valore. 4–8 week processing. Proof of €6,000+/yr financial means required.",
      ar: "تأشيرة طالب إيطالية عبر القنصلية مع Dichiarazione di Valore. معالجة 4-8 أسابيع. إثبات وسائل مالية €6,000+/سنة مطلوب.",
      de: "Italienisches Studenten­visum über das Konsulat mit Dichiarazione di Valore. 4–8 Wochen Bearbeitung. Nachweis von 6.000+ €/Jahr erforderlich.",
    },
    recommendedFor: {
      en: "Students seeking affordable European degrees with scholarship opportunities",
      ar: "الطلبة الباحثين عن شهادات أوروبية بتكلفة معقولة مع فرص المنح",
      de: "Studierende, die erschwingliche europäische Abschlüsse mit Stipendienmöglichkeiten suchen",
    },
    accentClass: "from-green-500 to-emerald-400",
    accentSolid: "#22c55e",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: true,
  },
  {
    code: "Spain",
    iso: "ES",
    slug: "spain",
    flag: "🇪🇸",
    tier: 1,
    name: { en: "Spain", ar: "إسبانيا", de: "Spanien" },
    tagline: { en: "Affordable Living & Strong EU Pathway", ar: "معيشة ميسورة ومسار أوروبي قوي", de: "Günstiges Leben & starker EU-Pfad" },
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=1200",
    universities: 80,
    directAgreements: 12,
    platformAccess: 110,
    nexusBaseScore: 84,
    languageLevels: ["B1", "B2"],
    visaTimeline: "4–8 wks",
    successRate: 88,
    avgTuitionFee: "€1k–6,000 / yr",
    topPrograms: ["Business", "Tourism", "Engineering", "Health Sciences"],
    complianceCheckpoint: { en: "Homologación + consular legalization", ar: "Homologación + تصديق قنصلي", de: "Homologación + konsularische Beglaubigung" },
    keyBenefits: {
      en: ["Low tuition at public universities", "Work permit during studies (20 hrs/wk)", "Fast-growing tech & startup ecosystem", "Pathway to EU permanent residency"],
      ar: ["رسوم منخفضة في الجامعات الحكومية", "تصريح عمل أثناء الدراسة (20 ساعة/أسبوع)", "نظام تقني وشركات ناشئة سريع النمو", "مسار للإقامة الدائمة في الاتحاد الأوروبي"],
      de: ["Niedrige Studiengebühren an öffentlichen Unis", "Arbeitserlaubnis während des Studiums (20 Std./Woche)", "Wachsendes Tech- & Startup-Ökosystem", "Pfad zur EU-Daueraufenthaltserlaubnis"],
    },
    visaInsights: {
      en: "Spanish student visa via consulate. 4–8 week processing. Financial proof (~€600/month) and health insurance required.",
      ar: "تأشيرة طالب إسبانية عبر القنصلية. معالجة 4-8 أسابيع. إثبات مالي (~€600/شهر) وتأمين صحي مطلوب.",
      de: "Spanisches Studenten­visum über das Konsulat. 4–8 Wochen Bearbeitung. Finanznachweis (~600 €/Monat) und Kranken­versicherung erforderlich.",
    },
    recommendedFor: {
      en: "Students who want an affordable EU lifestyle with work opportunities during study",
      ar: "الطلبة الراغبين بأسلوب حياة أوروبي ميسور مع فرص عمل أثناء الدراسة",
      de: "Studierende, die einen günstigen EU-Lebensstil mit Arbeitsmöglichkeiten suchen",
    },
    accentClass: "from-orange-500 to-red-400",
    accentSolid: "#f97316",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: true,
  },

  // ── Tier 2: Growth Markets ────────────────────────────────────────────────
  {
    code: "France",
    iso: "FR",
    slug: "france",
    flag: "🇫🇷",
    tier: 2,
    name: { en: "France", ar: "فرنسا", de: "Frankreich" },
    tagline: { en: "Culture, Research & Grandes Écoles", ar: "الثقافة والبحث والمدارس الكبرى", de: "Kultur, Forschung & Grandes Écoles" },
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200",
    universities: 75,
    directAgreements: 6,
    platformAccess: 130,
    nexusBaseScore: 78,
    languageLevels: ["B1", "B2", "C1"],
    visaTimeline: "4–8 wks",
    successRate: 84,
    avgTuitionFee: "€3k–15k / yr",
    topPrograms: ["Business", "Engineering", "Arts", "Sciences"],
    complianceCheckpoint: { en: "Campus France validation", ar: "تحقق Campus France", de: "Campus France Prüfung" },
    keyBenefits: {
      en: ["World-renowned Grandes Écoles network", "Government-subsidized tuition", "Strong research & innovation ecosystem", "Post-study job-seeker visa available"],
      ar: ["شبكة المدارس الكبرى ذات الشهرة العالمية", "رسوم مدعومة حكومياً", "نظام بحث وابتكار قوي", "تأشيرة البحث عن عمل بعد الدراسة متاحة"],
      de: ["Weltbekanntes Grandes-Écoles-Netzwerk", "Staatlich subventionierte Studiengebühren", "Starkes Forschungs- & Innovationsökosystem", "Jobsuche-Visum nach dem Studium verfügbar"],
    },
    visaInsights: {
      en: "French student visa via Campus France. 4–8 week processing. Proof of €615/month financial means required.",
      ar: "تأشيرة طالب فرنسية عبر Campus France. معالجة 4-8 أسابيع. إثبات وسائل مالية €615/شهر مطلوب.",
      de: "Französisches Studenten­visum über Campus France. 4–8 Wochen. Nachweis von 615 €/Monat erforderlich.",
    },
    recommendedFor: {
      en: "Students seeking prestige research programs with cultural immersion in Europe",
      ar: "الطلبة الباحثين عن برامج بحثية مرموقة مع انغماس ثقافي في أوروبا",
      de: "Studierende, die prestigeträchtige Forschungs­programme mit kulturellem Eintauchen suchen",
    },
    accentClass: "from-blue-600 to-indigo-500",
    accentSolid: "#2563eb",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: false,
  },
  {
    code: "Malta",
    iso: "MT",
    slug: "malta",
    flag: "🇲🇹",
    tier: 2,
    name: { en: "Malta", ar: "مالطا", de: "Malta" },
    tagline: { en: "English-Speaking EU Gateway", ar: "بوابة الاتحاد الأوروبي الناطقة بالإنجليزية", de: "Englischsprachiges EU-Tor" },
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1200",
    universities: 12,
    directAgreements: 5,
    platformAccess: 30,
    nexusBaseScore: 74,
    languageLevels: ["B1", "B2"],
    visaTimeline: "4–6 wks",
    successRate: 86,
    avgTuitionFee: "€5k–12k / yr",
    topPrograms: ["Business", "IT", "Gaming", "Tourism & Hospitality"],
    complianceCheckpoint: { en: "Identity Malta visa processing", ar: "معالجة تأشيرة Identity Malta", de: "Identity Malta Visa-Bearbeitung" },
    keyBenefits: {
      en: ["Fully English-speaking EU country", "Affordable cost of living", "Growing tech & iGaming sector", "Safe, compact island lifestyle"],
      ar: ["دولة أوروبية ناطقة بالإنجليزية بالكامل", "تكلفة معيشة معقولة", "قطاع تقني وألعاب إلكترونية متنامٍ", "نمط حياة جزيرة آمن ومدمج"],
      de: ["Vollständig englisch­sprachiges EU-Land", "Günstige Lebenshaltungskosten", "Wachsender Tech- & iGaming-Sektor", "Sicherer, kompakter Insel-Lebensstil"],
    },
    visaInsights: {
      en: "Maltese student visa via Identity Malta. 4–6 week processing. Health insurance and financial proof required.",
      ar: "تأشيرة طالب مالطية عبر Identity Malta. معالجة 4-6 أسابيع. تأمين صحي وإثبات مالي مطلوب.",
      de: "Maltesisches Studenten­visum über Identity Malta. 4–6 Wochen. Kranken­versicherung und Finanznachweis erforderlich.",
    },
    recommendedFor: {
      en: "Students wanting an English-medium EU experience with lower entry barriers",
      ar: "الطلبة الراغبين بتجربة أوروبية باللغة الإنجليزية مع حواجز دخول أقل",
      de: "Studierende, die eine englisch­sprachige EU-Erfahrung mit niedrigeren Eintrittsbarrieren wünschen",
    },
    accentClass: "from-sky-500 to-blue-400",
    accentSolid: "#0ea5e9",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: false,
  },
  {
    code: "Cyprus",
    iso: "CY",
    slug: "cyprus",
    flag: "🇨🇾",
    tier: 2,
    name: { en: "Cyprus", ar: "قبرص", de: "Zypern" },
    tagline: { en: "Mediterranean Education & EU Access", ar: "التعليم المتوسطي والوصول الأوروبي", de: "Mediterrane Bildung & EU-Zugang" },
    image: "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?auto=format&fit=crop&q=80&w=1200",
    universities: 20,
    directAgreements: 6,
    platformAccess: 40,
    nexusBaseScore: 72,
    languageLevels: ["B1", "B2"],
    visaTimeline: "3–6 wks",
    successRate: 88,
    avgTuitionFee: "€4k–10k / yr",
    topPrograms: ["Business", "Hospitality", "IT", "Law"],
    complianceCheckpoint: { en: "Cyprus immigration permit", ar: "تصريح الهجرة القبرصي", de: "Zypriotische Einwanderungs­genehmigung" },
    keyBenefits: {
      en: ["English-taught programs widely available", "EU member state with lower living costs", "Fast visa processing", "Mediterranean quality of life"],
      ar: ["برامج باللغة الإنجليزية متاحة على نطاق واسع", "دولة عضو في الاتحاد الأوروبي بتكاليف معيشة أقل", "معالجة تأشيرة سريعة", "جودة حياة متوسطية"],
      de: ["Englischsprachige Programme weit verbreitet", "EU-Mitgliedstaat mit niedrigeren Lebenshaltungskosten", "Schnelle Visa-Bearbeitung", "Mediterrane Lebensqualität"],
    },
    visaInsights: {
      en: "Cyprus student visa through immigration. 3–6 week processing. Proof of funds and acceptance letter required.",
      ar: "تأشيرة طالب قبرصية عبر الهجرة. معالجة 3-6 أسابيع. إثبات أموال وخطاب قبول مطلوب.",
      de: "Zypriotisches Studenten­visum über die Einwanderungsbehörde. 3–6 Wochen. Finanznachweis und Zulassungsschreiben erforderlich.",
    },
    recommendedFor: {
      en: "Students looking for an easy-entry EU destination with English instruction",
      ar: "الطلبة الباحثين عن وجهة أوروبية سهلة الدخول مع تدريس بالإنجليزية",
      de: "Studierende, die ein leicht zugängliches EU-Ziel mit englischem Unterricht suchen",
    },
    accentClass: "from-cyan-500 to-teal-400",
    accentSolid: "#06b6d4",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: false,
  },

  // ── Tier 3: Fast-Track / Strategic Markets ────────────────────────────────
  {
    code: "Canada",
    iso: "CA",
    slug: "canada",
    flag: "🇨🇦",
    tier: 3,
    name: { en: "Canada", ar: "كندا", de: "Kanada" },
    tagline: { en: "Immigration-Friendly Education", ar: "تعليم صديق للهجرة", de: "Einwanderungsfreundliche Bildung" },
    image: "https://images.unsplash.com/photo-1723030995500-ea14bb522fc1?auto=format&fit=crop&q=80&w=1200",
    universities: 95,
    directAgreements: 12,
    platformAccess: 140,
    nexusBaseScore: 76,
    languageLevels: ["B2", "C1"],
    visaTimeline: "5–9 wks",
    successRate: 82,
    avgTuitionFee: "CAD 15k–35k / yr",
    topPrograms: ["Engineering", "IT", "Healthcare", "Sciences"],
    complianceCheckpoint: { en: "PAL validation + study permit", ar: "تحقق PAL + تصريح دراسة", de: "PAL-Prüfung + Studienerlaubnis" },
    keyBenefits: {
      en: ["Post-graduation work permit (PGWP)", "Pathway to permanent residency", "Multicultural & safe environment", "Co-op programs with industry"],
      ar: ["تصريح عمل بعد التخرج (PGWP)", "مسار للإقامة الدائمة", "بيئة متعددة الثقافات وآمنة", "برامج تعاونية مع الصناعة"],
      de: ["Arbeitserlaubnis nach Abschluss (PGWP)", "Pfad zur Daueraufenthalts­erlaubnis", "Multikulturelle & sichere Umgebung", "Kooperationsprogramme mit der Industrie"],
    },
    visaInsights: {
      en: "Canadian study permit via SDS or regular stream. 5–9 week processing. GIC ($20,635 CAD) or proof of funds required.",
      ar: "تصريح دراسة كندي عبر SDS أو المسار العادي. معالجة 5-9 أسابيع. GIC ($20,635 CAD) أو إثبات أموال مطلوب.",
      de: "Kanadische Studien­erlaubnis über SDS oder regulären Weg. 5–9 Wochen. GIC (20.635 CAD) oder Finanznachweis erforderlich.",
    },
    recommendedFor: {
      en: "Students seeking immigration-friendly destinations with strong post-study options",
      ar: "الطلبة الباحثين عن وجهات صديقة للهجرة مع خيارات قوية بعد الدراسة",
      de: "Studierende, die einwanderungsfreundliche Ziele mit starken Post-Studien-Optionen suchen",
    },
    accentClass: "from-rose-500 to-red-400",
    accentSolid: "#f43f5e",
    region: { en: "Americas", ar: "الأمريكتان", de: "Amerika" },
    highlight: false,
  },
  {
    code: "United States",
    iso: "US",
    slug: "united-states",
    flag: "🇺🇸",
    tier: 3,
    name: { en: "United States", ar: "الولايات المتحدة", de: "USA" },
    tagline: { en: "Global Research & Career Hub", ar: "مركز البحث والمهن العالمي", de: "Globales Forschungs- & Karrierezentrum" },
    image: "https://images.unsplash.com/photo-1752316435425-45ef00a522c3?auto=format&fit=crop&q=80&w=1200",
    universities: 200,
    directAgreements: 10,
    platformAccess: 260,
    nexusBaseScore: 74,
    languageLevels: ["B2", "C1"],
    visaTimeline: "4–8 wks",
    successRate: 80,
    avgTuitionFee: "$25k–55k / yr",
    topPrograms: ["Computer Science", "Business", "Engineering", "Law"],
    complianceCheckpoint: { en: "SEVIS + I-20 + visa interview", ar: "SEVIS + I-20 + مقابلة تأشيرة", de: "SEVIS + I-20 + Visa-Interview" },
    keyBenefits: {
      en: ["World-leading research universities", "OPT work authorization post-study", "Vast industry networking opportunities", "Flexible admission timelines"],
      ar: ["جامعات بحثية رائدة عالمياً", "تصريح عمل OPT بعد الدراسة", "فرص تواصل صناعي واسعة", "جداول قبول مرنة"],
      de: ["Weltweit führende Forschungsuniversitäten", "OPT-Arbeitserlaubnis nach dem Studium", "Umfangreiche Industrie-Networking-Möglichkeiten", "Flexible Zulassungsfristen"],
    },
    visaInsights: {
      en: "US F-1 visa via embassy interview. 4–8 week processing. I-20 from university and SEVIS fee required.",
      ar: "تأشيرة F-1 أمريكية عبر مقابلة السفارة. معالجة 4-8 أسابيع. I-20 من الجامعة ورسوم SEVIS مطلوبة.",
      de: "US F-1 Visum über Botschaftsinterview. 4–8 Wochen. I-20 der Universität und SEVIS-Gebühr erforderlich.",
    },
    recommendedFor: {
      en: "Ambitious students targeting top-tier research and global career networks",
      ar: "الطلبة الطموحين الذين يستهدفون البحث المتقدم وشبكات المهن العالمية",
      de: "Ambitionierte Studierende, die erstklassige Forschung und globale Karrierenetzwerke anstreben",
    },
    accentClass: "from-brand-navy-700 to-accent-tech",
    accentSolid: "#4F6B8A",
    region: { en: "Americas", ar: "الأمريكتان", de: "Amerika" },
    highlight: false,
  },
  {
    code: "Turkey",
    iso: "TR",
    slug: "turkey",
    flag: "🇹🇷",
    tier: 3,
    name: { en: "Turkey", ar: "تركيا", de: "Türkei" },
    tagline: { en: "Fast Admission & Affordable Education", ar: "قبول سريع وتعليم ميسور", de: "Schnelle Zulassung & erschwingliche Bildung" },
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=1200",
    universities: 200,
    directAgreements: 10,
    platformAccess: 180,
    nexusBaseScore: 70,
    languageLevels: ["B1", "B2"],
    visaTimeline: "2–4 wks",
    successRate: 90,
    avgTuitionFee: "$1k–8k / yr",
    topPrograms: ["Medicine", "Engineering", "Business", "Dentistry"],
    complianceCheckpoint: { en: "Turkish residence permit + student visa", ar: "تصريح إقامة تركي + تأشيرة طالب", de: "Türkische Aufenthaltserlaubnis + Studentenvisum" },
    keyBenefits: {
      en: ["Very fast admission decisions", "Low tuition & living costs", "Türkiye Scholarships available", "Cultural bridge between East & West"],
      ar: ["قرارات قبول سريعة جداً", "رسوم وتكاليف معيشة منخفضة", "منح تركيا متاحة", "جسر ثقافي بين الشرق والغرب"],
      de: ["Sehr schnelle Zulassungsentscheidungen", "Niedrige Studiengebühren & Lebenshaltungskosten", "Türkiye-Stipendien verfügbar", "Kulturelle Brücke zwischen Ost & West"],
    },
    visaInsights: {
      en: "Turkish student visa with fast 2–4 week processing. Residence permit obtained after arrival. Minimal financial requirements.",
      ar: "تأشيرة طالب تركية بمعالجة سريعة 2-4 أسابيع. تصريح إقامة بعد الوصول. متطلبات مالية بسيطة.",
      de: "Türkisches Studentenvisum mit schneller 2–4-Wochen-Bearbeitung. Aufenthaltserlaubnis nach Ankunft. Minimale finanzielle Anforderungen.",
    },
    recommendedFor: {
      en: "Students needing quick enrollment, low costs, and flexible entry requirements",
      ar: "الطلبة الذين يحتاجون تسجيلاً سريعاً وتكاليف منخفضة ومتطلبات دخول مرنة",
      de: "Studierende, die schnelle Einschreibung, niedrige Kosten und flexible Anforderungen benötigen",
    },
    accentClass: "from-red-500 to-rose-400",
    accentSolid: "#ef4444",
    region: { en: "Europe / Asia", ar: "أوروبا / آسيا", de: "Europa / Asien" },
    highlight: false,
  },
  {
    code: "Georgia",
    iso: "GE",
    slug: "georgia",
    flag: "🇬🇪",
    tier: 3,
    name: { en: "Georgia", ar: "جورجيا", de: "Georgien" },
    tagline: { en: "No-Exam Entry & English-Taught Medicine", ar: "دخول بدون امتحان وطب باللغة الإنجليزية", de: "Zulassung ohne Prüfung & englischsprachige Medizin" },
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&q=80&w=1200",
    universities: 25,
    directAgreements: 6,
    platformAccess: 35,
    nexusBaseScore: 68,
    languageLevels: ["B1", "B2"],
    visaTimeline: "1–3 wks",
    successRate: 92,
    avgTuitionFee: "$3k–8k / yr",
    topPrograms: ["Medicine", "Dentistry", "Business", "IT"],
    complianceCheckpoint: { en: "Georgian residence permit on arrival", ar: "تصريح إقامة جورجي عند الوصول", de: "Georgische Aufenthaltserlaubnis bei Ankunft" },
    keyBenefits: {
      en: ["No entrance exam for many programs", "WHO/WFME-recognized medical degrees", "Very low living costs", "Visa-free or visa-on-arrival for many nationalities"],
      ar: ["لا امتحان دخول للعديد من البرامج", "شهادات طبية معترف بها من WHO/WFME", "تكاليف معيشة منخفضة جداً", "بدون تأشيرة أو تأشيرة عند الوصول لجنسيات عديدة"],
      de: ["Keine Aufnahmeprüfung für viele Programme", "WHO/WFME-anerkannte Medizinabschlüsse", "Sehr niedrige Lebenshaltungskosten", "Visumfrei oder Visum bei Ankunft für viele Nationalitäten"],
    },
    visaInsights: {
      en: "Many nationalities visa-free for 1 year. Residence permit obtained on arrival. Minimal documentation required.",
      ar: "عديد من الجنسيات معفاة من التأشيرة لمدة سنة. تصريح إقامة عند الوصول. وثائق بسيطة مطلوبة.",
      de: "Viele Nationalitäten visumfrei für 1 Jahr. Aufenthaltserlaubnis bei Ankunft. Minimale Dokumentation erforderlich.",
    },
    recommendedFor: {
      en: "Medical students seeking affordable English-taught degrees with fast enrollment",
      ar: "طلبة الطب الباحثين عن شهادات ميسورة باللغة الإنجليزية مع تسجيل سريع",
      de: "Medizinstudierende, die erschwingliche englischsprachige Abschlüsse mit schneller Einschreibung suchen",
    },
    accentClass: "from-amber-500 to-yellow-400",
    accentSolid: "#f59e0b",
    region: { en: "Caucasus", ar: "القوقاز", de: "Kaukasus" },
    highlight: false,
  },
  {
    code: "Hungary",
    iso: "HU",
    slug: "hungary",
    flag: "🇭🇺",
    tier: 3,
    name: { en: "Hungary", ar: "المجر", de: "Ungarn" },
    tagline: { en: "EU Medicine & Engineering Hub", ar: "مركز الطب والهندسة في الاتحاد الأوروبي", de: "EU-Zentrum für Medizin & Ingenieurwesen" },
    image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=1200",
    universities: 30,
    directAgreements: 5,
    platformAccess: 45,
    nexusBaseScore: 70,
    languageLevels: ["B1", "B2"],
    visaTimeline: "3–6 wks",
    successRate: 86,
    avgTuitionFee: "€3k–16k / yr",
    topPrograms: ["Medicine", "Dentistry", "Engineering", "Veterinary"],
    complianceCheckpoint: { en: "Hungarian residence permit + D visa", ar: "تصريح إقامة مجري + تأشيرة D", de: "Ungarische Aufenthaltserlaubnis + D-Visum" },
    keyBenefits: {
      en: ["Internationally recognized medical degrees", "Stipendium Hungaricum scholarships", "EU member — Schengen access", "Affordable living in Budapest"],
      ar: ["شهادات طبية معترف بها دولياً", "منح Stipendium Hungaricum", "عضو في الاتحاد الأوروبي — وصول شنغن", "معيشة ميسورة في بودابست"],
      de: ["International anerkannte Medizinabschlüsse", "Stipendium Hungaricum Stipendien", "EU-Mitglied — Schengen-Zugang", "Günstiges Leben in Budapest"],
    },
    visaInsights: {
      en: "Hungarian D-type student visa via embassy. 3–6 week processing. Stipendium Hungaricum covers tuition for eligible students.",
      ar: "تأشيرة طالب مجرية نوع D عبر السفارة. معالجة 3-6 أسابيع. Stipendium Hungaricum تغطي الرسوم للطلبة المؤهلين.",
      de: "Ungarisches D-Studentenvisum über die Botschaft. 3–6 Wochen. Stipendium Hungaricum deckt Gebühren für berechtigte Studierende.",
    },
    recommendedFor: {
      en: "Pre-med students seeking EU-recognized degrees at competitive prices",
      ar: "طلبة ما قبل الطب الباحثين عن شهادات معترف بها أوروبياً بأسعار تنافسية",
      de: "Medizin-Interessierte, die EU-anerkannte Abschlüsse zu wettbewerbsfähigen Preisen suchen",
    },
    accentClass: "from-green-600 to-emerald-400",
    accentSolid: "#16a34a",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: false,
  },
  {
    code: "Latvia",
    iso: "LV",
    slug: "latvia",
    flag: "🇱🇻",
    tier: 3,
    name: { en: "Latvia", ar: "لاتفيا", de: "Lettland" },
    tagline: { en: "Affordable EU Degrees & Schengen Access", ar: "شهادات أوروبية ميسورة ووصول شنغن", de: "Erschwingliche EU-Abschlüsse & Schengen-Zugang" },
    image: "https://images.unsplash.com/photo-1591634380295-ed8938f71a0f?auto=format&fit=crop&q=80&w=1200",
    universities: 18,
    directAgreements: 4,
    platformAccess: 30,
    nexusBaseScore: 66,
    languageLevels: ["B1", "B2"],
    visaTimeline: "3–5 wks",
    successRate: 88,
    avgTuitionFee: "€2k–8k / yr",
    topPrograms: ["Medicine", "IT", "Business", "Aviation"],
    complianceCheckpoint: { en: "Latvian D-type visa + residence", ar: "تأشيرة لاتفية نوع D + إقامة", de: "Lettisches D-Visum + Aufenthalt" },
    keyBenefits: {
      en: ["EU & Schengen zone member", "English-taught programs widely available", "Low tuition & living costs", "Fast application processing"],
      ar: ["عضو في الاتحاد الأوروبي ومنطقة شنغن", "برامج باللغة الإنجليزية متاحة على نطاق واسع", "رسوم وتكاليف معيشة منخفضة", "معالجة طلبات سريعة"],
      de: ["EU- & Schengen-Mitglied", "Englischsprachige Programme weit verbreitet", "Niedrige Studiengebühren & Lebenshaltungskosten", "Schnelle Bearbeitungszeit"],
    },
    visaInsights: {
      en: "Latvian D-type student visa via embassy. 3–5 week processing. Proof of €4,300/year funds required.",
      ar: "تأشيرة طالب لاتفية نوع D عبر السفارة. معالجة 3-5 أسابيع. إثبات أموال €4,300/سنة مطلوب.",
      de: "Lettisches D-Studentenvisum über die Botschaft. 3–5 Wochen. Nachweis von 4.300 €/Jahr erforderlich.",
    },
    recommendedFor: {
      en: "Budget-conscious students seeking fast EU access with English-taught options",
      ar: "الطلبة المهتمين بالميزانية الباحثين عن وصول سريع للاتحاد الأوروبي مع خيارات باللغة الإنجليزية",
      de: "Budgetbewusste Studierende, die schnellen EU-Zugang mit englischsprachigen Optionen suchen",
    },
    accentClass: "from-rose-600 to-pink-400",
    accentSolid: "#e11d48",
    region: { en: "Europe", ar: "أوروبا", de: "Europa" },
    highlight: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Look up a destination by its full name code (e.g. "Germany") */
export function getDestination(code: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.code === code);
}

/** Look up a destination by its ISO code (e.g. "DE") */
export function getDestinationByIso(iso: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.iso === iso);
}

/** Look up a destination by its URL slug (e.g. "germany") */
export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

/** Get all destinations for a specific tier */
export function getDestinationsByTier(tier: TierKey): Destination[] {
  return DESTINATIONS.filter((d) => d.tier === tier);
}

/** Get highlighted (featured) destinations */
export function getFeaturedDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => d.highlight);
}

/** Build a country-meta map keyed by ISO code (for find-your-program) */
export function getCountryMeta(): Record<string, { name: string; flag: string; accent: string }> {
  const meta: Record<string, { name: string; flag: string; accent: string }> = {};
  for (const d of DESTINATIONS) {
    meta[d.iso] = { name: d.name.en, flag: d.flag, accent: d.accentSolid };
  }
  return meta;
}
