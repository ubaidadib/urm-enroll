export const quiz = {
  badge: "ذكاء مسار الطالب",
  title: "تقييم ملاءمة الطالب",
  description: "أجب عن 5 أسئلة لمواءمة مسارات ألمانيا المؤسسية.",
  questions: {
    destination: "أين ترغب بالدراسة؟",
    studyLevel: "ما مستوى الدراسة؟",
    field: "مجال الاهتمام؟",
    budget: "الميزانية السنوية؟",
    timeline: "متى تخطط للبدء؟",
  },
  stepLabel: "الخطوة",
  progressLabel: "التقدم",
  continue: "متابعة",
  back: "رجوع",
  validationRequired: "يرجى اختيار إجابة للمتابعة.",
  dataSecure: "بياناتك آمنة ولا تُشارك بدون موافقتك.",
  reassurance: "معالجة آمنة وفق معايير GDPR.",
  reassuranceNote: "البيانات مشفرة أثناء النقل وتُستخدم فقط للمطابقة الاستشارية.",
  calculatingTitle: "نحلل ملفك",
  calculatingSubtitle: "معالجة أكثر من 200 نقطة بيانات...",
  resultLabel: "درجة المطابقة",
  resultBadge: "تم العثور على تطابق ممتاز",
  resultTitle: "جاهز للنجاح",
  resultDescription: "اعتمادا على ملفك، حددنا مسارات مؤسسية وفرصا مناسبة.",
  recommendations: {
    high: "توافق قوي لمسارات ألمانيا. ابدأ تجهيز الوثائق والجدول الزمني.",
    medium: "توافق جيد مع فجوات امتثال بسيطة. ركز على الوثائق واللغة.",
    low: "توافق أولي. ابدأ بفحص الأهلية وخطة التمويل قبل التقديم.",
    nursing: "تم تحديد مسار التمريض. الأولوية لجاهزية الاعتراف ومعايير اللغة.",
  },
  consultationCta: "احجز استشارة مجانية",
  restart: "ابدأ من جديد",
  nursingBadge: "مسار الاعتراف للتمريض",
  nursingLanguage: "متطلب اللغة المتوقع",
  nursingTimeline: "مدة الاعتراف",
  recognitionScore: "مؤشر جاهزية الاعتراف",
  visaEstimatorTitle: "مقدر زمن التأشيرة",
  visaEstimatorNote: "التقدير يعتمد على جاهزية المستندات والطاقة الاستيعابية.",
  probabilityDelay: "جاري حساب احتمالية التأشيرة...",
  of: "من",
  nursingSpecializedTitle: "تم اكتشاف مسار متخصص",
  nursingSpecializedDescription: "تشمل برامج التمريض في ألمانيا دعماً كاملاً للترخيص.",
  visaProcessing: "معالجة التأشيرة",
  submitting: "جارٍ الإرسال…",
  submitError: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  recognition: "الاعتراف",
  destinations: [
    {
      value: "Germany",
      label: "ألمانيا",
    },
    {
      value: "Italy",
      label: "إيطاليا",
    },
    {
      value: "Spain",
      label: "إسبانيا",
    },
    {
      value: "France",
      label: "فرنسا",
    },
    {
      value: "Canada",
      label: "كندا",
    },
    {
      value: "Turkey",
      label: "تركيا",
    },
    {
      value: "Other",
      label: "وجهة أخرى",
    },
  ],
  studyLevels: [
    {
      value: "Undergraduate",
      label: "بكالوريوس",
    },
    {
      value: "Postgraduate",
      label: "ماجستير",
    },
    {
      value: "Doctorate",
      label: "دكتوراه",
    },
    {
      value: "Foundation",
      label: "تحضيري / مسار",
    },
  ],
  fields: [
    {
      value: "Business",
      label: "إدارة الأعمال",
    },
    {
      value: "Engineering",
      label: "الهندسة",
    },
    {
      value: "Computer Science",
      label: "علوم الحاسوب",
    },
    {
      value: "Nursing",
      label: "التمريض",
    },
    {
      value: "Medicine",
      label: "الطب والصحة",
    },
    {
      value: "Arts",
      label: "الآداب والعلوم الإنسانية",
    },
    {
      value: "Law",
      label: "القانون",
    },
    {
      value: "Sciences",
      label: "العلوم",
    },
    {
      value: "Other",
      label: "أخرى",
    },
  ],
  budgets: [
    {
      value: "Under 20000",
      label: "أقل من 20,000$",
    },
    {
      value: "20000-40000",
      label: "20,000$ - 40,000$",
    },
    {
      value: "40000-60000",
      label: "40,000$ - 60,000$",
    },
    {
      value: "Above 60000",
      label: "أكثر من 60,000$",
    },
    {
      value: "Scholarship",
      label: "أحتاج إرشاد للمنح",
    },
  ],
  timelines: [
    {
      value: "Next semester",
      label: "الفصل القادم",
    },
    {
      value: "Within 6 months",
      label: "خلال 6 أشهر",
    },
    {
      value: "6-12 months",
      label: "6-12 شهرا",
    },
    {
      value: "More than a year",
      label: "أكثر من سنة",
    },
    {
      value: "Exploring",
      label: "مجرد استكشاف",
    },
  ],
} as const;

