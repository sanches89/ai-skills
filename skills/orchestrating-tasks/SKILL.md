---
name: orchestrating-tasks
description: Runs a whole task end to end on a branch, one commit per subtask through implementing-tasks, then refactor rounds, asking at most where to run. Use when the user wants a task with subtasks implemented, orchestrated, run unattended, or shipped as a branch from an item or a task file, or says to run the whole plan.
license: MIT
compatibility: Requires the loading-tasks, finding-dev-commands, implementing-tasks, and refactoring-code skills.
argument-hint: <task id | task file>
---

# Orchestrating tasks

Take one task and run every subtask through the `implementing-tasks` skill, one
at a time, each in its own subagent and each with one commit. Then clean the
result up: the `refactoring-code` skill writes a refactor task and the same jobs
run it, for up to three rounds. Carry every fact from one job to the next. Ask
at most where the jobs run, before the first job. Prove the task and keep the
plan and every report with the task.

## Terms

These words have exactly one meaning in this skill.

- **Job**: one task or subtask together with the `implementing-tasks` run that
  implements it.
- **Orchestration record**: where this run keeps its plan, every work report,
  and the orchestration report.
- **Probe**: a run of given commands in the tree the plan names, kept to
  one line of pass or fail per command.
- **Round**: one `refactoring-code` run over the code this run changed, and the
  jobs of the refactor task it writes.

## Hard rules

1. **Every change comes from a job or a round.** Never edit project code
   yourself, except to restore the tree as Step 4 states. Never edit a task
   file, a subtask file, or the title or body of an item. Put a wrong or
   stale fact found in one in the orchestration record as a fact. A change
   outside a job has no work report and no commit of its own.
2. **One job at a time.** Never run two jobs at once: they share one working
   tree, and two edits in one tree corrupt each other's diff.
3. **Ask only where the jobs run.** Ask only the tree question of Steps 2
   and 3, before the first job. Every job works from its target, the code,
   the docs, and the connected tools, and reports `blocked` when its target
   lacks a fact. Settle every other choice of this skill by the rules below.
   A run of hours has no user waiting to answer once the jobs start.
4. **Keep only the result.** Keep from each job its work report, and
   nothing else. Everything else fills the context window over a long run.
5. **No outward actions beyond the orchestration record and the commits.**
   Never push or open a pull request. Change an item's status or comment on
   an item only as Step 1 states. Do more only when the request that
   invoked this skill says so. A push publishes work the user has not
   reviewed.
6. **Delegate every read and run.** Run in a subagent (in Claude Code, the
   `Agent` tool) every step that reads a task, an item, a manifest, or a
   doc. Run in a subagent every build, lint, type-check, test, and
   Verification command. The subagent returns only what the step names.
   The context window then holds the plan, the orchestration record, and
   those returns, and stays small over a long run. Without subagents,
   follow the step yourself and keep only what it names.

## Workflow

### Step 1: Load the target

The target is the task or subtask this skill runs. `<target>` is the
invocation text, else the task given in the conversation. With neither,
`<target>` is empty.

**Task map.** Never open the target yourself. Run a subagent with this
prompt, the placeholders filled, and nothing else. `<folder>` is the
current working directory. Without subagents, follow the prompt yourself
and keep only its return:

```
Work in <folder>. Invoke the `loading-tasks` skill (in Claude Code, with
the `Skill` tool) with the invocation text
`from orchestrating-tasks: <target>`. When the `commands` line of the
task map it returns lacks a build, lint, type-check, or test command,
invoke the `finding-dev-commands` skill (in Claude Code, with the
`Skill` tool) with the invocation text `from orchestrating-tasks: find`.
Add each missing command from the command map it returns to the
`commands` line. Return the task map and nothing else.
```

Act on the map's `source` line:
- `none: no tracker holds <identifier>`: end with one line: no tracker
  holds the item, give a task file path. Write no report.
- any other `none`: end with one line: no task to run: <its reason>.
  Write no report.
- `text`: end with one line: no task to run, give a task file path or an
  item identifier. Write no report. The `creating-tasks` skill writes a
  task from text.
- `tracker` or `file`: continue.

The target has subtasks when the map's `subtasks` line is not `none`.

**Orchestration record.** It is the first of these that applies:
- source *tracker*, when the tracker map on the task map's `tracker` line names
  a tool or command on its `comment on item` line: the items. The plan, every
  fact, and the orchestration report are comments on the target's item. Each
  work report is a comment on its job's item. A job's state is its item's
  status: in progress when the job starts, completed on `done`, unchanged on
  `skipped` and `blocked`. A status the tracker lacks stays unchanged. The
  target's item is completed when the result is `done`;
- source *file*: `orchestration.md` (new) in the target's task folder.
  When the task folder is in the repository, write it in the tree the
  jobs run in, at the same relative path. It holds the plan, then each
  work report under `## Report: <job>`, then the orchestration report. A
  job's state is its line in the plan;
