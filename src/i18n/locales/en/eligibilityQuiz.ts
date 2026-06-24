/* ------------------------------------------------------------------ */
/*  Chancenkarte eligibility quiz copy.                                 */
/* ------------------------------------------------------------------ */

export const eligibilityQuiz = {
  meta: {
    pageTitle: "Chancenkarte Eligibility Quiz | URM Enroll Germany",
    description:
      "Get a realistic Chancenkarte eligibility score in 6 minutes. 18 questions. Free, no signup before scoring.",
  },
  intro: {
    badge: "Chancenkarte readiness check",
    title: "Score your Germany Chancenkarte profile.",
    subtitle:
      "Eighteen questions. Six minutes. A real points-based verdict — not a sales pitch.",
    bullets: [
      "Mirrors the official Chancenkarte scoring rules",
      "Personalised gap analysis at the end",
      "Reveal your full score after submitting your contact details",
    ],
    cta: "Start the quiz",
    estimatedTime: "≈ 6 minutes",
    quizFormat: "Quiz format",
    time: "Time",
    scoreModel: "Score model",
    missionCheckpoints: "Mission checkpoints",
    quickTaps: "18 quick taps",
    realPointsLogic: "Real points logic",
  },
  progress: {
    step: "Step",
    of: "of",
    questionsCompleted: "Questions completed",
    percent: "%",
  },
  nav: {
    next: "Continue",
    back: "Back",
    submit: "See my result",
    skip: "Prefer not to say",
  },
  stepNames: {
    personal: "About you",
    education: "Education",
    experience: "Work experience",
    languages: "Languages",
    financial: "Financial readiness",
    germanyConnection: "Germany ties",
  },
  stepIntros: {
    personal: "A few basics to anchor your profile.",
    education: "How you trained, in your own words.",
    experience: "What you have done, and for how long.",
    languages: "Your German and English standing.",
    financial: "Practicalities the embassy will ask about.",
    germanyConnection: "Any existing link to Germany helps your score.",
  },
  questions: {
    nationality: {
      label: "What is your nationality?",
      help: "We use this to map your visa pathway and embassy.",
      placeholder: "e.g. Lebanese",
    },
    residence: {
      label: "Which country do you currently live in?",
      help: "Determines which German consulate you would apply through.",
      placeholder: "e.g. Lebanon",
    },
    age: {
      label: "How old are you?",
      help: "Age contributes to your points — applicants under 35 score highest.",
      options: {
        under_25: "Under 25",
        "25_34": "25 – 34",
        "35_39": "35 – 39",
        "40_44": "40 – 44",
        "45_plus": "45 or older",
      },
    },
    maritalStatus: {
      label: "What is your marital status?",
      help: "If your spouse also qualifies, your score increases.",
      options: {
        single: "Single",
        married: "Married",
        married_qualified_spouse: "Married — spouse also qualified for Chancenkarte",
      },
    },
    degreeType: {
      label: "What is your highest completed degree?",
      help: "Be honest — only completed qualifications count.",
      options: {
        phd: "Doctorate / PhD",
        master: "Master's degree",
        bachelor: "Bachelor's degree",
        diploma: "Diploma / Technical degree",
        secondary: "Secondary school only",
      },
    },
    universityRecognised: {
      label: "Is your degree-issuing institution listed on Anabin?",
      help: "Anabin is the official German database of recognised foreign qualifications.",
      options: {
        anabin_recognised: "Yes, H+ (recognised)",
        uncertain: "I'm not sure",
        not_recognised: "No",
      },
    },
    vocationalTraining: {
      label: "Do you have completed vocational training?",
      help: "Formal apprenticeship or trade certification (Ausbildung).",
      options: {
        yes_two_years_plus: "Yes — at least 2 years",
        yes_less_than_two: "Yes — under 2 years",
        no: "No",
      },
    },
    graduationYear: {
      label: "When did you graduate?",
      help: "Recent graduates often score slightly higher.",
      options: {
        within_5_years: "Within the last 5 years",
        "5_to_10_years": "Between 5 and 10 years ago",
        over_10_years: "More than 10 years ago",
      },
    },
    profession: {
      label: "What is your current or most recent profession?",
      help: "Free text — be specific (e.g. 'ICU nurse', not 'healthcare').",
      placeholder: "e.g. Senior frontend developer",
    },
    yearsExperience: {
      label: "How many years of qualified experience do you have?",
      help: "Only work after your qualification counts.",
      options: {
        less_than_2: "Less than 2 years",
        "2_to_4": "2 – 4 years",
        "5_or_more": "5 years or more",
      },
    },
    employmentStatus: {
      label: "What is your current employment status?",
      options: {
        employed_full_time: "Employed full-time",
        employed_part_time: "Employed part-time",
        self_employed: "Self-employed",
        unemployed: "Currently unemployed",
      },
    },
    germanLevel: {
      label: "Your current German level (Goethe-equivalent)",
      help: "Self-assessment is fine — we will verify with a placement test later.",
      options: {
        c1_or_higher: "C1 or higher",
        b2: "B2",
        b1: "B1",
        a2: "A2",
        a1: "A1",
        none: "No German yet",
      },
    },
    englishLevel: {
      label: "Your current English level",
      options: {
        c1_or_higher: "C1 or higher",
        b2: "B2",
        b1: "B1",
        below_b1: "Below B1",
      },
    },
    languageCertification: {
      label: "Do you hold a recognised language certificate?",
      help: "Goethe, telc, TestDaF for German — IELTS, TOEFL, Cambridge for English.",
      options: {
        certified: "Yes, current and certified",
        in_progress: "Studying — exam booked or planned",
        none: "No certificate yet",
      },
    },
    blockedAccount: {
      label: "Can you fund a German blocked account (≈ €11,904)?",
      help: "Required proof-of-living-costs for the visa. URM helps you open one without travel.",
      options: {
        yes_ready: "Yes, funds are ready",
        partially: "Partially — need a few months to gather",
        no: "No",
      },
    },
    sponsorAvailable: {
      label: "Do you have a sponsor in Germany who could co-sign?",
      help: "Optional — a German resident willing to provide a Verpflichtungserklärung.",
      options: { yes: "Yes", no: "No" },
    },
    previousStay: {
      label: "Have you previously lived in Germany?",
      options: {
        yes_six_months_plus: "Yes — for 6 months or longer",
        yes_under_six_months: "Yes — short stay",
        no: "Never",
      },
    },
    relativesInGermany: {
      label: "Do you have relatives currently living in Germany?",
      options: {
        yes_close: "Yes — spouse / parents / children",
        yes_extended: "Yes — extended family",
        no: "No",
      },
    },
    previousApplication: {
      label: "Have you applied for a German visa before?",
      options: {
        yes_approved: "Yes — and it was approved",
        yes_rejected: "Yes — it was rejected",
        no: "No, this would be my first",
      },
    },
  },
  /* ------------------ Lead capture gate -------------------------- */
  gate: {
    badge: "Almost there",
    title: "Where should we send your detailed result?",
    description:
      "Your full Chancenkarte breakdown, gap analysis, and personalised next steps. We do not spam — one email, then a call only if you book one.",
    fields: {
      fullName: "Full name",
      email: "Email",
      whatsapp: "WhatsApp number",
      profession: "Current profession",
      country: "Country of residence",
    },
    placeholders: {
      fullName: "Jane Doe",
      email: "jane@example.com",
      whatsapp: "+961 70 000 000",
      profession: "Senior nurse",
      country: "Lebanon",
    },
    consent:
      "By continuing, you agree to URM Enroll contacting you about Germany migration services. We follow GDPR.",
    submit: "Reveal my score",
    submitting: "Calculating…",
    error: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email",
      submit: "Could not send the form. Please try again.",
      turnstile: "Please complete the security check.",
    },
  },
  /* --------------------- Results ---------------------------------- */
  result: {
    badge: "Your Chancenkarte result",
    titleHighlyEligible: "You look highly eligible.",
    titlePotentiallyEligible: "You are likely eligible — with caveats.",
    titleNeedsImprovement: "Not yet — but a clear plan gets you there.",
    subtitleHighlyEligible:
      "Your profile clears the Chancenkarte threshold with room to spare. We recommend formalising your application.",
    subtitlePotentiallyEligible:
      "You meet the minimum threshold. A targeted upgrade on one or two areas will significantly improve approval odds.",
    subtitleNeedsImprovement:
      "Today's score is below the 6-point minimum. The good news: this is the most fixable migration pathway in Europe.",
    score: "Your score",
    pointsLabel: "points",
    outOf: "of",
    thresholdMet: "Above 6-point minimum",
    thresholdMissed: "Below 6-point minimum",
    confidenceLabel: "Eligibility confidence",
    confidence: {
      high: "High confidence",
      medium: "Moderate confidence",
      low: "Build-up required",
    },
    confidenceNote: {
      high: "Your current profile aligns strongly with Chancenkarte expectations.",
      medium: "You are close. One or two upgrades can materially improve your approval odds.",
      low: "You need targeted improvements before filing to maximize your success probability.",
    },
    categoryBreakdown: "Score breakdown",
    missionStatusLabel: "Mission status",
    missionPassed: "Mission passed",
    missionInProgress: "Mission in progress",
    missionPassedNote: "You crossed the minimum Chancenkarte points threshold.",
    missionInProgressNote: "You still have a path. Use the action plan below to improve your profile.",
    missionControl: "Mission control",
    startMission: "Start your mission",
    continueCheckpoint: "Continue to next checkpoint",
    dismissMilestone: "Dismiss milestone",
    missingTitle: "Gaps we noticed",
    actionsTitle: "Recommended next steps",
    actions: {
      improve_german: "Improve your German to B1 (we can recommend partner schools)",
      certify_language: "Sit a recognised language certification (Goethe / telc)",
      verify_anabin: "Verify your university and degree on Anabin",
      open_blocked_account: "Open a Sperrkonto with a regulated provider",
      gain_experience: "Build up to 24 months of post-qualification experience",
      book_consultation: "Book a 25-minute strategy call with a Germany advisor",
      prepare_documents: "Begin assembling your visa-grade document pack",
    },
    requirements: {
      germanLevel: "German language level below B1",
      englishLevel: "English level below B1",
      blockedAccount: "Blocked account funds not yet ready",
      universityRecognised: "Degree recognition status uncertain",
      yearsExperience: "Less than 2 years of qualified experience",
    },
    ctaHelper: "Recommended action order",
    cta: {
      primary: "Book my strategy call",
      secondary: "Download my result (PDF)",
      retake: "Retake the quiz",
      whatsapp: "Chat on WhatsApp",
    },
    sharedCopy: "Your result has been shared with our Germany desk. We will reach out within 1 business day.",
  },
} as const;
