import { loadLocalEnvFiles } from './load-env.mjs';

loadLocalEnvFiles();

const baseUrl = String(process.env.NEXUS_BASE_URL || '').replace(/\/+$/, '');
const apiKey = String(process.env.NEXUS_INTEGRATION_API_KEY || '');

if (!baseUrl || !apiKey) {
  console.log(JSON.stringify({
    check: 'integration:check:nexus',
    ok: false,
    error: 'Missing NEXUS_BASE_URL or NEXUS_INTEGRATION_API_KEY',
  }, null, 2));
  process.exit(1);
}

const call = async (path, key) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-api-key': key,
      Authorization: `Bearer ${key}`,
    },
  });

  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 200) };
  }

  const data = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body?.items)
      ? body.items
      : [];

  return {
    status: response.status,
    count: data.length,
    sampleIds: data.slice(0, 3).map((item) => item?.id ?? item?.source_id ?? null),
    error: body?.error || null,
  };
};

const courses = await call('/api/integration/v1/courses?page=1&limit=5', apiKey);
const universities = await call('/api/integration/v1/universities?page=1&limit=5', apiKey);
const invalidKey = await call('/api/integration/v1/courses?page=1&limit=1', 'invalid_key_for_check');

const ok = courses.status === 200
  && universities.status === 200
  && courses.count > 0
  && universities.count > 0
  && invalidKey.status === 401;

const payload = {
  check: 'integration:check:nexus',
  ok,
  baseUrl,
  courses,
  universities,
  invalidKey,
};

console.log(JSON.stringify(payload, null, 2));
process.exit(ok ? 0 : 1);
