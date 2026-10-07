# Quality checklist

Run every check over the drafts before showing them. These checks cover what
this skill adds to the task format. One failure blocks delivery. Fix it, or
return to Step 3 for the missing decision, then run the whole checklist
again.

## Completeness

- [ ] Every fact, requirement, and success criterion of the original task is
      in the task.
- [ ] Every success criterion of the task has a subtask acceptance criterion
      that covers it.
- [ ] The task's References holds every entry of the original task.
- [ ] Each subtask's References lists only the task's entries whose facts
      its Context restates, or holds exactly `None.`

## Subtask rule

- [ ] No subtask title holds ` and `.
- [ ] Each subtask above 500 code lines, as Step 4 counts, has no split
      whose parts meet every other constraint of Step 4.
- [ ] A subtask that exposes incomplete behavior holds a guard in its
      Context.
- [ ] No subtask is only tests, only documentation, or only wiring. A later
      subtask depends on every behavior-free subtask.
- [ ] Two consecutive subtasks have separate verification.
- [ ] The subtask that completes a guarded behavior removes the guard, and
      no later subtask depends on that guard.

## Executability

- [ ] Each subtask's Changes names the functions to add or change, with
      their inputs, outputs, and behavior on error.
- [ ] No subtask contradicts a decision or an *Out of scope* entry of the
      task.
