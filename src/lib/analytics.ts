type EventProperties = Record<string, string | number | boolean | null | undefined>;

import { getPublicEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

type AnalyticsEvent = {
  name: string;
  properties?: EventProperties;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

/* ------------------------------------------------------------------ */
/*  Granular Consent                                                   */
/* ------------------------------------------------------------------ */

const CONSENT_KEY = "urm-cookie-consent";

export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

/** Read per-category consent from localStorage. */
export function getConsentState(): ConsentCategories {
  try {
    if (typeof window === "undefined") return { analytics: false, marketing: false };
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return { analytics: false, marketing: false };

    // Migrate legacy binary value
    if (raw === "accepted") return { analytics: true, marketing: true };
    if (raw === "rejected") return { analytics: false, marketing: false };

    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const obj = parsed as Record<string, unknown>;
      return {
        analytics: obj.analytics === true,
        marketing: obj.marketing === true,
      };
    }
    return { analytics: false, marketing: false };
  } catch {
    return { analytics: false, marketing: false };
  }
}

/** Persist per-category consent and re-evaluate loaded scripts. */
export function setConsentState(consent: ConsentCategories): void {
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ ...consent, timestamp: Date.now() }),
    );
  } catch { /* storage full / blocked */ }
  applyConsent(consent);
}

/** Check if analytics (GA4) consent is granted. */
export function hasAnalyticsConsent(): boolean {
  return getConsentState().analytics;
}

/** Check if marketing (Meta Pixel) consent is granted. */
export function hasMarketingConsent(): boolean {
  return getConsentState().marketing;
}

/* ------------------------------------------------------------------ */
/*  Debug mode                                                         */
/* ------------------------------------------------------------------ */

const { ga4Id: GA_ID, metaPixelId: META_PIXEL_ID, analyticsDebug: _ANALYTICS_DEBUG } = getPublicEnv();

const isDebug = (): boolean =>
  import.meta.env.DEV || _ANALYTICS_DEBUG;

function debugLog(...args: unknown[]): void {
  if (!isDebug()) return;
  logger.debug({
    message: "[analytics:debug]",
    context: { args },
  });
}

/* ------------------------------------------------------------------ */
/*  GA4                                                                */
/* ------------------------------------------------------------------ */

const isGaEnabled = () => import.meta.env.PROD && Boolean(GA_ID);

let ga4Injected = false;

const injectGaScript = () => {
  if (!isGaEnabled() || ga4Injected) return;
  if (document.querySelector("script[data-analytics='ga4-loader']")) return;

  ga4Injected = true;
  debugLog("Injecting GA4 script", GA_ID);

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  loader.setAttribute("data-analytics", "ga4-loader");
  document.head.appendChild(loader);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtagProxy(...args: unknown[]) {
    window.dataLayer?.push(args as unknown as Record<string, unknown>);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
};

/** Forward a single event to GA4. */
export function ga4Adapter(event: AnalyticsEvent): void {
  if (!event?.name || !isGaEnabled() || typeof window.gtag !== "function") return;
  window.gtag("event", event.name, event.properties || {});
  debugLog("GA4 →", event.name, event.properties);
}

/* ------------------------------------------------------------------ */
/*  Meta Pixel                                                         */
/* ------------------------------------------------------------------ */

const isMetaPixelEnabled = () => import.meta.env.PROD && Boolean(META_PIXEL_ID);

let metaPixelInjected = false;

const injectMetaPixelScript = () => {
  if (!isMetaPixelEnabled() || metaPixelInjected) return;
  if (document.querySelector("script[data-analytics='meta-pixel-loader']")) return;
  if (typeof window.fbq === "function") return;

  metaPixelInjected = true;
  debugLog("Injecting Meta Pixel script", META_PIXEL_ID);

  const queue: unknown[][] = [];
  const fbqProxy = (...args: unknown[]) => {
    queue.push(args);
  };
  window.fbq = fbqProxy;
  window._fbq = fbqProxy;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.setAttribute("data-analytics", "meta-pixel-loader");
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
};

/** Forward a single event to Meta Pixel. */
export function metaPixelAdapter(eventName: string, properties?: EventProperties): void {
  if (!isMetaPixelEnabled() || typeof window.fbq !== "function") return;
  if (properties && Object.keys(properties).length > 0) {
    window.fbq("track", eventName, properties);
  } else {
    window.fbq("track", eventName);
  }
  debugLog("Meta Pixel →", eventName, properties);
}

/* ------------------------------------------------------------------ */
/*  Consent lifecycle — apply / re-evaluate                            */
/* ------------------------------------------------------------------ */

function applyConsent(consent: ConsentCategories): void {
  if (consent.analytics) {
    injectGaScript();
  }
  if (consent.marketing) {
    injectMetaPixelScript();
  }
  debugLog("Consent applied", consent);
}

/* ------------------------------------------------------------------ */
/*  Public init (called from main.tsx & cookie-banner)                 */
/* ------------------------------------------------------------------ */

export const initAnalytics = () => {
  const consent = getConsentState();
  applyConsent(consent);
};

/* ------------------------------------------------------------------ */
/*  Server-side tracking preparation (structure only)                  */
/*  —————————————————————————————————————————————————                   */
/*  These types and the buildServerPayload helper define the contract  */
/*  for future Meta Conversion API / server-side GA4 integration.      */
/*  No network calls are made — this is a structural scaffold.         */
/* ------------------------------------------------------------------ */

export interface ServerEventPayload {
  eventName: string;
  eventTime: number;
  sourceUrl: string;
  userData: {
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbc?: string;   // Facebook click ID (from _fbc cookie)
    fbp?: string;   // Facebook browser ID (from _fbp cookie)
  };
  customData?: Record<string, string | number | boolean>;
}

export function buildServerPayload(
  eventName: string,
  properties?: Record<string, string | number | boolean>,
): ServerEventPayload {
  return {
    eventName,
    eventTime: Math.floor(Date.now() / 1000),
    sourceUrl: typeof window !== "undefined" ? window.location.href : "",
    userData: {
      clientUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    },
    customData: properties,
  };
}

/* ------------------------------------------------------------------ */
/*  Legacy exports (kept for backward-compat)                          */
/* ------------------------------------------------------------------ */

export const trackEvent = (event: AnalyticsEvent) => {
  ga4Adapter(event);
};

export const SEO_EVENTS = {
  CONTACT_FORM_SUBMIT: () => trackEvent({ name: "contact_form_submit" }),
  WHATSAPP_CLICK: (counselorName: string) =>
    trackEvent({ name: "whatsapp_click", properties: { counselorName } }),
  EMAIL_CLICK: (counselorName: string) =>
    trackEvent({ name: "email_click", properties: { counselorName } }),
  BOOK_CALL_CLICK: (counselorName: string) =>
    trackEvent({ name: "book_call_click", properties: { counselorName } }),
  ENROLLMENT_STARTED: () => trackEvent({ name: "enrollment_started" }),
  ENROLLMENT_COMPLETED: () => trackEvent({ name: "enrollment_completed" }),
  LANGUAGE_SWITCHED: (newLang: string) =>
    trackEvent({ name: "language_switched", properties: { newLang } }),
  PROGRAM_VIEWED: (programName: string) =>
    trackEvent({ name: "program_viewed", properties: { programName } }),
};
