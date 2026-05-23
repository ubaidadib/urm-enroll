import type { SupportedLanguage } from "@/i18n/types";

export type SeoPageKey =
  | "home"
  | "services"
  | "destinations"
  | "nursing"
  | "partnerships"
  | "about"
  | "contact"
  | "quiz"
  | "germanyCareers"
  | "chancenkarte"
  | "chancenkarteEligibility"
  | "chancenkarteProcess"
  | "chancenkarteRequirements"
  | "chancenkarteSuccessStories"
  | "chancenkarteFaq"
  | "germanyJobs"
  | "germanyRelocation"
  | "privacy"
  | "terms"
  | "cookies"
  | "impressum"
  | "notFound";

export type PageMeta = {
  title: string;
  description: string;
  keywords: string[];
};

export const SEO_BRAND_SUFFIX = "URM Enroll - Study Abroad Experts";

const GLOBAL_KEYWORDS: Record<SupportedLanguage, string[]> = {
  en: [
    "study abroad Germany",
    "study in Germany for international students",
    "university application Germany",
    "student enrollment Germany",
    "study abroad counseling",
    "international student advisor",
    "apply to German university",
    "student visa Germany",
    "bachelor degree Germany English",
    "free tuition Germany",
  ],
  ar: [
    "الدراسة في ألمانيا",
    "الدراسة بالخارج",
    "التسجيل في الجامعات الألمانية",
    "دراسة البكالوريوس في أوروبا",
    "منح دراسية ألمانيا",
    "قبول جامعي في ألمانيا",
    "تأشيرة الطالب ألمانيا",
    "الدراسة في أوروبا للعرب",
    "مستشار قبول جامعي",
    "الدراسة بالخارج مجانا",
  ],
  de: [
    "Studium im Ausland",
    "internationale Studenten Deutschland",
    "Studienberatung Ausland",
    "Uni Bewerbung Deutschland",
    "Studienvisum Deutschland",
    "Auslandsstudium beratung",
  ],
};

