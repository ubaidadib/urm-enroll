import crypto from "node:crypto";

import { withSecurity } from "../../middleware/security.js";
import { runMirrorSync } from "../../lib/nexus-sync/sync-orchestrator.js";
import { getSyncConfig } from "../../lib/nexus-sync/env.js";
import { refreshInstagramFeed } from "../../lib/instagram-feed.js";
import { isCronAuthorized, isSyncRequestAuthorized } from "../../lib/api-auth.js";

// Internal/privileged operations, consolidated behind one Serverless Function
// via the dynamic [action] segment:
//   POST /api/internal/sync                    (manual trigger — worker secret)
//   GET|POST /api/internal/sync-cron           (Vercel Cron — bearer secret)
//   GET|POST /api/internal/instagram-feed-refresh (Vercel Cron — bearer secret)

async function runSync(request, response) {
  const config = getSyncConfig();
  // Accept either the manual worker-secret header or a cron bearer token.
  const authorized =
    isSyncRequestAuthorized(request, config.workerSecret) || isCronAuthorized(request);

  if (!authorized) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requestId = String(request.headers["x-request-id"] || crypto.randomUUID());
  const syncRunId = crypto.randomUUID();
  const dryRun = String(request.query?.dryRun || "false") === "true";
  const fullBackfill = String(request.query?.fullBackfill || "false") === "true";

  const result = await runMirrorSync({ requestId, syncRunId, dryRun, fullBackfill });

  if (result.status === "conflict") {
    response.status(409).json(result);
    return;
  }
  response.status(result.status === "success" ? 200 : 500).json(result);
}

async function runSyncCron(request, response) {
  if (!isCronAuthorized(request)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const requestId = String(request.headers["x-request-id"] || crypto.randomUUID());
  const result = await runMirrorSync({
    requestId,
    syncRunId: crypto.randomUUID(),
    dryRun: false,
    fullBackfill: false,
  });

  if (result.status === "conflict") {
    response.status(409).json(result);
    return;
  }
  response.status(result.status === "success" ? 200 : 500).json(result);
}

async function runInstagramRefresh(request, response) {
  if (!isCronAuthorized(request)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const result = await refreshInstagramFeed({ limit: 18 });
    response.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json({ error: "Instagram feed refresh failed", message });
  }
}

const ACTIONS = {
  sync: runSync,
  "sync-cron": runSyncCron,
  "instagram-feed-refresh": runInstagramRefresh,
};

async function handler(request, response) {
  const action = String(request.query?.action || "");
  const run = ACTIONS[action];

  if (!run) {
    response.status(404).json({ error: "Unknown internal action" });
    return;
  }

  return run(request, response);
}

export default withSecurity(handler, {
  methods: ["GET", "POST"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "internal", windowMs: 60 * 1000, max: 30 },
});
