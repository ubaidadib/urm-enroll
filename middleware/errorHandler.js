import { serverLogger } from "../lib/pino.js";

const isDev = process.env.NODE_ENV === "development";

const SENSITIVE_KEY_PATTERN = /(authorization|token|secret|password|cookie|api[-_]?key|csrf)/i;

const redact = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        return [key, "[redacted]"];
      }

      return [key, redact(nestedValue)];
    }),
  );
};

export const logError = (error, request, context = {}) => {
  const payload = {
    message: error?.message || "Unknown error",
    status: error?.status || 500,
    method: request?.method,
    url: request?.url,
    timestamp: new Date().toISOString(),
    context: redact(context),
  };

  if (isDev) {
    payload.stack = error?.stack;
  }

  serverLogger.error(payload);
};

export const sendError = (response, status, message, details) => {
  const body = {
    error: message,
    ...(isDev && details ? { details } : {}),
  };

  response.status(status).json(body);
};

export const handleApiError = (error, request, response, publicMessage) => {
  const status = Number.isInteger(error?.status) ? error.status : 500;
  const safeMessage = status >= 500 ? publicMessage || "An unexpected error occurred" : error?.message;

  logError(error, request);
  sendError(response, status, safeMessage || "An unexpected error occurred", error?.message);
};

process.on("unhandledRejection", (reason) => {
  serverLogger.error({
    message: "Unhandled Rejection",
    reason: redact(reason),
    timestamp: new Date().toISOString(),
  });
});

process.on("uncaughtException", (error) => {
  serverLogger.fatal({
    message: "Uncaught Exception",
    error: redact({
      message: error?.message,
      stack: isDev ? error?.stack : undefined,
    }),
    timestamp: new Date().toISOString(),
  });

  process.exit(1);
});
