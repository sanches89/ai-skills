# Quality checklist

Run every check and the grep helper before returning the measurement report.
One failure blocks delivery: fix it, then run the whole checklist again. A
failed check on a run sends you back to Step 2, on a finding to Step 3.

## Project

- [ ] `git status --porcelain` prints what the Step 1 record holds.
- [ ] No commit, push, pull request, or comment.

## Runs

- [ ] The measurement record came from one `measuring-code` run with
      `paths .`, `root <root>`, `mutation all`, and `top 200`. Its
      `summary` line names a `summary.json` in the scratch directory, or
      the result is `blocked`.
- [ ] Every measurement whose line in the measurement record is not `ok`
      is under *Skipped* with its reason.

## Findings

- [ ] Every finding names a location that exists under `<root>`, and the
      run read its code.
- [ ] Every finding has a kind and an action from `analysis-rules.md`, and
      none is an entry that file says to leave.
- [ ] Every failed test of the summary is a finding.
- [ ] The findings are in the rank order of `analysis-rules.md`, at most
      12, with the count left out per kind under *Skipped*.

## Report

- [ ] The headings are exactly those of `measurement-report-template.md`.
      At most 60 non-blank lines, 2 lines per bullet, 25 words per
      sentence, `None.` in every empty section.
- [ ] Every number on a *Measurements* line equals the value in the
      summary.
- [ ] Every path, symbol, and test name exists under `<root>` or in the
      JUnit report.
- [ ] No command output, logs, stack traces, or JSON listings, and nothing
      after the last section: no offer, question, or next step.

## Grep helper

Run over the measurement report. Remove every hit outside quoted
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
