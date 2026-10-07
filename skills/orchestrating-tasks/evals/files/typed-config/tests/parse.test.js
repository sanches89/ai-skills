import { test } from "node:test";
import assert from "node:assert/strict";
import { parseValue } from "../src/config/parse.js";

test("parses a number", () => {
  assert.equal(parseValue("8080", "number"), 8080);
});
test("parses a boolean", () => {
  assert.equal(parseValue("true", "boolean"), true);
  assert.equal(parseValue("false", "boolean"), false);
});
test("keeps a string", () => {
  assert.equal(parseValue("localhost", "string"), "localhost");
});
test("throws a TypeError on an invalid value", () => {
  assert.throws(() => parseValue("abc", "number"), TypeError);
  assert.throws(() => parseValue("yes", "boolean"), TypeError);
});
