# Quality checklist

Run every check before returning the work report. A single failure blocks
delivery. Fix the failure, then run the whole checklist again. When a check on
the work fails, go back to Step 6 or Step 7. When a check on the report fails,
fix the report.

## Criteria

- [ ] The criteria checklist holds every criterion of the target, word for
      word, plus the target's Verification.
- [ ] Every ticked entry has evidence: the command or step and its result, from
      a run made after the last edit.
- [ ] The counts on the report's *Criteria* line equal the ticked and total
      criterion entries of the criteria checklist. The Verification entry and
      the command entries do not count.
- [ ] The result is `done` only when every entry has a tick. Otherwise it is
      `blocked`, and every entry without a tick appears under *Blocked by*.
- [ ] When the result is `blocked`, the working tree still holds the change
      made so far, and *Changes* lists it.
- [ ] The diff removes, skips, or loosens no test, lint rule, or type check.

## Tests

Skip this section when the project has no test setup. Then confirm instead
that the diff adds no test and no test framework. Confirm also that the report
states the missing test setup under *Affects other work*.

- [ ] Every behavior the diff adds or alters has a test, and every test the
      target names exists.
- [ ] Every new test failed for the expected reason before it passed.
- [ ] A bug fix has a regression test.
- [ ] Every new test holds at least one assertion and tests one behavior.
- [ ] Every test file this run added or edited passes when run alone.
- [ ] No new test uses the real network, the real clock, unseeded random
      values, sleeping, or files outside a temporary folder.
- [ ] Test doubles replace only system boundaries, never the unit under test.
- [ ] Every edited existing test asserts a behavior the target changes. A
      test edited for a rename or a move changed only in an import, a path,
      or a symbol name.
- [ ] The tests follow the project's framework, location, naming, and
      fixtures. The diff adds no second framework or style.
- [ ] The count on the report's *Tests* line equals the test cases added.

## Scope

- [ ] The target's Changes or Approach section names every changed file, or
      *Deviations* lists it with its reason.
- [ ] The diff does nothing that any task in the chain lists under *Out of
      scope*.
- [ ] The diff does nothing that a sibling subtask delivers.
- [ ] The diff adds or removes every guard the target names, as stated.
- [ ] No task file, subtask file, or item changed.
- [ ] The run made no commit, push, pull request, status change, or comment,
      unless the request that invoked the skill asked for it.

## Report

- [ ] The headings are exactly those of `work-report-template.md`. *Blocked
      by* exists only when the result is `blocked`.
- [ ] At most 30 non-blank lines. Each bullet is at most 2 lines.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks, except inside quoted user-interface text or code.
- [ ] No narration: no steps taken, no failed attempts, no `I tried`,
      `at first`, `after that`.
- [ ] No command output, logs, stack traces, or code listings.
- [ ] The report lists no met criterion and restates none of the target's
      text.
- [ ] Every bullet under *Affects other work* is of a kind the template lists.
- [ ] Every path and symbol in the report exists in the working tree.
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
