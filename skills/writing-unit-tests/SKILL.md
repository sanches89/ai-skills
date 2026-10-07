---
name: writing-unit-tests
description: Writes and reviews unit tests by rules that make each test prove one behavior and fail when it breaks, characterization tests included. Use when tests need writing, fixing, or reviewing, when code lacks tests, when a bug needs a regression test, or before changing code that no test covers.
license: MIT
compatibility: Requires the finding-dev-commands skill.
argument-hint: <code paths to test | test files to review>
---

# Writing unit tests

Write and review unit tests that each prove one behavior and fail when that
behavior breaks. The rules hold in any language and framework. A convention
of the project, as the test setup records it, beats a rule here. The request
is the task the caller works on, or what the user asked for.

## Terms

These words have exactly one meaning in this skill.

- **System boundary**: the network, files, a database, the clock,
  randomness, the process environment, or third-party code. Third-party
  code includes a framework, a driver, an HTTP client, and a UI toolkit.

## Hard rules

1. **No test setup, no test.** Without a test setup, write no test and
   install no test framework. A framework the project never chose binds
   every later change to it.
2. **One framework, the project's.** Never add a second test framework or
   style beside the project's. Two styles split every fixture and helper in
   two.
3. **Never weaken a test.** Never delete, skip, or loosen a test to make a
   run pass. A loosened test hides the defect it was written to catch.

## Invocation

When the invocation text starts with `from <skill name>:`, another skill
invoked this run. Ask nothing. Follow the form the text names, and end with
its return block and nothing else. Without that prefix, a user invoked this
skill: run the standalone workflow.

- `from <caller>: setup for <paths>[, test <command>][, test one file
  <command>]`: record the test setup for the paths, separated by spaces.
  Return the **test setup** block below. This form runs Step 1 only.
- `from <caller>: write`: load the rules; the caller writes its tests by
  them and by the test-first loop. Return `rules loaded`.
- `from <caller>: characterization`: load the Characterization tests
  section; the caller names test cases and the seam by it. Return
  `rules loaded`.
- `from <caller>: check <test file>...`: run the Checks over the tests the
  caller added or edited in those files. Return one line per failure,
  `<path:line> <check>`, or `pass`.

The rules are the sections from *What to test* to *Characterization
tests*. The **test setup** block:

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

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Take the paths from the invocation text, or from the user's request: the
code to test, or the test files to review. Take the test command and the
`test one file` command from the invocation text, after `test` and
`test one file`. When either is missing, invoke the
`finding-dev-commands` skill (in Claude Code, with the `Skill` tool)
with the invocation text `from writing-unit-tests: find`. Take its `test`
and `test one file` lines. When the `test one file` command is still
missing or reads `none`, take the test command in its place.

The project has a test setup when it has a test command and the repository
holds at least one test file. Then record:
- the test framework and its version, from the manifest or lockfile;
- where tests for the paths live, and how test files and cases are named;
- the fixtures, factories, fakes, and helpers the existing tests use;
- the `test one file` command;
- the existing tests that cover the paths.

Without a test setup, record the reason. A standalone run then tells the
user the reason and stops.

### Step 2: Write or review

Pick the mode from the user's request:
- **Write mode**: the user asks for tests written or fixed, for a
  regression test, or for tests that pin down code before a change. Write
  the tests by the rules and the *Test-first loop*.
- **Review mode**: the user asks for tests reviewed. Run the *Checks* over
  the test files. Fix a failure only when the user asked for changes.

### Step 3: Verify

Skip this step in review mode without changes. Run each test file this run
added or edited alone, with the `test one file` command, so that no test
depends on another file's state. Then run the test command. Fix every
failure, then run the *Checks* over every test file this run added or
edited, and fix every check that fails. After any fix, run this step again.

### Step 4: Report

End with the test files this run added or edited, each with the behaviors
its tests prove. Add every result or test a rule says to report. In review
mode, end with one line per failure, `<path:line> <check>`, or `pass`.

## What to test

- Test behavior through the public interface of the unit: what it returns,
  what it changes, what it raises. Never test how it does it.
- Give every acceptance criterion that code can observe at least one test.
- Give every branch the change adds a test:
  - the normal path;
  - the boundaries of each input: empty, zero, one, many, the minimum, the
    maximum, a missing value;
  - every error behavior the request names, one test per error.
- Give a bug fix a regression test that fails on the code before the fix.

## What not to test

- A private function, directly. Reach it through the public interface.
- The behavior of a third-party library, the framework, or the language.
- Generated code.
- The same behavior twice at the same level.
- A change that adds or alters no behavior: documentation, comments,
  configuration values, renames. Write no new test for it.

## Structure

- Test one behavior per test, so that a test has one reason to fail.
- Write three parts, in this order: arrange the inputs, act by calling the
  unit once, assert the outcome.
- Name the test by the unit, the condition, and the expected result, in the
  project's naming style:
  `RetryPolicy.next returns 8000 ms for the fifth attempt`.
- Write no loops and no conditionals inside a test. Use the framework's table
  or parameterized form for many inputs of one behavior. A framework with
  none gets one `for` loop over a list of cases. The loop calls one test per
  case and puts the case in the test name.
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
- Use the project's own fakes, factories, and helpers before writing a new
  test double.
- Never replace the unit under test or any part of it.
- Use the real collaborator when it is fast and deterministic.
- Assert on a call to a test double only when the call itself is the
  behavior, such as `sends exactly one email`.

