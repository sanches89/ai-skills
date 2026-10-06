import { test } from "node:test";
import assert from "node:assert/strict";
import { sendWebhook } from "../src/webhooks/send.js";

test("returns the response status", async () => {
  const r = await sendWebhook("http://x", {}, async () => ({ status: 204 }));
  assert.equal(r.status, 204);
});
test("returns null status on a network error", async () => {
  const r = await sendWebhook("http://x", {}, async () => { throw new Error("down"); });
  assert.equal(r.status, null);
});
