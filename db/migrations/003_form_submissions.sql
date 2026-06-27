-- Durable storage + delivery audit for inbound form submissions (lead, contact,
-- partner, application). Previously submissions were email-only, so a dropped
-- SMTP send was silently lost. This table is the durable system of record;
-- email remains the primary notification channel.
--
-- GDPR note: this stores submitter-provided PII (name, email) under the
-- legitimate-interest/consent basis of the enquiry. IP is stored hashed only.
-- A retention policy (e.g. purge rows older than N months) should be applied
-- via a scheduled job — see created_at index below.

CREATE TABLE IF NOT EXISTS form_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  form_type TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  destination TEXT,
  language TEXT,
  source TEXT,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  email_delivered BOOLEAN NOT NULL DEFAULT FALSE,
  email_error TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions (form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions (email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_undelivered
  ON form_submissions (created_at)
  WHERE email_delivered = FALSE;

DROP TRIGGER IF EXISTS trg_form_submissions_updated_at ON form_submissions;
CREATE TRIGGER trg_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at_timestamp();
