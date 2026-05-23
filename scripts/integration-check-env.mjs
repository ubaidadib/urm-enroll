import { loadLocalEnvFiles } from './load-env.mjs';

loadLocalEnvFiles();

const required = [
  'NEXUS_BASE_URL',
  'NEXUS_INTEGRATION_API_KEY',
  'ENROLL_SYNC_WORKER_SECRET',
  'DATABASE_URL',
];

const mask = (value) => {
  if (!value) return null;
  const raw = String(value);
  if (raw.length <= 8) return '***';
  return `${raw.slice(0, 4)}...${raw.slice(-4)}`;
};

const missing = required.filter((key) => !process.env[key] || String(process.env[key]).trim().length === 0);

const payload = {
  check: 'integration:check:env',
  ok: missing.length === 0,
  missing,
  env: {
    NEXUS_BASE_URL: process.env.NEXUS_BASE_URL || null,
    NEXUS_INTEGRATION_API_KEY: mask(process.env.NEXUS_INTEGRATION_API_KEY),
    ENROLL_SYNC_WORKER_SECRET: mask(process.env.ENROLL_SYNC_WORKER_SECRET),
    DATABASE_URL: process.env.DATABASE_URL ? '<set>' : null,
  },
};

console.log(JSON.stringify(payload, null, 2));
process.exit(payload.ok ? 0 : 1);
