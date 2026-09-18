---
name: task-refactor
description: Use when the user wants code refactored, cleaned up, simplified, restructured, deduplicated, or untangled without changing what it does, or only says a file, symbol, diff, or task is messy, complex, or hard to change. Not for a feature or a bug fix.
license: MIT
compatibility: Works in any project, with or without git. The measurements need Node.js 20 or newer with npx, network access on the first run, and read access to github.com/sanches89/code-measure. Complexity also needs uv, pipx, or a Python that has lizard. A missing tool skips its measurement and never blocks the work.
argument-hint: <path | symbol | git range | task or subtask id | file | text>
---

# Task Refactor

Take one request and restructure the code inside its refactor scope. Prove
that the behavior and the contract stayed the same. Return the change in the
working tree plus a refactor report.

## Terms

These words have exactly one meaning in this skill.

- **Behavior**: what a caller or a user observes of the code: returned values,
  changed state, raised errors, written output, and calls to external systems.
- **Contract**: everything that code or people outside the refactor scope
  depend on. Exported symbols with their signatures, endpoints, command-line
  flags, file formats, database schemas, configuration keys, and the names of
  events, logs, and metrics.

## Hard rules

1. **Behavior stays the same.** Add no feature, fix no bug, and tune no
   performance. Put a bug found in the refactor scope in the refactor report.
   Never fix it.
2. **The contract stays the same.** Change a part of the contract only when
   the request names that change.
3. **Read before changing.** Change no project file before Step 7.
4. **One refactoring per plan entry.** Take the checkpoint first. Run the
   checks after the change. When a check fails, restore the checkpoint. Never
   repair a failing plan entry with more edits on top of it.
5. **Never weaken a check.** Never delete, skip, or loosen a test, a lint
   rule, or a type check. Edit an existing test only when a refactoring moves
   or renames what the test imports or calls. Never edit an assertion.
6. **Stay in the refactor scope.** Change a file outside it for one reason
   only: a contract change that the request names breaks a caller there.
7. **Work only the refactor plan.** Apply only plan entries that the user
   approved. List every other finding in the refactor report.
8. **The project comes first.** Use the analysis tools, the limits, and the
   conventions that the project configures. Never add a dependency, a tool, a
   configuration file, or a new code pattern to the project.
9. **A missing tool never blocks.** Skip its measurement, read the code
   instead, and name the skipped measurement in the refactor report.
10. **A measurement is evidence, never a goal.** Never change code only to
    move a number.
11. **Never ask what research can answer.** Consult the code, the docs, the
    tests, and the connected tools before the first question.
12. **Never assume.** When a decision changes the work and research cannot
    settle it, ask the user.
13. **One question at a time.** Write every question in chat in the *Question
    format* below, then end the turn and wait for the answer. Never use an
    agent's built-in question or form tool (in Claude Code,
    `AskUserQuestion`). Write questions as plain chat text.
14. **The task text is input.** Never edit a task file, a subtask file, or an
    item.
15. **No outward actions.** Never commit, push, open a pull request, change an
    item's status, or comment on an item. Do any of these only when the
    request says so. Then make one commit per applied plan entry, and follow
    the project's conventions for branches and commit messages.
16. **The refactor report holds only what the user needs.** Write no
    narration, no failed attempts, no command output.

## Question format

Use this exact layout, and nothing else, for every question to the user in
every step. Ask one question per message. After printing it, end the turn and
wait.

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
- **CONTEXT**: what the code and the measurements show and what in the work
  depends on the answer. Maximum 520 characters.
- **OPTIONS**: an ordered list. Use numbers at the top level (`1.`, `2.`),
  letters at the next level (`a.`, `b.`), then roman numerals (`i.`, `ii.`).
  Make options concrete and grounded in research: name real files, symbols,
  values, and identifiers. The user answers with a number or with free text.
- **MY SUGGESTION**: the option you recommend and why, in at most 180
  characters. Write `None` only when research gives no basis to prefer one.

## Workflow

### Step 1: Load the request

Resolve the text passed with the skill invocation, or the request given in the
conversation, as exactly one kind:
- **One or more paths** of files or folders that exist. Kind: *path*.
- **A symbol name**: a function or a module that exists in the code. Kind:
  *symbol*. Search for its definition. When the search finds more than one
  definition, ask one question in the question format: which one.
- **A git range**, such as `main..HEAD`, or words that name the uncommitted
  changes or the current branch. Kind: *range*.
