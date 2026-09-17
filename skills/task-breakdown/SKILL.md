---
name: task-breakdown
description: Break a task into small, self-contained subtasks, each one a reviewable commit-sized change with its own verification command. Use when the user wants to break down, split, or decompose a task, ticket, or issue into subtasks before implementing it.
license: MIT
argument-hint: <task id | task file | task text>
---

# Task Breakdown

Take one task and split it into subtasks that an agent can implement one at a
time without asking a single question.
The task and every subtask each contain all the information needed to work on
them. Nothing is left as an assumption or an open question.

## Terms

These words have exactly one meaning in this skill.

- **Task**: the unit of work this skill splits. After this skill runs, it is
  written in the task format of `references/task-template.md` with its Subtasks
  section filled.
- **Original task**: the task as received, before this skill adds anything to
  it.
- **Source**: where the task came from. Exactly one of: *server* (an item),
  *file* (a `task.md`), or *text*. The source decides the destination in Step 8.
- **Subtask**: one commit-sized unit of work produced by this skill, in the
  subtask format of `references/task-template.md`. It meets hard rule 9.
- **Breakdown**: the task plus its ordered subtasks. This is what the user
  approves in Step 7.
- **Item**: a record in a project-management server. The task is one item, each
  subtask is a child item of it. The word is never used for anything else.
- **Topic**: a subject that came up during research or interview. It is either
  brought into the task or listed under Out of scope.
- **Origin**: where a fact was taken from: a path with line numbers, an item
  identifier, or a URL.
- **Draft**: the breakdown text before approval, kept in the scratch directory.
- **Research notes**: the private file in the scratch directory that holds
  the facts and the open decisions found in Step 2.
- **Open decision**: a decision the breakdown needs that research did not
  settle. Each one becomes one question in Step 3.
- **Server**: a project-management server reached through MCP.
- **Scratch directory**: a temporary location outside the repository. In Claude
  Code, the session's scratchpad directory. In any other agent, the system temp
  directory.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   The only files this skill may write are the task and subtask files in Step 8.
   Drafts go in the scratch directory, never in the repository.
2. **Never ask what research can answer.** Code, docs, tests, and connected
   tools are consulted before the first question.
3. **Never assume.** If a decision changes any subtask and research cannot
   settle it, ask the user.
4. **Never leave an open question** in the task or in a subtask. Every decision
   is stated as a fact.
5. **One question at a time.** Every question is written in chat using the
   *Question format* below, then the turn ends and waits for the answer. Never
   use an agent's built-in question or form tool (in Claude Code,
   `AskUserQuestion`). Questions are plain chat text.
6. **Stay in scope.** The subtasks together deliver exactly the task, nothing
   more. An adjacent topic appears only under the task's *Out of scope*, only
   when a reader would expect it to be part of this task, and only as a
   statement that it will not be done.
7. **No estimates, priorities, or timelines** unless the user asks for them.
8. **Nothing is created or written before the user approves the full breakdown
   text** (Step 7).
9. **Subtask rule.** A subtask is one reviewable change with a single
   verification command, mergeable on its own: after it is merged, the project
   builds and every test, existing and new, passes.

## Question format

Every question to the user, in every step, uses this exact layout and nothing
else. One question per message. After printing it, end the turn and wait.

```
❓ QUESTION
<question>

📚 CONTEXT
<concise context - max of 520 chars>

☑️ OPTIONS
<options, use an ordered list, numbers -> letters -> roman numerals>

👉 MY SUGGESTION
<suggestion - max of 180 chars>
```

- **QUESTION**: one decision, one sentence.
- **CONTEXT**: what research found and what in the breakdown depends on the
  answer. Maximum 520 characters.
- **OPTIONS**: an ordered list. Top level uses numbers (`1.`, `2.`), nested
  levels use letters (`a.`, `b.`), then roman numerals (`i.`, `ii.`). Options
  are concrete and grounded in research: name real files, symbols, values, and
  identifiers. The user may answer with a number or with free text.
- **MY SUGGESTION**: the option you recommend and why, in at most 180
  characters. Write `None` only when research gives no basis to prefer one.

## Workflow

### Step 1: Load the task

Resolve the text passed with the skill invocation, or the task given in the
conversation, as one of:
- **An item identifier or URL** (for example `PAY-212`, `#128`, an issue link).
  Source: *server*. Fetch the item and its existing children. If no server is
  connected, ask one question using the question format: give the task as a task
  file path or as text.
- **A task file** `docs/tasks/###-<task-slug>/task.md`. Source: *file*. Read it
  and any `###-*.md` subtask files already in the folder.
