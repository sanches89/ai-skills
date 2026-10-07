---
name: saving-tasks
description: Saves an approved task and its subtasks to the project's tracker as linked items, or to numbered task folders, and returns the item identifier or the task file path. Use when a written task, subtask, ticket, or plan needs saving, filing, or replacing in the tracker or the tasks directory.
license: MIT
compatibility: Requires the finding-trackers skill.
argument-hint: <task draft path> [subtask draft paths]
---

# Saving tasks

Save one approved task and its subtasks: to the tracker as linked items, or
to a numbered task folder as files. Return one line: the task item's
identifier, or the task file path.

## Hard rules

1. **Change only the links.** Replace the titles and numbers on the `Task`
   and `Depends on` lines and in the Subtasks section with links. Change no
   other text of a draft. The one addition is the `Task` line that Step 3
   keeps on `replace`. The drafts hold approved text, and an edit saves
   text nobody approved.
2. **Write only the task and its subtasks.** Create, overwrite, close, or
   delete only the task file, its subtask files, the folders that hold
   them, and their items. Any other change reaches the project or the
   tracker without a review.
3. **Ask only what the invocation allows.** With `unattended`, ask nothing.
   Otherwise ask only the questions of Step 2 and Step 4, one at a time. A
   calling skill with `unattended` runs where no user reads a question.

## Invocation

Another skill invokes this one in this form:

```
from <caller>: task <draft path>[, subtasks <draft path> <draft path>...]
[, replace <item identifier | task folder>][, files][, dir <folder>]
[, destination <team, project, or board>][, unattended]
```

- `task`: the task draft.
- `subtasks`: drafts in subtask order. Absent: no subtask.
- `replace`: overwrite that task, keeping its number or its item, and
  replace its subtasks. Delete them, or close them when the tracker cannot
  delete.
- `files`: save to files although a tracker is connected.
- `dir`: the tasks directory the user named. It implies `files`.
- `destination`: the team, project, or board that the request or the
  caller's task names for new items.
- `unattended`: ask nothing. A same-slug folder gets a new number. An
  unsettled destination or required field sends the save to files.

Run the workflow and send its one final line as the final message, with
nothing else.

Any invocation text without the `from <skill name>:` prefix means a user
invoked this skill. Take the task and its subtasks from that text or the
conversation. Write each one given as text, unchanged, to a draft in a
scratch directory outside the repository (in Claude Code, the scratchpad
directory). Set `replace`, `files`, `dir`, and `destination` from what the
user asked, and never `unattended`.

## Workflow

### Step 1: Read the drafts

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Read the task draft and every subtask draft. A draft's title is its `#`
heading. When a draft path does not exist, save nothing and end with one
line: `not saved: a draft is missing`.

The drafts name titles and numbers on the `Task` and `Depends on` lines and
in the Subtasks section. Saving replaces them with file links or item links.

### Step 2: Choose the store

The store is where the save goes: the tracker or files. Take the first
rule that applies:
1. `replace` with an item identifier: the tracker;
2. `replace` with a task folder: files;
3. `files` or `dir`: files;
4. a connected tracker: the tracker;
5. else files.

Unless rule 2 or rule 3 applies, first invoke the `finding-trackers` skill
(in Claude Code, with the `Skill` tool) with the invocation text
`from saving-tasks: find`. A tracker is connected when the first line of
the tracker map does not read `tracker: none`. Under rule 1, when no
tracker is connected or the tracker holds no such item, save nothing. End
with one line: `not saved: the tracker holds no such item`.

For the tracker, settle these values from the tracker map:
- **Destination.** On `replace`, the replaced item's. Else the `destination`
  option, else the map's `destination` line. When it reads `none named` and
  the map's `destinations` line reads `one`, create the items without one.
  When it reads `none named` and the `destinations` line does not read
  `one`, ask one question: which team, project, or board receives the
  items. With `unattended`, that unsettled destination sends the save to
  files instead.
- **Required fields.** Take each value the map's `required fields` line
  settles. Ask one question for each field that reads `unsettled`. With
  `unattended`, an `unsettled` field sends the save to files instead. Give
  these values to every item that Step 3 creates.

Save to the tracker by Step 3, or to files by Step 4.

