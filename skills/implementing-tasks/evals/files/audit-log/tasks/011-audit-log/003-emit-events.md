# Emit order events

**Task:** ./task.md
**Depends on:** none

## Goal

cancelOrder publishes an event.

## Context

- Events go to `publish` in src/events/bus.js.
- Tests live in tests/ and use node:test with `node:assert/strict`.

## References

- None.

## Changes

- `src/orders/cancel.js`: cancelOrder calls
  `publish({ type: "order.cancelled", orderId: order.id })` before it returns.
- `tests/cancel.test.js` (existing): add a case that subscribes and checks
  the event.

## Acceptance criteria

- cancelOrder publishes one `order.cancelled` event with the order id.
- Existing tests still pass.

## Verification

`npm test`
