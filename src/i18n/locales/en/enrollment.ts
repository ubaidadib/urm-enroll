export const quiz = {
  badge: "Student Pathway Intelligence",
  title: "Student Match Assessment",
  description: "Answer 5 questions to align with Germany-first institutional pathways.",
  questions: {
    destination: "Where do you want to study?",
    studyLevel: "What level of study?",
    field: "Field of interest?",
    budget: "Annual budget?",
    timeline: "When do you plan to start?",
  },
  stepLabel: "Step",
  progressLabel: "Progress",
  continue: "Continue",
  back: "Back",
  validationRequired: "Please select an option to continue.",
  dataSecure: "Your data is secure and never shared without consent.",
  reassurance: "Secure processing within GDPR-aligned systems.",
  reassuranceNote: "Data is encrypted in transit and retained only for advisory matching.",
  calculatingTitle: "Analyzing Your Profile",
  calculatingSubtitle: "Processing 200+ data points...",
  resultLabel: "Match Score",
  resultBadge: "Excellent Match Found",
  resultTitle: "You're Ready for Success",
  resultDescription: "Based on your profile, we've identified optimal institutional pathways and scholarship opportunities.",
  recommendations: {
    high: "Strong Germany pathway alignment. Proceed to document readiness and timeline planning.",
    medium: "Good fit with minor compliance gaps. Focus on documentation and language readiness.",
    low: "Early-stage alignment. Start with eligibility checks and funding strategy before intake.",
    nursing: "Nursing pathway identified. Prioritize recognition readiness and language benchmarks.",
  },
  consultationCta: "Book Free Consultation",
  restart: "Start Over",
  nursingBadge: "Nursing Recognition Pathway",
  nursingLanguage: "Estimated Language Requirement",
  nursingTimeline: "Recognition Timeline",
  recognitionScore: "Recognition Readiness Score",
  visaEstimatorTitle: "Visa Timeline Estimator",
  visaEstimatorNote: "Estimate reflects embassy capacity and document readiness.",
  probabilityDelay: "Calculating visa probability...",
  of: "of",
  nursingSpecializedTitle: "Specialized Pathway Detected",
  nursingSpecializedDescription: "Nursing programs in Germany include full licensing support.",
  visaProcessing: "Visa Processing",
  submitting: "Submitting…",
  submitError: "Something went wrong. Please try again.",
  recognition: "Recognition",
  destinations: [
    {
      value: "Germany",
      label: "Germany",
    },
    {
      value: "Italy",
      label: "Italy",
    },
    {
      value: "Spain",
      label: "Spain",
    },
    {
      value: "France",
      label: "France",
    },
    {
      value: "Canada",
      label: "Canada",
    },
    {
      value: "Turkey",
      label: "Turkey",
    },
    {
      value: "Other",
      label: "Other",
    },
  ],
  studyLevels: [
    {
      value: "Undergraduate",
      label: "Undergraduate",
    },
    {
      value: "Postgraduate",
      label: "Postgraduate (Masters)",
    },
    {
      value: "Doctorate",
      label: "Doctorate (PhD)",
    },
    {
      value: "Foundation",
      label: "Foundation/Pathway",
    },
  ],
  fields: [
    {
      value: "Business",
      label: "Business & Management",
    },
    {
      value: "Engineering",
      label: "Engineering",
    },
    {
      value: "Computer Science",
      label: "Computer Science",
    },
    {
      value: "Nursing",
      label: "Nursing",
    },
    {
      value: "Medicine",
      label: "Medicine & Health",
    },
    {
      value: "Arts",
      label: "Arts & Humanities",
    },
    {
      value: "Law",
      label: "Law",
    },
    {
      value: "Sciences",
      label: "Sciences",
    },
    {
      value: "Other",
      label: "Other",
    },
  ],
  budgets: [
    {
      value: "Under 20000",
      label: "Under $20,000",
    },
    {
      value: "20000-40000",
      label: "$20,000 - $40,000",
    },
    {
      value: "40000-60000",
      label: "$40,000 - $60,000",
    },
    {
      value: "Above 60000",
      label: "Above $60,000",
    },
    {
      value: "Scholarship",
      label: "Need scholarship guidance",
    },
  ],
  timelines: [
    {
      value: "Next semester",
      label: "Next semester",
    },
    {
      value: "Within 6 months",
      label: "Within 6 months",
    },
    {
      value: "6-12 months",
      label: "6-12 months",
    },
    {
      value: "More than a year",
      label: "More than a year",
    },
    {
      value: "Exploring",
      label: "Just exploring",
    },
  ],
} as const;

