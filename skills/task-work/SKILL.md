---
name: task-work
description: Use when the user wants a task, subtask, ticket, or issue implemented, worked on, started, finished, or picked up, given as an item identifier, a task file, a subtask file, or text, including a refactor task written by a code review. Not for writing a task from an idea or splitting one into subtasks.
license: MIT
argument-hint: <task or subtask id | file | text>
---

# Task Work

Take one task or subtask, implement it, and prove that every criterion it
states is met. Return the change in the working tree plus a work report. Put in
the report only what the caller needs to continue the rest of the work.

## Terms

These words have exactly one meaning in this skill.

- **Guard**: what hides behavior that later subtasks complete: a feature flag,
  a disabled route, an unexported symbol.
- **Criterion**: one observable, binary check that defines the target as done.

## Hard rules

1. **The criteria define done.** Report `done` only when every criterion has
   evidence from a run made after the last edit. Report `blocked` in every
   other case. On `blocked`, keep the change made so far in the working tree.
   Never revert it.
2. **Read the chain before changing a file.** Change no project file before
   Step 6.
3. **Stay in scope.** Change only what the target's Changes or Approach section
   names. Change a file the target does not name only when a named change
   does not build or pass without it. Record that file as a deviation. Treat
   the test files that hard rule 5 requires as in scope, not as deviations.
   Never do what any task in the chain lists under *Out of scope*. Never do
   work that belongs to a sibling subtask.
4. **Never weaken a check.** Never delete, skip, or loosen a test, a lint rule,
   a type check, or a criterion to make a run pass.
5. **Tests ship with the change.** When the project has a test setup, give
   every behavior the change adds or alters a test in the same change. Do this
   whether or not the target names tests. Treat the tests the target names as
   the minimum, never the limit. When the project has no test setup, write no
   tests and install no test framework.
6. **Never ask what research can answer.** Consult the chain, the code, the
   docs, and the connected tools before the first question.
7. **Never assume.** When a decision changes the work and research cannot
   settle it, ask the user.
8. **The caller relays questions.** The caller is whoever invoked this skill:
   the user, or the agent that spawned the subagent this skill runs in. When
   the caller is an agent, it relays the question to the user and passes the
   answer back.
9. **The task text is input.** Never edit a task file, a subtask file, or an
   item. Put a wrong or stale fact found in one in the work report.
10. **No outward actions.** Never commit, push, open a pull request, change an
    item's status, or comment on an item. Do any of these only when the
    request that invoked this skill says so. When it does, follow the
    project's conventions for branches and commit messages. Make one commit
    per subtask, or one commit for a target without subtasks.
11. **The work report holds only what the caller needs.** Write no narration,
    no failed attempts, no command output, no restated task text.

## Workflow

### Step 1: Load the target

The target is the task or subtask this skill implements. Resolve the text
passed with the skill invocation, or the task given in the conversation, as
exactly one source:
- **An item identifier or URL** (for example `PAY-212`, `#128`, an issue link)
  in the tracker: an issue tracker reached through MCP, such as Linear, Jira,
  or GitHub Issues. Source: *tracker*. Fetch the item and its children. To
  find the tracker, list the MCP servers and tools available to the agent. In
  Claude Code, MCP tools are deferred, so search them with `ToolSearch` using
  keywords like `issue ticket project linear jira notion asana github`. When
  no tracker is connected, ask one question: give the target as a file path
  or as text.
- **A subtask file**, `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`.
  Source: *file*. Read it.
- **A task file**, `docs/tasks/###-<task-slug>/task.md`. Source: *file*. Read
  it and every subtask file in its task folder.
- **Free text**, or the path of any other file, whose content is then the
  text. Source: *text*. Treat the text as the target.
- **Nothing**: ask for the target as the first question.

The target has subtasks when its task folder holds subtask files, its item has
children, or its Subtasks section holds entries other than `None.`.

### Step 2: Build the chain

The chain is the target, its parent, that parent's parent, up to the root
task, the task with no parent. Walk from the target to the root task:
- Source *file*: the parent of a subtask file is the task file in the same task
  folder, which its `Task` line links to. A task file has no parent.
- Source *tracker*: the parent of an item is the item that the tracker's parent
  relation points to. When the tracker has no parent relation, the parent is
  the item that the `Task` line links to. Fetch it, then fetch its parent,
  until an item has no parent. Stop the walk when an identifier repeats.
