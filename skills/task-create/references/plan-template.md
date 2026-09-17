# Plan template

Fill every section. Replace every `<placeholder>`. Keep the headings exactly as written so the plan maps onto project-management items the same way every time: the top sections become the parent item, each task becomes a child item.

Rules for filling:
- Write decisions as facts in the present tense.
- Name real things: file paths with line numbers, symbols, endpoints, tables, environment variables, commands. Mark files that do not exist yet as `(new)`.
- Quantities are numbers with units.
- No sections other than the ones below.

---

```markdown
# <Title. Imperative, under 80 characters. Example: Add retry with backoff to payment webhooks>

## Summary

<Two or three sentences. What changes and why. Present tense. No history of the discussion.>

## Success criteria

- <Observable, binary outcome. Example: POST /webhooks/payment returns 200 after a transient upstream 503 that recovers within 3 attempts.>
- <...>

## Scope

### In scope

- <Deliverable.>
- <...>

### Out of scope

- <Adjacent item that came up. Not part of this plan.>
- <... or the single word: None.>

## Decisions

- <Decision stated as a fact. Example: Backoff starts at 500 ms, doubles per attempt, stops after 5 attempts.>
- <Decision that records a followed convention. Example: New tests live in tests/payments/ and use the existing WebhookFactory fixture.>
- <...>

## Context

- <Fact a task executor needs, with source. Example: Webhook handling lives in src/payments/webhooks.ts:41 (handlePaymentWebhook).>
- <Related project-management item with identifier. Example: Related to PAY-212, which added the webhook endpoint.>
- <Library fact with version. Example: axios 1.7 exposes retry only through interceptors; see the Context7 excerpt recorded in research.>
- <Build, lint, and test commands for the touched areas.>
- <...>

## Tasks

### Task 1: <Imperative title>

**Depends on:** none
**Touches:** `<path/to/file.ext>` (`<symbol>`), `<path/to/new-file.ext>` (new)
**Description:** <What to do, precise enough to execute without asking. Name the functions to add or change, their inputs and outputs, and the behavior on error.>
**Acceptance criteria:**
- <Binary check. Example: `npm test -- tests/payments/retry.test.ts` passes with the 3 new cases listed in the description.>
- <...>

### Task 2: <Imperative title>

**Depends on:** Task 1
**Touches:** ...
**Description:** ...
**Acceptance criteria:**
- ...

## Verification

1. <Exact command or manual step that proves the whole change works after every task is done.>
2. <...>
```