- else `<scratch-dir>/orchestration.md`, with the same content.

Comment on an item with the `comment on item` line of that tracker map.
Complete an item with its `close item` line. Set the in-progress status
only through a status field of the `edit item` tool. Never change an item's
title or body for it. A tracker without such a field keeps the status.

A scratch directory outside the repository (in Claude Code, the scratchpad
directory) is written `<scratch-dir>` in commands. When the orchestration
record holds a plan from an earlier run, copy its facts into the new plan.

### Step 2: Plan the jobs

**Jobs.** With subtasks, one job per subtask, in the order of the task
map's `subtasks` lines. Without subtasks, one job: the target itself.

**Tree.** In a git repository, the jobs run in the first of these that
applies:
- the tree the request names, such as a new worktree or the current
  folder;
- the current folder, when it is a linked worktree and
  `git status --porcelain` prints nothing. It is a linked worktree when
  `git rev-parse --git-dir` and `git rev-parse --git-common-dir` print
  different paths;
- else the tree the user names. Ask one question: where the jobs run.
  Name the reason: the current folder is the main checkout, or the paths
  that `git status --porcelain` prints. An uncommitted task folder is such
  a path. On an answer to stop, end with one line and write no report.

Outside a git repository, the jobs run in the current working tree without
commits.

**Branch.** A new worktree gets a new branch from `HEAD`. It goes to the
path the request or the answer names, else to `<scratch-dir>/worktree`.
Name the branch by the project's branch convention when the docs state
one, else `task/<task folder name>` for source *file* and
`task/<identifier>` in lowercase for source *tracker*. In an existing tree,
the jobs run on its current branch.

Draft the plan:

```
# Plan: <target title>
target: <path | identifier and URL>
tree: current | <path> | new worktree at <path>, because <reason>
branch: <name> | none: no git repository
base: <commit, filled in Step 3>
baseline: <command>: pass | fail (<failing checks>), filled in Step 3
jobs:
1. <subtask number or identifier> <title>: pending
2. <...>
rounds:
facts:
```

State the jobs, the tree with its reason, and the branch in chat, and
continue.

### Step 3: Prepare the tree

1. **Worktree.** When the plan names a new worktree, run
   `git worktree add -b <branch> <path> HEAD`. When the branch already
   exists, continue on it with `git worktree add <path> <branch>` and add
   `, continued` to the plan's `branch` line. From here on, run every
   command in the tree the plan names, written `<tree>`.
2. **Task file.** For source *file*, with the task folder in the
   repository, confirm that `<tree>` holds the target's task file at the
   same relative path. When it does not, ask the tree question of Step 2
   again and name the missing file. Put the answer in the plan's `tree`
   line, then run this step again from number 1.
3. **Baseline.** Fill `base` with `git rev-parse --short HEAD` in
   `<tree>`. Fill `baseline` with a probe of the task map's `commands`. A
   probe runs in a subagent given this prompt, the placeholders filled,
   and nothing else. Without subagents, follow the prompt yourself and
   keep only its return:

   ```
   Run each command or step below in <tree>, in order. Return one line
   per command or step, `<it>: pass | fail (<every failing check by
   name>)`, and nothing else: no output, no log, no fix.
   <commands or steps>
   ```

4. **Save the plan.** Write the plan to the orchestration record.

### Step 4: Run the jobs

Run the jobs in plan order, one at a time. Read
`references/job-prompt-template.md` once, before the first job. The entry
of a job is its line under the `subtasks` line of its task map. A job that
is the target itself has no such line. Its entry takes the path or the URL
on the map's `target` line as its `at`, and the map's `verification`,
`new`, and `state` lines. For each job:

1. **Skip a done job.** The job's target is done when, for source
   *tracker*, its entry holds `state: completed`. For source *file*, it is
   done when a probe passes on every line. The probe runs the entry's
   `verification` and `test -e <path>` for each of its `new` paths. Mark
   the job `skipped` in the orchestration record and continue with the
   next job.
2. **No target.** When the entry's `at` reads `none`, the subtask has no
   file and no item. Mark the job `blocked` with that cause in the
   orchestration record, and go to Step 7 with the result `blocked`.
3. **Start.** Mark the job `running` in the orchestration record. Note the
   output of `git status --porcelain` in `<tree>` as the job's start.
4. **Write the prompt.** Fill the template: the job's target, `<tree>`,
   the branch, and every fact in the orchestration record. The job's
   target is the `at` of its entry.
5. **Run the job.** When the agent offers subagents, run the job in a new
   subagent. Give it the prompt and nothing else. Without subagents, follow the
   prompt yourself with the `implementing-tasks` skill and continue here with
   its result.