- **Free text**, or the path of any other file, whose content is then the
  text. Source: *text*. The text is the task.
- **Nothing**: asking for the task is the first question.

If the task already has subtasks (children of the item, files in the folder, or
entries other than `None.` in its Subtasks section), ask one question using the
question format: replace them, or abort. Replace means the existing subtasks are
deleted in Step 8, or closed when the server cannot delete. On abort, stop.

Write one sentence in the form: *The task is to <change> so that <outcome>.* Ask
the user to confirm or correct it, using the question format. Do not start
research until it is confirmed.

### Step 2: Research

Goal: learn everything the project and the connected tools can tell you, so that
questions to the user are only about decisions.

**2a. The original task.** Read it in full. Every decision, success criterion,
and scope statement it contains is a fact and is never asked again.

**2b. Codebase.** Locate the areas the task touches and read the actual code,
not only file names. Record, with paths and line numbers:
- entry points, modules, and symbols that will change or be called;
- how similar changes are already built (patterns, naming, error handling,
  configuration, feature guards);
- test conventions, where tests for the touched areas live, and the command that
  runs them in isolation;
- build, lint, type-check, and test commands.
Use a read-only subagent for broad sweeps when the agent offers one (in Claude
Code, the `Explore` agent); otherwise search directly. Read files directly for
targeted checks.

**2c. Project docs.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, `docs/`,
ADRs, and other tasks under `docs/tasks/` that touch the same areas. Record
conventions and constraints that affect the task.

**2d. Connected MCP servers.** List the MCP servers and tools available to the
agent. In Claude Code, MCP tools are deferred, so search them with `ToolSearch`
using keywords like `issue ticket project linear jira notion asana github` and
`context7`. In other agents, the MCP tools are already in the tool list. Then:
- **Project-management server**: fetch related items and record their
  identifiers. Note which relation the server uses for children (sub-issue,
  child, parent field) and which fields a child item requires.
- **Context7**: for every external library or framework the task depends on,
  resolve the library and fetch the documentation for the version pinned in the
  project's manifest or lockfile. Record the API facts the subtasks rely on.
- **Other servers**: use them when they hold context the breakdown needs.
If a server is not connected, note that and move on. Do not ask the user to
install or connect anything.

**2e. Research notes.** Write the research notes in the scratch directory, in
two parts:
1. *Facts*: what was learned, each with its origin (path and line, item
   identifier, doc URL).
2. *Open decisions*: every open decision. Each entry states what is being
   decided and which subtask it affects.
Part 2 drives Step 3. Do not show the research notes to the user.

### Step 3: Interview, one question at a time

Order the open decisions: task scope first, then behavior, then technical
choices, then split choices (guards, ordering), then delivery details. Delivery
details exist only when the source is *text* and the breakdown is saved to the
server, by the rule in Step 8: which team, project, or board receives the
items, and the values of required fields that research did not settle.

For each open decision:
- Ask it in chat using the question format, then end the turn and wait for the
  answer.
- QUESTION states the decision. CONTEXT states what in the breakdown depends on
  it.
- OPTIONS holds 2 to 4 concrete options grounded in research. Write
  `Add the retry loop in PaymentService.send() at src/payments/service.ts:88`,
  never `add retries`.
- MY SUGGESTION names the option you recommend.

After each answer:
- Record the decision as a fact in the research notes.
- If the answer creates new decisions, add them to the list.
- If the answer or a user remark introduces an adjacent topic, ask one question:
  include it in the task, or list it under *Out of scope*. Never silently expand
  or drop it.

Do not ask about:
- anything the original task, the code, or the docs already answer;
- anything with an established project convention. Follow the convention and
  record it as a decision;
- preferences that change no subtask.

Continue until the open-decisions list is empty.

### Step 4: Split

Produce the subtask list. Every subtask meets the subtask rule (hard rule 9) and
these constraints:
- **One concern.** A subtask that needs two verification commands, or whose
  title needs the word "and", is split again.
- **Ordered by dependency.** Subtask N depends only on subtasks with lower
  numbers. The order is the implementation order.
- **Every subtask is verifiable alone.** If two consecutive subtasks cannot be
  verified separately, merge them.
- **Behavior-free subtasks** (refactor, scaffolding, migration, configuration)
  are allowed only when a later subtask needs them, and they still have a
  verification command.
- **Tests ship with the change they verify.** No subtask consists only of tests,
  only of documentation, or only of "integration" or "wiring".
