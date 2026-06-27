import { getCsrfToken } from "./csrf";
import { logger } from "./logger";

export type LeadPayload = {
  fullName?: string;
  email?: string;
  destination: string;
  studyLevel: string;
  field: string;
  budget?: string;
  timeline: string;
  matchScore?: number;
  language?: string;
  source?: string;
  turnstileToken: string;
  csrfToken?: string;
};

const endpoints = ["/api/lead"];

export const secureSubmitLead = async (payload: LeadPayload) => {
  if (typeof window === "undefined") {
    return false;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const csrfToken = getCsrfToken();
    let unavailableCount = 0;
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-urm-csrf": csrfToken,
          "x-urm-client": "web",
        },
        body: JSON.stringify({ ...payload, csrfToken }),
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });

      if (response.ok) {
        return true;
      }

      if (response.status === 404) {
        unavailableCount += 1;
        continue;
      }

      // For validation/security errors we do not launch email fallback.
      if (response.status >= 400 && response.status < 500) {
        return false;
      }
    }

    if (unavailableCount === endpoints.length) {
      openMailtoFallback(payload);
    }
    return false;
  } catch {
    logger.warn({ message: "Lead submission failed" });
    openMailtoFallback(payload);
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
};

function openMailtoFallback(payload: LeadPayload) {
  if (typeof window === "undefined") return;

  const subject = encodeURIComponent("New Chancenkarte lead");
  const body = encodeURIComponent(
    [
      `Full name: ${payload.fullName ?? ""}`,
      `Email: ${payload.email ?? ""}`,
      `Destination: ${payload.destination}`,
      `Study level: ${payload.studyLevel}`,
      `Field: ${payload.field}`,
      `Timeline: ${payload.timeline}`,
      `Match score: ${payload.matchScore ?? ""}`,
      `Language: ${payload.language ?? ""}`,
      `Source: ${payload.source ?? ""}`,
    ].join("\n"),
  );

  const href = `mailto:contact@enrollurm.com?subject=${subject}&body=${body}`;
  // The fallback allows manual email delivery when local API routes are unavailable.
  window.location.href = href;
}
