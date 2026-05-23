export const eligibilityQuiz = {
  meta: {
    pageTitle: "اختبار الأهلية لبطاقة الفرص | URM Enroll ألمانيا",
    description: "احصل على نتيجة واقعية لبطاقة الفرص في ست دقائق. ١٨ سؤالاً. مجاناً.",
  },
  intro: {
    badge: "فحص جاهزية بطاقة الفرص",
    title: "احسب نقاطك لبطاقة الفرص الألمانية.",
    subtitle: "ثمانية عشر سؤالاً. ست دقائق. حكم حقيقي وفق النقاط — لا رسالة بيع.",
    bullets: [
      "يعكس قواعد التنقيط الرسمية لبطاقة الفرص",
      "تحليل ثغرات شخصي في النهاية",
      "تكشف نتيجتك الكاملة بعد تعبئة بياناتك",
    ],
    cta: "ابدأ الاختبار",
    estimatedTime: "≈ ٦ دقائق",
  },
  progress: {
    step: "خطوة",
    of: "من",
    questionsCompleted: "الأسئلة المُجابة",
    percent: "٪",
  },
  nav: {
    next: "متابعة",
    back: "رجوع",
    submit: "عرض نتيجتي",
    skip: "أفضّل عدم الإفصاح",
  },
  stepNames: {
    personal: "عنك",
    education: "التعليم",
    experience: "الخبرة العملية",
    languages: "اللغات",
    financial: "الاستعداد المالي",
    germanyConnection: "الارتباط بألمانيا",
  },
  stepIntros: {
    personal: "بعض المعلومات الأساسية لتأطير ملفك.",
    education: "كيف تأهلت — بكلماتك أنت.",
    experience: "ما الذي عملت به، ولكم من الوقت.",
    languages: "مستواك في الألمانية والإنجليزية.",
    financial: "تفاصيل ستسألك عنها السفارة.",
    germanyConnection: "أي رابط بألمانيا يحسّن نتيجتك.",
  },
  questions: {
    nationality: {
      label: "ما هي جنسيتك؟",
      help: "نستخدمها لتحديد مسار التأشيرة والسفارة المختصة.",
      placeholder: "مثال: لبنانية",
    },
    residence: {
      label: "في أي بلد تقيم حالياً؟",
      help: "يحدّد القنصلية الألمانية التي ستتقدّم منها.",
      placeholder: "مثال: لبنان",
    },
    age: {
      label: "كم عمرك؟",
      help: "السن يساهم في النقاط — تحت ٣٥ يحصل على أعلى نقاط.",
      options: {
        under_25: "تحت ٢٥",
        "25_34": "٢٥ – ٣٤",
        "35_39": "٣٥ – ٣٩",
        "40_44": "٤٠ – ٤٤",
        "45_plus": "٤٥ أو أكثر",
      },
    },
    maritalStatus: {
      label: "الحالة الاجتماعية؟",
      help: "إذا كان الزوج/ة مؤهلاً أيضاً، ترتفع نتيجتك.",
      options: {
        single: "عازب/ة",
        married: "متزوج/ة",
        married_qualified_spouse: "متزوج/ة — والزوج/ة مؤهل أيضاً لبطاقة الفرص",
      },
    },
    degreeType: {
      label: "أعلى شهادة منتهية بالنجاح؟",
      help: "كن صادقاً — تُحتسب الشهادات المنتهية فقط.",
      options: {
        phd: "دكتوراه",
        master: "ماجستير",
        bachelor: "بكالوريوس",
        diploma: "دبلوم / شهادة فنية",
        secondary: "الثانوية فقط",
      },
    },
    universityRecognised: {
      label: "هل مؤسستك الجامعية مدرجة في Anabin؟",
      help: "Anabin هي قاعدة البيانات الألمانية الرسمية للاعتراف بالشهادات الأجنبية.",
      options: {
        anabin_recognised: "نعم — H+ (معترف بها)",
        uncertain: "غير متأكد",
        not_recognised: "لا",
      },
    },
    vocationalTraining: {
      label: "هل لديك تدريب مهني منتهٍ؟",
      help: "تدريب أو حرفة رسمية (Ausbildung).",
      options: {
        yes_two_years_plus: "نعم — سنتان أو أكثر",
        yes_less_than_two: "نعم — أقل من سنتين",
        no: "لا",
      },
    },
    graduationYear: {
      label: "متى تخرجت؟",
      help: "الخريجون الأحدث قد يحصلون على نقاط أعلى قليلاً.",
      options: {
        within_5_years: "خلال آخر ٥ سنوات",
        "5_to_10_years": "بين ٥ و١٠ سنوات",
        over_10_years: "أكثر من ١٠ سنوات",
      },
    },
    profession: {
      label: "مهنتك الحالية أو الأخيرة؟",
      help: "نصّ حر — كن دقيقاً (مثلاً «ممرض عناية مركزة» بدلاً من «صحة»).",
      placeholder: "مثال: مطوّر واجهات أمامية أول",
    },
    yearsExperience: {
      label: "كم سنة خبرة مؤهلة لديك؟",
      help: "تُحتسب الخبرة بعد الشهادة فقط.",
      options: {
        less_than_2: "أقل من سنتين",
        "2_to_4": "٢ – ٤ سنوات",
        "5_or_more": "٥ سنوات أو أكثر",
      },
    },
    employmentStatus: {
      label: "حالة العمل الحالية؟",
      options: {
        employed_full_time: "موظف بدوام كامل",
        employed_part_time: "موظف بدوام جزئي",
        self_employed: "أعمال حرة",
        unemployed: "غير موظف حالياً",
      },
    },
    germanLevel: {
      label: "مستواك في الألمانية (وفق Goethe)؟",
      help: "التقييم الذاتي مقبول — سنتحقق لاحقاً عبر اختبار.",
      options: {
        c1_or_higher: "C1 أو أعلى",
        b2: "B2",
        b1: "B1",
        a2: "A2",
        a1: "A1",
        none: "لا ألمانية بعد",
      },
    },
    englishLevel: {
      label: "مستواك في الإنجليزية؟",
      options: {
        c1_or_higher: "C1 أو أعلى",
        b2: "B2",
        b1: "B1",
        below_b1: "أقل من B1",
      },
    },
    languageCertification: {
      label: "هل تملك شهادة لغة معترفاً بها؟",
      help: "Goethe وtelc وTestDaF للألمانية — IELTS وTOEFL وCambridge للإنجليزية.",
      options: {
        certified: "نعم، صالحة ومُصدّقة",
        in_progress: "أدرس — الامتحان محجوز",
        none: "لا توجد شهادة بعد",
      },
    },
    blockedAccount: {
      label: "هل يمكنك تمويل حساب مجمّد (≈ ١١٫٩٠٤ يورو)؟",
      help: "إثبات نفقات معيشة مطلوب للتأشيرة. نساعدك بفتحه دون الحاجة إلى السفر.",
      options: {
        yes_ready: "نعم، المبلغ جاهز",
        partially: "جزئياً — أحتاج بضعة أشهر",
        no: "لا",
      },
    },
    sponsorAvailable: {
      label: "هل لديك ضامن في ألمانيا؟",
      help: "اختياري — مقيم ألماني مستعد لتقديم Verpflichtungserklärung.",
      options: { yes: "نعم", no: "لا" },
    },
    previousStay: {
      label: "هل أقمت سابقاً في ألمانيا؟",
      options: {
        yes_six_months_plus: "نعم — ٦ أشهر أو أكثر",
        yes_under_six_months: "نعم — إقامة قصيرة",
        no: "أبداً",
      },
    },
    relativesInGermany: {
      label: "هل لديك أقارب يعيشون في ألمانيا؟",
      options: {
        yes_close: "نعم — زوج/ة / أهل / أبناء",
        yes_extended: "نعم — أقارب من الدرجة الثانية",
        no: "لا",
      },
    },
    previousApplication: {
      label: "هل سبق وتقدّمت بطلب تأشيرة ألمانية؟",
      options: {
        yes_approved: "نعم — وحصلت على الموافقة",
        yes_rejected: "نعم — ورُفضت",
        no: "لا، هذه ستكون المرة الأولى",
      },
    },
  },
  gate: {
    badge: "اقتربت من النتيجة",
    title: "إلى أين نُرسل نتيجتك التفصيلية؟",
    description:
      "تفصيل كامل لبطاقة الفرص، تحليل الثغرات، والخطوات التالية. بلا إزعاج — رسالة واحدة، ثم اتصال فقط إذا حجزت موعداً.",
    fields: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      whatsapp: "رقم واتساب",
      profession: "المهنة الحالية",
      country: "بلد الإقامة",
    },
    placeholders: {
      fullName: "مثال: ريم الحاج",
      email: "name@example.com",
      whatsapp: "+961 70 000 000",
      profession: "ممرضة أولى",
      country: "لبنان",
    },
    consent:
      "بالمتابعة، أنت توافق على تواصل URM Enroll معك بشأن خدمات الانتقال إلى ألمانيا. ملتزمون بـ GDPR.",
    submit: "اعرض نتيجتي",
    submitting: "جارٍ الحساب…",
    error: {
      required: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
      submit: "تعذّر إرسال النموذج. حاول مجدداً.",
      turnstile: "يرجى إكمال فحص الأمان.",
    },
  },
  result: {
    badge: "نتيجتك في بطاقة الفرص",
    titleHighlyEligible: "أنت مؤهل جداً.",
    titlePotentiallyEligible: "أنت مؤهل غالباً — مع تحفّظات بسيطة.",
    titleNeedsImprovement: "ليس بعد — لكن خطة واضحة تأخذك إلى هناك.",
    subtitleHighlyEligible:
      "ملفك يتجاوز عتبة بطاقة الفرص بفارق مريح. نوصي بالمضي قدماً في التقديم.",
    subtitlePotentiallyEligible:
      "تحقق الحد الأدنى. تحسين دقيق في نقطة أو نقطتين يرفع فرص القبول بوضوح.",
    subtitleNeedsImprovement:
      "نتيجتك حالياً دون ٦ نقاط. الخبر السار: هذا أكثر مسار هجرة قابلية للتخطيط في أوروبا.",
    score: "نتيجتك",
    pointsLabel: "نقاط",
    outOf: "من",
    thresholdMet: "تجاوزت حد ٦ نقاط",
    thresholdMissed: "أقل من حد ٦ نقاط",
    confidenceLabel: "ثقة الأهلية",
    confidence: {
      high: "ثقة عالية",
      medium: "ثقة متوسطة",
      low: "تحتاج تعزيزاً",
    },
    confidenceNote: {
      high: "ملفك الحالي متوافق بقوة مع متطلبات بطاقة الفرص.",
      medium: "أنت قريب. تحسين نقطة أو نقطتين يرفع فرص الموافقة بشكل واضح.",
      low: "تحتاج تحسينات مستهدفة قبل التقديم لتعظيم احتمالية النجاح.",
    },
    categoryBreakdown: "تفاصيل النقاط",
    missingTitle: "ثغرات لاحظناها",
    actionsTitle: "خطوات تالية موصى بها",
    actions: {
      improve_german: "ارفع مستواك بالألمانية إلى B1 (نوصي بمدارس شريكة)",
      certify_language: "احصل على شهادة لغة معترف بها (Goethe / telc)",
      verify_anabin: "تحقق من جامعتك وشهادتك عبر Anabin",
      open_blocked_account: "افتح Sperrkonto لدى مقدّم منظَّم",
      gain_experience: "ابنِ ما يصل إلى ٢٤ شهراً من الخبرة المهنية بعد التأهيل",
      book_consultation: "احجز جلسة استشارة ٢٥ دقيقة مع مستشار ألمانيا",
      prepare_documents: "ابدأ بتحضير ملف مستندات بمستوى تأشيرة",
    },
    requirements: {
      germanLevel: "الألمانية أقل من B1",
      englishLevel: "الإنجليزية أقل من B1",
      blockedAccount: "أموال الحساب المجمّد غير جاهزة",
      universityRecognised: "حالة اعتراف الشهادة غير واضحة",
      yearsExperience: "أقل من سنتين خبرة مؤهلة",
    },
    ctaHelper: "ترتيب الإجراء الموصى به",
    cta: {
      primary: "احجز جلسة استراتيجية",
      secondary: "نزّل النتيجة (PDF)",
      retake: "أعد الاختبار",
      whatsapp: "تحدّث عبر واتساب",
    },
    sharedCopy: "أُرسلت نتيجتك إلى مكتب ألمانيا لدينا. سنتواصل خلال يوم عمل واحد.",
  },
} as const;
