# Add an audit log

## Summary

Record an audit event when an order is cancelled.

## Success criteria

- cancelOrder publishes an `order.cancelled` event.

## Scope

### In scope

- src/orders/cancel.js.

### Out of scope

- Storing events. A later task does it.

## Approach

- src/orders/cancel.js (cancelOrder) publishes
  `{ type: "order.cancelled", orderId }` through publish from
  src/events/bus.js.

## Decisions

- Tests live in tests/ and use node:test.

## Context

- Tests run with `npm test`.

## References

- None.

## Subtasks

1. Add the event bus, depends on: none
2. Add order cancel, depends on: none
3. Emit order events, depends on: none

## Verification

1. `npm test`
