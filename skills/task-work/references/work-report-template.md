# Work report template

The work report is the only thing the caller keeps from a run. The caller
continues the parent task and the sibling subtasks with it, so make every line
a fact that changes what the caller does next. Keep the headings exactly as
written. Replace every `<placeholder>`.

Rules for filling:
- Write at most 30 non-blank lines and at most 2 lines per bullet.
- Write facts in the present tense. Name real things: file paths, symbols,
  endpoints, flags, commands, item identifiers.
- `a | b` on a template line means: write exactly one of them.
- Write the single word `None.` in a section with nothing to say.
- Write *Blocked by* only when the result is `blocked`.
- Add no sections other than the ones below.

What each section keeps:
- **Result**: `done` when every criterion has evidence from a run made after
  the last edit. `blocked` in every other case.
- **Criteria**: the counts only. Never list a met criterion. Put every
  criterion that is not met under *Blocked by*.
- **Verification**: the target's one verification command. When the target's
  Verification is a list, the words `<number> steps` instead. `pass` only when
  every step passes.
- **Tests**: the number of test cases this run added and the number of
  existing test cases it edited. Without a test setup, the words
  `none: no test setup`.
- **Changes**: one bullet per changed file, also when the result is `blocked`,
  because the change made so far stays: path, symbol, and its behavior after
  the change. With more than 10 changed files, one bullet per folder instead:
  the folder path and what changed in it.
- **Deviations**: each difference between the target's text and the
  implementation: what the target says, what you did, and why.
- **Affects other work**: only these kinds of fact:
  - a symbol, file, endpoint, flag, or command this work added or renamed that
    the parent or a sibling subtask names or calls;
  - a guard added or removed;
  - a fact in a task of the chain or in a sibling subtask that is stale or
    wrong, with the correct fact;
  - a check that already failed in the baseline;
  - the missing test setup, when the project has none, because no test proves
    the change;
  - a decision the user made in answer to a question during this run.
- **Blocked by**: one bullet per criterion that is not met and per dependency
  that is not done: its cause and what unblocks it.

What the report leaves out:
- the steps taken and their order;
- attempts that failed and their fixes;
- command output, logs, stack traces, and code listings;
- the target's text restated: its Summary, its Goal, or criteria that are met;
- praise, apologies, offers, questions, and next-step suggestions.

---

## Work report

```markdown
# Work report: <target title>

**Result:** done | blocked
**Target:** <item identifier and URL | file path | the word `text`>
**Criteria:** <number met> of <total> met
**Verification:** `<verification command>` | <number> steps: pass | fail
**Tests:** <number> added, <number> edited | none: no test setup
**Commits:** none | <short hashes, in commit order>

## Changes

- `<path/to/file.ext>` (<symbol>): <behavior after the change. Example:
  PaymentService.send retries according to RetryPolicy.>
- `<path/to/new-file.ext>` (new): <what it holds.>
- <...>

## Deviations

- <What the target says, what was done, why. Example: The target names
  src/pay/service.ts. The file is now src/payments/service.ts, changed there.>
- <... or the single word: None.>

## Affects other work

- <Fact the parent or a sibling subtask needs. Example: Subtask 003 calls
  RetryPolicy.next. The exported name is RetryPolicy.nextDelay.>
- <... or the single word: None.>

## Blocked by

- <Criterion, word for word, or the dependency's title>: <cause in one
  sentence>. Needs: <what unblocks it>.
- <...>
```
