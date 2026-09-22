# Quality checklist

Run every check and the grep helper before returning the orchestration
report. One failure blocks delivery. Fix it, then run the whole checklist
again. Outside a git repository, skip every check that names a commit or a
branch.

## Plan

- [ ] Every subtask of the target has a job, and each job comes after every
      job on its `Depends on` line.
- [ ] The user approved the plan shown, and every change the user asked
      for is in it.
- [ ] Every fact and every answer in the record went into the prompt of
      every job run after it was recorded.

## Jobs

- [ ] No two jobs ran at once.
- [ ] Every `done` job has a commit that
      `git log --oneline <base commit>..<branch>` lists, and `<tree>` was
      clean before the next job started.
- [ ] Every question a job returned went to the user unchanged, and its
      answer is in the plan.
- [ ] Every job after a `blocked` job is `not started`.

## Proof

- [ ] The target's Verification and every command the baseline records ran
      after the last commit.
- [ ] `done` only when every job is `done` or `skipped` and the proof
      passed.

## Record

- [ ] The record holds the plan, every work report, and the orchestration
      report, in the first place the record rules name.
- [ ] Every job's state in the record matches its result.

## Scope

- [ ] No task file, subtask file, or item body changed.
- [ ] The run changed no project code outside the jobs' commits, and
      committed no file outside them but the record.
- [ ] No push or pull request. No status change or comment beyond the
      record rules, unless the request asked.

## Report

- [ ] The headings are exactly those of
      `orchestration-report-template.md`. *Blocked by* exists only on
      `blocked`.
- [ ] The counts on the *Jobs* line equal the states in the *Jobs* section,
      and every hash exists on the branch.
- [ ] At most 50 non-blank lines, 2 lines per bullet, `None.` in every
      empty section.
- [ ] No command output, no prompt, no met criterion, no restated target
      text, no offer or next step.
- [ ] Every path and symbol in the report exists on the branch.

## Grep helper

Run over the report. Remove every hit outside quoted user-interface text or
code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like' \
  -e '\bI tried\b|\bat first\b|\bafter that\b' \
  <report-file>
```
