# Measurement tools

Read this file in Step 3d. It holds the tool rules, the measure tool, the two
reports the measure tool reads, and the limits. It also names the tools that
run only when the project configures them.

## Tool rules

- Run the project's own analysis tools first, with the project's own
  configuration. Their limits replace the defaults below.
- Run every other tool without installing it into the project. `npx`, `uvx`,
  and `pipx run` fetch a tool into their own cache.
- Never add a tool to the project's manifest. Never write a tool's
  configuration file or report file inside the repository.
- Skip a measurement whose tool or runtime is missing. Read the code against
  the limits instead. Name the skipped measurement in the task's Context
  section.
- Write the measure command with its paths and options into the task's
  Context and Verification sections, so that the implementer measures the
  same way. A number from different options proves nothing.

## The measure tool

The measure tool is `code-measure`, from the repository
`github.com/sanches89/code-measure`. It needs Node.js 20 or newer. The measure
command `<measure>` is one of two forms:
- `code-measure`, when `PATH` has it;
- otherwise `npx --yes "github:sanches89/code-measure#semver:^1"`. `npx`
  fetches the newest release of major version 1 into its own cache. The first
  run needs network access and read access to that repository.

Never install the measure tool into the project. This skill reads a
measurement summary with `"version": 1`. When the measure command fails to
start, follow *Without any tool* below.

Run the measure tool from the project root. It changes no project file. It
prints one measurement summary on stdout, with five measurements:
- `duplication`, from jscpd, which ships with the measure tool. jscpd reads
  more than 200 languages;
- `complexity`, from lizard. lizard reads about 25 languages. The measure tool
  runs `lizard` from `PATH`, else `uvx lizard`, else `pipx run lizard`, else
  `python3 -m lizard`;
- `hotspots`, from the git history. The score of a file is its commit count
  since `--since` multiplied by its complexity;
- `tests`, from the test reports passed with `--test-report`: the unit test
  results;
- `coverage`, from the coverage reports passed with `--coverage-report`: line
  coverage and branch coverage of the files under the paths.

The measure tool never runs the tests. It reads the reports that the
project's own test command wrote. Pass each option once per report.
`--test-report` also takes a folder of JUnit XML files.

The measure tool respects `.gitignore`. It leaves data and prose formats,
such as JSON, YAML, and Markdown, out of duplication, hotspots, and coverage.

Record the baseline:

```bash
<measure> <path>... \
  --ignore "<glob>,<glob>" \
  --test-report <scratch-dir>/junit.xml \
  --coverage-report <scratch-dir>/coverage.info \
  > <scratch-dir>/baseline.json
```

Exit codes: `0` summary printed, `1` unexpected failure, `2` invalid
arguments, `3` the comparison found a worse measurement. The review runs no
comparison. The task's success criteria state the baseline values that the
implementer's run keeps or improves.

## The test report and the coverage report

A test report is a JUnit XML file. A coverage report is a file in LCOV,
Cobertura XML, JaCoCo XML, or Go cover profile format. Nearly every test
runner writes one of each.

- Make the project's own test command write both reports. Add only options.
  Never add a reporter package, a coverage package, or a configuration file.
- Write both reports into the scratch directory. Read a report inside the
  repository only where the build already writes it, in a folder that
  `.gitignore` covers.
- Skip a report that needs a package the project lacks. Then count the tests
  from the output of the test command by hand.
- Turn branch coverage on when the tool has an option for it. A Go cover
  profile holds no branch data. Then `coverage.branches` is `null`.
- Keep the project's own coverage threshold in force. It is part of the test
  command.

Options per test runner. `<dir>` is the scratch directory:

```bash
# Node.js test runner
node --test --experimental-test-coverage \
  --test-reporter=junit --test-reporter-destination=<dir>/junit.xml \
  --test-reporter=lcov --test-reporter-destination=<dir>/lcov.info

# Vitest. Coverage only with @vitest/coverage-v8 or -istanbul installed.
vitest run --reporter=junit --outputFile=<dir>/junit.xml \
  --coverage --coverage.reporter=lcov --coverage.reportsDirectory=<dir>

# Jest. JUnit only with jest-junit installed.
jest --coverage --coverageReporters=lcov --coverageDirectory=<dir>

# pytest. Coverage only with pytest-cov installed.
pytest --junitxml=<dir>/junit.xml \
  --cov --cov-branch --cov-report=xml:<dir>/cobertura.xml

# Go. No JUnit report without another tool.
go test ./... -coverprofile=<dir>/cover.out

# Rust, with cargo-llvm-cov installed
cargo llvm-cov --lcov --output-path <dir>/lcov.info

# PHPUnit
phpunit --log-junit <dir>/junit.xml --coverage-cobertura <dir>/cobertura.xml

# .NET, with the coverlet collector of the default test template
dotnet test --collect:"XPlat Code Coverage" --results-directory <dir>

# Maven and Gradle write into build output, with the JaCoCo plugin configured:
#   target/surefire-reports/          build/test-results/test/
#   target/site/jacoco/jacoco.xml
#   build/reports/jacoco/test/jacocoTestReport.xml
```

