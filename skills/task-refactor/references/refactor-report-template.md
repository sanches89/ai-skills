# Refactor report template

The refactor report is the only thing the user keeps from a run. Make every
line a fact that changes what the user does next. Keep the headings exactly as
written. Replace every `<placeholder>`.

Rules for filling:
- Write at most 45 non-blank lines and at most 2 lines per bullet.
- Write facts in the present tense. Name real things: file paths, symbols,
  commands, item identifiers.
- `a | b` on a template line means: write a or b, never both.
- Write the single word `None.` in a section with nothing to say.
- Add no sections other than the ones below.

What each section keeps:
- **Result**: `done` when every approved plan entry is applied and Step 9
  passes, and when Step 5 produced no finding. `partial` when Step 9 passes,
  at least one plan entry is applied, and at least one is dropped. `blocked`
  in every other case.
- **Plan entries**: the counts only.
- **Checks**: `pass` only when no command from Step 3b and no analysis tool
  from Step 3d fails beyond the baseline.
- **Tests**: the number of characterization tests this run added and the
  number of existing test files it edited. Without a test setup, the words
  `none: no test setup`.
- **Contract**: `unchanged`, or each part that changed as the request names.
- **Measurements**: one line per measurement, with the value before and
  after. For a measurement that did not run, the word `skipped` and the
  reason. One line per trade that Step 9 accepted: the value that rose and the
  larger finding the plan entry removed.
- **Applied**: one bullet per applied plan entry: the refactoring, the path,
  the symbol, and the structure after the change. With more than 12 applied
  entries, one bullet per file instead.
- **Dropped**: one bullet per approved plan entry that is not in the working
  tree, with its reason.
- **Bugs found**: each behavior in the refactor scope that looks wrong, with
  its location. The refactoring kept it.
- **Left for later**: each finding that is not in the refactor plan, and each
  part removed from the refactor scope, with the reason. At most 8 bullets,
  highest hotspot score first.

What the report leaves out:
- the steps taken and their order;
- attempts that failed and their fixes;
- command output, logs, stack traces, code listings, and the measurement
  summary itself;
- the request restated;
- praise, apologies, offers, questions, and next-step suggestions.

---

## Refactor report

```markdown
# Refactor report: <refactor scope in a few words>

**Result:** done | partial | blocked
**Request:** <paths | symbol | git range | item identifier and URL | file
path | the word `text`>
**Plan entries:** <number applied> of <number approved> applied
**Checks:** pass | fail: <name of each check that fails beyond the baseline>
**Tests:** <number> characterization tests added, <number> test files edited
| none: no test setup
**Contract:** unchanged | changed as requested: <part of the contract>
**Commits:** none | <short hashes, in commit order>

## Measurements

- Duplication: <number> to <number> duplicated lines, <number> to <number>
  clones. | skipped: <reason>
- Complexity: <number> to <number> functions over a limit, highest ccn
  <number> to <number>. | skipped: <reason>
- Unit tests: <number> to <number> tests, <number> to <number> failed,
  <number> to <number> skipped. | skipped: <reason>
- Coverage: lines <percent> to <percent>, branches <percent> to <percent>,
  uncovered lines <number> to <number>. | skipped: <reason>
- <Trade. Example: parseOrder has 5 parameters, limit 4. The entry removed a
  42-line clone.>

## Applied

- <Refactoring>: `<path/to/file.ext>` (<symbol>): <structure after the
  change. Example: the three copies of the date check call isBusinessDay.>
- <...>

## Dropped

- <Refactoring> at `<path:line>`: <reason in one sentence. Example: the type
  check fails in 3 attempts because OrderRow is built by reflection.>
- <... or the single word: None.>

## Bugs found

- `<path:line>` (<symbol>): <the behavior and why it looks wrong. Example:
  returns an empty list for the range "5-1" instead of raising.>
- <... or the single word: None.>

## Left for later

- <Smell> at `<path:line>`: <refactoring>. <Why it is not in the plan.
  Example: needs a change to the exported signature of sendInvoice.>
- <... or the single word: None.>
```
