import test from "node:test";
import assert from "node:assert/strict";

import { isSyncRequestAuthorized } from "../../lib/api-auth.js";

test("sync endpoint auth guard rejects invalid secret", () => {
  const request = { headers: { "x-enroll-sync-secret": "wrong" } };
  assert.equal(isSyncRequestAuthorized(request, "expected"), false);
});

test("sync endpoint auth guard accepts valid secret", () => {
  const request = { headers: { "x-enroll-sync-secret": "expected" } };
  assert.equal(isSyncRequestAuthorized(request, "expected"), true);
});
