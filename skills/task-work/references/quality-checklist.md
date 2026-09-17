# Quality checklist

Run every check before returning the work report. A single failure blocks
delivery. Fix the failure, then run the whole checklist again. A check on the
work that fails sends the run back to Step 6 or Step 7. A check on the report
that fails is fixed in the report.

## Criteria

- [ ] The criteria checklist holds every criterion of the target, word for
      word, plus the target's Verification.
- [ ] Every ticked entry has evidence: the command or step and its result, from
      a run made after the last edit.
- [ ] The counts on the report's *Criteria* line equal the ticked and total
      criterion entries of the criteria checklist. The Verification entry and
      the command entries are not counted.
- [ ] The result is `done` only when every entry is ticked. Otherwise it is
      `blocked`, and every entry that is not ticked appears under *Blocked
      by*.
- [ ] When the result is `blocked`, the change made so far is still in the
      working tree and is listed under *Changes*.
- [ ] The diff removes, skips, or loosens no test, lint rule, or type check.

## Tests

Skip this section when the project has no test setup. Then confirm instead
that no test and no test framework was added, and that the report states the
missing test setup under *Affects other work*.

- [ ] Every behavior the diff adds or alters has a test, and every test the
      target names exists.
- [ ] Every new test was seen failing for the expected reason before it was
      seen passing.
- [ ] A bug fix has a regression test.
- [ ] Every new test holds at least one assertion and tests one behavior.
- [ ] Every test file this run added or edited passes when run alone.
- [ ] No new test uses the real network, the real clock, unseeded random
      values, sleeping, or files outside a temporary folder.
- [ ] Test doubles replace only system boundaries, never the unit under test.
- [ ] Every edited existing test asserts a behavior the target changes.
- [ ] The tests follow the project's framework, location, naming, and
      fixtures. No second framework or style was added.
- [ ] The count on the report's *Tests* line equals the test cases added.

## Scope

- [ ] Every changed file is named in the target's Changes or Approach, or is
      listed under *Deviations* with its reason.
- [ ] Nothing that any task in the chain lists under *Out of scope* was done.
- [ ] Nothing that a sibling subtask delivers was done.
- [ ] Every guard the target names was added or removed as stated.
- [ ] No task file, subtask file, or item was edited.
- [ ] No commit, push, pull request, status change, or comment was made, unless
      the request that invoked the skill asked for it.

## Report

- [ ] The headings are exactly those of `work-report-template.md`. *Blocked
      by* is present only when the result is `blocked`.
- [ ] At most 30 non-blank lines. Each bullet is at most 2 lines.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks, except inside quoted user-interface text or code.
- [ ] No narration: no steps taken, no failed attempts, no `I tried`,
      `at first`, `after that`.
- [ ] No command output, logs, stack traces, or code listings.
- [ ] No criterion that is met is listed, and the target's text is not
      restated.
- [ ] Every bullet under *Affects other work* is of a kind the template lists.
- [ ] Every path and symbol in the report exists in the working tree.
- [ ] Every empty section holds the single word `None.`
- [ ] The report ends with its last section. No offer, no question, no
      next-step suggestion.

## Grep helper

Run this over the report file. Every hit is removed or is inside quoted
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
