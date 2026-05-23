import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { loadLocalEnvFiles } from "./load-env.mjs";
import { validateEnv } from "../config/env.validation.js";
import { withTransaction, query, closePool } from "../lib/nexus-sync/db.js";

loadLocalEnvFiles();

validateEnv(["DATABASE_URL"], "db-migration");

const migrationsDir = join(process.cwd(), "db", "migrations");
const files = readdirSync(migrationsDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("[migrate] no migration files found");
  process.exit(0);
}

try {
  await query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  const existingResult = await query("SELECT version FROM schema_migrations");
  const existing = new Set(existingResult.rows.map((row) => row.version));

  let applied = 0;

  for (const file of files) {
    if (existing.has(file)) {
      continue;
    }

    const sql = readFileSync(join(migrationsDir, file), "utf8");

    await withTransaction(async (client) => {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations(version) VALUES($1)", [file]);
    });

    applied += 1;
    console.log(`[migrate] applied ${file}`);
  }

  console.log(`[migrate] complete. applied=${applied}`);
} finally {
  await closePool();
}
