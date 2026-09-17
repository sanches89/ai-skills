# Glossary

Every word below has one meaning in `AGENTS.md`, `README.md`, and `docs/refs/`.
A skill defines the words with a special meaning in that skill in its own Terms
section. A skill that uses a word from this file gives it the definition
written here.

## Skills

- **Agent**: a coding agent that loads `SKILL.md` files, such as Claude Code,
  Codex, or Cursor.
- **Subagent**: a run that the agent spawns for one piece of work. It returns
  a result to the agent.
- **Aside**: a phrase in prose that names one agent's feature and that other
  agents skip. Never a command and never a step.
- **Skill**: a folder directly under `skills/` that holds a `SKILL.md` and,
  when needed, `references/` and `scripts/`.
- **Skill directory**, written `<skill-dir>`: the folder holding a `SKILL.md`.
- **Terms section**: the `## Terms` section of a `SKILL.md`. It defines the
  words with a special meaning in that skill.
- **Question format**: the fixed four-block layout of every question to the
  user: QUESTION, CONTEXT, OPTIONS, MY SUGGESTION. One question per message,
  in plain chat text.
- **Quality checklist**: a skill's `references/quality-checklist.md`.
- **Banned words**: words that mark an assumption or an open question: `TBD`,
  `TBC`, `TODO`, `maybe`, `might`, `probably`, `possibly`, `perhaps`,
  `ideally`, `consider`, `could`, `should we`, `if needed`, `if necessary`,
  `as appropriate`, `as needed`, `etc`, `and so on`, `or similar`,
  `something like`.

## Tasks

- **Task**: one unit of work in the task format.
- **Task format**: the sections of a task, in order: Summary, Success
  criteria, Scope, Approach, Decisions, Context, Subtasks, Verification.
- **Subtask**: one commit-sized unit of work inside a task.
- **Subtask format**: the sections of a subtask, in order: Task, Depends on,
  Goal, Context, Changes, Acceptance criteria, Verification.

## Reference docs

- **Reference doc**: a file under `docs/refs/<folder>/`. It answers one
  question about the folder's subject and ends with a footer.
- **Footer**: the last block of a reference doc: `---`, a blank line, then
  `Reference:` followed by the URLs of the doc's origin.
- **Origin**: where a piece of information was taken from: a file path with
  line numbers, an identifier, or a URL.
