export const languageLabel = "English" as const;

export const languageNative = "English" as const;

export const preloader = {
  title: "URM ENROLL",
  subtitle: "URM Nexus",
  loading: "Engineering your future...",
} as const;

export const cookieBanner = {
  title: "Cookie Preferences",
  description: "We use cookies to remember your preferences and improve the site. You can accept or reject non-essential cookies.",
  learnMore: "Read the full cookie policy",
  accept: "Accept All",
  reject: "Reject All",
  savePreferences: "Save Preferences",
  analytics: "Analytics (site improvement)",
  marketing: "Marketing (personalised ads)",
} as const;

export const common = {
  home: "Home",
  breadcrumb: "Breadcrumb",
  skipToContent: "Skip to main content",
  all: "All",
  any: "Any",
  global: "Global",
  viewAll: "View All",
  continue: "Continue",
  retry: "Retry",
  prev: "Prev",
  next: "Next",
  explore: "Explore",
  close: "Close",
  matched: "matched",
  page: "Page",
  approx: "Approx.",
  tuition: "Tuition",
  aria: {
    previousPage: "Previous page",
    nextPage: "Next page",
    previous: "Previous",
    next: "Next",
    scrollLeft: "Scroll left",
    scrollRight: "Scroll right",
    closeFilters: "Close filters",
    sortUniversities: "Sort universities",
    openFilters: "Open filters",
    removeFieldFilter: "Remove field filter",
    removeTypeFilter: "Remove type filter",
    removeOrganizationFilter: "Remove organization filter",
    closeNotice: "Close preference notice",
    shareUniversity: "Share university",
    voiceSearch: "Voice search",
    aiProgramSearch: "AI-powered program search",
    pageNumber: "Page {{page}}",
  },
  theme: {
    label: "Appearance",
    system: "System",
    light: "Light",
    dark: "Dark",
    ariaSystem: "System theme ({{theme}})",
    ariaDark: "Dark mode",
    ariaLight: "Light mode",
  },
} as const;

export const globalCta = {
  student: {
    primary: {
      low: "Explore Programs",
      medium: "Start Your Journey",
      high: "Apply Now",
      highVariantB: "Secure Your Spot Today",
      bannerSub: "Discover world-class programs tailored to your academic goals.",
    },
    secondary: {
      low: "Learn More",
      medium: "Book a Consultation",
      high: "Speak to an Advisor Now",
      bannerSub: "Get personalized guidance from our expert education consultants.",
    },
    b2b: {
      low: "Partnership Info",
      medium: "Become a Partner",
      high: "Join Our Network Today",
      bannerSub: "Unlock institutional partnerships and grow your enrollment pipeline.",
    },
    whatsapp: "Chat with us on WhatsApp",
  },
  agent: {
    primary: {
      low: "View Agent Benefits",
      medium: "Get Started as Agent",
      high: "Register as Agent Now",
      bannerSub: "Access exclusive commission structures and dedicated support.",
    },
    secondary: {
      low: "Agent Resources",
      medium: "Schedule a Call",
      high: "Connect with Our Team",
      bannerSub: "Speak directly with our partnerships team to explore opportunities.",
    },
    b2b: {
      low: "Explore Partnerships",
      medium: "Become a Partner",
      high: "Launch Your Partnership",
      bannerSub: "Join our global network of education recruitment partners.",
    },
    whatsapp: "WhatsApp Us",
  },
  nursing: {
    primary: {
      low: "Explore Nursing Pathways",
      medium: "Start Your Nursing Career",
      high: "Apply for Nursing Program",
      bannerSub: "Begin your journey to a rewarding nursing career in Germany.",
    },
    secondary: {
      low: "Nursing Program Info",
      medium: "Book Nursing Consultation",
      high: "Secure Your Nursing Spot",
      bannerSub: "Get expert guidance on nursing qualifications and placement.",
    },
    b2b: {
      low: "Healthcare Partnerships",
      medium: "Partner with Us",
      high: "Start Healthcare Partnership",
      bannerSub: "Connect your healthcare institution with qualified international nurses.",
    },
    whatsapp: "Chat via WhatsApp",
  },
  germany: {
    primary: {
      low: "Discover Germany",
      medium: "Plan Your Move to Germany",
      high: "Apply for Germany Programs",
      bannerSub: "Unlock tuition-free education and career opportunities in Germany.",
    },
    secondary: {
      low: "Germany Guide",
      medium: "Book Germany Consultation",
      high: "Reserve Your Germany Spot",
      bannerSub: "Expert advice on studying, working, and living in Germany.",
    },
    b2b: {
      low: "German Institutions",
      medium: "Partner for Germany",
      high: "Launch Germany Partnership",
      bannerSub: "Collaborate with us to place students in top German institutions.",
    },
    whatsapp: "WhatsApp Us",
  },
} as const;

