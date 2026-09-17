# Task template

Fill every section. Replace every `<placeholder>`. Keep the headings exactly as
written. The task becomes the body of one item or one `task.md` file. The
`task-breakdown` skill reads this same format later to fill the Subtasks
section.

Rules for filling:
- Write decisions as facts in the present tense.
- Name real things: file paths with line numbers, symbols, endpoints, tables,
  environment variables, commands. Mark files that do not exist yet as `(new)`.
- Write quantities as numbers with units.
- `a | b` on a template line means: write a or b, never both.
- Put what changes where in *Approach*. Put the rules and values the change
  follows in *Decisions*. Put each fact in one section, not both.
- Add no sections other than the ones below.

---

```markdown
# <Title. Imperative, under 80 characters. Example: Add retry to webhooks>

## Summary

<Two or three sentences. What changes and why. Present tense. No history of the
discussion.>

## Success criteria

- <Observable, binary outcome. Example: POST /webhooks/payment returns 200 after
  a transient upstream 503 that recovers within 3 attempts.>
- <...>

## Scope

### In scope

- <Deliverable.>
- <...>

### Out of scope

- <Adjacent topic that came up. Not part of this task.>
- <... or the single word: None.>

## Approach

- <One bullet per component that changes: path and symbol, then its behavior
  after the change. Example: src/payments/service.ts (PaymentService.send)
  retries the HTTP call according to RetryPolicy and rethrows the last error
  after the final attempt.>
- <New component. Example: src/payments/retry-policy.ts (new) exports
  RetryPolicy with next(attempt), which returns the delay in ms or null when
  attempts are exhausted.>
- <...>

## Decisions

- <Rule or value the change follows. Example: Backoff starts at 500 ms, doubles
  per attempt, stops after 5 attempts.>
- <Convention followed. Example: New tests live in tests/payments/ and use the
  WebhookFactory fixture from tests/factories.ts:12.>
- <...>

## Context

- <Fact an implementer needs, with its origin. Example: Webhook handling lives
  in src/payments/webhooks.ts:41 (handlePaymentWebhook).>
- <Related item with identifier. Example: Related to PAY-212, which added the
  webhook endpoint.>
- <Library fact with version. Example: axios 1.7 exposes retry only through
  interceptors.>
- <Commands. Example: build `npm run build`, tests `npm test -- tests/payments`,
  lint `npm run lint`.>
- <...>

## Subtasks

None.

## Verification

1. <Exact command or manual step that proves a success criterion.>
2. <...>
```