export const institutional = {
  badge: "شراكات مؤسسية",
  title: "حراك مؤسسي موجه لألمانيا",
  description: "شراكات مؤسسية لتقديم تنقل طلابي وتوظيف صحي منظم إلى ألمانيا.",
  segment: {
    title: "من نخدم؟",
    sub: "حلول مصممة لكل نوع من المؤسسات.",
    solutions: "حلول",
  },
  segments: [
    {
      value: "university",
      label: "الجامعات",
      description: "حوكمة القبول ومواءمة الدفعات والمؤشرات.",
      highlights: [
        "تصنيف Nexus Fit",
        "حوكمة القبول",
        "تقارير SLA",
      ],
    },
    {
      value: "hospital",
      label: "المستشفيات",
      description: "مسارات تمريض متوافقة مع جداول الاعتراف.",
      highlights: [
        "جاهزية الترخيص",
        "معايير اللغة",
        "تهيئة أصحاب العمل",
      ],
    },
    {
      value: "agency",
      label: "الوكالات",
      description: "أطر شراكة مع نقاط امتثال وتقارير.",
      highlights: [
        "استقبال مشترك",
        "تدقيق المستندات",
        "رؤية المسار",
      ],
    },
    {
      value: "government",
      label: "الجهات الحكومية",
      description: "برامج منظمة بحوكمة قابلة للتدقيق.",
      highlights: [
        "مواءمة السياسات",
        "تخفيف المخاطر",
        "لوحات النتائج",
      ],
    },
  ],
  responseTime: "متوسط الرد: 48 ساعة",
  cta: {
    student: "مسار الطالب",
    partner: "شراكة مع URM",
  },
  capabilities: {
    title: "ما نقدمه",
    sub: "دعم شامل من الامتثال إلى التوظيف.",
    items: [
      {
        title: "حوكمة قبول منظمة",
        description: "ضوابط مؤسسية ونقاط امتثال مطابقة للمعايير الألمانية.",
      },
      {
        title: "ذكاء تكامل القوى العاملة",
        description: "مسارات تمريض ورعاية صحية وفق جداول الاعتراف والترخيص.",
      },
      {
        title: "جاهزية بيانات مدققة",
        description: "تصنيف Nexus وتأهيل ملفات قابلة للتدقيق المؤسسي.",
      },
    ],
  },
  trust: {
    label: "امتثال موثّق",
  },
  trustMarkers: [
    "بيانات وفق GDPR",
    "اعتماد ICEF",
    "امتثال ألماني",
  ],
  process: {
    title: "مسار الانضمام المؤسسي",
    sub: "من أول تواصل إلى شراكة فعّالة في أربع خطوات واضحة.",
    steps: [
      {
        title: "الاكتشاف والمتطلبات",
        description: "تحديد نطاق الشراكة واحتياجات الامتثال ومسارات ألمانيا.",
      },
      {
        title: "التأهيل والتحقق",
        description: "فحص الملفات وتدقيق المستندات ومؤشرات الجاهزية.",
      },
      {
        title: "التنفيذ والمتابعة",
        description: "تشغيل الدفعات مع مؤشرات SLA ونقاط الامتثال.",
      },
      {
        title: "تقارير النتائج",
        description: "تقارير مؤسسية وتخفيف المخاطر وتحسين مستمر.",
      },
    ],
  },
  sla: [
    {
      label: "زمن الاستجابة",
      value: "48 ساعة",
      note: "تأكيد استلام الطلب",
    },
    {
      label: "الانضمام",
      value: "2-4 أسابيع",
      note: "مواءمة الامتثال والبيانات",
    },
    {
      label: "التقارير",
      value: "شهري",
      note: "لوحات حوكمة جاهزة",
    },
  ],
  data: {
    title: "حوكمة بيانات متوافقة مع GDPR",
    description: "نعالج بيانات المؤسسات بضوابط وصول صارمة وتشفير أثناء النقل وسياسات احتفاظ مدققة.",
  },
  form: {
    title: "طلب شراكة مؤسسية",
    subtitle: "حدد نوع المؤسسة لتلقي مقترح موجه لألمانيا.",
    close: "إغلاق",
    stepLabel: "الخطوة",
    stepOne: "الخطوة 1: جهة التواصل",
    stepTwo: "الخطوة 2: نطاق الشراكة",
    successTitle: "تم استلام الطلب",
    next: "متابعة",
    back: "عودة",
    organizationType: "نوع المؤسسة",
    organizationName: "اسم المؤسسة",
    contactName: "اسم جهة التواصل",
    contactEmail: "البريد المؤسسي",
    roleTitle: "المسمى الوظيفي أو القسم",
    organizationNamePlaceholder: "مثال: مركز برلين الطبي",
    contactNamePlaceholder: "الاسم الكامل",
    contactEmailPlaceholder: "work@email.com",
    roleTitlePlaceholder: "مثال: رئيس الموارد البشرية",
    organizationSize: "حجم المؤسسة",
    geographicScope: "النطاق الجغرافي",
    partnershipType: "نوع الشراكة",
    budgetAuthority: "سلطة الميزانية",
    candidateVolume: "حجم المرشحين المتوقع",
    candidateVolumePlaceholder: "مثال: 50–200",
    complianceTimeline: "الجدول الزمني للامتثال",
    notes: "ملاحظات استراتيجية",
    selectPlaceholder: "اختر",
    submit: "إرسال طلب الشراكة",
    validation: "يرجى استكمال جميع الحقول المطلوبة.",
    success: "شكرا لكم. سيعاود فريقنا المؤسسي التواصل خلال 48 ساعة.",
    error: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
    organizationTypes: [
      {
        value: "university",
        label: "جامعة",
      },
      {
        value: "hospital",
        label: "مستشفى أو مجموعة صحية",
      },
      {
        value: "agency",
        label: "وكالة تعليمية",
      },
      {
        value: "government",
        label: "جهة حكومية",
      },
      {
        value: "student",
        label: "شريك استقبال طلاب",
      },
    ],
    organizationSizes: [
      {
        value: "1-50",
        label: "1-50 موظف",
      },
      {
        value: "51-250",
        label: "51-250 موظف",
      },
      {
        value: "251-1000",
        label: "251-1,000 موظف",
      },
      {
        value: "1000+",
        label: "أكثر من 1,000 موظف",
      },
    ],
    geographicScopes: [
      {
        value: "germany",
        label: "ألمانيا",
      },
      {
        value: "mena",
        label: "الشرق الأوسط وشمال أفريقيا",
      },
      {
        value: "europe",
        label: "أوروبا",
      },
      {
        value: "global",
        label: "عالمي",
      },
    ],
    partnershipTypes: [
      {
        value: "student-mobility",
        label: "تنقل طلابي",
      },
      {
        value: "nursing-recruitment",
        label: "توظيف تمريض",
      },
      {
        value: "compliance-advisory",
        label: "استشارات امتثال",
      },
      {
        value: "workforce-integration",
        label: "تكامل قوى عاملة",
      },
    ],
    budgetAuthorities: [
      {
        value: "decision-maker",
        label: "صاحب قرار",
      },
      {
        value: "influencer",
        label: "مؤثر",
      },
      {
        value: "informational",
        label: "جمع معلومات",
      },
    ],
  },
} as const;