- Source *text*: the chain is the target alone.

Read every task in the chain in full, root task first. Write private notes in
a scratch directory outside the repository (in Claude Code, the session's
scratchpad directory; in any other agent, the system temp directory), per
task in the chain:
- its Decisions section and the conventions it states;
- its *Out of scope* list;
- the success criteria that the target contributes to;
- its Subtasks section, the target's position in it, and the title and Goal
  section of every sibling subtask;
- every guard it names, with the subtask that adds it and the subtask that
  removes it.

The target says what to do. The rest of the chain bounds it. When the target
contradicts a decision or an *Out of scope* entry of another task in the chain,
ask one question: which of the two statements holds.

### Step 3: Check readiness

**Dependencies.** For each subtask on the target's `Depends on` line, check
that it is done:
- Source *tracker*: it is done when its item is in a completed status.
- Source *file*: it is done when the command in its Verification section
  passes and every file that its Changes section marks `(new)` exists.
When a dependency is not done, go to Step 9 with the result `blocked` and name
the dependency under *Blocked by*.

**Criteria.** Take the criteria from the target's Acceptance criteria
section, or from its Success criteria section when it has no Acceptance
criteria section. When it has neither section, take them from the list it
labels as acceptance criteria, success criteria, or definition of done. When
it has no such list, write the criteria from its text, each observable and
binary. Then ask the user to confirm them. Repeat until the user confirms.

**Subtasks.** When the target has subtasks, continue with the section *Target
with subtasks* instead of Step 4.

### Step 4: Research

**4a. Code.** Confirm that every path and symbol named in the target's Context
section and in its Changes or Approach section exists. Read the code that
changes and the code that calls it, not only file names. When a named path or
symbol is gone, search for where it moved:
- exactly one match: use it and record a deviation;
- no match, or more than one: ask one question.

**4b. Conventions.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, and the
docs that cover the touched areas. Record the naming, error handling, test
layout, and formatting rules the change follows. Prefer a convention stated in
the chain over one inferred from the code.

**4c. Commands.** Take the build, lint, type-check, and test commands from the
Context sections in the chain. For each command the chain does not give, take
it from the project's manifest, Makefile, CI configuration, or docs.

**4d. Libraries.** For every external library API the change calls, read the
documentation of the version pinned in the project's manifest or lockfile.
Use a documentation MCP server such as Context7 when one is connected.
Otherwise read the installed package's own docs and types.

**4e. Test setup.** The project has a test setup when 4c found a test command
and the repository holds at least one test file. When it has one, record:
- the test framework and its version from the manifest or lockfile;
- where tests for the touched areas live and how test files and test cases are
  named;
- the fixtures, factories, fakes, and helpers the existing tests use;
- the command that runs a single test file;
- which existing tests cover the code that changes.
When it has none, record that. By hard rule 5, write no test then, and state
the missing test setup under *Affects other work* in the work report.

**4f. Baseline.** Before changing anything, record in the scratch directory:
- the output of `git status --porcelain`, when the project is a git repository;
- the result of each command from 4c, pass or fail, with the name of every
  failing check.

### Step 5: Write the criteria checklist

Write the criteria checklist in the scratch directory. Write one entry per
criterion, copied word for word, then one entry for the target's Verification
section, then one entry per command from 4c:

```
- [ ] <criterion, word for word>
      proof: <command | named test | manual step the agent performs itself>
      evidence: <empty until Step 7>
```

With a test setup, use a named test as the proof of every criterion that code
can observe. Use a manual step as a proof only when no test can observe the
criterion.

Give every entry a proof before Step 6 starts. When a proof needs access the
agent lacks, keep the proof `none` and ask the user for the access in one
question. When the user does not grant it, report `blocked`.

### Step 6: Implement

Make the change the target's Changes or Approach section describes:
- follow the decisions recorded in Step 2 and the conventions from 4b;
- write the tests as the *Tests* part of this step states, in the same change
  as the code they cover;
- add or remove a guard exactly as the target states;
- keep hard rule 3: nothing out of scope, nothing a sibling subtask delivers.

