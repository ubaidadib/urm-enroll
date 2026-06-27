import crypto from "node:crypto";

// Shared authentication helpers for internal/privileged API endpoints.
// Consolidated here (Phase 6) so the consolidated route dispatchers don't each
// re-declare the same timing-safe comparison and bearer/secret checks.

export function timingSafeCompare(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));

  // Reject empty or length-mismatched values before timingSafeEqual (which
  // throws on unequal lengths).
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

// Vercel Cron / background worker auth: `Authorization: Bearer <secret>`,
// matched against CRON_SECRET or ENROLL_SYNC_WORKER_SECRET.
export function isCronAuthorized(request) {
  const bearer = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  return (
    timingSafeCompare(bearer, process.env.CRON_SECRET) ||
    timingSafeCompare(bearer, process.env.ENROLL_SYNC_WORKER_SECRET)
  );
}

// Manual sync trigger auth: `x-enroll-sync-secret` header matched against the
// configured worker secret.
export function isSyncRequestAuthorized(request, workerSecret) {
  const secret = String(request.headers["x-enroll-sync-secret"] || "");
  return timingSafeCompare(secret, workerSecret);
}
