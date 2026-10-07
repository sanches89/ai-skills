---
name: analyzing-code
description: Measures the duplication, complexity, hotspots, tests, coverage, and mutation score of the whole working tree or one branch, and reports ranked findings, changing no code. Use when the user wants the codebase or a branch analyzed or ranked by hotspots, coverage, or mutation score, never for given paths, two versions, or a general code question.
license: MIT
compatibility: Requires the measuring-code skill. Needs git, run inside a git repository.
argument-hint: "[branch]"
---

# Analyzing code

Measure one version of a repository's code and return a measurement report with
ranked findings. Never compare two versions.

## Hard rules

1. **The project stays as it is.** Change no project file. Add no dependency,
   tool, configuration file, JUnit report, coverage report, or mutation report
   to the repository. Output that git ignores, such as a mutation tool's report
   folder, is no addition. Write every report, summary, and note of the run in
   the scratch directory.
2. **Never ask what research can answer.** Consult the code, the docs, the git
   history, and the summary first.
3. **Never assume.** When a decision changes the work and research cannot settle
   it, ask the user.
4. **No outward actions.** Never commit, push, open a pull request, or post a
   comment. The measurement report is the only output.

## Workflow

### Step 1: Load the request

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run each read
or command that yields only facts in a subagent. It returns the facts with path
and line.

Resolve the invocation text, or the request in the conversation, as one request
kind:

- **Nothing**: the run measures the working tree, uncommitted and untracked
  files included.
- **One name**: a branch, a tag, or a commit. Confirm it with
  `git rev-parse --verify --quiet "<name>^{commit}"`. When the command fails,
  ask one question: which name to use. The run measures the committed code at
  that commit, never the uncommitted files.
- **Anything else**: ask one question: which one name to measure, or none.

Record the output of `git status --porcelain` and of
`git rev-parse --short HEAD`. With a name, record the measured commit: the
output of `git rev-parse --short "<name>^{commit}"`.

Write private notes in a scratch directory outside the repository, written
`<scratch-dir>` in commands (in Claude Code, the scratchpad directory). Keep in
the notes every list a later step reads.

`<root>` is the folder of the measured code. Without a name, it is the output of
`git rev-parse --show-toplevel`. With a name, run
`git worktree add --detach <scratch-dir>/measured <name>` from the repository
root, and `<root>` is `<scratch-dir>/measured`. Never check out, stash, reset,
or switch the working tree.

Run every command of Step 3 from `<root>`.

### Step 2: Measure

Tell the user that the run can take hours: the mutation run runs the tests once
per mutant.

Invoke the `measuring-code` skill (in Claude Code, with the `Skill` tool) with
the text below, as one line. Without a name, write `install on failure` in place
of `install first`:

```
from analyzing-code: paths ., root <root>, out <scratch-dir>, mutation all,
install first, top 200
```

Keep the measurement record it returns. When its `summary` line reads `none` or
names a file other than `summary.json`, go to Step 4 with the result `blocked`.
Its reason is the one on the `summary` line, else
`the measure command failed to start`.

### Step 3: Read the code

Read `references/analysis-rules.md`. A number alone is never a finding: read the
code behind each entry that file names. Record per finding:

- the finding kind, and the location as `path:line` with the symbol;
- the evidence: the measured values, or what the code shows;
- the action, from the _Actions_ section of `analysis-rules.md`.

Group the entries by folder and run one subagent per folder. Give it the entries
of its folder, both locations of each clone, and the path of
`references/analysis-rules.md`.

Rank the findings as the _Ranking_ section of `analysis-rules.md` says.

### Step 4: Measurement report

Fill `references/measurement-report-template.md` in the scratch directory. Run
every check in `references/quality-checklist.md`, grep helper included, over the
measurement report. Fix every failure.

### Step 5: Deliver

With a name, run from the repository root
`git worktree remove --force <scratch-dir>/measured`, then `git worktree prune`.
Run both also when an earlier step fails. Confirm that `git worktree list` names
no folder under `<scratch-dir>`.

Send the measurement report as the final message, unchanged. Ask nothing and
offer nothing after it.
