/* ------------------------------------------------------------------ */
/*  Smart Recommendations — rule-based scoring for countries,          */
/*  programs, and service suggestions                                  */
/* ------------------------------------------------------------------ */

import type { UserProfile, UserSegment } from "./user-profile";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Recommendation {
  id: string;
  score: number;
}

export interface RecommendationSet {
  countries: Recommendation[];
  services: Recommendation[];
}

/* ------------------------------------------------------------------ */
/*  Country base data (matches destinations-compact.tsx)               */
/* ------------------------------------------------------------------ */

const COUNTRY_BASE_SCORES: Record<string, number> = {
  Germany: 92,
  "United Kingdom": 84,
  Canada: 80,
  "United States": 76,
  Australia: 78,
  Ireland: 74,
};

const NURSING_DESTINATIONS = new Set(["Germany", "United Kingdom", "Canada", "Ireland"]);
const LANGUAGE_COUNTRY_MAP: Record<string, string> = {
  de: "Germany",
  en: "United Kingdom",
  ar: "Germany", // Primary market for Arabic-speaking students
};

/* ------------------------------------------------------------------ */
/*  Country recommendations                                            */
/* ------------------------------------------------------------------ */

function scoreCountries(profile: UserProfile, language: string): Recommendation[] {
  const scores: Record<string, number> = {};

  for (const [country, base] of Object.entries(COUNTRY_BASE_SCORES)) {
    let score = base;

    // Boost countries the user explored (+30)
    if (profile.countriesExplored.includes(country)) {
      score += 30;
    }

    // Boost based on language affinity (+20)
    if (LANGUAGE_COUNTRY_MAP[language] === country) {
      score += 20;
    }

    // Boost nursing destinations for nursing segment (+25)
    if (profile.segment === "nursing" && NURSING_DESTINATIONS.has(country)) {
      score += 25;
    }

    // Boost preferred country (+15)
    if (profile.preferredCountry === country) {
      score += 15;
    }

    scores[country] = score;
  }

  return Object.entries(scores)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);
}

/* ------------------------------------------------------------------ */
/*  Service recommendations                                            */
/* ------------------------------------------------------------------ */

type ServiceId =
  | "pathway-assessment"
  | "continue-assessment"
  | "explore-services"
  | "contact-advisor"
  | "partnership-inquiry"
  | "nursing-pathway"
  | "visa-support";

interface ServiceRec extends Recommendation {
  id: ServiceId;
  /** i18n key for the recommendation label */
  labelKey: string;
  /** Route to navigate to */
  route: string;
}

const SERVICE_RULES: Record<UserSegment, ServiceRec[]> = {
  student: [
    { id: "pathway-assessment", score: 90, labelKey: "hero.personalized.studentCta", route: "/quiz" },
    { id: "explore-services", score: 70, labelKey: "hero.ctaSecondary", route: "/services" },
    { id: "visa-support", score: 60, labelKey: "hero.personalized.studentDescription", route: "/services" },
  ],
  agent: [
    { id: "partnership-inquiry", score: 90, labelKey: "hero.personalized.agentCta", route: "/partnerships" },
    { id: "contact-advisor", score: 70, labelKey: "hero.personalized.agentDescription", route: "/contact" },
  ],
  nursing: [
    { id: "nursing-pathway", score: 90, labelKey: "hero.personalized.nursingCta", route: "/nursing" },
    { id: "pathway-assessment", score: 75, labelKey: "hero.personalized.studentCta", route: "/quiz" },
  ],
  unknown: [
    { id: "pathway-assessment", score: 80, labelKey: "hero.ctaPrimary", route: "/quiz" },
    { id: "explore-services", score: 70, labelKey: "hero.ctaSecondary", route: "/services" },
  ],
};

function getServiceRecommendations(profile: UserProfile): ServiceRec[] {
  const base = SERVICE_RULES[profile.segment] ?? SERVICE_RULES.unknown;
  const recs = [...base];

  // Returning user who started but didn't finish form
  if (profile.visitCount > 1 && profile.formProgress > 0 && profile.formProgress < 4) {
    recs.unshift({
      id: "continue-assessment",
      score: 95,
      labelKey: "hero.personalized.returningCta",
      route: "/quiz",
    });
  }

  return recs.sort((a, b) => b.score - a.score);
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function getRecommendations(
  profile: UserProfile,
  language: string,
): RecommendationSet & { services: ServiceRec[] } {
  return {
    countries: scoreCountries(profile, language),
    services: getServiceRecommendations(profile),
  };
}

/**
 * Return the sorted country order for personalized destination display.
 * Falls back to default order when no personalization signals exist.
 */
export function getPersonalizedCountryOrder(
  profile: UserProfile,
  language: string,
  countryCodes: string[],
): string[] {
  const scored = scoreCountries(profile, language);
  const scoreMap = new Map(scored.map((r) => [r.id, r.score]));

  return [...countryCodes].sort((a, b) => {
    const sa = scoreMap.get(a) ?? 0;
    const sb = scoreMap.get(b) ?? 0;
    return sb - sa;
  });
}
