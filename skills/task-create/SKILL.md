---
name: task-create
description: Use when the user wants an idea, feature, change, bug, or refactor explored, planned, scoped, or written up as a task, ticket, issue, or spec before implementation. Not for a task that already exists and needs splitting or implementing.
license: MIT
argument-hint: <idea>
---

# Task Create

Turn an idea into a task that a person or an agent can execute without asking a
single question. Record decisions, not options. Leave no assumption and no open
question in the task.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   Write only the task file, in Step 8. Write drafts in a scratch directory
   outside the repository (in Claude Code, the session's scratchpad
   directory; in any other agent, the system temp directory).
2. **Never ask what research can answer.** Consult code, docs, tests, and
   connected tools before the first question.
3. **Never assume.** When a decision changes the task and research cannot
   settle it, ask the user.
4. **Never leave an open question in the task.** State every decision as a
   fact.
5. **Stay in scope.** Drop side explorations and adjacent ideas. Put an
   adjacent topic in the task only under *Out of scope*, and only when a
   reader would expect it in this task. Write it as a statement that it will
   not be done.
6. **No estimates, priorities, or timelines.** Add them only when the user
   asks for them.
7. **Write nothing before the user approves the full task text** (Step 7).

## Workflow

### Step 1: Restate the idea

- Take the idea from the text passed with the skill invocation, or from the
  conversation. When there is none, ask for it as the first question.
- Write one sentence in the form: *The idea is to <change> so that <outcome>.*
- Ask the user to confirm or correct that sentence. Do not start research
  until the user confirms it.

### Step 2: Research

Learn everything the project and the connected tools can tell you, so that you
ask the user only about decisions.

**2a. Codebase.** Locate the areas the idea touches and read the actual code,
not only file names. Record, with paths and line numbers:
- the entry points, modules, and symbols that the change touches or calls;
- how the project builds similar features (patterns, naming, error handling,
  configuration);
- the test conventions and where tests for the touched areas live;
- the build, lint, and test commands.
Use a read-only subagent for broad sweeps when the agent offers one (in Claude
Code, the `Explore` subagent); otherwise search directly. Read files directly
for targeted checks.

**2b. Project docs.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, `docs/`,
ADRs, and existing tasks under `docs/tasks/`. Record conventions and constraints
that affect the idea.

**2c. MCP servers.** List the MCP servers and tools available to the agent. In
Claude Code, MCP tools are deferred, so search them with `ToolSearch` using
keywords like `issue ticket project linear jira notion asana github` and
`context7`. In other agents, the MCP tools are already in the tool list. Then:
- **Tracker** (Linear, Jira, Notion, Asana, GitHub Issues, Trello, ClickUp, or
  any other issue tracker reached through MCP): search for existing items
  related to the idea and record their identifiers. Note which teams,
  projects, or boards exist and which required fields an item needs (type,
  status, labels). Decide the destination among them in Step 3 and use it in
  Step 8.
- **Context7**: for every external library or framework the idea depends on,
  resolve the library. Fetch the documentation for the version pinned in the
  project's manifest or lockfile. Record the API facts the task relies on.
- **Other MCP servers** (wikis, design tools, databases): use them when they
  hold facts the task needs.
When an MCP server is not connected, note that and move on. Do not ask the user
to install or connect anything.

**2d. Research notes.** Write the research notes, a private file in the
scratch directory, in two parts:
1. *Facts*: what you learned, each with the file path and line numbers,
   identifier, or URL it came from.
2. *Open decisions*: every decision that research did not settle. State for
   each the decision to make and the section of the task it affects.
Use part 2 to drive Step 3. Do not show the research notes to the user.

### Step 3: Interview

Order the open decisions: scope boundaries first, then behavior, then technical
choices, then delivery details. Ask delivery details only when the task goes to
the tracker, by the rule in Step 8: which team, project, or board receives the
item, and the values of required fields that research did not settle.

For each open decision:
- State the decision in one sentence. State what in the task depends on it.
- Give 2 to 4 concrete options grounded in research. Write
  `Reuse PaymentService.retry() in src/payments/service.ts:88`, never
  `reuse existing code`.
- Name the option you recommend.

After each answer:
- Record the decision as a fact in the research notes.
- When the answer creates new decisions, add them to the list.
- When the answer or a user remark introduces an adjacent topic, ask one
  question: include it in scope, or list it under *Out of scope*. Never
  silently expand or drop it.

Do not ask about:
- anything the code or docs already answer;
- anything with an established project convention. Follow the convention and
  record it as a decision;
- preferences that change nothing in the task.

Never ask an open-ended question such as "anything else?".

Continue until the open-decisions list is empty.

### Step 4: Scope lock

Print two lists in chat:
- **In scope**: every deliverable of the task.
- **Out of scope**: adjacent topics, each written as
  `<topic>. Not part of this task.` Include only topics that came up during
  research or interview and that a reader would expect in this task. Write
  `None.` when there are none.

Then ask whether the user confirms the lists or wants a change. Repeat until
the user confirms. Do not write the task before confirmation.

### Step 5: Write the task

Fill every section of `references/task-template.md`. Writing rules:
- Write decisions as facts. Write
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`
  Never `We decided that...` and never `Retries should probably...`.
- In the *Approach* section, name every component that changes, with the path
  and symbol verified in Step 2. State its behavior after the change. Mark new
  files as `(new)`.
- Write success criteria that are observable and binary, so that someone else
  can check each one and answer yes or no.
- In the *Verification* section, list the exact commands or manual steps that
  prove every success criterion.
- Write the single word `None.` in the *Subtasks* section. This skill never
  writes subtasks.
- Include code only when the exact shape is itself a decision: a schema, an
  interface, a CLI flag, an endpoint signature. Never include implementation
  code.
- Do not add sections beyond the template. No Risks, Considerations,
  Alternatives, Future work, Nice to have, or Notes.

Write the draft in the scratch directory.

### Step 6: Quality check

Run every check in `references/quality-checklist.md`, including the grep helper,
over the draft. Fix every failure. When only information you do not have can
fix a failure, return to Step 3 for that single decision, then re-run the
check. Do not show the task until every check passes.

### Step 7: Approval

Show the complete task text in chat. Then ask whether the user approves the
task as written or wants a change. Apply changes, re-run Step 6, and ask
again. Loop until the user approves. Write nothing before approval.

### Step 8: Save

Save the task to a file when no tracker is connected. Save it to a file also
when the user asked for a file, in the idea or at any point in the
conversation. In every other case save it to the tracker found in Step 2c.
Never ask the user which of the two.

**Saving to the tracker:**
1. Use the destination and required field values decided in Step 3.
2. Create one item. Use the task title as the title and the approved task,
   unchanged, as the body.

**Saving to a file**: the task file is `docs/tasks/###-<task-slug>/task.md`
under the repository root, by the numbering rule below:
1. Collision check: when `docs/tasks/` already holds a folder with the same
   `<task-slug>` under any number, ask one question: overwrite that `task.md`
   keeping its number, or write a new folder with a new number.
2. Write the task file with the approved task, unchanged.

**Numbering rule.** `###` is a zero-padded three-digit sequence starting at
`001`. Give a task the next free number across all folders in `docs/tasks/`.
Build `<task-slug>` from the task title in kebab-case: lowercase ASCII letters
and digits, with every other run of characters replaced by one hyphen. Cut it
to at most 60 characters and strip a leading or trailing hyphen. The
`task-breakdown` skill shares this layout and adds `###-<subtask-slug>.md`
files inside the task's folder.

Finish with one line: the item's identifier and URL, or the path of the task
file. Ask nothing else.
