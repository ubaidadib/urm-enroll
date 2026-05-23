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

export const de = {
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
    pageTitle: "Deutschland Pflegeassessment | URM Enroll",
    description: "Umfassende Bewertung Ihrer Kenntnisse der Anforderungen des Pflegeprogramms in Deutschland",
    heading: "Assessment: Pflegeprogramm Deutschland",
    subheading: "Testen Sie Ihr Wissen vor der Bewerbung — 20 Fragen",
    progress: {
      question: "Frage",
      percent: "% abgeschlossen"
    },
    badges: {
      easy: "Einfach",
      medium: "Mittel",
      hard: "Schwer",
      mc: "Multiple Choice",
      tf: "Richtig / Falsch",
      scenario: "Szenario"
    },
    options: {
      a: "A",
      b: "B",
      c: "C", 
      d: "D"
    },
    nav: {
      previous: "Zurück",
      next: "Weiter",
      finish: "Ergebnisse anzeigen",
      score: "Punkte:"
    },
    feedback: {
      correct: "Richtig — ",
      wrong: "Falsch — "
    },
    results: {
      title: "Ergebnisse",
      verdictExcellent: "Ausgezeichnet — Sie sind bereit zur Bewerbung",
      verdictGood: "Gut — wiederholen Sie einige Themen vor der Bewerbung",
      verdictNeedsWork: "Weitere Vorbereitung erforderlich",
      verdictDescription: "Basierend auf Ihren Antworten, hier ist Ihre Gesamtbewertung für das Programm.",
      easyLabel: "Einfache Fragen",
      mediumLabel: "Mittlere Fragen",
      hardLabel: "Schwere Fragen",
      retake: "Assessment wiederholen",
      contact: "Pflegeteam kontaktieren"
    }
  },
  universities: {
    listing: {
      hero: {
        badge: "Universitaetsfinder",
        title: "Universitaeten entdecken",
        subtitle: "Entdecken Sie Spitzenuniversitaeten in Europa. Filtern Sie nach Standort, Typ und Schwerpunkt, um Ihre beste akademische Option zu finden.",
        searchPlaceholder: "Universitaeten nach Name, Stadt oder Land suchen...",
        primaryCta: "Universitaet finden",
        secondaryCta: "Programme durchsuchen",
        stats: {
          universities: "Universitaeten",
          countries: "Laender",
          cities: "Staedte",
        },
      },
      filters: {
        title: "Filter",
        country: "Land",
        type: "Typ",
        apply: "Filter anwenden",
        clearAll: "Alle loeschen",
      },
      sort: {
        bestRanking: "Sortieren: Bestes Ranking",
        name: "Sortieren: Name (A-Z)",
        mostPrograms: "Sortieren: Meiste Programme",
      },
      search: {
        results: "Ergebnisse",
        trending: "Trend",
        recent: "Zuletzt",
        noResults: "Keine passenden Ergebnisse",
      },
      results: {
        showing: "Angezeigt",
        of: "von",
        items: "Universitaeten",
      },
      empty: {
        title: "Keine Universitaeten gefunden",
        description: "Passen Sie Suche oder Filter an, um weitere Hochschulen zu entdecken.",
        clearFilters: "Filter zuruecksetzen",
      },
    },
    detail: {
      breadcrumbHome: "Startseite",
      breadcrumbUniversities: "Universitäten",
      applyNow: "Jetzt bewerben",
      saveUniversity: "Universität speichern",
      quickStats: {
        founded: "Gründungsjahr",
        totalPrograms: "Studiengänge",
        languages: "Sprachen",
        type: "Universitätstyp",
        ranking: "Ranking",
      },
      tabs: {
        overview: "Überblick",
        programs: "Programme",
        campus: "Campus",
        requirements: "Voraussetzungen",
        location: "Standort",
      },
      sections: {
        overviewTitle: "Über die Universität",
        programsTitle: "Programme an {name}",
        requirementsTitle: "Voraussetzungen",
        locationTitle: "Standort",
        relatedTitle: "Ähnliche Universitäten für Sie",
      },
    },
  },
  programs: {
    listing: {
      hero: {
        badge: "Programmfindung",
        title: "Programme entdecken",
        subtitle: "Entdecken Sie tausende Studienprogramme in Europa. Filtern Sie nach Abschluss, Fachbereich, Sprache und Gebuehren, um die beste Option zu finden.",
        searchPlaceholder: "Programme, Universitaeten und Fachbereiche suchen...",
        primaryCta: "Programme entdecken",
        secondaryCta: "Universitaeten durchsuchen",
        stats: {
          programs: "Programme",
          universities: "Universitaeten",
          fields: "Fachbereiche",
        },
      },
      filters: {
        title: "Filter",
        degree: "Abschluss",
        field: "Fachbereich",
        language: "Sprache",
        duration: "Dauer",
        tuition: "Gebuehren",
        apply: "Filter anwenden",
        clearAll: "Alle loeschen",
      },
      sort: {
        relevance: "Sortieren: Relevanz",
        lowestTuition: "Sortieren: Niedrigste Gebuehren",
        shortestDuration: "Sortieren: Kuerzeste Dauer",
        name: "Sortieren: Name",
      },
      search: {
        results: "Ergebnisse",
        trending: "Trend",
        recent: "Zuletzt",
        noResults: "Keine passenden Ergebnisse",
      },
      results: {
        showing: "Angezeigt",
        of: "von",
        items: "Programme",
      },
      empty: {
        title: "Keine Programme gefunden",
        description: "Passen Sie Filter oder Suchbegriffe an, um weitere Optionen zu finden.",
        clearFilters: "Filter zuruecksetzen",
      },
    },
    detail: {
      breadcrumbHome: "Startseite",
      breadcrumbPrograms: "Programme",
      applyNow: "Jetzt bewerben",
      saveProgram: "Programm speichern",
      viewProgram: "Programm ansehen",
      keyInfo: {
        tuition: "Studiengebühr pro Jahr",
        duration: "Programmdauer",
        language: "Sprache",
        deadline: "Bewerbungsfrist",
      },
      tabs: {
        overview: "Überblick",
        curriculum: "Curriculum",
        requirements: "Voraussetzungen",
        careerOutcomes: "Karrierechancen",
        apply: "Bewerben",
      },
      sections: {
        whyProgram: "Warum dieses Programm?",
        relatedTitle: "Das könnte Ihnen auch gefallen",
        outcomesSalary: "Durchschnittliches Einstiegsgehalt",
      },
    },
  },
  comparison: {
    hero: {
      badge: "Programmvergleich",
    },
    title: "Programme vergleichen",
    subtitle: "Vergleichen Sie wichtige Unterschiede und wählen Sie die beste Option.",
    compareNow: "Jetzt vergleichen",
    clearAll: "Alle entfernen",
    emptyTitle: "Keine Programme ausgewählt",
    emptyDescription: "Fügen Sie Programme aus den Listen hinzu, um sie hier zu vergleichen.",
    browsePrograms: "Programme durchsuchen",
    maxItemsToast: "Maximal 3 Programme für den Vergleich",
    table: {
      criteria: "Kriterium",
      programName: "Programmname",
      university: "Universität",
      degreeLevel: "Abschlussniveau",
      duration: "Dauer",
      language: "Sprache",
      tuitionPerYear: "Gebühr/Jahr",
      field: "Fachbereich",
      requirements: "Voraussetzungen",
      deadline: "Frist",
      rating: "Bewertung",
      actions: "Aktionen",
      remove: "Aus Vergleich entfernen",
      apply: "Bewerben",
      seeDetails: "Details anzeigen",
      defaultDeadline: "30. Juni",
    },
    partialState: {
      title: "Fügen Sie ein weiteres Programm zum Vergleich hinzu",
      description: "Wählen Sie ein weiteres Programm aus der Liste, um den vollständigen Vergleich zu sehen.",
    },
  },
  favorites: {
    hero: {
      badge: "Gespeicherte Auswahl",
    },
    title: "Gespeichert",
    subtitle: "Zugriff auf gespeicherte Universitäten und Programme.",
    savedUniversities: "Gespeicherte Universitäten",
    savedPrograms: "Gespeicherte Programme",
    saveToFavorites: "Zu Favoriten hinzufügen",
    removeFromFavorites: "Aus Favoriten entfernen",
    removeAll: "Alle entfernen",
    emptyUniversitiesTitle: "Noch keine Universitäten gespeichert",
    emptyUniversitiesDescription: "Entdecken Sie Top-Universitäten und speichern Sie passende Optionen.",
    emptyProgramsTitle: "Noch keine Programme gespeichert",
    emptyProgramsDescription: "Speichern Sie interessante Programme zum späteren Vergleich und zur Bewerbung.",
  },
  apply: {
    form: {
      title: "Bewerbung starten",
      saveDraft: "Entwurf speichern",
      submit: "Bewerbung absenden",
      successTitle: "Bewerbung eingereicht!",
      successMessage: "Vielen Dank. Wir haben eine Bestätigungs-E-Mail gesendet.",
      steps: {
        personalInfo: "Persönliche Daten",
        academicBackground: "Akademischer Hintergrund",
        uploadDocuments: "Dokumente hochladen",
        reviewSubmit: "Prüfen & Absenden",
      },
      fields: {
        fullName: "Vollständiger Name",
        email: "E-Mail",
        nationality: "Nationalität",
        phone: "Telefon",
        lastDegree: "Letzter Abschluss",
        gpa: "Notendurchschnitt",
        graduationYear: "Abschlussjahr",
      },
    },
  },
  home: {
    instagram: {
      title: "Echte Geschichten unserer Studierenden",
      subtitle: "Folgen Sie unserer Community @urmEnroll",
      viewPost: "Auf Instagram ansehen",
      followUs: "Unserer Community folgen",
      loading: "Die neuesten Geschichten unserer Studierenden werden geladen.",
      error: "Instagram-Beiträge sind vorübergehend nicht verfügbar."
    }
  },
  search: {
    placeholder: {
      programs: "Studiengänge suchen",
      universities: "Universitäten suchen",
      destinations: "Studienorte suchen",
      global: "Studiengänge und Universitäten suchen"
    },
    button: {
      label: "Suchen"
    },
    clear: "Suche löschen",
    noResults: "Keine Ergebnisse gefunden",
    resultsCount: "{{count}} Ergebnisse"
  },
  card: {
    program: {
      viewProgram: "Studiengang ansehen",
      saveProgram: "Speichern",
      compare: "Vergleichen",
      tuitionFrom: "Ab",
      perYear: "/Jahr"
    },
    university: {
      viewUniversity: "Universität ansehen",
      saveUniversity: "Speichern",
      programs: "{{count}} Studiengänge",
      ranking: "Ranking"
    }
  },
  discovery: {
    bridge: {
      destinations: {
        eyebrow: "Nächster Schritt",
        title: "Machen Sie aus Länderrecherche konkrete Optionen",
        description: "Übernehmen Sie Ihre aktuelle Suche in die Universitäten oder springen Sie direkt zu passenden Programmen.",
        primary: "Universitäten ansehen",
        secondary: "Programme ansehen"
      },
      universities: {
        eyebrow: "Nächster Schritt",
        title: "Von Hochschulen zu passenden Programmen wechseln",
        description: "Behalten Sie Ihren aktuellen Marktkontext und gehen Sie ohne Neustart zu den passenden Studiengängen weiter.",
        primary: "Programme ansehen",
        secondary: "Zurück zu Studienorten"
      },
      programs: {
        eyebrow: "Mehr Kontext?",
        title: "Programme mit ihren Universitäten gegenprüfen",
        description: "Wechseln Sie zurück zu Hochschulen im selben Markt oder vergleichen Sie Ihre Auswahl direkt nebeneinander.",
        primary: "Universitäten ansehen",
        secondary: "Vergleich öffnen"
      }
    }
  },
  findProgram,
} as const;