For any other test runner, read its help for a JUnit option and for an LCOV
or Cobertura option.

## Reading a measurement summary

- Every measurement has a `status`: `ok`, `skipped`, or `failed`. A `reason`
  follows every status other than `ok`.
- `duplication.top` lists the largest clones as two locations,
  `path:start-end`. Read both locations before recording a finding. A clone of
  imports, of generated code, or of test data is no finding.
- `complexity.top` lists the functions over a limit, highest `ccn` first.
  `overLimit` counts the functions over each limit.
- `hotspots.top` ranks files by score. `complexityMeasure` says what the score
  used: `ccn` from lizard, or `lines` when lizard did not run.
- `tests` holds the counts `total`, `passed`, `failed`, and `skipped`, the
  names of the failed tests, and the slowest tests. A test that fails in the
  first summary is a baseline failure.
- `coverage.lines` and `coverage.branches` hold `total`, `covered`,
  `uncovered`, and `percentage` for the files under the paths.
  `coverage.top` lists the files with the most uncovered lines.
- `coverage.filesNotInReport` lists code files that the report lacks. No test
  loaded them. Every function in them counts as uncovered.
- `coverage.functions` needs lizard. It counts the functions that are
  `covered`, `partly` covered, and have `none`. Its `top` list holds every
  function with an uncovered line or branch, highest `crap` first.
- `crap` is the CRAP score: `ccn^2 * (1 - coverage)^3 + ccn`. A complex
  function without tests scores highest. It is the riskiest code to refactor
  and the first to get characterization tests.

The task's success criteria hold these values against the baseline:
- duplicated lines and clone count, with the value the subtasks reach;
- the number of functions over each limit, and the highest `ccn`, with the
  value the subtasks reach;
- `tests.total`, which is worse when it falls, because a test is gone;
- `tests.failed` and `tests.skipped`, which are worse when they rise;
- uncovered lines and uncovered branches, which are worse when they rise.

Leave out the sum of `ccn`, because Extract Function raises that sum by
design. Leave out the coverage percentage, because removing covered dead code
lowers it with no test lost.

A coverage report proves that a test runs a line. It never proves that a test
asserts the result. Before marking an entry `covered`, read the tests that run
its code. Confirm that they assert what the code returns, changes, or raises.

## Limits

Use these defaults only when the project configures no limit of its own:
- cyclomatic complexity per function, `--ccn`: 10;
- function length in lines, `--length`: 50;
- parameters per function, `--params`: 4;
- nesting depth, checked by reading: 3 levels;
- smallest clone, `--min-tokens` and `--min-lines`: 50 tokens and 5 lines.

A project configures a limit in its linter or its analysis tool. Examples:
- the `complexity` and `max-params` rules of ESLint;
- `cognitive_complexity` of Clippy;
- the `Metrics` cops of RuboCop;
- `gocyclo` and `dupl` of golangci-lint;
- the design rules of PMD, and a SonarQube quality profile.

A value over a limit is a reason to read the code. It becomes a finding only
when `smell-catalog.md` has no *Leave it when* case for it.

## Tools that run only when the project configures them

Run each of these only through the command the project already has. Never
introduce one.
- **Coverage**, such as `c8`, `coverage.py`, `tarpaulin`, or JaCoCo. Coverage
  built into the toolchain, as in Go and the Node.js test runner, needs no
  configuration. Use it in Step 4 to write the coverage report.
- **Mutation testing**, such as Stryker, mutmut, PIT, or cargo-mutants. Name
  it in the Context of a `high` risk subtask as the proof that its tests are
  able to fail. Without it, the subtask states that the implementer breaks
  the asserted behavior by hand once, as `characterization-tests.md` states.
- **Dead-code detection**, such as knip, vulture, `deadcode`, or the unused
  warnings of the compiler. Treat each hit as a signal. Prove it by the search
  that `refactoring-rules.md` requires.
- **Duplication detection** other than jscpd, such as PMD CPD or SonarQube.
  Use its findings beside the measure tool.

## Structural rewrite tools

For a mechanical edit across many files, name in the subtask's Context the
first of these that the project has:
1. the agent's language-server rename or move, when the agent has one;
2. the project's own codemod tool, when it configures one;
3. ast-grep, run as `npx --yes --package @ast-grep/cli ast-grep`. It matches
   code by syntax tree in about 25 languages. Run it first without the
   rewrite and read every match;
4. hand edits, one file at a time, with a text search for the old form
   afterwards.

State in the subtask that the implementer reviews the full diff after every
tool run. A tool changes strings, comments, or look-alike symbols that the
refactoring never meant.

## Without any tool

When the measure command fails to start, measure by reading:
- count lines, parameters, and nesting of every function in the refactor
  scope against the limits;
- search for a clone with the agent's code search, using one distinctive
  line of each long function;
- take the change count of a file from
  `git log --since="12 months ago" --oneline -- <file> | wc -l`;
- take the test counts from the output of the test command, and the coverage
  from the summary that the coverage command prints.
Write `skipped` with the reason on the baseline lines of the task's Context
section.
