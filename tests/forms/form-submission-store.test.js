import assert from "node:assert/strict";
import { test } from "node:test";

import {
  hashIp,
  isSubmissionStoreConfigured,
  markSubmissionDelivered,
  recordSubmission,
} from "../../lib/form-submission-store.js";

test("hashIp is deterministic, 64-char sha256, and never returns the raw IP", () => {
  const a = hashIp("203.0.113.5");
  const b = hashIp("203.0.113.5");
  assert.equal(a, b);
  assert.equal(a.length, 64);
  assert.notEqual(a, "203.0.113.5");
  assert.equal(hashIp(null), null);
  assert.equal(hashIp(""), null);
});

test("store is inert and safe when DATABASE_URL is unset", async () => {
  const prev = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    assert.equal(isSubmissionStoreConfigured(), false);
    // Must not throw and must signal "not stored" with null so callers continue.
    const id = await recordSubmission({ formType: "lead", email: "a@example.com" });
    assert.equal(id, null);
    // Updating a null id is a no-op, never throws.
    await markSubmissionDelivered(null, { delivered: true });
  } finally {
    if (prev !== undefined) process.env.DATABASE_URL = prev;
  }
});
