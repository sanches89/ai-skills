# The measure tool

Sections: Command; Options this skill uses; Exit codes; Limits; Reading a
summary; Without any tool.

## Command

The measure tool is the npm package `code-measure`. The measure command
`<measure>` is the first form whose condition holds:

- `code-measure`, when `PATH` has it, `code-measure --version` prints a version
  that starts with `1.`, and `code-measure --help` names `--mutation-report`;
- otherwise `npx --yes code-measure@1`.

It prints one summary with `"version": 1` on stdout, with six measurements:

- `duplication`, from jscpd, which ships with the measure tool;
- `complexity`, from lizard;
- `hotspots`, from the git history. The score of a file is its commit count
  since `--since`, default 12 months ago, times its complexity: the sum of the
  `ccn` of its functions, or its line count without lizard;
- `tests`, from the JUnit XML reports of `--test-report`;
- `coverage`, from the LCOV, Cobertura XML, JaCoCo XML, or Go cover profile
  reports of `--coverage-report`;
- `mutation`, from the mutation-testing-report-schema JSON of Stryker, the
  `mutations.xml` of PIT, the `outcomes.json` of cargo-mutants, or the JSON log
  of Infection, of `--mutation-report`.

The measure tool never runs the tests or the mutation tool: it reads the reports
the project's own commands wrote. A measurement whose tool or report is missing
gets the status `skipped` and never fails the run.

## Options this skill uses

- `--ignore "<glob>,<glob>"`: the ignore globs of Step 2a. A glob supports `**`,
  `*`, and `?`.
- `--ccn <n>`, `--length <n>`, `--params <n>`: the limits of Step 2b.
- `--min-lines <n>`, `--min-tokens <n>`: the smallest clone of Step 2b. A clone
  is listed only when it reaches both values.
- `--top <n>`: the entries per list. A list with `<n>` entries is cut.
- `--test-report <path>`: a JUnit XML file, or a folder whose `*.xml` files are
  all JUnit reports. Pass it once per report or folder.
- `--coverage-report <file>`, `--mutation-report <file>`: one report, its format
  read from the content. Pass each once per report.

`<measure> --help` lists the other options.

## Exit codes

- `0`: a summary is printed, even with a skipped or failed measurement.
- `1`: unexpected failure.
- `2`: invalid arguments: an unknown option, or a path or a report that does not
  exist.

## Limits

Defaults, for a limit the project does not configure:

- cyclomatic complexity per function, `--ccn`: 10;
- function length in lines, `--length`: 50;
- parameters per function, `--params`: 4;
- smallest clone, `--min-lines` and `--min-tokens`: 5 lines and 50 tokens;
- nesting depth, checked by reading: a finding at 3 levels or deeper.

Read the project's own limits from these tool settings:

- ESLint: `complexity` for `--ccn`, `max-lines-per-function` for `--length`,
  `max-params` for `--params`, in `eslint.config.*` or `.eslintrc*`;
- ruff and flake8: `max-complexity` for `--ccn`, in `pyproject.toml`,
  `ruff.toml`, `setup.cfg`, or `.flake8`;
- pylint: `max-args` for `--params`, in `pyproject.toml` or `.pylintrc`;
- RuboCop: `Metrics/CyclomaticComplexity` for `--ccn`, `Metrics/MethodLength`
  for `--length`, `Metrics/ParameterLists` for `--params`, in `.rubocop.yml`;
- golangci-lint: `gocyclo.min-complexity` for `--ccn` and `dupl.threshold` for
  `--min-tokens`, in `.golangci.yml`;
- PHPMD: the `reportLevel` of `CyclomaticComplexity` for `--ccn`, in the PHPMD
  ruleset XML file;
- Checkstyle: the `max` of `CyclomaticComplexity` for `--ccn`, of `MethodLength`
  for `--length`, and of `ParameterNumber` for `--params`, in the Checkstyle XML
  configuration;
- PMD: the `methodReportLevel` of `CyclomaticComplexity` for `--ccn`, in the PMD
  ruleset XML file;
- jscpd: `minLines` for `--min-lines` and `minTokens` for `--min-tokens`, in
  `.jscpd.json`;
- PMD CPD: the `minimumTokens` of `maven-pmd-plugin` for `--min-tokens`, in
  `pom.xml`;
- SonarQube: `sonar.cpd.<language>.minimumTokens` for `--min-tokens` and
  `sonar.cpd.<language>.minimumLines` for `--min-lines`, in
  `sonar-project.properties`. SonarQube fixes the Java rule at 10 statements,
  which sets no limit here.

A cognitive complexity limit, such as Clippy's `cognitive_complexity` or
SonarQube's, is not a cyclomatic limit. Never use it for `--ccn`. With two
values for one limit in one repository, take the lower one.

## Reading a summary

- Every measurement: a `status` of `ok`, `skipped`, or `failed`, with a `reason`
  for each status but `ok`. `duplication` and `complexity` hold `tool`, the name
  and version of their tool, when it ran.
- `settings`: the limits, the ignore globs, `top`, and `since` of the run.
  `files`: the files under the paths after the ignore globs.
- `duplication`: `files`, `lines`, `duplicatedLines`, `percentage`, and
  `clones`. `top`: the largest clones first, each with `lines`, `tokens`,
  `format`, and the two locations `a` and `b` as `path:start-end`.
- `complexity`: `functions`, `maxCcn`, and `overLimit` with one count per limit.
  `top`: the functions over a limit, highest `ccn` first, each with `function`,
  `file`, `line`, `ccn`, `length`, and `params`.
- `hotspots`: `since`, and `complexityMeasure`, which is `ccn`, or `lines`
  without lizard. `top`: files by `score`, each with `commits` and `complexity`.
- `tests`: `total`, `passed`, `failed`, `skipped`, `seconds`, the failed tests
  in `failedTests`, and five tests with their `seconds` in `slowest`.
- `coverage`: `format`, `files`, and `lines` and `branches`, each with `total`,
  `covered`, `uncovered`, and `percentage`. `branches` is `null` without branch
  data. `filesNotInReport`: the code files under the paths that the coverage
  report lacks, every function in them uncovered. `top`: the files with
  uncovered lines, most first, each with `lines` and `branches` percentages,
  `uncoveredLines`, and `uncoveredBranches`.
- `coverage.functions`, with lizard only: the counts `covered`, `partly`, and
  `none`. `top`: every function with an uncovered line or branch, highest `crap`
  first, each with `ccn` and the `lines` and `branches` percentages. `crap` is
  the CRAP score `ccn^2 * (1 - coverage)^3 + ccn`.
- `mutation`: `format`, `files`, `mutants`, `killed`, `timeout`, `survived`,
  `noCoverage`, `invalid`, `ignored`, and `score`, which is `killed` plus
  `timeout` as a percentage of `mutants`. `top`: the files with a mutant that
  survived or has no coverage, most survived first. `survivors`: each surviving
  mutant with `file`, `line`, `function`, `mutator`, and `change`. `function` is
  `null` when neither lizard nor the report names one.

## Without any tool

Measure by reading:

- count lines, parameters, and nesting of every function under the paths against
  the limits of Step 2b;
- search for a clone with the agent's code search, using one distinctive line of
  each long function;
- take the change count of a file from
  `git log --since="12 months ago" --oneline -- <file> | wc -l`;
- take the test counts from the output of the test command, and the coverage
  from the summary that the coverage command prints.

Write the values to `<out>/summary.md`, one heading per measurement. Write
`skipped` with its reason for a measurement that reading cannot give.
