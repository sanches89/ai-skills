---
name: task-refactor
description: Use when the user wants code reviewed for refactoring, or wants code refactored, cleaned up, simplified, restructured, deduplicated, or untangled without changing what it does, or only says a file, symbol, diff, or task is messy, complex, or hard to change. Writes a refactor task with one subtask per refactoring, ready for the task-work skill to implement, and changes no code. Not for a feature or a bug fix.
license: MIT
compatibility: Works in any project, with or without git. The measurements need Node.js 20 or newer with npx, network access on the first run, and read access to github.com/sanches89/code-measure. Complexity also needs uv, pipx, or a Python that has lizard. A missing tool skips its measurement and never blocks the review.
argument-hint: <path | symbol | git range | task or subtask id | file | text>
---

# Task Refactor

Take one request and review the code inside its refactor scope. Find every
smell, decide which refactoring removes it, and write the refactor task: one
task with one subtask per refactoring, in the task format that the
`task-work` skill implements. Change no project code. Every fact in the
refactor task comes from reading, measuring, and running commands on the
unchanged code.

## Terms

These words have exactly one meaning in this skill.

- **Behavior**: what a caller or a user observes of the code: returned values,
  changed state, raised errors, written output, and calls to external systems.
- **Contract**: everything that code or people outside the refactor scope
  depend on. Exported symbols with their signatures, endpoints, command-line
  flags, file formats, database schemas, configuration keys, and the names of
  events, logs, and metrics.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   Write only the task file and the subtask files, in Step 10. Write drafts in
   a scratch directory outside the repository (in Claude Code, the session's
   scratchpad directory; in any other agent, the system temp directory).
2. **Behavior stays the same.** The refactor task adds no feature, fixes no
   bug, and tunes no performance. Put a bug found in the refactor scope under
   the task's *Out of scope*, as a statement that the code keeps it.
3. **The contract stays the same.** The refactor task changes a part of the
   contract only when the request names that change.
4. **One refactoring per subtask.** Every subtask applies one refactoring
   named in `references/smell-catalog.md`. Its verification command fails on
   the current code and passes after the refactoring.
5. **Never weaken a check.** The refactor task deletes, skips, or loosens no
   test, lint rule, or type check. It edits an existing test only where a
   refactoring moves or renames what the test imports or calls. It never edits
   an assertion.
6. **Stay in the refactor scope.** The refactor task changes a file outside
   it for one reason only: a contract change that the request names breaks a
   caller there.
7. **The project comes first.** Use the analysis tools, the limits, and the
   conventions that the project configures. The refactor task adds no
   dependency, tool, configuration file, or new code pattern to the project.
8. **A missing tool never blocks.** Skip its measurement, read the code
   instead, and name the skipped measurement in the task's Context section.
9. **A measurement is evidence, never a goal.** Write no subtask whose only
   purpose is to move a number.
10. **Never ask what research can answer.** Consult code, docs, tests, and
    connected tools before the first question.
11. **Never assume.** When a decision changes the refactor task and research
    cannot settle it, ask the user.
12. **Never leave an open question** in the task or in a subtask. State every
    decision as a fact.
13. **Write nothing before the user approves the full refactor task text**
    (Step 9).

## Workflow

### Step 1: Load the request

Resolve the text passed with the skill invocation, or the request given in the
conversation, as exactly one kind:
- **One or more paths** of files or folders that exist. Kind: *path*.
- **A symbol name**: a function or a module that exists in the code. Kind:
  *symbol*. Search for its definition. When the search finds more than one
  definition, ask one question: which one.
- **A git range**, such as `main..HEAD`, or words that name the uncommitted
  changes or the current branch. Kind: *range*.
- **A task or subtask**: an item identifier or URL (for example `PAY-212`,
  `#128`, an issue link) in the tracker, a task file
  `docs/tasks/###-<task-slug>/task.md`, or a subtask file
  `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`. Kind: *task*. Read it,
  with every subtask file in its task folder or every child of its item. The
  tracker is an issue tracker reached through MCP, such as Linear, Jira, or
  GitHub Issues. To find the tracker, list the MCP servers and tools
  available to the agent. In Claude Code, MCP tools are deferred, so search
  them with `ToolSearch` using keywords like
  `issue ticket project linear jira notion asana github`. When no tracker is
  connected, ask one question: give the request as a file path or as text.
- **Free text**, or the path of any other file, whose content is then the
  text. Kind: *text*.
- **Nothing**: ask for the request as the first question.

Write private notes in the scratch directory from this step on, written
`<scratch-dir>` in commands. Keep in the notes every list that a later step
reads.

### Step 2: Set the refactor scope and the contract

