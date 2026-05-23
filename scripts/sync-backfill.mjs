import { loadLocalEnvFiles } from "./load-env.mjs";
import { runMirrorSync } from "../lib/nexus-sync/sync-orchestrator.js";
import { closePool } from "../lib/nexus-sync/db.js";

loadLocalEnvFiles();

try {
  const summary = await runMirrorSync({ fullBackfill: true });
  console.log("SYNC_BACKFILL_RESULT");
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.status === "success" ? 0 : 1);
} finally {
  await closePool();
}
