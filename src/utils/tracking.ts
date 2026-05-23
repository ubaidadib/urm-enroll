import {
  ga4Adapter,
  metaPixelAdapter,
  hasAnalyticsConsent,
  hasMarketingConsent,
} from "@/lib/analytics";
import { getPublicEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Event Schema                                                       */
/* ------------------------------------------------------------------ */

interface TrackingProperties {
  page?: string;
  context?: string;
  intentLevel?: string;
  step?: number;
  userType?: string;
  [key: string]: string | number | boolean | undefined;
}

interface TrackingEvent {
  event: string;
  timestamp: number;
  properties: TrackingProperties;
}

/* ------------------------------------------------------------------ */
/*  In-memory event queue                                              */
/* ------------------------------------------------------------------ */

const eventLog: TrackingEvent[] = [];
const MAX_QUEUE_SIZE = 200;

/** Returns a shallow copy of the internal event log for debugging. */
export function getEventLog(): readonly TrackingEvent[] {
  return [...eventLog];
}

/* ------------------------------------------------------------------ */
/*  Debug helpers                                                      */
/* ------------------------------------------------------------------ */

const isDebug = (): boolean =>
  import.meta.env.DEV || getPublicEnv().analyticsDebug;

function debugLog(...args: unknown[]): void {
  if (!isDebug()) return;
  logger.debug({
    message: "[tracking:debug]",
    context: { args },
  });
}

/* ------------------------------------------------------------------ */
/*  PII sanitisation — strip sensitive fields before forwarding        */
/* ------------------------------------------------------------------ */

const PII_KEYS = new Set([
  "email", "phone", "name", "firstName", "lastName",
  "first_name", "last_name", "address", "password",
]);

function sanitize(
  props: TrackingProperties,
): Record<string, string | number | boolean> {
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || PII_KEYS.has(k)) continue;
    clean[k] = v;
  }
  return clean;
}

/* ------------------------------------------------------------------ */
/*  Deduplication — prevent rapid double-fires (500 ms window)         */
/* ------------------------------------------------------------------ */

let lastFiredKey = "";
let lastFiredAt = 0;
const DEDUP_WINDOW = 500;

function isDuplicate(event: string, properties: TrackingProperties): boolean {
  const key = event + JSON.stringify(properties);
  const now = Date.now();
  if (key === lastFiredKey && now - lastFiredAt < DEDUP_WINDOW) {
    debugLog("Dedup blocked", event);
    return true;
  }
  lastFiredKey = key;
  lastFiredAt = now;
  return false;
}

/* ------------------------------------------------------------------ */
/*  Event normalisation layer                                          */
/* ------------------------------------------------------------------ */

/**
 * Normalise internal event names to a consistent snake_case format.
 * Ensures naming consistency across all providers regardless of what
 * the caller passes in.
 */
export function normalizeEventName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")       // spaces → underscores
    .replace(/[^a-z0-9_]/g, "") // strip non-alphanumeric
    .replace(/_+/g, "_")        // collapse multiple underscores
    .replace(/^_|_$/g, "");     // trim leading/trailing underscores
}

/* ------------------------------------------------------------------ */
/*  GA4 event mapping (internal → GA4 recommended event names)         */
/* ------------------------------------------------------------------ */

const GA4_EVENT_MAP: Record<string, string> = {
  cta_click: "select_content",
  cta_impression: "view_item",
  form_start: "form_start",
  form_step_complete: "form_progress",
  form_submit: "generate_lead",
  form_drop_off: "form_abandonment",
  page_view: "page_view",
  scroll_depth: "scroll",
  time_on_page: "user_engagement",
  user_engagement: "user_engagement",
  experiment_view: "experiment_view",
  experiment_conversion: "experiment_conversion",
  lead_qualified: "lead_qualified",
  lead_routed: "lead_routed",
  personalization_applied: "personalization_applied",
  recommendation_shown: "recommendation_shown",
  recommendation_clicked: "recommendation_clicked",
  segment_updated: "segment_updated",
};

