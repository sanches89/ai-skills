---
name: creating-tasks
description: Writes one task from an idea, feature, bug, or refactor. Use when the user wants work explored, planned, scoped, or turned into a task, ticket, issue, spec, or plan before implementation, even from a one-line idea or a vague remark that something should change.
license: MIT
compatibility: Requires the finding-trackers, finding-dev-commands, formatting-tasks, and saving-tasks skills.
argument-hint: <idea>
---

# Creating tasks

Turn an idea into a task that a person or an agent can execute without asking
a question. Record decisions, not options. The implementing agent asks
nothing and stops on a missing fact: put every fact it needs in the task.

## Hard rules

1. **Read-only on the project.** Write only the task, through the
   `saving-tasks` skill in Step 8. Write drafts in a scratch directory
   outside the repository (in Claude Code, the scratchpad directory),
   written `<scratch-dir>` in paths. A draft inside the repository ends up
   committed beside the code.
2. **Never ask what research can answer.** Consult code, docs, tests, and
   connected tools first. A question the code answers costs the user time
   and invites a guess.
3. **Never assume.** When a decision changes the task and research cannot
   settle it, ask the user. An assumed decision becomes a wrong fact that
   the implementing agent follows without noticing.
4. **Write nothing outside the scratch directory before the user approves
   the full task text** (Step 7). The next skill treats a saved task as
   settled.
5. **Only the idea goes in.** The task holds what the restated idea needs
   and the *Out of scope* entries of Step 4, nothing else. A question or
   remark from the user on any other topic gets an answer in chat and no
   line in the task. When it deserves a task of its own, say so in chat
   and write nothing about it in the task. A stray line in the task
   becomes scope for the implementing agent.

## Workflow

### Step 1: Restate the idea

Take the idea from the invocation text or the conversation. Without one, ask
for it first. Write one sentence: *The idea is to <change> so that
<outcome>.* Ask the user to confirm or correct it before any research.

### Step 2: Research

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

**2a. Codebase.** Read the code the idea touches, not only file names.
Record, with paths and line numbers:
- the entry points, modules, and symbols the change touches or calls;
- how the project builds similar features: patterns, naming, error handling,
  configuration;
- the test conventions and where tests for the touched areas live.

Invoke the `finding-dev-commands` skill (in Claude Code, with the `Skill`
tool) with the invocation text `from creating-tasks: find`. Record the build,
lint, type-check, and test commands of its command map.

**2b. Project docs.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING,
`docs/`, and ADRs. Record the conventions and constraints that affect the
idea. Then read the tasks, plans, and specs that touch the idea, wherever
the repository holds them.

**2c. Tracker and MCP servers.** Invoke the `finding-trackers` skill (in
Claude Code, with the `Skill` tool) with the invocation text
`from creating-tasks: find`. List the other MCP tools of the agent (in
Claude Code they are deferred: search them with `ToolSearch` for
`context7`). Then:
- **Tracker**: when the tracker map names a tracker, search for items
  related to the idea with its `search items` line. Record their
  identifiers.
- **Context7**: for every external library the idea depends on, fetch the
  documentation of the version pinned in the manifest or lockfile. Record
  the API facts the task relies on.
- **Other MCP servers**: use them when they hold facts the task needs.
- **External sources**: every design, document, or wiki page outside the
  repository and the tracker that the user gives or research finds. Read
  each through a connected MCP server, else a web fetch. Record its facts,
  and its name and URL for *References*. When nothing reads it, ask the
  user for the facts it settles.
Never ask the user to install or connect anything.

**2d. Research notes.** Write a private file, `<scratch-dir>/notes.md`, with
two parts:
1. *Facts*: each with the path and line, identifier, or URL it came from.
2. *Open decisions*: every decision research did not settle, with the task
   section it affects.

### Step 3: Interview

Order the open decisions: scope first, then behavior, then technical
choices. Never ask for the team, project, board, or required fields of a
tracker item: the `saving-tasks` skill asks them in Step 8.

For each open decision:
- State it in one sentence, with what in the task depends on it.
- Give 2 to 4 options grounded in research:
  `Reuse PaymentService.retry() in src/payments/service.ts:88`, never
  `reuse existing code`.
- Name the option you recommend.

After each answer, record the decision as a fact in the research notes and
add every new decision the answer creates. Read an external source the
answer gives as Step 2c states. When the answer introduces an
adjacent topic, one a reader would expect in this task, ask one question:
in scope, or under *Out of scope*. Never expand or drop it in silence.

When the user asks a question or makes a remark on any other topic, answer
it in chat and record nothing from it: not in the research notes, not in
the task, not under *Out of scope*. When it deserves a task of its own, say
so in chat once, then go on with the interview.

Never ask about what the code, the docs, or a project convention settles:
follow the convention and record it as a decision. Never ask about a
preference that changes nothing in the task, and never an open-ended
question such as "anything else?". Continue until no open decision remains.

### Step 4: Scope lock

Show two lists in chat and ask the user to confirm or change them. Repeat
until the user confirms:
- **In scope**: every deliverable.
- **Out of scope**: each adjacent topic a reader would expect in this task,
  as `<topic>. Not part of this task.`, or `None.`

### Step 5: Write the task

Add these rules to the research notes, under *Writing rules*:
- In *Approach*, name every component that changes, with the path and symbol
  verified in Step 2, and its behavior after the change.
- In *References*, list every external source of Step 2c.
- Write the single word `None.` in *Subtasks*.
- Make every line serve the restated idea or an *Out of scope* entry. Write
  no remark or question from the conversation on another topic, and no
  mention of another task to create.

Then invoke the `formatting-tasks` skill (in Claude Code, with the `Skill`
tool) with the invocation text
`from creating-tasks: write <scratch-dir>/draft, notes <scratch-dir>/notes.md`.
It fills the draft `<scratch-dir>/draft/task.md` from the research notes.

### Step 6: Quality check

Run every check in `references/quality-checklist.md` over the draft. Then
invoke the `formatting-tasks` skill (in Claude Code, with the `Skill` tool)
with the invocation text `from creating-tasks: check
<scratch-dir>/draft/task.md, notes <scratch-dir>/notes.md`. Fix every failure
of both. When a failure needs a decision, return to Step 3 for that
decision. Treat a `checks: decision needed` line the same way. After every
fix, run both again.

### Step 7: Approval

Show the complete task in chat and ask whether the user approves it as
written or wants a change. Apply each change, run Step 6 again, and ask again
until the user approves.

### Step 8: Save

Invoke the `saving-tasks` skill (in Claude Code, with the `Skill` tool) with
the invocation text `from creating-tasks: task <scratch-dir>/draft/task.md`.
Append `, files` to it when the user asked for a file at any point. Append
`, dir <folder>` to it when the user named a folder for tasks. Append
`, destination <name>` to it when the user named a team, project, or board
for the item. Never ask where to save: the `saving-tasks` skill settles the
store.

### Step 9: Size check

Invoke the `formatting-tasks` skill (in Claude Code, with the `Skill` tool)
with the invocation text
`from creating-tasks: size <scratch-dir>/draft/task.md, tests <tests>`.
`<tests>` is the test locations recorded in Step 2a. When the count is above
500 code lines, show this warning in chat, with the count in place of `<n>`:

```text
Heads up: this task changes about <n> code lines. Reviews go best under
500. The breaking-down-tasks skill splits it into subtasks that aim at 500 code
lines each.
```

Finish with the line the `saving-tasks` skill returned in Step 8, and
nothing else. Ask nothing else.
