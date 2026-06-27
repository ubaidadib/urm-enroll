export const languageLabel = "German" as const;

export const languageNative = "Deutsch" as const;

export const preloader = {
  title: "URM ENROLL",
  subtitle: "URM Nexus",
  loading: "Wir gestalten Ihre Zukunft...",
} as const;

export const cookieBanner = {
  title: "Cookie-Einstellungen",
  description: "Wir verwenden Cookies, um Ihre Einstellungen zu speichern und die Website zu verbessern. Sie können nicht essenzielle Cookies akzeptieren oder ablehnen.",
  learnMore: "Cookie-Richtlinie vollständig lesen",
  accept: "Alle akzeptieren",
  reject: "Alle ablehnen",
  savePreferences: "Einstellungen speichern",
  analytics: "Analyse (Website-Verbesserung)",
  marketing: "Marketing (personalisierte Werbung)",
} as const;

export const common = {
  home: "Startseite",
  breadcrumb: "Brotkrumenpfad",
  skipToContent: "Zum Hauptinhalt springen",
  all: "Alle",
  any: "Beliebig",
  global: "Weltweit",
  viewAll: "Alle ansehen",
  continue: "Weiter",
  retry: "Erneut versuchen",
  prev: "Zurück",
  next: "Weiter",
  explore: "Entdecken",
  close: "Schließen",
  matched: "gefunden",
  page: "Seite",
  approx: "Ca.",
  tuition: "Studiengebühr",
  aria: {
    previousPage: "Vorherige Seite",
    nextPage: "Nächste Seite",
    previous: "Zurück",
    next: "Weiter",
    scrollLeft: "Nach links scrollen",
    scrollRight: "Nach rechts scrollen",
    closeFilters: "Filter schließen",
    sortUniversities: "Universitäten sortieren",
    openFilters: "Filter öffnen",
    removeFieldFilter: "Fachfilter entfernen",
    removeTypeFilter: "Programmtyp-Filter entfernen",
    removeOrganizationFilter: "Organisationsfilter entfernen",
    closeNotice: "Hinweis schließen",
    shareUniversity: "Universität teilen",
    voiceSearch: "Sprachsuche",
    aiProgramSearch: "KI-gestützte Programmsuche",
    pageNumber: "Seite {{page}}",
  },
  theme: {
    label: "Darstellung",
    system: "System",
    light: "Hell",
    dark: "Dunkel",
    ariaSystem: "Systemdesign ({{theme}})",
    ariaDark: "Dunkelmodus",
    ariaLight: "Hellmodus",
  },
} as const;

