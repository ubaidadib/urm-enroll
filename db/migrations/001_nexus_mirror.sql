CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS universities_mirror (
  source_id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  country_code TEXT,
  type TEXT,
  logo TEXT,
  cover_photo TEXT,
  programs_count INTEGER NOT NULL DEFAULT 0,
  languages JSONB NOT NULL DEFAULT '[]'::jsonb,
  established INTEGER,
  ranking INTEGER,
  description TEXT,
  website TEXT,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses_mirror (
  source_id TEXT PRIMARY KEY,
  university_source_id TEXT,
  university_name TEXT,
  title TEXT NOT NULL,
  degree_level TEXT,
  field TEXT,
  duration TEXT,
  language TEXT,
  tuition_amount NUMERIC,
  tuition_currency TEXT,
  description TEXT,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_state (
  entity_name TEXT PRIMARY KEY,
  last_synced_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_error TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_universities_source_updated_at
  ON universities_mirror (source_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_universities_country_type
  ON universities_mirror (country_code, type)
  WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_universities_is_deleted
  ON universities_mirror (is_deleted);

CREATE INDEX IF NOT EXISTS idx_courses_source_updated_at
  ON courses_mirror (source_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_university
  ON courses_mirror (university_source_id)
  WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_courses_degree_field
  ON courses_mirror (degree_level, field)
  WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_courses_is_deleted
  ON courses_mirror (is_deleted);

CREATE INDEX IF NOT EXISTS idx_sync_state_last_success
  ON sync_state (last_success_at DESC);

DROP TRIGGER IF EXISTS trg_universities_mirror_updated_at ON universities_mirror;
CREATE TRIGGER trg_universities_mirror_updated_at
BEFORE UPDATE ON universities_mirror
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_courses_mirror_updated_at ON courses_mirror;
CREATE TRIGGER trg_courses_mirror_updated_at
BEFORE UPDATE ON courses_mirror
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_sync_state_updated_at ON sync_state;
CREATE TRIGGER trg_sync_state_updated_at
BEFORE UPDATE ON sync_state
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
