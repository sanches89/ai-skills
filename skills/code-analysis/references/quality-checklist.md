# Quality checklist

Run every check before returning the measurement report. A single failure
blocks delivery. Fix the failure. Then run the whole checklist again. When a
check on the runs fails, go back to the step of the run that fails: Step 3
for the base run, Step 4 for the current run. When a check on the findings
fails, go back to Step 6. When a check on the report fails, fix the report.

## Project

- [ ] `git status --porcelain` prints what the Step 1 record holds. No
      project file changed.
- [ ] `git worktree list` names no folder under the scratch directory.
- [ ] The scratch directory holds every summary, JUnit report, coverage
      report, diff, note, and measurement report of this run. The
      repository holds none.
- [ ] The run added no dependency, tool, configuration file, JUnit report,
      or coverage report to the project.
- [ ] The run made no commit, push, pull request, or comment.

## Runs

- [ ] Both summaries came from the same paths, the same ignore globs, the
      same limits, and `--top 200`.
- [ ] Both test runs used the same install command, the same test command,
      and the same report options.
- [ ] Every measurement with a status other than `ok` in either summary is
      under *Skipped* with its reason.
- [ ] Every list with 200 entries is under *Skipped* as cut.
- [ ] The exit code of Step 4b matches the *Comparison* line: `worse` with
      exit code 3, `better` or `same` with exit code 0.

## Findings

- [ ] Every finding names a location that exists in the working tree, and
      the run read its code.
- [ ] Every finding has a kind and an action from `analysis-rules.md`.
- [ ] No finding is a clone or a function that `analysis-rules.md` says to
      leave.
- [ ] Every failed test of the current summary is a finding.
- [ ] The findings are in the rank order of `analysis-rules.md`, at most
      12, and the count left out per kind is under *Skipped*.
- [ ] With a base name, every name in `worse` has a *Changes* bullet. Every
      finding behind a worse value comes before the findings that no worse
      value explains.
- [ ] With a base name, every marker `new` names an entry that `diff.json`
      lists under `added`.

## Report

- [ ] The headings are exactly those of `measurement-report-template.md`.
- [ ] At most 60 non-blank lines. Each bullet is at most 2 lines.
- [ ] The *Comparison* line follows the rule of the template.
- [ ] Every number on a *Measurements* line equals the value in the
      summary it comes from.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks, except inside quoted user-interface text or code.
- [ ] No narration: no steps taken, no failed attempts, no `I tried`,
      `at first`, `after that`.
- [ ] No command output, logs, stack traces, or JSON listings.
- [ ] Every path, symbol, and test name in the report exists in the working
      tree or in the current JUnit report.
- [ ] Every empty section holds the single word `None.`
- [ ] The report ends with its last section. No offer, no question, no
      next-step suggestion.

## Grep helper

Run this over the measurement report file. Remove every hit, unless it sits
inside quoted user-interface text or code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like' \
  -e '\bI tried\b|\bat first\b|\bafter that\b' \
  <report-file>
```
