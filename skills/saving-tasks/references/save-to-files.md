# Save to files

## Tasks directory

`<tasks-dir>` holds the task folders. With `dir`, it is the folder `dir` names:
create it when it does not exist. Without `dir`, it is the first of these that
exists:

1. the folder that README, CLAUDE.md, AGENTS.md, CONTRIBUTING, or
   `docs/README.md` names as the place for tasks, plans, or specs;
2. the parent of a task folder named `###-<task-slug>`;
3. a folder named `tasks`, `plans`, or `specs`, at most three levels below the
   repository root, that holds a `.md` file at any depth;
4. else `<scratch-dir>/tasks/`.

Entries 2 and 3 of this list search the repository outside `node_modules`,
`.git`, and `vendor`. When one finds several folders, take the shortest path,
then the first in alphabetical order.

## Save

Save by the numbering rule below:

1. **Task folder.** On `replace`, the task folder it names. Else, when
   `<tasks-dir>` holds a folder with the same `<task-slug>` under any number, no
   subtask draft is given, and `unattended` is absent, ask one question. The
   choices: overwrite its `task.md` and delete its subtask files, keeping its
   number, or write a new folder with a new number. In every other case, create
   `<tasks-dir>/###-<task-slug>/` with the next free number.
2. **Task file.** Write the task draft to the folder's `task.md`, over any
   previous one.
3. **Old subtask files.** On `replace` or on overwrite, first delete every
   subtask file in the task folder.
4. **Subtask files.** Write each subtask draft to `###-<subtask-slug>.md` in the
   task folder, numbered `001` upward in subtask order. Link the `Task` line to
   `./task.md` and the `Depends on` line to the sibling files. Link each entry
   of the task's Subtasks section to its subtask file.

When a write, a delete, or a folder creation fails, stop and end with one line:
`not saved: a file write failed`.

## Numbering rule

`###` is a zero-padded three-digit sequence from `001`: for a task, the next
free number across every entry of `<tasks-dir>` whose name starts with three
digits; for subtasks, the next free numbers inside the task folder. A slug is a
title in kebab-case: lowercase ASCII letters and digits, every other run of
characters replaced by one hyphen, cut to 60 characters, no leading or trailing
hyphen. `<task-slug>` comes from the task title, `<subtask-slug>` from the
subtask title.