export const PAGE_SEO: Record<SupportedLanguage, Record<SeoPageKey, PageMeta>> = {
  en: {
    home: {
      title: "URM Enroll — Study Abroad & Nursing Pathways",
      description:
        "Start your journey to study in Germany. Expert counselors support applications, visas, and enrollment for international students.",
      keywords: [...GLOBAL_KEYWORDS.en, "how to apply to german university as international student", "study in germany without tuition fees"],
    },
    services: {
      title: "Our Services | URM Enroll",
      description:
        "Explore top universities in Germany and Europe for Bachelor, Master, and PhD pathways with expert admission guidance.",
      keywords: [...GLOBAL_KEYWORDS.en, "best universities in germany for arab students"],
    },
    destinations: {
      title: "Study Destinations | URM Enroll",
      description:
        "Compare Germany and European study destinations with tuition, visa timelines, language requirements, and enrollment support.",
      keywords: [...GLOBAL_KEYWORDS.en, "student enrollment counselor germany"],
    },
    nursing: {
      title: "Nursing in Germany | URM Enroll",
      description:
        "Plan your nursing recognition and study route in Germany with language readiness, documentation support, and advisor guidance.",
      keywords: [...GLOBAL_KEYWORDS.en, "nursing recognition Germany"],
    },
    partnerships: {
      title: "Partnerships | URM Enroll",
      description:
        "Partner with URM Enroll to scale international student enrollment across Germany and Europe with compliant processes.",
      keywords: [...GLOBAL_KEYWORDS.en, "institutional enrollment partnerships"],
    },
    about: {
      title: "About Us | URM Enroll",
      description:
        "Meet URM Enroll's team of student counselors helping international students achieve their study abroad goals in Germany and Europe.",
      keywords: [...GLOBAL_KEYWORDS.en, "international student advisor"],
    },
    contact: {
      title: "Contact Us | URM Enroll",
      description:
        "Speak with an expert student counselor for personalized guidance on studying in Germany and Europe. Available in EN, AR, and DE.",
      keywords: [...GLOBAL_KEYWORDS.en, "student enrollment counselor germany"],
    },
    quiz: {
      title: "Find Your Programme | URM Enroll",
      description:
        "Take the URM Enroll quiz to match your profile with the best Germany and Europe study pathways for international students.",
      keywords: [...GLOBAL_KEYWORDS.en, "student enrollment Germany"],
    },
    germanyCareers: {
      title: "Germany Careers & Chancenkarte | URM Enroll",
      description:
        "Premium Germany careers division — Chancenkarte advisory, credential recognition, visa support, and skilled migration from Lebanon and the MENA region.",
      keywords: [
        "Germany Chancenkarte",
        "Germany Opportunity Card",
        "Germany work visa Lebanon",
        "Germany jobs for Lebanese",
        "skilled migration Germany",
        "work in Germany from Lebanon",
        "Germany relocation services",
      ],
    },
    chancenkarte: {
      title: "Chancenkarte (Germany Opportunity Card) | URM Enroll",
      description:
        "The Chancenkarte explained — Germany's points-based residence permit for skilled professionals. Eligibility quiz, process, requirements, and FAQ.",
      keywords: [
        "Chancenkarte",
        "Germany Opportunity Card",
        "Chancenkarte points",
        "Chancenkarte Lebanon",
        "Germany work permit",
      ],
    },
    chancenkarteEligibility: {
      title: "Chancenkarte Eligibility Quiz | URM Enroll Germany",
      description:
        "Get a realistic Chancenkarte eligibility score in 6 minutes. Mirrors the official Germany points system. Free, no signup before scoring.",
      keywords: [
        "Chancenkarte eligibility",
        "Chancenkarte calculator",
        "Germany Opportunity Card eligibility",
        "Chancenkarte score",
      ],
    },
    chancenkarteProcess: {
      title: "Chancenkarte Process Step by Step | URM Enroll",
      description:
        "Full Chancenkarte application process: eligibility check, Anabin recognition, blocked account, visa interview, arrival concierge, and German job placement.",
      keywords: ["Chancenkarte process", "Germany work visa steps", "Anabin recognition"],
    },
    chancenkarteRequirements: {
      title: "Chancenkarte Requirements & Document Checklist | URM Enroll",
      description:
        "Official Chancenkarte document checklist — identity, qualifications, work experience, language certificates, finances, and additional paperwork.",
      keywords: ["Chancenkarte requirements", "Chancenkarte documents", "Germany visa checklist"],
    },
    chancenkarteSuccessStories: {
      title: "Chancenkarte Success Stories | URM Enroll Germany",
      description:
        "Verified URM Enroll clients who relocated to Germany via the Chancenkarte — nursing, software engineering, mechatronics, teaching.",
      keywords: ["Chancenkarte success stories", "Lebanese in Germany", "Germany migration testimonials"],
    },
    chancenkarteFaq: {
      title: "Chancenkarte FAQ — Honest Answers | URM Enroll",
      description:
        "The most-asked Chancenkarte questions, answered without marketing fluff. Eligibility, points, blocked account, processing time, family reunification.",
      keywords: ["Chancenkarte FAQ", "Germany Opportunity Card FAQ", "Chancenkarte questions"],
    },
    germanyJobs: {
      title: "Germany Jobs for Lebanese & MENA Professionals | URM Enroll",
      description:
        "Curated German employer shortlists for skilled candidates — nursing, engineering, IT, and trades. Built around your Chancenkarte readiness.",
      keywords: ["Germany jobs", "Germany jobs for Lebanese", "Engpassberufe Germany", "Germany shortage occupations"],
    },
    germanyRelocation: {
      title: "Germany Relocation Services | URM Enroll",
      description:
        "End-to-end relocation services for Germany — visa appointment, Anmeldung, housing, health insurance, tax ID, banking, and family integration.",
      keywords: ["Germany relocation", "moving to Germany Lebanon", "Anmeldung", "Germany housing for expats"],
    },
    privacy: {
      title: "Privacy Policy",
      description: "Review URM Enroll privacy practices for international student counseling, admissions guidance, and data protection.",
      keywords: [...GLOBAL_KEYWORDS.en, "privacy policy"],
    },
    terms: {
      title: "Terms and Conditions",
      description: "Read URM Enroll terms governing study abroad counseling, student enrollment support, and platform usage.",
      keywords: [...GLOBAL_KEYWORDS.en, "terms and conditions"],
    },
    cookies: {
      title: "Cookie Policy",
      description: "Understand how URM Enroll uses cookies to improve student enrollment guidance and website experience.",
      keywords: [...GLOBAL_KEYWORDS.en, "cookie policy"],
    },
    impressum: {
      title: "Impressum (Legal Notice)",
      description: "Legal notice and company information for URM Enroll Ltd – registered in England and Wales, international student enrollment services.",
      keywords: [...GLOBAL_KEYWORDS.en, "impressum", "legal notice"],
    },
    notFound: {
      title: "Page Not Found",
      description: "The requested page could not be found. Explore URM Enroll services for study abroad and Germany enrollment support.",
      keywords: [...GLOBAL_KEYWORDS.en, "page not found"],
    },
  },
  ar: {
    home: {
      title: "الدراسة في ألمانيا | إرشاد التسجيل الجامعي",
      description:
        "ابدأ رحلتك نحو الدراسة في ألمانيا وأوروبا. مستشارون متخصصون يدعمون القبول الجامعي والتأشيرة والتسجيل للطلاب الدوليين.",
      keywords: [...GLOBAL_KEYWORDS.ar, "كيف أدرس في ألمانيا", "أفضل الجامعات الألمانية للطلاب العرب", "شروط القبول في الجامعات الألمانية"],
    },
    services: {
      title: "برامج الدراسة في الخارج والجامعات",
      description:
        "اكتشف أفضل الجامعات في ألمانيا وأوروبا وبرامج البكالوريوس والماجستير والدكتوراه مع إرشاد قبول احترافي.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    destinations: {
      title: "أفضل وجهات الدراسة في ألمانيا وأوروبا",
      description:
        "قارن بين وجهات الدراسة من حيث الرسوم ومتطلبات اللغة وخطوات التأشيرة مع دعم تسجيل متكامل.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    nursing: {
      title: "مسارات التمريض في ألمانيا | دعم الاعتراف",
      description:
        "خطط لمسارك في التمريض بألمانيا مع دعم الاعتراف المهني والجاهزية اللغوية وإرشاد المستندات.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    partnerships: {
      title: "شراكات مؤسسية للتسجيل الطلابي",
      description:
        "تعاون مع URM Enroll لتوسيع تسجيل الطلاب الدوليين في ألمانيا وأوروبا عبر نموذج امتثال مؤسسي.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    about: {
      title: "عن URM Enroll | مهمتنا ومستشارونا",
      description:
        "تعرف على فريق URM Enroll من المستشارين الطلابيين الذين يدعمون الطلاب العرب والدوليين للدراسة في الخارج.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    contact: {
      title: "تواصل مع مستشار طلابي",
      description:
        "تحدث مع مستشار طلابي متخصص اليوم واحصل على إرشاد شخصي للدراسة في ألمانيا وأوروبا.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    quiz: {
      title: "اختبار أهلية الدراسة بالخارج",
      description:
        "أجب عن اختبار URM Enroll لتحديد أنسب مسارات الدراسة في ألمانيا وأوروبا وفق ملفك الأكاديمي.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    germanyCareers: {
      title: "العمل في ألمانيا وبطاقة الفرص | URM Enroll",
      description:
        "قسم متخصص للعمل في ألمانيا — استشارة بطاقة الفرص، اعتراف بالشهادات، دعم التأشيرة، والهجرة المهنية من لبنان والمنطقة.",
      keywords: ["بطاقة الفرص ألمانيا", "العمل في ألمانيا", "Chancenkarte", "تأشيرة عمل ألمانيا للبنانيين"],
    },
    chancenkarte: {
      title: "بطاقة الفرص الألمانية | URM Enroll",
      description:
        "كل ما تحتاج معرفته عن Chancenkarte — إقامة ألمانية بنظام النقاط للمحترفين. اختبار الأهلية والعملية والمتطلبات والأسئلة الشائعة.",
      keywords: ["Chancenkarte", "بطاقة الفرص", "تأشيرة عمل ألمانيا"],
    },
    chancenkarteEligibility: {
      title: "اختبار الأهلية لبطاقة الفرص | URM Enroll ألمانيا",
      description: "احصل على نتيجة واقعية لبطاقة الفرص في ست دقائق. ١٨ سؤالاً. مجاناً.",
      keywords: ["أهلية Chancenkarte", "حاسبة بطاقة الفرص", "اختبار ألمانيا"],
    },
    chancenkarteProcess: {
      title: "عملية بطاقة الفرص خطوة بخطوة | URM Enroll",
      description:
        "العملية الكاملة لبطاقة الفرص: فحص الأهلية، الاعتراف عبر Anabin، الحساب المجمّد، مقابلة التأشيرة، الاستقبال في ألمانيا.",
      keywords: ["عملية Chancenkarte", "خطوات تأشيرة ألمانيا"],
    },
    chancenkarteRequirements: {
      title: "متطلبات بطاقة الفرص وقائمة المستندات | URM Enroll",
      description: "قائمة المستندات الرسمية لبطاقة الفرص — الهوية، المؤهلات، الخبرة، اللغة، المالية، وغير ذلك.",
      keywords: ["متطلبات Chancenkarte", "مستندات تأشيرة ألمانيا"],
    },
    chancenkarteSuccessStories: {
      title: "قصص نجاح بطاقة الفرص | URM Enroll ألمانيا",
      description: "عملاء موثقون انتقلوا إلى ألمانيا عبر Chancenkarte — تمريض، برمجيات، ميكاترونيكس، تعليم.",
      keywords: ["قصص نجاح Chancenkarte", "لبنانيون في ألمانيا"],
    },
    chancenkarteFaq: {
      title: "الأسئلة الشائعة عن بطاقة الفرص | URM Enroll",
      description: "أكثر الأسئلة شيوعاً عن Chancenkarte بإجابات مباشرة. الأهلية، النقاط، الحساب المجمّد، مدة المعالجة.",
      keywords: ["أسئلة Chancenkarte", "FAQ بطاقة الفرص"],
    },
    germanyJobs: {
      title: "وظائف ألمانيا للبنانيين والمنطقة | URM Enroll",
      description: "قوائم منتقاة من أصحاب عمل ألمان للكوادر المؤهلة — تمريض، هندسة، تقنية، وحرف. وفق جاهزيتك لـ Chancenkarte.",
      keywords: ["وظائف ألمانيا", "وظائف للبنانيين في ألمانيا", "مهن النقص في ألمانيا"],
    },
    germanyRelocation: {
      title: "خدمات الانتقال إلى ألمانيا | URM Enroll",
      description: "خدمات انتقال متكاملة لألمانيا — موعد التأشيرة، Anmeldung، السكن، التأمين الصحي، الرقم الضريبي، البنوك.",
      keywords: ["الانتقال إلى ألمانيا", "Anmeldung", "السكن في ألمانيا"],
    },
    privacy: {
      title: "سياسة الخصوصية",
      description: "اطلع على سياسة الخصوصية لدى URM Enroll المتعلقة بخدمات الإرشاد والتسجيل الجامعي للطلاب الدوليين.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    terms: {
      title: "الشروط والأحكام",
      description: "اقرأ شروط وأحكام URM Enroll لخدمات الدراسة بالخارج والاستشارات الخاصة بالقبول الجامعي.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    cookies: {
      title: "سياسة ملفات تعريف الارتباط",
      description: "تعرف على كيفية استخدام ملفات تعريف الارتباط لتحسين تجربة موقع URM Enroll.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    impressum: {
      title: "البصمة القانونية (Impressum)",
      description: "الإشعار القانوني ومعلومات الشركة لـ URM Enroll Ltd — خدمات تسجيل الطلاب الدوليين.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
    notFound: {
      title: "الصفحة غير موجودة",
      description: "الصفحة المطلوبة غير متاحة حالياً. تصفح خدمات URM Enroll للدراسة في ألمانيا وأوروبا.",
      keywords: [...GLOBAL_KEYWORDS.ar],
    },
  },
  de: {
    home: {
      title: "Studium in Deutschland | Professionelle Studienberatung",
      description:
        "Starten Sie Ihr Studium in Deutschland. Unsere Experten unterstützen bei Bewerbung, Visum und Immatrikulation.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    services: {
      title: "Studienprogramme & Universitäten im Ausland",
      description:
        "Entdecken Sie Top-Universitäten in Deutschland und Europa für Bachelor, Master und PhD mit professioneller Beratung.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    destinations: {
      title: "Top-Studienziele in Deutschland & Europa",
      description:
        "Vergleichen Sie Studienziele nach Gebühren, Sprachanforderungen und Visum-Timelines mit persönlicher Beratung.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    nursing: {
      title: "Pflegewege in Deutschland | Anerkennungsberatung",
      description:
        "Planen Sie Ihren Pflegeweg in Deutschland mit Unterstützung bei Anerkennung, Sprachniveau und Dokumentation.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    partnerships: {
      title: "Institutionelle Partnerschaften für Immatrikulation",
      description:
        "Arbeiten Sie mit URM Enroll zusammen, um internationale Immatrikulationen in Deutschland und Europa skalierbar umzusetzen.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    about: {
      title: "Über URM Enroll | Mission & Studienberater",
      description:
        "Lernen Sie das Team von URM Enroll kennen, das internationale Studierende auf ihrem Weg ins Auslandsstudium begleitet.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    contact: {
      title: "Studienberatung kontaktieren",
      description:
        "Sprechen Sie mit unseren Studienberatern und erhalten Sie persönliche Unterstützung für Deutschland und Europa.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    quiz: {
      title: "Eignungsquiz für Auslandsstudium",
      description:
        "Machen Sie das URM Enroll Quiz, um passende Studienwege in Deutschland und Europa für Ihr Profil zu finden.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    germanyCareers: {
      title: "Karriere in Deutschland & Chancenkarte | URM Enroll",
      description:
        "Premium-Division Karriere Deutschland — Chancenkarte-Beratung, Anabin-Anerkennung, Visum, und Fachkräfteeinwanderung aus Libanon und MENA.",
      keywords: [
        "Chancenkarte Deutschland",
        "Arbeitsvisum Deutschland",
        "Fachkräfteeinwanderung",
        "Jobs Deutschland Libanon",
      ],
    },
    chancenkarte: {
      title: "Chancenkarte (Deutschland) | URM Enroll",
      description:
        "Die Chancenkarte erklärt — Deutschlands punktebasierte Aufenthaltserlaubnis für Fachkräfte. Eignungsquiz, Prozess, Voraussetzungen, FAQ.",
      keywords: ["Chancenkarte", "Opportunity Card Deutschland", "Chancenkarte Punkte"],
    },
    chancenkarteEligibility: {
      title: "Chancenkarte Eignungsquiz | URM Enroll Deutschland",
      description:
        "Realistischer Chancenkarte-Score in 6 Minuten. 18 Fragen, kostenlos. Spiegelt das offizielle Punktesystem.",
      keywords: ["Chancenkarte Eignung", "Chancenkarte Rechner", "Opportunity Card"],
    },
    chancenkarteProcess: {
      title: "Chancenkarte Prozess Schritt für Schritt | URM Enroll",
      description:
        "Der vollständige Chancenkarte-Prozess: Eignung, Anabin-Anerkennung, Sperrkonto, Visumsinterview, Ankunfts-Concierge.",
      keywords: ["Chancenkarte Prozess", "Visum Deutschland Schritte"],
    },
    chancenkarteRequirements: {
      title: "Chancenkarte Voraussetzungen & Checkliste | URM Enroll",
      description:
        "Offizielle Chancenkarte-Checkliste — Identität, Qualifikationen, Berufserfahrung, Sprache, Finanzen.",
      keywords: ["Chancenkarte Voraussetzungen", "Chancenkarte Dokumente"],
    },
    chancenkarteSuccessStories: {
      title: "Chancenkarte Erfolgsgeschichten | URM Enroll Deutschland",
      description:
        "Verifizierte URM-Klienten, die per Chancenkarte nach Deutschland kamen — Pflege, Software, Mechatronik, Lehre.",
      keywords: ["Chancenkarte Erfolge", "Migration Deutschland"],
    },
    chancenkarteFaq: {
      title: "Chancenkarte FAQ — Ehrliche Antworten | URM Enroll",
      description:
        "Die meistgestellten Chancenkarte-Fragen, ehrlich beantwortet. Eignung, Punkte, Sperrkonto, Bearbeitungszeit, Familiennachzug.",
      keywords: ["Chancenkarte FAQ", "Opportunity Card FAQ"],
    },
    germanyJobs: {
      title: "Jobs in Deutschland für Libanon & MENA | URM Enroll",
      description:
        "Kuratierte deutsche Arbeitgeber-Shortlists für Fachkräfte — Pflege, Technik, IT, Handwerk. Orientiert an Ihrer Chancenkarte-Reife.",
      keywords: ["Jobs Deutschland", "Engpassberufe", "Fachkräfte Deutschland"],
    },
    germanyRelocation: {
      title: "Umzugsservices Deutschland | URM Enroll",
      description:
        "Komplette Umzugsservices Deutschland — Visumstermin, Anmeldung, Wohnen, Krankenversicherung, Steuer-ID, Banking, Familie.",
      keywords: ["Umzug Deutschland", "Anmeldung", "Wohnung Deutschland Expats"],
    },
    privacy: {
      title: "Datenschutzerklärung",
      description: "Lesen Sie, wie URM Enroll Daten für Studienberatung und internationale Immatrikulation verarbeitet.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    terms: {
      title: "Allgemeine Geschäftsbedingungen",
      description: "Lesen Sie die Nutzungsbedingungen von URM Enroll für Studienberatung und Auslandsstudium-Services.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    cookies: {
      title: "Cookie-Richtlinie",
      description: "Erfahren Sie, wie URM Enroll Cookies einsetzt, um die Website und Beratungserfahrung zu verbessern.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
    impressum: {
      title: "Impressum",
      description: "Impressum und Unternehmensangaben der URM Enroll Ltd — internationale Studienberatung und Einschreibungsservices.",
      keywords: [...GLOBAL_KEYWORDS.de, "Impressum", "rechtliche Hinweise"],
    },
    notFound: {
      title: "Seite nicht gefunden",
      description: "Die angeforderte Seite wurde nicht gefunden. Entdecken Sie URM Enroll Services für Studium in Deutschland.",
      keywords: [...GLOBAL_KEYWORDS.de],
    },
  },
};

export const inferPageKeyFromPath = (path: string): SeoPageKey => {
  const cleaned = path.replace(/\/+$/, "") || "/";
  if (cleaned === "/") return "home";
  if (cleaned.endsWith("/services")) return "services";
  if (cleaned.endsWith("/programs")) return "services";
  if (cleaned.endsWith("/destinations")) return "destinations";
  if (cleaned.endsWith("/nursing-assessment")) return "nursing";
  if (cleaned.endsWith("/nursing")) return "nursing";
  if (cleaned.endsWith("/germany-jobs")) return "germanyJobs";
  if (cleaned.endsWith("/germany-relocation")) return "germanyRelocation";
  if (cleaned.endsWith("/chancenkarte/eligibility")) return "chancenkarteEligibility";
  if (cleaned.endsWith("/chancenkarte/process")) return "chancenkarteProcess";
  if (cleaned.endsWith("/chancenkarte/requirements")) return "chancenkarteRequirements";
  if (cleaned.endsWith("/chancenkarte/success-stories")) return "chancenkarteSuccessStories";
  if (cleaned.endsWith("/chancenkarte/faq")) return "chancenkarteFaq";
  if (cleaned.endsWith("/chancenkarte")) return "chancenkarte";
  if (cleaned.endsWith("/partnerships")) return "partnerships";
  if (cleaned.endsWith("/about")) return "about";
  if (cleaned.endsWith("/contact")) return "contact";
  if (cleaned.endsWith("/quiz")) return "quiz";
  if (cleaned.endsWith("/privacy")) return "privacy";
  if (cleaned.endsWith("/terms")) return "terms";
  if (cleaned.endsWith("/cookies")) return "cookies";
  if (cleaned.endsWith("/impressum")) return "impressum";
  return "notFound";
};

export const localizedPath = (lang: SupportedLanguage, path: string): string => {
  const cleaned = path === "/" ? "" : path.replace(/\/+$/, "");
  return `/${lang}${cleaned}`;
};
