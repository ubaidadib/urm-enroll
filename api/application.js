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
import {
  hashIp,
  markSubmissionDelivered,
  recordSubmission,
} from "../lib/form-submission-store.js";

/**
 * Application submission endpoint.
 *
 * Accepts the 4-step application form from the program detail page,
 * sends a notification to the admissions team and a confirmation to
 * the applicant.  Turnstile and SMTP are both optional — if the env
 * vars are absent (common in local dev) the submission is logged and
 * acknowledged without attempting to send email.
 */

const payloadSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  lastDegree: z.string().trim().max(200).optional().or(z.literal("")),
  gpa: z.string().trim().max(20).optional().or(z.literal("")),
  graduationYear: z.string().trim().max(10).optional().or(z.literal("")),
  programId: z.string().trim().max(200).optional().or(z.literal("")),
  programName: z.string().trim().max(300).optional().or(z.literal("")),
  universityName: z.string().trim().max(300).optional().or(z.literal("")),
  turnstileToken: z.string().trim().optional().or(z.literal("")),
  csrfToken: z.string().min(16).max(128),
});

const getClientIp = (request) =>
  (request.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  request.socket?.remoteAddress ||
  "";

const sanitize = (text) =>
  sanitizeHtml(text ?? "", { allowedTags: [], allowedAttributes: {} });

const hasTurnstile = () =>
  Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());

const hasSmtp = () =>
  ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CONTACT_EMAIL"].every(
    (key) => Boolean(process.env[key]?.trim()),
  );

const verifyTurnstile = async (token, remoteIp) => {
  if (!hasTurnstile()) return true; // skip in dev/unconfigured environments
  const { verifyTurnstileToken } = await import("../middleware/turnstile.js");
  return verifyTurnstileToken({ token, remoteIp });
};

const buildTransporter = () => {
  validateEnvOnce(
    "api-application-smtp",
    ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CONTACT_EMAIL"],
    "api/application",
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

  const data = parsed.data;

  // Turnstile verification (skipped if TURNSTILE_SECRET_KEY not configured)
  if (data.turnstileToken) {
    const turnstileOk = await verifyTurnstile(data.turnstileToken, getClientIp(request));
    if (!turnstileOk) {
      response.status(400).json({ error: "Invalid Turnstile token" });
      return;
    }
  }

  // Per-email rate limit
  const emailLimit = await checkEmailSubmissionLimit(data.email, {
    max: 5,
    windowMs: 24 * 60 * 60 * 1000,
  });
  if (!emailLimit.allowed) {
    response.status(429).json({ error: "Application submission limit reached for the last 24 hours" });
    return;
  }

  // Safe values
  const safeName       = sanitize(data.fullName);
  const safeEmail      = sanitize(data.email);
  const safePhone      = sanitize(data.phone || "");
  const safeNation     = sanitize(data.nationality || "");
  const safeDegree     = sanitize(data.lastDegree || "");
  const safeGpa        = sanitize(data.gpa || "");
  const safeGradYear   = sanitize(data.graduationYear || "");
  const safeProgramId  = sanitize(data.programId || "");
  const safeProgramName = sanitize(data.programName || "");
  const safeUniName    = sanitize(data.universityName || "");

  // Persist first so the application is durable regardless of the email path.
  const submissionId = await recordSubmission({
    formType: "application",
    email: safeEmail || null,
    fullName: safeName || null,
    source: safeProgramName || null,
    ipHash: hashIp(getClientIp(request)),
    fields: {
      phone: safePhone,
      nationality: safeNation,
      lastDegree: safeDegree,
      gpa: safeGpa,
      graduationYear: safeGradYear,
      programId: safeProgramId,
      programName: safeProgramName,
      universityName: safeUniName,
    },
  });

  // If SMTP is not configured (e.g. local dev) — log and acknowledge without sending
  if (!hasSmtp()) {
    console.info("[api/application] SMTP not configured — application acknowledged without email:", {
      fullName: safeName,
      email: safeEmail,
      programName: safeProgramName,
      universityName: safeUniName,
    });
    await markSubmissionDelivered(submissionId, {
      delivered: false,
      error: "SMTP not configured",
    });
    await recordSuccessfulEmailSubmission(data.email, { windowMs: 24 * 60 * 60 * 1000 });
    response.status(200).json({ success: true, dev: true });
    return;
  }

  const transporter = buildTransporter();

  const notificationHtml = `
    <h2>New Program Application — URM Enroll</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="font-weight:bold;color:#555;padding-right:12px;">Program</td><td>${safeProgramName}</td></tr>
      <tr><td style="font-weight:bold;color:#555;">University</td><td>${safeUniName}</td></tr>
      <tr><td style="font-weight:bold;color:#555;">Program ID</td><td>${safeProgramId}</td></tr>
      <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:8px 0"/></td></tr>
      <tr><td style="font-weight:bold;color:#555;">Full Name</td><td>${safeName}</td></tr>
      <tr><td style="font-weight:bold;color:#555;">Email</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      ${safePhone ? `<tr><td style="font-weight:bold;color:#555;">Phone</td><td>${safePhone}</td></tr>` : ""}
      ${safeNation ? `<tr><td style="font-weight:bold;color:#555;">Nationality</td><td>${safeNation}</td></tr>` : ""}
      <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:8px 0"/></td></tr>
      ${safeDegree ? `<tr><td style="font-weight:bold;color:#555;">Last Degree</td><td>${safeDegree}</td></tr>` : ""}
      ${safeGpa ? `<tr><td style="font-weight:bold;color:#555;">GPA</td><td>${safeGpa}</td></tr>` : ""}
      ${safeGradYear ? `<tr><td style="font-weight:bold;color:#555;">Graduation Year</td><td>${safeGradYear}</td></tr>` : ""}
    </table>
  `;

  const confirmationHtml = `
    <p>Dear ${safeName},</p>
    <p>Thank you for applying to <strong>${safeProgramName}</strong> at <strong>${safeUniName}</strong> through URM Enroll.</p>
    <p>We have received your application and our admissions team will review it and get back to you within <strong>2–5 business days</strong>.</p>
    <p>If you have any questions in the meantime, feel free to reply to this email.</p>
    <br/>
    <p>Best regards,<br/>The URM Enroll Admissions Team</p>
  `;

  try {
    await Promise.all([
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.CONTACT_EMAIL,
        subject: `[Application] ${safeProgramName} — ${safeName}`,
        html: notificationHtml,
        replyTo: safeEmail,
      }),
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: safeEmail,
        subject: `Your application to ${safeProgramName} has been received`,
        html: confirmationHtml,
      }),
    ]);

    await markSubmissionDelivered(submissionId, { delivered: true });
    await recordSuccessfulEmailSubmission(data.email, { windowMs: 24 * 60 * 60 * 1000 });
    response.status(200).json({ success: true });
  } catch (error) {
    await markSubmissionDelivered(submissionId, { delivered: false, error: error?.message });
    logError(error, request, { endpoint: "api/application" });
    response.status(500).json({ error: "Failed to send application. Please try again or contact us directly." });
  }
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: true,
  requireCsrf: true,
  requireOrigin: true,
  blockBots: true,
  maxBodyBytes: 20 * 1024,
  rateLimit: { key: "application", windowMs: 15 * 60 * 1000, max: 10 },
});
