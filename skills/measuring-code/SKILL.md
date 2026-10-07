---
name: measuring-code
description: Measures duplication, complexity, hotspots, tests, coverage, and mutation score of given paths with the project's own test and mutation commands, changing no project file, and returns the measurement record. Use when numbers for given paths are needed, such as a baseline before or after a change, never for a ranked report of a whole codebase.
license: MIT
compatibility: Requires the finding-dev-commands skill. Needs Node.js 22.13 or newer with npx and git, with network access on the first run. Complexity needs lizard on PATH, or uv, pipx, or a Python that has lizard. Tests and coverage need the project's own test command. Mutation needs the project's own mutation command. A missing tool skips its measurement.
argument-hint: "[path...] [mutation all | <files>]"
---

# Measuring code

Measure the duplication, complexity, hotspots, unit tests, coverage, and
mutation score of the code under given paths, and return the measurement record.

## Hard rules

1. **The project stays as it is.** Change no project file. Add no dependency,
   tool, configuration file, or report to the repository. Output that git
   ignores, such as a mutation tool's report folder, is no addition. Write every
   report, summary, and note under `<out>`.
2. **Never ask.** Settle every choice from the invocation text, the code, the
   docs, and the reference files.

## Invocation

When the invocation text starts with `from <skill name>:`, another skill invoked
this run. The text then takes this form:

```
from <caller>: paths <path>...[, root <folder>][, out <folder>]
[, ignore <globs>][, mutation all | <files> | no][, install first |
on failure | no][, top <n>]
```

- `paths`: the paths to measure, relative to `<root>`. Default `.`.
- `root`: the folder of the measured code. Default the repository root.
- `out`: the output folder. Default `<scratch-dir>/measure`.
- `ignore`: the ignore globs, joined by commas with no space. Default the globs
  that Step 2a finds.
- `mutation`: run the mutation command over `all` files, over `<files>`, or `no`
  run. Default `no`.
- `install`: run the install command `first`, `on failure` of the test command,
  or `no` run. Default `no`.
- `top`: the entries per list of the summary. Default 50.

Without that prefix, a user invoked this run. Take the options from the request,
with the defaults above.

The measurement record:

```
summary: <path of the measurement summary> | none: <reason>
measure command: <the measure command as run>
test command: <test command with the report options> | none: <reason>
mutation command: <the project's mutation command with the thread option,
  the scope option with <files> where it takes files, and each report
  option that names no path> | none: <reason>
reports: <paths of the test, coverage, and mutation reports> | none
limits: ccn <n>, length <n>, params <n>, clone <n> lines and <n> tokens,
  each default or with the config file that set it
ignore: <globs> | none
tree changes: none | <every git status line the run added>
duplication: ok | skipped: <reason> | failed: <reason>
complexity: <same>
hotspots: <same>
tests: <same>
coverage: <same>
mutation: <same>
```

## Workflow

### Step 1: Load the invocation

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in one
each read or command that yields only facts, returned with path and line.

`<scratch-dir>` is a scratch directory outside the repository (in Claude Code,
the scratchpad directory). Set:

- `<root>`: the `root` option, else the output of
  `git rev-parse --show-toplevel`;
- `<out>`: the `out` option, as an absolute path;
- `<dir>`: `<out>/reports`, the folder of every report. Create it.

Record the output of `git status --porcelain`, run in `<root>`. Run every
command of Steps 2 to 5 from `<root>`, unless a step says otherwise.

### Step 2: Inventory

**2a. Ignore globs.** Skip this part when the invocation gives `ignore`. Else
read `references/ignore-globs.md` and record `<globs>` by it.

**2b. Limits.** Read `references/measure-tool.md`. Record `<ccn>`, `<length>`,
`<params>`, `<min-lines>`, and `<min-tokens>`: the project's own limits when it
configures them, else 10, 50, 4, 5, and 50. Record the configuration file that
set each limit, or `default`.