export const leadForm = {
  ariaLabel: "Lead capture form",
  badge: "Get Started",
  title: "Start Your Journey Today",
  subtitle: "Tell us about yourself and we'll match you with the right pathway in under 2 minutes.",
  stepOf: "Step {current} of {total}",
  steps: ["Info", "Type", "Details", "Timeline", "Submit"],
  step1: {
    title: "Let's get to know you",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
  },
  step2: {
    title: "How can we help you?",
    subtitle: "Select the option that best describes you.",
    student: {
      title: "I'm a Student",
      description: "Looking to study abroad or advance my career internationally.",
    },
    agent: {
      title: "I'm a Recruitment Agent",
      description: "Looking to partner and recruit students for international programs.",
    },
  },
  step3: {
    student: {
      title: "Tell us about your goals",
      destination: "Desired Country",
      destinationPlaceholder: "Select a country",
      fieldOfStudy: "Field of Study",
      budget: "Budget Range",
      budgetPlaceholder: "Select range",
      language: "Language Level",
      languagePlaceholder: "Select level",
    },
    agent: {
      title: "Tell us about your agency",
      agencyName: "Agency Name",
      monthlyVolume: "Monthly Student Volume",
      volumePlaceholder: "Select volume",
      targetDestinations: "Target Destinations",
      existingPartnerships: "Existing Partnerships (optional)",
    },
  },
  student: {
    destinationOptions: [
      { label: "Germany", value: "germany" },
      { label: "United Kingdom", value: "uk" },
      { label: "United States", value: "usa" },
      { label: "Canada", value: "canada" },
      { label: "Australia", value: "australia" },
      { label: "Other", value: "other" },
    ],
    budgetOptions: [
      { label: "Under \u20ac5,000", value: "under_5k" },
      { label: "\u20ac5,000 \u2013 \u20ac15,000", value: "5k_15k" },
      { label: "\u20ac15,000 \u2013 \u20ac30,000", value: "15k_30k" },
      { label: "Over \u20ac30,000", value: "over_30k" },
    ],
    languageLevelOptions: [
      { label: "Beginner (A1\u2013A2)", value: "beginner" },
      { label: "Intermediate (B1\u2013B2)", value: "intermediate" },
      { label: "Advanced (C1\u2013C2)", value: "advanced" },
      { label: "Native Speaker", value: "native" },
    ],
  },
  agent: {
    volumeOptions: [
      { label: "1\u201310 students", value: "1_10" },
      { label: "11\u201350 students", value: "11_50" },
      { label: "51\u2013100 students", value: "51_100" },
      { label: "100+ students", value: "100_plus" },
    ],
  },
  step4: {
    title: "When are you looking to start?",
    timeline: "Timeline",
    readiness: "Current Status",
  },
  qualify: {
    timelineOptions: [
      { label: "This month", value: "this_month" },
      { label: "Next 3 months", value: "next_3_months" },
      { label: "Next 6 months", value: "next_6_months" },
      { label: "Next year", value: "next_year" },
    ],
    readinessOptions: [
      { label: "Just exploring", value: "exploring" },
      { label: "Ready to apply", value: "ready" },
      { label: "Urgent", value: "urgent" },
    ],
  },
  step5: {
    title: "You're all set!",
    subtitle: "Review your details and submit, or continue the conversation on WhatsApp.",
    submit: "Submit Application",
    or: "or",
    whatsapp: "Continue on WhatsApp",
    whatsappMessage: "Hi, I'm {name} and I'd like to learn more about your programs.",
  },
  nav: {
    back: "Back",
    next: "Continue",
  },
  success: {
    title: "Application Received!",
    description: "Our team will review your details and get back to you within 24 hours.",
    reset: "Submit Another",
  },
  error: {
    submit: "Something went wrong. Please try again.",
    turnstile: "Please complete the security verification.",
    turnstileNotConfigured: "Turnstile is not configured. Please set",
    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
  },
  exitIntent: {
    title: "Wait — don't lose your progress!",
    description: "Continue your application on WhatsApp instead.",
    whatsapp: "Continue on WhatsApp",
    dismiss: "I'll finish here",
  },
  optional: "(optional)",
  requiredLegend: "Required fields",
  motivation: {
    step3: "You're halfway there!",
    step4: "Almost done — one more step!",
    step5: "Final step — let's make it official!",
  },
} as const;

