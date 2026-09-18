---
name: task-breakdown
description: Use when a task, ticket, issue, or spec already exists and the user wants it broken down, split, or decomposed into subtasks or commit-sized steps, or says it is too big for one change. Not for writing a task from an idea or implementing one.
license: MIT
argument-hint: <task id | task file | task text>
---

# Task Breakdown

Take one task and split it into subtasks that an agent can implement one at a
time without asking a single question. Give the task and every subtask all the
information needed to work on them. Leave nothing as an assumption or an open
question.

## Terms

These words have exactly one meaning in this skill.

- **Guard**: what hides behavior that later subtasks complete: a feature flag,
  a disabled route, an unexported symbol.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   Write only the task file and the subtask files, in Step 8. Write drafts in
   a scratch directory outside the repository (in Claude Code, the session's
   scratchpad directory; in any other agent, the system temp directory).
2. **Never ask what research can answer.** Consult code, docs, tests, and
   connected tools before the first question.
3. **Never assume.** When a decision changes any subtask and research cannot
   settle it, ask the user.
4. **Never leave an open question** in the task or in a subtask. State every
   decision as a fact.
5. **Stay in scope.** Make the subtasks together deliver exactly the task,
   nothing more. Put an adjacent topic only under the task's *Out of scope*,
   and only when a reader would expect it in this task. Write it as a
   statement that it will not be done.
6. **No estimates, priorities, or timelines.** Add them only when the user
   asks for them.
7. **Write nothing before the user approves the full breakdown text**
   (Step 7).
8. **Subtask rule.** Make every subtask one reviewable change with a single
   verification command, mergeable on its own. After merging it, the project
   builds and every test, existing and new, passes.

## Workflow

### Step 1: Load the task

Resolve the text passed with the skill invocation, or the task given in the
conversation, as one of:
- **An item identifier or URL** (for example `PAY-212`, `#128`, an issue link)
  in the tracker: an issue tracker reached through MCP, such as Linear, Jira,
  or GitHub Issues. Source: *tracker*. Fetch the item and its existing
  children. When no tracker is connected, ask one question: give the task as
  a task file path or as text.
- **A task file**, `docs/tasks/###-<task-slug>/task.md`. Source: *file*. Read
  it and every subtask file, `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`,
  already in its task folder.
- **Free text**, or the path of any other file, whose content is then the
  text. Source: *text*. Treat the text as the task.
- **Nothing**: ask for the task as the first question.

The task already has subtasks when its item has children, its task folder
holds subtask files, or its Subtasks section holds entries other than `None.`.
In that case ask one question: replace them, or abort. On replace, delete the
existing subtasks in Step 8, or close them when the tracker cannot delete. On
abort, stop.

Write one sentence in the form: *The task is to <change> so that <outcome>.* Ask
the user to confirm or correct it. Do not start research until the user
confirms it.

### Step 2: Research

Learn everything the project and the connected tools can tell you, so that you
ask the user only about decisions.

**2a. The original task.** Read it in full. Treat every decision, success
criterion, and scope statement it contains as a fact and never ask about it
again.

**2b. Codebase.** Locate the areas the task touches and read the actual code,
not only file names. Record, with paths and line numbers:
- the entry points, modules, and symbols that the change touches or calls;
- how the project builds similar changes (patterns, naming, error handling,
  configuration, guards);
- the test conventions, where tests for the touched areas live, and the
  command that runs them in isolation;
- the build, lint, type-check, and test commands.
Use a read-only subagent for broad sweeps when the agent offers one (in Claude
Code, the `Explore` subagent); otherwise search directly. Read files directly
for targeted checks.

**2c. Project docs.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, `docs/`,
ADRs, and other tasks under `docs/tasks/` that touch the same areas. Record
conventions and constraints that affect the task.

**2d. MCP servers.** List the MCP servers and tools available to the agent. In
Claude Code, MCP tools are deferred, so search them with `ToolSearch` using
keywords like `issue ticket project linear jira notion asana github` and
`context7`. In other agents, the MCP tools are already in the tool list. Then:
- **Tracker**: fetch related items and record their identifiers. Note which
  relation the tracker uses for children (sub-issue, child, parent field) and
  which fields a child item requires.
- **Context7**: for every external library or framework the task depends on,
  resolve the library. Fetch the documentation for the version pinned in the
  project's manifest or lockfile. Record the API facts the subtasks rely on.
- **Other MCP servers**: use them when they hold facts the breakdown needs.
When an MCP server is not connected, note that and move on. Do not ask the user
to install or connect anything.

**2e. Research notes.** Write the research notes, a private file in the
scratch directory, in two parts:
1. *Facts*: what you learned, each with the file path and line numbers,
   identifier, or URL it came from.
2. *Open decisions*: every decision that research did not settle. State for
   each the decision to make and the subtask it affects.
Use part 2 to drive Step 3. Do not show the research notes to the user.

### Step 3: Interview

Order the open decisions: task scope first, then behavior, then technical
choices, then split choices (guards, ordering), then delivery details. Ask
delivery details only when the source is *text* and the breakdown goes to the
tracker, by the rule in Step 8: which team, project, or board receives the
items, and the values of required fields that research did not settle.

For each open decision:
- State the decision in one sentence. State what in the breakdown depends on
  it.
- Give 2 to 4 concrete options grounded in research. Write
  `Add the retry loop in PaymentService.send() at src/payments/service.ts:88`,
  never `add retries`.
- Name the option you recommend.

After each answer:
- Record the decision as a fact in the research notes.
- When the answer creates new decisions, add them to the list.
- When the answer or a user remark introduces an adjacent topic, ask one
  question: include it in the task, or list it under *Out of scope*. Never
  silently expand or drop it.

