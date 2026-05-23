import pino from "pino";

const redactPaths = [
  "email",
  "password",
  "token",
  "authorization",
  "cookie",
  "ip",
  "*.email",
  "*.password",
  "*.token",
  "*.authorization",
  "*.cookie",
  "*.ip",
  '*["x-forwarded-for"]',
  "req.headers.authorization",
  "req.headers.cookie",
  'req.headers["x-forwarded-for"]',
  "headers.authorization",
  "headers.cookie",
  'headers["x-forwarded-for"]',
  "context.email",
  "context.token",
  "context.authorization",
  "context.cookie",
  "context.ip",
  'context["x-forwarded-for"]',
];

export const serverLogger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  base: undefined,
  redact: {
    paths: redactPaths,
    censor: "[redacted]",
    remove: false,
  },
});