export const funnelCta = {
  scrollBanner: {
    title: "Ready to start your journey?",
    subtitle: "Take the first step — explore programs or talk to an advisor.",
    cta: "Start Your Assessment",
    dismiss: "Maybe later",
  },
  sticky: {
    apply: "Start Your Assessment",
    dismiss: "Close",
  },
} as const;

export const agencyComparison = {
  ariaLabel: "Agency comparison section",
  badge: "Why Choose Us",
  title: "Why Agencies Choose URM ENROLL",
  subtitle: "See how we compare to the industry's largest platforms — and why agencies are switching.",
  table: {
    feature: "Feature",
    urm: "URM ENROLL",
    competitor1: "ApplyBoard",
    competitor2: "Edvoy",
  },
  features: [
    { feature: "Dedicated Account Manager", urm: true, competitor1: false, competitor2: false },
    { feature: "MENA & Africa Specialization", urm: true, competitor1: false, competitor2: true },
    { feature: "German Market Expertise", urm: true, competitor1: false, competitor2: false },
    { feature: "Nursing Program Pathway", urm: true, competitor1: false, competitor2: false },
    { feature: "Commission Transparency", urm: true, competitor1: "Partial", competitor2: "Partial" },
    { feature: "Real-Time Application Tracking", urm: true, competitor1: true, competitor2: true },
    { feature: "Free Language Prep Support", urm: true, competitor1: false, competitor2: false },
    { feature: "White-Label Agent Portal", urm: true, competitor1: false, competitor2: false },
  ],
  highlights: [
    { icon: "shield", title: "ICEF Certified", description: "Globally recognized quality assurance for education agents." },
    { icon: "zap", title: "48h Response Time", description: "Fastest partner onboarding in the industry." },
    { icon: "users", title: "1:1 Partner Support", description: "Dedicated team assigned to every agency partner." },
    { icon: "globe", title: "30+ Destinations", description: "Wider coverage than any single-region platform." },
  ],
} as const;

export const icef = {
  accredited: "ICEF Accredited Agency",
  member: "IAS Member #6507",
  tooltip: "ICEF IAS accreditation is a globally recognised quality standard for international student recruitment agencies",
  contactStatement: "As an ICEF IAS-accredited agency, we meet the highest international standards for student recruitment and counselling.",
} as const;

export const trust = {
  title: "Trusted by International Standards",
  subtitle: "We maintain the highest standards in international student recruitment and counseling.",
  trustedWorldwide: "Trusted Worldwide",
  icef: {
    goldStandard: "Gold Standard",
    title: "ICEF IAS Accredited",
    description: "Globally recognized quality standard for international student recruitment agencies — a mark of credibility trusted by universities and students across 120+ countries.",
    memberBadge: "IAS Member #6507",
    viewCertificate: "View certificate",
  },
  gdpr: {
    title: "GDPR Compliant",
    description: "Your data is protected under the highest European privacy standards with end-to-end encryption.",
    badge: "Certified Protection",
  },
  global: {
    title: "Global Network",
    description: "Operating in 12+ countries with local expertise, multilingual support, and regional insights.",
    badge: "Worldwide Presence",
  },
  uk: {
    title: "UK-Incorporated Entity",
    description: "URM ENROLL LTD is a registered UK company operating under strict financial and regulatory oversight.",
    badge: "Companies House Registered",
  },
} as const;

export const social = {
  badge: "Join Our Community",
  heading: "Follow",
  headingHighlight: "Our Story",
  description: "Thousands of students share their global education journeys with us every day. Join the conversation on your favourite platform.",
  stats: {
    followers: "Active Followers",
    posts: "Posts & Reels",
    stories: "Student Stories",
  },
  instagram: {
    description: "Student journeys, campus life & success stories from around the world.",
    stat: "Daily Stories",
  },
  tiktok: {
    description: "Short videos on studying abroad, visa tips, and student life.",
    stat: "Reels & Tips",
  },
  facebook: {
    description: "Community groups, webinars, and announcements for our students.",
    stat: "Community Groups",
  },
  linkedin: {
    description: "Professional insights, partnerships, and career opportunities.",
    stat: "Professional Network",
  },
} as const;

export const booking = {
  cta: "Book Free Consultation",
  ariaLabel: "Book a free consultation with URM Enroll",
  heading: "Book a Free Consultation",
  subheading: "Choose a time that works for you. Our advisors speak Arabic, English, and German.",
  orDivider: "Or send us a message",
  loadingText: "Loading booking calendar...",
} as const;