- **Incomplete behavior stays hidden.** When a subtask would expose behavior
  that later subtasks complete, the subtask includes the guard that hides it
  (feature flag, disabled route, unexported symbol, following the project's
  convention), and the subtask that completes the guarded behavior removes the
  guard. If the project has no guard convention, the guard is an interview
  question in Step 3.
- **Coverage.** Every success criterion of the task maps to at least one
  subtask. The union of the subtasks' Changes equals the task's Approach,
  nothing more.

Then fill the task's Subtasks section and confirm that the task's Verification
section proves the whole task after every subtask is done.

### Step 5: Write

Fill every section of `references/task-template.md` for the task and for each
subtask. Writing rules:
- Decisions are facts. Write
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`
  Never `We decided that...` and never `Retries should probably...`.
- **The task contains everything.** Every fact, requirement, and success
  criterion of the original task is placed in the matching section of the task
  format. Nothing from the original is dropped. Added on top: what research and
  the interview settled, and the ordered subtask list.
- **Each subtask is self-contained.** An agent given only that subtask and the
  repository can implement it. Restate the decisions and context it needs. Never
  write `see task`, `as above`, or `same as subtask 2`.
- Include the file paths and symbol names verified in Step 2. Mark new files as
  `(new)`.
- *Changes* names the functions to add or change, their inputs and outputs, and
  the behavior on error. Include code only when the exact shape is itself a
  decision: a schema, an interface, a CLI flag, an endpoint signature. Never
  include implementation code.
- Acceptance criteria are observable and binary. Someone else can check each one
  and answer yes or no.
- *Verification* of a subtask is exactly one command, or one numbered manual
  sequence when no command can prove it.
- Do not add sections beyond the template. No Risks, Considerations,
  Alternatives, Future work, Nice to have, or Notes.

Write the draft in the scratch directory.

### Step 6: Quality check

Run every check in `references/quality-checklist.md`, including the grep helper,
over the draft. Fix every failure. If a failure can only be fixed with
information you do not have, return to Step 3 for that single decision, then
re-run the check. Do not show the breakdown until every check passes.

### Step 7: Approval

Show the complete breakdown in chat: the task followed by every subtask. Then
ask, using the question format, whether it is approved as written or needs a
change. Apply changes, re-run Step 6, and ask again. Loop until approved.
Nothing is created or written before approval.

### Step 8: Save

The destination follows the source:
- Source *server*: save to the server, into the same item.
- Source *file*: save to files, into the same task folder.
- Source *text*: save to files in a new task folder when the user asked for
  files, in the task text or at any point in the conversation, or when no
  server is connected. In every other case save to the server, using the
  destination decided in Step 3. Never ask the user which of the two.

**Saving to the server:**
1. Source *server*: replace the item's body with the approved task and keep its
   title unless a decision changed it. Source *text*: create the task as a new
   item with the approved title and body.
2. If subtasks are being replaced, delete the existing children, or close them
   when the server cannot delete.
3. Create one child item per subtask, in order, so that later children can
   reference earlier siblings by their created identifiers. Title: the subtask
   title. Body: the approved subtask, with the task's item link on the `Task`
   line and sibling item links on the `Depends on` line. Link each child to the
   task's item using the server's relation. If the server has no parent-child
   relation, put child links in the task's body and the task's link in each
   child body.
4. Update the task's Subtasks section with the child links.

**Saving to files**, under the repository root, using the numbering rule below:
1. Task folder: source *file* reuses the existing `docs/tasks/###-<task-slug>/`.
   Source *text* creates a new folder with the next free number.
2. Task: `docs/tasks/###-<task-slug>/task.md` with the approved task. For source
   *file* this replaces the previous `task.md`, whose every fact the approved
   text contains.
3. Subtasks: `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`, numbered `001`
   upward in subtask order. When replacing, delete the previous `###-*.md` files
   in the folder first. The `Task` line links to `./task.md`, the `Depends on`
   line links to the sibling files, and the task's Subtasks section links to
   each subtask file.

**Numbering rule.** `###` is a zero-padded three-digit sequence starting at
`001`. A task takes the next free number across all folders in `docs/tasks/`.
Subtasks take the next free numbers inside their task folder. A slug is a title
in kebab-case: lowercase ASCII letters and digits, every other run of
characters replaced by one hyphen, cut to at most 60 characters, without a
leading or trailing hyphen. `<task-slug>` comes from the task title,
`<subtask-slug>` from the subtask title. This layout is shared with the
`task-create` skill, which writes `docs/tasks/###-<task-slug>/task.md`.

Finish with a short recap: every item identifier and URL created or updated, or
every path written, and the number of subtasks. Ask nothing else.