## Assertions

- Assert the specific outcome: the value, the state, the emitted event.
  `does not throw` alone proves nothing.
- In an error test, assert the error type and its message or code.
- Assert only what the behavior under test decides. Never assert on
  incidental details such as log text, field order, or internal counters.
- Write no snapshot test for logic. Use a snapshot only for large rendered
  output, and only where the project already uses snapshots.

## A test must be able to fail

- Give every test at least one assertion.
- Run each new test before the code exists and confirm it fails for the
  expected reason, as the *Test-first loop* states.
- Make a test for a refactor pass before and after the refactor. Break the
  asserted behavior by hand once, see the failure, and restore the code.
- When the caller names a mutation command, run it instead of breaking the
  behavior by hand. Limit the command to the changed files.

## Kind of test

- Write unit tests by default.
- Write an integration test only in two cases: the request names one, or an
  acceptance criterion has no unit-level proof and the project already has
  integration tests for that area.
- A coverage threshold the project enforces is part of the test command and
  holds for the change. Never write a test only to raise a number.

## Existing tests

- Edit an existing test only for a behavior the change alters, or for an
  import, path, or symbol name the change renames or moves. A weak test or
  an over-mocked test that the request names is the third reason.
- Fix a weak test by an expected value written as a literal: what the
  unchanged code returns, changes, or raises. Fix an over-mocked test by
  the real collaborator, when it is fast and deterministic.
- In an over-mocked test, delete each assertion on a call to the double
  that the fix removes. Assert the real result in its place.
- Never edit an assertion for a rename or a move. Fix every other failing
  test in the code.
- Leave alone a test that already failed before the change, unless an
  acceptance criterion covers it. Report that test.

## Test-first loop

- Write every test the request names. Add one test for every behavior the
  change adds or alters that those tests do not cover.
- Write each test before the code that makes it pass. Run it with the
  `test one file` command and confirm it fails for the expected reason: the
  missing behavior, a symbol that does not exist yet included, never a
  mistake in the test. Then write the code and run the test again.
- Start a bug fix with a regression test.
- Before a refactor of code that no existing test covers, write
  characterization tests. Confirm they pass before and after the refactor.

## Characterization tests

A characterization test records what the code does today, so that a
refactoring that changes behavior fails a test. The project's framework,
test location, naming, fixtures, and helpers replace a rule here.

**What to record.**
- Record the behavior of the code the change touches, and nothing beyond it.
- Test through the public interface that reaches the code: what it returns,
  what it changes, what it raises. Never test how it does it.
- Name one test case per branch the refactoring touches:
  - the normal path;
  - the boundaries of each input: empty, zero, one, many, the minimum, the
    maximum, a missing value;
  - every error the code raises, one test per error.
- Name each test case by the unit, the condition, and the result it records,
  in the project's naming style. Example:
  `parseRange returns an empty list for "5-1"`.
- Run or read the current code. Write its result into the test case name as
  a literal, right or wrong. Keep the test case when the result looks wrong,
  and report that result.
- Before merging clones, record the behavior of every copy. Two copies that
  differ in one branch are two behaviors.

**Reaching the code.**
- Reach a private function through the public function that calls it.
- Replace only a system boundary with a test double.
- Use the project's own fakes, factories, and helpers before a new test
  double.
- Use a seam the code already has: a parameter, a constructor argument, an
  injected dependency, a module the framework lets a test replace.
- Add a seam only by one of these refactorings, as a change of its own made
  before the tests. Take the first one that reaches the code:
  1. Parameterize Function: the collaborator becomes a parameter with a
     default equal to the current one;
  2. Parameterize Constructor: the same, as a constructor argument stored
     in a field;
  3. Extract Function around the call to the system boundary, so that a
     test replaces the one function.
- Keep the seam in the code after the tests: later refactorings inject
  through it.
- When no seam reaches the code, write no characterization test for it and
  change none of that code. Report the reason.

## Checks

Run each check over every test this run added or edited in the files. An
existing test the run left alone is no failure. A failure line names the
check by its bold name.

- **one behavior**: the test acts once and asserts one behavior.
- **name**: the name states the unit, the condition, and the expected
  result.
- **no logic**: the test holds no loop and no conditional, except the one
  `for` loop over cases in a framework without a table form.
- **literal**: every expected value is a literal, never computed with the
  logic under test.
- **visible values**: the test shows every value its assertion depends on.
- **deterministic**: the test uses no shared state, real network, real
  clock, unseeded random value, or sleep. It touches no file outside a
  temporary folder. It sets every environment variable, locale, and time
  zone it reads.
- **boundary doubles**: every test double replaces a system boundary, never
  the unit under test. An assertion on a call to a double exists only where
  the call is the behavior.
- **public interface**: no direct test of a private function, a third-party
  library, the framework, the language, or generated code.
- **assertion**: the test holds at least one assertion, and never
  `does not throw` alone.
- **error**: an error test asserts the error type and its message or code.
- **incidental**: no assertion on log text, field order, or internal
  counters.
- **snapshot**: no snapshot of logic, and no snapshot where the project
  uses none.
- **weakened**: against `HEAD`, no test is deleted, skipped, or loosened,
  and no assertion changed for a rename or a move. An assertion on a call
  to a removed double, replaced by one on the real result, is no loosening.