6. **Read the result.** The result is one of:
   - **A work report**, which starts with `# Work report:`. Save it in the
     orchestration record.
   - **Anything else**: an empty result, an error, or a message that is
     no work report. In a git repository, restore `<tree>` to the job's
     start: for every path that `git status --porcelain` lists now and
     the job's start does not, run `git checkout -- <path>` when git
     tracks it, else delete it. Run the job once more with the same
     prompt. On a second one, mark the job `blocked` in the orchestration
     record with the cause and go to Step 7 with the result `blocked`.
7. **On `done`.** When `git status --porcelain` in `<tree>` lists a path
   that the job's start does not, commit it as the job's commit. Use the
   project's commit convention, with the job's title as the subject. Add
   every bullet under *Deviations* and *Affects other work* of the report
   to the orchestration record as a fact, prefixed with the job's number.
   When the job's entry is a subtask line, also add the fact
   `<number or identifier>: done`, with no prefix and the number or
   identifier of the entry. Mark the job `done` in the orchestration
   record with the hashes on the report's *Commits* line and
   `git rev-parse --short HEAD`. Continue with the next job.
8. **On `blocked`.** Mark the job `blocked` in the orchestration record and
   go to Step 7 with the result `blocked`. Run no further job.

### Step 5: Refactor rounds

Run up to three rounds after the last job. The limit only stops an endless
loop: a third round is no failure, and the run continues to Step 6 after
it. For each round:

1. **Review.** Run a subagent with this prompt, the placeholders filled,
   and nothing else. Keep `, files` only for source *file*. Without
   subagents, follow the prompt yourself and keep only its return:

   ```
   Work in <tree>: every command runs there and every file is read and
   written there.
   Invoke the `refactoring-code` skill (in Claude Code, with the `Skill`
   tool) with the invocation text `from orchestrating-tasks: <the git
   range <base>..HEAD | the paths under Changes of every work report so
   far, except those marked (deleted)>, bounds <the target's identifier,
   URL, or path>, files`. Return its final line and nothing else.
   ```

2. **Round result.** Add `R<round>: <final line>` under `rounds` in the
   orchestration record. Write `none` for a final line that names no task
   file path, no item identifier, and no `not saved:`. Act on the final
   line:
   - it starts with `not saved:`: the refactor task was not saved. Go to
     Step 7 with the result `blocked` and the line as its cause;
   - it names no task file path and no item identifier: the round is
     empty. Go to Step 6;
   - else continue.
3. **Load.** Run the prompt of Step 1, with `<tree>` as `<folder>` and the
   final line as `<target>`. Keep its return as the refactor task's task
   map. Add one job per line of its `subtasks` line under `jobs` in the
   orchestration record, as `R<round>.<n> <title>: pending`, in that order.
4. **Commit the refactor task.** In a git repository, when the final line
   is a task file path inside `<tree>`, commit the new task files alone on
   the branch. Use the project's commit convention, with the subject
   `Add <title>`. `<title>` is the `title` line of the refactor task's map.
5. **Run.** Run the new jobs by Step 4, with the target's orchestration
   record. Then start the next round.

### Step 6: Prove the target

Run one probe of, in this order:
1. the `verification` line of the target's task map;
2. the `verification` line of every refactor task's task map, in round
   order;
3. every command on the `commands` line of the target's task map.

The proof passes when every `verification` passes and no command fails
beyond the failures on the plan's `baseline` line. On a failure, the result
is `blocked`, and the failing command and check go into the prompt of
Step 7.

### Step 7: Finish

1. **Report.** Read `references/quality-checklist.md` now and confirm
   every check under *Run* from this run. Then run a subagent with this
   prompt, the placeholders filled, and nothing else. `<skill-dir>` is
   the folder holding this `SKILL.md`. Without subagents, follow the
   prompt yourself and keep only its return:

   ```
   Read the orchestration record: <path of orchestration.md | the
   comments on item <identifier> and on its children, and on every
   refactor task item under `rounds` and on its children>. Read the target
   <task file path | item identifier or URL> and its subtasks. Read
   <skill-dir>/references/orchestration-report-template.md and
   <skill-dir>/references/quality-checklist.md. Fill the orchestration
   report from the orchestration record and from git in <tree>. The
   proof is <pass | fail: <command> (<failing check>) | not run>. The
   run is blocked by <the cause from Step 4, 5, or 6 | nothing>. Run
   every check in the checklist except those under Run, grep helper
   included, and fix every failure. Return the report and nothing else.
   ```

   Save the orchestration report in the orchestration record, and on
   `done` mark the target's item completed.
2. **Commit the orchestration record.** For source *file* in a git
   repository, when the orchestration record is inside `<tree>`, commit
   `orchestration.md` alone on the branch. Use the project's commit
   convention, with the subject
   `Record the orchestration of <target title>`.
3. **Worktree.** On `done` with a worktree this run created, run
   `git worktree remove <tree>` and keep the branch. On `blocked`, keep
   that worktree, so that the change so far stays in it.
4. **Send.** Send the orchestration report as the final message, unchanged.
   Ask nothing and offer nothing after it.
