---
name: code-analysis
description: Use when the user wants the code measured or analyzed, asks how complex, duplicated, tested, or covered a repository is, or wants the current branch compared with a base branch before a review or a merge. Returns a measurement report with ranked findings and changes no code.
license: MIT
compatibility: Requires Node.js 20 or newer with npx and git, run inside a git repository, with network access on the first run. Complexity needs lizard on PATH, or uv, pipx, or a Python that has lizard. Tests and coverage need the project's own test command. A missing tool skips its measurement and never blocks the report.
argument-hint: "[base]"
---

# Code Analysis

Take one repository and measure its duplication, complexity, hotspots, unit
tests, and coverage. With a base name, measure the base commit too and
compare. Read the code behind every list entry that enters the measurement
report. Return a measurement report. Change no project file.

## Hard rules

1. **The project stays as it is.** Change no project file. Add no dependency,
   tool, configuration file, JUnit report, or coverage report to the
   repository. Write every JUnit report, coverage report, summary, diff,
   note, and measurement report in the scratch directory.
2. **The working tree stays checked out.** Measure the base commit in a
   worktree under the scratch directory. Never check out, stash, reset, or
   switch the working tree. Remove the worktree in Step 3d, even when a
   sub-step of Step 3 fails.
3. **Both runs measure the same way.** Give the base run and the current run
   the same:
   - paths;
   - ignore globs;
   - limits;
   - `--top`;
   - install command;
   - test command.
4. **The project's own commands run the tests.** Add only report options to
   the test command. Never add a reporter package or a coverage package.
   Never edit a test.
5. **A missing tool never blocks.** Skip the measurement of the missing
   tool. Name every skipped measurement in the measurement report with its
   reason.
6. **A number alone is never a finding.** Read the code behind every list
   entry before it enters the measurement report. Keep only what
   `references/analysis-rules.md` keeps.
7. **Never ask what research can answer.** Consult the code, the docs, the
   git history, and the summaries before the first question.
8. **Never assume.** When a decision changes the work and research cannot
   settle it, ask the user.
9. **One question at a time.** Write every question in chat in the *Question
   format* below. Then end the turn and wait for the answer. Never use an
   agent's built-in question or form tool (in Claude Code,
   `AskUserQuestion`). Write questions as plain chat text.
10. **No outward actions.** Never commit, push, open a pull request, or post
    a comment.
11. **The measurement report holds only what the user needs.** Write no
    narration, no failed attempts, no command output.

## Question format

Use this exact layout, and nothing else, for every question to the user in
every step. Ask one question per message. After printing it, end the turn and
wait.

```
❓ QUESTION
<question>

📚 CONTEXT
<what research found and what depends on the answer - max of 520 chars>

☑️ OPTIONS
<options, use an ordered list, numbers -> letters -> roman numerals>

👉 MY SUGGESTION
<suggestion - max of 180 chars>
```

- **QUESTION**: one decision, one sentence.
- **CONTEXT**: what the code, the git history, and the summaries show and
  what in the work depends on the answer. Maximum 520 characters.
- **OPTIONS**: an ordered list. Use numbers at the top level (`1.`, `2.`),
  letters at the next level (`a.`, `b.`), then roman numerals (`i.`, `ii.`).
  Make options concrete and grounded in research: name real files, symbols,
  branches, and commands. The user answers with a number or with free text.
- **MY SUGGESTION**: the option you recommend and why, in at most 180
  characters. Write `None` only when research gives no basis to prefer one.

## Script

`scripts/diff-summaries.mjs` reads two summaries of the measure tool. It
prints which clones, functions over a limit, hotspots, failed tests, and
coverage entries are new, gone, or changed. It also prints how each changed
file stands. Run it as `node <skill-dir>/scripts/diff-summaries.mjs`, where
`<skill-dir>` is the folder holding this `SKILL.md` (in Claude Code,
`${CLAUDE_SKILL_DIR}` expands to it). Run it with `--help` for the options
and the exit codes. Step 5 runs it once.

## Workflow

### Step 1: Load the request

Resolve the text passed with the skill invocation, or the request given in
the conversation, as exactly one kind:
- **Nothing**: no base name. The run analyzes the working tree alone.
- **One name**: the base name. It names a branch, a tag, or a commit.
  Confirm it with `git rev-parse --verify --quiet "<base name>^{commit}"`.
  When the command fails, ask one question in the question format: which
  base name to use.
- **Anything else**: ask one question in the question format: which one
  name is the base name, or none.

With a base name, record the base commit: the output of
`git merge-base <base name> HEAD`. When that command fails, the base name and
`HEAD` share no history. Then ask one question in the question format, with
two options: take the commit that the base name resolves to as the base
commit, or give another base name.

The current code is the working tree, with its uncommitted and untracked
files. Record the output of `git status --porcelain` and of
`git rev-parse --short HEAD`.

Write private notes in a scratch directory outside the repository from this
step on, written `<scratch-dir>` in commands (in Claude Code, the session's
scratchpad directory; in any other agent, the system temp directory). Keep in
the notes every list that a later step reads.

### Step 2: Inventory

Run every command of this skill from the repository root, the output of
`git rev-parse --show-toplevel`, unless a step says otherwise. Measure the
repository root in every run, with `.` as the path.

**2a. Ignore globs.** List the tracked files that are generated, vendored, or
built:

```bash
git ls-files | grep -iE \
  -e '(^|/)(generated|__generated__|vendor|vendored|third_party)/' \
  -e '\.(min\.js|min\.css|pb\.go|pb\.ts|g\.dart|generated\.[a-z]+)$'
```

Record one glob per folder or extension found, such as `**/generated/**` or
`**/*.pb.go`. Add one glob per folder that the project's lint or coverage
configuration lists as generated. Record the globs as `<globs>`, joined by
commas.

