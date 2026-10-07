# Add config schema

**Task:** [Type config values](./task.md) **Depends on:** none

## Goal

Add the schema that maps each config key to its variable and its type.

## Context

- The keys are `port` from PORT as a number, `host` from HOST as a string, and
  `debug` from DEBUG as a boolean.
- Tests live in tests/ and use node:test with `node:assert/strict`.

## References

- None.

## Changes

- `src/config/schema.js` (new): exports `schema`, an object with one entry
  `{ variable, type }` per key.
- `tests/schema.test.js` (new): the entry of each key.

## Acceptance criteria

- `schema.port` equals `{ variable: "PORT", type: "number" }`.
- `schema.host` equals `{ variable: "HOST", type: "string" }`.
- `schema.debug` equals `{ variable: "DEBUG", type: "boolean" }`.

## Verification

`node --test tests/schema.test.js`