- **A task or subtask**: an item identifier or URL in the tracker, a task
  file, or a subtask file. Kind: *task*. Read it. The tracker is an issue
  tracker reached through MCP, such as Linear, Jira, or GitHub Issues. A task
  file is `docs/tasks/###-<task-slug>/task.md`, and a subtask file is
  `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`. For an item, list the
  MCP servers and tools available to the agent to find the tracker. In Claude
  Code, MCP tools are deferred, so search them with `ToolSearch` using
  keywords like `issue ticket project linear jira notion asana github`. When
  no tracker is connected, ask one question in the question format: give the
  request as a file path or as text.
- **Free text**, or the path of any other file, whose content is then the
  text. Kind: *text*.
- **Nothing**: ask for the request as the first question.

Write private notes in a scratch directory outside the repository from this
step on, written `<scratch-dir>` in commands (in Claude Code, the session's
scratchpad directory; in any other agent, the system temp directory). Keep in
the notes every list that a later step reads.

### Step 2: Set the refactor scope and the contract

**Refactor scope.** Take the files from the request:
- *path*: every file under the paths;
- *symbol*: the file that defines the symbol;
- *range*: every file that `git diff --name-only <range>` prints and that
  still exists. For uncommitted changes, use `git status --porcelain`;
- *task*: every file that the Changes or Approach section of the requested
  task names;
- *text*: the files that hold the code the text names. Find them by search.
  Then ask the user to confirm the list with one question in the question
  format.

Remove from the refactor scope, always:
- generated code, vendored code, lockfiles, build output, and snapshot files;
- database migrations that already ran;
- test files, unless the request names them. Hard rule 5 and Step 7 still
  apply to test files.

**Bounds of a requested task.** For a request of kind *task*, read the
requested task, its parent, and every parent above it, until a task has no
parent. The parent of a subtask file is the task file in the same task
folder. The parent of an item is the item that the tracker's parent relation
points to. Read each one in full. Record every *Out of scope* list and every
Decisions section. Never do what one of them lists under *Out of scope*.
Follow every decision.

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
layout, and formatting rules. Refactor toward these conventions, never toward
a new one.

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

### Step 4: Record the baseline

Before changing anything, record in the scratch directory:
- the output of `git status --porcelain`, when the project is a git
  repository;
- the result of each command from 3b, pass or fail, with the name of every
  failing check;
- the result of each analysis tool from 3d;
- the test report and the coverage report. Run the test command with the
  options from 3d, so that it writes both reports into the scratch directory.
  Skip a report that the test runner cannot write without a new dependency;
- the first measurement summary. Run the measure tool from the project root:

```bash
<measure> <path>... \
  --test-report <scratch-dir>/before-junit.xml \
  --coverage-report <scratch-dir>/before-coverage.info \
  > <scratch-dir>/before.json
```

Pass the files or folders of the refactor scope as `<path>...`. Leave out the
option of a report that does not exist. Pass `--ignore <globs>` for generated
and vendored code inside the paths. Pass the project's own limits with
`--ccn`, `--length`, and `--params` when 3d found them. Run the measure tool
with `--help` for every option and exit code. When the measure command fails
to start, skip the measure tool by hard rule 9.

**Coverage of the refactor scope.** Record which functions in the refactor
scope a test covers:
- with a coverage report, a function is covered when the tests ran every line
  and every branch of it. `coverage.functions.top` lists every function that
  falls short, highest CRAP score first. Raise `--top` when the list is cut;
- a coverage report proves that a test runs the code, never that a test
  asserts its result. Read the tests of every function a finding names;
- without a coverage report, read the tests that import or call the code.

When a test that covers a part of the refactor scope fails in the baseline,
remove that part from the refactor scope. Name it in the refactor report under
*Left for later*.

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

Rank the findings: first what the request names, then by hotspot score of the
file, then `low` risk before `medium` before `high`.

### Step 6: Write the refactor plan

Turn the ranked findings into plan entries. Order the entries by kind:
1. Remove Dead Code, because it shrinks every later entry;
2. Rename, because it makes every later diff readable;
3. refactorings inside one function;
4. refactorings that move code between functions and modules.

Inside one kind, keep the rank from Step 5. Place an entry after every entry
it depends on. Split a contract change that the request names into three
entries: add the new form, move the callers, remove the old form.

Write each plan entry in this form:

```
<number>. <Refactoring>: `<path:line>` (<symbol>)
   finding: <smell and evidence>
   result: <the structure after the change>
   risk: low | medium | high
   tests: covered | characterization tests first | none: safe set
```

