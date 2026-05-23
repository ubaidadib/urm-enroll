/* ------------------------------------------------------------------ */
/*  Lead Scoring — compute qualification score from form data          */
/* ------------------------------------------------------------------ */

import type { RawLeadFormData } from "./lead-types";
import {
  TIMELINE_SCORE,
  READINESS_SCORE,
  HIGH_VOLUME_VALUES,
} from "./lead-types";

/**
 * Compute a 0–100 qualification score from raw form data.
 *
 * Scoring breakdown:
 *   Contact completeness   — up to 15
 *   Timeline urgency       — up to 25
 *   Readiness level        — up to 30
 *   Budget provided        — up to 10
 *   Language level          — up to  5
 *   Agent high-volume      — up to 15
 *                          ─────────
 *                       Max = 100
 */
export function computeLeadScore(data: RawLeadFormData): number {
  let score = 0;

  // Contact completeness (email + phone present = 15)
  if (data.email.trim() && data.phone.trim()) {
    score += 15;
  }

  // Timeline urgency
  score += TIMELINE_SCORE[data.timeline] ?? 0;

  // Readiness
  score += READINESS_SCORE[data.readiness] ?? 0;

  if (data.userType === "student") {
    // Budget provided
    if (data.budgetRange.trim()) score += 10;
    // Language level provided
    if (data.languageLevel.trim()) score += 5;
  }

  if (data.userType === "agent") {
    // High-volume agents are higher value
    if (HIGH_VOLUME_VALUES.has(data.monthlyVolume)) {
      score += 15;
    }
  }

  return Math.min(score, 100);
}
