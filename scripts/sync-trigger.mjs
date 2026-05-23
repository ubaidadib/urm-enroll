import { loadLocalEnvFiles } from "./load-env.mjs";
import { validateEnv } from "../config/env.validation.js";

loadLocalEnvFiles();

validateEnv(["ENROLL_SYNC_WORKER_SECRET"], "sync-trigger");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const fullBackfill = args.has("--full-backfill");
const enrollBaseUrl = String(process.env.ENROLL_BASE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");
const workerSecret = String(process.env.ENROLL_SYNC_WORKER_SECRET || "");

const url = new URL("/api/internal/sync", enrollBaseUrl);
if (dryRun) {
  url.searchParams.set("dryRun", "true");
}
if (fullBackfill) {
  url.searchParams.set("fullBackfill", "true");
}

const response = await fetch(url, {
  method: "POST",
  headers: {
    Accept: "application/json",
    "x-enroll-sync-secret": workerSecret,
    "x-request-id": `sync-trigger-${Date.now()}`,
  },
});

const bodyText = await response.text();
let payload;

try {
  payload = bodyText ? JSON.parse(bodyText) : {};
} catch {
  payload = { raw: bodyText };
}

if (!response.ok) {
  console.error("SYNC_TRIGGER_FAILED");
  console.error(JSON.stringify({ status: response.status, payload }, null, 2));
  process.exit(1);
}

console.log("SYNC_TRIGGER_OK");
console.log(JSON.stringify(payload, null, 2));
