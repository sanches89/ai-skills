---
name: formatting-tasks
description: Writes and checks task and subtask text in the one format that agents implement without asking, and counts the code lines a change touches. Use when a task, subtask, ticket, spec, or plan needs drafting, checking against the format, or sizing in code lines.
license: MIT
compatibility: The line count needs cloc on PATH, or Node.js with npx, Perl 5, and network access on the first run; a missing tool leaves the count to the agent.
argument-hint: <draft path | text to format>
---

# Formatting tasks

Write a task and its subtasks in the one task format, check them, and count
the code lines their change touches. The implementing agent asks nothing and
stops on a missing fact: every fact it needs goes in the text. This skill
saves nothing: the caller or the user saves the drafts.

Write drafts in a scratch directory outside the repository (in Claude Code,
the scratchpad directory), written `<scratch-dir>` in paths. A caller may
pass its own folder.

## Hard rules

1. **Write only drafts.** Write and fix only files in the scratch directory
   and a file the user asked to change. The project stays read-only. A
   write elsewhere lands beside the code without review.
2. **Never assume.** When a check fails for a fact or a decision that the
   research notes and the drafts lack, record a decision needed. Never fill
   the gap. A guessed decision becomes a wrong fact that the implementing
   agent follows without noticing.
3. **Keep every heading.** Never rename, add, or drop a heading of
   `references/task-format.md`. The `loading-tasks`, `saving-tasks`,
   `creating-tasks`, `breaking-down-tasks`, `implementing-tasks`,
   `orchestrating-tasks`, and `refactoring-code` skills find each section by
   its heading. A renamed heading hides its section from them.

## Invocation

When the invocation text starts with `from <skill name>:`, that skill
invoked this run. Ask nothing, follow the form the text names, and end with
the return block of that form and nothing else:
- `from <caller>: write <draft folder>, notes <notes path>[, subtasks
  <count>]`: Step 2 fills `<draft folder>/task.md` and, with `subtasks`,
  `<draft folder>/subtask-<n>.md` for each `<n>` from 1 to `<count>`. Then
  Step 3 checks them.
- `from <caller>: check <draft path>..., notes <notes path>`: Step 3 checks
  the drafts.
- `from <caller>: size <draft path>...[, tests <test folders and files>]`:
  Step 4 counts the code lines of each draft.

`<notes path>` is the file that holds the caller's research notes: the
facts with their origins, the decisions, the subtask list in order, and the
caller's own writing rules under *Writing rules*.

Return block of `write` and `check`, with one `checks` line per decision
needed:

```text
drafts: <paths in order>
checks: pass | decision needed: <the decision and the section it affects>
```

Return block of `size`, one line per draft:

```text
<path>: <n> code lines
```

Without that prefix, a user invoked this run. Step 1 takes the form from
the request, and Step 5 shows the result in chat.

## Workflow

### Step 1: Take the form

An invocation from a skill names the form. A request from a user maps to
one form:
- facts, a plan, or a ticket to put in the format: `write`, into
  `<scratch-dir>/task-draft/`, with `subtasks <count>` when the request
  lists subtasks;
- a task or a subtask, as a file or as text, to check against the format:
  `check`. Write text into a draft file in `<scratch-dir>` first;
- a question about the size of a change: `size`.

Run the forms a request names in the order write, check, size. Without a
request, ask for the draft or the text first. For a user, the request and
the conversation are the research notes.

### Step 2: Write the drafts

Read `references/task-format.md` now. Read the research notes: the file at
`<notes path>`, or for a user, the request and the conversation. Fill the
Task block into `<draft folder>/task.md`. With `subtasks <count>`,
fill the Subtask block into `<draft folder>/subtask-<n>.md`, one file per
subtask in order. Without `subtasks`, write the single word `None.` in the
task's Subtasks section.

Apply the writing rules below, then every rule under *Writing rules* in the
research notes. A rule of the notes adds to these and never replaces one.
- Write decisions as facts:
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`, never
  `We decided that...` or `Retries should probably...`.
- Use the paths and symbols verified in research. Mark new files `(new)`.
- Make each subtask self-contained: an agent given only that subtask and
  the repository can implement it. Restate every decision and fact it
  needs. Never write `see task`, `as above`, or `same as subtask 2`.
- In *Changes*, name every function to add or change, with its inputs and
  outputs.
- Include code only when its exact shape is a decision: a schema, an
  interface, a CLI flag, an endpoint signature. Never implementation code.
- Write success criteria and acceptance criteria that are binary: someone
  else can answer yes or no.
- In a subtask's *Verification*, write exactly one command.
- In *References*, give every entry its name, its URL, and what it
  settles. Write `None.` when there is none.
- Add no section beyond the format: no Risks, Considerations, Alternatives,
  Future work, Nice to have, or Notes. Add no estimate, priority, or
  timeline unless the user asked for them.
- Make every line serve the requested change or an *Out of scope* entry.
  Write no remark or question from the conversation on another topic, and
  no mention of another task to create.
- Write at most 25 words per sentence, and only lines the implementing
  agent needs.

### Step 3: Run the checks

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Read `references/quality-checklist.md` now. Run every check and both grep
helpers over each draft. Fix every failure that the research notes or the drafts
settle, then run every check again. Repeat until every check passes or every
failure left needs a decision. Record each such decision with the section it
affects.

Fix a failure in place only in a draft in the scratch directory or in a
file the user asked to change. Leave every other failure unfixed for Step 5
to show.

### Step 4: Count the code lines

Read `references/line-count.md` now. The test locations are the folders and
files after `tests`. Without `tests`, take them from the Context and
Decisions sections of the draft.

For each draft, estimate the code lines its change adds, removes, or
modifies, outside the test locations. The change of a task is its Approach
section, and the change of a subtask is its Changes section. Count the
files the change deletes or rewrites with the count tool instead of an
estimate.

The size target is 500 code lines per task without subtasks and per
subtask. 500 is a target for small reviews, not a cap: the caller decides
what a count above it changes.

### Step 5: Return

From a skill, end with the return block of the form and nothing else.

From a user, show in chat:
- `write`: the draft paths and the full text of every draft;
- `check`: each fix made, and each failure left as `<path:line> <check>`;
- `size`: one line per draft, `<path>: <n> code lines`, and the name of
  each draft above 500 code lines.

Then ask the user one question per decision needed. Apply each answer to
the drafts, and run Step 3 again.