export const agentPortal = {
  badge: "بوابة الوكيل",
  title: "مركز قيادة التوظيف الخاص بك",
  description: "بوابة B2B مخصصة للوكلاء الفرعيين وشركاء التوظيف — تتبع التوظيفات واكسب العمولات وأدر الامتثال في الوقت الفعلي.",
  tiers: {
    title: "مستويات العمولة",
    popular: "الأكثر شيوعاً",
    perPlacement: "لكل توظيف",
  },
  dashboard: {
    title: "معاينة لوحة التحكم المباشرة",
    live: "معاينة مباشرة",
    recentLabel: "نشاط خط الأنابيب الأخير",
    stats: {
      activeLeads: "العملاء المحتملون",
      conversionRate: "معدل التحويل",
      avgPlacement: "متوسط التوظيف",
      complianceScore: "درجة الامتثال",
    },
  },
  features: {
    title: "إمكانيات البوابة",
    items: {
      realTimePipeline: {
        title: "خط أنابيب فوري",
        description: "تتبع كل طالب من الاستفسار إلى التسجيل مع تحديثات الحالة المباشرة.",
      },
      complianceDash: {
        title: "لوحة الامتثال",
        description: "تحقق تلقائي من المستندات ومراقبة نقاط التفتيش التنظيمية.",
      },
      commissionTracker: {
        title: "متتبع العمولات",
        description: "أرباح شفافة لكل توظيف مع دفعات شهرية تلقائية.",
      },
      multiRegion: {
        title: "وصول متعدد المناطق",
        description: "أدر الطلاب عبر 14 دولة وجهة من لوحة تحكم واحدة.",
      },
    },
  },
  cta: "تقدم للحصول على وصول للبوابة",
  ctaSub: "متوسط التفعيل: 48 ساعة",
} as const;
