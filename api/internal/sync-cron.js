import crypto from "node:crypto";

import { withSecurity } from "../../middleware/security.js";
import { runMirrorSync } from "../../lib/nexus-sync/sync-orchestrator.js";

function timingSafeEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));

  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

function isCronAuthorized(request) {
  const bearer = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const cronSecret = String(process.env.CRON_SECRET || "");
  const workerSecret = String(process.env.ENROLL_SYNC_WORKER_SECRET || "");

  return timingSafeEqual(bearer, cronSecret) || timingSafeEqual(bearer, workerSecret);
}

async function handler(request, response) {
  if (!isCronAuthorized(request)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requestId = String(request.headers["x-request-id"] || crypto.randomUUID());
  const syncRunId = crypto.randomUUID();

  const result = await runMirrorSync({
    requestId,
    syncRunId,
    dryRun: false,
    fullBackfill: false,
  });

  if (result.status === "conflict") {
    response.status(409).json(result);
    return;
  }

  response.status(result.status === "success" ? 200 : 500).json(result);
}

export default withSecurity(handler, {
  methods: ["GET", "POST"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "internal-sync-cron", windowMs: 60 * 1000, max: 30 },
});
