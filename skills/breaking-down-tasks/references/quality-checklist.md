# Quality checklist

Run every check over the drafts before showing them. These checks cover what
this skill adds to the task format. One failure blocks delivery. Fix it, or
return to Step 3 for the missing decision, then run the whole checklist
again.

## Completeness

- [ ] The open-decisions list is empty.
- [ ] Every fact, requirement, and success criterion of the original task is
      in the task.
- [ ] Every interview decision is in the task's Approach or Decisions, and
      every subtask that applies it restates it in its Context.
- [ ] Every success criterion of the task has a subtask acceptance criterion
      that covers it.
- [ ] The task's References holds every entry of the original task.
- [ ] Each subtask's References lists only the task's entries whose facts
      its Context restates, or holds exactly `None.`

## Subtask rule

- [ ] Each subtask has exactly one verification command, or one numbered
      manual sequence, and no ` and ` in its title.
- [ ] Each subtask above 500 code lines, as Step 4 counts, has no split
      whose parts meet every other constraint of Step 4.
- [ ] Each subtask is mergeable on its own: after it, the project builds and
      every test passes. A guard in its Context hides incomplete behavior.
- [ ] No subtask depends on a subtask with a higher number.
- [ ] No subtask is only tests, only documentation, or only wiring. A later
      subtask depends on every behavior-free subtask.
- [ ] Two consecutive subtasks have separate verification.
- [ ] The subtask that completes a guarded behavior removes the guard, and
      no later subtask depends on that guard.

## Scope

- [ ] The union of all subtasks' Changes equals the task's Approach. Nothing
      outside it, nothing missing.
- [ ] Out of scope holds only topics from research or interview that a
      reader would expect in this task.
- [ ] Every line serves the original task or an *Out of scope* entry: no
      remark or question from the conversation on another topic, no
      mention of another task to create.

## Executability

- [ ] Each subtask's Changes names every file to change and the functions
      to add or change. It names their inputs, outputs, and behavior on
      error.
- [ ] No subtask contradicts a decision or an *Out of scope* entry of the
      task.
