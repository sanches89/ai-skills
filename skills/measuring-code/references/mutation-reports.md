# Mutation reports

Sections: Command files; Tools; Thread options; Scope options; When to skip the
mutation run.

## Command files

Take the mutation command from the first of these command files that has one:

1. the CI workflow: a file under `.github/workflows/`, `.gitlab-ci.yml`,
   `.circleci/config.yml`, `bitbucket-pipelines.yml`, `azure-pipelines.yml`, or
   `Jenkinsfile`. Take the step that runs a tool of _Tools_ below;
2. a script of `package.json` that runs `stryker run`;
3. a named command of `Makefile`, `justfile`, or `Taskfile.yml` that runs a tool
   of _Tools_ below;
4. the README file, then the CONTRIBUTING file.

Else take the command of the first tool below whose configuration file the
repository has. Else record the reason `no mutation command`.

## Tools

Add the report options, the option of _Thread options_, and the option of _Scope
options_ to the mutation command, and nothing else.

- **StrykerJS**: `stryker.conf.*`, `stryker.config.*`, `.stryker.conf.*`, or
  `.stryker.config.*`. Command `npx stryker run`. Report option
  `--reporters json`. The report lands at the `jsonReporter.fileName` of the
  configuration, default `reports/mutation/mutation.json`. After the run, copy
  it to `<dir>/mutation.json`.
- **Stryker.NET**: `stryker-config.json`, `stryker-config.yml`, or
  `stryker-config.yaml`. Command `dotnet stryker`, run from the folder that
  holds the configuration file. Report options
  `--reporter json --output <dir>/stryker`. The report lands at
  `<dir>/stryker/reports/<name>.json`. `<name>` is the `report-file-name` of the
  configuration, default `mutation-report`.
- **PIT with Maven**: `pitest-maven` in `pom.xml`. Command
  `mvn test-compile org.pitest:pitest-maven:mutationCoverage`. Report option
  `-DoutputFormats=XML,HTML`. An `<outputFormats>` in `pom.xml` overrides the
  option: without `XML` in it, record the reason `PIT writes no XML report`.
- **PIT with Gradle**: the plugin `info.solidsoft.pitest` in `build.gradle` or
  `build.gradle.kts`. Command `./gradlew pitest`. It has no report option.
  Without `XML` in the `outputFormats` of its `pitest` block, record the reason
  `PIT writes no XML report`.
- **cargo-mutants**: `.cargo/mutants.toml`. Command `cargo mutants`. Report
  option `--output <dir>`. The report lands at
  `<dir>/mutants.out/outcomes.json`.
- **Infection**: `infection.json5`, `infection.json`, `infection.json5.dist`, or
  `infection.json.dist`. Command `vendor/bin/infection`. It has no report
  option: it writes a JSON log only at the `logs.json` path of the
  configuration. Without that key, record the reason
  `Infection writes no JSON log`. After the run, copy the log to
  `<dir>/infection.json`.
- **mutmut**: record the reason `mutmut writes no report with file and line`.

For any other tool, read its help for a report in the
mutation-testing-report-schema JSON format. Without one, record the reason
`<tool> writes no report the measure tool reads`.

PIT writes `mutations.xml` into `target/pit-reports/` of each Maven module, and
into `build/reports/pitest/` of each Gradle project. After the run, copy the
newest `mutations.xml` of each to `<dir>/pit-<n>.xml`, with `<n>` counting
from 1.

Record `<mutation-report>` as the path of each report relative to `<dir>`.

## Thread options

Add the option below when neither the command nor the configuration sets a
thread count. `<n>` is the output of `nproc`, or of `sysctl -n hw.ncpu` on
macOS.

- **PIT with Maven**: `-Dthreads=<n>`.
- **cargo-mutants**: `--jobs 2`.
- **StrykerJS, Stryker.NET, Infection, and PIT with Gradle**: no option.

## Scope options

Record the mutation command with the scope option below, `<files>` in place of
the code files, never a test file:

- **StrykerJS**: `--mutate <files>`, the files joined by commas.
- **Stryker.NET**: `--mutate <files>`, with `--mutate` once per file.
- **PIT with Maven**: `-DtargetClasses=<files>`, each file written as the fully
  qualified name of its class, joined by commas.
- **Infection**: `<files>` as arguments. Before version 0.34, `--filter=<files>`
  in place of the arguments, joined by commas. `vendor/bin/infection --version`
  prints the version.
- **cargo-mutants**: `--file <files>`, with `--file` once per file.

A tool without an option in this list, such as PIT with Gradle, has no scope
option. Record its command without `<files>`.

## When to skip the mutation run

Record the reason in place of the mutation command, and skip the run, when one
of these holds:

- the tool is missing: no `@stryker-mutator/core` in `package.json`, no
  `vendor/bin/infection` file, or `dotnet stryker --help` or
  `cargo mutants --help` fails. Maven and Gradle fetch PIT themselves. The
  reason is `<tool> is not installed`;
- the tool mutates the code files in place: StrykerJS with `inPlace` in its
  configuration, or cargo-mutants with `--in-place` in the command. The reason
  is `<tool> mutates the code in place`;
- the configuration uploads a report: a `dashboard` reporter in the Stryker.NET
  configuration, or `logs.stryker` in the Infection configuration. The StrykerJS
  report option replaces its configured reporters, so StrykerJS never uploads.
  The reason is `<tool> uploads its report`;
- the tool writes into the repository, and `git check-ignore -q <path>` fails
  for a path it writes. The paths are `.stryker-tmp` and the report folder for
  StrykerJS, the build folders for PIT, and the log path for Infection. The
  reason is `<path> is not ignored by git`.

Keep the mutation command, and skip the run, when the invocation names files and
the tool has no scope option. The reason is `<tool> cannot limit its files`.
