import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { validateEnvOnce } from "../config/env.validation.js";
import {
  checkEmailSubmissionLimit,
  recordSuccessfulEmailSubmission,
} from "../middleware/email-rate-limit.js";
import { logError } from "../middleware/errorHandler.js";
import { withSecurity } from "../middleware/security.js";
import { verifyTurnstileToken } from "../middleware/turnstile.js";
import {
  hashIp,
  markSubmissionDelivered,
  recordSubmission,
} from "../lib/form-submission-store.js";

const payloadSchema = z.object({
  fullName: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(254).optional(),
  destination: z.string().trim().min(1).max(120),
  studyLevel: z.string().trim().max(120).optional().or(z.literal("")),
  field: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  timeline: z.string().trim().min(1).max(120),
  matchScore: z.number().min(0).max(100).optional(),
  language: z.string().trim().max(16).optional(),
  turnstileToken: z.string().trim().min(1),
  csrfToken: z.string().min(16).max(128),
});

const getClientIp = (request) =>
  (request.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  request.socket?.remoteAddress ||
  "";

const sanitize = (text) =>
  sanitizeHtml(text ?? "", {
    allowedTags: [],
    allowedAttributes: {},
  });

const buildTransporter = () => {
  validateEnvOnce(
    "api-lead",
    ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CONTACT_EMAIL"],
    "api/lead",
  );

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

async function handler(request, response) {
  const parsed = payloadSchema.safeParse(request.body || {});
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid request payload" });
    return;
  }

  const { email, turnstileToken } = parsed.data;

  const turnstileOk = await verifyTurnstileToken({
    token: turnstileToken,
    remoteIp: getClientIp(request),
  });

  if (!turnstileOk) {
    response.status(400).json({ error: "Invalid Turnstile token" });
    return;
  }

  if (email) {
    const emailLimit = await checkEmailSubmissionLimit(email, {
      max: 3,
      windowMs: 24 * 60 * 60 * 1000,
    });

    if (!emailLimit.allowed) {
      response.status(429).json({ error: "Email submission limit reached for the last 24 hours" });
      return;
    }
  }

  const transporter = buildTransporter();
  const safeName = sanitize(parsed.data.fullName || "N/A");
  const safeEmail = sanitize(parsed.data.email || "");
  const safeDestination = sanitize(parsed.data.destination || "");
  const safeStudyLevel = sanitize(parsed.data.studyLevel || "");
  const safeField = sanitize(parsed.data.field || "");
  const safeBudget = sanitize(parsed.data.budget || "");
  const safeTimeline = sanitize(parsed.data.timeline || "");
  const safeLanguage = sanitize(parsed.data.language || "");
  const safeSource = sanitize(parsed.data.source || "");
  const safeMatchScore = Number.isFinite(parsed.data.matchScore)
    ? String(parsed.data.matchScore)
    : "N/A";

  const subject = `[Lead] ${safeDestination || "Germany"} - ${safeName}`;
  const html = `
    <h2>New Lead Submission</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail || "N/A"}</p>
    <p><strong>Destination:</strong> ${safeDestination}</p>
    <p><strong>Study Level:</strong> ${safeStudyLevel || "N/A"}</p>
    <p><strong>Field:</strong> ${safeField || "N/A"}</p>
    <p><strong>Budget:</strong> ${safeBudget || "N/A"}</p>
    <p><strong>Timeline:</strong> ${safeTimeline}</p>
    <p><strong>Match Score:</strong> ${safeMatchScore}</p>
    <p><strong>Language:</strong> ${safeLanguage || "N/A"}</p>
    <p><strong>Source:</strong> ${safeSource || "N/A"}</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject,
    html,
    replyTo: safeEmail || undefined,
  };

  // Persist first so the lead is durable even if SMTP delivery later fails.
  const submissionId = await recordSubmission({
    formType: "lead",
    email: safeEmail || null,
    fullName: safeName || null,
    destination: safeDestination || null,
    language: safeLanguage || null,
    source: safeSource || null,
    ipHash: hashIp(getClientIp(request)),
    fields: {
      studyLevel: safeStudyLevel,
      field: safeField,
      budget: safeBudget,
      timeline: safeTimeline,
      matchScore: safeMatchScore,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    await markSubmissionDelivered(submissionId, { delivered: true });
    if (email) {
      await recordSuccessfulEmailSubmission(email, { windowMs: 24 * 60 * 60 * 1000 });
    }
    response.status(204).end();
  } catch (error) {
    await markSubmissionDelivered(submissionId, { delivered: false, error: error?.message });
    logError(error, request, { endpoint: "api/lead" });
    // The lead is already persisted; surface failure so the client can retry,
    // but it is not lost.
    response.status(500).json({ error: "Lead delivery failed" });
  }
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: true,
  requireCsrf: true,
  requireOrigin: true,
  blockBots: true,
  maxBodyBytes: 10 * 1024,
  rateLimit: { key: "lead", windowMs: 15 * 60 * 1000, max: 20 },
});