export const institutional = {
  badge: "Institutional Partnerships",
  title: "Germany-First Institutional Mobility",
  description: "Partner with URM ENROLL to deliver compliant, data-governed student mobility and healthcare recruitment into Germany.",
  segment: {
    title: "Who Do We Serve?",
    sub: "Tailored solutions for every type of institution.",
    solutions: "Solutions",
  },
  segments: [
    {
      value: "university",
      label: "Universities",
      description: "Governed intake, admission readiness, and cohort alignment.",
      highlights: [
        "Nexus Fit scoring",
        "Admission governance",
        "SLA reporting",
      ],
    },
    {
      value: "hospital",
      label: "Hospitals",
      description: "Nursing recruitment pipelines aligned to recognition timelines.",
      highlights: [
        "Licensing readiness",
        "Language benchmarks",
        "Employer onboarding",
      ],
    },
    {
      value: "agency",
      label: "Agencies",
      description: "Partner frameworks with compliance checkpoints and reporting.",
      highlights: [
        "Co-branded intake",
        "Document audits",
        "Pipeline visibility",
      ],
    },
    {
      value: "government",
      label: "Government",
      description: "Regulated programs with audit-ready governance.",
      highlights: [
        "Policy alignment",
        "Risk mitigation",
        "Outcome dashboards",
      ],
    },
  ],
  responseTime: "Avg. Response: 48 Hours",
  cta: {
    student: "Student Pathway",
    partner: "Partner With URM",
  },
  capabilities: {
    title: "What We Offer",
    sub: "End-to-end support from compliance to placement.",
    items: [
      {
        title: "Regulated admissions governance",
        description: "Institutional controls, intake qualification, and compliance checkpoints aligned to Germany standards.",
      },
      {
        title: "Workforce integration intelligence",
        description: "Germany healthcare and nursing mobility pathways mapped to recognition and licensing timelines.",
      },
      {
        title: "Data-driven cohort readiness",
        description: "Nexus qualification scoring and documentation oversight for audit-ready delivery.",
      },
    ],
  },
  trust: {
    label: "Verified Compliance",
  },
  trustMarkers: [
    "GDPR-first data handling",
    "ICEF accredited delivery",
    "Germany compliance alignment",
  ],
  process: {
    title: "Institutional onboarding process",
    sub: "From first contact to active partnership in four clear steps.",
    steps: [
      {
        title: "Discovery and requirements",
        description: "Define intake scope, compliance needs, and Germany pathway targets.",
      },
      {
        title: "Qualification and validation",
        description: "Nexus-driven screening, documentation audits, and readiness scoring.",
      },
      {
        title: "Deployment and tracking",
        description: "Cohort activation with SLA monitoring and regulatory checkpoints.",
      },
      {
        title: "Outcome reporting",
        description: "Institutional reporting, risk mitigation, and continuous optimization.",
      },
    ],
  },
  sla: [
    {
      label: "Response time",
      value: "48 hours",
      note: "Institutional inquiry acknowledgment",
    },
    {
      label: "Onboarding",
      value: "2-4 weeks",
      note: "Compliance and data alignment",
    },
    {
      label: "Reporting",
      value: "Monthly",
      note: "Governance-ready dashboards",
    },
  ],
  data: {
    title: "GDPR-aligned data governance",
    description: "We process institutional intake data with strict access control, encryption in transit, and audit-ready retention policies.",
  },
  form: {
    title: "Institutional partnership inquiry",
    subtitle: "Segment your organization to receive a tailored Germany-first proposal.",
    close: "Close",
    stepLabel: "Step",
    stepOne: "Step 1: Contact",
    stepTwo: "Step 2: Partnership scope",
    successTitle: "Inquiry received",
    next: "Continue",
    back: "Back",
    organizationType: "Organization type",
    organizationName: "Organization name",
    contactName: "Contact name",
    contactEmail: "Work email",
    roleTitle: "Role or department",
    organizationNamePlaceholder: "e.g. Berlin Medical Center",
    contactNamePlaceholder: "Full Name",
    contactEmailPlaceholder: "work@email.com",
    roleTitlePlaceholder: "e.g. Head of HR",
    organizationSize: "Organization size",
    geographicScope: "Geographic scope",
    partnershipType: "Partnership type",
    budgetAuthority: "Budget authority",
    candidateVolume: "Projected candidate volume",
    candidateVolumePlaceholder: "e.g. 50–200",
    complianceTimeline: "Compliance timeline",
    notes: "Strategic notes",
    selectPlaceholder: "Select",
    submit: "Submit institutional inquiry",
    validation: "Please complete all required fields.",
    success: "Thank you. Our institutional team will respond within 48 hours.",
    error: "We could not submit the inquiry. Please try again.",
    organizationTypes: [
      {
        value: "university",
        label: "University",
      },
      {
        value: "hospital",
        label: "Hospital or healthcare group",
      },
      {
        value: "agency",
        label: "Education agency",
      },
      {
        value: "government",
        label: "Government body",
      },
      {
        value: "student",
        label: "Student intake partner",
      },
    ],
    organizationSizes: [
      {
        value: "1-50",
        label: "1-50 staff",
      },
      {
        value: "51-250",
        label: "51-250 staff",
      },
      {
        value: "251-1000",
        label: "251-1,000 staff",
      },
      {
        value: "1000+",
        label: "1,000+ staff",
      },
    ],
    geographicScopes: [
      {
        value: "germany",
        label: "Germany",
      },
      {
        value: "mena",
        label: "MENA",
      },
      {
        value: "europe",
        label: "Europe",
      },
      {
        value: "global",
        label: "Global",
      },
    ],
    partnershipTypes: [
      {
        value: "student-mobility",
        label: "Student mobility intake",
      },
      {
        value: "nursing-recruitment",
        label: "Nursing recruitment",
      },
      {
        value: "compliance-advisory",
        label: "Compliance advisory",
      },
      {
        value: "workforce-integration",
        label: "Workforce integration",
      },
    ],
    budgetAuthorities: [
      {
        value: "decision-maker",
        label: "Decision maker",
      },
      {
        value: "influencer",
        label: "Influencer",
      },
      {
        value: "informational",
        label: "Information gathering",
      },
    ],
  },
} as const;

