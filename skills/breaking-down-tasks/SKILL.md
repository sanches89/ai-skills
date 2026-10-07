---
name: breaking-down-tasks
description: Splits an existing task into commit-sized subtasks, each self-contained with one verification command. Use when a task, ticket, or issue is too big for one change, when the user wants it broken down, sliced, phased, or split into steps, or before orchestrating-tasks runs it.
license: MIT
compatibility: Requires the finding-trackers, loading-tasks, finding-dev-commands, formatting-tasks, and saving-tasks skills.
argument-hint: <task id | task file>
---

# Breaking down tasks

Split one task into subtasks an agent implements one at a time without asking.
Put every fact the implementing agent needs in the subtask.

## Terms

- **Rollout guard**: what hides behavior that later subtasks complete: a feature
  flag, a disabled route, an unexported symbol.

## Hard rules

1. **Read-only on the project.** Write only the task and its subtasks, through
   the `saving-tasks` skill in Step 8. Write drafts in a scratch directory
   outside the repository (in Claude Code, the scratchpad directory), written
   `<scratch-dir>` in paths.
2. **Never ask what research can answer.** Consult code, docs, tests, and
   connected tools first.
3. **Never assume.** When a decision changes a subtask and research cannot
   settle it, ask the user.
4. **Write nothing outside the scratch directory before the user approves the
   breakdown** (Step 7).
5. **Only the task goes in.** The breakdown holds what the original task needs
   and the _Out of scope_ entries, nothing else. Answer a question or remark on
   any other topic in chat. Record nothing from it: not in the research notes,
   the breakdown, or _Out of scope_. When it deserves a task of its own, say so
   in chat once.

## Workflow

### Step 1: Load the task

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run each read
or command that yields only facts in a subagent. It returns the facts with path
and line.

Take the input from the invocation text or the conversation. Without one, ask
for the task first.

Invoke the `loading-tasks` skill (in Claude Code, with the `Skill` tool) with
`from breaking-down-tasks: <input>`. Act on the `source` line of the task map it
returns:

- `none: <reason>`: ask one question,
  `<reason>. Give the task as a task file path or an item identifier.` Invoke
  the `loading-tasks` skill again with `from breaking-down-tasks: <answer>`.
- `text`: write nothing and end with one line,
  `No task to break down: write the task first with the creating-tasks skill.`
- `file` with `kind` _subtask_: write nothing and end with one line,
  `No task to break down: a subtask file has no subtasks. Break down its task.`
- `tracker`, or `file` with `kind` _task_: continue.

Read the target of the task map in full: its file, or its item through the
`read item` line of the tracker map on the map's `tracker` line.

When the `subtasks` line of the task map is not `none`, ask one question:
replace the subtasks, or abort. On replace, Step 8 replaces them. On abort, end
with one line, `Aborted: the task keeps its subtasks.`, and write nothing.

Write one sentence: _The task is to <change> so that <outcome>._ Ask the user to
confirm or correct it before any research.

### Step 2: Research

**2a. The original task.** Treat every decision, success criterion, and scope
statement in it as a fact, never asked about again. Record every entry of its
References section.

**2b. Codebase.** Read the code the task touches, not only file names. Record,
with paths and line numbers:

- the entry points, modules, and symbols the change touches or calls;
- how the project builds similar changes: patterns, naming, error handling,
  configuration, rollout guards;
- the test conventions and where tests for the touched areas live.

Invoke the `finding-dev-commands` skill with `from breaking-down-tasks: find`.
Record the build, lint, type-check, and test commands, and the command that runs
one test file. Take each from the `commands` line of the task map first, else
from the command map.

**2c. Project docs.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, `docs/`,
ADRs, and the repository's tasks, plans, and specs that touch the same areas.
Record the conventions and constraints that affect the task.

**2d. Tracker and MCP servers.** Use the tracker map on the `tracker` line of
the task map. When that line reads `none`, invoke the `finding-trackers` skill
with `from breaking-down-tasks: find`. List the other MCP tools of the agent (in
Claude Code they are deferred: search them with `ToolSearch` for `context7`).
Then:

- **Tracker**: when a tracker map names a tracker, search for items related to
  the task with its `search items` line. Record their identifiers.
- **Context7**: for every external library the task depends on, fetch the
  documentation of the version pinned in the manifest or lockfile. Record the
  API facts the subtasks rely on.
- **Other MCP servers**: use them when they hold facts the breakdown needs.
- **External documents**: designs, documents, and wiki pages outside the
  repository and the tracker, given by the user or found by research. Read each
  through a connected MCP server, else a web fetch. Record its facts, and its
  name and URL for _References_. When nothing reads it, ask the user for the
  facts it settles.

Never ask the user to install or connect anything.

**2e. Research notes.** Write `<scratch-dir>/notes.md` with two parts:

1. _Facts_: each with the path and line, identifier, or URL it came from.
2. _Open decisions_: every decision research did not settle, with the subtask it
   affects.

### Step 3: Interview

Order the open decisions: task scope, behavior, technical choices, then split
choices (rollout guards, ordering). Never ask for the team, project, board, or
required fields of a tracker item.

