export const quiz = {
  badge: "Studentenpfad-Intelligenz",
  title: "Studenten-Match Bewertung",
  description: "Beantworten Sie 5 Fragen für Deutschlandfokussierte Pfade.",
  questions: {
    destination: "Wo mochten Sie studieren?",
    studyLevel: "Welches Studienniveau?",
    field: "Interessensgebiet?",
    budget: "Jahresbudget?",
    timeline: "Wann mochten Sie starten?",
  },
  stepLabel: "Schritt",
  progressLabel: "Fortschritt",
  continue: "Weiter",
  back: "Zuruck",
  validationRequired: "Bitte wählen Sie eine Option aus.",
  dataSecure: "Ihre Daten sind geschutzt und werden nicht ohne Zustimmung geteilt.",
  reassurance: "Sichere Verarbeitung nach GDPR-Standards.",
  reassuranceNote: "Daten werden verschlüsselt ubertragen und nur für die Beratung genutzt.",
  calculatingTitle: "Profilanalyse",
  calculatingSubtitle: "Verarbeitung von 200+ Datenpunkten...",
  resultLabel: "Match Score",
  resultBadge: "Ausgezeichnetes Match",
  resultTitle: "Bereit für Erfolg",
  resultDescription: "Basierend auf Ihrem Profil haben wir passende institutionelle Pfade identifiziert.",
  recommendations: {
    high: "Starke Deutschland-Ausrichtung. Starten Sie mit Dokumenten- und Zeitplan-Readiness.",
    medium: "Guter Fit mit kleineren Compliance-Lucken. Fokus auf Dokumente und Sprache.",
    low: "Frühe Passung. Beginnen Sie mit Eligibility-Check und Funding-Strategie.",
    nursing: "Pflegepfad erkannt. Priorisieren Sie Anerkennungs- und Sprachbenchmarks.",
  },
  consultationCta: "Kostenlose Beratung buchen",
  restart: "Neu starten",
  nursingBadge: "Pflege-Anerkennungspfad",
  nursingLanguage: "Erforderliches Sprachniveau",
  nursingTimeline: "Anerkennungszeitraum",
  recognitionScore: "Anerkennungsbereitschaft",
  visaEstimatorTitle: "Visum-Zeitfenster",
  visaEstimatorNote: "Die Schätzung basiert auf Dokumentenreife und Kapazitat.",
  probabilityDelay: "Visumwahrscheinlichkeit wird berechnet...",
  of: "von",
  nursingSpecializedTitle: "Spezialisierter Pfad erkannt",
  nursingSpecializedDescription: "Pflegeprogramme in Deutschland umfassen vollständige Unterstützung bei der Anerkennung.",
  visaProcessing: "Visumbearbeitung",
  submitting: "Wird gesendet…",
  submitError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  recognition: "Anerkennung",
  destinations: [
    {
      value: "Germany",
      label: "Deutschland",
    },
    {
      value: "Italy",
      label: "Italien",
    },
    {
      value: "Spain",
      label: "Spanien",
    },
    {
      value: "France",
      label: "Frankreich",
    },
    {
      value: "Canada",
      label: "Kanada",
    },
    {
      value: "Turkey",
      label: "Türkei",
    },
    {
      value: "Other",
      label: "Andere",
    },
  ],
  studyLevels: [
    {
      value: "Undergraduate",
      label: "Bachelor",
    },
    {
      value: "Postgraduate",
      label: "Master",
    },
    {
      value: "Doctorate",
      label: "Promotion",
    },
    {
      value: "Foundation",
      label: "Foundation/Pathway",
    },
  ],
  fields: [
    {
      value: "Business",
      label: "Wirtschaft & Management",
    },
    {
      value: "Engineering",
      label: "Ingenieurwesen",
    },
    {
      value: "Computer Science",
      label: "Informatik",
    },
    {
      value: "Nursing",
      label: "Pflege",
    },
    {
      value: "Medicine",
      label: "Medizin & Gesundheit",
    },
    {
      value: "Arts",
      label: "Geisteswissenschaften",
    },
    {
      value: "Law",
      label: "Recht",
    },
    {
      value: "Sciences",
      label: "Naturwissenschaften",
    },
    {
      value: "Other",
      label: "Andere",
    },
  ],
  budgets: [
    {
      value: "Under 20000",
      label: "Unter 20.000$",
    },
    {
      value: "20000-40000",
      label: "20.000$ - 40.000$",
    },
    {
      value: "40000-60000",
      label: "40.000$ - 60.000$",
    },
    {
      value: "Above 60000",
      label: "Uber 60.000$",
    },
    {
      value: "Scholarship",
      label: "Stipendienberatung",
    },
  ],
  timelines: [
    {
      value: "Next semester",
      label: "Nächstes Semester",
    },
    {
      value: "Within 6 months",
      label: "Innerhalb von 6 Monaten",
    },
    {
      value: "6-12 months",
      label: "6-12 Monate",
    },
    {
      value: "More than a year",
      label: "Mehr als ein Jahr",
    },
    {
      value: "Exploring",
      label: "Nur erkunden",
    },
  ],
} as const;

