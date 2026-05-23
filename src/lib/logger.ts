import pino from "pino";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = {
  message: string;
  context?: Record<string, unknown>;
};

const isProd = import.meta.env.PROD;

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
  "context.email",
  "context.password",
  "context.token",
  "context.authorization",
  "context.cookie",
  "context.ip",
  'context["x-forwarded-for"]',
];

const clientLogger = pino({
  level: isProd ? "info" : "debug",
  base: undefined,
  browser: {
    asObject: true,
  },
  redact: {
    paths: redactPaths,
    censor: "[redacted]",
    remove: false,
  },
});

export const log = (level: LogLevel, payload: LogPayload) => {
  clientLogger[level](payload);
};

export const logger = {
  debug: (payload: LogPayload) => log("debug", payload),
  info: (payload: LogPayload) => log("info", payload),
  warn: (payload: LogPayload) => log("warn", payload),
  error: (payload: LogPayload) => log("error", payload),
};
