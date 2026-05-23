/* ------------------------------------------------------------------ */
/*  Lead Webhooks — adapter-pattern dispatcher for CRM & automation    */
/*  All adapters are stubs. Swap in real implementations when ready.   */
/* ------------------------------------------------------------------ */

import type { QualifiedLead } from "./lead-types";
import { getPublicEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Adapter interface                                                  */
/* ------------------------------------------------------------------ */

interface WebhookAdapter {
  /** Human-readable name (used in tracking / logging). */
  name: string;
  /** Toggle without removing the adapter from the registry. */
  enabled: boolean;
  /** Return true if this adapter should fire for the given lead. */
  match(lead: QualifiedLead): boolean;
  /** Execute the webhook (HTTP call, SDK push, etc.). */
  dispatch(lead: QualifiedLead): Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Debug helper                                                       */
/* ------------------------------------------------------------------ */

const isDebug = (): boolean =>
  import.meta.env.DEV || getPublicEnv().analyticsDebug;

function debugLog(...args: unknown[]): void {
  if (!isDebug()) return;
  logger.debug({
    message: "[webhooks:debug]",
    context: { args },
  });
}

/* ------------------------------------------------------------------ */
/*  CRM Adapter (stub — HubSpot / Zoho / Salesforce)                   */
/* ------------------------------------------------------------------ */

const crmAdapter: WebhookAdapter = {
  name: "crm",
  enabled: true,

  match(): boolean {
    // All qualified leads should be pushed to CRM
    return true;
  },

  async dispatch(lead: QualifiedLead): Promise<void> {
    // Stub: In production, POST to CRM API
    // e.g. await fetch("https://api.hubspot.com/...", { ... })
    debugLog("CRM stub — would push lead:", lead.id, lead.leadType, lead.tags);
  },
};

/* ------------------------------------------------------------------ */
/*  WhatsApp Adapter (stub — follow-up automation)                     */
/* ------------------------------------------------------------------ */

const whatsappAdapter: WebhookAdapter = {
  name: "whatsapp",
  enabled: true,

  match(lead: QualifiedLead): boolean {
    // Only trigger WhatsApp for high-urgency leads with phone numbers
    return lead.urgency === "high" && lead.phone.trim().length > 0;
  },

  async dispatch(lead: QualifiedLead): Promise<void> {
    // Stub: In production, call WhatsApp Business API / Twilio
    debugLog("WhatsApp stub — would message:", lead.phone, "urgency:", lead.urgency);
  },
};

/* ------------------------------------------------------------------ */
/*  Email Sequence Adapter (stub — drip campaigns)                     */
/* ------------------------------------------------------------------ */

const emailAdapter: WebhookAdapter = {
  name: "email",
  enabled: true,

  match(lead: QualifiedLead): boolean {
    // All leads with a valid email get enrolled in a sequence
    return lead.email.trim().length > 0;
  },

  async dispatch(lead: QualifiedLead): Promise<void> {
    // Stub: In production, enroll in email sequence via SendGrid / Mailchimp
    debugLog(
      "Email stub — would enroll:",
      lead.email,
      "sequence:",
      lead.leadType === "agent" ? "agent-nurture" : "student-welcome",
    );
  },
};

/* ------------------------------------------------------------------ */
/*  Adapter registry                                                   */
/* ------------------------------------------------------------------ */

const adapters: WebhookAdapter[] = [crmAdapter, whatsappAdapter, emailAdapter];

/* ------------------------------------------------------------------ */
/*  Public dispatcher                                                  */
/* ------------------------------------------------------------------ */

/**
 * Fan-out a qualified lead to all matching, enabled webhook adapters.
 * Returns the list of adapter names that were successfully dispatched.
 * Failures are caught per-adapter so one bad hook doesn't block others.
 */
export async function dispatchWebhooks(lead: QualifiedLead): Promise<string[]> {
  const dispatched: string[] = [];

  await Promise.allSettled(
    adapters
      .filter((a) => a.enabled && a.match(lead))
      .map(async (adapter) => {
        try {
          await adapter.dispatch(lead);
          dispatched.push(adapter.name);
          debugLog(`Adapter "${adapter.name}" dispatched for lead ${lead.id}`);
        } catch (err) {
          debugLog(`Adapter "${adapter.name}" failed for lead ${lead.id}:`, err);
        }
      }),
  );

  return dispatched;
}
