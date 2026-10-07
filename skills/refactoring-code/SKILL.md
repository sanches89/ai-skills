---
name: refactoring-code
description: Reviews code for smells, design flaws, and the marks of agent-written code, and writes a refactor task with one tested subtask per refactoring, changing no code. Use when the user wants code refactored, simplified, decoupled, made testable or agent-friendly, cleaned of AI slop, or a codebase improved in batches, never rewritten from scratch.
license: MIT
compatibility: Requires the loading-tasks, finding-dev-commands, measuring-code, finding-code-smells, writing-unit-tests, formatting-tasks, and saving-tasks skills.
argument-hint: <path | symbol | git range | task or subtask id | file | text>
---

# Refactoring code

Review the code inside the refactor scope of one request. Rank the smells
found, pick the refactoring that removes each, and write the refactor task:
one task with one subtask per refactoring, at most 12 per run, in the format
the `implementing-tasks` skill implements. Every fact in it comes from
reading, measuring, and running commands on the unchanged code.

## Terms

These words have exactly one meaning in this skill.

- **Behavior**: what a caller or a user observes of the code: returned values,
  changed state, raised errors, written output, and calls to external systems.
- **Contract**: everything that code or people outside the refactor scope
  depend on. Exported symbols with their signatures, endpoints, command-line
  flags, file formats, database schemas, configuration keys, and the names of
  events, logs, and metrics.
- **System boundary**: the network, files, a database, the clock,
  randomness, the process environment, or third-party code. Third-party
  code includes a framework, a driver, an HTTP client, and a UI toolkit.

## Hard rules

1. **Read-only on the project.** Change no project file. Write notes and
   drafts in a scratch directory outside the repository (in Claude Code,
   the scratchpad directory). The `saving-tasks` skill writes the task in
   Step 9, and the `implementing-tasks` skill makes every change. A change
   made during the review has no test that proves it kept the behavior.
2. **Never ask.** Settle every choice from the code, the docs, the tests, the
   connected tools, and the rules below. Write the task without approval. A
   question stalls the `orchestrating-tasks` skill, which runs this skill
   with no user present.

## Workflow

### Step 1: Load the request

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Drop a leading `from <skill name>:` from the invocation text, and a
trailing `, files`, which asks for files. Resolve the rest, or the request
in the conversation, as exactly one request kind:
- *path*: one or more paths of files or folders that exist, other than the
  files and folders of *task*.
- *symbol*: a symbol name, a function or a module in the code. Search for
  its definition. With more than one, take every definition.
- *range*: a git range, such as `main..HEAD`, or words that name the
  uncommitted changes or the current branch.
- *task*: an item identifier or URL (`PAY-212`, `#128`, an issue link), or
  a file named `task.md`. Also a folder that holds a `task.md`, or a file
  named `###-<subtask-slug>.md` next to a `task.md`.
- *text*: free text, or the path of any other file, whose content is then
  the text.
- *path* with the repository root, when nothing is given.

For request kind *task*, invoke the `loading-tasks` skill (in Claude Code,
with the `Skill` tool) with the invocation text
`from refactoring-code: <identifier, URL, or path>`. Keep the task map it
returns. When the task map reads `source: none`, the request kind is *text*.

Write private notes to `<scratch-dir>/notes.md` from this step on.
`<scratch-dir>` is the scratch directory. Keep in the notes every list a
later step reads.

### Step 2: Set the refactor scope

**Refactor scope.** Take the files from the request:
- *path*: every file under the paths;
- *symbol*: the file of every definition of the symbol;
- *range*: every file that `git diff --name-only <range>` prints and that
  still exists. For uncommitted changes, use `git status --porcelain`;
- *task*: every file that the Changes or Approach section of the target
  names. Add every file that the Changes section of each subtask on the
  task map's `subtasks` line names;
- *text*: the files that hold the code the text names, found by search.

With an empty refactor scope, finish as Step 6 states for no entry.

Remove from the refactor scope:
- generated code, vendored code, lockfiles, build output, and snapshot files;
- database migrations that already ran;
- every file inside a task folder: a folder named `###-<task-slug>` that
  holds a `task.md`.