export const globalCta = {
  student: {
    primary: {
      low: "Programme entdecken",
      medium: "Starten Sie Ihre Reise",
      high: "Jetzt bewerben",
      highVariantB: "Sichern Sie sich Ihren Platz",
      bannerSub: "Entdecken Sie erstklassige Programme für Ihre akademischen Ziele.",
    },
    secondary: {
      low: "Mehr erfahren",
      medium: "Beratung buchen",
      high: "Jetzt mit Berater sprechen",
      bannerSub: "Erhalten Sie persönliche Beratung von unseren Bildungsexperten.",
    },
    b2b: {
      low: "Partnerschaftsinfo",
      medium: "Partner werden",
      high: "Heute unserem Netzwerk beitreten",
      bannerSub: "Institutionelle Partnerschaften freischalten und Ihre Einschreibungspipeline erweitern.",
    },
    whatsapp: "Per WhatsApp chatten",
  },
  agent: {
    primary: {
      low: "Agentenvorteile ansehen",
      medium: "Als Agent starten",
      high: "Jetzt als Agent registrieren",
      bannerSub: "Zugang zu exklusiven Provisionsstrukturen und dediziertem Support.",
    },
    secondary: {
      low: "Agentenressourcen",
      medium: "Gespräch vereinbaren",
      high: "Mit unserem Team verbinden",
      bannerSub: "Sprechen Sie direkt mit unserem Partnerschaftsteam.",
    },
    b2b: {
      low: "Partnerschaften erkunden",
      medium: "Partner werden",
      high: "Partnerschaft starten",
      bannerSub: "Treten Sie unserem globalen Netzwerk von Bildungsrekrutierungspartnern bei.",
    },
    whatsapp: "WhatsApp senden",
  },
  nursing: {
    primary: {
      low: "Pflegewege entdecken",
      medium: "Pflegekarriere starten",
      high: "Für Pflegeprogramm bewerben",
      bannerSub: "Beginnen Sie Ihre Reise zu einer lohnenden Pflegekarriere in Deutschland.",
    },
    secondary: {
      low: "Pflegeprogramm-Info",
      medium: "Pflegeberatung buchen",
      high: "Pflegeplatz sichern",
      bannerSub: "Expertenberatung zu Pflegequalifikationen und Vermittlung.",
    },
    b2b: {
      low: "Gesundheitspartnerschaften",
      medium: "Mit uns kooperieren",
      high: "Gesundheitspartnerschaft starten",
      bannerSub: "Verbinden Sie Ihre Gesundheitseinrichtung mit qualifizierten internationalen Pflegekräften.",
    },
    whatsapp: "Per WhatsApp chatten",
  },
  germany: {
    primary: {
      low: "Deutschland entdecken",
      medium: "Umzug nach Deutschland planen",
      high: "Für Deutschland-Programme bewerben",
      bannerSub: "Studiengebührenfreie Bildung und Karrieremöglichkeiten in Deutschland.",
    },
    secondary: {
      low: "Deutschland-Ratgeber",
      medium: "Deutschland-Beratung buchen",
      high: "Deutschland-Platz reservieren",
      bannerSub: "Expertenrat zu Studium, Arbeit und Leben in Deutschland.",
    },
    b2b: {
      low: "Deutsche Institutionen",
      medium: "Partner für Deutschland",
      high: "Deutschland-Partnerschaft starten",
      bannerSub: "Arbeiten Sie mit uns zusammen, um Studierende an deutschen Top-Institutionen zu platzieren.",
    },
    whatsapp: "WhatsApp senden",
  },
} as const;

