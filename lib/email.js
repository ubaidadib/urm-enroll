import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";

import { validateEnvOnce } from "../config/env.validation.js";

// Shared email/transport helpers for the form handlers (Phase 6 dedup — these
// were previously copy-pasted into api/lead.js, api/contact.js and
// api/application.js).

export const SMTP_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "CONTACT_EMAIL",
];

export const getClientIp = (request) =>
  (request.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
  request.socket?.remoteAddress ||
  "";

export const sanitize = (text) =>
  sanitizeHtml(text ?? "", { allowedTags: [], allowedAttributes: {} });

export const hasSmtp = () => SMTP_ENV_KEYS.every((key) => Boolean(process.env[key]?.trim()));

export const buildTransporter = (context = "api/forms") => {
  validateEnvOnce("api-email-transport", SMTP_ENV_KEYS, context);

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
