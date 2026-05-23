import { z } from "zod";
import {
  checkEmailSubmissionLimit,
  recordSuccessfulEmailSubmission,
} from "../middleware/email-rate-limit.js";
import { withSecurity } from "../middleware/security.js";
import { verifyTurnstileToken } from "../middleware/turnstile.js";

const payloadSchema = z.object({
  organizationType: z.string().trim().min(1).max(120),
  organizationName: z.string().trim().min(1).max(180),
  contactName: z.string().trim().min(1).max(180),
  contactEmail: z.string().trim().email().max(254),
  roleTitle: z.string().trim().min(1).max(180),
  organizationSize: z.string().trim().min(1).max(120),
  geographicScope: z.string().trim().min(1).max(120),
  partnershipType: z.string().trim().min(1).max(120),
  budgetAuthority: z.string().trim().min(1).max(120),
  candidateVolume: z.string().trim().max(120).optional(),
  complianceTimeline: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(3000).optional(),
  turnstileToken: z.string().trim().min(1),
  csrfToken: z.string().min(16).max(128),
});

const getClientIp = (request) =>
  (request.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  request.socket?.remoteAddress ||
  "";

async function handler(request, response) {
  const parsed = payloadSchema.safeParse(request.body || {});
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid request payload" });
    return;
  }

  const { contactEmail, turnstileToken } = parsed.data;

  const turnstileOk = await verifyTurnstileToken({
    token: turnstileToken,
    remoteIp: getClientIp(request),
  });

  if (!turnstileOk) {
    response.status(400).json({ error: "Invalid Turnstile token" });
    return;
  }

  const emailLimit = await checkEmailSubmissionLimit(contactEmail, {
    max: 3,
    windowMs: 24 * 60 * 60 * 1000,
  });

  if (!emailLimit.allowed) {
    response.status(429).json({ error: "Email submission limit reached for the last 24 hours" });
    return;
  }

  await recordSuccessfulEmailSubmission(contactEmail, { windowMs: 24 * 60 * 60 * 1000 });

  response.status(204).end();
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: true,
  requireCsrf: true,
  requireOrigin: true,
  blockBots: true,
  maxBodyBytes: 10 * 1024,
  rateLimit: { key: "partner", windowMs: 15 * 60 * 1000, max: 20 },
});
