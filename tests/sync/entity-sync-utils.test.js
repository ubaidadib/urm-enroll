import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveUpdatedSince,
  dedupeBySourceId,
  buildSyncStateOnSuccess,
  buildSyncStateOnFailure,
} from "../../lib/nexus-sync/entity-sync-service.js";

test("incremental updated_since is derived from sync state", () => {
  const state = { last_synced_at: "2026-05-20T00:00:00.000Z" };
  const updatedSince = resolveUpdatedSince(state, false);
  assert.equal(updatedSince, "2026-05-20T00:00:00.000Z");
});

test("full backfill disables updated_since", () => {
  const state = { last_synced_at: "2026-05-20T00:00:00.000Z" };
  const updatedSince = resolveUpdatedSince(state, true);
  assert.equal(updatedSince, null);
});

test("idempotent reruns dedupe records by source_id", () => {
  const deduped = dedupeBySourceId([
    { source_id: "a", value: 1 },
    { source_id: "a", value: 2 },
    { source_id: "b", value: 3 },
  ]);

  assert.equal(deduped.length, 2);
  assert.deepEqual(
    deduped.find((row) => row.source_id === "a"),
    { source_id: "a", value: 2 },
  );
});

test("sync state payloads are correct for success and failure", () => {
  const success = buildSyncStateOnSuccess("2026-05-21T00:00:00.000Z");
  const failure = buildSyncStateOnFailure("boom");

  assert.equal(success.lastError, null);
  assert.equal(success.lastSyncedAt, "2026-05-21T00:00:00.000Z");
  assert.equal(failure.lastSuccessAt, undefined);
  assert.equal(failure.lastSyncedAt, undefined);
  assert.equal(failure.lastError, "boom");
});