Record one glob per removed part that sits inside a folder of the refactor
scope, joined by commas with no space, as `<globs>`. A test file stays in
the refactor scope.

**Bounds of a requested task.** For request kind *task*, read every task on
the task map's `chain` in full. Record every *Out of scope* list and every
Decisions section. Never write a subtask that does what one of them lists
under *Out of scope*. Follow every decision.

### Step 3: Research

**3a. Conventions.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, and the
docs that cover the refactor scope. Record the naming, error handling,
module layout, and formatting rules.

**3b. Commands.** Invoke the `finding-dev-commands` skill (in Claude
Code, with the `Skill` tool) with the invocation text
`from refactoring-code: find`. Record the build, lint, type-check, test,
and `test one file` commands of the command map it returns. When its
`test one file` line reads `none`, record the test command in its place.
For request kind *task*, a command on the task map's `commands` line
replaces the command of the same name.

**3c. Test setup.** Invoke the `writing-unit-tests` skill (in Claude Code,
with the `Skill` tool) with the invocation text below. Leave out each part
whose command 3b did not find:

```
from refactoring-code: setup for <paths of the refactor scope>,
test <test command>, test one file <test one file command>
```

Record the test setup block it returns. The project has a test setup when
that block reads `test setup: yes`.

**3d. Analysis tools.** Read `references/analysis-tools.md` now. Record
every analysis tool it lists that the project configures, with its command
and limits.

### Step 4: Record the baseline

Invoke the `measuring-code` skill (in Claude Code, with the `Skill` tool)
with the invocation text
`from refactoring-code: paths <path>..., out <scratch-dir>, ignore <globs>,
top 200`.
`<path>...` is the files or folders of the refactor scope. Leave out
`ignore <globs>` when Step 2 recorded no glob. Keep the measurement record
it returns.

Then record in the scratch directory:
- the output of `git status --porcelain`, when the project is a git
  repository;
- the result of each command from 3b, pass or fail, with the name of every
  failing check. Take the test result from the summary when the
  measurement record's `tests` line reads `ok`;
- the result of each analysis tool from 3d.

When a test file on the `covering tests` line of 3c fails in the baseline,
remove the code it covers from the refactor scope. Name that code under the
task's *Out of scope* with the failing test.

### Step 5: Find and rank

Invoke the `finding-code-smells` skill (in Claude Code, with the `Skill`
tool) with the invocation text below. `<path>...` is the refactor scope
after Step 4. `<summary>` is the path on the `summary` line of the
measurement record, or `none` when that line reads `none`. `<limits>` is
its `limits` line without the `limits:` label. It comes last, because its
value holds commas. Leave out `ignore` when Step 2 recorded no glob:

```
from refactoring-code: paths <path>..., summary <summary>,
ignore <globs>, out <scratch-dir>, limits <limits>
```

Read the `findings.md` and the `contract.md` it names. `contract.md` lists the
contract. Add a finding in the same form for each refactoring the request names,
with the location and the reason the request gives. Add one for each hit of an
analysis tool from 3d that the code confirms. Prove a dead-code hit by a
search of every reference as a symbol and as text. Write the search into its
evidence.

Put every finding with refactoring `report` under the task's *Out of
scope*. Give every other finding its risk:
- `high` when the change crosses modules or the finding reads
  `contract: yes`;
- else `low` when the refactoring is in the safe set: Rename, Extract
  Variable, Inline Variable, Extract Function, Move Function, Remove Dead
  Code, and a seam. A seam is Parameterize Function, Parameterize
  Constructor, or Extract Function around the call to a system boundary.
  A Parameterize seam takes a default equal to the current collaborator.
  The safe set holds the refactorings allowed on code that no test covers;
- else `medium`.

Drop a finding when:
- its refactoring adds a feature, fixes a bug, or tunes performance;
- its refactoring changes a part of the contract that the request does not
  name;
- it is a clone whose copies change for different reasons;
- it needs a new layer, or an interface with fewer than 2 implementations
  that wraps no system boundary. A test double is no implementation;
- it needs a new parameter or option that no caller passes. A test that
  passes the parameter of a seam is such a caller;
- a task from Step 2 puts it out of scope;
- its code is about to be deleted or replaced, as the request or the docs
  state.

Record every dropped finding with its reason, for the task's *Out of scope*.