export const institutional = {
  badge: "Institutionelle Partnerschaften",
  title: "Deutschlandfokussierte institutionelle Mobilität",
  description: "Partnerschaften für konforme Studierendenmobilität und Gesundheitsrekrutierung nach Deutschland.",
  segment: {
    title: "Wen bedienen wir?",
    sub: "Maßgeschneiderte Lösungen für jede Art von Institution.",
    solutions: "Lösungen",
  },
  segments: [
    {
      value: "university",
      label: "Hochschulen",
      description: "Governed Intake, Zulassungsreife und Kohortenabgleich.",
      highlights: [
        "Nexus Fit Scoring",
        "Zulassungsgouvernance",
        "SLA-Reporting",
      ],
    },
    {
      value: "hospital",
      label: "Kliniken",
      description: "Pflege-Rekrutierung entlang Anerkennungsfristen.",
      highlights: [
        "Lizenz-Readiness",
        "Sprachbenchmarks",
        "Employer Onboarding",
      ],
    },
    {
      value: "agency",
      label: "Agenturen",
      description: "Partnerframeworks mit Compliance-Checkpoints und Reporting.",
      highlights: [
        "Co-branded Intake",
        "Dokumentenprüfung",
        "Pipeline-Transparenz",
      ],
    },
    {
      value: "government",
      label: "Behorden",
      description: "Regulierte Programme mit auditierbarer Governance.",
      highlights: [
        "Policy Alignment",
        "Risikominimierung",
        "Outcome Dashboards",
      ],
    },
  ],
  responseTime: "Durchschn. Antwort: 48 Stunden",
  cta: {
    student: "Studentenpfad",
    partner: "Partner mit URM",
  },
  capabilities: {
    title: "Was wir bieten",
    sub: "Umfassende Unterstützung von Compliance bis Platzierung.",
    items: [
      {
        title: "Regulierte Zulassungsgouvernance",
        description: "Institutionelle Kontrollen und Compliance-Checkpoints nach deutschen Standards.",
      },
      {
        title: "Workforce-Integration Intelligence",
        description: "Pflege- und Gesundheitswege entlang Anerkennung und Lizenzierung.",
      },
      {
        title: "Auditierbare Datenreife",
        description: "Nexus-Qualifizierung mit dokumentierter Readiness für Institutionen.",
      },
    ],
  },
  trust: {
    label: "Verifizierte Compliance",
  },
  trustMarkers: [
    "GDPR-first Datenhandling",
    "ICEF akkreditierte Lieferung",
    "Deutschland-Compliance",
  ],
  process: {
    title: "Institutioneller Onboarding-Prozess",
    sub: "Vom Erstkontakt zur aktiven Partnerschaft in vier klaren Schritten.",
    steps: [
      {
        title: "Discovery und Anforderungen",
        description: "Scope, Compliance-Bedarf und Deutschlandpfade definieren.",
      },
      {
        title: "Qualifizierung und Validierung",
        description: "Screening, Dokumentenprüfung und Readiness-Scoring.",
      },
      {
        title: "Deployment und Tracking",
        description: "Cohort-Start mit SLA-Monitoring und Checkpoints.",
      },
      {
        title: "Outcome Reporting",
        description: "Institutionelle Berichte, Risikominimierung und Optimierung.",
      },
    ],
  },
  sla: [
    {
      label: "Antwortzeit",
      value: "48 Stunden",
      note: "Bestatigung institutioneller Anfrage",
    },
    {
      label: "Onboarding",
      value: "2-4 Wochen",
      note: "Compliance- und Datenabstimmung",
    },
    {
      label: "Reporting",
      value: "Monatlich",
      note: "Governance-fahige Dashboards",
    },
  ],
  data: {
    title: "GDPR-konforme Daten-Governance",
    description: "Institutionelle Daten werden mit Zugriffskontrolle, Transportverschlusselung und auditierbaren Richtlinien verarbeitet.",
  },
  form: {
    title: "Institutionelle Anfrage",
    subtitle: "Segmentieren Sie Ihre Organisation für ein Deutschland-orientiertes Angebot.",
    close: "Schliessen",
    stepLabel: "Schritt",
    stepOne: "Schritt 1: Kontakt",
    stepTwo: "Schritt 2: Partnerschaftsumfang",
    successTitle: "Anfrage erhalten",
    next: "Weiter",
    back: "Zuruck",
    organizationType: "Organisationstyp",
    organizationName: "Organisationsname",
    contactName: "Kontaktperson",
    contactEmail: "Geschäftliche E-Mail",
    roleTitle: "Rolle oder Bereich",
    organizationNamePlaceholder: "z. B. Berlin Medical Center",
    contactNamePlaceholder: "Vollständiger Name",
    contactEmailPlaceholder: "work@email.com",
    roleTitlePlaceholder: "z. B. Leitung Personal",
    organizationSize: "Organisationsgrosse",
    geographicScope: "Geografischer Umfang",
    partnershipType: "Partnerschaftstyp",
    budgetAuthority: "Budgetverantwortung",
    candidateVolume: "Erwartetes Kandidatenvolumen",
    candidateVolumePlaceholder: "z. B. 50–200",
    complianceTimeline: "Compliance-Zeitplan",
    notes: "Strategische Notizen",
    selectPlaceholder: "Auswählen",
    submit: "Institutionelle Anfrage senden",
    validation: "Bitte alle Pflichtfelder ausfüllen.",
    success: "Vielen Dank. Unser Institutionsteam meldet sich innerhalb von 48 Stunden.",
    error: "Anfrage konnte nicht gesendet werden. Bitte erneut versuchen.",
    organizationTypes: [
      {
        value: "university",
        label: "Universitat",
      },
      {
        value: "hospital",
        label: "Krankenhaus oder Gesundheitsgruppe",
      },
      {
        value: "agency",
        label: "Bildungsagentur",
      },
      {
        value: "government",
        label: "Behorde",
      },
      {
        value: "student",
        label: "Studentenaufnahme-Partner",
      },
    ],
    organizationSizes: [
      {
        value: "1-50",
        label: "1-50 Mitarbeitende",
      },
      {
        value: "51-250",
        label: "51-250 Mitarbeitende",
      },
      {
        value: "251-1000",
        label: "251-1.000 Mitarbeitende",
      },
      {
        value: "1000+",
        label: "1.000+ Mitarbeitende",
      },
    ],
    geographicScopes: [
      {
        value: "germany",
        label: "Deutschland",
      },
      {
        value: "mena",
        label: "MENA",
      },
      {
        value: "europe",
        label: "Europa",
      },
      {
        value: "global",
        label: "Global",
      },
    ],
    partnershipTypes: [
      {
        value: "student-mobility",
        label: "Studierendenmobilität",
      },
      {
        value: "nursing-recruitment",
        label: "Pflege-Rekrutierung",
      },
      {
        value: "compliance-advisory",
        label: "Compliance-Beratung",
      },
      {
        value: "workforce-integration",
        label: "Workforce-Integration",
      },
    ],
    budgetAuthorities: [
      {
        value: "decision-maker",
        label: "Entscheider",
      },
      {
        value: "influencer",
        label: "Einflussnehmend",
      },
      {
        value: "informational",
        label: "Informationen",
      },
    ],
  },
} as const;

