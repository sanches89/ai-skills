# Checks

Run each check over the tests the invoking form or mode names; by
default, every test this run added or edited in the files. A failure line
names the check by its bold name.

- **one behavior**: the test acts once and asserts one behavior.
- **name**: the name states the unit, the condition, and the expected
  result.
- **no logic**: the test holds no loop and no conditional, except the one
  `for` loop over cases in a framework without a table form.
- **literal**: every expected value is a literal, never computed with the
  logic under test.
- **visible values**: the test shows every value its assertion depends on.
- **deterministic**: the test uses no shared state and keeps every rule
  of *Determinism* in `SKILL.md`.
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
