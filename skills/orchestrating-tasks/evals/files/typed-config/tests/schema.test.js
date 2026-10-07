import { test } from "node:test";
import assert from "node:assert/strict";
import { schema } from "../src/config/schema.js";

test("maps each key to its variable and type", () => {
  assert.deepEqual(schema.port, { variable: "PORT", type: "number" });
  assert.deepEqual(schema.host, { variable: "HOST", type: "string" });
  assert.deepEqual(schema.debug, { variable: "DEBUG", type: "boolean" });
});
