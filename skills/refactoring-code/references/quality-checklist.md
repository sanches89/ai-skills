# Quality checklist

Sections: Behavior and contract; Subtask rule; Measurements; Completeness.

One failure blocks delivery. Fix it, or return to the step that owns the missing
fact, then run the whole checklist again.

## Behavior and contract

- [ ] No subtask adds a feature, fixes a bug, or tunes performance. Every
      wrong-looking behavior is under _Out of scope_ with its location.
- [ ] Every part of the contract in `contract.md` has a success criterion that
      keeps it. The one exception is a change the request names, stated in
      Approach.
- [ ] No subtask deletes, skips, or loosens a test, lint rule, or type check. No
      assertion gets weaker. An assertion changes only by Replace Assertion with
      Literal, or by Replace Test Double with Real Collaborator.
- [ ] Every Remove Dead Code subtask names the proof from the evidence of its
      finding.
- [ ] Every file a subtask changes is in the refactor scope, or is a caller
      moved by a contract change the request names.
- [ ] No subtask touches generated or vendored code, a lockfile, build output, a
      snapshot, or a migration that already ran.
- [ ] No subtask does what a task read in Step 2 lists under _Out of scope_.
- [ ] No subtask adds a dependency, tool, configuration file, or code pattern
      the project does not use.

## Subtask rule

- [ ] Each subtask applies one refactoring its finding names, in the order of
      the finding's `refactoring` line. Its Context names the smell and its
      evidence.
- [ ] Each subtask's verification command ran on the current code and failed.
- [ ] A subtask on uncovered code is from the safe set, or its Changes name a
      characterization test file before the code. That file lists every test
      case: normal path, boundaries, errors.
- [ ] Without a test setup, every subtask is from the safe set and none names a
      test or a test framework.
- [ ] A contract change the request names is three subtasks: add the new form,
      move the callers, remove the old form.
- [ ] Remove Dead Code and Rename subtasks come before every other refactoring
      kind, except a subtask they depend on.
- [ ] At most 12 subtasks. Every finding past the cut is under _Out of scope_ as
      `next batch`, with its location and smell.
- [ ] Every subtask in a test file applies a finding in that test file.
- [ ] A Parameterize seam subtask gives the parameter a default equal to the
      current collaborator. No caller changes in a seam subtask.

## Measurements

- [ ] Every baseline value in Context equals the measurement summary and reports
      of Step 4. Every skipped measurement reads `skipped` with its reason.
- [ ] Success criteria state the test and coverage counts against the baseline,
      and Verification holds the commands that produce them.
- [ ] The repository holds no summary and no tool report.
- [ ] No command in the task or a subtask names the scratch directory. It reads
      `<scratch-dir>`, and the Context section beside it says what
      `<scratch-dir>` is.
- [ ] Every credential found is under _Out of scope_ by location alone. No key,
      token, or password value appears in the task or a subtask.
- [ ] Every finding with refactoring `report` is under _Out of scope_.

## Completeness

- [ ] Every finding of Step 5 is a subtask or an _Out of scope_ entry with its
      reason.
- [ ] The task's Verification lists the commands from 3b, the test command of
      the measurement record, and its measure command.
