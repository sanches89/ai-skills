# Add retry policy

**Task:** ./task.md
**Depends on:** 1

## Goal

Add the retry policy module.

## Context

- Backoff starts at 100 ms, doubles per attempt, and caps at 5000 ms.
  Attempts count from 1.
- At most 5 attempts. `shouldRetry` is false from attempt 5 on.
- Retry on status null, 429, and any 5xx. Never retry other 4xx or 2xx.
- Tests live in tests/ and use node:test with `node:assert/strict`, as in
  tests/send.test.js.
- sendWebhook in src/webhooks/send.js returns `{ status }`, with null on a
  network error.

## References

- None.

## Changes

- `src/webhooks/retry.js` (new): `retryDelay(attempt)` returns 100, 200, 400,
  800, 1600 for attempts 1 to 5, capped at 5000. `shouldRetry(status, attempt)`
  returns a boolean.
- `tests/retry.test.js` (new): delay per attempt, the cap, retry on null,
  429, and 503, no retry on 400, 404, and 200, and no retry at attempt 5.

## Acceptance criteria

- `retryDelay(1)` is 100 and `retryDelay(5)` is 1600.
- `shouldRetry(503, 1)` is true and `shouldRetry(404, 1)` is false.
- `shouldRetry(null, 5)` is false.
- Existing tests still pass.

## Verification

`node --test tests/retry.test.js`
