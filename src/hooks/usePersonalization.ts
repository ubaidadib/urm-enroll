/* ------------------------------------------------------------------ */
/*  usePersonalization — composing React hook for the personalization   */
/*  engine. Provides profile, content resolution, recommendations,     */
/*  and signal recording to any component.                             */
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import type { UserProfile, UserSegment, IntentLevel } from "@/utils/user-profile";
import { processSignal, getCurrentProfile, type Signal } from "@/utils/personalization";
import { resolveContentKey, isPersonalized, type ContentSlot } from "@/utils/content-resolver";
import { getRecommendations, getPersonalizedCountryOrder } from "@/utils/recommendations";

/* ------------------------------------------------------------------ */
/*  Hook return type                                                   */
/* ------------------------------------------------------------------ */

interface PersonalizationContext {
  /** Current user profile (anonymous, no PII) */
  profile: UserProfile;
  /** Shorthand: current segment */
  segment: UserSegment;
  /** Shorthand: current intent level */
  intentLevel: IntentLevel;
  /** Resolve a content slot to a personalized i18n key */
  resolveContent: (slot: ContentSlot) => string;
  /** Check if a content slot is being personalized */
  isSlotPersonalized: (slot: ContentSlot) => boolean;
  /** Personalized country order for destination display */
  countryOrder: (countryCodes: string[]) => string[];
  /** Service recommendations */
  recommendations: ReturnType<typeof getRecommendations>;
  /** Record a behavioral signal to update profile */
  recordSignal: (signal: Signal) => void;
}

/* ------------------------------------------------------------------ */
/*  Session start tracking                                             */
/* ------------------------------------------------------------------ */

const SESSION_KEY = "urm-session-started";

function hasSessionStarted(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSessionStarted(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/*  Hook implementation                                                */
/* ------------------------------------------------------------------ */

export function usePersonalization(): PersonalizationContext {
  const { language } = useLanguage();
  const initialised = useRef(false);
  const [profile, setProfile] = useState<UserProfile>(getCurrentProfile);

  // Bump visit count once per browser session
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (!hasSessionStarted()) {
      markSessionStarted();
      const updated = processSignal({ type: "session_start" });
      setProfile(updated);
    }
  }, []);

  const recordSignal = useCallback((signal: Signal) => {
    const updated = processSignal(signal);
    setProfile(updated);
  }, []);

  const resolveContent = useCallback(
    (slot: ContentSlot) => resolveContentKey(profile, slot),
    [profile],
  );

  const isSlotPersonalized = useCallback(
    (slot: ContentSlot) => isPersonalized(profile, slot),
    [profile],
  );

  const countryOrder = useCallback(
    (countryCodes: string[]) => getPersonalizedCountryOrder(profile, language, countryCodes),
    [profile, language],
  );

  const recommendations = useMemo(
    () => getRecommendations(profile, language),
    [profile, language],
  );

  return {
    profile,
    segment: profile.segment,
    intentLevel: profile.intentLevel,
    resolveContent,
    isSlotPersonalized,
    countryOrder,
    recommendations,
    recordSignal,
  };
}