**2c. Install and test commands.** Invoke the `finding-dev-commands` skill (in
Claude Code, with the `Skill` tool) with `from measuring-code: find in <root>`.
Take the `test` and `install` lines of the command map it returns. Read
`references/test-reports.md`. Record, as that file says:

- the install command, `none`, or `unknown`, from the `install` line;
- the test command with the report options, with `<dir>` in place of the output
  folder. With `test: none`, record the reason `no test command`;
- `<junit-report>` and `<coverage-report>`: the paths of the JUnit report and
  the coverage report relative to `<dir>`, or the reason a report is skipped.

Skip Step 3 with `test: none`, or when the runner writes neither report.

**2d. Mutation command.** Read `references/mutation-reports.md`. Record, as that
file says, the mutation command and `<mutation-report>`, with `<dir>` in place
of the output folder. Whatever the `mutation` option says, record the command
when the project configures a mutation tool. Run the checks of _When to skip the
mutation run_ on it too. When no check holds and the option is `mutation no`,
the `mutation` line reads `skipped: not requested`.

### Step 3: Tests

With `install first`, run the install command first, unless it is `none` or
`unknown`. With `install first` and the install command `unknown`, record the
tests and coverage as skipped with the reason `no install command`, and go to
Step 4.

Run the test command. With `install on failure`, when it fails to start on a
missing dependency, run the install command once and the test command again.
Skip that retry when the install command is `none` or `unknown`. Afterwards do
the step that `test-reports.md` gives for .NET, Maven, and Gradle. A failing
test is a result, not a failure of the run. When the install command fails, or
the test command writes neither report, record the tests and coverage as
skipped. The reason is the first line of the error.

### Step 4: Mutation

Skip this step with `mutation no` or when Step 2d recorded a reason. With
`mutation all`, run the mutation command without the scope option. With
`mutation <files>`, put the code files among `<files>` in place of `<files>`,
never a test file.

Run the mutation command from the folder that `mutation-reports.md` names, else
from `<root>`. Let it finish, however long it takes (in Claude Code, run it in
the background). Without the `from` prefix, tell the user when the run starts
that it can take hours. Afterwards do the step that `mutation-reports.md` gives
for the tool. A surviving mutant is a result, not a failure of the run. When the
mutation command fails, or writes no report, record the first line of the error
as the reason.

### Step 5: Measure

Run the measure tool:

```bash
<measure> <path>... --ignore "<globs>" --ccn <ccn> --length <length> \
  --params <params> --min-lines <min-lines> --min-tokens <min-tokens> \
  --top <n> \
  --test-report <dir>/<junit-report> \
  --coverage-report <dir>/<coverage-report> \
  --mutation-report <dir>/<mutation-report> \
  > <out>/summary.json
```

`<path>...` are the paths of the invocation, and `<n>` is its `top`. Leave out
`--ignore` with no glob, and each report option without its report. Pass
`--mutation-report` once per mutation report.

On exit code `2`, fix the arguments and run the command again. On `1`, record
the summary as `none` and every measurement as failed, with the first line of
the error as the reason. When the measure command fails to start, measure by
reading as _Without any tool_ in `measure-tool.md` states.

### Step 6: Return the measurement record

Run `git status --porcelain` in `<root>` again. Restore and delete nothing. Name
every line it adds to the output of Step 1 on the measurement record's
`tree changes` line.

Fill the measurement record:

- `summary`: `<out>/summary.json`, `<out>/summary.md` after _Without any tool_,
  or `none` with the reason of Step 5;
- the commands as run, with the real `<dir>`. The mutation command keeps
  `<files>`, and leaves out each option that names a path under `<dir>`;
- `reports`: the absolute path of every report under `<dir>`;
- one line per measurement: `ok`, or the status with the reason this run
  recorded, else the reason the summary gives.

Send the measurement record alone as the final message. Offer nothing after it.
