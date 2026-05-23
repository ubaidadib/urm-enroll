/* ------------------------------------------------------------------ */
/*  User Profile — anonymous behavioral profile persisted in           */
/*  localStorage. No PII. Respects consent revocation.                 */
/* ------------------------------------------------------------------ */

const PROFILE_KEY = "urm-user-profile";
const USER_ID_KEY = "urm-user-id";
const MAX_PAGES = 20;
const MAX_COUNTRIES = 10;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type UserSegment = "student" | "agent" | "nursing" | "unknown";
export type IntentLevel = "low" | "medium" | "high";

export interface UserProfile {
  /** Anonymous user id (from existing experiment system) */
  userId: string;

  /** Inferred user classification */
  segment: UserSegment;
  /** Current intent level based on signals */
  intentLevel: IntentLevel;

  /** Total site visits */
  visitCount: number;
  /** ISO timestamp of first visit */
  firstVisit: string;
  /** ISO timestamp of most recent visit */
  lastVisit: string;
  /** Last N unique pages viewed */
  pagesViewed: string[];
  /** Countries explicitly explored */
  countriesExplored: string[];
  /** Furthest lead-form step reached (0 = not started) */
  formProgress: number;

  /** Country the user has shown most interest in */
  preferredCountry: string | null;

  /** ISO timestamp of last profile mutation */
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getUserId(): string {
  try {
    const stored = localStorage.getItem(USER_ID_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function now(): string {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                               */
/* ------------------------------------------------------------------ */

function createDefault(): UserProfile {
  const ts = now();
  return {
    userId: getUserId(),
    segment: "unknown",
    intentLevel: "low",
    visitCount: 1,
    firstVisit: ts,
    lastVisit: ts,
    pagesViewed: [],
    countriesExplored: [],
    formProgress: 0,
    preferredCountry: null,
    updatedAt: ts,
  };
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      const fresh = createDefault();
      saveProfile(fresh);
      return fresh;
    }
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as UserProfile;
    }
    return createDefault();
  } catch {
    return createDefault();
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    profile.updatedAt = now();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* storage full / blocked */
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/*  Mutation helpers                                                   */
/* ------------------------------------------------------------------ */

export function recordPageVisit(profile: UserProfile, page: string): UserProfile {
  const pages = profile.pagesViewed.includes(page)
    ? profile.pagesViewed
    : [...profile.pagesViewed, page].slice(-MAX_PAGES);
  return { ...profile, pagesViewed: pages, lastVisit: now() };
}

export function recordCountryExplored(profile: UserProfile, country: string): UserProfile {
  if (profile.countriesExplored.includes(country)) return profile;
  const countries = [...profile.countriesExplored, country].slice(-MAX_COUNTRIES);
  const preferredCountry = countries[countries.length - 1] ?? null;
  return { ...profile, countriesExplored: countries, preferredCountry };
}

export function recordFormProgress(profile: UserProfile, step: number): UserProfile {
  return { ...profile, formProgress: Math.max(profile.formProgress, step) };
}

export function recordVisitBump(profile: UserProfile): UserProfile {
  return { ...profile, visitCount: profile.visitCount + 1, lastVisit: now() };
}

export function setSegment(profile: UserProfile, segment: UserSegment): UserProfile {
  return { ...profile, segment };
}

export function setIntentLevel(profile: UserProfile, intentLevel: IntentLevel): UserProfile {
  return { ...profile, intentLevel };
}
