---
name: loading-tasks
description: Loads a task or subtask from a tracker item, a task file or folder, or a subtask file and returns its task map with the parent chain, the subtasks in order, and their verification commands. Use when a task, ticket, or issue must be read with its parents and subtasks, or the user asks what a task's subtasks are and in which order they run.
license: MIT
compatibility: Requires the finding-trackers skill.
argument-hint: <task or subtask id | file | task folder | text>
---

# Loading tasks

Load one task or subtask, the target, with its parent chain and its
subtasks. Return the task map, which a skill that implements or runs the
target reads instead of the task text. Change nothing.

## Hard rules

1. **Read-only.** Never edit a task file, a subtask file, or an item. The
   skills that write tasks own that text, and an edit here hides a change
   from them.
2. **Never ask.** Settle every line of the task map from the target, its
   chain, its subtasks, and the tracker map. Report a target that does not
   load as `source: none` with its reason. A calling skill runs unattended,
   where no user reads a question.

## Invocation

Another skill invokes this one in one of two forms:

```
from <caller>: <item identifier or URL | task file path |
  subtask file path | task folder path | text>
from <caller>:
```

The text after `from <caller>:` is the target, and nothing after it means
no target. Run the workflow and send the task map as the final message,
with nothing else.

Any invocation text without the `from <skill name>:` prefix means a user
invoked this skill. Take the target from that text or the conversation, run
the workflow, then show the task map in chat.

## Workflow

### Step 1: Resolve the target

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Resolve the target as one source:
- **An item identifier or URL** (`PAY-212`, `#128`, an issue link). Source:
  *tracker*. Invoke the `finding-trackers` skill (in Claude Code, with the
  `Skill` tool) with the invocation text `from loading-tasks: find`. Read
  the item with the map's `read item` line. When the map reads
  `tracker: none`, or the tracker holds no such item, the source is
  `none: no tracker holds <identifier>`.
- **A subtask file**, a file named `###-<subtask-slug>.md` next to a
  `task.md`. Source: *file*.
- **A task file**, a file named `task.md`. Its folder is the task folder.
  Source: *file*.
- **A task folder**, a folder that holds a `task.md`. That `task.md` is the
  target. Source: *file*.
- **Any other folder.** Source: `none: <path> holds no task.md`.
- **A path that does not exist.** Source: `none: <path> does not exist`.
- **Free text**, or the path of any other file, whose content is then the
  text. Source: *text*.
- **Nothing.** Source: `none: no target given`.

With source `none`, the task map is its first line alone. Go to Step 4.

### Step 2: Build the chain

The chain is the target, its parent, and every parent above, up to the root
task, the task with no parent:
- Source *file*: the parent of a subtask file is the `task.md` of its task
  folder. A task file has no parent.
- Source *tracker*: the parent of an item is the item that the map's
  `read parent` line returns. When that line reads `none` or returns no
  item, the parent is the item its `Task` line links. Read parents until
  an item has none. Stop when an identifier repeats.
- Source *text*: the chain is the target alone.

The kind is *subtask* when the target has a parent, else *task*.

Read every task in the chain only as far as the task map needs. Never open
the links of a References section.

### Step 3: List the subtasks

A subtask of a task is one of three things: a subtask file in its task
folder, a child of its item, or an entry of its Subtasks section other than
`None.`. Count each subtask once. List the children of an item with the
map's `list children` line. List the subtasks of the target. For kind
*subtask*, list the subtasks of its parent as the siblings.

Order each list by the Subtasks section of the task it belongs to. Without
one, place each subtask after every subtask on its `Depends on` line, ties
by number or identifier, lowest first.

For each subtask, read its file or its item and record:
- its number or identifier, and its title;
- `at`: its file path or its item URL. An entry of the Subtasks section
  with no file and no item reads `at: none`;
- its `Depends on` entries as numbers or identifiers, else `none`;
- its Verification section, word for word;
- every path its Changes section marks `(new)`, else `none`;
- `state`: for source *tracker*, `completed` when its item's status is
  on the map's `completed status` line, or that line reads `unsettled` and
  the item is closed. Else `open`. For source *file* and *text*,
  `unknown`.

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

Fill these lines by these rules:
- `title`: the target's `#` heading, else the first line of the text.
- `verification`: `none` when the target has no Verification section.
- `new`: the paths that the target's Changes section marks `(new)`. A task
  has no Changes section: take them from its Approach section.
- `state`: the target's state, by the rule for a subtask's `state`.
- `commands`: one entry per command, from the nearest task in the chain
  whose Context section names it.
- `tracker`: the tracker map for source *tracker*, else `none`.

For a calling skill, send the task map as the final message, unchanged. Ask
nothing and offer nothing after it. For a user, show the task map in chat.