/* ------------------------------------------------------------------ */
/*  Meta Pixel event mapping (internal → FB standard events)           */
/*  Only conversion-relevant events are mapped.                        */
/* ------------------------------------------------------------------ */

const META_EVENT_MAP: Record<string, string> = {
  page_view: "PageView",
  cta_click: "Contact",
  form_submit: "Lead",
};

/* ------------------------------------------------------------------ */
/*  Adapter — single exit point for all analytics                      */
/* ------------------------------------------------------------------ */

function sendToAnalytics(event: TrackingEvent): void {
  // Dedup rapid fires (consent-independent — always dedup)
  if (isDuplicate(event.event, event.properties)) return;

  const cleanProps = sanitize(event.properties);
  const normalized = normalizeEventName(event.event);

  // GA4 adapter — gated on analytics consent
  if (hasAnalyticsConsent()) {
    const ga4Name = GA4_EVENT_MAP[normalized] ?? normalized;
    ga4Adapter({ name: ga4Name, properties: cleanProps });
  }

  // Meta Pixel adapter — gated on marketing consent, only mapped events
  if (hasMarketingConsent()) {
    const metaName = META_EVENT_MAP[normalized];
    if (metaName) {
      metaPixelAdapter(metaName, cleanProps);
    }
  }

  // Debug logging
  debugLog(
    `dispatch: internal="${normalized}"`,
    `ga4="${GA4_EVENT_MAP[normalized] ?? normalized}"`,
    META_EVENT_MAP[normalized] ? `meta="${META_EVENT_MAP[normalized]}"` : "meta=skip",
    `analytics_consent=${hasAnalyticsConsent()}`,
    `marketing_consent=${hasMarketingConsent()}`,
    cleanProps,
  );
}

/* ------------------------------------------------------------------ */
/*  Core dispatcher                                                    */
/* ------------------------------------------------------------------ */

function dispatch(event: string, properties: TrackingProperties): void {
  const entry: TrackingEvent = {
    event,
    timestamp: Date.now(),
    properties,
  };

  // Store in memory queue (ring-buffer style)
  if (eventLog.length >= MAX_QUEUE_SIZE) {
    eventLog.shift();
  }
  eventLog.push(entry);

  // Debug logging
  debugLog("event queued", event, properties);

  // Forward through adapter
  sendToAnalytics(entry);
}

/* ------------------------------------------------------------------ */
/*  Domain-specific tracking functions                                 */
/* ------------------------------------------------------------------ */

/** Track any CTA click across the platform. */
export function trackCTA(params: {
  type: string;
  context: string;
  intentLevel: string;
  variant: string;
}): void {
  dispatch("cta_click", {
    context: params.context,
    intentLevel: params.intentLevel,
    cta_type: params.type,
    cta_variant: params.variant,
  });
}

/** Track when a user begins a form. */
export function trackFormStart(params: {
  page?: string;
  userType?: string;
}): void {
  dispatch("form_start", {
    page: params.page,
    userType: params.userType,
  });
}

/** Track completion of a single form step. */
export function trackStepCompletion(params: {
  step: number;
  userType?: string;
  page?: string;
}): void {
  dispatch("form_step_complete", {
    step: params.step,
    userType: params.userType,
    page: params.page,
  });
}

/** Track successful form submission. */
export function trackFormSubmit(params: {
  userType?: string;
  page?: string;
}): void {
  dispatch("form_submit", {
    userType: params.userType,
    page: params.page,
  });
}

/** Track a page view. */
export function trackPageView(params: {
  page: string;
}): void {
  dispatch("page_view", {
    page: params.page,
  });
}

/** Track scroll depth milestones (25 / 50 / 75 / 100). */
export function trackScrollDepth(params: {
  page: string;
  depth: number;
}): void {
  dispatch("scroll_depth", {
    page: params.page,
    depth: params.depth,
  });
}

