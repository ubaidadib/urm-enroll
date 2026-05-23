import { getCsrfToken } from "./csrf";
import { logger } from "./logger";

export type ApplicationPayload = {
  fullName: string;
  email: string;
  nationality?: string;
  phone?: string;
  lastDegree?: string;
  gpa?: string;
  graduationYear?: string;
  programId: string;
  programName: string;
  universityName: string;
  turnstileToken?: string;
};

export type ApplicationResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Submit a program application to /api/application.
 *
 * Attaches the session CSRF token (and an optional Turnstile token) then
 * POSTs the payload.  Returns `{ ok: true }` on success or
 * `{ ok: false, error }` on any failure — never throws.
 */
export async function submitApplication(
  payload: ApplicationPayload,
): Promise<ApplicationResult> {
  if (typeof window === "undefined") {
    return { ok: false, error: "Not available server-side" };
  }

  const csrfToken = getCsrfToken();

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch("/api/application", {
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
      return { ok: true };
    }

    // Try to get a server error message
    let serverError = "Submission failed";
    try {
      const body = await response.json();
      if (typeof body?.error === "string") serverError = body.error;
    } catch {
      // ignore parse error
    }

    return { ok: false, error: serverError };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, error: "Request timed out. Please try again." };
    }
    logger.warn({ message: "Application submission failed", context: { err } });
    return { ok: false, error: "Network error. Please check your connection and try again." };
  } finally {
    window.clearTimeout(timeout);
  }
}
