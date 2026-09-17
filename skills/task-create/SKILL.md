---
name: task-create
description: Explore an idea and turn it into a precise, unambiguous task. Use when the user wants to explore, plan, scope, or spec an idea, feature, change, or refactor before implementing it.
license: MIT
argument-hint: <idea>
---

# Task Create

Turn an idea into a task that a person or an agent can execute without asking a
single question. The task records decisions, not options. It has no
assumptions and no open questions.

## Terms

These words have exactly one meaning in this skill.

- **Idea**: the user's input. A sentence or a paragraph describing a change they
  want.
- **Task**: one unit of work in the task format.
- **Task format**: the sections of a task, in order: Summary, Success
  criteria, Scope, Approach, Decisions, Context, Subtasks, Verification.
- **Subtask**: one commit-sized unit of work inside a task.
- **Task file**: `docs/tasks/###-<task-slug>/task.md`.
- **Tracker**: the project-management server reached through MCP, such as
  Linear, Jira, or GitHub Issues.
- **Item**: a record in the tracker.
- **Topic**: a subject that came up during research or interview. It is either
  brought into scope or listed under Out of scope.
- **Origin**: where a piece of information was taken from: a file path with
  line numbers, an identifier, or a URL.
- **Draft**: the output of this skill before approval, kept in the scratch
  directory.
- **Research notes**: the private file in the scratch directory that holds
  the facts and the open decisions found in Step 2.
- **Open decision**: a decision that research did not settle. Each one becomes
  one question in Step 3.
- **Scratch directory**: a temporary location outside the repository. In Claude
  Code, the session's scratchpad directory. In any other agent, the system temp
  directory.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   The only file this skill writes is the task file in Step 8. Drafts go in
   the scratch directory, never in the repository.
2. **Never ask what research can answer.** Consult code, docs, tests, and
   connected tools before the first question.
3. **Never assume.** When a decision changes the task and research cannot
   settle it, ask the user.
4. **Never leave an open question in the task.** State every decision as a
   fact.
5. **One question at a time.** Write every question in chat in the *Question
   format* below, then end the turn and wait for the answer. Never use an
   agent's built-in question or form tool (in Claude Code, `AskUserQuestion`).
   Questions are plain chat text.
6. **Stay in scope.** Drop side explorations and adjacent ideas. An adjacent
   topic appears in the task only under *Out of scope*, and only when a reader
   would expect it in this task. It appears as a statement that it will not be
   done.
7. **No estimates, priorities, or timelines** unless the user asks for them.
8. **Write nothing before the user approves the full task text** (Step 7).

## Question format

Every question to the user, in every step, uses this exact layout and nothing
else. One question per message. After printing it, end the turn and wait.

```
❓ QUESTION
<question>

📚 CONTEXT
<what research found and what depends on the answer - max of 520 chars>

☑️ OPTIONS
<options, use an ordered list, numbers -> letters -> roman numerals>

👉 MY SUGGESTION
<suggestion - max of 180 chars>
```

- **QUESTION**: one decision, one sentence.
- **CONTEXT**: what research found and what in the task depends on the answer.
  Maximum 520 characters.
- **OPTIONS**: an ordered list. Top level uses numbers (`1.`, `2.`), nested
  levels use letters (`a.`, `b.`), then roman numerals (`i.`, `ii.`). Options
  are concrete and grounded in research: name real files, symbols, values, and
  identifiers. The user answers with a number or with free text.
- **MY SUGGESTION**: the option you recommend and why, in at most 180
  characters. Write `None` only when research gives no basis to prefer one.

## Workflow

### Step 1: Restate the idea

- Take the idea from the text passed with the skill invocation, or from the
  conversation. When there is none, asking for it is the first question.
- Write one sentence in the form: *The idea is to <change> so that <outcome>.*
- Ask the user to confirm or correct that sentence, in the question format.
  Do not start research until it is confirmed.

### Step 2: Research

Goal: learn everything the project and the connected tools can tell you, so that
questions to the user are only about decisions.

**2a. Codebase.** Locate the areas the idea touches and read the actual code,
not only file names. Record, with paths and line numbers:
- entry points, modules, and symbols that will change or be called;
- how similar features are already built (patterns, naming, error handling,
  configuration);
- test conventions and where tests for the touched areas live;
- build, lint, and test commands.
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
  status, labels). Step 3 decides the destination among them and Step 8 uses
  it.
