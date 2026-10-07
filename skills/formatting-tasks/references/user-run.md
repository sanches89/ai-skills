# User run

A user run follows the workflow of `SKILL.md` with these additions.

## Step 1: Take the form

A request from a user maps to one form:

- facts, a plan, or a ticket to put in the format: `write`, into
  `<scratch-dir>/task-draft/`, with `subtasks <count>` when the request lists
  subtasks;
- a task or a subtask, as a file or as text, to check against the format:
  `check`. Write text into a draft file in `<scratch-dir>` first;
- a question about the size of a change: `size`, with `tests <locations>` when
  the request names test locations.

Run the forms a request names in the order write, check, size. Without a
request, ask for the draft or the text first. The request and the conversation
are the research notes.

## Step 5: Return

Show in chat:

- `write`: the draft paths and the full text of every draft;
- `check`: each fix made, and each failure left as `<path:line> <check>`;
- `size`: one line per draft, `<path>: <n> code lines`, and the name of each
  draft above 500 code lines.

Ask the user one question per decision needed. Apply each answer to the drafts,
and run Step 3 again.