/** Track when a CTA enters the viewport (impression). */
export function trackCTAImpression(params: {
  type: string;
  context: string;
  intentLevel: string;
  variant: string;
}): void {
  dispatch("cta_impression", {
    context: params.context,
    intentLevel: params.intentLevel,
    cta_type: params.type,
    cta_variant: params.variant,
  });
}

/** Track when a user abandons a form mid-step. */
export function trackFormDropOff(params: {
  step: number;
  userType?: string;
  page?: string;
}): void {
  dispatch("form_drop_off", {
    step: params.step,
    userType: params.userType,
    page: params.page,
  });
}

/** Track cumulative time on a page. */
export function trackTimeOnPage(params: {
  page: string;
  seconds: number;
}): void {
  dispatch("time_on_page", {
    page: params.page,
    seconds: params.seconds,
  });
}

/** Track user engagement level (element interaction count). */
export function trackEngagement(params: {
  page: string;
  interactionCount: number;
  trigger: string;
}): void {
  dispatch("user_engagement", {
    page: params.page,
    interactionCount: params.interactionCount,
    trigger: params.trigger,
  });
}

/** Track when a user views an experiment variant. */
export function trackExperimentView(params: {
  experiment: string;
  variant: string;
  page?: string;
}): void {
  dispatch("experiment_view", {
    experiment_id: params.experiment,
    experiment_variant: params.variant,
    page: params.page,
  });
}

/** Track a conversion event attributed to an experiment variant. */
export function trackExperimentConversion(params: {
  experiment: string;
  variant: string;
  action: string;
  page?: string;
}): void {
  dispatch("experiment_conversion", {
    experiment_id: params.experiment,
    experiment_variant: params.variant,
    conversion_action: params.action,
    page: params.page,
  });
}

/** Track when a lead has been scored and qualified. */
export function trackLeadQualified(params: {
  leadId: string;
  leadType: string;
  urgency: string;
  score: number;
}): void {
  dispatch("lead_qualified", {
    lead_id: params.leadId,
    lead_type: params.leadType,
    lead_urgency: params.urgency,
    qualification_score: params.score,
  });
}

/** Track when a lead has been routed to automation adapters. */
export function trackLeadRouted(params: {
  leadId: string;
  leadType: string;
  routes: string[];
}): void {
  dispatch("lead_routed", {
    lead_id: params.leadId,
    lead_type: params.leadType,
    routed_to: params.routes.join(","),
    route_count: params.routes.length,
  });
}

/* ------------------------------------------------------------------ */
/*  Personalization tracking                                           */
/* ------------------------------------------------------------------ */

/** Track when personalized content is shown to a user. */
export function trackPersonalizationApplied(params: {
  slot: string;
  segment: string;
  contentKey: string;
}): void {
  dispatch("personalization_applied", {
    slot: params.slot,
    segment: params.segment,
    content_key: params.contentKey,
  });
}

/** Track when recommendations are rendered in a section. */
export function trackRecommendationShown(params: {
  type: string;
  items: string[];
}): void {
  dispatch("recommendation_shown", {
    recommendation_type: params.type,
    items: params.items.join(","),
    item_count: params.items.length,
  });
}

/** Track when a user clicks a recommendation. */
export function trackRecommendationClicked(params: {
  type: string;
  item: string;
  position: number;
}): void {
  dispatch("recommendation_clicked", {
    recommendation_type: params.type,
    item: params.item,
    position: params.position,
  });
}

/** Track when user segment changes due to behavioral signals. */
export function trackSegmentUpdated(params: {
  oldSegment: string;
  newSegment: string;
  trigger: string;
}): void {
  dispatch("segment_updated", {
    old_segment: params.oldSegment,
    new_segment: params.newSegment,
    trigger: params.trigger,
  });
}
