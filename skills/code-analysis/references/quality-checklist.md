# Quality checklist

Run every check and the grep helper before returning the measurement report.
One failure blocks delivery: fix it, then run the whole checklist again. A
failed check on a run sends you back to Step 3 or Step 4, on a finding to
Step 6.

## Project

- [ ] `git status --porcelain` prints what the Step 1 record holds.
- [ ] `git worktree list` names no folder under the scratch directory.
- [ ] No commit, push, pull request, or comment.

## Runs

- [ ] Both summaries came from the same paths, ignore globs, limits, and
      `--top 200`. Both test runs used the same install and test command.
      Only the current summary holds a mutation report.
- [ ] Every measurement with a status other than `ok` in either summary is
      under *Skipped* with its reason, the base `mutation` excepted. So is
      every list cut at 200 entries.
- [ ] The exit code of Step 4c matches the *Comparison* line: `worse` with
      exit code 3, `better` or `same` with exit code 0.

## Findings

- [ ] Every finding names a location that exists in the working tree, and
      the run read its code.
- [ ] Every finding has a kind and an action from `analysis-rules.md`, and
      none is an entry that file says to leave.
- [ ] Every failed test of the current summary is a finding.
- [ ] The findings are in the rank order of `analysis-rules.md`, at most
      12, with the count left out per kind under *Skipped*.
- [ ] With a base name, every name in `worse` has a *Changes* bullet, and
      its finding comes before the others.
- [ ] With a base name, every marker `new` names an entry under `added` in
      `diff.json`.

## Report

- [ ] The headings are exactly those of `measurement-report-template.md`.
      At most 60 non-blank lines, 2 lines per bullet, 25 words per
      sentence, `None.` in every empty section.
- [ ] Every number on a *Measurements* line equals the value in its
      summary, and the *Comparison* line follows the template's rule.
- [ ] Every path, symbol, and test name exists in the working tree or in
      the current JUnit report.
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
