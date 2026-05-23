/* ------------------------------------------------------------------ */
/*  A/B Testing — lightweight, localStorage-backed experiment engine   */
/*  Synchronous reads guarantee no-flicker variant assignment.         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "urm-user-id";
const ASSIGNMENT_KEY = "urm-experiments";

/* ------------------------------------------------------------------ */
/*  Experiment registry                                                */
/* ------------------------------------------------------------------ */

export interface Experiment {
  /** Unique identifier for the experiment. */
  id: string;
  /** Percentage (0-100) of traffic allocated to variant B. */
  trafficPercent: number;
  /** Whether this experiment is currently active. */
  enabled: boolean;
}

const EXPERIMENTS: Record<string, Experiment> = {
  hero_headline: {
    id: "hero_headline",
    trafficPercent: 50,
    enabled: true,
  },
  cta_copy: {
    id: "cta_copy",
    trafficPercent: 50,
    enabled: true,
  },
  lead_form_steps: {
    id: "lead_form_steps",
    trafficPercent: 50,
    enabled: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Deterministic user identifier                                      */
/* ------------------------------------------------------------------ */

function getUserId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // SSR or storage unavailable — fallback to session-only id
    return crypto.randomUUID();
  }
}

/* ------------------------------------------------------------------ */
/*  Simple hash — deterministic bucket assignment                      */
/* ------------------------------------------------------------------ */

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

/* ------------------------------------------------------------------ */
/*  Variant assignment                                                 */
/* ------------------------------------------------------------------ */

export type Variant = "A" | "B";

/**
 * Synchronously determine which variant a user should see for a given
 * experiment. Assignment is deterministic based on userId + experimentId
 * and is cached in localStorage so it never changes for a returning user.
 */
export function getVariant(experimentId: string): Variant {
  const experiment = EXPERIMENTS[experimentId];
  if (!experiment?.enabled) return "A";

  // Check cached assignments first
  try {
    const cached = localStorage.getItem(ASSIGNMENT_KEY);
    if (cached) {
      const assignments = JSON.parse(cached) as Record<string, Variant>;
      const existing = assignments[experimentId];
      if (existing === "A" || existing === "B") return existing;
    }
  } catch {
    // Corrupted JSON — proceed to re-assign
  }

  // Compute deterministic assignment
  const userId = getUserId();
  const bucket = hashString(`${userId}:${experimentId}`) % 100;
  const variant: Variant = bucket < experiment.trafficPercent ? "B" : "A";

  // Cache assignment
  try {
    const raw = localStorage.getItem(ASSIGNMENT_KEY);
    const assignments: Record<string, Variant> = raw ? JSON.parse(raw) : {};
    assignments[experimentId] = variant;
    localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(assignments));
  } catch {
    // Storage full or unavailable — variant still works for this session
  }

  return variant;
}

/**
 * Returns all current experiment assignments for the user.
 * Useful for debug panels and analytics payloads.
 */
export function getAllAssignments(): Record<string, Variant> {
  const result: Record<string, Variant> = {};
  for (const id of Object.keys(EXPERIMENTS)) {
    result[id] = getVariant(id);
  }
  return result;
}

/**
 * Returns the experiment registry (read-only).
 */
export function getExperiments(): Readonly<Record<string, Experiment>> {
  return EXPERIMENTS;
}
