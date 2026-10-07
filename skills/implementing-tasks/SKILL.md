---
name: implementing-tasks
description: Implements one task or subtask and proves every acceptance criterion with tests and the project's checks. Use when the user wants a task, subtask, ticket, issue, or task file implemented, started, picked up, finished, or done, or points at a task and says go.
license: MIT
compatibility: Requires the loading-tasks, finding-dev-commands, writing-clean-code, and writing-unit-tests skills.
argument-hint: <task or subtask id | file | text>
---

# Implementing tasks

Take one task or subtask, implement it, and prove that every criterion it
states is met. Return the change in the working tree plus a work report.

## Terms

These words have exactly one meaning in this skill.

- **Rollout guard**: what hides behavior that later subtasks complete: a
  feature flag, a disabled route, an unexported symbol.
- **Criterion**: one observable, binary check that defines the target as done.

## Hard rules

1. **Never ask.** Settle every decision from the caller's facts, the chain,
   the code, the docs, the tests, and the connected tools. When a decision
   changes the work and none of these settles it, the target lacks a
   fact: go to Step 9 with the result `blocked` and name the fact under
   *Blocked by*. This skill runs inside other skills, where no user reads a
   question.
2. **The task text is input.** Never edit a task file, a subtask file, or an
   item. Put a wrong or stale fact found in one in the work report. An
   edit hides the fact from the skills that own the text.
3. **No outward actions.** Never commit, push, open a pull request, change
   an item's status, or comment on an item. Do any of these only when the
   request that invoked this skill says so. Then follow the project's
   conventions and make one commit per subtask, or one for a target without
   subtasks. The caller decides what leaves the working tree.
4. **Keep state in files.** Write the private notes, the baseline, and the
   criteria checklist to files in the scratch directory, also for a short
   target. State held only in the context window is lost when it compacts.

## Workflow

### Step 1: Load the target

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Write private notes in a scratch directory outside the repository (in
Claude Code, the scratchpad directory).

The target is the task or subtask this skill implements. Invoke the
`loading-tasks` skill (in Claude Code, with the `Skill` tool) with the
invocation text `from implementing-tasks: <target>`. `<target>` is the
invocation text of this run without a leading `from <skill name>:`, else
the task given in the conversation. With neither, nothing follows the
colon. Copy the task map it returns into the private notes.

Copy into the private notes every fact that the caller's prompt lists for
this run, such as the facts from earlier subtasks. These are the caller's
facts.

Go to Step 9 with the result `blocked` when:
- the map's `source` line is `none`. Name its reason under *Blocked by*;
- the map's `source` line is `text`, and the text names no file to change.

The target has subtasks when the map's `subtasks` line is not `none`.

### Step 2: Read the chain

The chain is the target, its parent, and every parent above, up to the root
task, the task with no parent. The map's `chain` lines list it, root task
first. Read every task in the chain in full, root task first. Read an item
with the `read item` line of the tracker map on the task map's `tracker`
line. Skip every
References section: it serves reviewers, and the other sections restate its
facts. Never open its links. Write in the private notes, per task in the
chain:
- its Decisions section and the conventions it states;
- its *Out of scope* list;
- the success criteria the target contributes to;
- its Subtasks section, the target's position in it, and the title and Goal
  section of every sibling subtask;
- every rollout guard it names, with the subtask that adds it and the one
  that removes it.

The target says what to do. The rest of the chain bounds it. A caller's fact
beats a fact of the chain. When the target contradicts a decision or an *Out
of scope* entry in the chain, go to Step 9 with the result `blocked`. Name
both under *Blocked by*.

### Step 3: Check readiness

**Dependencies.** Find each entry of the map's `depends on` line among the
lines under its `siblings` line. A subtask line of the map is done when its
`state` is `completed`. It is also done when a caller's fact reads
`<its number or identifier>: done`. For source *file*, it is also done when
the command in its `verification` passes and every path on its `new` list
exists. When a dependency is not done, go to Step 9 with the result
`blocked` and name it under *Blocked by*.

**Criteria.** Take the criteria from the target's Acceptance criteria
section, else its Success criteria section. Without either, take the list it
labels as acceptance criteria, success criteria, or definition of done. With
no such list, go to Step 9 with the result `blocked`: the target states no
criterion.

