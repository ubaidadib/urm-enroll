import pg from 'pg';
import { loadLocalEnvFiles } from './load-env.mjs';

const { Pool } = pg;

loadLocalEnvFiles();

const enrollBaseUrl = String(process.env.ENROLL_BASE_URL || 'http://localhost:5174').replace(/\/+$/, '');
const workerSecret = String(process.env.ENROLL_SYNC_WORKER_SECRET || '');
const databaseUrl = String(process.env.DATABASE_URL || '');

if (!workerSecret || !databaseUrl) {
  console.log(JSON.stringify({
    check: 'integration:sync:run',
    ok: false,
    error: 'Missing ENROLL_SYNC_WORKER_SECRET or DATABASE_URL',
  }, null, 2));
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

const countRows = async () => {
  const universities = await pool.query('SELECT COUNT(*)::int AS c FROM universities_mirror');
  const courses = await pool.query('SELECT COUNT(*)::int AS c FROM courses_mirror');
  return {
    universities: universities.rows[0].c,
    courses: courses.rows[0].c,
  };
};

const trigger = async ({ fullBackfill, dryRun = false }) => {
  const url = new URL('/api/internal/sync', enrollBaseUrl);
  if (fullBackfill) {
    url.searchParams.set('fullBackfill', 'true');
  }
  if (dryRun) {
    url.searchParams.set('dryRun', 'true');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'x-enroll-sync-secret': workerSecret,
      'x-request-id': `integration-sync-${Date.now()}`,
    },
  });

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 300) };
  }

  return {
    status: response.status,
    body,
  };
};

try {
  const before = await countRows();
  const fullNeeded = before.universities === 0 || before.courses === 0;

  const fullResult = fullNeeded ? await trigger({ fullBackfill: true }) : null;
  const incrementalResult = await trigger({ fullBackfill: false, dryRun: false });

  const after = await countRows();

  const ok = incrementalResult.status === 200
    && (fullResult ? fullResult.status === 200 : true)
    && after.universities > 0
    && after.courses > 0;

  const payload = {
    check: 'integration:sync:run',
    ok,
    enrollBaseUrl,
    fullNeeded,
    before,
    fullResult,
    incrementalResult,
    after,
  };

  console.log(JSON.stringify(payload, null, 2));
  process.exit(ok ? 0 : 1);
} catch (error) {
  console.log(JSON.stringify({
    check: 'integration:sync:run',
    ok: false,
    error: error?.message || 'Unknown error',
  }, null, 2));
  process.exit(1);
} finally {
  await pool.end();
}
