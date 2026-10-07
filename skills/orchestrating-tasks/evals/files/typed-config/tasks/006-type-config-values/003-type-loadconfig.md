# Type loadConfig

**Task:** [Type config values](./task.md)
**Depends on:** [Add config schema](./001-add-config-schema.md),
[Add value parser](./002-add-value-parser.md)

## Goal

loadConfig returns every config value parsed to its type.

## Context

- src/config/load.js:1 (loadConfig) returns
  `{ port: env.PORT, host: env.HOST, debug: env.DEBUG }`, all strings.
- src/config/schema.js exports `schema`, which maps each key to
  `{ variable, type }`. Subtask 1 adds it.
- src/config/parse.js exports `parseValue(raw, type)`, which throws a
  TypeError on an invalid value. Subtask 2 adds it.
- A missing value throws a TypeError. Add no dependency.
- Tests live in tests/ and use node:test with `node:assert/strict`.

## References

- None.

## Changes

- `src/config/load.js`: `loadConfig(env = process.env)` returns one entry
  per key of `schema`, parsed with parseValue. A missing variable throws a
  TypeError that names the variable.
- `tests/load.test.js` (new): typed values, an invalid PORT, and a missing
  HOST.

## Acceptance criteria

- `loadConfig({ PORT: "8080", HOST: "localhost", DEBUG: "true" })` returns
  `{ port: 8080, host: "localhost", debug: true }`.
- loadConfig throws a TypeError when PORT is `abc`.
- loadConfig throws a TypeError that names HOST when HOST is missing.
- Existing tests still pass.

## Verification

`node --test tests/load.test.js`
