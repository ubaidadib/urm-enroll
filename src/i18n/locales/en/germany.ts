/* ------------------------------------------------------------------ */
/*  Germany Careers / Chancenkarte namespace — English source-of-truth */
/* ------------------------------------------------------------------ */

export const germany = {
  meta: {
    division: "Germany Careers",
    tagline: "URM Enroll Germany Division",
  },
  hero: {
    badge: "Germany Careers Division",
    eyebrow: "Chancenkarte • Skilled Migration • Work Visa",
    title: "Build your career in Germany.",
    titleHighlight: "Engineered for ambition.",
    description:
      "Germany is hiring. Our dedicated Chancenkarte team turns Lebanese and international talent into legally employed residents — visa-grade documentation, recognised credentials, and white-glove placement.",
    primaryCta: "Check my eligibility",
    secondaryCta: "Speak with a Germany advisor",
    stat1Label: "Average placement",
    stat1Value: "4–9 months",
    stat2Label: "Job openings yearly",
    stat2Value: "1.9M+",
    stat3Label: "Tuition-free education",
    stat3Value: "Yes",
  },
  trustBar: {
    title: "Operating standard",
    items: [
      "BAMF-aligned process",
      "Anabin credential verification",
      "GDPR-grade data handling",
      "Bilingual EN / DE advisors",
      "Lebanese consulate familiarity",
    ],
  },
  about: {
    eyebrow: "Why Germany",
    title: "The most structured migration path in Europe.",
    description:
      "Germany formalised the Chancenkarte (Opportunity Card) in 2024 — a points-based residence permit that lets qualified professionals enter the country to look for work, without needing a prior job offer. Combined with €0 public-university tuition and one of the world's strongest job markets, it is the most credible relocation route available today.",
    bullets: [
      {
        title: "Predictable",
        body: "A federal framework with public scoring criteria — no opaque approvals.",
      },
      {
        title: "Affordable",
        body: "Tuition-free public universities, regulated cost-of-living, EU healthcare access.",
      },
      {
        title: "Family-friendly",
        body: "Spouses and minor children can join under family reunification provisions.",
      },
      {
        title: "Permanent",
        body: "Path to settlement (Niederlassungserlaubnis) and EU citizenship within years.",
      },
    ],
  },
  professions: {
    eyebrow: "In-demand professions",
    title: "Where Germany is short-staffed.",
    description:
      "These are the Engpassberufe — verified shortage occupations the German government publishes each quarter. Holding experience here dramatically increases your Chancenkarte score.",
    salaryLabel: "Avg. monthly gross",
    shortage: {
      high: "High demand",
      very_high: "Very high demand",
      critical: "Critical shortage",
    },
    items: {
      nursing: { label: "Healthcare & Nursing", body: "Hospitals, elderly care, rehabilitation centres." },
      software_engineering: { label: "Software Engineering", body: "Backend, frontend, DevOps, data engineering." },
      mechatronics: { label: "Mechatronics & Mechanical", body: "Industrial, automotive, manufacturing." },
      teaching: { label: "Education & STEM Teaching", body: "Mathematics, sciences, languages." },
      sales_business: { label: "Sales & Business", body: "B2B account managers, key account leads." },
      logistics_truck: { label: "Logistics & Driving", body: "C/CE licence, regional and EU routes." },
      construction_skilled: { label: "Skilled Construction", body: "Electricians, plumbers, HVAC, carpenters." },
      electrical_engineering: { label: "Electrical Engineering", body: "Power, automation, embedded systems." },
      hospitality_chef: { label: "Hospitality & Culinary", body: "Chefs, F&B managers, hotel operations." },
    },
  },
  cta: {
    primary: "Start the eligibility quiz",
    secondary: "Talk to a Germany advisor",
    whatsapp: "Chat on WhatsApp",
  },
  jobs: {
    breadcrumb: "Germany Jobs",
    cityList: "Berlin · Munich · Hamburg · Stuttgart · Frankfurt",
    hero: {
      badge: "Germany jobs",
      title: "Live opportunities, structured shortlists.",
      description:
        "We do not run a job board. We match qualified candidates to vetted German employers across nursing, engineering, IT and skilled trades. Your shortlist is built around your Chancenkarte readiness.",
      cta: "Check my readiness",
    },
    fitDescription:
      "Tell us your profession, language level and timeline. Our placement desk responds within two business days with three matched roles.",
  },
  relocation: {
    hero: {
      badge: "Germany relocation",
      title: "Move once. Move properly.",
      description:
        "From the visa appointment in Beirut to your first registration at the local Bürgeramt — we handle the steps families dread: housing search, Anmeldung, health insurance enrolment, tax ID, and bank account setup.",
      cta: "Plan my relocation",
    },
    services: [
      { title: "Pre-arrival", body: "Visa appointment prep, document apostille, blocked account, flights." },
      { title: "First 30 days", body: "Anmeldung, tax ID (Steuer-ID), public health insurance, SIM, bank account." },
      { title: "Housing", body: "Vetted landlord introductions, Schufa workaround, rental contract review." },
      { title: "Family", body: "Spouse work permit, school enrolment, paediatrician registration." },
    ],
  },
} as const;