Do not ask about:
- anything the original task, the code, or the docs already answer;
- anything with an established project convention. Follow the convention and
  record it as a decision;
- preferences that change no subtask.

Continue until the open-decisions list is empty.

### Step 4: Split

Produce the subtask list. Make every subtask meet the subtask rule (hard rule
8) and these constraints:
- **One concern.** Split again a subtask that needs two verification commands,
  or whose title needs the word "and".
- **Ordered by dependency.** Let subtask N depend only on subtasks with lower
  numbers. The order is the implementation order.
- **Every subtask is verifiable alone.** When no command can verify two
  consecutive subtasks separately, merge them.
- **Behavior-free subtasks** (refactor, scaffolding, migration,
  configuration): allow one only when a later subtask needs it, and give it a
  verification command too.
- **Tests ship with the change they verify.** Write no subtask that consists
  only of tests, only of documentation, or only of "integration" or "wiring".
- **Incomplete behavior stays hidden.** When a subtask would expose behavior
  that later subtasks complete, give the subtask a guard that follows the
  project's convention. Remove the guard in the subtask that completes the
  guarded behavior. When the project has no guard convention, ask about the
  guard in Step 3.
- **Coverage.** Map every success criterion of the task to at least one
  subtask. Make the union of the subtasks' Changes sections equal the task's
  Approach section, nothing more.

Then fill the task's Subtasks section and confirm that the task's Verification
section proves the whole task after every subtask is done.

### Step 5: Write

Fill every section of `references/task-template.md` for the task and for each
subtask. Writing rules:
- Write decisions as facts. Write
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`
  Never `We decided that...` and never `Retries should probably...`.
- **The task contains everything.** Place every fact, requirement, and success
  criterion of the original task in the matching section of the task format.
  Drop nothing from the original task. Add what research and the interview
  settled, and the ordered subtask list.
- **Each subtask is self-contained.** Write each subtask so that an agent
  given only that subtask and the repository can implement it. Restate the
  decisions and facts it needs. Never write `see task`, `as above`, or
  `same as subtask 2`.
- Include the file paths and symbol names verified in Step 2. Mark new files as
  `(new)`.
- In the *Changes* section, name the functions to add or change, their inputs
  and outputs, and the behavior on error. Include code only when the exact
  shape is itself a decision: a schema, an interface, a CLI flag, an endpoint
  signature. Never include implementation code.
- Write acceptance criteria that are observable and binary, so that someone
  else can check each one and answer yes or no.
- In the *Verification* section of a subtask, write exactly one command, or
  one numbered manual sequence when no command can prove it.
- Do not add sections beyond the template. No Risks, Considerations,
  Alternatives, Future work, Nice to have, or Notes.

Write the draft in the scratch directory.

### Step 6: Quality check

Run every check in `references/quality-checklist.md`, including the grep helper,
over the draft. Fix every failure. When only information you do not have can
fix a failure, return to Step 3 for that single decision, then re-run the
check. Do not show the breakdown until every check passes.

### Step 7: Approval

Show the complete breakdown in chat: the task followed by every subtask. Then
ask whether the user approves it as written or wants a change. Apply changes,
re-run Step 6, and ask again. Loop until the user approves. Write nothing
before approval.

### Step 8: Save

Choose the destination by the source:
- Source *tracker*: save to the tracker, into the same item.
- Source *file*: save to files, into the same task folder.
- Source *text*: save to files in a new task folder when no tracker is
  connected. Save to files also when the user asked for files, in the task
  text or at any point in the conversation. In every other case save to the
  tracker, using the destination decided in Step 3. Never ask the user which
  of the two.

**Saving to the tracker:**
1. Source *tracker*: replace the item's body with the approved task and keep
   its title unless a decision changed it. Source *text*: create the task as a
   new item with the approved title and body.
2. When replacing subtasks, delete the existing children, or close them when
   the tracker cannot delete.
3. Create one child item per subtask, in order, so that later children can
   link to earlier siblings by their created identifiers. Use the subtask
   title as the title. Use the approved subtask as the body, with the task's
   item link on the `Task` line and sibling item links on the `Depends on`
   line. Link each child to the task's item using the tracker's relation. When
   the tracker has no parent-child relation, put child links in the task's
   body and the task's link in each child body.
4. Update the task's Subtasks section with the child links.

**Saving to files**, under the repository root, by the numbering rule below:
1. Task folder, `docs/tasks/###-<task-slug>/`: for source *file*, reuse the
   existing task folder. For source *text*, create a new task folder with the
   next free number.
2. Task: write the task file, `task.md` in the task folder, with the approved
   task. For source *file*, overwrite the previous task file; the approved
   text contains its every fact.
3. Subtasks: write one subtask file per subtask, `###-<subtask-slug>.md` in
   the task folder, numbered `001` upward in subtask order. When replacing,
   delete the previous subtask files in the task folder first. Link the
   `Task` line to `./task.md` and the `Depends on` line to the sibling files.
   Link the task's Subtasks section to each subtask file.

**Numbering rule.** `###` is a zero-padded three-digit sequence starting at
`001`. Give a task the next free number across all folders in `docs/tasks/`.
Give subtasks the next free numbers inside their task folder. Build a slug
from a title in kebab-case: lowercase ASCII letters and digits, with every
other run of characters replaced by one hyphen. Cut it to at most 60
characters and strip a leading or trailing hyphen. Build `<task-slug>` from
the task title and `<subtask-slug>` from the subtask title. The `task-create`
skill shares this layout and writes the task file.

Finish with a short recap: every item identifier and URL created or updated, or
every path written, and the number of subtasks. Ask nothing else.