**Tests.** With a test setup, read `references/unit-testing.md` before writing
the first test. It holds what to test, how to structure a test, and when to
use a test double. Prefer a convention of the project over that file. Then:
- write every test the target names, plus a test for every behavior the change
  adds or alters that those tests do not cover;
- write each test before the code that makes it pass. Run it with the command
  from 4e and confirm it fails for the expected reason. The expected reason is
  the missing behavior, which includes a symbol that does not exist yet, and
  never a mistake in the test itself. Then write the code and run the test
  again;
- start a bug fix with a regression test;
- write no new test for a change that adds or alters no behavior:
  documentation, comments, configuration values, renames;
- for a refactor of code that no existing test covers, write tests first.
  Confirm they pass before the refactor and after it. Break the asserted
  behavior once to see each test fail, then restore it, as
  `references/unit-testing.md` states;
- edit an existing test only for a behavior the target changes, or for an
  import, path, or symbol name it renames or moves. Never edit an assertion
  for a rename or a move. Fix every other failing test in the code, by hard
  rule 4.

When a decision is missing, research first. When research cannot settle it, ask
one question. Record the answer in the Step 2 notes and, in the work report,
under *Affects other work*.

### Step 7: Verify

Run, in this order:
1. the command or steps in the target's Verification section;
2. the proof of every criterion;
3. every test file this run added or edited, each alone with the command from
   4e, so that no test depends on another file's state;
4. every command from 4c.

Fill the evidence line of each checklist entry with the command or step and its
result. Tick the entry only when it passes. On any failure, fix the cause
inside the target's scope. Then run this whole step again from the start,
because a fix can break an earlier check. Count no evidence from a run made
before the last edit.

Failures already present in the baseline:
- leave alone a baseline failure that no criterion covers and list it under
  *Affects other work*. Tick its command entry when the run shows no failure
  beyond the baseline;
- fix a baseline failure that a criterion covers only when the fix is inside
  the target's scope. Otherwise report `blocked`.

Go to Step 9 with the result `blocked` when:
- the same check still fails after 3 different fixes;
- meeting a criterion needs a change that the chain puts out of scope;
- two criteria contradict each other;
- a proof needs access the agent lacks.

### Step 8: Review the diff

Compare the working tree with the baseline from 4f and confirm:
- the target's Changes or Approach section names every changed file, or a
  deviation with its reason records it. Revert every other change;
- with a test setup, every behavior the diff adds or alters has a test, and
  every new test holds at least one assertion;
- the diff holds no debug output, commented-out code, stray file, or unrelated
  formatting;
- the change follows every convention from 4b;
- no task file, subtask file, or item changed.

After any edit made in this step, run Step 7 again.

### Step 9: Work report

Fill `references/work-report-template.md`. Read that file now: it holds the
format and the rules for what each section keeps and leaves out. Write the
report in the scratch directory. Run every check in
`references/quality-checklist.md` over it, including the grep helper, and fix
every failure.

Send the work report as the final message, unchanged. Ask nothing and offer
nothing after it.

## Target with subtasks

When the target has subtasks, work them one at a time and then prove the task
itself.

1. **Baseline and order.** Before any subtask changes a file, run Steps 4c and
   4f with the task as the target. Then follow the order of the target's
   Subtasks section. When it has none, order the subtasks so that each comes
   after every subtask on its `Depends on` line. Break ties by number or
   identifier, lowest first.
2. **Work each subtask**, in order, never two at the same time, because they
   share one working tree. Skip a subtask that is done by the rule in Step 3.
   For every other subtask, run Steps 1 to 9 with that subtask as the target.
   When the agent offers subagents, run each subtask in its own subagent. Give
   it the subtask's path or identifier and the instruction to use this skill,
   and keep only the work report it returns.
3. **Stop on `blocked`.** When a subtask's result is `blocked`, work no further
   subtask. Go to number 5 with the result `blocked`.
4. **Prove the task.** After the last subtask, run Steps 5, 7, and 8 with the
   task as the target. Put the task's criteria and its Verification section in
   the criteria checklist, and compare in Step 8 with the baseline from
   number 1.
5. **One work report** for the task, by Step 9. Merge the subtasks' entries in
   the report's *Changes* section. Keep in *Deviations* and *Affects other
   work* only entries that matter outside the task. Drop an entry about a
   subtask of this same task that this run has since worked.
