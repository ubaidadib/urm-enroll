import { z } from "zod";

import { serverLogger } from "../lib/pino.js";
import { withSecurity } from "../middleware/security.js";

// Sink for client-side crash reports (from the React ErrorBoundary). Surfaces
// otherwise-invisible SPA errors in the server log stream, which Vercel/any log
// drain can forward to an alerting backend. CSRF is not required — a crashing
// app should still be able to report — but Origin, rate limiting, and a small
// body cap keep it from being abused.

const payloadSchema = z.object({
  message: z.string().trim().max(500).optional().or(z.literal("")),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  componentStack: z.string().trim().max(4000).optional().or(z.literal("")),
  url: z.string().trim().max(2000).optional().or(z.literal("")),
  userAgent: z.string().trim().max(500).optional().or(z.literal("")),
});

async function handler(request, response) {
  const parsed = payloadSchema.safeParse(request.body || {});
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid payload" });
    return;
  }

  serverLogger.error({
    message: "[client-error] React ErrorBoundary captured a crash",
    clientError: parsed.data,
  });

  response.status(204).end();
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: true,
  requireCsrf: false,
  requireOrigin: true,
  blockBots: false,
  maxBodyBytes: 8 * 1024,
  rateLimit: { key: "client-error", windowMs: 60 * 1000, max: 30 },
});
