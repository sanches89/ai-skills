# Add retry to webhooks

## Summary

Webhook delivery fails on a transient error. Retry each delivery by a retry
policy, and dispatch every event through the retrying delivery.

## Success criteria

- dispatchEvent returns status 200 for a subscriber that answers 503 once,
  then 200.
- A delivery stops after 5 attempts.

## Scope

### In scope

- src/webhooks/retry.js (new).
- src/webhooks/deliver.js (new).
- src/webhooks/dispatch.js.

### Out of scope

- Persisting failed deliveries.
- Changing sendWebhook.

## Approach

- src/webhooks/retry.js (new) exports `retryDelay(attempt)` and
  `shouldRetry(status, attempt)`.
- src/webhooks/deliver.js (new) exports
  `deliverWebhook({ url, body }, { fetchFn, sleep })`. It calls sendWebhook
  until shouldRetry returns false.
- src/webhooks/dispatch.js:3 (dispatchEvent) delivers the event to every
  url through deliverWebhook.

## Decisions

- Backoff starts at 100 ms, doubles per attempt, and caps at 5000 ms.
  Attempts count from 1.
- At most 5 attempts. `shouldRetry` is false from attempt 5 on.
- Retry on status null, 429, and any 5xx. Never retry other 4xx or 2xx.
- Tests live in tests/ and use node:test with `node:assert/strict`.
- Tests pass a `sleep` that resolves at once, so that no test waits.

## Context

- src/webhooks/send.js:1 (sendWebhook) returns `{ status }`, with null on a
  network error.
- src/webhooks/dispatch.js:3 (dispatchEvent) sends the event to every url
  with sendWebhook.
- Tests run with `npm test`. There is no build and no lint command.

## References

- None.

## Subtasks

1. [Add retry policy](./001-add-retry-policy.md), depends on: none
2. [Add retrying delivery](./002-add-retrying-delivery.md), depends on:
   [Add retry policy](./001-add-retry-policy.md)
3. [Dispatch events with retry](./003-dispatch-events-with-retry.md),
   depends on: [Add retrying delivery](./002-add-retrying-delivery.md)

## Verification

1. `npm test`
