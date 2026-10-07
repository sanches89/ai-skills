---
name: loading-tasks
description: Loads a task or subtask from a tracker item, a task file or folder, or a subtask file and returns its task map with the parent chain, the subtasks in order, and their verification commands. Use when a task, ticket, or issue must be read with its parents and subtasks, or the user asks what a task's subtasks are and in which order they run.
license: MIT
compatibility: Requires the finding-trackers skill.
argument-hint: <task or subtask id | file | task folder | text>
---

# Loading tasks

Load one task or subtask, the target, with its parent chain and its subtasks,
and return the task map.

## Hard rules

1. **Read-only.** Never edit a task file, a subtask file, or an item.
2. **Never ask.** Settle every line of the task map from the target, its chain,
   its subtasks, and the tracker map.

## Invocation

Forms for a calling skill:

```
from <caller>: <item identifier or URL | task file path |
  subtask file path | task folder path | text>
from <caller>:
```

The text after `from <caller>:` is the target.

Invocation text without the `from <skill name>:` prefix comes from a user. Take
the target from that text or the conversation.

## Workflow

### Step 1: Resolve the target

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in one
each read or command that yields only facts, returned with path and line.

Resolve the target to one source:

- **An item identifier or URL** (`PAY-212`, `#128`, an issue link): _tracker_.
  Invoke the `finding-trackers` skill (in Claude Code, with the `Skill` tool)
  with `from loading-tasks: find`. Read the item with the map's `read item`
  line. When the map's first line starts with `tracker: none`, or the tracker
  holds no such item, the source is `none: no tracker holds <identifier>`.
- **A subtask file**, named `###-<subtask-slug>.md` next to a `task.md`: _file_.
- **A task file**, named `task.md`: _file_. Its folder is the task folder.
- **A task folder**, a folder that holds a `task.md`: _file_. That `task.md` is
  the target.
- **Any other folder**: `none: <path> holds no task.md`.
- **A path that does not exist**: `none: <path> does not exist`.
- **A failed save**, a line that starts with `not saved:`: `none: <that line>`.
- **Free text**, or the path of any other file, whose content is then the text:
  _text_.
- **Nothing**: `none: no target given`.

With source `none`, the task map is its first line alone. Go to Step 4.

### Step 2: Build the chain

The chain is the target and every parent above it, up to the root task, which
has no parent:

- Source _file_: a subtask file's parent is the `task.md` of its task folder. A
  task file has no parent.
- Source _tracker_: an item's parent is the item the map's `read parent` line
  returns. When that line reads `none` or returns no item, it is the item its
  `Task` line links. Read parents until an item has none or an identifier
  repeats.
- Source _text_: the chain is the target alone.

The `kind` line reads _subtask_ when the target has a parent, else _task_.

Read each chain task only as far as the task map needs. Never open the links of
a References section.

### Step 3: List the subtasks

A task's subtask is a subtask file in its task folder, a child of its item, or a
Subtasks section entry other than `None.`. Count each subtask once. List an
item's children with the map's `list children` line. List the subtasks of the
target and, for `kind` _subtask_, of its parent as the siblings.

Order each list by its task's Subtasks section. Without one, place each subtask
after every subtask on its `Depends on` line, ties by lowest number or
identifier first.

For each subtask, read its file or its item to fill its line of the task map. A
Subtasks section entry with no file and no item reads `at: none`. Its `new`
paths are the ones its Changes section marks `(new)`. Its `state`:

- source _tracker_: `completed` when its item's status is on the map's
  `completed status` line, or that line reads `unsettled` and the item is
  closed, else `open`;
- source _file_ or _text_: `unknown`.

### Step 4: Send the task map

Fill the task map in this form:

```
source: tracker | file | text | none: <reason>
target: <path | identifier and URL | first line of the text>
title: <title>
kind: task | subtask
chain:
- <root task: path | identifier and URL> <title>
- <... each task down to the target, the target last>
depends on: <the target's Depends on entries, as numbers or identifiers> |
  none
verification: <the target's Verification section, word for word>
new: <every path the target marks (new)> | none
state: completed | open | unknown
commands: <build, lint, type-check, and test commands from the Context
  sections of the chain, nearest task first> | none
subtasks: none | one line per subtask of the target, in order:
- <number | identifier> <title>; at: <path | URL | none>; depends on:
  <numbers | identifiers | none>; verification: <its Verification section,
  word for word>; new: <paths | none>; state: completed | open | unknown
siblings: none | the subtasks of the target's parent, same form, the target
  marked (target)
tracker: none | <the tracker map, each line indented two spaces>
```

Line rules:

- `title`: the target's `#` heading, else the first line of the text.
- `verification`: `none` when the target has no Verification section.
- `new`: from the target's Changes section, or its Approach section for a task.
- `state`: the target's state, by the rule for a subtask's `state`.
- `commands`: one entry per command, from the nearest task in the chain whose
  Context section names it.
- `tracker`: the tracker map for source _tracker_, else `none`.

For a calling skill, send the task map unchanged as the final message, with
nothing after it. For a user, show it in chat.