**Refactor scope.** Take the files from the request:
- *path*: every file under the paths;
- *symbol*: the file that defines the symbol;
- *range*: every file that `git diff --name-only <range>` prints and that
  still exists. For uncommitted changes, use `git status --porcelain`;
- *task*: every file that the Changes or Approach section of the requested
  task names, and every file that its subtasks' Changes sections name;
- *text*: the files that hold the code the text names. Find them by search.
  Then ask the user to confirm the list.

Remove from the refactor scope, always:
- generated code, vendored code, lockfiles, build output, and snapshot files;
- database migrations that already ran;
- test files, unless the request names them. Hard rule 5 still applies to
  test files.

**Bounds of a requested task.** For a request of kind *task*, read the
requested task, its parent, and every parent above it, until a task has no
parent. The parent of a subtask file is the task file in the same task
folder. The parent of an item is the item that the tracker's parent relation
points to. Read each one in full. Record every *Out of scope* list and every
Decisions section. Never write a subtask that does what one of them lists
under *Out of scope*. Follow every decision.

**Contract.** List every part of the contract that the refactor scope holds:
- every symbol that code outside the refactor scope imports or calls. Search
  with the agent's code search or `git grep`;
- in a library that others install, every exported symbol, with or without a
  caller in the repository;
- every endpoint, command-line flag, file format, database schema,
  configuration key, and name of an event, a log, or a metric.

### Step 3: Research

**3a. Conventions.** Read README, CLAUDE.md, AGENTS.md, CONTRIBUTING, and the
docs that cover the refactor scope. Record the naming, error handling, module
layout, and formatting rules. Write the refactor task toward these
conventions, never toward a new one.

**3b. Commands.** Take the build, lint, type-check, and test commands from the
project's manifest, Makefile, CI configuration, or docs. For a request of kind
*task*, prefer the commands in its Context section.

**3c. Test setup.** The project has a test setup when 3b found a test command
and the repository holds at least one test file. When it has one, record:
- the test framework and its version from the manifest or lockfile;
- where the tests for the refactor scope live and how they are named;
- the fixtures, factories, fakes, and helpers the existing tests use;
- the command that runs a single test file;
- the coverage command, when the project configures one.

**3d. Analysis tools.** Read `references/measurement-tools.md` now. It holds
the tool rules, the limits, and how to read a measurement summary. Record
every analysis tool the project configures, with its command and its limits.
Record the options that make the test command write a test report and a
coverage report. That file lists them per test runner.

**3e. Tracker.** When a tracker is connected, record which relation it uses
for children (sub-issue, child, parent field). Record which fields an item
and a child item require. Record the team, project, or board that the
request, the requested task, or the docs name.

### Step 4: Record the baseline

Record in the scratch directory:
- the output of `git status --porcelain`, when the project is a git
  repository;
- the result of each command from 3b, pass or fail, with the name of every
  failing check;
- the result of each analysis tool from 3d;
- the test report and the coverage report. Run the test command with the
  options from 3d, so that it writes both reports into the scratch directory.
  Skip a report that the test runner cannot write without a new dependency;
- the measurement summary. Run the measure tool from the project root:

```bash
<measure> <path>... \
  --test-report <scratch-dir>/junit.xml \
  --coverage-report <scratch-dir>/coverage.info \
  > <scratch-dir>/baseline.json
```

Pass the files or folders of the refactor scope as `<path>...`. Leave out the
option of a report that does not exist. Pass `--ignore <globs>` for generated
and vendored code inside the paths. Pass the project's own limits with
`--ccn`, `--length`, and `--params` when 3d found them. Run the measure tool
with `--help` for every option and exit code. When the measure command fails
to start, skip the measure tool by hard rule 8.

**Coverage of the refactor scope.** Record which functions in the refactor
scope a test covers:
- with a coverage report, a function is covered when the tests ran every line
  and every branch of it. `coverage.functions.top` lists every function that
  falls short, highest CRAP score first. Raise `--top` when the list is cut;
- a coverage report proves that a test runs the code, never that a test
  asserts its result. Read the tests of every function a finding names;
- without a coverage report, read the tests that import or call the code.

When a test that covers a part of the refactor scope fails in the baseline,
remove that part from the refactor scope. Name it under the task's *Out of
scope* with the failing test.

### Step 5: Find and rank

Read `references/smell-catalog.md` now. It maps every smell to its signal, its
refactoring, and the cases to leave alone.

Read every file in the refactor scope in full. A number alone is never a
finding. Record one finding per smell and location:
- the smell and its location as `path:line`;
- the evidence: the clone, the measured value against its limit, or what the
  code shows;
