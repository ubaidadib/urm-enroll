import { validateEnv } from "../../config/env.validation.js";

const toInt = (value, defaultValue) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

export function getSyncConfig({ requireDatabase = true } = {}) {
  const required = ["NEXUS_BASE_URL", "NEXUS_INTEGRATION_API_KEY", "ENROLL_SYNC_WORKER_SECRET"];

  if (requireDatabase) {
    required.push("DATABASE_URL");
  }

  validateEnv(required, "nexus-mirror-sync");

  return {
    nexusBaseUrl: String(process.env.NEXUS_BASE_URL).replace(/\/+$/, ""),
    apiKey: String(process.env.NEXUS_INTEGRATION_API_KEY),
    workerSecret: String(process.env.ENROLL_SYNC_WORKER_SECRET),
    pageLimit: Math.min(Math.max(toInt(process.env.ENROLL_SYNC_PAGE_LIMIT, 100), 1), 500),
    maxRetries: Math.min(Math.max(toInt(process.env.ENROLL_SYNC_MAX_RETRIES, 3), 0), 10),
    timeoutMs: Math.min(Math.max(toInt(process.env.ENROLL_SYNC_TIMEOUT_MS, 10000), 1000), 60000),
  };
}
