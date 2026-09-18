# Quality checklist

Run every check over the draft before showing it to the user. A single failure
blocks delivery. Fix the failure, or return to the step that owns the missing
fact, then run the whole checklist again.

## Ambiguity

- [ ] No banned words in the task or in any subtask: `TBD`, `TBC`, `TODO`,
      `maybe`, `might`, `probably`, `possibly`, `perhaps`, `ideally`,
      `consider`, `could`, `should we`, `if needed`, `if necessary`,
      `as appropriate`, `as needed`, `etc`, `and so on`, `or similar`,
      `something like`.
- [ ] No question marks anywhere, except inside quoted user-interface text or
      code.
- [ ] No alternatives in Approach, Decisions, or Changes: no
      `option A / option B`, no `either ... or`, no `one of`.
- [ ] Every quantity is a number with a unit. No `fast`, `small`, `large`,
      `reasonable`, `a few`.
- [ ] Every named thing is specific: file path, symbol, endpoint, table,
      environment variable, command. No `the service`, `the config`,
      `the relevant tests`, `the usual place`.

## Behavior and contract

- [ ] No subtask adds a feature, fixes a bug, or tunes performance.
- [ ] Every wrong-looking behavior in the refactor scope is under *Out of
      scope*, with its location and the statement that it stays.
- [ ] Every part of the contract listed in Step 2 has a success criterion that
      keeps its name, signature, and format. A change that the request names
      is the only exception, and Approach states it.
- [ ] No subtask deletes, skips, or loosens a test, a lint rule, or a type
      check. An existing test changes only in an import, a path, or a symbol
      name that a refactoring moves or renames. No assertion changes.
- [ ] Every file a subtask changes is in the refactor scope, or hard rule 6
      allows it and the subtask's Context says why.
- [ ] No subtask touches generated code, vendored code, a lockfile, build
      output, a snapshot file, or a database migration that already ran.
- [ ] No subtask does what a task read in Step 2 lists under *Out of scope*.
- [ ] No subtask adds a dependency, a tool, a configuration file, or a code
      pattern the project does not use.

## Subtask rule

- [ ] Each subtask applies exactly one refactoring named in
      `smell-catalog.md`, and its Context names the smell with its evidence.
- [ ] Each subtask has exactly one verification command. It ran on the
      current code and failed.
- [ ] Each subtask is mergeable on its own: after it, the project builds and
      every test, existing and new, passes.
- [ ] A subtask on uncovered code is from the safe set, or names a
      characterization test file in Changes. That file lists every test case
      and comes before the code it covers.
- [ ] Each named characterization test records a behavior of the code the
      subtask changes: the normal path, a boundary, or an error.
- [ ] Without a test setup, every subtask is from the safe set and no
      subtask names a test or a test framework.
- [ ] A contract change that the request names is three subtasks: add the
      new form, move the callers, remove the old form.
- [ ] Dependencies form a valid order: no cycles, no reference to a subtask
      with a higher number. Remove Dead Code and Rename subtasks come first.

## Measurements

- [ ] Every baseline value in the task's Context section equals the
      measurement summary, the test report, and the coverage report of
      Step 4.
- [ ] Every skipped measurement appears as `skipped` with its reason.
- [ ] No subtask exists only to move a number. Each one names a smell from
      `smell-catalog.md`.
- [ ] The task's success criteria state the test counts and the coverage
      counts against the baseline. The Verification section holds the
      commands that produce them.
- [ ] The scratch directory holds every measurement summary and tool report.
      The repository holds none.

## Completeness

- [ ] Every finding of Step 5 is a subtask or an *Out of scope* entry with
      its reason.
- [ ] Every path and symbol in the Approach, Context, and Changes sections
      exists in the working tree, or carries the mark `(new)`.
- [ ] The task's Subtasks list matches the subtasks written: same count, same
      order, same titles.
- [ ] The union of all subtasks' Changes equals the task's Approach. Nothing
      outside it, nothing missing.
- [ ] The task's Verification lists the commands from 3b, the test command
      with the report options, and the measure command. `Run the tests`
      alone fails this check.
- [ ] No sections beyond the template. No Risks, Considerations,
      Alternatives, Future work, Nice to have, Notes.

## Executability

- [ ] An agent with only the task and the repository can start subtask 1
      without asking anything.
- [ ] An agent with only one subtask and the repository can implement it
      without asking anything and without opening the task. No `see task`,
      `as above`, `same as subtask N`, `as described earlier`.
- [ ] Each acceptance criterion is binary: it is met or not met, and someone
      other than the author can check it.
- [ ] Each subtask stands alone as a ticket: title, task, dependencies, goal,
      context, changes, acceptance criteria, and verification are all
      present.

## Grep helper

Run this over the draft file. Remove every hit, unless it sits inside quoted
user-interface text or code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like|either .* or|one of the' \
  -e 'see task|see parent|as above|same as subtask|as described earlier' \
  <draft-file>
```
