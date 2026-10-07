# Add retrying delivery

**Task:** [Add retry to webhooks](./task.md)
**Depends on:** [Add retry policy](./001-add-retry-policy.md)

## Goal

Deliver one webhook with retries by the retry policy.

## Context

- src/webhooks/send.js:1 (`sendWebhook(url, body, fetchFn)`) returns
  `{ status }`, with null on a network error.
- src/webhooks/retry.js exports `retryDelay(attempt)` and
  `shouldRetry(status, attempt)`. Subtask 1 adds it.
- At most 5 attempts. Attempts count from 1.
- Tests live in tests/ and use node:test with `node:assert/strict`, as in
  tests/send.test.js.
- Tests pass a `sleep` that resolves at once, so that no test waits.

## References

- None.

## Changes

- `src/webhooks/deliver.js` (new):
  `deliverWebhook({ url, body }, { fetchFn, sleep })` calls sendWebhook.
  While `shouldRetry(status, attempt)` is true, it awaits
  `sleep(retryDelay(attempt))` and calls again. It returns
  `{ status, attempts }`. `fetchFn` defaults to fetch, and `sleep` to a
  setTimeout promise.
- `tests/deliver.test.js` (new): a 503 then a 200, a network error on every
  attempt, and a 404.

## Acceptance criteria

- A 503 then a 200 returns `{ status: 200, attempts: 2 }` after one sleep
  of 100 ms.
- A network error on every attempt returns `{ status: null, attempts: 5 }`.
- A 404 returns `{ status: 404, attempts: 1 }` without a sleep.
- Existing tests still pass.

## Verification

`node --test tests/deliver.test.js`
