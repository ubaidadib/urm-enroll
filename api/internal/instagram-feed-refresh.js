import crypto from "node:crypto";

import { withSecurity } from "../../middleware/security.js";
import { refreshInstagramFeed } from "../../lib/instagram-feed.js";

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

  try {
    const result = await refreshInstagramFeed({ limit: 18 });
    response.status(200).json({ success: true, data: result.data, meta: result.meta });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json({ error: "Instagram feed refresh failed", message });
  }
}

export default withSecurity(handler, {
  methods: ["GET", "POST"],
  requireJson: false,
  requireCsrf: false,
  requireOrigin: false,
  blockBots: false,
  maxBodyBytes: 1024,
  rateLimit: { key: "internal-instagram-feed-refresh", windowMs: 60 * 1000, max: 12 },
});