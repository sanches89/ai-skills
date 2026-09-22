---
name: task-orchestration
description: Use when the user wants a whole task implemented, run, executed, or orchestrated end to end, subtasks included, given as an item identifier or a task file, including a refactor task written by a code review. Produces one commit per subtask on a branch and one report over the whole run, kept with the task in the tracker or in its task folder. Not for writing a task, splitting one, or implementing one subtask alone.
license: MIT
argument-hint: <task id | task file>
---

# Task Orchestration

Take one task and run every subtask through the `task-work` skill, one at a
time, each in its own subagent and each with one commit. Relay every
question to the user and carry every fact from one subtask to the next.
Prove the task and keep the plan and every report with the task.

## Terms

These words have exactly one meaning in this skill.

- **Job**: one task or subtask together with the `task-work` run that
  implements it.
- **Record**: where this run keeps its plan, every work report, and the
  orchestration report.

## Hard rules

1. **Every change comes from a job.** Never edit project code yourself, and
   never edit a task file, a subtask file, or the body of an item. Put a
   wrong or stale fact found in one in the orchestration report.
2. **One job at a time.** Never run two jobs at once: they share one working
   tree.
3. **The user answers.** Ask the user every question a job returns,
   unchanged. Never answer one yourself.
4. **Keep only the result.** Keep from each job its work report or its
   question, and nothing else.
5. **No outward actions beyond the record and the commits.** Never push or
   open a pull request. Change an item's status or comment on an item only
   as the record rules of Step 1 state. Do more only when the request that
   invoked this skill says so.

## Workflow

### Step 1: Load the target

The target is the task this skill runs. Resolve the invocation text, or the
task given in the conversation, as one source:
- **An item identifier or URL** (`PAY-212`, `#128`, an issue link) in the
  tracker, an issue tracker reached through MCP. Source: *tracker*. Fetch
  the item and its children. To find the tracker, list the MCP tools of
  the agent (in Claude Code, deferred: search with `ToolSearch` for
  `issue ticket project linear jira notion asana github`). With no tracker
  connected, ask one question: give the target as a task file path.
- **A task file**, `docs/tasks/###-<task-slug>/task.md`. Source: *file*.
  Read it and every subtask file,
  `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`, in its task folder.
- **A subtask file**. Source: *file*. Read it and the task file in its
  task folder.
- **Free text**, or the path of any other file: ask one question: give the
  target as a task file path or an item identifier. The `task-create`
  skill writes a task from text.
- **Nothing**: ask for the target first.

The target has subtasks when its task folder holds subtask files, its item
has children, or its Subtasks section holds entries other than `None.`.

**Record.** The record is the first of these that applies:
- source *tracker*, when the tracker's tools can add a comment to an item:
  the items. The plan, every fact, every answer, and the orchestration
  report are comments on the target's item. Each work report is a comment
  on its job's item. A job's state is its item's status: in progress when
  the job starts, completed on `done`, unchanged on `skipped` and
  `blocked`. The target's item is completed when the result is `done`;
- source *file*: `docs/tasks/###-<task-slug>/orchestration.md` (new) in
  the tree the jobs run in. It holds the plan, then each work report under
  `## Report: <job>`, then the orchestration report. A job's state is its
  line in the plan;
- else `<scratch-dir>/orchestration.md`, with the same content.

A scratch directory outside the repository (in Claude Code, the scratchpad
directory) is written `<scratch-dir>` in commands. When the record holds a
plan from an earlier run, copy its facts and answers into the new plan.

### Step 2: Plan the jobs

**Jobs.** With subtasks, one job per subtask, in the order of the target's
Subtasks section. Without one, order the subtasks so that each comes
after every subtask on its `Depends on` line, ties by number or
identifier, lowest first. Without subtasks, one job: the target itself.

**Tree.** In a git repository, the jobs run in a worktree when one of these
holds:
- the request asks for a worktree;
- `git status --porcelain` prints anything;
- the current branch is the default branch: the one
  `git symbolic-ref --short refs/remotes/origin/HEAD` prints, else `main`
  when it exists, else `master`.

In every other case the jobs run in the current working tree on the
current branch. Outside a git repository, they run in the current working
tree without commits.

**Branch.** The worktree gets a new branch from `HEAD`. Name it by the
project's branch convention when the docs state one, else
`task/<task folder name>` for source *file* and `task/<identifier>` in
lowercase for source *tracker*.

Draft the plan:

