import { query } from "./db.js";

const SYNC_ENTITIES = ["universities", "courses"];

export async function getSyncState(entityName, client) {
  const result = await query(
    `SELECT entity_name, last_synced_at, last_success_at, last_error, updated_at
     FROM sync_state
     WHERE entity_name = $1`,
    [entityName],
    client,
  );

  return result.rows[0] || null;
}

export async function ensureSyncStateRows(client) {
  await query(
    `INSERT INTO sync_state(entity_name)
     SELECT UNNEST($1::text[])
     ON CONFLICT (entity_name) DO NOTHING`,
    [SYNC_ENTITIES],
    client,
  );
}

export async function upsertSyncState(entityName, payload, client) {
  const { lastSyncedAt, lastSuccessAt, lastError } = payload;

  await query(
    `INSERT INTO sync_state(entity_name, last_synced_at, last_success_at, last_error)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (entity_name)
     DO UPDATE SET
      last_synced_at = EXCLUDED.last_synced_at,
      last_success_at = EXCLUDED.last_success_at,
      last_error = EXCLUDED.last_error,
      updated_at = NOW()`,
    [entityName, lastSyncedAt, lastSuccessAt, lastError],
    client,
  );
}

export async function markSyncStateFailure(entityName, errorMessage, client) {
  await query(
    `INSERT INTO sync_state(entity_name, last_error)
     VALUES ($1, $2)
     ON CONFLICT (entity_name)
     DO UPDATE SET
      last_error = EXCLUDED.last_error,
      updated_at = NOW()`,
    [entityName, errorMessage],
    client,
  );
}
