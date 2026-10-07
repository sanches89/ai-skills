---
name: formatting-tasks
description: Writes and checks task and subtask text in the one format that agents implement without asking, and counts the code lines a change touches. Use when a task, subtask, ticket, spec, or plan needs drafting, checking against the format, or sizing in code lines.
license: MIT
compatibility: The line count needs cloc on PATH, or Node.js with npx, Perl 5, and network access on the first run; a missing tool leaves the count to the agent.
argument-hint: <draft path | text to format>
---

# Formatting tasks

Write and check a task and its subtasks in the one task format, and count
the code lines their change touches. The implementing agent stops on a
missing fact: every fact it needs goes in the text.

## Hard rules

1. **Write only drafts.** Write and fix only files in the scratch directory
   and a file the user asked to change. The scratch directory lies outside
   the repository, written `<scratch-dir>` (in Claude Code, the scratchpad
   directory), or is a folder the caller passes.
2. **Never assume.** When a check fails for a fact or a decision that the
   research notes and the drafts lack, record a decision needed. Never fill
   the gap.
3. **Keep every heading.** Never rename, add, or drop a heading of
   `references/task-format.md`.

## Invocation

When the invocation text starts with `from <skill name>:`, that skill
invoked this run. Ask nothing and follow the form the text names:
- `from <caller>: write <draft folder>, notes <notes path>[, subtasks
  <count>]`: Step 2 fills `<draft folder>/task.md` and, with `subtasks`,
  `<draft folder>/subtask-<n>.md` for each `<n>` from 1 to `<count>`. Then
  Step 3 checks them.
- `from <caller>: check <draft path>..., notes <notes path>`: Step 3 checks
  the drafts.
- `from <caller>: size <draft path>...[, tests <test folders and files>]`:
  Step 4 counts the code lines of each draft.

`<notes path>` holds the caller's research notes: the facts with their
origins, the decisions, the subtask list in order, and the caller's own
writing rules under *Writing rules*.

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

Without that prefix, a user invoked this run: read `references/user-run.md`
first.

## Workflow

### Step 1: Take the form

An invocation from a skill names the form.

### Step 2: Write the drafts

Read `references/task-format.md` and the research notes. Fill the Task
block into `<draft folder>/task.md`. With `subtasks <count>`, fill the
Subtask block into `<draft folder>/subtask-<n>.md`, one file per subtask in
order. Without `subtasks`, write the single word `None.` in the task's
Subtasks section.

Apply the writing rules below, then every rule under *Writing rules* in the
research notes. A rule of the notes adds to these and never replaces one.
- Write decisions as facts:
  `Retries use exponential backoff from 500 ms, at most 5 attempts.`, never
  `We decided that...` or `Retries should probably...`.
- Use the paths and symbols verified in research.
- Make each subtask self-contained: restate every decision and fact it
  needs. Never write `see task`, `as above`, or `same as subtask 2`.
- Include code only when its exact shape is a decision: a schema, an
  interface, a CLI flag, an endpoint signature. Never implementation code.
- Make every success criterion and acceptance criterion binary: someone
  else can answer yes or no.
- In a subtask's *Verification*, write exactly one verification command, on
  one line. It fails on the code before the subtask's change and passes
  after it. It chains at most a test run and one structural check, such as
  a search or a file test, with `&&`.
- Add no section beyond the format: no Risks, Considerations, Alternatives,
  Future work, Nice to have, or Notes. Add no estimate, priority, or
  timeline unless the user asked for them.
- Make every line serve the requested change or an *Out of scope* entry.
  Write no remark or question from the conversation on another topic, and
  no mention of another task to create.
- Write at most 25 words per sentence, and only lines the implementing
  agent needs.

### Step 3: Run the checks

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in
one each read or command that yields only facts, returned with path and
line.

Read `references/quality-checklist.md`. Run every check and both grep
helpers over each draft. Fix every failure that the research notes or the
drafts settle. Run every check again until every check passes or every
failure left needs a decision. Record each such decision with the section
it affects.

Fix in place only a draft in the scratch directory or a file the user asked
to change. Leave every other failure for Step 5 to show.

### Step 4: Count the code lines

Read `references/line-count.md`. The test locations are the folders and
files after `tests`. Without `tests`, take them from the Context and
Decisions sections of the draft.

For each draft, estimate the code lines its change adds, removes, or
modifies, outside the test locations. The change of a task is its Approach
section, and the change of a subtask is its Changes section. Count the
files the change deletes or rewrites with the count tool instead of an
estimate.

The size budget is 500 code lines per task without subtasks and per
subtask. It is a budget, not a cap: the caller decides what a count above
it changes.

### Step 5: Return

From a skill, end with the return block of the form and nothing else.
