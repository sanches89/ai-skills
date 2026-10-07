# Target with subtasks

Step numbers are those of `SKILL.md`.

1. **Baseline.** Before any subtask changes a file, run Steps 4c, 4e, and
   4f with the task as the target.
2. **Work each subtask** in the order of the map's `subtasks` lines, never
   two at once. Skip a subtask that is done by the rule in Step 3. A
   subtask whose `at` reads `none` has no file and no item: go to number 5
   with the result `blocked`. Run Steps 1 to 9 for every other one: the
   `at` of its line is the target, and the subtask facts are its caller's
   facts. The subtask facts are, in order:
   - this run's caller's facts;
   - every bullet under *Deviations* and *Affects other work* of each
     earlier subtask's work report;
   - one fact `<number or identifier>: done` per earlier subtask whose
     result was `done`, as its map line names it.

   When the agent offers subagents, run each subtask in its own subagent
   and keep only the work report it returns. Give it one instruction: invoke
   the `implementing-tasks` skill (in Claude Code, with the `Skill` tool)
   with `from implementing-tasks: <the at of its line>`, with the subtask
   facts listed after it. Without subagents, run the subtask yourself and
   write its work report to the scratch directory instead of sending it.

   When the invoking request asks for commits, commit after each subtask
   whose result is `done`, as hard rule 3 states.
3. **Stop on `blocked`.** When a subtask's result is `blocked`, work no
   further subtask. Go to number 5 with the result `blocked`.
4. **Prove the task.** After the last subtask, run Steps 5, 7, and 8 with
   the task as the target: the task's criteria and Verification section in
   the criteria checklist, and the baseline from number 1 in Step 8.
5. **One work report** for the task, by Step 9. Merge the subtasks' entries
   under *Changes*. Keep under *Deviations* and *Affects other work* only
   what matters outside the task. Drop an entry about a subtask that this
   run has since worked.
