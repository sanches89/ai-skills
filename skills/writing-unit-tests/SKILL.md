---
name: writing-unit-tests
description: Writes and reviews unit tests by rules that make each test prove one behavior and fail when it breaks, characterization tests included. Use when tests need writing, fixing, or reviewing, when code lacks tests, when a bug needs a regression test, or before changing code that no test covers.
license: MIT
compatibility: Requires the finding-dev-commands skill.
argument-hint: <code paths to test | test files to review>
---

# Writing unit tests

Write and review unit tests that each prove one behavior and fail when that
behavior breaks. A convention of the project, as the test setup records it,
beats a rule here. The request is the task the caller works on, or what the user
asked for.

## Terms

- **System boundary**: the network, files, a database, the clock, randomness,
  the process environment, or third-party code. Third-party code includes a
  framework, a driver, an HTTP client, and a UI toolkit.

## Hard rules

1. **No test setup, no test.** Without a test setup, write no test and install
   no test framework.
2. **One framework, the project's.** Never add a second test framework or style
   beside the project's.
3. **Never weaken a test.** Never delete, skip, or loosen a test to make a run
   pass.

## Invocation

An invocation text that starts with `from <skill name>:` comes from another
skill. Ask nothing. Follow the form it names. End with its return block and
nothing else. Without that prefix, a user invoked this run: read
`references/user-run.md` first.

- `from <caller>: setup for <paths>`, plus the parts `, test <command>` and
  `, test one file <command>` when the caller has them: run Step 1 for the
  paths, separated by spaces. Return the **test setup** block below.
- `from <caller>: write`: load the rules. Return `rules loaded`.
- `from <caller>: characterization`: read
  `references/characterization-tests.md`. Return `rules loaded`.
- `from <caller>: check <test file>...`: run the checks of
  `references/checks.md` over the tests the caller added or edited in those
  files. Return one line per failure, `<path:line> <check>`, or `pass`.

The rules are the sections from _What to test_ to _Test-first loop_. The **test
setup** block:

```
test setup: yes | none: <reason>
framework: <name and version>
location: <where tests for the paths live; file and case naming>
helpers: <fixtures, factories, fakes, and helpers, with paths> | none
test one file: <command>
covering tests: <test files that cover the paths> | none
```

## Workflow

### Step 1: Test setup

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in one
each read or command that yields only facts, returned with path and line.

Take the paths from the invocation text, else from the user's request. Take the
test command and the `test one file` command from the invocation text. When
either is missing, invoke the `finding-dev-commands` skill (in Claude Code, with
the `Skill` tool) with `from writing-unit-tests: find`. Take its `test` and
`test one file` lines. When the `test one file` command is still missing or
reads `none`, take the test command in its place.

The project has a test setup when it has a test command and the repository holds
at least one test file. Then fill the **test setup** block. Take the framework
and its version from the manifest or lockfile, and the helpers from the existing
tests.

Without a test setup, record the reason.

### Step 2: Write or review

Run this step only in a user run, by `references/user-run.md`.

### Step 3: Verify

Run this step only in a user run, by `references/user-run.md`.

### Step 4: Report

Run this step only in a user run, by `references/user-run.md`.

## What to test

- Test behavior through the public interface of the unit: what it returns, what
  it changes, what it raises. Never test how it does it.
- Give every acceptance criterion that code can observe at least one test.
- Give every branch the change adds a test:
  - the normal path;
  - the boundaries of each input: empty, zero, one, many, the minimum, the
    maximum, a missing value;
  - every error behavior the request names, one test per error.
- Give a bug fix a regression test that fails on the code before the fix.

## What not to test

Write no test for:

- a private function, directly. Reach it through the public interface;
- the behavior of a third-party library, the framework, or the language;
- generated code;
- the same behavior twice at the same level;
- a change that adds or alters no behavior: documentation, comments,
  configuration values, renames.

## Structure

- Test one behavior per test.
- Write three parts, in this order: arrange the inputs, act by calling the unit
  once, assert the outcome.
- Name the test by the unit, the condition, and the expected result, in the
  project's naming style.
- Write no loops and no conditionals inside a test. Use the framework's table or
  parameterized form for many inputs of one behavior. A framework with none gets
  one `for` loop over a list of cases. The loop calls one test per case and puts
  the case in the test name.
- Write expected values as literals. Never compute the expected value with the
  same logic as the code under test.
- Use the project's fixtures and factories for shared setup. Show in the test
  every value that its assertion depends on.

## Determinism

A test gives the same result on every run, on every machine, in any order:

- no dependence on the order of tests or on state another test left behind;
- no real network, no real clock, no random values without a fixed seed;
- no files outside a temporary folder that the test creates and removes;
- no sleeping and no waiting on real time. Advance a fake clock instead;
- no dependence on environment variables, locale, or time zone that the test
  does not set itself.

## Test doubles

- Replace only a system boundary.
- Use the project's own fakes, factories, and helpers before writing a new test
  double.
- Never replace the unit under test or any part of it.
- Use the real collaborator when it is fast and deterministic.
- Assert on a call to a test double only when the call itself is the behavior,
  such as `sends exactly one email`.

## Assertions

- Assert the specific outcome: the value, the state, the emitted event.
  `does not throw` alone proves nothing.
- In an error test, assert the error type and its message or code.
- Assert only what the behavior under test decides. Never assert on incidental
  details such as log text, field order, or internal counters.
- Write no snapshot test for logic. Use a snapshot only for large rendered
  output, and only where the project already uses snapshots.

## A test must be able to fail

- Give every test at least one assertion.
- Make a test for a refactor pass before and after the refactor. Break the
  asserted behavior by hand once, see the failure, and restore the code.
- When the caller names a mutation command, run it instead of breaking the
  behavior by hand. Limit the command to the changed files.

## Test kind

- Write unit tests by default.
- Write an integration test only in two cases: the request names one, or an
  acceptance criterion has no unit-level proof and the project already has
  integration tests for that area.
- A coverage threshold the project enforces is part of the test command and
  holds for the change. Never write a test only to raise a number.

## Existing tests

- Edit an existing test only for a behavior the change alters, or for an import,
  path, or symbol name the change renames or moves. A weak test or an
  over-mocked test that the request names is the third reason.
- Fix a weak test by an expected value written as a literal: what the unchanged
  code returns, changes, or raises. Fix an over-mocked test by the real
  collaborator, when it is fast and deterministic.
- In an over-mocked test, delete each assertion on a call to the double that the
  fix removes. Assert the real result in its place.
- Never edit an assertion for a rename or a move. Fix every other failing test
  in the code.
- Leave alone a test that already failed before the change, unless an acceptance
  criterion covers it. Report that test.

## Test-first loop

- Write every test the request names. Add one test for every behavior the change
  adds or alters that those tests do not cover.
- Write each test before the code that makes it pass. Run it with the
  `test one file` command and confirm it fails for the expected reason: the
  missing behavior, a symbol that does not exist yet included, never a mistake
  in the test. Then write the code and run the test again.
- Start a bug fix with a regression test.
- Before a refactor of code that no existing test covers, read
  `references/characterization-tests.md` and write characterization tests by it.
  Confirm they pass before and after the refactor.
