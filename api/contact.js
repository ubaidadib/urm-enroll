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

const payloadSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  topic: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(180),
  message: z.string().trim().min(5).max(3000),
  turnstileToken: z.string().trim().min(1),
  csrfToken: z.string().min(16).max(128),
});

const getClientIp = (request) =>
  (request.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  request.socket?.remoteAddress ||
  "";

const sanitize = (text) =>
  sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });

const buildTransporter = () => {
  validateEnvOnce(
    "api-contact",
    ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CONTACT_EMAIL"],
    "api/contact",
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

async function handler(req, res) {
  const parsed = payloadSchema.safeParse(req.body || {});

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { fullName, email, phone, topic, subject, message, turnstileToken } = parsed.data;

  const turnstileOk = await verifyTurnstileToken({
    token: turnstileToken,
    remoteIp: getClientIp(req),
  });

  if (!turnstileOk) {
    return res.status(400).json({ error: "Invalid Turnstile token" });
  }

  const emailLimit = await checkEmailSubmissionLimit(email, { max: 3, windowMs: 24 * 60 * 60 * 1000 });
  if (!emailLimit.allowed) {
    return res.status(429).json({ error: "Email submission limit reached for the last 24 hours" });
  }

  const safeFullName = sanitize(fullName);
  const safeEmail = sanitize(email);
  const safePhone = sanitize(phone || "");
  const safeTopic = sanitize(topic || "");
  const safeSubject = sanitize(subject);
  const safeMessage = sanitize(message);

  const transporter = buildTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: `[Contact Form] ${safeSubject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeFullName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ""}
      ${safeTopic ? `<p><strong>Topic:</strong> ${safeTopic}</p>` : ""}
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <pre>${safeMessage}</pre>
    `,
    replyTo: safeEmail,
  };

  const confirmationMailOptions = {
    from: process.env.SMTP_FROM,
    to: safeEmail,
    subject: "We received your message - URM Enroll",
    html: `
      <p>Hi ${safeFullName},</p>
      <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your inquiry subject:</strong> ${safeSubject}</p>
      <hr />
      <p>Best regards,<br />
      The URM Enroll Team</p>
    `,
  };

  try {
    await Promise.all([transporter.sendMail(mailOptions), transporter.sendMail(confirmationMailOptions)]);
    await recordSuccessfulEmailSubmission(email, { windowMs: 24 * 60 * 60 * 1000 });
    return res.status(200).json({ success: true });
  } catch (error) {
    logError(error, req, { endpoint: "api/contact" });
    return res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
}

export default withSecurity(handler, {
  methods: ["POST"],
  requireJson: true,
  requireCsrf: true,
  requireOrigin: true,
  blockBots: true,
  maxBodyBytes: 10 * 1024,
  rateLimit: { key: "contact", windowMs: 15 * 60 * 1000, max: 10 },
});
