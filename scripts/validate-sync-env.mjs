import { loadLocalEnvFiles } from "./load-env.mjs";
import { getSyncConfig } from "../lib/nexus-sync/env.js";

loadLocalEnvFiles();

try {
  const config = getSyncConfig();
  console.log("SYNC_ENV_OK");
  console.log(JSON.stringify({
    nexusBaseUrl: config.nexusBaseUrl,
    pageLimit: config.pageLimit,
    maxRetries: config.maxRetries,
    timeoutMs: config.timeoutMs,
  }, null, 2));
  process.exit(0);
} catch (error) {
  console.error("SYNC_ENV_INVALID");
  console.error(error.message);
  process.exit(1);
}
