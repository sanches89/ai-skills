# Measurement report template

The measurement report is the only thing the user keeps from a run. Make
every line a fact that changes what the user does next. Keep the headings
exactly as written. Replace every `<placeholder>`.

Rules for filling:
- Write at most 60 non-blank lines and at most 2 lines per bullet.
- Write facts in the present tense. Name real things: file paths, symbols,
  branch names, test names, configuration files.
- `a | b` on a template line means: write a or b, never both.
- With a base name, write each value on a *Measurements* line as
  `<before> to <after>`, with the value of the base summary first. Without
  a base name, write the value alone.
- Write the single word `None.` in a section with nothing to say.
- Add no sections other than the ones below.

What each section keeps:
- **Result**: `done` when Step 4b printed a summary. `blocked` with the
  reason in every other case.
- **Scope**: `files` of the current summary, the repository root, and the
  ignore globs.
- **Base**: `none`, or the base name with the short hash of the base commit,
  the count of changed files, and the count of deleted files.
- **Limits**: the three limits, the clone floor, and their source: the
  configuration file that sets them, or `defaults`.
- **Tools**: the `tool` value of `duplication`; the `tool` value of
  `complexity`, or `no lizard` when lizard did not run; the test runner, or
  `no test command` when 2c found none.
- **Comparison**: `none` without a base name. `worse` when `worse` of the
  current summary is not empty. `better` when `worse` is empty and `better`
  of `diff.json` is not. `same` in every other case.
- **Measurements**: one line per measurement. A measurement with a status
  other than `ok` in the current summary gets `skipped` with its reason.
- **Changes**: only with a base name. Each bullet names the values, clones,
  functions, tests, and files that `diff.json` lists. A bullet with more
  than three names gives the count and the first three. Without a base
  name, the single word `None.`
- **Findings**: the findings of Step 6 in rank order, numbered. The marker
  is `new` for an entry that `diff.json` lists under `added`. It is
  `changed` for an entry in a changed file that `diff.json` does not list
  under `added`. It is empty in every other case.
- **Skipped**: every measurement with a status other than `ok` in either
  summary, with its reason. The base tests and coverage, when Step 3b
  skipped them, with the reason. Every list cut at 200 entries. The count of
  findings left out per kind.

What the report leaves out:
- the steps taken and their order;
- attempts that failed and their fixes;
- command output, logs, stack traces, and the JSON of the summaries;
- the request restated;
- praise, apologies, offers, questions, and next-step suggestions.

---

## Measurement report

```markdown
# Measurement report: <repository name> | <repository name> vs <base name>

**Result:** done | blocked: <reason>
**Scope:** <number> files under `<repository root>`, ignore: <globs> | none
**Base:** none | <base name> at <short hash>, <number> changed files,
<number> deleted files
**Limits:** ccn <n>, length <n>, params <n>, clone <n> tokens and <n>
lines, from `<configuration file>` | defaults
**Tools:** <jscpd version>, <lizard version> | no lizard, <test runner> |
no test command
**Comparison:** none | better | same | worse

## Measurements

- Duplication: <number> clones, <number> duplicated lines, <percent> of
  <number> lines. | skipped: <reason>
- Complexity: <number> functions, <number> over ccn, <number> over length,
  <number> over params, highest ccn <number>. | skipped: <reason>
- Hotspots: `<file>` leads with <number> commits and ccn | lines <number>,
  then `<file>` and `<file>`. | skipped: <reason>
- Unit tests: <number> tests, <number> failed, <number> skipped, <number>
  seconds. | skipped: <reason>
- Coverage: lines <percent>, branches <percent> | none, <number> uncovered
  lines, <number> files in no report, <number> untested functions. |
  skipped: <reason>

## Changes

- Worse: <name> <before> to <after>, <name> <before> to <after>. | None.
- Better: <name> <before> to <after>, <name> <before> to <after>. | None.
- Clones: <number> new, <number> gone. Largest new: `<location>` and
  `<location>`, <number> lines. | None.
- Functions over a limit: <number> new, <number> back under. New:
  `<path:line>` (<symbol>) ccn <number>, `<path:line>` (<symbol>) length
  <number>. | None.
- Tests: <number> new failures, <number> fixed, <number> added | removed.
  | None.
- Changed files without full coverage: `<file>` <percent> of lines,
  <number> uncovered; `<file>` <percent> of lines, <number> uncovered.
  | None.
- Changed files in no coverage report: `<file>`, `<file>`. | None.
- Not compared: <measurement>: <reason>. | None.

## Findings

1. <marker> <kind> at `<path:line>` (<symbol>): <evidence>. Action:
   <action>.
2. <...>
<... or the single word: None.>

## Skipped

- <measurement>: <reason>. | None.
- base tests: <reason>.
- `<list>` cut at 200 entries: its diff is partial.
- <number> findings of kind <kind> left out after the 12th.
```
