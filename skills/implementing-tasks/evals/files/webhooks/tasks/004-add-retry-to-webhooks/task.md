# Add retry to webhooks

## Summary

Webhook delivery fails on a transient error. Add a retry policy that the
sender uses.

## Success criteria

- A retry policy module returns the delay for each attempt and the retry
  decision for a status.

## Scope

### In scope

- src/webhooks/retry.js (new).

### Out of scope

- Wiring the policy into sendWebhook. A later task does it.
- Persisting failed deliveries.

## Approach

- src/webhooks/send.js (sendWebhook) already returns `{ status }`, with null
  on a network error.
- src/webhooks/retry.js (new) exports `retryDelay(attempt)` and
  `shouldRetry(status, attempt)`.

## Decisions

- Backoff starts at 100 ms, doubles per attempt, and caps at 5000 ms.
  Attempts count from 1.
- At most 5 attempts. `shouldRetry` is false from attempt 5 on.
- Retry on status null, 429, and any 5xx. Never retry other 4xx or 2xx.
- Tests live in tests/ and use node:test with `node:assert/strict`.

## Context

- Tests run with `npm test`. There is no build and no lint command.

## References

- None.

## Subtasks

1. Extract sendWebhook, depends on: none
2. Add retry policy, depends on: 1

## Verification

1. `npm test`
