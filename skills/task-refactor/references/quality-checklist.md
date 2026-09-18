# Quality checklist

Run every check before returning the refactor report. A single failure blocks
delivery. Fix the failure, then run the whole checklist again. When a check on
the work fails, go back to Step 8 or Step 9. When a check on the report fails,
fix the report.

## Behavior

- [ ] Every command from Step 3b ran after the last edit. No check fails
      beyond the baseline.
- [ ] The diff changes no literal, condition, default value, error message,
      or log text.
- [ ] The diff swaps the order of no two side effects.
- [ ] The diff adds no feature, fixes no bug, and tunes no performance.
- [ ] Every behavior that looks wrong is under *Bugs found*, and the code
      still has it.
- [ ] The diff removes, skips, or loosens no test, lint rule, or type check.
- [ ] No assertion of an existing test changed.

## Contract and scope

- [ ] Every part of the contract listed in Step 2 has the same name,
      signature, and format. A change that the request names is the only
      exception, and the *Contract* line states it.
- [ ] Every changed file is in the refactor scope, or hard rule 6 allows it.
- [ ] The diff touches no generated code, vendored code, lockfile, build
      output, snapshot file, or database migration that already ran.
- [ ] The diff does nothing that a task read in Step 2 lists under *Out of
      scope*.
- [ ] Every applied plan entry is one the user approved, or one the requested
      task names.
- [ ] The diff adds no dependency, tool, configuration file, or code pattern
      the project does not use.
- [ ] No task file, subtask file, or item changed.
- [ ] The run made no commit, push, pull request, status change, or comment,
      unless the request asked for it.

## Tests

Skip this section when the project has no test setup. Then confirm instead
that the diff adds no test and no test framework. Confirm also that every
applied plan entry is from the safe set.

- [ ] Every applied plan entry changed only code that a test covers, or is
      from the safe set.
- [ ] Every characterization test passed on the unchanged code and failed
      once when the asserted behavior was broken.
- [ ] Every characterization test holds at least one assertion with a literal
      expected value.
- [ ] No new test uses the real network, the real clock, unseeded random
      values, sleeping, or files outside a temporary folder.
- [ ] The tests follow the project's framework, location, naming, and
      fixtures. The diff adds no second framework or style.
- [ ] The count on the report's *Tests* line equals the tests added.

## Measurements

- [ ] Both measurement summaries came from the same limits and the same
      ignore globs. The second run named every file the plan entries created.
- [ ] Both test reports and both coverage reports came from the same test
      command with the same options.
- [ ] The second run exited 0, or the *Measurements* section states one trade
      per name in its `worse` list.
- [ ] No `tests` name and no `coverage` name is in the `worse` list. No trade
      excuses a lost test, a failed test, a skipped test, or new code that
      no test runs.
- [ ] Every skipped measurement appears as `skipped` with its reason.
- [ ] No applied plan entry exists only to move a number. Each one names a
      smell from `smell-catalog.md`.
- [ ] The scratch directory holds every measurement summary and tool report.
      The repository holds none.

## Report

- [ ] The headings are exactly those of `refactor-report-template.md`.
- [ ] At most 45 non-blank lines. Each bullet is at most 2 lines.
- [ ] The counts on the *Plan entries* line equal the bullets under *Applied*
      and the approved plan entries.
- [ ] The result is `done` only when every approved plan entry is applied and
      Step 9 passes.
- [ ] Every approved plan entry is under *Applied* or under *Dropped*.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks, except inside quoted user-interface text or code.
- [ ] No narration: no steps taken, no failed attempts, no `I tried`,
      `at first`, `after that`.
- [ ] No command output, logs, stack traces, or code listings.
- [ ] Every path and symbol in the report exists in the working tree, except
      a symbol that an applied plan entry removed.
- [ ] Every empty section holds the single word `None.`
- [ ] The report ends with its last section. No offer, no question, no
      next-step suggestion.

## Grep helper

Run this over the report file. Remove every hit, unless it sits inside quoted
user-interface text or code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like' \
  -e '\bI tried\b|\bat first\b|\bafter that\b' \
  <report-file>
```