export const agentPortal = {
  badge: "Agenten-Portal",
  title: "Ihre Rekrutierungs-Kommandozentrale",
  description: "Ein dediziertes B2B-Portal für Sub-Agenten und Rekrutierungspartner — verfolgen Sie Platzierungen, verdienen Sie Provisionen und verwalten Sie Compliance in Echtzeit.",
  tiers: {
    title: "Provisionsstufen",
    popular: "Beliebteste",
    perPlacement: "pro Platzierung",
  },
  dashboard: {
    title: "Live-Dashboard-Vorschau",
    live: "Live-Vorschau",
    recentLabel: "Letzte Pipeline-Aktivität",
    stats: {
      activeLeads: "Aktive Leads",
      conversionRate: "Konversionsrate",
      avgPlacement: "Durchschn. Platzierung",
      complianceScore: "Compliance-Score",
    },
  },
  features: {
    title: "Portal-Funktionen",
    items: {
      realTimePipeline: {
        title: "Echtzeit-Pipeline",
        description: "Verfolgen Sie jeden Studenten von der Anfrage bis zur Einschreibung mit Live-Status-Updates.",
      },
      complianceDash: {
        title: "Compliance-Dashboard",
        description: "Automatische Dokumentenprüfung und Überwachung regulatorischer Prüfpunkte.",
      },
      commissionTracker: {
        title: "Provisions-Tracker",
        description: "Transparente Einnahmen pro Platzierung mit automatisierten monatlichen Auszahlungen.",
      },
      multiRegion: {
        title: "Multi-Region-Zugang",
        description: "Verwalten Sie Studenten in 14 Zielländern über ein einziges Dashboard.",
      },
    },
  },
  cta: "Portal-Zugang beantragen",
  ctaSub: "Durchschn. Onboarding: 48 Stunden",
} as const;
