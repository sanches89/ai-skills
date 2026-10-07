# Extract sendWebhook

**Task:** ./task.md **Depends on:** none

## Goal

Move the HTTP call into sendWebhook.

## Context

- Tests run with `npm test`.

## References

- None.

## Changes

- `src/webhooks/send.js` (new): exports sendWebhook(url, body, fetchFn).
- `tests/send.test.js` (new): status and network error cases.

## Acceptance criteria

- sendWebhook returns `{ status }`, with null on a network error.

## Verification

`node --test tests/send.test.js`
