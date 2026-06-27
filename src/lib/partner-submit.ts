import { getCsrfToken } from "./csrf";
import { logger } from "./logger";

export type PartnerPayload = {
  organizationType: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  roleTitle: string;
  organizationSize: string;
  geographicScope: string;
  partnershipType: string;
  budgetAuthority: string;
  candidateVolume?: string;
  complianceTimeline?: string;
  notes?: string;
  turnstileToken: string;
  csrfToken?: string;
};

const endpoints = ["/api/partner"];

export const secureSubmitPartner = async (payload: PartnerPayload) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const csrfToken = getCsrfToken();
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-urm-csrf": csrfToken,
          "x-urm-client": "institution",
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
    logger.warn({ message: "Institutional inquiry failed" });
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
};
