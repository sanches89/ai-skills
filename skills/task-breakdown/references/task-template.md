# Task template

Two formats: the **task** and the **subtask**. Fill every section. Replace every
`<placeholder>`. Keep the headings exactly as written, so the output maps onto
items and files the same way every time. The task becomes the item body or
`task.md`. Each subtask becomes a child item or a `###-<subtask-slug>.md` file.

The task format is the same one the `task-create` skill writes. Fill its
Subtasks section and complete the other sections with what research and the
interview settled.

Rules for filling:
- Write decisions as facts in the present tense.
- Name real things: file paths with line numbers, symbols, endpoints, tables,
  environment variables, commands. Mark files that do not exist yet as `(new)`.
- Write quantities as numbers with units.
- `a | b` on a template line means: write a or b, never both.
- Put what changes where in *Approach*. Put the rules and values the change
  follows in *Decisions*. Put each fact in one section, not both.
- Repeat in a subtask the facts and decisions it needs. Never point at the
  task for information.
- Links: in the draft, name titles and numbers only on `Task`, `Depends on`,
  and in the Subtasks list. Step 8 replaces them with file links or item links
  at save time.
- Add no sections other than the ones below.

---

## Task

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

1. <Subtask title>, depends on: none
2. <Subtask title>, depends on: 1
3. <...>

## Verification

1. <Exact command or manual step that proves a success criterion.>
2. <...>
```

---

## Subtask

```markdown
# <Title. Imperative, under 80 characters. Example: Add RetryPolicy>

**Task:** <task title in the draft; `./task.md` or the task's item link when
saved>
**Depends on:** none | <subtask numbers in the draft; links to the sibling files
or items when saved>

## Goal

<One sentence. What this subtask delivers.>

## Context

- <Only what this subtask needs, restated in full. Path with line numbers and
  symbol. Example: PaymentService.send() at src/payments/service.ts:88 performs
  the single HTTP call to retry.>
- <Decision this subtask applies, restated. Example: Backoff starts at 500 ms,
  doubles per attempt, stops after 5 attempts.>
- <Convention this subtask follows, restated. Example: New tests go in
  tests/payments/ and use the WebhookFactory fixture from
  tests/factories.ts:12.>
- <Guard, when the subtask hides incomplete behavior. Example: The new path is
  behind the PAYMENT_RETRY flag in src/config/flags.ts:20, default false,
  removed in subtask 4.>
- <...>

## Changes

- `<path/to/file.ext>`: <function or symbol to add or change, its inputs and
  outputs, and the behavior on error.>
- `<path/to/new-file.ext>` (new): <what it contains.>
- `<path/to/test-file.ext>` (new | existing): <the test cases to add, named.>
- <...>

## Acceptance criteria

- <Binary check. Example: RetryPolicy.next(attempt) returns 500, 1000, 2000,
  4000, 8000 ms for attempts 1 to 5 and null for attempt 6.>
- <Binary check. Example: Existing tests in tests/payments/ still pass.>
- <...>

## Verification

`<one command that proves this subtask. Example: npm test -- retry.test.ts>`
```
