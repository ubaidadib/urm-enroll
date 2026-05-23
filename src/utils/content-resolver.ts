/* ------------------------------------------------------------------ */
/*  Content Resolver — resolves personalized i18n keys based on        */
/*  the user's segment and intent level.                               */
/*                                                                     */
/*  Works as a layer ABOVE A/B testing. If an experiment is active     */
/*  for a slot, the experiment variant takes priority.                 */
/* ------------------------------------------------------------------ */

import type { UserProfile, UserSegment } from "./user-profile";

/* ------------------------------------------------------------------ */
/*  Content slot definitions                                           */
/* ------------------------------------------------------------------ */

export type ContentSlot =
  | "hero.title"
  | "hero.description"
  | "hero.cta"
  | "cta.primary.label"
  | "cta.banner.headline";

interface SlotRule {
  /** The personalized i18n key to use for a given segment */
  segmentKeys: Partial<Record<UserSegment, string>>;
  /** Special key for returning users (visitCount > 1) */
  returningKey?: string;
  /** The default i18n key when no personalization applies */
  defaultKey: string;
}

/* ------------------------------------------------------------------ */
/*  Slot rule registry                                                 */
/* ------------------------------------------------------------------ */

const SLOT_RULES: Record<ContentSlot, SlotRule> = {
  "hero.title": {
    segmentKeys: {
      student: "hero.personalized.studentTitle",
      agent: "hero.personalized.agentTitle",
      nursing: "hero.personalized.nursingTitle",
    },
    returningKey: "hero.personalized.returningTitle",
    defaultKey: "hero.titleLine1",
  },
  "hero.description": {
    segmentKeys: {
      student: "hero.personalized.studentDescription",
      agent: "hero.personalized.agentDescription",
      nursing: "hero.personalized.nursingDescription",
    },
    returningKey: "hero.personalized.returningDescription",
    defaultKey: "hero.description",
  },
  "hero.cta": {
    segmentKeys: {
      student: "hero.personalized.studentCta",
      agent: "hero.personalized.agentCta",
      nursing: "hero.personalized.nursingCta",
    },
    defaultKey: "hero.ctaPrimary",
  },
  "cta.primary.label": {
    segmentKeys: {
      agent: "hero.personalized.agentCta",
      nursing: "hero.personalized.nursingCta",
    },
    defaultKey: "hero.ctaPrimary",
  },
  "cta.banner.headline": {
    segmentKeys: {
      student: "hero.personalized.studentTitle",
      agent: "hero.personalized.agentTitle",
    },
    defaultKey: "hero.titleLine1",
  },
};

/* ------------------------------------------------------------------ */
/*  Resolver                                                           */
/* ------------------------------------------------------------------ */

/**
 * Resolve the i18n key for a content slot based on the user's profile.
 * Returns the most specific match in this priority order:
 *   1. Segment-specific key (if segment ≠ "unknown")
 *   2. Returning-user key (if visitCount > 1 and key exists)
 *   3. Default key
 */
export function resolveContentKey(
  profile: UserProfile,
  slot: ContentSlot,
): string {
  const rule = SLOT_RULES[slot];

  // Segment-specific personalization
  if (profile.segment !== "unknown") {
    const segmentKey = rule.segmentKeys[profile.segment];
    if (segmentKey) return segmentKey;
  }

  // Returning user
  if (profile.visitCount > 1 && rule.returningKey) {
    return rule.returningKey;
  }

  return rule.defaultKey;
}

/**
 * Check whether the resolved key differs from the default,
 * meaning personalization is active for this slot.
 */
export function isPersonalized(profile: UserProfile, slot: ContentSlot): boolean {
  return resolveContentKey(profile, slot) !== SLOT_RULES[slot].defaultKey;
}
