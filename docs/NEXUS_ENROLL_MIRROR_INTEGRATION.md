# Nexus to Enroll Mirror Integration

## Overview

URM Enroll now synchronizes course and university data from URM Nexus using server-to-server sync.

Production domains:
- Enroll: https://enrollurm.com
- Nexus: https://urmnexus.com

Non-negotiable runtime rule:
- No browser-to-Nexus communication.
- No request-path page rendering that calls Nexus live.

## Architecture (Text Diagram)

Nexus Integration API
-> Enroll internal sync trigger POST /api/internal/sync (secret-protected)
-> Sync orchestrator (deterministic order: universities then courses)
-> Nexus client with timeout + retries + pagination + incremental updated_since
-> Transactional upserts to Postgres mirror tables
-> sync_state update on successful entity completion only
-> Enroll catalog APIs (/api/catalog/universities, /api/catalog/courses)
-> Frontend preboot mirror cache load
-> Existing UI pages consume local mirror-first dataset

## Database Schema

Migration file:
- db/migrations/001_nexus_mirror.sql

Tables:
- universities_mirror
- courses_mirror
- sync_state
- schema_migrations

Requirements implemented:
- source_id primary keys for idempotent upsert
- source_updated_at + synced_at + is_deleted
- created_at + updated_at
- updated_at trigger function set_updated_at_timestamp
- indexes for source_updated_at and frequent query filters

## Environment Setup

Required:
- DATABASE_URL
- NEXUS_BASE_URL
- NEXUS_INTEGRATION_API_KEY
- ENROLL_SYNC_WORKER_SECRET

Optional:
- ENROLL_SYNC_PAGE_LIMIT
- ENROLL_SYNC_MAX_RETRIES
- ENROLL_SYNC_TIMEOUT_MS
- VITE_ENABLE_MIRROR_CATALOG (default true)
- VITE_ENABLE_MIRROR_FALLBACK (default false)

## Migration Steps

1. npm run sync:env:check
2. npm run db:migrate
3. npm run sync:dry-run
4. npm run sync:backfill
5. npm run sync:status

## Internal Sync Endpoint

Endpoint:
- POST /api/internal/sync

Auth:
- x-enroll-sync-secret header must match ENROLL_SYNC_WORKER_SECRET

Query options:
- dryRun=true|false
- fullBackfill=true|false

Responses:
- 200 success
- 409 sync already active
- 401 unauthorized
- 500 sync failure

## Concurrency Protection

Implementation:
- PostgreSQL advisory lock hash on enroll_nexus_sync_worker
- overlapping runs return conflict status and no-op

## Observability

Structured logs include:
- request_id
- sync_run_id
- entity_name
- page
- retries
- latency_ms
- upsert_count
- error_code

Metrics hooks emitted as structured log events:
- sync_duration_ms
- sync_success_total
- sync_failure_total
- sync_records_total
- sync_retry_total
- sync_lag_seconds

## Runtime Validation Commands

- npm run sync:env:check
- npm run sync:dry-run
- npm run sync:backfill
- npm run sync:parity
- npm run sync:status

## Cron Setup

Use an external scheduler that can set the x-enroll-sync-secret header.

Example cadence:
- Every 15 minutes incremental sync
- Daily off-peak backfill (optional)

## Incident Handling

If sync fails:
1. Check sync status with npm run sync:status
2. Inspect logs for error_code and status
3. If repeated 401, rotate and verify NEXUS_INTEGRATION_API_KEY
4. If repeated 429, reduce ENROLL_SYNC_PAGE_LIMIT and schedule frequency
5. Re-run npm run sync:dry-run and then npm run sync:backfill when stable

## Rollback Instructions

Rollback path:
1. Set VITE_ENABLE_MIRROR_FALLBACK=true
2. Redeploy frontend
3. Keep sync endpoint disabled by rotating ENROLL_SYNC_WORKER_SECRET if needed
4. Mirror tables remain intact for recovery and replay

## Cutover Checklist

- DATABASE_URL configured in production
- Required sync env vars configured
- Migration applied
- Dry-run successful
- Backfill successful
- Catalog endpoints return data
- Frontend preboot loads mirror cache
- Fallback flag remains false in normal mode
- Monitoring and alert routing validated