For each open decision:

- State it in one sentence, with what in the breakdown depends on it.
- Give 2 to 4 options grounded in research:
  `Add the retry loop in PaymentService.send() at src/payments/service.ts:88`,
  never `add retries`.
- Name the option you recommend.

After each answer, record the decision as a fact in the research notes and add
every new decision the answer creates. Read an external document the answer
gives as Step 2d states. When the answer introduces an adjacent topic, one a
reader would expect in this task, ask one question: in the task, or under _Out
of scope_. Never expand or drop it in silence.

Never ask about what the original task, the code, the docs, or a project
convention settles: follow it and record it as a decision. Never ask about a
preference that changes no subtask. Continue until no open decision remains.

### Step 4: Split

Produce the subtask list. Every subtask is one reviewable change, mergeable on
its own: after it, the project builds and every test passes, except a baseline
failure the task names. Each has one verification command: one line that fails
on the code before the subtask's change and passes after it. It chains at most a
test run and one structural check, such as a search or a file test, with `&&`.
Every subtask also meets these constraints:

- **One concern.** Split again a subtask whose verification needs a second test
  run or a second structural check, or whose title needs the word "and".
- **Size.** Write the title and the planned Changes section of each subtask to
  `<scratch-dir>/draft/subtask-<n>.md`, with `<n>` its number. Invoke the
  `formatting-tasks` skill with
  `from breaking-down-tasks: size <paths>, tests <tests>`. `<paths>` is those
  files, and `<tests>` the test locations of Step 2b. Split again a subtask
  above 500 code lines when the parts meet every other constraint in this list.
  Otherwise keep it. Never refuse a task for its size.
- **Ordered by dependency.** Subtask N depends only on subtasks with lower
  numbers. The order is the implementation order.
- **Verifiable alone.** When no command can verify two consecutive subtasks
  separately, merge them.
- **Behavior-free subtasks** (refactor, scaffolding, migration, configuration):
  allow one only when a later subtask needs it, with a verification command too.
- **Tests ship with the change they verify.** Write no subtask of only tests,
  only documentation, or only "integration" or "wiring".
- **Incomplete behavior stays hidden.** Give a subtask that exposes behavior
  later subtasks complete a rollout guard by the project's convention. Remove it
  in the subtask that completes the behavior. Without a rollout guard
  convention, ask about the rollout guard in Step 3.
- **Coverage.** Map every success criterion of the task to at least one subtask.
  Make the union of the subtasks' Changes sections equal the task's Approach
  section, nothing more.

Record the ordered subtask list in the research notes, with the title and the
planned Changes section of each subtask. Confirm that the task's Verification
section proves the whole task after the last subtask.

### Step 5: Write

Add these rules to the research notes, under _Writing rules_:

- **The task contains everything.** Place every fact, requirement, and success
  criterion of the original task in the matching section. Add what research and
  the interview settled, and the ordered subtask list.
- In the task's _References_, keep every entry of the original task and add
  every external document of Step 2d.
- In a subtask's _References_, list only the task's entries whose facts its
  Context restates, else `None.`
- In _Changes_, name the functions to add or change, their inputs and outputs,
  and the behavior on error.
- Make every line serve the original task or an _Out of scope_ entry.

Invoke the `formatting-tasks` skill with the text below, as one line:

```
from breaking-down-tasks: write <scratch-dir>/draft,
  notes <scratch-dir>/notes.md, subtasks <count>
```

`<count>` is the number of subtasks. It fills the drafts
`<scratch-dir>/draft/task.md` and `<scratch-dir>/draft/subtask-<n>.md`.

### Step 6: Quality check

Run every check in `references/quality-checklist.md` over the drafts. Then
invoke the `formatting-tasks` skill with
`from breaking-down-tasks: check <drafts>, notes <scratch-dir>/notes.md`.
`<drafts>` is the draft paths of Step 5. Fix every failure of both. Return to
Step 3 for a failure that needs a decision, and for a `checks: decision needed`
line. After every fix, run both again.

### Step 7: Approval

Show in chat one summary per subtask, in subtask order: the number, the title,
the `Depends on` line, the Goal section, the Verification section, and the
code-line count of Step 4. Name each subtask above 500 code lines with the
constraint that every split of it breaks. Name the `<scratch-dir>` path of the
full drafts. Never show the task. Show a full subtask only when the user asks
for it. Ask whether the user approves the breakdown as written or wants a
change. Apply each change, run Step 6 again, and ask again until the user
approves.

### Step 8: Save

Invoke the `saving-tasks` skill with
`from breaking-down-tasks: task <scratch-dir>/draft/task.md, subtasks <subs>`.
`<subs>` is the subtask draft paths in subtask order. Append to it by the
`source` and `kind` lines of Step 1:

- `tracker`: `, replace <identifier>`, with the identifier of the target.
- `file` and `kind` _task_: `, replace <task folder>, files`, with the folder of
  the target `task.md`.

Never ask where to save.

Finish with the line the `saving-tasks` skill returns: no other text, no
question.
