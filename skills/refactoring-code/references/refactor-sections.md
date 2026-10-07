# Refactor sections

Sections: The task; Each subtask; Characterization tests.

What each section of the refactor task and of each subtask holds. Step
numbers are those of `SKILL.md`.

## The task

- *Title*: `Refactor <refactor scope in a few words>`.
- *Summary*: the refactor scope, the smells found, and the structure after
  every subtask.
- *Success criteria*: one per command from 3b, passing with no failure
  beyond the baseline, each baseline failure named. One per part of the
  contract in `contract.md` from Step 5: same name, signature, and format,
  except a change the request names. One per entry: the structure after the
  change. The test counts: total not below the baseline, failed and skipped
  not above it. The coverage counts: uncovered lines and branches not above
  the baseline. The duplication and complexity values the entries change,
  each with its value after the change: duplicated lines, clone count,
  functions over each limit, and the highest `ccn`. Never the sum of `ccn`
  or the coverage percentage.
- *In scope*: every file of the refactor scope.
- *Out of scope*: every bug found, with its location and the statement that
  the code keeps it. Every finding with refactoring `report`, by its
  location, with no credential value. Every finding past the cut of Step 6,
  as `next batch` with its location and smell. Every finding dropped in
  Step 5 or Step 6, with its reason. Every part removed from the refactor
  scope in Step 4. Every part of the contract, as a statement that it
  stays. Every *Out of scope* entry of a task read in Step 2, restated.
- *Approach*: one bullet per entry, in order: every file its Changes
  section names, a characterization test file and a moved caller included.
  Each file with its symbol and the structure after the change.
- *Decisions*: the rules every entry follows, as `refactoring-rules.md`
  states. The conventions from 3a and the test setup block from 3c. The
  rule that a subtask applies one refactoring and gets one commit.
- *Context*: the commands from 3b, with the test command of the measurement
  record in place of the plain test command, and the `test one file`
  command. The analysis tools from 3d with their limits. The measure
  command of the measurement record, with its paths and options. In each
  command, `<scratch-dir>` in place of the scratch directory, with the
  statement that `<scratch-dir>` is a scratch directory outside the
  repository. The `counts` line from Step 5. The baseline: one line per
  measurement with its values, or `skipped` with the reason. The test
  coverage of every function the entries change. For request kind *task*,
  the identifier or path of the requested task.
- *References*: `None.` Never copy the References of a requested task.
- *Subtasks*: one line per entry, in order, with its dependencies.
- *Verification*: the commands from 3b, then the test command of the
  measurement record, then its measure command over the same paths. Both
  read `<scratch-dir>` as in Context. Then the structural check of every
  entry. Then one search per part of the contract that an entry touches,
  which finds its name and signature unchanged.

## Each subtask

- *Title*: the refactoring and the symbol, imperative, under 80 characters.
- *Goal*: the structure after the change, in one sentence.
- *Context*: the smell and its evidence, with every location as `path:line`.
  For *Convention drift*, the exemplar file. The tests that cover the code,
  or the statement that none does. The `test one file` command. The rules
  from `refactoring-rules.md` and the conventions this refactoring follows,
  restated. Every part of the contract the change touches, as a statement
  that it stays. For a rename or a move across many files, the rewrite
  tool from `analysis-tools.md`. For Remove Dead Code, the proof from the
  evidence of the finding. For an entry marked
  `characterization tests first`, the rules of *Characterization tests*
  below. For a subtask whose command holds `<scratch-dir>`, the statement
  that `<scratch-dir>` is a scratch directory outside the repository.
- *References*: `None.`
- *Changes*: first, for an entry marked `characterization tests first`, the
  test file, `(new)` or existing, with every test case from Step 6 named.
  Then every file the refactoring changes, with the symbol and the structure
  after the change. A file it creates, marked `(new)`, with what it holds.
- *Acceptance criteria*: each named characterization test passes on the
  unchanged code and after the change. The structure after the change, as a
  binary check. The tests that cover the code pass. Every part of the
  contract the change touches keeps its name, signature, and format. No
  assertion of an existing test changed, except by the refactoring the
  subtask names. Replace Assertion with Literal changes an expected value.
  Replace Test Double with Real Collaborator swaps each assertion on a call
  to the removed double for one on the real result.
- *Verification*: the one command from Step 6.

## Characterization tests

The subtask names the test cases and the seam. The implementer writes the
tests.

- Put a new seam in a subtask of its own, placed before every entry it
  serves. Its refactoring is one of the seams of Step 5. The seam stays in
  the code after the tests.
- Put a result of the unchanged code that looks wrong under the task's
  *Out of scope*, and keep its test case.

Write these rules into the Context section of every subtask that names a
characterization test:
- The tests follow the rules of the `writing-unit-tests` skill, which the
  implementer loads before the first test.
- For a `high` risk subtask, the mutation command when it holds `<files>`,
  as `analysis-tools.md` states, which the implementer runs. Else the
  statement that the implementer breaks the asserted behavior by hand once.
- The characterization tests stay in the change.
