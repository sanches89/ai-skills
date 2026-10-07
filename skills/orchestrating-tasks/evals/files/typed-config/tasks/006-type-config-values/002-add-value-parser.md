# Add value parser

**Task:** [Type config values](./task.md)
**Depends on:** none

## Goal

Add the function that parses one raw value to a type.

## Context

- The types are `number`, `string`, and `boolean`.
- A boolean is the string `true` or `false`. Any other string is invalid.
- An invalid value throws a TypeError.
- Tests live in tests/ and use node:test with `node:assert/strict`.

## References

- None.

## Changes

- `src/config/parse.js` (new): `parseValue(raw, type)` returns the parsed
  value and throws a TypeError on an invalid value.
- `tests/parse.test.js` (new): a number, a boolean, a string, and an
  invalid number and boolean.

## Acceptance criteria

- `parseValue("8080", "number")` is 8080.
- `parseValue("true", "boolean")` is true.
- `parseValue("abc", "number")` throws a TypeError.

## Verification

`node --test tests/parse.test.js`
