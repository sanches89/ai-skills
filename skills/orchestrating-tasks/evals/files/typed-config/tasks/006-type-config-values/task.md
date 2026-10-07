# Type config values

## Summary

loadConfig returns every value as the raw string of its environment variable.
Parse each value to the type a schema gives, and fail at load on an invalid or
missing value.

## Success criteria

- `loadConfig({ PORT: "8080", HOST: "localhost", DEBUG: "true" })` returns
  `{ port: 8080, host: "localhost", debug: true }`.
- loadConfig throws a TypeError on an invalid or missing value.

## Scope

### In scope

- src/config/schema.js (new).
- src/config/parse.js (new).
- src/config/load.js.

### Out of scope

- Default values.
- Reading a config file.

## Approach

- src/config/schema.js (new) exports `schema`, which maps each config key to its
  environment variable and its type.
- src/config/parse.js (new) exports `parseValue(raw, type)`.
- src/config/load.js:1 (loadConfig) parses every key of `schema` with
  parseValue.

## Decisions

- The keys are `port` from PORT as a number, `host` from HOST as a string, and
  `debug` from DEBUG as a boolean.
- A boolean is the string `true` or `false`. Any other string is invalid.
- An invalid or missing value throws a TypeError. Add no dependency.
- Tests live in tests/ and use node:test with `node:assert/strict`.

## Context

- src/config/load.js:1 (loadConfig) returns
  `{ port: env.PORT, host: env.HOST, debug: env.DEBUG }`, all strings.
- Tests run with `npm test`. There is no build and no lint command.

## References

- None.

## Subtasks

1. [Add config schema](./001-add-config-schema.md), depends on: none
2. [Add value parser](./002-add-value-parser.md), depends on: none
3. [Type loadConfig](./003-type-loadconfig.md), depends on:
   [Add config schema](./001-add-config-schema.md),
   [Add value parser](./002-add-value-parser.md)

## Verification

1. `npm test`
