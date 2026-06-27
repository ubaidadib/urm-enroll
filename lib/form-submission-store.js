import crypto from "node:crypto";

import { query } from "./nexus-sync/db.js";
import { serverLogger } from "./pino.js";

// Durable store for inbound form submissions (lead/contact/partner/application)
// plus an email-delivery audit. Best-effort by design: persistence failures are
// logged but never block the request, because email remains the primary
// notification channel. Activates only when DATABASE_URL is configured.

export const isSubmissionStoreConfigured = () => Boolean(process.env.DATABASE_URL);

export const hashIp = (ip) =>
  ip ? crypto.createHash("sha256").update(String(ip)).digest("hex") : null;

/**
 * Persist a submission with email_delivered=false. Returns the new row id, or
 * null if storage is unconfigured or failed (caller continues regardless).
 */
export const recordSubmission = async ({
  formType,
  email = null,
  fullName = null,
  destination = null,
  language = null,
  source = null,
  fields = {},
  ipHash = null,
}) => {
  if (!isSubmissionStoreConfigured()) {
    return null;
  }

  try {
    const result = await query(
      `INSERT INTO form_submissions
         (form_type, email, full_name, destination, language, source, payload_json, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
       RETURNING id`,
      [
        String(formType),
        email,
        fullName,
        destination,
        language,
        source,
        JSON.stringify(fields ?? {}),
        ipHash,
      ],
    );
    return result.rows[0]?.id ?? null;
  } catch (error) {
    serverLogger.error({
      message: "[form-store] failed to persist submission — continuing (email is primary channel)",
      formType,
      error: error?.message,
    });
    return null;
  }
};

/**
 * Update the delivery audit for a previously recorded submission. No-op when
 * id is null (storage unconfigured/failed at insert time).
 */
export const markSubmissionDelivered = async (id, { delivered, error = null } = {}) => {
  if (id == null || !isSubmissionStoreConfigured()) {
    return;
  }

  try {
    await query(
      `UPDATE form_submissions
         SET email_delivered = $2, email_error = $3
       WHERE id = $1`,
      [id, Boolean(delivered), error ? String(error).slice(0, 500) : null],
    );
  } catch (updateError) {
    serverLogger.warn({
      message: "[form-store] failed to update delivery audit",
      id: String(id),
      error: updateError?.message,
    });
  }
};
