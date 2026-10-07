---
name: saving-tasks
description: Saves an approved task and its subtasks to the project's tracker as linked items, or to numbered task folders, and returns the item identifier or the task file path. Use when a written task, subtask, ticket, or plan needs saving, filing, or replacing in the tracker or the tasks directory.
license: MIT
compatibility: Requires the finding-trackers skill.
argument-hint: <task draft path> [subtask draft paths]
---

# Saving tasks

Save one approved task and its subtasks to the tracker as linked items, or
to a numbered task folder as files.

## Hard rules

1. **Change only the links.** Replace the titles and numbers on the `Task`
   and `Depends on` lines and in the Subtasks section with links. Change no
   other draft text. The one addition is the `Task` line that Step 3 keeps
   on `replace`.
2. **Write only the task and its subtasks.** Create, overwrite, close,
   unlink, or delete only the task file, its subtask files, the folders
   that hold them, and their items.
3. **Ask only what the invocation allows.** With `unattended`, ask nothing.
   Otherwise ask only the questions of Step 2 and Step 4, one at a time.

## Invocation

Form for a calling skill:

```
from <caller>: task <draft path>[, subtasks <draft path> <draft path>...]
[, replace <item identifier | task folder>][, files][, dir <folder>]
[, destination <team, project, or board>][, unattended]
```

- `task`: the task draft.
- `subtasks`: drafts in subtask order.
- `replace`: overwrite that task, keeping its number or its item, and
  replace its subtasks.
- `files`: save to files.
- `dir`: the tasks directory the user named.
- `destination`: the team, project, or board for new items.
- `unattended`: ask nothing.

Send the workflow's one final line as the final message, with nothing else.

Invocation text without the `from <skill name>:` prefix comes from a user.
Take the task and its subtasks from it or the conversation. Write each one
given as text, unchanged, to a draft in `<scratch-dir>`, a scratch
directory outside the repository (in Claude Code, the scratchpad
directory). Set `replace`, `files`, `dir`, and `destination` from the
user's request, never `unattended`.

## Workflow

### Step 1: Read the drafts

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in
one each read or command that yields only facts, returned with path and
line.

Read the task draft and every subtask draft. A draft's title is its `#`
heading. When a draft path does not exist, save nothing and end with one
line: `not saved: a draft is missing`.

### Step 2: Choose the store

The store is the tracker or files. Take the first rule that applies:
1. `replace` with an item identifier: the tracker;
2. `replace` with a task folder: files;
3. `files` or `dir`: files;
4. a connected tracker: the tracker;
5. else files.

Unless rule 2 or rule 3 applies, first invoke the `finding-trackers` skill
(in Claude Code, with the `Skill` tool) with `from saving-tasks: find`. A
tracker is connected when the first line of the tracker map does not start
with `tracker: none`. Under rule 1, when no tracker is connected or the
tracker holds no such item, save nothing and end with one line:
`not saved: the tracker holds no such item`.

For the tracker, settle these values from the tracker map:
- **Destination.** On `replace`, the replaced item's. Else the `destination`
  option, else the map's `destination` line. When that line reads
  `none named` and the `destinations` line reads `one`, create the items
  without one. When it reads `none named` and `destinations` reads anything
  else, ask one question: which team, project, or board receives the
  items. With `unattended`, save to files instead of asking.
- **Required fields.** Take each value the map's `required fields` line
  settles. Ask one question per field that reads `unsettled`. With
  `unattended`, save to files instead of asking.

Save to the tracker by Step 3, or to files by Step 4.

### Step 3: Save to the tracker

Use the tools and commands of the tracker map:
1. **Task item.** On `replace`, read the item's old body with `read item`.
   Set the item's title to the task's title, unless they are equal, and its
   body to the task draft. When the old body holds a `Task` line, put that
   line under the draft's `#` heading. Without `replace`, create an item at
   the destination, with the task's title, the task draft as body, and the
   required field values.
2. **Old children.** On `replace`, list the item's children with
   `list children`. When that line reads `none`, take them from the links
   in the old body's Subtasks section. Delete each with `delete item`.
   When that line reads `none` or the delete fails, close the child with
   `close item`. Unlink each closed child with `unlink child`, unless the
   `unlink child` line reads `none`.
3. **Children.** Create one child item per subtask draft, in subtask order,
   with the subtask's title, its draft as body, and the required field
   values. Put the task's item link on the `Task` line and sibling item
   links on the `Depends on` line. Link each child to the task's item with
   `link child`. When that line starts with `none`, put the child links in
   the task's body and the task's link in each child body.
4. **Subtasks section.** Edit the task item: replace the title and number
   of each entry of its Subtasks section with the link of its child item.

When a tool or command other than a delete fails, stop and end with one
line: `not saved: the tracker failed at <map line>`, with the map line of
the action, such as `create item`.

Go to Step 5.

### Step 4: Save to files

**Tasks directory.** `<tasks-dir>` holds the task folders. With `dir`, it
is the folder `dir` names: create it when it does not exist. Without `dir`,
it is the first of these that exists:
1. the folder that README, CLAUDE.md, AGENTS.md, CONTRIBUTING, or
   `docs/README.md` names as the place for tasks, plans, or specs;
2. the parent of a task folder named `###-<task-slug>`;
3. a folder named `tasks`, `plans`, or `specs`, at most three levels below
   the repository root, that holds a `.md` file at any depth;
4. else `<scratch-dir>/tasks/`.

Entries 2 and 3 of this list search the repository outside
`node_modules`, `.git`, and `vendor`. When one finds several folders, take
the shortest path, then the first in alphabetical order.

Save by the numbering rule below:
1. **Task folder.** On `replace`, the task folder it names. Else, when
   `<tasks-dir>` holds a folder with the same `<task-slug>` under any
   number, no subtask draft is given, and `unattended` is absent, ask one
   question. The choices: overwrite its `task.md` and delete its subtask
   files, keeping its number, or write a new folder with a new number. In
   every other case, create `<tasks-dir>/###-<task-slug>/` with the next
   free number.
2. **Task file.** Write the task draft to the folder's `task.md`, over any
   previous one.
3. **Old subtask files.** On `replace` or on overwrite, first delete every
   subtask file in the task folder.
4. **Subtask files.** Write each subtask draft to `###-<subtask-slug>.md`
   in the task folder, numbered `001` upward in subtask order. Link the
   `Task` line to `./task.md` and the `Depends on` line to the sibling
   files. Link each entry of the task's Subtasks section to its subtask
   file.

When a write, a delete, or a folder creation fails, stop and end with one
line: `not saved: a file write failed`.

**Numbering rule.** `###` is a zero-padded three-digit sequence from `001`:
for a task, the next free number across every entry of `<tasks-dir>` whose
name starts with three digits; for subtasks, the next free numbers inside
the task folder. A slug is a title in kebab-case: lowercase ASCII letters
and digits, every other run of characters replaced by one hyphen, cut to 60
characters, no leading or trailing hyphen. `<task-slug>` comes from the task
title, `<subtask-slug>` from the subtask title.

### Step 5: Finish

Finish with one line: the task item's identifier, or the task file path,
absolute when outside the repository.
