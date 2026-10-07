---
name: breaking-down-tasks
description: Splits an existing task into commit-sized subtasks, each self-contained with one verification command. Use when a task, ticket, or issue is too big for one change, when the user wants it broken down, sliced, phased, or split into steps, or before orchestrating-tasks runs it.
license: MIT
compatibility: Requires the finding-trackers, loading-tasks, finding-dev-commands, formatting-tasks, and saving-tasks skills.
argument-hint: <task id | task file>
---

# Breaking down tasks

Take one task and split it into subtasks that an agent can implement one at a
time without asking a question. The implementing agent asks nothing and
stops on a missing fact: put every fact it needs in the subtask.

## Terms

These words have exactly one meaning in this skill.

- **Guard**: what hides behavior that later subtasks complete: a feature flag,
  a disabled route, an unexported symbol.

## Hard rules

1. **Read-only on the project.** Write only the task and its subtasks,
   through the `saving-tasks` skill in Step 8. Write drafts in a scratch
   directory outside the repository (in Claude Code, the scratchpad
   directory), written `<scratch-dir>` in paths. A draft inside the
   repository ends up committed beside the code.
2. **Never ask what research can answer.** Consult code, docs, tests, and
   connected tools first. A question the code answers costs the user time
   and invites a guess.
3. **Never assume.** When a decision changes a subtask and research cannot
   settle it, ask the user. An assumed decision becomes a wrong fact that
   the implementing agent follows without noticing.
4. **Write nothing outside the scratch directory before the user approves
   the breakdown** (Step 7). The next skill treats a saved subtask as
   settled.
5. **Only the task goes in.** The breakdown holds what the original task
   needs and the *Out of scope* entries, nothing else. A question or
   remark from the user on any other topic gets an answer in chat and no
   line in the breakdown. When it deserves a task of its own, say so in
   chat and write nothing about it in the breakdown. A stray line in a
   subtask becomes scope for the implementing agent.

## Workflow

### Step 1: Load the task

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Take the input from the invocation text, or the task in the conversation.
Without an input, ask for the task first.

Invoke the `loading-tasks` skill (in Claude Code, with the `Skill` tool) with
the invocation text `from breaking-down-tasks: <input>`. Act on the `source`
line of the task map it returns:
- `none: <reason>`: ask one question: give the task as a task file path or
  an item identifier. Then invoke the `loading-tasks` skill again with the
  invocation text `from breaking-down-tasks: <answer>`.
- `text`: end with one line,
  `No task to break down: write the task first with the creating-tasks skill.`
  Write nothing.
- `tracker` or `file`: continue.

Read the target of the task map in full: its file, or its item through the
`read item` line of the tracker map on the map's `tracker` line.

The task already has subtasks when the `subtasks` line of the task map is
not `none`. Then ask one question: replace them, or abort. On replace,
Step 8 replaces them. On abort, end with one line,
`Aborted: the task keeps its subtasks.`, and write nothing.

Write one sentence: *The task is to <change> so that <outcome>.* Ask the user
to confirm or correct it before any research.

### Step 2: Research

**2a. The original task.** Treat every decision, success criterion, and
scope statement in it as a fact. Never ask about it again. Record every
entry of its References section.

**2b. Codebase.** Read the code the task touches, not only file names.
Record, with paths and line numbers:
- the entry points, modules, and symbols the change touches or calls;
- how the project builds similar changes: patterns, naming, error handling,
  configuration, guards;
- the test conventions and where tests for the touched areas live.

Invoke the `finding-dev-commands` skill (in Claude Code, with the `Skill`
tool) with the invocation text `from breaking-down-tasks: find`. Record the
build, lint, type-check, and test commands, and the command that runs one
test file. Take each from the `commands` line of the task map first, else
from the command map.

**2c. Project docs.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING,
`docs/`, and ADRs. Record the conventions and constraints that affect the
task. Then read the tasks, plans, and specs that touch the same areas,
wherever the repository holds them.

**2d. Tracker and MCP servers.** Use the tracker map on the `tracker` line
of the task map. When that line reads `none`, invoke the `finding-trackers`
skill (in Claude Code, with the `Skill` tool) with the invocation text
`from breaking-down-tasks: find`. List the other MCP tools of the agent (in
Claude Code they are deferred: search them with `ToolSearch` for
`context7`). Then:
- **Tracker**: when a tracker map names a tracker, search for items related
  to the task with its `search items` line. Record their identifiers.
- **Context7**: for every external library the task depends on, fetch the
  documentation of the version pinned in the manifest or lockfile. Record
  the API facts the subtasks rely on.
- **Other MCP servers**: use them when they hold facts the breakdown needs.
- **External sources**: every design, document, or wiki page outside the
  repository and the tracker that the user gives or research finds. Read
  each through a connected MCP server, else a web fetch. Record its facts,
  and its name and URL for *References*. When nothing reads it, ask the
  user for the facts it settles.
Never ask the user to install or connect anything.

**2e. Research notes.** Write a private file, `<scratch-dir>/notes.md`, with
two parts:
1. *Facts*: each with the path and line, identifier, or URL it came from.
2. *Open decisions*: every decision research did not settle, with the
   subtask it affects.

### Step 3: Interview

Order the open decisions: task scope first, then behavior, then technical
choices, then split choices (guards, ordering). Never ask for the team,
project, board, or required fields of a tracker item: the `saving-tasks`
skill asks them in Step 8.

For each open decision:
- State it in one sentence, with what in the breakdown depends on it.
- Give 2 to 4 options grounded in research:
  `Add the retry loop in PaymentService.send() at src/payments/service.ts:88`,
  never `add retries`.
