import { loadLocalEnvFiles } from "./load-env.mjs";
import { getSyncConfig } from "../lib/nexus-sync/env.js";
import { NexusIntegrationClient } from "../lib/nexus-sync/nexus-client.js";
import { listUniversities, listCourses } from "../lib/nexus-sync/mirror-repository.js";
import { closePool } from "../lib/nexus-sync/db.js";

loadLocalEnvFiles();

const sampleLimit = Math.max(1, Number.parseInt(process.argv[2] || "10", 10));

try {
  const config = getSyncConfig();
  const client = new NexusIntegrationClient({
    baseUrl: config.nexusBaseUrl,
    apiKey: config.apiKey,
    timeoutMs: config.timeoutMs,
  });

  const [nexusUniversities, nexusCourses] = await Promise.all([
    client.fetchEntityPage("universities", { page: 1, limit: sampleLimit }),
    client.fetchEntityPage("courses", { page: 1, limit: sampleLimit }),
  ]);

  const [localUniversities, localCourses] = await Promise.all([
    listUniversities({ page: 1, pageSize: sampleLimit }),
    listCourses({ page: 1, pageSize: sampleLimit }),
  ]);

  const report = {
    sampleLimit,
    universities: {
      nexusCount: nexusUniversities.records.length,
      localCount: localUniversities.rows.length,
      countDelta: localUniversities.rows.length - nexusUniversities.records.length,
    },
    courses: {
      nexusCount: nexusCourses.records.length,
      localCount: localCourses.rows.length,
      countDelta: localCourses.rows.length - nexusCourses.records.length,
    },
  };

  console.log("SYNC_PARITY_REPORT");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await closePool();
}
