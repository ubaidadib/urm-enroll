import { applySecurityHeaders } from "../middleware/security.js";

// Lightweight health/readiness probe for uptime monitors and load balancers.
// Public + GET (no Origin/CSRF/bot checks — uptime checkers use bot-like UAs).
// Reports process liveness plus an optional database connectivity check so a
// monitor can distinguish "app up" from "app up but DB unreachable".

const checkDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    return { configured: false, ok: null };
  }
  try {
    const { query } = await import("../lib/nexus-sync/db.js");
    await query("SELECT 1");
    return { configured: true, ok: true };
  } catch (error) {
    return { configured: true, ok: false, error: error?.message };
  }
};

export default async function handler(request, response) {
  applySecurityHeaders(response);
  // Health must never be cached.
  response.setHeader("Cache-Control", "no-store, max-age=0");

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const database = await checkDatabase();
  const healthy = database.ok !== false; // unreachable DB => unhealthy; unconfigured => still healthy

  response.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || "unknown",
    checks: { database },
  });
}