- the refactoring that removes it;
- the risk. `high` when the change crosses modules or touches the contract.
  Else `low` when the refactoring is in the safe set, the refactorings allowed
  on code that no test covers: Rename, Extract Variable, Inline Variable,
  Extract Function, Move Function, and Remove Dead Code. Else `medium`;
- whether a test covers the code, from Step 4.

Take the findings from four origins: what the request names, the `top` lists
of the measurement summary, the project's analysis tools, and reading the
code.

Drop a finding when:
- its refactoring changes a part of the contract that the request does not
  name;
- it is a clone whose copies change for different reasons;
- it needs a new layer, interface, or option with fewer than three users;
- a task from Step 2 puts it out of scope;
- its code is about to be deleted or replaced, as the request or the docs
  state.

Record every dropped finding with its reason, for the task's *Out of scope*.

Rank the findings: first what the request names, then by hotspot score of the
file, then `low` risk before `medium` before `high`.

### Step 6: Order the refactorings

Turn the ranked findings into entries, one refactoring each. Order the entries
by kind:
1. Remove Dead Code, because it shrinks every later entry;
2. Rename, because it makes every later diff readable;
3. refactorings inside one function;
4. refactorings that move code between functions and modules.

Inside one kind, keep the rank from Step 5. Place an entry after every entry
it depends on. Split a contract change that the request names into three
entries: add the new form, move the callers, remove the old form.

Write each entry in the notes in this form:

```
<number>. <Refactoring>: `<path:line>` (<symbol>), depends on: <numbers>
   finding: <smell and evidence>
   result: <the structure after the change>
   risk: low | medium | high
   tests: covered | characterization tests first | none: safe set
   verification: <one command>
```

Without a test setup, keep only entries from the safe set, with
`tests: none: safe set`. Move every other finding to the task's *Out of
scope*, with the reason `no test setup`.

**Characterization tests.** Read `references/characterization-tests.md` now.
For every entry marked `characterization tests first`, record the test cases
for the behavior of the code the entry changes. Record the seam that reaches
the code. When no seam reaches the code, drop the entry and record the reason
for the task's *Out of scope*.

**Verification.** Give every entry one verification command: the single-file
test command from 3c over the tests that cover the entry, chained with one
structural check that observes the result of the refactoring. A structural
check is a search for a name that finds nothing, a count of matches, an
existing file, or a measurement value. Run the command on the current code
and confirm that it fails. A command that passes before the refactoring
proves nothing, and the implementer treats the subtask as done. Without a
test setup, the structural check alone is the command.

With no entry, write no task. Finish with a short recap: the refactor scope,
the baseline measurements, and the statement that no finding met the rules of
Step 5. Ask nothing else.

### Step 7: Write the refactor task

Fill `references/task-template.md` for the task and for each entry, one
subtask per entry in the order of Step 6. Read that file now: it holds the
format and the rules for filling it. Write the draft in the scratch directory.

**The task:**
- *Title*: `Refactor <refactor scope in a few words>`.
- *Summary*: the refactor scope, the smells found, and the structure after
  every subtask.
- *Success criteria*: one criterion per command from 3b, passing with no
  failure beyond the baseline, each baseline failure named. One criterion per
  part of the contract from Step 2: same name, same signature, same format. A
  contract change that the request names is the only exception. One criterion
  per entry: the structure after the change. The test counts: total not below
  the baseline, failed and skipped not above it. The coverage counts:
  uncovered lines and uncovered branches not above the baseline. The
  duplication and complexity values that the entries change, with the target
  value.
- *In scope*: every file of the refactor scope.
- *Out of scope*: every bug found, with its location and the statement that
  the code keeps it. Every finding dropped in Step 5 or Step 6, with its
  reason. Every part removed from the refactor scope in Step 4. Every part of
  the contract, as a statement that it stays. Every *Out of scope* entry of a
  requested task, restated.
- *Approach*: one bullet per entry, in order: path and symbol, then the
  structure after the change.
- *Decisions*: the rules from `references/refactoring-rules.md` that every
  entry follows, as that file states. Read it now. The conventions from 3a and
  the test conventions from 3c. The rule that a subtask applies one
  refactoring and gets one commit.
- *Context*: the commands from 3b with the report options from 3d, and the
  single-file test command. The analysis tools with their limits, and the
  measure command from Step 4. The baseline: one line per measurement with
  its values, or `skipped` with the reason. The test coverage of every
  function the entries change. For a request of kind *task*, the identifier
  or path of the requested task.
- *Subtasks*: one line per entry, in order, with its dependencies.
- *Verification*: the commands from 3b, then the test command with the report
  options, then the measure command from Step 4 over the same paths.

