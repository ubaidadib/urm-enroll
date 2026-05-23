import test from "node:test";
import assert from "node:assert/strict";

import { paginate } from "../../lib/nexus-sync/pagination.js";

test("pagination stops when no more records are returned", async () => {
  const pages = [];

  for await (const result of paginate(async (page) => {
    if (page === 1) return { records: [{ id: 1 }], hasMore: true };
    return { records: [], hasMore: false };
  })) {
    pages.push(result);
  }

  assert.equal(pages.length, 2);
  assert.equal(pages[0].records.length, 1);
  assert.equal(pages[1].records.length, 0);
});

test("pagination handles 304 not-modified response", async () => {
  const pages = [];

  for await (const result of paginate(async () => ({ records: [], notModified: true, hasMore: false }))) {
    pages.push(result);
  }

  assert.equal(pages.length, 1);
  assert.equal(pages[0].notModified, true);
});
