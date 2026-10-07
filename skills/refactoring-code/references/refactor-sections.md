# Refactor sections

Sections: The task; Each subtask; Characterization tests.

Read *Characterization tests* in Step 6 and the whole file in Step 7. It
says what each section of the refactor task and of each subtask holds. The
`formatting-tasks` skill holds the format itself. Fill each section with
what the review settled. Step numbers are those of `SKILL.md`.

## The task

- *Title*: `Refactor <refactor scope in a few words>`.
- *Summary*: the refactor scope, the smells found, and the structure after
  every subtask.
- *Success criteria*: one per command from 3b, passing with no failure
  beyond the baseline, each baseline failure named. One per part of the
  contract in `contract.md` from Step 5: same name, signature, and format,
  except a change the request names. One per entry: the structure after
  the change. The test counts: total not below the baseline, failed and
  skipped not above it. The coverage counts: uncovered lines and branches
  not above the baseline. The duplication and complexity values the
  entries change, with the target value: duplicated lines, clone count,
  functions over each limit, and the highest `ccn`. Never the sum of
  `ccn`: Extract Function raises it by design. Never the coverage
  percentage: removing covered dead code lowers it with no test lost.
- *In scope*: every file of the refactor scope.
- *Out of scope*: every bug found, with its location and the statement that
  the code keeps it. Every finding with refactoring `report`, by its
  location, with no credential value. Every finding past the cut of Step 6,
  as `next batch` with its location and smell. Every finding dropped in
  Step 5 or Step 6, with its reason. Every part removed from the refactor
  scope in Step 4. Every part of the contract, as a statement that it
  stays. Every *Out of scope* entry of a requested task, restated.
- *Approach*: one bullet per entry, in order: path and symbol, then the
  structure after the change.
- *Decisions*: the rules every entry follows, as `refactoring-rules.md`
  states. The conventions from 3a and the test setup block from 3c. The
  rule that a subtask applies one refactoring and gets one commit.
- *Context*: the commands from 3b, with the test command of the measurement
  record in place of the plain test command, and the `test one file`
  command. The analysis tools from 3d with their limits. The measure
  command of the measurement record, as `analysis-tools.md` states. The
  `counts` line from Step 5. The baseline: one line per measurement with
  its values, or `skipped` with the reason. The test coverage of every
  function the entries change. For kind *task*, the identifier or path of
  the requested task.
- *References*: `None.` Never copy the References of a requested task.
- *Subtasks*: one line per entry, in order, with its dependencies.
- *Verification*: the commands from 3b, then the test command of the
  measurement record, then its measure command over the same paths.

## Each subtask

- *Title*: the refactoring and the symbol, imperative, under 80 characters.
- *Goal*: the structure after the change, in one sentence.
- *Context*: the smell and its evidence, with every location as `path:line`.
  For *Convention drift*, the exemplar file. The tests that cover the code,
  or the statement that none does. The `test one file` command. The rules
  from `refactoring-rules.md` and the conventions this refactoring follows,
  restated. Every part of the contract the change touches, as a statement
  that it stays. For a rename or a move across many files, the rewrite
  tool from `analysis-tools.md`. For an entry marked
  `characterization tests first`, the rules of *Characterization tests*
  below.
- *References*: `None.`
- *Changes*: first, for an entry marked `characterization tests first`, the
  test file, `(new)` or existing, with every test case from Step 6 named.
  Then every file the refactoring changes, with the symbol and the structure
  after the change. A file it creates, marked `(new)`, with what it holds.
- *Acceptance criteria*: each named characterization test passes on the
  unchanged code and after the change. The structure after the change, as a
  binary check. The tests that cover the code pass. Every part of the
  contract the change touches keeps its name, signature, and format. No
  assertion of an existing test changed.
- *Verification*: the one command from Step 6.

## Characterization tests

The review names the test cases and the seam in the subtask. The
implementer writes the tests.

- Put a new seam in a subtask of its own, placed before every entry it
  serves. Its refactoring is from the safe set, and its default equals the
  current collaborator. The seam stays in the code after the tests.
- Put a result of the unchanged code that looks wrong under the task's
  *Out of scope*, and keep its test case.

Write these rules into the Context section of every subtask that names a
characterization test:
- One behavior per test, with the expected value as a literal from the
  unchanged code. Never compute the expected value with the same logic as
  the code under test.
- Assert the specific outcome: the value, the state, the raised error with
  its type and message. `does not throw` alone proves nothing.
- No real network, no real clock, no random values without a fixed seed, no
  sleeping, no files outside a temporary folder.
- Each test passes on the unchanged code and fails once when the asserted
  behavior is broken. The implementer breaks the behavior by hand and
  restores it. For a `high` risk subtask, name the mutation command instead,
  as `analysis-tools.md` states.
- Every test holds at least one assertion.
- The characterization tests stay in the change, as the proof of the
  refactoring and the safety net of the next one.
- A characterization test changes only in an import, a path, or a symbol
  name that a subtask moves or renames. Its assertion never changes.
