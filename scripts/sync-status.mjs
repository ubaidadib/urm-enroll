import { loadLocalEnvFiles } from "./load-env.mjs";
import { getSyncStateView } from "../lib/nexus-sync/mirror-repository.js";
import { closePool } from "../lib/nexus-sync/db.js";

loadLocalEnvFiles();

try {
  const state = await getSyncStateView();
  console.log("SYNC_STATUS");
  console.log(JSON.stringify(state, null, 2));
} finally {
  await closePool();
}
