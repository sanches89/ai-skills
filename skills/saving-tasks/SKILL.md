---
name: saving-tasks
description: Saves an approved task and its subtasks to the project's tracker as linked items, or to numbered task folders, and returns the item identifier or the task file path. Use when a written task, subtask, ticket, or plan needs saving, filing, or replacing in the tracker or the tasks directory.
license: MIT
compatibility: Requires the finding-trackers skill.
argument-hint: <task draft path> [subtask draft paths]
---

# Saving tasks

Save one approved task and its subtasks to the tracker as linked items, or to a
numbered task folder as files.

## Hard rules

1. **Change only the links.** Replace the titles and numbers on the `Task` and
   `Depends on` lines and in the Subtasks section with links. Change no other
   draft text. The one addition is the `Task` line that Step 3 keeps on
   `replace`.
2. **Write only the task and its subtasks.** Create, overwrite, close, unlink,
   or delete only the task file, its subtask files, the folders that hold them,
   and their items.
3. **Ask only what the invocation allows.** With `unattended`, ask nothing.
   Otherwise ask only the questions of Step 3 and Step 4, one at a time.

## Invocation

Form for a calling skill:

```
from <caller>: task <draft path>[, subtasks <draft path> <draft path>...]
[, replace <item identifier | task folder>][, files][, dir <folder>]
[, destination <team, project, or board>][, unattended]
```

- `task`: the task draft.
- `subtasks`: drafts in subtask order.
- `replace`: overwrite that task, keeping its number or its item, and replace
  its subtasks.
- `files`: save to files.
- `dir`: the tasks directory the user named.
- `destination`: the team, project, or board for new items.
- `unattended`: ask nothing.

Send the workflow's one final line as the final message, with nothing else.

Invocation text without the `from <skill name>:` prefix comes from a user. Take
the task and its subtasks from it or the conversation. Write each one given as
text, unchanged, to a draft in `<scratch-dir>`, a scratch directory outside the
repository (in Claude Code, the scratchpad directory). Set `replace`, `files`,
`dir`, and `destination` from the user's request, never `unattended`.

## Workflow

### Step 1: Read the drafts

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in one
each read or command that yields only facts, returned with path and line.

Read the task draft and every subtask draft. A draft's title is its `#` heading.
When a draft path does not exist, save nothing and end with one line:
`not saved: a draft is missing`.

### Step 2: Choose the store

The store is the tracker or files. Take the first rule that applies:

1. `replace` with an item identifier: the tracker;
2. `replace` with a task folder: files;
3. `files` or `dir`: files;
4. a connected tracker: the tracker;
5. else files.

Unless rule 2 or rule 3 applies, first invoke the `finding-trackers` skill (in
Claude Code, with the `Skill` tool) with `from saving-tasks: find`. A tracker is
connected when the first line of the tracker map does not start with
`tracker: none`. Under rule 1, when no tracker is connected or the tracker holds
no such item, save nothing and end with one line:
`not saved: the tracker holds no such item`.

Save to the tracker by Step 3, or to files by Step 4.

### Step 3: Save to the tracker

Read `references/save-to-tracker.md` and save by it.

Go to Step 5.

### Step 4: Save to files

Read `references/save-to-files.md` and save by it.

### Step 5: Finish

Finish with one line: the task item's identifier, or the task file path,
absolute when outside the repository.
