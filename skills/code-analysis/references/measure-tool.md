# The measure tool

Read this file in Step 2b.

## Command

The measure tool is `code-measure`, from the npm package `code-measure`,
with its source at `github.com/sanches89/code-measure`. It needs Node.js 20
or newer. The measure command `<measure>` takes the first form below whose
condition holds:
- `code-measure`, when `PATH` has it and `code-measure --version` prints a
  version that starts with `1.`;
- otherwise `npx --yes code-measure@1`, which fetches the newest release of
  major version 1 into the npx cache. The first run needs network access.

Never install the measure tool into the project. Run it from the root of
the tree it measures. It changes no file there. It prints one summary with
`"version": 1` on stdout, with five measurements:
- `duplication`, from jscpd, which ships with the measure tool and reads
  more than 200 languages;
- `complexity`, from lizard, which reads about 25 languages. The measure
  tool runs `lizard` from `PATH`, else `uvx lizard`, else `pipx run lizard`,
  else `python3 -m lizard`;
- `hotspots`, from the git history. The score of a file is its commit count
  since `--since`, default 12 months ago, multiplied by its complexity: the
  sum of the `ccn` of its functions, or its line count without lizard;
- `tests`, from the JUnit XML reports passed with `--test-report`;
- `coverage`, from the LCOV, Cobertura XML, JaCoCo XML, or Go cover profile
  reports passed with `--coverage-report`.

The measure tool never runs the tests: it reads the reports the project's
own test command wrote. It respects `.gitignore` and leaves data and prose
formats, such as JSON, YAML, and Markdown, out of every measurement.

## Options this skill uses

- `<path>...`: `.`, the root of the measured tree.
- `--ignore "<glob>,<glob>"`: the ignore globs of Step 2a. A glob supports
  `**`, `*`, and `?`.
- `--ccn <n>`, `--length <n>`, `--params <n>`: the limits of Step 2b. A
  function over any of them is counted in `complexity.overLimit` and listed
  in `complexity.top`.
- `--top 200`: the entries per list. A list with 200 entries is cut: the
  summary leaves out every entry beyond the 200th.
- `--test-report <path>`: a JUnit XML file, or a folder whose `*.xml` files
  are all JUnit reports. Pass the option once per JUnit report or folder.
- `--coverage-report <file>`: one coverage report, format read from the
  content. Pass the option once per coverage report.
- `--compare <file>`: the base summary. The measure tool reuses its limits,
  ignore globs, and paths; passing a limit or `--ignore` next to
  `--compare` is an error. The summary then also holds `delta`, `worse`,
  and `notCompared`.

Run `<measure> --help` for the other options.

## Exit codes

- `0`: a summary is printed. A skipped or failed measurement still exits 0.
- `1`: unexpected failure.
- `2`: invalid arguments:
  - an unknown option;
  - a path, a JUnit report, or a coverage report that does not exist;
  - an unusable `--compare` file;
  - a limit passed next to `--compare`.
- `3`: `--compare` found at least one compared value that got worse. The
  summary is printed.

## Limits

The defaults are `--ccn 10`, `--length 50`, and `--params 4`. A clone is at
least 50 tokens and 5 lines. The project's own limit replaces a default when
a tool below configures that limit:
- ESLint: `complexity` for `--ccn`, `max-lines-per-function` for
  `--length`, `max-params` for `--params`, in `eslint.config.*` or
  `.eslintrc*`;
- ruff and flake8: `max-complexity` for `--ccn`, in `pyproject.toml`,
  `ruff.toml`, `setup.cfg`, or `.flake8`;
- pylint: `max-args` for `--params`, in `pyproject.toml` or `.pylintrc`;
- RuboCop: `Metrics/CyclomaticComplexity` for `--ccn`,
  `Metrics/MethodLength` for `--length`, `Metrics/ParameterLists` for
  `--params`, in `.rubocop.yml`;
- golangci-lint: `gocyclo.min-complexity` for `--ccn`, in `.golangci.yml`;
- PHPMD: the `reportLevel` of `CyclomaticComplexity` for `--ccn`, in the
  PHPMD ruleset XML file;
- Checkstyle: the `max` of `CyclomaticComplexity` for `--ccn`, of
  `MethodLength` for `--length`, and of `ParameterNumber` for `--params`,
  in the Checkstyle XML configuration;
- PMD: the `methodReportLevel` of `CyclomaticComplexity` for `--ccn`, in
  the PMD ruleset XML file.

A cognitive complexity limit, such as Clippy's `cognitive_complexity` or
SonarQube's, is not a cyclomatic limit. Never use it for `--ccn`. With two
values for one limit in one repository, take the lower one.

## Reading a summary

- Every measurement has a `status`: `ok`, `skipped`, or `failed`. A `reason`
  follows every status other than `ok`. `settings` holds the limits, the
  ignore globs, `top`, and `since` of the run. `files` counts the files
  under the paths after the ignore globs.
- `duplication` holds `files`, `lines`, `duplicatedLines`, `percentage`,
  and `clones`. `top` lists the largest clones first, each with `lines`,
  `tokens`, `format`, and the two locations `a` and `b` as
  `path:start-end`.
- `complexity` holds `functions`, `maxCcn`, and `overLimit` with one count
  per limit. `top` lists the functions over a limit, highest `ccn` first,
  each with `function`, `file`, `line`, `ccn`, `length`, and `params`.
- `hotspots` holds `since` and `complexityMeasure`: `ccn` from lizard, or
  `lines` when lizard did not run. `top` ranks files by `score`, each with
  `commits` and `complexity`.
- `tests` holds `total`, `passed`, `failed`, `skipped`, and `seconds`.
  `failedTests` names the failed tests. `slowest` lists five tests with
  their `seconds`.
- `coverage` holds `format`, `files`, and `lines` and `branches`, each with
  `total`, `covered`, `uncovered`, and `percentage`. `branches` is `null`
  when the coverage report has no branch data. `filesNotInReport` lists the
  code files under the paths that the coverage report lacks: no test loaded
  them. `top` lists the files with uncovered lines, most first, each with
  `lines` and `branches` percentages, `uncoveredLines`, and
  `uncoveredBranches`.
- `coverage.functions` needs lizard. It counts the functions as `covered`,
  `partly`, or `none`. Its `top` lists every function with an uncovered
  line or branch, highest `crap` first, each with `ccn` and the `lines` and
  `branches` percentages. `crap` is the CRAP score:
  `ccn^2 * (1 - coverage)^3 + ccn`. A complex function without tests scores
  highest.
- With `--compare`, `delta` holds each compared value with `before` and
  `after`. `worse` names every compared value that got worse. `notCompared`
  names every measurement whose status is not `ok` in the base summary or
  in the current summary.

A coverage report proves that a test runs a line, never that a test asserts
the result.

## What `--compare` checks

- `duplication.duplicatedLines` and `duplication.clones`: worse when they
  rise;
- `complexity.overLimit.ccn`, `complexity.overLimit.length`,
  `complexity.overLimit.params`, and `complexity.maxCcn`: worse when they
  rise;
- `tests.total`: worse when it falls, because a test is gone;
- `tests.failed` and `tests.skipped`: worse when they rise;
- `coverage.lines.uncovered` and `coverage.branches.uncovered`: worse when
  they rise.

`--compare` ignores the sum of `ccn`, because extracting a function raises
that sum by design. It ignores the coverage percentage, because removing
covered dead code lowers the percentage with no test lost.