**Each subtask:**
- *Title*: the refactoring and the symbol, imperative, under 80 characters.
- *Goal*: the structure after the change, in one sentence.
- *Context*: the smell and its evidence, with every location as `path:line`.
  The tests that cover the code, or the statement that none does. The
  single-file test command. The rules from `references/refactoring-rules.md`
  that this refactoring follows, restated. The conventions the change follows,
  restated. Every part of the contract the change touches, as a statement that
  it stays. For a rename or a move across many files, the rewrite tool from
  `references/measurement-tools.md`.
- *Changes*: first, for an entry marked `characterization tests first`, the
  test file, `(new)` or existing, with every test case from Step 6 named.
  Then every file the refactoring changes, with the symbol and the structure
  after the change. A file the refactoring creates, marked `(new)`, with what
  it holds.
- *Acceptance criteria*: each named characterization test passes on the
  unchanged code and after the change. The structure after the change, as a
  binary check. The tests that cover the code pass. Every part of the
  contract the change touches keeps its name, signature, and format. No
  assertion of an existing test changed.
- *Verification*: the one command from Step 6.

Writing rules:
- Write decisions as facts. Write
  `The three copies of the business-day rule call isBusinessDay.`
  Never `We decided that...` and never `The copies should probably...`.
- **Each subtask is self-contained.** Write each subtask so that an agent
  given only that subtask and the repository can implement it. Restate the
  decisions and facts it needs. Never write `see task`, `as above`, or
  `same as subtask 2`.
- Include the file paths and symbol names verified in Step 2 and Step 5. Mark
  new files as `(new)`.
- Name in the *Changes* section the functions to add, move, rename, or
  remove, with their inputs and outputs. Never include implementation code.
- Write acceptance criteria that are observable and binary, so that someone
  else can check each one and answer yes or no.
- Do not add sections beyond the template. No Risks, Considerations,
  Alternatives, Future work, Nice to have, or Notes.

### Step 8: Quality check

Run every check in `references/quality-checklist.md`, including the grep
helper, over the draft. Fix every failure. Do not show the refactor task until
every check passes.

### Step 9: Approval

Show the complete refactor task in chat: the task followed by every subtask.
Then ask whether the user approves it as written, approves some subtasks by
number, or wants a change. Apply changes, drop the subtasks the user left out
and record them under *Out of scope*, re-run Step 8, and ask again. Loop
until the user approves. Write nothing before approval.

### Step 10: Save

Save to files when no tracker is connected. Save to files also when the user
asked for files, in the request or at any point in the conversation. In every
other case save to the tracker found in 3e. Never ask the user which of the
two.

**Saving to the tracker:**
1. Use the destination and required field values recorded in 3e. Ask one
   question for the values that research did not settle: which team, project,
   or board receives the items, and the required fields.
2. Create the task as a new item with the approved title and body.
3. Create one child item per subtask, in order, so that later children can
   link to earlier siblings by their created identifiers. Use the subtask
   title as the title. Use the approved subtask as the body, with the task's
   item link on the `Task` line and sibling item links on the `Depends on`
   line. Link each child to the task's item using the tracker's relation. When
   the tracker has no parent-child relation, put child links in the task's
   body and the task's link in each child body.
4. Update the task's Subtasks section with the child links.

**Saving to files**, under the repository root, by the numbering rule below:
1. Collision check: when `docs/tasks/` already holds a folder with the same
   `<task-slug>` under any number, ask one question: replace that folder's
   files keeping its number, or write a new folder with a new number.
2. Task folder, `docs/tasks/###-<task-slug>/`: create it with the next free
   number, or reuse the folder the user chose to replace. When replacing,
   delete the previous task file and subtask files in it first.
3. Task: write the task file, `task.md` in the task folder, with the approved
   task.
4. Subtasks: write one subtask file per subtask, `###-<subtask-slug>.md` in
   the task folder, numbered `001` upward in subtask order. Link the `Task`
   line to `./task.md` and the `Depends on` line to the sibling files. Link
   the task's Subtasks section to each subtask file.

**Numbering rule.** `###` is a zero-padded three-digit sequence starting at
`001`. Give a task the next free number across all folders in `docs/tasks/`.
Give subtasks the next free numbers inside their task folder. Build a slug
from a title in kebab-case: lowercase ASCII letters and digits, with every
other run of characters replaced by one hyphen. Cut it to at most 60
characters and strip a leading or trailing hyphen. Build `<task-slug>` from
the task title and `<subtask-slug>` from the subtask title. The `task-create`
and `task-breakdown` skills share this layout.

Finish with a short recap: every item identifier and URL created, or every
path written, and the number of subtasks. Ask nothing else.
