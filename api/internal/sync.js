import crypto from "node:crypto";

import { withSecurity } from "../../middleware/security.js";
import { runMirrorSync } from "../../lib/nexus-sync/sync-orchestrator.js";
import { getSyncConfig } from "../../lib/nexus-sync/env.js";

export function isSyncRequestAuthorized(request, workerSecret) {
  const secret = String(request.headers["x-enroll-sync-secret"] || "");
  const expected = String(workerSecret || "");

  if (!secret || !expected) {
    return false;
  }

  const providedBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

async function handler(request, response) {
  const config = getSyncConfig();

  if (!isSyncRequestAuthorized(request, config.workerSecret)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requestId = String(request.headers["x-request-id"] || crypto.randomUUID());
  const syncRunId = crypto.randomUUID();
  const dryRun = String(request.query?.dryRun || "false") === "true";
  const fullBackfill = String(request.query?.fullBackfill || "false") === "true";

  const result = await runMirrorSync({
    requestId,
    syncRunId,
    dryRun,
    fullBackfill,
  });

  if (result.status === "conflict") {
    response.status(409).json(result);
    return;
  }

  response.status(result.status === "success" ? 200 : 500).json(result);
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "internal-sync", windowMs: 60 * 1000, max: 10 },
});