export const leadForm = {
  ariaLabel: "Formular zur Kontaktaufnahme",
  badge: "Jetzt starten",
  title: "Starten Sie Ihre Reise heute",
  subtitle: "Erzählen Sie uns von sich und wir finden den richtigen Weg für Sie in unter 2 Minuten.",
  stepOf: "Schritt {current} von {total}",
  steps: ["Info", "Typ", "Details", "Zeitplan", "Senden"],
  step1: {
    title: "Lernen wir Sie kennen",
    fullName: "Vollständiger Name",
    email: "E-Mail-Adresse",
    phone: "Telefonnummer",
  },
  step2: {
    title: "Wie können wir Ihnen helfen?",
    subtitle: "Wählen Sie die Option, die Sie am besten beschreibt.",
    student: {
      title: "Ich bin Student/in",
      description: "Ich möchte im Ausland studieren oder meine Karriere international voranbringen.",
    },
    agent: {
      title: "Ich bin Rekrutierungsagent",
      description: "Ich suche eine Partnerschaft zur Rekrutierung von Studierenden für internationale Programme.",
    },
  },
  step3: {
    student: {
      title: "Erzählen Sie uns von Ihren Zielen",
      destination: "Gewünschtes Land",
      destinationPlaceholder: "Land auswählen",
      fieldOfStudy: "Studienfach",
      budget: "Budgetrahmen",
      budgetPlaceholder: "Bereich auswählen",
      language: "Sprachniveau",
      languagePlaceholder: "Niveau auswählen",
    },
    agent: {
      title: "Erzählen Sie uns von Ihrer Agentur",
      agencyName: "Agenturname",
      monthlyVolume: "Monatliches Studentenvolumen",
      volumePlaceholder: "Volumen auswählen",
      targetDestinations: "Zieldestinationen",
      existingPartnerships: "Bestehende Partnerschaften (optional)",
    },
  },
  student: {
    destinationOptions: [
      { label: "Deutschland", value: "germany" },
      { label: "Vereinigtes Königreich", value: "uk" },
      { label: "Vereinigte Staaten", value: "usa" },
      { label: "Kanada", value: "canada" },
      { label: "Australien", value: "australia" },
      { label: "Andere", value: "other" },
    ],
    budgetOptions: [
      { label: "Unter €5.000", value: "under_5k" },
      { label: "€5.000 – €15.000", value: "5k_15k" },
      { label: "€15.000 – €30.000", value: "15k_30k" },
      { label: "Über €30.000", value: "over_30k" },
    ],
    languageLevelOptions: [
      { label: "Anfänger (A1\u2013A2)", value: "beginner" },
      { label: "Mittelstufe (B1\u2013B2)", value: "intermediate" },
      { label: "Fortgeschritten (C1\u2013C2)", value: "advanced" },
      { label: "Muttersprachler", value: "native" },
    ],
  },
  agent: {
    volumeOptions: [
      { label: "1\u201310 Studierende", value: "1_10" },
      { label: "11\u201350 Studierende", value: "11_50" },
      { label: "51\u2013100 Studierende", value: "51_100" },
      { label: "100+ Studierende", value: "100_plus" },
    ],
  },
  step4: {
    title: "Wann möchten Sie beginnen?",
    timeline: "Zeitrahmen",
    readiness: "Aktueller Status",
  },
  qualify: {
    timelineOptions: [
      { label: "Diesen Monat", value: "this_month" },
      { label: "In 3 Monaten", value: "next_3_months" },
      { label: "In 6 Monaten", value: "next_6_months" },
      { label: "Nächstes Jahr", value: "next_year" },
    ],
    readinessOptions: [
      { label: "Nur erkunden", value: "exploring" },
      { label: "Bereit zu bewerben", value: "ready" },
      { label: "Dringend", value: "urgent" },
    ],
  },
  step5: {
    title: "Alles bereit!",
    subtitle: "Überprüfen Sie Ihre Daten und senden Sie ab, oder setzen Sie das Gespräch auf WhatsApp fort.",
    submit: "Bewerbung absenden",
    or: "oder",
    whatsapp: "Auf WhatsApp fortfahren",
    whatsappMessage: "Hallo, ich bin {name} und möchte mehr über Ihre Programme erfahren.",
  },
  nav: {
    back: "Zurück",
    next: "Weiter",
  },
  success: {
    title: "Bewerbung eingegangen!",
    description: "Unser Team wird Ihre Daten prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.",
    reset: "Weitere Bewerbung senden",
  },
  error: {
    submit: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    turnstile: "Bitte schließen Sie die Sicherheitsüberprüfung ab.",
    turnstileNotConfigured: "Turnstile ist nicht konfiguriert. Bitte setzen Sie",
    required: "Dieses Feld ist erforderlich.",
    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  },
  exitIntent: {
    title: "Warten Sie — verlieren Sie nicht Ihren Fortschritt!",
    description: "Setzen Sie Ihre Bewerbung stattdessen über WhatsApp fort.",
    whatsapp: "Über WhatsApp fortfahren",
    dismiss: "Ich mache hier weiter",
  },
  optional: "(optional)",
  requiredLegend: "Pflichtfelder",
  motivation: {
    step3: "Sie sind auf halbem Weg!",
    step4: "Fast geschafft — noch ein Schritt!",
    step5: "Letzter Schritt — machen wir es offiziell!",
  },
} as const;

export const funnelCta = {
  scrollBanner: {
    title: "Bereit, Ihre Reise zu beginnen?",
    subtitle: "Machen Sie den ersten Schritt — erkunden Sie Programme oder sprechen Sie mit einem Berater.",
    cta: "Bewertung starten",
    dismiss: "Vielleicht später",
  },
  sticky: {
    apply: "Bewertung starten",
    dismiss: "Schließen",
  },
} as const;

export const agencyComparison = {
  ariaLabel: "Agenturvergleich Abschnitt",
  badge: "Warum uns wählen",
  title: "Warum Agenturen URM ENROLL wählen",
  subtitle: "Sehen Sie, wie wir uns mit den größten Plattformen der Branche vergleichen — und warum Agenturen wechseln.",
  table: {
    feature: "Funktion",
    urm: "URM ENROLL",
    competitor1: "ApplyBoard",
    competitor2: "Edvoy",
  },
  features: [
    { feature: "Dedizierter Account Manager", urm: true, competitor1: false, competitor2: false },
    { feature: "MENA & Afrika Spezialisierung", urm: true, competitor1: false, competitor2: true },
    { feature: "Deutsche Marktexpertise", urm: true, competitor1: false, competitor2: false },
    { feature: "Pflegeprogramm-Pathway", urm: true, competitor1: false, competitor2: false },
    { feature: "Provisionstransparenz", urm: true, competitor1: "Teilweise", competitor2: "Teilweise" },
    { feature: "Echtzeit-Bewerbungsverfolgung", urm: true, competitor1: true, competitor2: true },
    { feature: "Kostenlose Sprachvorbereitung", urm: true, competitor1: false, competitor2: false },
    { feature: "White-Label Agentenportal", urm: true, competitor1: false, competitor2: false },
  ],
  highlights: [
    { icon: "shield", title: "ICEF-zertifiziert", description: "Weltweit anerkannte Qualitätssicherung für Bildungsagenten." },
    { icon: "zap", title: "48h Reaktionszeit", description: "Schnellstes Partner-Onboarding der Branche." },
    { icon: "users", title: "1:1 Partnerunterstützung", description: "Dediziertes Team für jede Partneragentur." },
    { icon: "globe", title: "30+ Destinationen", description: "Breitere Abdeckung als jede einzelne regionale Plattform." },
  ],
} as const;

