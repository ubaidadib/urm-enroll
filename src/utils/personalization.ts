/* ------------------------------------------------------------------ */
/*  Personalization Engine — rule-based segment classification         */
/*  Processes behavioral signals and updates user profile              */
/* ------------------------------------------------------------------ */

import type {
  UserProfile,
  UserSegment,
  IntentLevel,
} from "./user-profile";
import {
  loadProfile,
  saveProfile,
  recordPageVisit,
  recordCountryExplored,
  recordFormProgress,
  recordVisitBump,
  setSegment,
  setIntentLevel,
} from "./user-profile";

/* ------------------------------------------------------------------ */
/*  Signal types                                                       */
/* ------------------------------------------------------------------ */

export type Signal =
  | { type: "page_view"; page: string }
  | { type: "country_explored"; country: string }
  | { type: "form_step"; step: number }
  | { type: "user_type_selected"; userType: "student" | "agent" }
  | { type: "intent_trigger"; trigger: "time" | "engagement" | "scroll-back" }
  | { type: "session_start" };

/* ------------------------------------------------------------------ */
/*  Page → segment affinity rules                                      */
/* ------------------------------------------------------------------ */

const PAGE_SEGMENT_AFFINITY: Record<string, UserSegment> = {
  "/partnerships": "agent",
  "/nursing": "nursing",
  "/services": "student",
  "/destinations": "student",
  "/quiz": "student",
  "/contact": "student",
};

const NURSING_COUNTRIES = new Set(["Germany", "United Kingdom", "Canada", "Ireland"]);

/* ------------------------------------------------------------------ */
/*  Segment inference                                                  */
/* ------------------------------------------------------------------ */

function inferSegment(profile: UserProfile): UserSegment {
  // Explicit selection always wins
  if (profile.segment === "agent" || profile.segment === "nursing") {
    return profile.segment;
  }

  // Check page visit patterns
  const pages = profile.pagesViewed;
  const hasPartnership = pages.some((p) => p.includes("partnership"));
  const hasNursing = pages.some((p) => p.includes("nursing"));
  const hasStudentPages = pages.some((p) =>
    ["/services", "/destinations", "/quiz"].some((s) => p.includes(s)),
  );

  if (hasPartnership) return "agent";
  if (hasNursing) return "nursing";
  if (hasStudentPages || profile.formProgress > 0) return "student";

  return profile.segment;
}

/* ------------------------------------------------------------------ */
/*  Intent inference                                                   */
/* ------------------------------------------------------------------ */

function inferIntent(profile: UserProfile): IntentLevel {
  let score = 0;

  // Returning visitors show higher intent
  if (profile.visitCount >= 3) score += 2;
  else if (profile.visitCount >= 2) score += 1;

  // Form progress is strong signal
  if (profile.formProgress >= 3) score += 3;
  else if (profile.formProgress >= 1) score += 2;

  // Multiple pages explored
  if (profile.pagesViewed.length >= 4) score += 1;

  // Country exploration
  if (profile.countriesExplored.length >= 2) score += 1;

  // Already has an existing high intent — keep it
  if (profile.intentLevel === "high") score += 1;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

/* ------------------------------------------------------------------ */
/*  Signal processor                                                   */
/* ------------------------------------------------------------------ */

export function processSignal(signal: Signal): UserProfile {
  let profile = loadProfile();

  switch (signal.type) {
    case "page_view": {
      profile = recordPageVisit(profile, signal.page);
      // Infer segment from the page visited
      const affinity = PAGE_SEGMENT_AFFINITY[signal.page];
      if (affinity && profile.segment === "unknown") {
        profile = setSegment(profile, affinity);
      }
      break;
    }
    case "country_explored":
      profile = recordCountryExplored(profile, signal.country);
      // If nursing country and visited nursing page → nursing segment
      if (
        NURSING_COUNTRIES.has(signal.country) &&
        profile.pagesViewed.some((p) => p.includes("nursing"))
      ) {
        profile = setSegment(profile, "nursing");
      }
      break;
    case "form_step":
      profile = recordFormProgress(profile, signal.step);
      break;
    case "user_type_selected":
      profile = setSegment(
        profile,
        signal.userType === "agent" ? "agent" : "student",
      );
      break;
    case "intent_trigger":
      profile = setIntentLevel(profile, "high");
      break;
    case "session_start":
      profile = recordVisitBump(profile);
      break;
  }

  // Re-infer segment and intent after each signal
  profile = setSegment(profile, inferSegment(profile));
  profile = setIntentLevel(profile, inferIntent(profile));

  saveProfile(profile);
  return profile;
}

/* ------------------------------------------------------------------ */
/*  Convenience — get current profile without mutation                 */
/* ------------------------------------------------------------------ */

export function getCurrentProfile(): UserProfile {
  return loadProfile();
}