### Step 3: Save to the tracker

Use the tools and commands that the tracker map names:
1. **Task item.** On `replace`, first read the item's old body with
   `read item`. Then set the item's title to the task's title and its body
   to the task draft. When the old body holds a `Task` line, put that line
   under the draft's `#` heading: it links the parent when the map's
   `read parent` line reads `none`. Keep the item's title when the draft's
   title equals it. Without `replace`, create a new item at the
   destination, with the task's title, the task draft as body, and the
   required field values.
2. **Old children.** On `replace`, list the item's children with
   `list children`. When that line reads `none`, take them from the links
   in the old body's Subtasks section. Delete each with `delete item`. When
   the `delete item` line reads `none`, or the delete fails, close each
   with `close item`.
3. **Children.** Create one child item per subtask draft, in subtask order,
   so that later children link to earlier siblings by their created
   identifiers. The subtask's title is the title, its draft the body, and
   the required field values its fields.
   Put the task's item link on the `Task` line and sibling item links on the
   `Depends on` line. Link each child to the task's item with `link child`.
   When that line reads `none`, put the child links in the task's body and
   the task's link in each child body.
4. **Subtasks section.** Edit the task item: replace each entry of its
   Subtasks section with the link of its child item.

When a tool or command fails, stop. A failed delete is the one exception:
it falls back to `close item`. End with one line:
`not saved: the tracker failed at <map line>`, with the map line of the
action, such as `create item`.

Go to Step 5.

### Step 4: Save to files

**Tasks directory.** `<tasks-dir>` is the folder that holds the task
folders. With `dir`, it is the folder that `dir` names. Create that folder
when it does not exist. Without `dir`, it is the first of these that
exists:
1. the folder that README, CLAUDE.md, AGENTS.md, CONTRIBUTING, or
   `docs/README.md` names as the place for tasks, plans, or specs;
2. the parent of a task folder: a folder named `###-<task-slug>`, three
   digits, a hyphen, and a slug, that holds a `task.md`, anywhere in the
   repository outside `node_modules`, `.git`, and `vendor`. With several
   parents, the shortest path, then the first in alphabetical order;
3. a folder named `tasks`, `plans`, or `specs` that holds a `.md` file at
   any depth. It sits at most three levels below the repository root,
   outside `node_modules`, `.git`, and `vendor`. With several, the
   shortest path, then the first in alphabetical order;
4. else `<scratch-dir>/tasks/`, where `<scratch-dir>` is a scratch
   directory outside the repository (in Claude Code, the scratchpad
   directory).

Save by the numbering rule below:
1. **Task folder.** On `replace`, the task folder it names. Else look in
   `<tasks-dir>` for a folder with the same `<task-slug>` under any
   number. When one exists, no subtask draft is given, and `unattended` is
   absent, ask one question:
   overwrite its `task.md`, keeping its number, or write a new folder with
   a new number. On overwrite, write only the `task.md` of that folder and
   leave its subtask files as they are. In every other case, create
   `<tasks-dir>/###-<task-slug>/` with the next free number.
2. **Task file.** Write the task draft to `task.md` in the task folder,
   over the previous one on `replace`.
3. **Old subtask files.** On `replace`, delete every subtask file in the
   task folder first.
4. **Subtask files.** Write one subtask file per subtask draft,
   `###-<subtask-slug>.md` in the task folder, numbered `001` upward in
   subtask order. Link the `Task` line to `./task.md` and the `Depends on`
   line to the sibling files. Link each entry of the task's Subtasks
   section to its subtask file.

When a write, a delete, or a folder creation fails, stop. End with one
line: `not saved: a file write failed`.

**Numbering rule.** `###` is a zero-padded three-digit sequence from `001`: for
a task, the next free number across every entry of `<tasks-dir>` whose name
starts with three digits. For subtasks, the next free numbers inside the task
folder. A slug is a title in kebab-case: lowercase ASCII letters and digits,
every other run of characters replaced by one hyphen, cut to 60 characters,
with no leading or trailing hyphen. Build `<task-slug>` from the task title and
`<subtask-slug>` from the subtask title.

### Step 5: Finish

Finish with one line: the task item's identifier, or the path of the task
file, absolute when outside the repository. Ask nothing else.