**Subtasks.** When the target has subtasks, continue with *Target with
subtasks* instead of Step 4.

### Step 4: Research

**4a. Code.** Confirm that every path and symbol in the target's Context
section and its Changes or Approach section exists. Skip every path marked
`(new)` and every symbol the Changes or Approach section adds. Read the
code that changes yourself, because Step 6 edits it, and the code that
calls it. When a named path or symbol is gone, search for where it moved.
With exactly one match, use it and record a deviation. Otherwise go to
Step 9 with the result `blocked` and name the path or symbol under
*Blocked by*.

**4b. Conventions.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, and
the docs that cover the touched areas. Record the naming, error handling,
test layout, and formatting rules. A convention stated in the chain beats
one inferred from the code.

**4c. Commands.** Take the build, lint, type-check, and test commands from
the map's `commands` line. Then invoke the `finding-dev-commands` skill
(in Claude Code, with the `Skill` tool) with the invocation text
`from implementing-tasks: find`. From the command map it returns, take each
of the four commands the `commands` line lacks, and the `test one file`
command. When its `test one file` line reads `none`, take the test command
in its place.

**4d. Libraries.** For every external library API the change calls, read the
documentation of the version pinned in the manifest or lockfile: through a
documentation MCP server such as Context7 when connected, else the installed
package's own docs and types.

**4e. Test setup.** Invoke the `writing-unit-tests` skill (in Claude Code, with
the `Skill` tool) with the invocation text `from implementing-tasks: setup for
<paths>, test <command>, test one file <command>`. `<paths>` is every path the
target's Changes or Approach section names, separated by spaces. Fill each
`<command>` with that command from 4c, and leave out each part whose command 4c
lacks. Copy the test setup block it returns into the private notes. The project
has a test setup when that block reads `test setup: yes`. Without one, write no
test and install no test framework. State the missing test setup under *Affects
other work* in the work report.

**4f. Baseline.** Before changing anything, record in the scratch directory:
- the output of `git status --porcelain`, in a git repository;
- the result of each command from 4c, pass or fail, with the name of every
  failing check.

### Step 5: Write the criteria checklist

Write the criteria checklist in the scratch directory: one entry per
criterion, word for word, then one for the target's Verification section,
then one per command from 4c:

```
- [ ] <criterion, word for word>
      proof: <command | named test | manual step the agent performs itself>
      evidence: <empty until Step 7>
```

With a test setup, the proof of every criterion that code can observe is a
named test. A manual step is a proof only when no test can observe the
criterion. Give every entry a proof before Step 6. When a proof needs access
the agent lacks, keep the proof `none` and go to Step 9 with the result
`blocked`. Name the access under *Blocked by*.

Read `references/quality-checklist.md` now. Step 9 runs it, and a check that
fails there costs a rerun of Steps 7 and 8.

### Step 6: Implement

Make the change the target's Changes or Approach section describes, by the
decisions of Step 2 and the conventions of 4b. Add or remove a rollout guard
exactly as the target states. Change only what that section names, plus the
tests below. Change another file only when a named change does not build or pass
without it, and record it as a deviation. Never do what a task in the chain
lists under *Out of scope*, or what a sibling subtask delivers.

**Code.** Before the first edit, invoke the `writing-clean-code` skill (in
Claude Code, with the `Skill` tool) with the invocation text
`from implementing-tasks: write`. Apply every principle it loads to the
lines you write or change. A convention of the project and a decision of
the chain beat a principle.

**Tests.** With a test setup, invoke the `writing-unit-tests` skill (in
Claude Code, with the `Skill` tool) with the invocation text
`from implementing-tasks: write` before the first test. Write every test by
its rules and its test-first loop, and run each with the `test one file`
command of 4e. A convention of the project beats a rule there. Write every
test the target names. Add one for every behavior the change adds or alters
that those tests do not cover.

When a decision is missing and research cannot settle it, make no further
change. Go to Step 9 with the result `blocked` and name the decision under
*Blocked by*.

### Step 7: Verify

