# Unit testing

Rules for every test this skill writes. They hold for any language and any
test framework. A convention of the project wins over a rule here: its
framework, test location, naming, fixtures, and helpers, as recorded in Step
4e. Never add a second framework or a second style beside the project's.

## What to test

- Test behavior through the public interface of the unit: what it returns,
  what it changes, what it raises. Never test how it does it.
- Every criterion that code can observe has at least one test.
- Every branch the change adds has a test:
  - the normal path;
  - the boundaries of each input: empty, zero, one, many, the minimum, the
    maximum, a missing value;
  - every error behavior the target names, one test per error.
- A bug fix has a regression test that fails on the code before the fix.

## What not to test

- A private function, directly. Reach it through the public interface.
- The behavior of a third-party library, the framework, or the language.
- Generated code.
- The same behavior twice at the same level.

## Structure of a test

- One behavior per test. A test has one reason to fail.
- Three parts, in this order: arrange the inputs, act by calling the unit once,
  assert the outcome.
- The test name states the unit, the condition, and the expected result, in
  the project's naming style. Example:
  `RetryPolicy.next returns null after the fifth attempt`.
- No loops and no conditionals inside a test. Many inputs for one behavior use
  the framework's table or parameterized form.
- Expected values are literals. Never compute the expected value with the same
  logic as the code under test.
- Shared setup uses the project's fixtures and factories. A test shows every
  value that its assertion depends on.

## Determinism

A test gives the same result on every run, on every machine, in any order.
- No dependence on the order of tests or on state another test left behind.
- No real network, no real clock, no random values without a fixed seed.
- No files outside a temporary folder that the test creates and removes.
- No sleeping and no waiting on real time. Advance a fake clock instead.
- No dependence on environment variables, locale, or time zone that the test
  does not set itself.

## Test doubles

- Replace only system boundaries: network, clock, filesystem, database,
  external services, randomness.
- Use the project's own fakes, factories, and helpers before writing a new
  test double.
- Never replace the unit under test or any part of it.
- Use the real collaborator when it is fast and deterministic.
- Assert on a call to a test double only when the call itself is the behavior,
  for example `sends exactly one email`.

## Assertions

- Assert the specific outcome: the value, the state, the emitted event.
  `does not throw` alone proves nothing.
- An error test asserts the error type and its message or code.
- Assert only what the behavior under test decides. Never assert on incidental
  details such as log text, field order, or internal counters.
- No snapshot test for logic. A snapshot is allowed only for large rendered
  output, and only when the project already uses snapshots for that area.

## A test must be able to fail

- Run each new test before the code exists and confirm it fails for the
  expected reason: the missing behavior, never a mistake in the test.
- A test for a refactor passes before and after the refactor. Prove it is able
  to fail by breaking the asserted behavior once, seeing the failure, and
  restoring the code.
- Every test holds at least one assertion.

## Kind of test

- Unit tests are the default.
- Write an integration test only in two cases: the target names one, or a
  criterion has no unit-level proof and the project already has integration
  tests for that area.
- When the project enforces a coverage threshold, it is part of the test
  command and holds for the change. Never write a test only to raise a number.

## Existing tests

- Edit an existing test only when the target changes the behavior it asserts.
  Update it to the new behavior and list the file in the work report's
  *Changes*.
- Never delete, skip, or loosen a test to make a run pass.
- A test that already failed in the baseline is left alone and listed under
  *Affects other work*, unless a criterion covers it.
