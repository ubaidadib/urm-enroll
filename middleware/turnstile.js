import { validateEnvOnce } from "../config/env.validation.js";
import { serverLogger } from "../lib/pino.js";

const TURNSTILE_VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 3000;

export const verifyTurnstileToken = async ({ token, remoteIp }) => {
  if (!token || String(token).trim().length === 0) {
    return false;
  }

  validateEnvOnce("turnstile", ["TURNSTILE_SECRET_KEY"], "turnstile-verification");

  const payload = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: String(token),
    ...(remoteIp ? { remoteip: String(remoteIp) } : {}),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

  try {
    const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      serverLogger.warn({
        message: "Turnstile verification request failed",
        status: response.status,
      });
      return false;
    }

    const result = await response.json();
    return result?.success === true;
  } catch (error) {
    clearTimeout(timeoutId);
    serverLogger.error({
      message: "Turnstile verification error",
      error,
    });
    return false;
  }
};
