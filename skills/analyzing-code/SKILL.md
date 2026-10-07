---
name: analyzing-code
description: Measures the duplication, complexity, hotspots, tests, coverage, and mutation score of the whole working tree or one branch, and reports ranked findings, changing no code. Use when the user wants the codebase or a branch analyzed or ranked by hotspots, coverage, or mutation score, never for given paths, two versions, or a general code question.
license: MIT
compatibility: Requires the measuring-code skill. Needs git, run inside a git repository.
argument-hint: "[branch]"
---

# Analyzing code

Take one version of a repository's code and measure its duplication,
complexity, hotspots, unit tests, coverage, and mutation score. Return a
measurement report. The skill never compares two versions: every number
describes the one version it measures.

A run can take hours. The mutation run runs the tests once per mutant, so
its time grows with the number of tests and mutants. Tell the user so when
the run starts.

## Hard rules

1. **The project stays as it is.** Change no project file. Add no
   dependency, tool, configuration file, JUnit report, coverage report, or
   mutation report to the repository. Write every report, summary, and
   note of the run in the scratch directory. A measurement of a changed
   tree describes no version the project has.
2. **Never ask what research can answer.** Consult the code, the docs, the
   git history, and the summary first. A question the summary answers
   costs the user time on top of a run of hours.
3. **Never assume.** When a decision changes the work and research cannot
   settle it, ask the user. An assumed name or command measures the wrong
   code.
4. **No outward actions.** Never commit, push, open a pull request, or post
   a comment. The measurement report is the only output.

## Workflow

### Step 1: Load the request

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Resolve the invocation text, or the request in the conversation, as one
kind:
- **Nothing**: the run measures the working tree, uncommitted and
  untracked files included.
- **One name**: a branch, a tag, or a commit. Confirm it with
  `git rev-parse --verify --quiet "<name>^{commit}"`. When the command
  fails, ask one question: which name to use. The run measures the
  committed code at that commit, never the uncommitted files.
- **Anything else**: ask one question: which one name to measure, or none.

Record the output of `git status --porcelain` and of
`git rev-parse --short HEAD`. With a name, record the measured commit: the
output of `git rev-parse --short "<name>^{commit}"`.

Write private notes in a scratch directory outside the repository, written
`<scratch-dir>` in commands (in Claude Code, the scratchpad directory). Keep
in the notes every list a later step reads.

`<root>` is the folder of the measured code. Without a name, it is the
output of `git rev-parse --show-toplevel`. With a name, run
`git worktree add --detach <scratch-dir>/measured <name>` from the repository
root, and `<root>` is `<scratch-dir>/measured`. Never check out, stash,
reset, or switch the working tree.

Run every command of Step 3 from `<root>`.

### Step 2: Measure

Invoke the `measuring-code` skill (in Claude Code, with the `Skill` tool)
with the invocation text below. Without a name, write `install on failure`
in place of `install first`:

```
from analyzing-code: paths ., root <root>, out <scratch-dir>, mutation all,
install first, top 200
```

Keep the measurement record it returns. When its `summary` line reads
`none`, or names a file other than `summary.json`, go to Step 4. The result
is then `blocked`. The reason is the reason on the `summary` line, else
`the measure command failed to start`.

### Step 3: Read the code

Read `references/analysis-rules.md` now. A number alone is never a finding:
read the code behind each entry that file names, both locations of a clone
included. Record per finding:
- the kind, and the location as `path:line` with the symbol;
- the evidence: the measured values, or what the code shows;
- the action, from the *Actions* section of `analysis-rules.md`.

Group the entries by folder and run one subagent per folder. Give it the
entries of its folder, both locations of each clone, and the path of
`references/analysis-rules.md`.

Rank the findings as the *Ranking* section of `analysis-rules.md` says.

### Step 4: Measurement report

Read `references/measurement-report-template.md` now and fill it in the
scratch directory. Run every check in `references/quality-checklist.md`,
grep helper included, over the measurement report. Fix every failure.

### Step 5: Deliver

With a name, run from the repository root
`git worktree remove --force <scratch-dir>/measured`, then
`git worktree prune`. Run both also when an earlier step fails. Confirm
that `git worktree list` names no folder under `<scratch-dir>`.

Send the measurement report as the final message, unchanged. Ask nothing and
offer nothing after it.
