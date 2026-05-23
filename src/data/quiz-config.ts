// ─── Shared Quiz Configuration ──────────────────────────────────────────────
// Scoring weights, base scores, and tier logic for SmartQuiz.
// Consumed by: smart-quiz

export const QUIZ_BASE_SCORE = 72;
export const QUIZ_SCORE_MIN = 68;
export const QUIZ_SCORE_MAX = 96;
export const RECOGNITION_SCORE_MAX = 92;

/** Bonus weights applied when a quiz answer matches one of these keys. */
export const QUIZ_WEIGHTS: Record<string, number> = {
  Germany: 8,
  Canada: 5,
  "United Kingdom": 5,
  "United States": 3,
  Doctorate: 5,
  Postgraduate: 4,
  Nursing: 6,
  "Above 60000": 5,
  "Next semester": 5,
};

/** Fallback weight per question category when no explicit key match exists. */
export const QUIZ_FALLBACK_WEIGHTS: Record<string, number> = {
  destination: 4,
  studyLevel: 3,
  field: 3,
  budget: 2,
  timeline: 2,
};

/** Visa timeline estimates keyed by the timeline answer value. */
export const VISA_TIMELINE_MAP: Record<string, string> = {
  "Next semester": "4-6 weeks",
  "Within 6 months": "6-9 weeks",
  "6-12 months": "8-12 weeks",
  "More than a year": "10-14 weeks",
};
export const VISA_TIMELINE_DEFAULT = "6-10 weeks";