export const icef = {
  accredited: "ICEF Akkreditierte Agentur",
  member: "IAS Mitglied #6507",
  tooltip: "Die ICEF IAS-Akkreditierung ist ein weltweit anerkannter Qualitätsstandard für internationale Studierendenberatungsagenturen",
  contactStatement: "Als ICEF IAS-akkreditierte Agentur erfüllen wir die höchsten internationalen Standards für Studierendenberatung.",
} as const;

export const trust = {
  title: "Vertraut nach internationalen Standards",
  subtitle: "Wir halten die höchsten Standards in der internationalen Studierendenberatung und -betreuung ein.",
  trustedWorldwide: "Weltweit vertraut",
  icef: {
    goldStandard: "Goldstandard",
    title: "ICEF IAS akkreditiert",
    description: "Weltweit anerkannter Qualitätsstandard für internationale Studentenvermittlungsagenturen — ein Vertrauenssignal, dem Universitäten und Studenten in 120+ Ländern vertrauen.",
    memberBadge: "IAS-Mitglied #6507",
    viewCertificate: "Zertifikat ansehen",
  },
  gdpr: {
    title: "DSGVO-konform",
    description: "Ihre Daten sind nach den höchsten europäischen Datenschutzstandards mit Ende-zu-Ende-Verschlüsselung geschützt.",
    badge: "Zertifizierter Schutz",
  },
  global: {
    title: "Globales Netzwerk",
    description: "Tätig in 12+ Ländern mit lokaler Expertise, mehrsprachiger Unterstützung und regionalen Einblicken.",
    badge: "Weltweite Präsenz",
  },
  uk: {
    title: "Im Vereinigten Königreich registriertes Unternehmen",
    description: "URM ENROLL LTD ist ein registriertes britisches Unternehmen, das unter strenger Finanz- und Regulierungsaufsicht tätig ist.",
    badge: "Bei Companies House registriert",
  },
} as const;

export const social = {
  badge: "Werde Teil unserer Community",
  heading: "Folge",
  headingHighlight: "unserer Geschichte",
  description: "Tausende von Studierenden teilen täglich ihre internationalen Bildungsreisen mit uns. Beteilige dich am Gespräch auf deiner Lieblingsplattform.",
  stats: {
    followers: "Aktive Follower",
    posts: "Posts & Reels",
    stories: "Studentengeschichten",
  },
  instagram: {
    description: "Studentenreisen, Campusleben und Erfolgsgeschichten aus aller Welt.",
    stat: "Tägliche Stories",
  },
  tiktok: {
    description: "Kurzvideos über Auslandsstudium, Visatipps und Studentenleben.",
    stat: "Reels & Tipps",
  },
  facebook: {
    description: "Community-Gruppen, Webinare und Ankündigungen für unsere Studierenden.",
    stat: "Community-Gruppen",
  },
  linkedin: {
    description: "Berufliche Einblicke, Partnerschaften und Karrieremöglichkeiten.",
    stat: "Berufliches Netzwerk",
  },
} as const;

export const booking = {
  cta: "Kostenlose Beratung buchen",
  ariaLabel: "Kostenlose Beratung mit URM Enroll buchen",
  heading: "Kostenlose Beratung buchen",
  subheading: "Wählen Sie einen passenden Termin. Unsere Berater sprechen Arabisch, Englisch und Deutsch.",
  orDivider: "Oder senden Sie uns eine Nachricht",
  loadingText: "Buchungskalender wird geladen...",
} as const;
