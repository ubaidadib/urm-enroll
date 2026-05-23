import { languageLabel, languageNative, preloader, cookieBanner, common, globalCta, leadForm, funnelCta, agencyComparison, trust, booking } from './common';
import { header } from './nav';
import { hero } from './hero';
import { contact } from './contact';
import { quiz, institutional, agentPortal } from './enrollment';
import { nexus, nexusLaunch, services, destinations, workforce, nursing, studentJourney, destinationComparison, workforceCalculator, findProgram } from './programs';
import { about, socialProof, timeline, partnerships, caseStudies, globalPartners, founder, successStories } from './about';
import { legalPagesLabel, legalPages } from './legal';
import { notFound, errorBoundary } from './errors';
import { footer } from './footer';
import { seo } from './seo';
import { germany } from './germany';
import { chancenkarte } from './chancenkarte';
import { eligibilityQuiz } from './eligibilityQuiz';

export const ar = {
  germany,
  chancenkarte,
  eligibilityQuiz,
  languageLabel,
  languageNative,
  seo,
  header,
  preloader,
  hero,
  nexus,
  nexusLaunch,
  services,
  destinations,
  workforce,
  nursing,
  studentJourney,
  destinationComparison,
  workforceCalculator,
  socialProof,
  timeline,
  quiz,
  institutional,
  partnerships,
  about,
  caseStudies,
  globalPartners,
  successStories,
  footer,
  cookieBanner,
  legalPagesLabel,
  legalPages,
  founder,
  common,
  notFound,
  errorBoundary,
  agentPortal,
  contact,
  globalCta,
  leadForm,
  funnelCta,
  agencyComparison,
  trust,
  booking,
  nursingAssessment: {
    pageTitle: "تقييم برنامج التمريض في ألمانيا | URM Enroll",
    description: "تقييم شامل لمعرفتك بمتطلبات برنامج التمريض في ألمانيا",
    heading: "اختبار برنامج التمريض في ألمانيا",
    subheading: "اختبر معلوماتك قبل التقديم — ٢٠ سؤالاً",
    progress: {
      question: "السؤال",
      percent: "% مكتمل"
    },
    badges: {
      easy: "سهل",
      medium: "متوسط",
      hard: "صعب",
      mc: "اختيار متعدد",
      tf: "صواب / خطأ",
      scenario: "سيناريو"
    },
    options: {
      a: "أ",
      b: "ب",
      c: "ج",
      d: "د"
    },
    nav: {
      previous: "السابق",
      next: "التالي",
      finish: "عرض النتائج",
      score: "النتيجة:"
    },
    feedback: {
      correct: "إجابة صحيحة — ",
      wrong: "إجابة خاطئة — "
    },
    results: {
      title: "نتائج التقييم",
      verdictExcellent: "ممتاز — أنت مؤهل للتقديم",
      verdictGood: "جيد — راجع بعض المحاور قبل التقديم",
      verdictNeedsWork: "تحتاج إلى مزيد من الدراسة قبل التقديم",
      verdictDescription: "بناءً على إجاباتك، إليك تقييمك العام للبرنامج.",
      easyLabel: "الأسئلة السهلة",
      mediumLabel: "الأسئلة المتوسطة",
      hardLabel: "الأسئلة الصعبة",
      retake: "إعادة الاختبار",
      contact: "التواصل مع فريق التمريض"
    }
  },
  universities: {
    listing: {
      hero: {
        badge: "مستكشف الجامعات",
        title: "استكشف الجامعات",
        subtitle: "اكتشف الجامعات الرائدة في أوروبا. صفِّ النتائج حسب الموقع والنوع والتخصص لاختيار أفضل مسار أكاديمي لك.",
        searchPlaceholder: "ابحث عن الجامعات بالاسم أو المدينة أو الدولة...",
        primaryCta: "ابحث عن جامعة",
        secondaryCta: "استعرض البرامج",
        stats: {
          universities: "الجامعات",
          countries: "الدول",
          cities: "المدن",
        },
      },
      filters: {
        title: "الفلاتر",
        country: "الدولة",
        type: "النوع",
        apply: "تطبيق الفلاتر",
        clearAll: "مسح الكل",
      },
      sort: {
        bestRanking: "الترتيب: الأفضل تصنيفًا",
        name: "الترتيب: الاسم (أ-ي)",
        mostPrograms: "الترتيب: الأكثر برامج",
      },
      search: {
        results: "النتائج",
        trending: "الرائج",
        recent: "الأخيرة",
        noResults: "لا توجد نتائج مطابقة",
      },
      results: {
        showing: "عرض",
        of: "من أصل",
        items: "الجامعات",
      },
      empty: {
        title: "لم يتم العثور على جامعات",
        description: "جرّب تعديل البحث أو الفلاتر لاستكشاف مزيد من المؤسسات.",
        clearFilters: "مسح الفلاتر",
      },
    },
    detail: {
      breadcrumbHome: "الرئيسية",
      breadcrumbUniversities: "الجامعات",
      applyNow: "قدّم الآن",
      saveUniversity: "حفظ الجامعة",
      quickStats: {
        founded: "سنة التأسيس",
        totalPrograms: "إجمالي البرامج",
        languages: "اللغات",
        type: "نوع الجامعة",
        ranking: "التصنيف",
      },
      tabs: {
        overview: "نظرة عامة",
        programs: "البرامج",
        campus: "الحرم الجامعي",
        requirements: "المتطلبات",
        location: "الموقع",
      },
      sections: {
        overviewTitle: "حول الجامعة",
        programsTitle: "برامج {name}",
        requirementsTitle: "المتطلبات",
        locationTitle: "الموقع",
        relatedTitle: "جامعات مشابهة قد تعجبك",
      },
    },
  },
  programs: {
    listing: {
      hero: {
        badge: "اكتشاف البرامج",
        title: "اكتشف البرامج",
        subtitle: "استكشف آلاف البرامج الأكاديمية في أوروبا. صفِّ النتائج حسب الدرجة والتخصص واللغة والرسوم للعثور على الخيار الأنسب.",
        searchPlaceholder: "ابحث عن البرامج والجامعات والتخصصات...",
        primaryCta: "استكشف البرامج",
        secondaryCta: "استعرض الجامعات",
        stats: {
          programs: "البرامج",
          universities: "الجامعات",
          fields: "التخصصات",
        },
      },
      filters: {
        title: "الفلاتر",
        degree: "الدرجة",
        field: "التخصص",
        language: "اللغة",
        duration: "المدة",
        tuition: "الرسوم",
        apply: "تطبيق الفلاتر",
        clearAll: "مسح الكل",
      },
      sort: {
        relevance: "الترتيب: الصلة",
        lowestTuition: "الترتيب: أقل رسوم",
        shortestDuration: "الترتيب: أقصر مدة",
        name: "الترتيب: الاسم",
      },
      search: {
        results: "النتائج",
        trending: "الرائج",
        recent: "الأخيرة",
        noResults: "لا توجد نتائج مطابقة",
      },
      results: {
        showing: "عرض",
        of: "من أصل",
        items: "البرامج",
      },
      empty: {
        title: "لم يتم العثور على برامج",
        description: "جرّب تعديل الفلاتر أو كلمات البحث لاكتشاف خيارات أكثر.",
        clearFilters: "مسح الفلاتر",
      },
    },
    detail: {
      breadcrumbHome: "الرئيسية",
      breadcrumbPrograms: "البرامج",
      applyNow: "قدّم الآن",
      saveProgram: "حفظ البرنامج",
      viewProgram: "عرض البرنامج",
      keyInfo: {
        tuition: "الرسوم السنوية",
        duration: "مدة البرنامج",
        language: "اللغة",
        deadline: "آخر موعد للتقديم",
      },
      tabs: {
        overview: "نظرة عامة",
        curriculum: "الخطة الدراسية",
        requirements: "المتطلبات",
        careerOutcomes: "المخرجات المهنية",
        apply: "التقديم",
      },
      sections: {
        whyProgram: "لماذا هذا البرنامج؟",
        relatedTitle: "قد يعجبك أيضًا",
        outcomesSalary: "متوسط الراتب الابتدائي",
      },
    },
  },
  comparison: {
    hero: {
      badge: "مقارنة البرامج",
    },
    title: "مقارنة البرامج",
    subtitle: "راجع الفروقات الأساسية واختر الأنسب لك.",
    compareNow: "قارن الآن",
    clearAll: "مسح الكل",
    emptyTitle: "لا توجد برامج محددة",
    emptyDescription: "أضف برامج من بطاقات القائمة لمقارنتها هنا.",
    browsePrograms: "استعرض البرامج",
    maxItemsToast: "الحد الأقصى للمقارنة هو 3 برامج",
    table: {
      criteria: "المعيار",
      programName: "اسم البرنامج",
      university: "الجامعة",
      degreeLevel: "المستوى الدراسي",
      duration: "المدة",
      language: "اللغة",
      tuitionPerYear: "الرسوم/سنة",
      field: "التخصص",
      requirements: "المتطلبات",
      deadline: "الموعد النهائي",
      rating: "التقييم",
      actions: "الإجراءات",
      remove: "إزالة من المقارنة",
      apply: "تقديم",
      seeDetails: "عرض التفاصيل",
      defaultDeadline: "30 يونيو",
    },
    partialState: {
      title: "أضف برنامجًا آخر للمقارنة",
      description: "اختر برنامجًا إضافيًا من القوائم للحصول على مقارنة كاملة.",
    },
  },
  favorites: {
    hero: {
      badge: "القائمة المحفوظة",
    },
    title: "المحفوظات",
    subtitle: "الوصول إلى الجامعات والبرامج المحفوظة لديك.",
    savedUniversities: "الجامعات المحفوظة",
    savedPrograms: "البرامج المحفوظة",
    saveToFavorites: "حفظ في المفضلة",
    removeFromFavorites: "إزالة من المفضلة",
    removeAll: "إزالة الكل",
    emptyUniversitiesTitle: "لا توجد جامعات محفوظة بعد",
    emptyUniversitiesDescription: "ابدأ باستكشاف أفضل الجامعات واحفظ ما يناسب أهدافك.",
    emptyProgramsTitle: "لا توجد برامج محفوظة بعد",
    emptyProgramsDescription: "احفظ البرامج التي تهمك للمقارنة والتقديم لاحقًا.",
  },
  apply: {
    form: {
      title: "ابدأ طلب التقديم",
      saveDraft: "حفظ مسودة",
      submit: "إرسال الطلب",
      successTitle: "تم إرسال الطلب!",
      successMessage: "شكرًا لك. أرسلنا رسالة تأكيد إلى بريدك الإلكتروني.",
      steps: {
        personalInfo: "المعلومات الشخصية",
        academicBackground: "الخلفية الأكاديمية",
        uploadDocuments: "رفع المستندات",
        reviewSubmit: "مراجعة وإرسال",
      },
      fields: {
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        nationality: "الجنسية",
        phone: "الهاتف",
        lastDegree: "آخر مؤهل",
        gpa: "المعدل",
        graduationYear: "سنة التخرج",
      },
    },
  },
  home: {
    instagram: {
      title: "قصص حقيقية من طلابنا",
      subtitle: "تابع مجتمعنا @urmEnroll",
      viewPost: "عرض على إنستغرام",
      followUs: "تابع مجتمعنا",
      loading: "جارٍ تحميل أحدث القصص من مجتمع طلابنا.",
      error: "محتوى إنستغرام غير متاح مؤقتًا."
    }
  },
  search: {
    placeholder: {
      programs: "ابحث عن البرامج",
      universities: "ابحث عن الجامعات",
      destinations: "ابحث عن الوجهات",
      global: "ابحث عن البرامج والجامعات"
    },
    button: {
      label: "بحث"
    },
    clear: "مسح البحث",
    noResults: "لم يتم العثور على نتائج",
    resultsCount: "{{count}} نتيجة"
  },
  card: {
    program: {
      viewProgram: "عرض البرنامج",
      saveProgram: "حفظ",
      compare: "مقارنة",
      tuitionFrom: "ابتداءً من",
      perYear: "/سنة"
    },
    university: {
      viewUniversity: "عرض الجامعة",
      saveUniversity: "حفظ",
      programs: "{{count}} برامج",
      ranking: "التصنيف"
    }
  },
  discovery: {
    bridge: {
      destinations: {
        eyebrow: "الخطوة التالية",
        title: "حوّل بحثك عن الوجهة إلى خيارات فعلية",
        description: "انقل سياق بحثك الحالي إلى الجامعات أو انتقل مباشرة إلى البرامج المناسبة.",
        primary: "تصفح الجامعات",
        secondary: "عرض البرامج"
      },
      universities: {
        eyebrow: "الخطوة التالية",
        title: "انتقل من المؤسسات إلى البرامج المناسبة",
        description: "احتفظ بسياق السوق الحالي وتابع إلى خيارات الدرجات دون البدء من جديد.",
        primary: "تصفح البرامج",
        secondary: "العودة إلى الوجهات"
      },
      programs: {
        eyebrow: "تحتاج إلى سياق إضافي؟",
        title: "قارن البرامج بالجامعات التي تقدمها",
        description: "ارجع إلى المؤسسات في السوق نفسه أو افتح المقارنة لعرض قائمتك المختصرة جنبًا إلى جنب.",
        primary: "تصفح الجامعات",
        secondary: "فتح المقارنة"
      }
    }
  },
  findProgram,
} as const;
