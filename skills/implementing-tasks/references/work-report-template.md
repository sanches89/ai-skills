# Work report template

Make every line a fact that changes what the caller does next for the
parent task and the sibling subtasks. Keep every heading as written. Replace
every `<placeholder>`.

Rules for filling:
- At most 30 non-blank lines, 2 lines per bullet, and 25 words per sentence.
- Present tense. Name real things: paths, symbols, endpoints, flags,
  commands, item identifiers.
- `a | b` on a template line means: write a or b, never both.
- The single word `None.` in a section with nothing to say.
- *Blocked by* only when the result is `blocked`. No section beyond the
  ones below.

What each section keeps:
- **Result**: `done` when every entry of the criteria checklist is ticked,
  with evidence from a run made after the last edit, else `blocked`.
- **Criteria**: the counts only.
- **Verification**: the target's one verification command, or
  `<number> steps` when its Verification is a list. `pass` only when every
  step passes.
- **Tests**: the test cases this run added, a new case in an existing file
  included, and the existing cases it edited, or `none: no test setup`.
  Count each case the test runner reports, a generated case included.
- **Changes**: one bullet per changed file, also on `blocked`: path, symbol,
  and behavior after the change. With more than 10 changed files, one
  bullet per folder: its path and what changed in it. Mark a removed file
  or symbol `(deleted)`.
- **Deviations**: each difference between the target's text and the
  implementation: what the target says, what was done, and why.
- **Affects other work**: only these facts:
  - a symbol, file, endpoint, flag, or command this work added or renamed
    that the parent or a sibling subtask names or calls;
  - a rollout guard added or removed;
  - a stale or wrong fact in a task of the chain or in a sibling subtask,
    with the correct fact;
  - a check that already failed in the baseline;
  - the missing test setup;
  - a `writing-clean-code` failure on a line this run did not write.
- **Blocked by**: one bullet per criterion not met, per unticked
  Verification or command entry, per dependency not done, and per fact the
  target lacks: its cause and what unblocks it.

What the report leaves out:
- the steps taken, and attempts that failed;
- command output, logs, stack traces, and code listings;
- the target's text restated, and met criteria;
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

- `<path/to/file.ext>` (<symbol>): <behavior after the change.>
- `<path/to/new-file.ext>` (new): <what it holds.>
- `<path/to/old-file.ext>` (deleted): <what it held.>
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

- <Criterion, word for word, the Verification, the command, the
  dependency's title, or the fact the target lacks>: <cause in one
  sentence>. Needs: <what unblocks it>.
- <...>
```
