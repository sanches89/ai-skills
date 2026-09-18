# Analysis rules

Read this file in Step 6. A function is a function, a method, or a
procedure. A module is a class, a file, or a package. A finding is one
location that these rules keep after its code is read, with its evidence
and its action.

## What to read

Read the code behind these entries of `current.json`:
- the first 10 entries of `duplication.top`;
- the first 10 entries of `complexity.top`;
- the first 5 entries of `hotspots.top`;
- every name in `tests.failedTests`, with its message in the current JUnit
  report;
- the first 10 entries of `coverage.functions.top`;
- the first 5 entries of `coverage.top`;
- the first 5 entries of `coverage.filesNotInReport`.

With a base name, read also every entry of `diff.json` under `added`,
`changed`, `newFailed`, and `coverage.files.worse`, and every entry of
`changedFiles`. Read an entry that appears in two lists once.

Read a function from its `line` to its end. Read both locations of a clone.
For a hotspot, read the last 10 commit subjects of the file:
`git log -10 --format=%s -- <file>`.

## Clones

Keep a clone as a finding of kind `duplicated code` when both copies state
one rule and change for the same reason. The action is `extract function`
when the copies are in one module, else `move to a shared module`. The
evidence is the two locations and the line count.

Leave a clone when:
- it holds only imports, declarations, or type definitions;
- it is test data, a fixture, or a table of literals;
- it is in generated code: the first line of the file says so;
- the copies change for different reasons, such as two external formats
  that look alike today.

## Functions over a limit

Keep a function as a finding when the code shows the smell behind the value
over the limit:
- `ccn` over the limit, and the branches are not one flat `switch` or
  mapping from values to results. Kind `complex function`. Action
  `replace nested conditionals with guard clauses` when conditionals nest
  3 levels or deeper, else `extract function`;
- `length` over the limit, and the body is not one flat list of steps
  without a branch. A route list and a configuration table are such lists.
  Kind `long function`. Action `extract function`;
- `params` over the limit, and the signature is not one that callers
  outside the repository depend on. Kind `long parameter list`. Action
  `introduce parameter object`.

The evidence is the measured values against their limits. A test function
over a limit is a finding of the same kind, ranked after every other
finding.

## Hotspots

A hotspot is a finding only when its file holds an entry of
`complexity.top`, `duplication.top`, or `coverage.functions.top` that these
rules keep. Then the finding is that entry, ranked by the hotspot score of
the file under *Ranking*, with the commit subjects added to its evidence:
what kind of change keeps hitting the file. A hotspot with no such entry
appears only on the *Hotspots* line under *Measurements*.

## Tests

Every failed test is a finding of kind `failed test`. The evidence is the
first line of its failure message from the current JUnit report. The action
is `fix the test or the code`. A skipped test is never a finding: the
*Unit tests* line under *Measurements* counts skipped tests. A slow test is
never a finding.

With a base name, when `tests.total` fell, add one finding of kind
`tests removed` with the two counts. The action is
`restore the tests or state why they went`. To name the tests, compare the
`name` attributes of the `<testcase>` elements of the two JUnit reports.

## Coverage

- A function in `coverage.functions.top` with `crap` of 30 or more is a
  finding of kind `untested complex function`. The action is
  `add tests before changing it`. A function with `crap` below 30 is a
  finding only when it is also over a limit. Then the finding is the
  function over the limit, with the action
  `add tests, then <the action of its kind>`.
- A file in `coverage.filesNotInReport` that holds a function is a finding
  of kind `file no test loads`, one finding per file. The action is
  `add tests`. Leave a file that holds only declarations, types, or
  constants.
- With a base name, a changed file with an uncovered line in a changed hunk
  is a finding of kind `changed code without tests`. Read
  `git diff <base-commit> -- <file>` against the lines the coverage report
  marks to confirm the hunk. The action is
  `add tests for the changed lines`. A changed file in
  `coverage.filesNotInReport` is a finding of this kind too.

## Actions

The action of a finding is an item of this list, or two items joined by
`, then`:
- `fix the test or the code`;
- `restore the tests or state why they went`;
- `add tests`;
- `add tests before changing it`;
- `add tests for the changed lines`;
- `extract function`;
- `replace nested conditionals with guard clauses`;
- `introduce parameter object`;
- `move to a shared module`.

## Ranking

Order the findings:
1. every failed test, and the `tests removed` finding;
2. with a base name, every finding that explains a name in `worse`: an
   added clone for a `duplication` name, an added function for a
   `complexity` name, and a `changed code without tests` finding for a
   `coverage` name;
3. with a base name, every other finding in a changed file, with the entries
   that `diff.json` lists under `added` first;
4. every other finding, by the hotspot score of its file, highest first. A
   file with no score comes after every file with one;
5. inside one rank, by `crap`, then `ccn`, then clone lines, highest first.

Keep at most 12 findings. Count the findings left out, per kind, for the
*Skipped* section of the measurement report.