- Name the option you recommend.

After each answer, record the decision as a fact in the research notes and
add every new decision the answer creates. Read an external source the
answer gives as Step 2d states. When the answer introduces an
adjacent topic, one a reader would expect in this task, ask one question:
in the task, or under *Out of scope*. Never expand or drop it in silence.

When the user asks a question or makes a remark on any other topic, answer
it in chat and record nothing from it: not in the research notes, not in
the breakdown, not under *Out of scope*. When it deserves a task of its
own, say so in chat once, then go on with the interview.

Never ask about what the original task, the code, the docs, or a project
convention settles: follow the convention and record it as a decision. Never
ask about a preference that changes no subtask. Continue until no open
decision remains.

### Step 4: Split

Produce the subtask list. Every subtask is one reviewable change with one
verification command, mergeable on its own: after it, the project builds and
every test, existing and new, passes. Make every subtask meet these
constraints too:
- **One concern.** Split again a subtask that needs two verification
  commands, or whose title needs the word "and".
- **Size.** Write the title and the planned Changes section of each subtask
  to `<scratch-dir>/draft/subtask-<n>.md`, with `<n>` its number. Invoke the
  `formatting-tasks` skill (in Claude Code, with the `Skill` tool) with the
  invocation text `from breaking-down-tasks: size <paths>, tests <tests>`.
  `<paths>` is those files, and `<tests>` the test locations of Step 2b.
  Split again a subtask above 500 code lines when the parts meet every other
  constraint in this list. Otherwise keep it: 500 is a target for small
  reviews, not a cap, and never a reason to refuse a task.
- **Ordered by dependency.** Subtask N depends only on subtasks with lower
  numbers. The order is the implementation order.
- **Verifiable alone.** When no command can verify two consecutive subtasks
  separately, merge them.
- **Behavior-free subtasks** (refactor, scaffolding, migration,
  configuration): allow one only when a later subtask needs it, with a
  verification command too.
- **Tests ship with the change they verify.** Write no subtask of only
  tests, only documentation, or only "integration" or "wiring".
- **Incomplete behavior stays hidden.** When a subtask would expose behavior
  that later subtasks complete, give it a guard that follows the project's
  convention. Remove the guard in the subtask that completes the behavior.
  Without a guard convention, ask about the guard in Step 3.
- **Coverage.** Map every success criterion of the task to at least one
  subtask. Make the union of the subtasks' Changes sections equal the task's
  Approach section, nothing more.

Then record the ordered subtask list in the research notes, with the title
and the planned Changes section of each subtask. Confirm that the task's
Verification section proves the whole task after the last subtask.

### Step 5: Write

Add these rules to the research notes, under *Writing rules*:
- **The task contains everything.** Place every fact, requirement, and
  success criterion of the original task in the matching section. Add what
  research and the interview settled, and the ordered subtask list.
- In the task's *References*, keep every entry of the original task and add
  every external source of Step 2d.
- In a subtask's *References*, list only the task's entries whose facts
  its Context restates, else `None.`
- In *Changes*, name the functions to add or change, their inputs and
  outputs, and the behavior on error.
- Make every line serve the original task or an *Out of scope* entry. Write
  no remark or question from the conversation on another topic, and no
  mention of another task to create.

Then invoke the `formatting-tasks` skill (in Claude Code, with the `Skill`
tool) with the invocation text `from breaking-down-tasks: write
<scratch-dir>/draft, notes <scratch-dir>/notes.md, subtasks <count>`.
`<count>` is the number of subtasks. It fills the drafts
`<scratch-dir>/draft/task.md` and `<scratch-dir>/draft/subtask-<n>.md` from
the research notes.

### Step 6: Quality check

Run every check in `references/quality-checklist.md` over the drafts. Then
invoke the `formatting-tasks` skill (in Claude Code, with the `Skill` tool)
with the invocation text
`from breaking-down-tasks: check <drafts>, notes <scratch-dir>/notes.md`.
`<drafts>` is the draft paths of Step 5. Fix every failure of both. When a
failure needs a decision, return to Step 3 for that decision. Treat a
`checks: decision needed` line the same way. After every fix, run both
again.

### Step 7: Approval

Show one summary per subtask in chat, in subtask order, and never the task
or a full subtask. A summary holds the number, the title, the `Depends on`
line, the Goal section, the Verification section, and the code-line
count of Step 4. Name each subtask above 500 code lines with the
constraint that every split of it breaks. Name the `<scratch-dir>` path of
the full drafts. Show a subtask in full only when the user asks for it.
Ask whether the user approves the breakdown as written or wants a change.
Apply each change, run Step 6 again, and ask again until the user approves.

### Step 8: Save

Invoke the `saving-tasks` skill (in Claude Code, with the `Skill` tool) with
the invocation text
`from breaking-down-tasks: task <scratch-dir>/draft/task.md, subtasks <subs>`.
`<subs>` is the subtask draft paths in subtask order. Append to it by the
`source` and `kind` lines of Step 1:
- `tracker`: `, replace <identifier>`, with the identifier of the target.
- `file` and kind *task*: `, replace <task folder>, files`, with the folder
  of the target `task.md`.
- `file` and kind *subtask*: `, files`. The subtask becomes a new task
  folder. Append `, dir <folder>` when the user named a folder for tasks.

Never ask where to save: the `saving-tasks` skill settles the store.

Finish with the line the `saving-tasks` skill returns, and nothing else. Ask
nothing else.
