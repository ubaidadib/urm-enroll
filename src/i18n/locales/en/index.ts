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

export const en = {
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
    pageTitle: "Germany Nursing Assessment | URM Enroll",
    description: "Comprehensive assessment of your knowledge of nursing program requirements in Germany",
    heading: "Germany Nursing Programme Assessment",
    subheading: "Test your knowledge before applying — 20 questions",
    progress: {
      question: "Question",
      percent: "% complete"
    },
    badges: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      mc: "Multiple Choice",
      tf: "True / False",
      scenario: "Scenario"
    },
    options: {
      a: "A",
      b: "B", 
      c: "C",
      d: "D"
    },
    nav: {
      previous: "Previous",
      next: "Next",
      finish: "View Results",
      score: "Score:"
    },
    feedback: {
      correct: "Correct — ",
      wrong: "Incorrect — "
    },
    results: {
      title: "Results",
      verdictExcellent: "Excellent — you are ready to apply",
      verdictGood: "Good — review some topics before applying",
      verdictNeedsWork: "More preparation needed before applying",
      verdictDescription: "Based on your answers, here is your overall assessment for the program.",
      easyLabel: "Easy questions",
      mediumLabel: "Medium questions",
      hardLabel: "Hard questions",
      retake: "Retake Assessment",
      contact: "Contact the Nursing Team"
    }
  },
  universities: {
    listing: {
      hero: {
        badge: "University Explorer",
        title: "Explore Universities",
        subtitle: "Discover top-ranked universities across Europe. Filter by location, type, and specialization to find your best academic match.",
        searchPlaceholder: "Search universities by name, city, or country...",
        primaryCta: "Find a University",
        secondaryCta: "Browse Programs",
        stats: {
          universities: "Universities",
          countries: "Countries",
          cities: "Cities",
        },
      },
      filters: {
        title: "Filters",
        country: "Country",
        type: "Type",
        apply: "Apply Filters",
        clearAll: "Clear All",
      },
      sort: {
        bestRanking: "Sort: Best Ranking",
        name: "Sort: Name (A-Z)",
        mostPrograms: "Sort: Most Programs",
      },
      search: {
        results: "Results",
        trending: "Trending",
        recent: "Recent",
        noResults: "No matching results",
      },
      results: {
        showing: "Showing",
        of: "of",
        items: "universities",
      },
      empty: {
        title: "No universities found",
        description: "Try adjusting your search or filters to explore more institutions.",
        clearFilters: "Clear Filters",
      },
    },
    detail: {
      breadcrumbHome: "Home",
      breadcrumbUniversities: "Universities",
      applyNow: "Apply Now",
      saveUniversity: "Save University",
      quickStats: {
        founded: "Founded Year",
        totalPrograms: "Total Programs",
        languages: "Languages",
        type: "University Type",
        ranking: "Ranking",
      },
      tabs: {
        overview: "Overview",
        programs: "Programs",
        campus: "Campus",
        requirements: "Requirements",
        location: "Location",
      },
      sections: {
        overviewTitle: "About University",
        programsTitle: "Programs at {name}",
        requirementsTitle: "Requirements",
        locationTitle: "Location",
        relatedTitle: "Similar Universities You May Like",
      },
    },
  },
  programs: {
    listing: {
      hero: {
        badge: "Program Discovery",
        title: "Discover Programs",
        subtitle: "Explore thousands of academic programs across Europe. Filter by degree level, field, language, and tuition to find the right fit.",
        searchPlaceholder: "Search programs, universities, fields...",
        primaryCta: "Explore Programs",
        secondaryCta: "Browse Universities",
        stats: {
          programs: "Programs",
          universities: "Universities",
          fields: "Fields",
        },
      },
      filters: {
        title: "Filters",
        degree: "Degree",
        field: "Field",
        language: "Language",
        duration: "Duration",
        tuition: "Tuition",
        apply: "Apply Filters",
        clearAll: "Clear All",
      },
      sort: {
        relevance: "Sort: Relevance",
        lowestTuition: "Sort: Lowest Tuition",
        shortestDuration: "Sort: Shortest Duration",
        name: "Sort: Name",
      },
      search: {
        results: "Results",
        trending: "Trending",
        recent: "Recent",
        noResults: "No matching results",
      },
      results: {
        showing: "Showing",
        of: "of",
        items: "programs",
      },
      empty: {
        title: "No programs found",
        description: "Try adjusting your filters or search terms to discover more opportunities.",
        clearFilters: "Clear Filters",
      },
    },
    detail: {
      breadcrumbHome: "Home",
      breadcrumbPrograms: "Programs",
      applyNow: "Apply Now",
      saveProgram: "Save Program",
      viewProgram: "View Program",
      keyInfo: {
        tuition: "Tuition Per Year",
        duration: "Program Duration",
        language: "Language",
        deadline: "Application Deadline",
      },
      tabs: {
        overview: "Overview",
        curriculum: "Curriculum",
        requirements: "Requirements",
        careerOutcomes: "Career Outcomes",
        apply: "Apply",
      },
      sections: {
        whyProgram: "Why This Program?",
        relatedTitle: "You Might Also Like",
        outcomesSalary: "Average Starting Salary",
      },
    },
  },
  comparison: {
    hero: {
      badge: "Program Comparison",
    },
    title: "Compare Programs",
    subtitle: "Review key differences and choose your best fit.",
    compareNow: "Compare Now",
    clearAll: "Clear All",
    emptyTitle: "No programs selected",
    emptyDescription: "Add programs from listing cards to compare them here.",
    browsePrograms: "Browse Programs",
    maxItemsToast: "Maximum 3 programs for comparison",
    table: {
      criteria: "Criteria",
      programName: "Program Name",
      university: "University",
      degreeLevel: "Degree Level",
      duration: "Duration",
      language: "Language",
      tuitionPerYear: "Tuition/Year",
      field: "Field",
      requirements: "Requirements",
      deadline: "Deadline",
      rating: "Rating",
      actions: "Actions",
      remove: "Remove from Comparison",
      apply: "Apply",
      seeDetails: "See details",
      defaultDeadline: "June 30",
    },
    partialState: {
      title: "Add another program to compare",
      description: "Select one more program from the listings to unlock full comparison.",
    },
  },
  favorites: {
    hero: {
      badge: "Saved Shortlist",
    },
    title: "Saved",
    subtitle: "Access your bookmarked universities and programs.",
    savedUniversities: "Saved Universities",
    savedPrograms: "Saved Programs",
    saveToFavorites: "Save to Favorites",
    removeFromFavorites: "Remove from Favorites",
    removeAll: "Remove All",
    emptyUniversitiesTitle: "No saved universities yet",
    emptyUniversitiesDescription: "Start exploring top universities and save the ones that match your goals.",
    emptyProgramsTitle: "No saved programs yet",
    emptyProgramsDescription: "Save interesting programs to compare and apply later.",
  },
  apply: {
    form: {
      title: "Start Your Application",
      saveDraft: "Save Draft",
      submit: "Submit Application",
      successTitle: "Application Submitted!",
      successMessage: "Thank you for your application. We've sent a confirmation email to your address.",
      steps: {
        personalInfo: "Personal Info",
        academicBackground: "Academic Background",
        uploadDocuments: "Upload Documents",
        reviewSubmit: "Review & Submit",
      },
      fields: {
        fullName: "Full Name",
        email: "Email",
        nationality: "Nationality",
        phone: "Phone",
        lastDegree: "Last Degree",
        gpa: "GPA",
        graduationYear: "Graduation Year",
      },
    },
  },
  home: {
    instagram: {
      title: "Real Stories from Our Students",
      subtitle: "Follow our community @urmEnroll",
      viewPost: "View on Instagram",
      followUs: "Follow our community",
      loading: "Loading the latest stories from our student community.",
      error: "Instagram stories are temporarily unavailable."
    }
  },
  search: {
    placeholder: {
      programs: "Search programs",
      universities: "Search universities",
      destinations: "Search destinations",
      global: "Search programs and universities"
    },
    button: {
      label: "Search"
    },
    clear: "Clear search",
    noResults: "No results found",
    resultsCount: "{{count}} results"
  },
  card: {
    program: {
      viewProgram: "View Program",
      saveProgram: "Save",
      compare: "Compare",
      tuitionFrom: "From",
      perYear: "/year"
    },
    university: {
      viewUniversity: "View University",
      saveUniversity: "Save",
      programs: "{{count}} programs",
      ranking: "Ranking"
    }
  },
  discovery: {
    bridge: {
      destinations: {
        eyebrow: "Next step",
        title: "Turn destination research into real options",
        description: "Carry your current country search into universities or jump straight into matching programs.",
        primary: "Browse universities",
        secondary: "See programs"
      },
      universities: {
        eyebrow: "Next step",
        title: "Move from institutions to matched programs",
        description: "Keep your current market context and continue into degree options without starting over.",
        primary: "Browse programs",
        secondary: "Back to destinations"
      },
      programs: {
        eyebrow: "Need more context?",
        title: "Cross-check programs against their universities",
        description: "Jump back to institutions in the same market or compare your shortlist side by side.",
        primary: "Browse universities",
        secondary: "Open compare"
      }
    }
  },
  findProgram,
} as const;
