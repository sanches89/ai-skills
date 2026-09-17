# Quality checklist

Run every check over the draft before showing it to the user. A single failure
blocks delivery. Fix the failure, or return to the interview for the one missing
decision, then run the whole checklist again.

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

## Completeness

- [ ] The open-decisions list from research is empty.
- [ ] Every fact, requirement, and success criterion of the original task
      appears in the task.
- [ ] Every decision recorded during the interview appears in the task's
      Approach or Decisions section. A subtask that applies a decision restates
      it in its Context section.
- [ ] Every success criterion of the task has at least one subtask acceptance
      criterion that covers it.
- [ ] Every path and symbol in the Approach, Context, and Changes sections
      exists, as verified during research, or carries the mark `(new)`.
- [ ] Dependencies form a valid order: no cycles, no reference to a subtask with
      a higher number.
- [ ] The task's Subtasks list matches the subtasks written: same count, same
      order, same titles.
- [ ] The task's Verification lists concrete commands or steps. `Run the tests`
      alone fails this check.

## Subtask rule

- [ ] Each subtask has exactly one verification command, or one numbered manual
      sequence when no command can prove it.
- [ ] Each subtask is mergeable on its own: after it, the project builds and
      every test, existing and new, passes. A guard named in its Context
      section hides the behavior it must not yet expose.
- [ ] Each subtask is one concern. No title contains ` and `. No subtask needs a
      second verification command.
- [ ] No subtask consists only of tests, only of documentation, or only of
      integration or wiring.
- [ ] A later subtask depends on every behavior-free subtask (refactor,
      scaffolding, migration, configuration).
- [ ] Every pair of consecutive subtasks has separate verification. Merge a
      pair that has not.
- [ ] The subtask that completes a guarded behavior removes the guard, and no
      later subtask depends on that guard.

## Scope

- [ ] Every subtask traces to the confirmed restated task or to a confirmed
      in-scope deliverable.
- [ ] The union of all subtasks' Changes equals the task's Approach. Nothing
      outside it, nothing missing.
- [ ] Out of scope contains only topics that came up during research or
      interview and that a reader would expect in this task.
- [ ] No sections beyond the template. No Risks, Considerations, Alternatives,
      Future work, Nice to have, Notes.
- [ ] No estimates, priorities, or timelines unless the user asked for them.

## Executability

- [ ] An agent with only the task and the repository can start subtask 1 without
      asking anything.
- [ ] An agent with only one subtask and the repository can implement it without
      asking anything and without opening the task. No `see task`, `as above`,
      `same as subtask N`, `as described earlier`.
- [ ] Each acceptance criterion is binary: it is met or not met, and someone
      other than the author can check it.
- [ ] Each subtask stands alone as a ticket: title, task, dependencies, goal,
      context, changes, acceptance criteria, and verification are all present.

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
