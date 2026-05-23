import { getCsrfToken } from "./csrf";
import { logger } from "./logger";

export type ContactPayload = {
  fullName: string;
  email: string;
  phone?: string;
  topic: string;
  subject: string;
  message: string;
  turnstileToken: string;
  csrfToken?: string;
};

const endpoints = ["/api/contact", "/.netlify/functions/contact"];

export const secureSubmitContact = async (payload: ContactPayload) => {
  if (typeof window === "undefined") {
    return false;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 7000);

  try {
    const csrfToken = getCsrfToken();

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-urm-csrf": csrfToken,
          "x-urm-client": "web-contact",
        },
        body: JSON.stringify({ ...payload, csrfToken }),
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: controller.signal,
      });

      if (response.ok) {
        return true;
      }
    }

    return false;
  } catch {
    logger.warn({ message: "Contact submission failed" });
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
};
