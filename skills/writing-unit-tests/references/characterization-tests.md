# Characterization tests

**What to record.**

- Record the behavior of the code the change touches, and nothing beyond it.
- Test through the public interface that reaches the code, as _What to test_ of
  `SKILL.md` states.
- Name one test case per branch the refactoring touches: the normal path, the
  input boundaries that _What to test_ lists, and one test per error the code
  raises.
- Name each test case by the unit, the condition, and the result it records, in
  the project's naming style. Example:
  `parseRange returns an empty list for "5-1"`.
- Run or read the current code. Write its result into the test case name as a
  literal, right or wrong. Keep the test case when the result looks wrong, and
  report that result.
- Before merging clones, record the behavior of every copy. Two copies that
  differ in one branch are two behaviors.

**Reaching the code.**

- Reach a private function through the public function that calls it.
- Use a test double only as _Test doubles_ of `SKILL.md` allows.
- Use a seam the code already has: a parameter, a constructor argument, an
  injected dependency, a module the framework lets a test replace.
- Add a seam only by one of these refactorings, as a change of its own made
  before the tests. Take the first one that reaches the code:
  1. Parameterize Function: the collaborator becomes a parameter with a default
     equal to the current one;
  2. Parameterize Constructor: the same, as a constructor argument stored in a
     field;
  3. Extract Function around the call to the system boundary, so that a test
     replaces the one function.
- Keep the seam in the code after the tests.
- When no seam reaches the code, write no characterization test for it and
  change none of that code. Report the reason.
