# Characterization tests

Read this file in Step 7. A characterization test records what the code does
today, so that a refactoring that changes behavior fails a test. Follow these
rules in any language and any test framework. Prefer a convention of the
project over a rule here: its framework, test location, naming, fixtures, and
helpers, as recorded in Step 3c. Never add a second framework or a second
style beside the project's.

## What to record

- Record the behavior of the code a plan entry changes, and nothing beyond it.
- Test through the public interface that reaches the code: what it returns,
  what it changes, what it raises. Never test how it does it.
- Give every branch the plan entry touches a test:
  - the normal path;
  - the boundaries of each input: empty, zero, one, many, the minimum, the
    maximum, a missing value;
  - every error the code raises, one test per error.
- Record the current result as the expected value, right or wrong. Run the
  code, read the result, and write it into the assertion as a literal.
- Put a result that looks wrong in the refactor report under *Bugs found*.
  Keep the test asserting that result.
- Before merging clones, record the behavior of every copy. Two copies that
  differ in one branch are two behaviors.

## Reaching the code

- Reach a private function through the public function that calls it.
- Replace only system boundaries with a test double: network, clock,
  filesystem, database, external services, randomness.
- Use the project's own fakes, factories, and helpers before writing a new
  test double.
- Use a seam the code already has: a parameter, a constructor argument, an
  injected dependency, a module the framework lets a test replace.
- Add a seam only from the safe set, such as Extract Function around the call
  to a system boundary. Make it a plan entry of its own, placed first.
- Drop the plan entry when no seam reaches the code. Record the reason under
  *Dropped*.

## Structure of a test

- Test one behavior per test, so that a test has one reason to fail.
- Write three parts, in this order: arrange the inputs, act by calling the
  code once, assert the outcome.
- Name the test by the unit, the condition, and the result it records, in the
  project's naming style. Example:
  `parseRange returns an empty list for "5-1"`.
- Write no loops and no conditionals inside a test. Use the framework's table
  or parameterized form for many inputs of one behavior.
- Write expected values as literals. Never compute the expected value with the
  same logic as the code under test.
- Assert the specific outcome: the value, the state, the raised error with
  its type and message. `does not throw` alone proves nothing.
- Use a snapshot only for large rendered output, and only when the project
  already uses snapshots for that area.

## Determinism

Make a test give the same result on every run, on every machine, in any order.
- No dependence on the order of tests or on state another test left behind.
- No real network, no real clock, no random values without a fixed seed.
- No files outside a temporary folder that the test creates and removes.
- No sleeping and no waiting on real time. Advance a fake clock instead.
- No dependence on environment variables, locale, or time zone that the test
  does not set itself.

## A test must be able to fail

- Run each new test on the unchanged code and confirm it passes.
- Break the asserted behavior once: change a returned value, a condition, or
  a raised error in the code. Confirm the test fails. Restore the code.
- When the project configures mutation testing, use it instead for a `high`
  risk plan entry. Run it over the code of the entry. Give every surviving
  mutant a test.
- Give every test at least one assertion.

## After the refactoring

- Keep the characterization tests in the change. They are the proof of the
  refactoring and the safety net of the next one.
- Update in a characterization test only an import, a path, or a symbol name
  that a plan entry moved or renamed. Never update its assertion.
- When a plan entry makes a characterization test fail, the entry changed
  behavior. Restore the checkpoint.
