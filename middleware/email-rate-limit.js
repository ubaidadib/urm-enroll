import crypto from "node:crypto";

import { serverLogger } from "../lib/pino.js";

const fallbackBuckets = new Map();

const DEFAULT_WINDOW_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_SUBMISSIONS = 3;

const getKvConfig = () => {
  const url = process.env.KV_REST_API_URL || process.env.VERCEL_KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.VERCEL_KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    token,
  };
};

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const hashEmail = (email) => crypto.createHash("sha256").update(email).digest("hex");

const getBucketKey = (email) => `security:email-limit:${hashEmail(email)}`;

const getKvValue = async (kv, key) => {
  const response = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${kv.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV get failed with status ${response.status}`);
  }

  const data = await response.json();
  return Number(data?.result || 0);
};

const incrementKvValue = async (kv, key, windowMs) => {
  const response = await fetch(`${kv.url}/incr/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kv.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV incr failed with status ${response.status}`);
  }

  const data = await response.json();
  const count = Number(data?.result || 0);

  if (count === 1) {
    const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));
    await fetch(`${kv.url}/expire/${encodeURIComponent(key)}/${ttlSeconds}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kv.token}`,
      },
    });
  }

  return count;
};

const checkFallback = (key, max, windowMs) => {
  const now = Date.now();
  const record = fallbackBuckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  fallbackBuckets.set(key, record);

  return {
    allowed: record.count < max,
    count: record.count,
    resetAt: record.resetAt,
  };
};

const incrementFallback = (key, windowMs) => {
  const now = Date.now();
  const record = fallbackBuckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count += 1;
  fallbackBuckets.set(key, record);

  return {
    count: record.count,
    resetAt: record.resetAt,
  };
};

export const checkEmailSubmissionLimit = async (
  email,
  { max = DEFAULT_MAX_SUBMISSIONS, windowMs = DEFAULT_WINDOW_MS } = {},
) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { allowed: true, count: 0, resetAt: null, storage: "none" };
  }

  const key = getBucketKey(normalizedEmail);
  const kv = getKvConfig();

  if (kv) {
    try {
      const count = await getKvValue(kv, key);
      return {
        allowed: count < max,
        count,
        resetAt: null,
        storage: "vercel-kv",
      };
    } catch (error) {
      serverLogger.warn({
        message: "Email rate-limit KV check failed, using in-memory fallback — limits will not persist across serverless instances",
        error,
      });
    }
  }

  if (process.env.NODE_ENV === "production" && !kv) {
    serverLogger.warn({
      message: "[SECURITY] KV store not configured in production — email rate limits use in-memory fallback and will not persist across serverless instances. Set KV_REST_API_URL and KV_REST_API_TOKEN.",
    });
  }

  const fallback = checkFallback(key, max, windowMs);
  return {
    ...fallback,
    storage: "memory",
  };
};

export const recordSuccessfulEmailSubmission = async (
  email,
  { windowMs = DEFAULT_WINDOW_MS } = {},
) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { count: 0, resetAt: null, storage: "none" };
  }

  const key = getBucketKey(normalizedEmail);
  const kv = getKvConfig();

  if (kv) {
    try {
      const count = await incrementKvValue(kv, key, windowMs);
      return {
        count,
        resetAt: null,
        storage: "vercel-kv",
      };
    } catch (error) {
      serverLogger.warn({
        message: "Email rate-limit KV increment failed, using in-memory fallback — limits will not persist across serverless instances",
        error,
      });
    }
  }

  if (process.env.NODE_ENV === "production" && !kv) {
    serverLogger.warn({
      message: "[SECURITY] KV store not configured in production — email rate limits use in-memory fallback and will not persist across serverless instances. Set KV_REST_API_URL and KV_REST_API_TOKEN.",
    });
  }

  const fallback = incrementFallback(key, windowMs);
  return {
    ...fallback,
    storage: "memory",
  };
};
