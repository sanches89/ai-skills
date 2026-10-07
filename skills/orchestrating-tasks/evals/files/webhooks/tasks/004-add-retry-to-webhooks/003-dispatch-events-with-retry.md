# Dispatch events with retry

**Task:** [Add retry to webhooks](./task.md)
**Depends on:** [Add retrying delivery](./002-add-retrying-delivery.md)

## Goal

dispatchEvent delivers every event through deliverWebhook.

## Context

- src/webhooks/dispatch.js:3 (`dispatchEvent(event, { urls, fetchFn })`)
  sends the event to every url with sendWebhook. It returns the results in
  url order.
- src/webhooks/deliver.js exports
  `deliverWebhook({ url, body }, { fetchFn, sleep })`, which returns
  `{ status, attempts }`. Subtask 2 adds it.
- Tests live in tests/ and use node:test with `node:assert/strict`, as in
  tests/send.test.js.
- Tests pass a `sleep` that resolves at once, so that no test waits.

## References

- None.

## Changes

- `src/webhooks/dispatch.js`: `dispatchEvent(event, { urls, fetchFn,
  sleep })` calls `deliverWebhook({ url, body: event }, { fetchFn, sleep })`
  for every url. It returns the results in url order.
- `tests/dispatch.test.js` (new): one url that answers 503 once, then 200,
  and two urls that keep their order.

## Acceptance criteria

- dispatchEvent returns `[{ status: 200, attempts: 2 }]` for one url that
  answers 503 once, then 200.
- dispatchEvent returns the results of two urls in url order.
- Existing tests still pass.

## Verification

`node --test tests/dispatch.test.js`
