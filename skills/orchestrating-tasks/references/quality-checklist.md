# Quality checklist

Run every check and the grep helper before returning the orchestration
report. This skill answers the checks under *Run* from the run itself,
before the report is written. The subagent that writes the report answers
every other check from the orchestration record, the target, git, and the
report. One failure blocks delivery. Fix it, then run the whole checklist again.
Outside a git repository, skip every check that names a commit or a
branch.

## Run

- [ ] No question went to the user beyond the tree question of Steps 2
      and 3.
- [ ] Every fact in the orchestration record went into the prompt of every
      job run after it was added.
- [ ] No two jobs ran at once. After every job, `git status --porcelain`
      in `<tree>` listed no path beyond the job's start but the
      orchestration record.
- [ ] Every read of a task, an item, a manifest, or a doc ran in a
      subagent when the agent offered one.
- [ ] Every build, lint, type-check, test, and Verification command ran in
      a subagent when the agent offered one.
- [ ] At most three rounds ran, and a round that wrote no task ended
      the loop.
- [ ] The Verification of the target and of every refactor task, and every
      command on the `baseline` line, ran after the last commit.
- [ ] No push or pull request. No status change or comment beyond the
      rules of Step 1, unless the request asked.

## Plan

- [ ] Every subtask of the target and of every refactor task has a job.
      Each job comes after every job on its `Depends on` line.

## Jobs

- [ ] Every `done` job has a commit that
      `git log --oneline <base commit>..<branch>` lists.
- [ ] Every job after a `blocked` job is `pending`.

## Proof

- [ ] `done` only when every job is `done` or `skipped` and the proof
      passed.

## Orchestration record

- [ ] The orchestration record holds the plan and every work report, in
      the first place that Step 1 names.
- [ ] Every job's state in the orchestration record matches its result.

## Scope

- [ ] No task file, subtask file, or item body changed.
- [ ] The run changed no project code outside the jobs' commits. It
      committed no file outside them but the orchestration record and the
      refactor tasks.

## Report

- [ ] The headings are exactly those of
      `orchestration-report-template.md`. *Blocked by* exists only on
      `blocked`.
- [ ] The counts on the *Jobs* line equal the states in the *Jobs* section,
      and every hash exists on the branch.
- [ ] At most 50 non-blank lines, 2 lines per bullet, 25 words per
      sentence, `None.` in every empty section.
- [ ] No command output, no prompt, no met criterion, no restated target
      text, no offer or next step.
- [ ] Every path and symbol in the report exists on the branch, or the
      report marks it `(deleted)`.

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