export const agentPortal = {
  badge: "Agent Portal",
  title: "Your Recruitment Command Center",
  description: "A dedicated B2B portal for sub-agents and recruitment partners — track placements, earn commissions, and manage compliance in real time.",
  tiers: {
    title: "Commission Tiers",
    popular: "Most Popular",
    perPlacement: "per placement",
  },
  dashboard: {
    title: "Live Dashboard Preview",
    live: "Live Preview",
    recentLabel: "Recent Pipeline Activity",
    stats: {
      activeLeads: "Active Leads",
      conversionRate: "Conversion Rate",
      avgPlacement: "Avg. Placement",
      complianceScore: "Compliance Score",
    },
  },
  features: {
    title: "Portal Capabilities",
    items: {
      realTimePipeline: {
        title: "Real-Time Pipeline",
        description: "Track every student from enquiry to enrollment with live status updates.",
      },
      complianceDash: {
        title: "Compliance Dashboard",
        description: "Automated document verification and regulatory checkpoint monitoring.",
      },
      commissionTracker: {
        title: "Commission Tracker",
        description: "Transparent earnings per placement with automated monthly payouts.",
      },
      multiRegion: {
        title: "Multi-Region Access",
        description: "Manage students across 14 destination countries from a single dashboard.",
      },
    },
  },
  cta: "Apply for Portal Access",
  ctaSub: "Avg. onboarding: 48 hours",
} as const;
