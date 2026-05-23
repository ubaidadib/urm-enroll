import pg from "pg";

const { Pool } = pg;

let pool;

export function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for mirror sync operations");
  }

  pool = new Pool({
    connectionString,
    max: Number(process.env.ENROLL_DB_POOL_MAX || 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });

  return pool;
}

export async function query(text, params = [], client) {
  if (client) {
    return client.query(text, params);
  }
  return getPool().query(text, params);
}

export async function withTransaction(work) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function withAdvisoryLock(lockName, work) {
  const client = await getPool().connect();
  try {
    const lockResult = await client.query("SELECT pg_try_advisory_lock(hashtext($1)) AS acquired", [lockName]);
    const acquired = Boolean(lockResult.rows[0]?.acquired);

    if (!acquired) {
      return { acquired: false };
    }

    const result = await work(client);
    return { acquired: true, result };
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock(hashtext($1))", [lockName]);
    } catch {
      // Best effort unlock only.
    }
    client.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
