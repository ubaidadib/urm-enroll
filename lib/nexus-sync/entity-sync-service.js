import { withTransaction } from "./db.js";
import { paginate } from "./pagination.js";
import { withRetry } from "./retry.js";
import { mapCourseRecord, mapUniversityRecord } from "./mappers.js";
import { upsertCourses, upsertUniversities } from "./mirror-repository.js";
import { ensureSyncStateRows, getSyncState, markSyncStateFailure, upsertSyncState } from "./sync-state-repository.js";
import { emitMetric } from "./metrics.js";

const mapperByEntity = {
  universities: mapUniversityRecord,
  courses: mapCourseRecord,
};

const upsertByEntity = {
  universities: upsertUniversities,
  courses: upsertCourses,
};

export function resolveUpdatedSince(state, fullBackfill) {
  if (fullBackfill) {
    return null;
  }

  if (!state?.last_synced_at) {
    return null;
  }

  return new Date(state.last_synced_at).toISOString();
}

export function dedupeBySourceId(records) {
  const map = new Map();
  for (const record of records) {
    map.set(record.source_id, record);
  }
  return [...map.values()];
}

export function buildSyncStateOnSuccess(timestamp) {
  return {
    lastSyncedAt: timestamp,
    lastSuccessAt: timestamp,
    lastError: null,
  };
}

export function buildSyncStateOnFailure(errorMessage) {
  return {
    lastSyncedAt: undefined,
    lastSuccessAt: undefined,
    lastError: errorMessage,
  };
}

export async function runEntitySync(entityName, context) {
  const {
    client,
    requestId,
    syncRunId,
    pageLimit,
    maxRetries,
    dryRun = false,
    fullBackfill = false,
    logger,
  } = context;

  const mapper = mapperByEntity[entityName];
  const upsert = upsertByEntity[entityName];

  if (!mapper || !upsert) {
    throw new Error(`Unknown sync entity: ${entityName}`);
  }

  const startedAt = new Date();
  const startedMs = Date.now();
  await ensureSyncStateRows();
  const state = await getSyncState(entityName);
  const updatedSince = resolveUpdatedSince(state, fullBackfill);

  const staged = [];
  let pageCount = 0;
  let retryCount = 0;

  logger.info({
    event: "sync.entity.start",
    entity_name: entityName,
    request_id: requestId,
    sync_run_id: syncRunId,
    updated_since: updatedSince,
  });

  for await (const pageResult of paginate(
    (page) =>
      withRetry(
        async ({ attempt }) => {
          const result = await client.fetchEntityPage(entityName, {
            page,
            limit: pageLimit,
            updatedSince,
            requestId,
            syncRunId,
          });

          logger.info({
            event: "sync.entity.page",
            entity_name: entityName,
            request_id: requestId,
            sync_run_id: syncRunId,
            page,
            retries: attempt,
            latency_ms: result.latencyMs,
            response_status: result.statusCode,
            records_count: result.records.length,
          });

          return result;
        },
        {
          retries: maxRetries,
          shouldRetry: (error) => {
            const code = Number(error?.statusCode || 0);
            return code === 0 || code === 408 || code === 409 || code === 429 || code >= 500;
          },
          onRetry: ({ attempt, delay, error }) => {
            retryCount += 1;
            emitMetric("sync_retry_total", 1, { entity_name: entityName, attempt: String(attempt) });
            logger.warn({
              event: "sync.entity.retry",
              entity_name: entityName,
              request_id: requestId,
              sync_run_id: syncRunId,
              retries: attempt,
              retry_delay_ms: delay,
              error_code: error?.statusCode || "retryable_error",
            });
          },
        },
      ),
  )) {
    pageCount += 1;

    if (pageResult.notModified) {
      break;
    }

    const mapped = pageResult.records.map(mapper).filter(Boolean);
    staged.push(...mapped);
  }

  const syncedAt = new Date().toISOString();
  const deduped = dedupeBySourceId(staged);
  const recordsUpserted = deduped.length;

  if (!dryRun) {
    await withTransaction(async (trx) => {
      if (deduped.length > 0) {
        await upsert(deduped, syncedAt, trx);
      }

      await upsertSyncState(entityName, buildSyncStateOnSuccess(syncedAt), trx);
    });
  }

  const durationMs = Date.now() - startedMs;
  emitMetric("sync_records_total", recordsUpserted, { entity_name: entityName });
  emitMetric("sync_duration_ms", durationMs, { entity_name: entityName });

  logger.info({
    event: "sync.entity.success",
    entity_name: entityName,
    request_id: requestId,
    sync_run_id: syncRunId,
    upsert_count: recordsUpserted,
    page_count: pageCount,
    retries: retryCount,
    duration_ms: durationMs,
  });

  return {
    entityName,
    status: "success",
    startedAt: startedAt.toISOString(),
    endedAt: new Date().toISOString(),
    durationMs,
    pageCount,
    recordsUpserted,
    retries: retryCount,
    updatedSince,
    dryRun,
  };
}

export async function markEntityFailure(entityName, errorMessage) {
  await markSyncStateFailure(entityName, errorMessage);
}
