import { query } from "./db.js";

async function upsertUniversityRecord(record, syncedAt, client) {
  await query(
    `INSERT INTO universities_mirror(
      source_id, slug, name, city, country, country_code, type,
      logo, cover_photo, programs_count, languages, established, ranking,
      description, website, payload_json, source_updated_at, synced_at, is_deleted
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11::jsonb, $12, $13,
      $14, $15, $16::jsonb, $17, $18, $19
    )
    ON CONFLICT (source_id)
    DO UPDATE SET
      slug = EXCLUDED.slug,
      name = EXCLUDED.name,
      city = EXCLUDED.city,
      country = EXCLUDED.country,
      country_code = EXCLUDED.country_code,
      type = EXCLUDED.type,
      logo = EXCLUDED.logo,
      cover_photo = EXCLUDED.cover_photo,
      programs_count = EXCLUDED.programs_count,
      languages = EXCLUDED.languages,
      established = EXCLUDED.established,
      ranking = EXCLUDED.ranking,
      description = EXCLUDED.description,
      website = EXCLUDED.website,
      payload_json = EXCLUDED.payload_json,
      source_updated_at = EXCLUDED.source_updated_at,
      synced_at = EXCLUDED.synced_at,
      is_deleted = EXCLUDED.is_deleted,
      updated_at = NOW()`,
    [
      record.source_id,
      record.slug,
      record.name,
      record.city,
      record.country,
      record.country_code,
      record.type,
      record.logo,
      record.cover_photo,
      record.programs_count,
      JSON.stringify(record.languages || []),
      record.established,
      record.ranking,
      record.description,
      record.website,
      JSON.stringify(record.payload_json || {}),
      record.source_updated_at,
      syncedAt,
      record.is_deleted,
    ],
    client,
  );
}

async function upsertCourseRecord(record, syncedAt, client) {
  await query(
    `INSERT INTO courses_mirror(
      source_id, university_source_id, university_name, title, degree_level,
      field, duration, language, tuition_amount, tuition_currency, description,
      payload_json, source_updated_at, synced_at, is_deleted
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11,
      $12::jsonb, $13, $14, $15
    )
    ON CONFLICT (source_id)
    DO UPDATE SET
      university_source_id = EXCLUDED.university_source_id,
      university_name = EXCLUDED.university_name,
      title = EXCLUDED.title,
      degree_level = EXCLUDED.degree_level,
      field = EXCLUDED.field,
      duration = EXCLUDED.duration,
      language = EXCLUDED.language,
      tuition_amount = EXCLUDED.tuition_amount,
      tuition_currency = EXCLUDED.tuition_currency,
      description = EXCLUDED.description,
      payload_json = EXCLUDED.payload_json,
      source_updated_at = EXCLUDED.source_updated_at,
      synced_at = EXCLUDED.synced_at,
      is_deleted = EXCLUDED.is_deleted,
      updated_at = NOW()`,
    [
      record.source_id,
      record.university_source_id,
      record.university_name,
      record.title,
      record.degree_level,
      record.field,
      record.duration,
      record.language,
      record.tuition_amount,
      record.tuition_currency,
      record.description,
      JSON.stringify(record.payload_json || {}),
      record.source_updated_at,
      syncedAt,
      record.is_deleted,
    ],
    client,
  );
}

export async function upsertUniversities(records, syncedAt, client) {
  for (const record of records) {
    await upsertUniversityRecord(record, syncedAt, client);
  }
}

export async function upsertCourses(records, syncedAt, client) {
  for (const record of records) {
    await upsertCourseRecord(record, syncedAt, client);
  }
}

export async function listUniversities(filters = {}) {
  const { search = "", country = "", type = "", page = 1, pageSize = 50 } = filters;

  const values = [];
  const where = ["is_deleted = FALSE"];

  if (search) {
    values.push(`%${search}%`);
    where.push(`(name ILIKE $${values.length} OR city ILIKE $${values.length} OR country ILIKE $${values.length})`);
  }

  if (country) {
    values.push(country);
    where.push(`country_code = $${values.length}`);
  }

  if (type) {
    values.push(type);
    where.push(`type = $${values.length}`);
  }

  values.push(pageSize);
  values.push((page - 1) * pageSize);

  const result = await query(
    `SELECT source_id, name, city, country, country_code, type, logo, cover_photo,
            programs_count, languages, established, ranking, description, website,
            payload_json, source_updated_at, synced_at
     FROM universities_mirror
     WHERE ${where.join(" AND ")}
     ORDER BY ranking NULLS LAST, name ASC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  const countValues = values.slice(0, values.length - 2);
  const countResult = await query(
    `SELECT COUNT(*)::INT AS total FROM universities_mirror WHERE ${where.join(" AND ")}`,
    countValues,
  );

  return {
    rows: result.rows,
    total: countResult.rows[0]?.total || 0,
    page,
    pageSize,
  };
}

export async function listCourses(filters = {}) {
  const { search = "", universitySourceId = "", degreeLevel = "", field = "", page = 1, pageSize = 100 } = filters;

  const values = [];
  const where = ["is_deleted = FALSE"];

  if (search) {
    values.push(`%${search}%`);
    where.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  if (universitySourceId) {
    values.push(universitySourceId);
    where.push(`university_source_id = $${values.length}`);
  }

  if (degreeLevel) {
    values.push(degreeLevel);
    where.push(`degree_level = $${values.length}`);
  }

  if (field) {
    values.push(field);
    where.push(`field = $${values.length}`);
  }

  values.push(pageSize);
  values.push((page - 1) * pageSize);

  const result = await query(
    `SELECT source_id, university_source_id, university_name, title, degree_level,
            field, duration, language, tuition_amount, tuition_currency,
            description, payload_json, source_updated_at, synced_at
     FROM courses_mirror
     WHERE ${where.join(" AND ")}
     ORDER BY title ASC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  );

  const countValues = values.slice(0, values.length - 2);
  const countResult = await query(
    `SELECT COUNT(*)::INT AS total FROM courses_mirror WHERE ${where.join(" AND ")}`,
    countValues,
  );

  return {
    rows: result.rows,
    total: countResult.rows[0]?.total || 0,
    page,
    pageSize,
  };
}

export async function getSyncStateView() {
  const result = await query(
    `SELECT entity_name, last_synced_at, last_success_at, last_error, updated_at
     FROM sync_state
     ORDER BY entity_name ASC`,
  );
  return result.rows;
}