```
# Plan: <target title>
target: <path | identifier and URL>
tree: current | <scratch-dir>/worktree, because <reason>
branch: <name> | none: no git repository
base: <commit, filled in Step 3>
baseline: <command>: pass | fail (<failing checks>), filled in Step 3
jobs:
1. <subtask number or identifier> <title>: pending
2. <...>
facts:
answers:
```

Show the jobs, the tree with its reason, and the branch in chat. Ask
whether the user approves the plan as shown or wants a change. Apply each
change to the plan and ask again until the user approves.

### Step 3: Prepare the tree

1. **Worktree.** When the plan names one, run
   `git worktree add -b <branch> <scratch-dir>/worktree HEAD`. When the
   branch already exists, ask one question: continue on that branch with
   `git worktree add <scratch-dir>/worktree <branch>`, or delete it with
   `git branch -D <branch>` and create it again from `HEAD`. From here on,
   run every command in the tree the plan names, written `<tree>`.
2. **Commands.** Take the build, lint, type-check, and test commands from
   the target's Context section. For a subtask target, take them from its
   task's Context section. Take a command the tasks do not give from the
   project's manifest, Makefile, CI configuration, or docs.
3. **Baseline.** Fill `base` with `git rev-parse --short HEAD` in `<tree>`.
   Fill `baseline` with the result of each command from number 2, pass or
   fail, with the name of every failing check.
4. **Record the plan.** Write the plan to the record.

### Step 4: Run the jobs

Run the jobs in plan order, one at a time. For each job:

1. **Skip a done job.** The job's target is done when, for source
   *tracker*, its item is in a completed status; for source *file*, the
   command or steps in its Verification section pass in `<tree>` and every
   file its Changes section marks `(new)` exists. Mark the job `skipped`
   in the record and continue with the next job.
2. **Start.** Mark the job `running` in the record. Note the output of
   `git status --porcelain` in `<tree>` as the job's start.
3. **Write the prompt.** Read `references/job-prompt-template.md` now and
   fill it: the job's target, `<tree>`, the branch, every fact in the
   record, and every answer in the record.
4. **Run the job.** When the agent offers subagents, run the job in a new
   subagent (in Claude Code, the `Agent` tool). Give it the prompt and
   nothing else. Without subagents, follow the prompt yourself with the
   `task-work` skill and continue here with its result.
5. **Read the result.** The result is one of:
   - **A work report**, which starts with `# Work report:`. Save it in the
     record.
   - **An empty result or an error** from the agent. Run the job once more
     with the same prompt. On a second one, mark the job `blocked` in the
     record with the cause and go to Step 6 with the result `blocked`.
   - **A question**: anything else. Ask the user that question, unchanged,
     with its options. Add the answer to the record. In a git repository,
     restore `<tree>` to the job's start: for every path that
     `git status --porcelain` lists now and the job's start does not, run
     `git checkout -- <path>` when git tracks it, else delete it. Then run
     the job again from number 3.
6. **On `done`.** When `git status --porcelain` in `<tree>` lists a path
   that the job's start does not, commit it as the job's commit. Use the
   project's commit convention, with the job's title as the subject. Add
   every bullet under *Deviations* and *Affects other work* of the report
   to the record as a fact, prefixed with the job's number. Mark the job
   `done` in the record with the hashes on the report's *Commits* line and
   `git rev-parse --short HEAD`. Continue with the next job.
7. **On `blocked`.** Mark the job `blocked` in the record and go to Step 6
   with the result `blocked`. Run no further job.

### Step 5: Prove the target

Run in `<tree>`, in this order:
1. the command or steps in the target's Verification section;
2. every command from Step 3.

The proof passes when the Verification passes and no command fails beyond
the failures the baseline records. On a failure, the result is `blocked`:
name the command and its failing check under *Blocked by* in the report.

### Step 6: Finish

1. **Report.** Read `references/orchestration-report-template.md` now and
   fill it. Run every check in `references/quality-checklist.md`, grep
   helper included, and fix every failure. Save the orchestration report
   in the record, and on `done` mark the target's item completed.
2. **Commit the record.** For source *file* in a git repository, commit
   `orchestration.md` alone on the branch, by the project's commit
   convention, with the subject `Record the orchestration of <target title>`.
3. **Worktree.** On `done` with a worktree, run
   `git worktree remove <scratch-dir>/worktree` and keep the branch. On
   `blocked`, keep the worktree, so that the change so far stays in it.
4. **Send.** Send the orchestration report as the final message, unchanged.
   Ask nothing and offer nothing after it.
