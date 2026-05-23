import { useState, useEffect, useCallback, useRef } from "react";
import { trackTimeOnPage, trackEngagement } from "../utils/tracking";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type IntentSignal = "none" | "time" | "engagement" | "scroll-back";

interface BehavioralState {
  /** Current highest intent signal detected. */
  activeSignal: IntentSignal;
  /** True when user has spent ≥ threshold seconds on the page. */
  timeTriggered: boolean;
  /** True when user has interacted with ≥ threshold elements. */
  engagementTriggered: boolean;
  /** True when user scrolled past 60% and then scrolled back up. */
  scrollBackTriggered: boolean;
  /** Number of tracked interactions. */
  interactionCount: number;
  /** Register a user interaction (click, focus, etc.). */
  registerInteraction: () => void;
}

interface BehavioralConfig {
  /** Page name for tracking. */
  page: string;
  /** Seconds before time trigger fires (default 20). */
  timeThreshold?: number;
  /** Interaction count before engagement trigger fires (default 2). */
  engagementThreshold?: number;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useBehavioralTriggers(config: BehavioralConfig): BehavioralState {
  const {
    page,
    timeThreshold = 20,
    engagementThreshold = 2,
  } = config;

  const [timeTriggered, setTimeTriggered] = useState(false);
  const [engagementTriggered, setEngagementTriggered] = useState(false);
  const [scrollBackTriggered, setScrollBackTriggered] = useState(false);
  const interactionCountRef = useRef(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const maxScrollRef = useRef(0);
  const scrollBackFiredRef = useRef(false);

  // Compute the highest active signal
  const activeSignal: IntentSignal = scrollBackTriggered
    ? "scroll-back"
    : engagementTriggered
      ? "engagement"
      : timeTriggered
        ? "time"
        : "none";

  // --- Time-on-page trigger ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeTriggered(true);
      trackTimeOnPage({ page, seconds: timeThreshold });
    }, timeThreshold * 1000);
    return () => clearTimeout(timer);
  }, [page, timeThreshold]);

  // --- Scroll-back trigger ---
  useEffect(() => {
    const handler = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const ratio = window.scrollY / scrollHeight;

      // Track max scroll position
      if (ratio > maxScrollRef.current) {
        maxScrollRef.current = ratio;
      }

      // User scrolled past 60% and now scrolled back up by ≥ 15%
      if (
        !scrollBackFiredRef.current &&
        maxScrollRef.current >= 0.6 &&
        ratio < maxScrollRef.current - 0.15
      ) {
        scrollBackFiredRef.current = true;
        setScrollBackTriggered(true);
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // --- Engagement trigger ---
  const registerInteraction = useCallback(() => {
    interactionCountRef.current += 1;
    const count = interactionCountRef.current;
    setInteractionCount(count);

    if (count >= engagementThreshold && !engagementTriggered) {
      setEngagementTriggered(true);
      trackEngagement({ page, interactionCount: count, trigger: "element_interaction" });
    }
  }, [page, engagementThreshold, engagementTriggered]);

  return {
    activeSignal,
    timeTriggered,
    engagementTriggered,
    scrollBackTriggered,
    interactionCount,
    registerInteraction,
  };
}