Rank the findings: first what the request names, then by hotspot score of
the file, then `low` risk before `medium` before `high`.

### Step 6: Order the refactorings

Turn the ranked findings into entries in rank order, one refactoring each,
with the entries a finding depends on: its seam, its characterization
tests, and the three steps of a contract change. Stop at 12 entries. A
finding whose entries do not fit goes under the task's *Out of scope* as
`next batch`, with its location and smell. The next run of this skill takes
it up. Then order the entries by refactoring kind:
1. Remove Dead Code;
2. Rename;
3. refactorings inside one function;
4. refactorings that move code between functions and modules.

Inside one refactoring kind, keep the rank from Step 5. Place an entry after
every entry it depends on. Split a contract change that the request names
into three entries: add the new form, move the callers, remove the old form.
Moving those callers is the one reason an entry changes a file outside the
refactor scope.

Write each entry in the notes in this form:

```
<number>. <Refactoring>: `<path:line>` (<symbol>), depends on: <numbers>
   finding: <smell and evidence>
   result: <the structure after the change>
   risk: low | medium | high
   tests: covered | characterization tests first | none: safe set
   verification: <one command>
```

`tests` reads `covered` for a finding that reads `covered: yes`. Without a
test setup, keep only entries from the safe set, with
`tests: none: safe set`. Move every other finding to the task's *Out of
scope*, with the reason `no test setup`.

**Characterization tests.** Invoke the `writing-unit-tests` skill (in Claude
Code, with the `Skill` tool) with the invocation text
`from refactoring-code: characterization`. Read *Characterization tests*
in `references/refactor-sections.md` now. For every entry marked
`characterization tests first`, record the test cases for the behavior of
the code the entry changes, and the seam that reaches the code. With no
seam, drop the entry and record the reason for the task's *Out of scope*.

**Verification.** Give every entry one verification command. It runs the
`test one file` command of the test setup block over the tests that cover
the entry. It chains that run with one structural check that observes the
result of the refactoring. A structural check is a search for a name that
finds nothing, a count of matches, an existing file, or a measurement
value. Run the command on the current code and confirm that it fails: a
command that passes before the refactoring proves nothing. Without a test
setup, the structural check alone is the command.

With no entry, write no task. State the refactor scope and the baseline
measurements in chat. Finish with one line: `No refactor task: no finding
met the rules of Step 5.` Ask nothing else.

### Step 7: Write the refactor task

Read `references/refactor-sections.md` now: it says what each section of the
task and of a subtask holds. Read `references/refactoring-rules.md` now, for
the task's *Decisions* and each subtask's *Context*.

Write into the notes, under *Writing rules*, what each section of the task
and of each subtask holds, by `references/refactor-sections.md`. Restate
there every rule of `references/refactoring-rules.md` that a section takes.
The `formatting-tasks` skill reads only the notes.

Invoke the `formatting-tasks` skill (in Claude Code, with the `Skill` tool)
with the invocation text `from refactoring-code: write <scratch-dir>/draft,
notes <scratch-dir>/notes.md, subtasks <entry count>`. It fills the task
and one subtask per entry, in the order of Step 6, from the notes. On
`checks: decision needed`, settle the decision from the notes and the rules
of this skill, then fix the draft.

### Step 8: Quality check

Run every check in `references/quality-checklist.md` over the drafts. Fix
every failure. Then invoke the `formatting-tasks` skill (in Claude Code,
with the `Skill` tool) with the invocation text
`from refactoring-code: check <draft path>..., notes <scratch-dir>/notes.md`,
every draft in order. Fix every failure it returns.

### Step 9: Save

Invoke the `saving-tasks` skill (in Claude Code, with the `Skill` tool) with the
invocation text below. `<subtask drafts>` is the subtask draft paths in order,
separated by spaces. Add `files` when the invocation text ended with `, files`,
or when the user asked for files at any point. Add `dir <folder>` when the
request names the folder for tasks:

```
from refactoring-code: task <scratch-dir>/draft/task.md,
subtasks <subtask drafts>[, files][, dir <folder>], unattended
```

Finish with the one line `saving-tasks` returns: the task item's identifier,
or the path of the task file. Ask nothing else.
