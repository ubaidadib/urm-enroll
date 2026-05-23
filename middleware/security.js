import { z } from "zod";

import { handleApiError } from "./errorHandler.js";

const apiRateBuckets = new Map();

const envSchema = z.object({
  URM_ALLOWED_ORIGINS: z.string().optional(),
  VITE_PUBLIC_SITE_URL: z.string().optional(),
  SECURITY_ALLOWED_REDIRECTS: z.string().optional(),
});

const parseList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeOrigin = (origin) => {
  try {
    return new URL(origin).origin;
  } catch {
    return "";
  }
};

const getAllowedOrigins = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    return [];
  }

  const values = [
    ...parseList(parsed.data.URM_ALLOWED_ORIGINS),
    ...parseList(parsed.data.VITE_PUBLIC_SITE_URL),
  ];

  return [...new Set(values.map((origin) => normalizeOrigin(origin)).filter(Boolean))];
};

const getAllowedRedirects = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    return [];
  }

  return [...new Set(parseList(parsed.data.SECURITY_ALLOWED_REDIRECTS).map(normalizeOrigin).filter(Boolean))];
};

const IP_V4_RE = /(\d{1,3}\.){3}\d{1,3}/;
const IP_V6_RE = /^[0-9a-f:]+$/i;

const isValidIp = (ip) => IP_V4_RE.test(ip) || IP_V6_RE.test(ip);

const getClientIp = (request) => {
  // Prefer Vercel's injected trusted header, then x-real-ip, then take only the
  // rightmost (last-hop) value from x-forwarded-for to resist spoofing.
  const vercelIp = String(request.headers["x-vercel-forwarded-for"] || "").trim();
  if (vercelIp && isValidIp(vercelIp)) return vercelIp;

  const realIp = String(request.headers["x-real-ip"] || "").trim();
  if (realIp && isValidIp(realIp)) return realIp;

  // Take the LAST entry from x-forwarded-for (set by the closest trusted proxy)
  // to avoid client-supplied spoofed values in the first position.
  const forwarded = String(request.headers["x-forwarded-for"] || "");
  const entries = forwarded.split(",").map((e) => e.trim()).filter(Boolean);
  if (entries.length > 0) {
    const candidate = entries[entries.length - 1];
    if (isValidIp(candidate)) return candidate;
  }

  return request.socket?.remoteAddress || "unknown";
};

const isBot = (userAgent = "") => /bot|crawler|spider|curl|wget|python-requests/i.test(userAgent);

const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "media-src 'self'",
    "frame-src 'none'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
  ].join("; "),
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
};

const setHeaderIfMissing = (response, key, value) => {
  if (!response.getHeader(key)) {
    response.setHeader(key, value);
  }
};

export const applySecurityHeaders = (response) => {
  Object.entries(securityHeaders).forEach(([key, value]) => setHeaderIfMissing(response, key, value));

  response.removeHeader("x-powered-by");
  response.removeHeader("server");
  response.removeHeader("x-aspnet-version");
};

export const checkRequestSize = (request, maxBodyBytes = 10 * 1024) => {
  const contentLength = Number(request.headers["content-length"] || 0);

  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return false;
  }

  return true;
};

export const enforceCors = (request, response) => {
  const origin = normalizeOrigin(request.headers.origin || "");
  const allowedOrigins = getAllowedOrigins();
  const isProduction = process.env.NODE_ENV === "production";

  // Fail-closed: in production, if no allowlist is configured, deny cross-origin requests
  if (origin && allowedOrigins.length === 0 && isProduction) {
    response.status(403).json({ error: "CORS not configured" });
    return false;
  }

  if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    response.status(403).json({ error: "CORS policy violation" });
    return false;
  }

  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,X-Requested-With,X-URM-CSRF,X-URM-Client",
  );
  response.setHeader("Access-Control-Max-Age", "86400");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return false;
  }

  return true;
};

export const enforceRateLimit = (
  request,
  response,
  { key = "default", windowMs = 15 * 60 * 1000, max = 100 } = {},
) => {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const record = apiRateBuckets.get(bucketKey) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  apiRateBuckets.set(bucketKey, record);

  const retrySeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  response.setHeader("X-RateLimit-Limit", String(max));
  response.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - record.count)));
  response.setHeader("X-RateLimit-Reset", String(Math.ceil(record.resetAt / 1000)));

  if (record.count > max) {
    response.setHeader("Retry-After", String(retrySeconds));
    response.status(429).json({ error: "Too many attempts, please try again later." });
    return false;
  }

  return true;
};

export const enforceCsrf = (request, response) => {
  const headerToken = String(request.headers["x-urm-csrf"] || "");
  const bodyToken = String(request.body?.csrfToken || "");
  const tokenPattern = /^[a-f0-9]{32,128}$/i;

  if (!headerToken || !bodyToken || headerToken !== bodyToken || !tokenPattern.test(headerToken)) {
    response.status(403).json({ error: "Invalid CSRF token" });
    return false;
  }

  return true;
};

export const validateRedirectTarget = (targetUrl) => {
  const allowed = getAllowedRedirects();
  const normalized = normalizeOrigin(targetUrl);

  if (!normalized || allowed.length === 0) {
    return false;
  }

  return allowed.includes(normalized);
};

export const withSecurity = (handler, options = {}) => {
  const {
    methods = ["POST"],
    requireJson = true,
    requireCsrf = false,
    requireOrigin = true,
    blockBots = true,
    maxBodyBytes = 10 * 1024,
    rateLimit = { key: "api", windowMs: 15 * 60 * 1000, max: 100 },
  } = options;

  return async (request, response) => {
    try {
      applySecurityHeaders(response);

      if (!methods.includes(request.method)) {
        response.status(405).json({ error: "Method not allowed" });
        return;
      }

      if (!enforceCors(request, response)) {
        return;
      }

      if (requireOrigin && !request.headers.origin && process.env.NODE_ENV === "production") {
        response.status(403).json({ error: "Missing origin" });
        return;
      }

      if (!checkRequestSize(request, maxBodyBytes)) {
        response.status(413).json({ error: "Payload too large" });
        return;
      }

      if (blockBots && isBot(request.headers["user-agent"] || "")) {
        response.status(403).json({ error: "Automated requests are blocked" });
        return;
      }

      if (!enforceRateLimit(request, response, rateLimit)) {
        return;
      }

      if (requireJson && request.method !== "GET") {
        const contentType = String(request.headers["content-type"] || "");

        if (!contentType.includes("application/json")) {
          response.status(415).json({ error: "Unsupported media type" });
          return;
        }
      }

      if (requireCsrf && !enforceCsrf(request, response)) {
        return;
      }

      await handler(request, response);
    } catch (error) {
      handleApiError(error, request, response);
    }
  };
};