**2b. Limits.** Read `references/measure-tool.md` now. It holds the measure
command, its options and exit codes, where a project sets its limits, and
how to read a summary. Record `<ccn>`, `<length>`, and `<params>`: the
project's own limits when it configures them, else 10, 50, and 4.

**2c. Install and test commands.** Read `references/test-reports.md` now. It
says where to take the install command and the test command from. It gives
the options that make each test runner write a JUnit report and a coverage
report. Record:
- the install command, `none`, or `unknown`, as `test-reports.md` says;
- the test command with the report options, with `<dir>` in place of the
  output folder;
- `<junit-report>` and `<coverage-report>`: the path of the JUnit report and
  of the coverage report, relative to `<dir>`, when the runner writes them
  without a new package.

When the project has no test command, record the reason `no test command`.
When the runner writes the JUnit report or the coverage report only with a
package the project lacks, record the reason `<runner> needs <package>` for
that report. Skip 3b and 4a when the runner writes neither the JUnit report
nor the coverage report.

**2d. Changed files.** Skip this sub-step without a base name. Write the
changed files, one path per line:

```bash
{ git diff --name-status <base-commit> | grep -v '^D' \
    | awk -F'\t' '{ print $NF }'
  git ls-files --others --exclude-standard
} | sort -u > <scratch-dir>/changed.txt
```

The first command compares the base commit with the working tree, so an
uncommitted change counts. Record the count of deleted files from
`git diff --name-status <base-commit> | grep -c '^D'`.

### Step 3: Base run

Skip this step without a base name.

**3a. Worktree.** Run
`git worktree add --detach <scratch-dir>/base <base-commit>`. Run 3b and 3c
from `<scratch-dir>/base`.

**3b. Tests.** With the install command `unknown`, record the base tests and
coverage as skipped, with the reason `no install command`. Then go to 3c.
Otherwise run the install command, unless it is `none`. Then run the test
command with `<dir>` set to `<scratch-dir>/base-reports`. After the test
run, do the step that `test-reports.md` gives for .NET, Maven, and Gradle. A
failing test is a result, not a failure of the run. Record the base tests
and coverage as skipped in two cases: the install command fails, or the test
command writes neither the JUnit report nor the coverage report. The reason
is the first line of the error. Then continue.

**3c. Measure.** Run the measure tool:

```bash
<measure> . --ignore "<globs>" --ccn <ccn> --length <length> \
  --params <params> --top 200 \
  --test-report <scratch-dir>/base-reports/<junit-report> \
  --coverage-report <scratch-dir>/base-reports/<coverage-report> \
  > <scratch-dir>/base.json
```

Leave out `--ignore` with no glob. Leave out `--test-report` without a JUnit
report. Leave out `--coverage-report` without a coverage report.

**3d. Remove.** From the repository root, run
`git worktree remove --force <scratch-dir>/base`. Then run
`git worktree prune`. Run 3d also when 3a, 3b, or 3c fails.

### Step 4: Current run

**4a. Tests.** Run the test command from the repository root, with `<dir>`
set to `<scratch-dir>/current-reports`. When the test command fails to start
because a dependency is missing, run the install command once. Then run the
test command again. Skip both when the install command is `none` or
`unknown`. After the test run, do the step that `test-reports.md` gives for
.NET, Maven, and Gradle. When the test command writes neither the JUnit
report nor the coverage report, record the current tests and coverage as
skipped. The reason is the first line of the error.

**4b. Measure.** Without a base name, run the command of 3c with
`current-reports` in place of `base-reports` and `current.json` in place of
`base.json`. With a base name, run:

```bash
<measure> . --top 200 \
  --test-report <scratch-dir>/current-reports/<junit-report> \
  --coverage-report <scratch-dir>/current-reports/<coverage-report> \
  --compare <scratch-dir>/base.json > <scratch-dir>/current.json
```

Record the exit code. Exit codes `0` and `3` print a summary. On exit code
`2`, fix the arguments. Then run the command again. On exit code `1`, or
when the measure command fails to start, go to Step 7. The result is then
`blocked`, with the first line of the error as the reason.

### Step 5: Compare

Skip this step without a base name. Run:

```bash
node <skill-dir>/scripts/diff-summaries.mjs \
  <scratch-dir>/base.json <scratch-dir>/current.json \
  --changed <scratch-dir>/changed.txt > <scratch-dir>/diff.json
```

The output holds the compared values under `worse`, `better`, and
`unchanged`. It lists the entries that are new, gone, or changed in each
list. Under `changedFiles`, it gives the coverage, the functions over a
limit, and the clones of every changed file. `cut` names every list that
reached 200 entries. The diff of a cut list is partial. Name every cut list
under *Skipped* in the measurement report.

### Step 6: Read the code

Read `references/analysis-rules.md` now. It says which entries to read, how
to classify each one, what becomes a finding with which action, and how to
rank the findings.

Open the code behind each list entry that `analysis-rules.md` names, both
locations of a clone included. Record per finding:
- the kind, and the location as `path:line` with the symbol;
- the evidence: the measured values, or what the code shows;
- the action, from the *Actions* section of `analysis-rules.md`;
- with a base name, whether the location is in a changed file, and whether
  `diff.json` lists the entry under `added`.

Rank the findings as the *Ranking* section of `analysis-rules.md` says.

### Step 7: Measurement report

Fill `references/measurement-report-template.md`. Read that file now: it
holds the format and the rules for what each section keeps and leaves out.
Write the measurement report in the scratch directory. Run every check in
`references/quality-checklist.md` over the measurement report, including the
grep helper. Fix every failure.

Send the measurement report as the final message, unchanged. Ask nothing and
offer nothing after it.
