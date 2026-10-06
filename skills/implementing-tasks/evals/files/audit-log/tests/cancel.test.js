import { test } from "node:test";
import assert from "node:assert/strict";
import { cancelOrder } from "../src/orders/cancel.js";

test("cancels an order", () => {
  assert.equal(cancelOrder({ id: 1, status: "open" }).status, "cancelled");
});