- **Context7**: for every external library or framework the idea depends on,
  resolve the library. Fetch the documentation for the version pinned in the
  project's manifest or lockfile. Record the API facts the task relies on.
- **Other MCP servers** (wikis, design tools, databases): use them when they
  hold facts the task needs.
When an MCP server is not connected, note that and move on. Do not ask the user
to install or connect anything.

**2d. Research notes.** Write the research notes in the scratch directory, in
two parts:
1. *Facts*: what was learned, each with its origin.
2. *Open decisions*: every open decision. Each entry states what is being
   decided and which section of the task it affects.
Part 2 drives Step 3. Do not show the research notes to the user.

### Step 3: Interview, one question at a time

Order the open decisions: scope boundaries first, then behavior, then technical
choices, then delivery details. Delivery details exist only when the task is
saved to the tracker, by the rule in Step 8: which team, project, or board
receives the item, and the values of required fields that research did not
settle.

For each open decision:
- Ask it in chat in the question format, then end the turn and wait for the
  answer.
- QUESTION states the decision. CONTEXT states what in the task depends on it.
- OPTIONS holds 2 to 4 concrete options grounded in research. Write
  `Reuse PaymentService.retry() in src/payments/service.ts:88`, never
  `reuse existing code`.
- MY SUGGESTION names the option you recommend.

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

Never ask two decisions in one question. Never ask an open-ended question such
as "anything else?".

Continue until the open-decisions list is empty.

### Step 4: Scope lock

Print two lists in chat:
- **In scope**: every deliverable of the task.
- **Out of scope**: adjacent topics, each written as
  `<topic>. Not part of this task.` Include only topics that came up during
  research or interview and that a reader would expect in this task. Write
  `None.` when there are none.

Then ask, in the question format, whether the lists are confirmed or need a
change. Repeat until confirmed. Do not write the task before confirmation.

### Step 5: Write the task

Fill every section of `references/task-template.md`. Writing rules:
- Decisions are facts. Write
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`
  Never `We decided that...` and never `Retries should probably...`.
- The *Approach* section names every component that changes, with the path
  and symbol verified in Step 2, and states its behavior after the change.
  Mark new files as `(new)`.
- Success criteria are observable and binary. Someone else can check each one
  and answer yes or no.
- The *Verification* section lists the exact commands or manual steps that
  prove every success criterion.
- The *Subtasks* section contains the single word `None.` This skill never
  writes subtasks.
- Include code only when the exact shape is itself a decision: a schema, an
  interface, a CLI flag, an endpoint signature. Never include implementation
  code.
- Do not add sections beyond the template. No Risks, Considerations,
  Alternatives, Future work, Nice to have, or Notes.

Write the draft in the scratch directory.

### Step 6: Quality check

Run every check in `references/quality-checklist.md`, including the grep helper,
over the draft. Fix every failure. When a failure can only be fixed with
information you do not have, return to Step 3 for that single decision, then
re-run the check. Do not show the task until every check passes.

### Step 7: Approval

Show the complete task text in chat. Then ask, in the question format, whether
the task is approved as written or needs a change. Apply changes, re-run
Step 6, and ask again. Loop until approved. Write nothing before approval.

### Step 8: Save

Save the task to a file when no tracker is connected. Save it to a file also
when the user asked for a file, in the idea or at any point in the
conversation. In every other case save it to the tracker found in Step 2c.
Never ask the user which of the two.

**Saving to the tracker:**
1. Use the destination and required field values decided in Step 3.
2. Create one item. Title: the task title. Body: the approved task, unchanged.

**Saving to a file**, under the repository root, using the numbering rule
below:
1. Collision check: when `docs/tasks/` already holds a folder with the same
   `<task-slug>` under any number, ask one question in the question format:
   overwrite that `task.md` keeping its number, or write a new folder with a
   new number.
2. Write the task file with the approved task, unchanged.

**Numbering rule.** `###` is a zero-padded three-digit sequence starting at
`001`. A task takes the next free number across all folders in `docs/tasks/`.
`<task-slug>` is the task title in kebab-case: lowercase ASCII letters and
digits, with every other run of characters replaced by one hyphen. It is cut
to at most 60 characters and has no leading or trailing hyphen. This layout is
shared with the `task-breakdown` skill, which adds `###-<subtask-slug>.md`
files inside the task's folder.

Finish with one line: the item's identifier and URL, or the path of the task
file. Ask nothing else.
