import test from "node:test";
import assert from "node:assert/strict";

import { withRetry } from "../../lib/nexus-sync/retry.js";

test("retry utility recovers from transient failure", async () => {
  let attempts = 0;

  const result = await withRetry(
    async () => {
      attempts += 1;
      if (attempts < 2) {
        throw new Error("temporary");
      }
      return "ok";
    },
    { retries: 3, minDelayMs: 1, maxDelayMs: 2 },
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 2);
});
