import pg from 'pg';
import { loadLocalEnvFiles } from './load-env.mjs';

const { Pool } = pg;

loadLocalEnvFiles();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.log(JSON.stringify({
    check: 'integration:check:mirror',
    ok: false,
    error: 'Missing DATABASE_URL',
  }, null, 2));
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

try {
  const tableResult = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('universities_mirror','courses_mirror','sync_state') ORDER BY table_name",
  );

  const counts = {};
  for (const tableName of ['universities_mirror', 'courses_mirror']) {
    const result = await pool.query(`SELECT COUNT(*)::int AS c FROM ${tableName}`);
    counts[tableName] = result.rows[0].c;
  }

  const state = await pool.query(
    'SELECT entity_name,last_synced_at,last_success_at,last_error,updated_at FROM sync_state ORDER BY entity_name',
  );

  const payload = {
    check: 'integration:check:mirror',
    ok: tableResult.rows.length === 3,
    tables: tableResult.rows.map((row) => row.table_name),
    counts,
    syncState: state.rows,
  };

  console.log(JSON.stringify(payload, null, 2));
  process.exit(payload.ok ? 0 : 1);
} catch (error) {
  console.log(JSON.stringify({
    check: 'integration:check:mirror',
    ok: false,
    error: error?.message || 'Unknown error',
  }, null, 2));
  process.exit(1);
} finally {
  await pool.end();
}
