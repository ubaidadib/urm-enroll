import crypto from "node:crypto";
import { serverLogger } from "../pino.js";
import { NexusIntegrationClient } from "./nexus-client.js";
import { getSyncConfig } from "./env.js";
import { runEntitySync, markEntityFailure } from "./entity-sync-service.js";
import { withAdvisoryLock } from "./db.js";
import { emitMetric } from "./metrics.js";
import { ensureSyncStateRows } from "./sync-state-repository.js";

const LOCK_NAME = "enroll_nexus_sync_worker";

export async function runMirrorSync(options = {}) {
  const config = getSyncConfig();
  const requestId = options.requestId || crypto.randomUUID();
  const syncRunId = options.syncRunId || crypto.randomUUID();
  const dryRun = Boolean(options.dryRun);
  const fullBackfill = Boolean(options.fullBackfill);

  const client = new NexusIntegrationClient({
    baseUrl: config.nexusBaseUrl,
    apiKey: config.apiKey,
    timeoutMs: config.timeoutMs,
  });

  const startedAt = new Date();
  const startedMs = Date.now();

  const lockResult = await withAdvisoryLock(LOCK_NAME, async () => {
    await ensureSyncStateRows();

    const summaries = [];
    const errors = [];

    for (const entityName of ["universities", "courses"]) {
      try {
        const summary = await runEntitySync(entityName, {
          client,
          requestId,
          syncRunId,
          pageLimit: config.pageLimit,
          maxRetries: config.maxRetries,
          dryRun,
          fullBackfill,
          logger: serverLogger,
        });
        summaries.push(summary);
      } catch (error) {
        const errorMessage = error?.message || "Unknown sync error";
        errors.push({ entityName, message: errorMessage, statusCode: error?.statusCode || null });
        await markEntityFailure(entityName, errorMessage);
        serverLogger.error({
          event: "sync.entity.failed",
          entity_name: entityName,
          request_id: requestId,
          sync_run_id: syncRunId,
          errors: error?.body || null,
          error_message: errorMessage,
          status_code: error?.statusCode || null,
        });
        emitMetric("sync_failure_total", 1, { entity_name: entityName });
        break;
      }
    }

    const endedAt = new Date();
    const durationMs = Date.now() - startedMs;
    const success = errors.length === 0;

    if (success) {
      for (const summary of summaries) {
        if (summary.updatedSince) {
          const lagSeconds = Math.max(0, Math.floor((Date.now() - Date.parse(summary.updatedSince)) / 1000));
          emitMetric("sync_lag_seconds", lagSeconds, { entity_name: summary.entityName });
        }
      }
      emitMetric("sync_success_total", 1, { sync_run_id: syncRunId });
    }

    return {
      requestId,
      syncRunId,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationMs,
      status: success ? "success" : "failed",
      dryRun,
      fullBackfill,
      entities: summaries,
      errors,
    };
  });

  if (!lockResult.acquired) {
    return {
      requestId,
      syncRunId,
      startedAt: startedAt.toISOString(),
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - startedMs,
      status: "conflict",
      dryRun,
      fullBackfill,
      entities: [],
      errors: [{ code: "SYNC_ALREADY_RUNNING", message: "A sync run is already active" }],
    };
  }

  return lockResult.result;
}