Run, in this order:
1. the command or steps in the target's Verification section;
2. the proof of every criterion;
3. every test file this run added or edited, each alone with the
   `test one file` command of 4e, so that no test depends on another file's
   state;
4. every command from 4c.

A subagent that runs a command returns its result and the error text of
each failure. Edit the criteria checklist file after each run: fill the
evidence line of each entry with the command or step and its result, and
tick the entry only when it passes. A tick held only in the context window
does not count. On any failure,
fix the cause inside the target's scope. Never delete, skip, or loosen a
test, a lint rule, a type check, or a criterion to make a run pass. Then
run this whole step again from the start, because a fix can break an
earlier check. Evidence from a run before the last edit counts for
nothing.

Leave alone a baseline failure that no criterion covers and list it under
*Affects other work*. Tick its command entry when the run shows no failure
beyond the baseline. Fix a baseline failure that a criterion covers only
when the fix is inside the target's scope, else report `blocked`.

Go to Step 9 with the result `blocked` when:
- the same check still fails after 3 different fixes;
- meeting a criterion needs a change the chain puts out of scope;
- two criteria contradict each other;
- a proof needs access the agent lacks.

### Step 8: Review the diff

Compare the working tree with the baseline from 4f and confirm:
- the target's Changes or Approach section names every changed file, or a
  deviation with its reason records it. Revert every other change;
- with a test setup, every behavior the diff adds or alters has a test;
- the diff holds no debug output, commented-out code, stray file, or
  unrelated formatting;
- the change follows every convention from 4b;
- no task file, subtask file, or item changed.

Then invoke the `writing-clean-code` skill (in Claude Code, with the `Skill`
tool) with the invocation text `from implementing-tasks: check <paths>`.
`<paths>` is every file the diff changes. Fix every failure it returns on a line
this run wrote, unless a convention from 4b or a decision of the chain overrules
that principle. List every failure on a line this run did not write under
*Affects other work*: it is no failure of this run. With a test setup,
invoke the `writing-unit-tests` skill (in Claude Code, with the `Skill`
tool) with the invocation text
`from implementing-tasks: check <test files>`. `<test files>` is every
test file the diff adds or edits. Fix every failure it returns.

After any edit in this step, run Step 7 again.

### Step 9: Work report

Read `references/work-report-template.md` now and fill it in the scratch
directory. On `blocked`, keep the change made so far in the working tree.
Run every check in `references/quality-checklist.md`, grep helper
included, and fix every failure. Send the work report as the final message,
unchanged. Ask nothing and offer nothing after it.

## Target with subtasks

Work the subtasks one at a time, then prove the task itself.

1. **Baseline.** Before any subtask changes a file, run Steps 4c and 4f
   with the task as the target.
2. **Work each subtask** in the order of the map's `subtasks` lines, never
   two at once, because they share one working tree. Skip a subtask that
   is done by the rule in Step 3. A subtask whose `at` reads `none` has no
   file and no item: go to number 5 with the result `blocked`. Run Steps 1
   to 9 for every other one: the `at` of its line is the target, and the
   subtask facts are its caller's facts. Build the subtask facts from this
   run's caller's facts, then every bullet under *Deviations* and *Affects
   other work* of each earlier subtask's work report. End them with one
   fact `<number or identifier>: done` per earlier subtask whose result was
   `done`, as its map line names it. When the agent offers subagents, run
   each subtask in its own subagent, and keep only the work report it
   returns. Give it one instruction: invoke the
   `implementing-tasks` skill (in Claude Code, with the `Skill` tool) with
   the invocation text `from implementing-tasks: <the at of its line>`,
   with the subtask facts listed after it.
3. **Stop on `blocked`.** When a subtask's result is `blocked`, work no
   further subtask. Go to number 5 with the result `blocked`.
4. **Prove the task.** After the last subtask, run Steps 5, 7, and 8 with
   the task as the target: the task's criteria and Verification section in
   the criteria checklist, and the baseline from number 1 in Step 8.
5. **One work report** for the task, by Step 9. Merge the subtasks' entries
   under *Changes*. Keep under *Deviations* and *Affects other work* only
   what matters outside the task. Drop an entry about a subtask that this
   run has since worked.