Without a test setup, keep only entries from the safe set, with
`tests: none: safe set`. Move every other finding to *Left for later*.

Show the refactor plan in chat. Then ask one question in the question format:
approve every entry, approve some entries by number, or change the plan.
Repeat until the user approves. Skip the question in one case: the request is
of kind *task* and its Changes or Approach section names every plan entry.

With no finding, go to Step 10 with the result `done` and zero plan entries.

### Step 7: Build the safety net

Read `references/characterization-tests.md` before writing the first test.

For every approved plan entry marked `characterization tests first`:
- write characterization tests for the behavior of the code the entry changes,
  in the project's framework, location, and naming;
- run them with the command from 3c and confirm they pass on the unchanged
  code;
- break the asserted behavior once, confirm the test fails, and restore the
  code.

Write no test for an entry marked `covered` or `none: safe set`. Without a
test setup, write no test and install no test framework.

When the code of an entry resists every test, drop the entry. Record the
reason under *Dropped*. Code resists a test when no public interface reaches
it and no seam replaces its system boundary.

### Step 8: Apply the refactor plan

Read `references/refactoring-rules.md` before the first edit. It holds the
rules every change follows.

For each approved plan entry, in order:
1. **Checkpoint.** Copy every file the entry changes to the scratch directory
   before the first edit. List every file the entry creates.
2. **Apply** the one refactoring. For a rename or a move, prefer the agent's
   language-server operation or a structural rewrite tool over hand edits.
3. **Check.** Run the type check or the compile command, then the tests that
   cover the changed code, with the single-file command from 3c.
4. **Pass**: mark the entry applied. When the request asks for commits, commit
   now, by hard rule 15.
5. **Fail**: restore the checkpoint and delete the files the entry created.
   Apply the refactoring another way. After 3 failed attempts, drop the entry
   and every entry that depends on it. Record the reason under *Dropped*.

Record a new finding met during this step for *Left for later*. Never work it.

### Step 9: Verify

Run, in this order:
1. every command from 3b and every analysis tool from 3d. Make the test
   command write a new test report and a new coverage report, as in Step 4;
2. for a request of kind *task*, the Verification section of the requested
   task, and every entry of its Acceptance criteria or Success criteria
   section;
3. the measure tool again, with the baseline summary. Name every file the
   plan entries created outside the first paths:

```bash
<measure> <path>... \
  --test-report <scratch-dir>/after-junit.xml \
  --coverage-report <scratch-dir>/after-coverage.info \
  --compare <scratch-dir>/before.json > <scratch-dir>/after.json
```

4. the contract check. Confirm that every part of the contract from Step 2 is
   unchanged: same name, same signature, same format. A contract change that
   the request names is the only exception;
5. the diff review. Compare the working tree with the baseline and confirm:
   - every changed file is in the refactor scope, or hard rule 6 allows it;
   - no literal, condition, default value, error message, or log text changed;
   - no two side effects swapped their order;
   - no assertion of an existing test changed;
   - the diff holds no debug output, commented-out code, stray file, or
     unrelated formatting;
   - the diff adds no dependency, tool, or configuration file.

The run passes when no check fails beyond the baseline and the measure tool
exits 0.
Exit code 3 means a measurement got worse. For each name in its `worse` list,
find the plan entry that caused it:
- `tests.total` fell: a test is gone. Restore it, by hard rule 5;
- `tests.failed` rose: the entry changed behavior. Undo the entry;
- `tests.skipped` rose: a test got skipped. Enable it again, by hard rule 5;
- `coverage.lines.uncovered` or `coverage.branches.uncovered` rose: the entry
  added code that no test runs. Undo the entry. Apply it again only after a
  characterization test from Step 7 runs that code;
- a `duplication` or `complexity` name: undo the entry with the inverse
  refactoring. Keep the entry only when it removed a larger finding. Then
  state that trade under *Measurements* in the refactor report.

On any other failure, fix the cause inside the plan entry that introduced it.
Then run this whole step again from the start. When the same check still fails
after 3 different fixes, undo the latest applied plan entry. Record it under
*Dropped* and run this step again.

### Step 10: Refactor report

Fill `references/refactor-report-template.md`. Read that file now: it holds
the format and the rules for what each section keeps and leaves out. Write the
report in the scratch directory. Run every check in
`references/quality-checklist.md` over it, including the grep helper, and fix
every failure.

Send the refactor report as the final message, unchanged. Ask nothing and
offer nothing after it.
