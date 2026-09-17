# Glossary

Every word below has exactly one meaning in this repository: in `AGENTS.md`, in
every `SKILL.md` and its references, and in `docs/refs/`. A skill's Terms
section restates the entries it needs, because a skill is self-contained. When a
definition here and one in a skill disagree, this file is wrong or the skill is
wrong, and the mismatch is fixed before commit.

## Skills and their files

- **Agent**: a coding agent that loads `SKILL.md` files, such as Claude Code,
  Codex, or Cursor.
- **Agent-agnostic**: works in every agent. A feature of one agent appears only
  as an aside.
- **Aside**: a phrase in prose that names one agent's feature and that other
  agents can skip. Never a command and never a step.
- **Skill**: a folder directly under `skills/` holding a `SKILL.md` and, when
  needed, `references/` and `scripts/`. The unit that is installed and listed.
- **SKILL.md**: the file that defines a skill: frontmatter followed by
  instructions.
- **Frontmatter**: the YAML block at the top of a `SKILL.md`. Fields used here:
  `name`, `description`, `license`, `compatibility`, `argument-hint`.
- **Description**: the frontmatter field an agent reads to decide whether to
  load a skill. It says what the skill produces and when to use it.
- **References**: the `references/` folder of a skill: templates and checklists
  that the instructions cite and that load only when cited.
- **Scripts**: the `scripts/` folder of a skill: executables the instructions
  run.
- **Skill directory**, written `<skill-dir>`: the folder holding a `SKILL.md`.
  Commands in a skill name it explicitly.
- **Terms section**: the `## Terms` section of a `SKILL.md`. It defines the
  words with special meaning that the skill uses, in agreement with this
  glossary.
- **Question format**: the fixed four-block layout for every question to the
  user: QUESTION, CONTEXT, OPTIONS, MY SUGGESTION. One question per message, in
  plain chat text.
- **Quality checklist**: a skill's `references/quality-checklist.md`. Every
  check passes before the skill shows its output.
- **Banned words**: words that mark an assumption or an open question and never
  appear in instructions or in a skill's output: `TBD`, `maybe`, `might`,
  `probably`, `possibly`, `perhaps`, `ideally`, `consider`, `could`,
  `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
  `and so on`, `or similar`, `something like`.

## Tasks and subtasks

- **Idea**: the user's input to `task-create`. A sentence or a paragraph
  describing a change they want.
- **Task**: one unit of work written in the task format. `task-create` produces
  it from an idea. `task-breakdown` splits it into subtasks and rewrites it with
  the Subtasks section filled.
- **Original task**: in `task-breakdown`, the task as received, before the skill
  adds anything to it.
- **Subtask**: one commit-sized unit of work inside a task, written in the
  subtask format. Only `task-breakdown` writes subtasks.
- **Subtask rule**: a subtask is one reviewable change with a single
  verification command, mergeable on its own: after it is merged, the project
  builds and every test, existing and new, passes.
- **Breakdown**: a task plus its ordered subtasks. What the user approves in
  `task-breakdown`.
- **Task format**: the document format of a task, defined in each skill's
  `references/task-template.md`. Sections, in order: Summary, Success criteria,
  Scope, Approach, Decisions, Context, Subtasks, Verification. Identical in both
  skills except for the Subtasks section.
- **Subtask format**: the document format of a subtask, defined in
  `task-breakdown`'s `references/task-template.md`: Task, Depends on, Goal,
  Context, Changes, Acceptance criteria, Verification.
- **Summary**: two or three sentences on what changes and why.
- **Success criteria**: observable, binary outcomes that define a task as done.
- **Scope**: the In scope list of deliverables and the Out of scope list of
  topics.
- **In scope**: every deliverable of the task.
- **Out of scope**: adjacent topics that came up and that a reader would expect
  in the task, each stated as not part of it.
- **Approach**: one bullet per component that changes, with its path and symbol
  and its behavior after the change. What changes where.
- **Decisions**: the rules and values the change follows, stated as facts. Which
  rules the change obeys.
- **Context**: facts an implementer needs, each with its source: paths with line
  numbers, symbols, conventions, commands, related items, library facts.
- **Subtasks section**: in a task, the ordered list of its subtasks with
  dependencies. `None.` until `task-breakdown` fills it.
- **Verification**: for a task, the commands or manual steps that prove every
  success criterion. For a subtask, exactly one command, or one numbered manual
  sequence when no command can prove it.
- **Goal**: one sentence on what a subtask delivers.
- **Changes**: in a subtask, the exact files, functions, inputs, outputs, and
  error behavior to add or change.
- **Acceptance criteria**: observable, binary checks that define a subtask as
  done.
- **Depends on**: the earlier subtasks a subtask needs merged first, by number
  in a draft, by link or identifier when saved.
- **Behavior-free subtask**: a refactor, scaffolding, migration, or
  configuration change that alters no behavior. Allowed only when a later
  subtask needs it.
- **Guard**: what hides behavior that later subtasks complete: a feature flag, a
  disabled route, an unexported symbol. The subtask that completes the behavior
  removes it.
- **Topic**: a subject that came up during research or interview. It is either
  brought into scope or listed under Out of scope.
- **Item**: a record in a project-management server. A task is one item, each
  subtask a child item of it. The word is never used for anything else.
- **Server**: a project-management server reached through MCP.
- **Source**: where `task-breakdown` got the task. Exactly one of *server* (an
  item), *file* (a `task.md`), or *text*. It decides where the result is saved.
- **Draft**: a task or breakdown text before approval, kept in the scratch
  directory.
- **Scratch directory**: a temporary location outside the repository. In Claude
  Code, the session's scratchpad directory. In any other agent, the system temp
  directory.
- **Task folder**: `docs/tasks/###-<task-slug>/`.
- **Task file**: `docs/tasks/###-<task-slug>/task.md`, the task in the task
  format.
- **Subtask file**: `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`, one
  subtask in the subtask format.
- **Number**, written `###`: a zero-padded three-digit sequence starting at
  `001`. A task takes the next free number across all folders in `docs/tasks/`.
  A subtask takes the next free number inside its task folder.
- **Slug**: the kebab-case form of a title truncated to 60 characters.
  `<task-slug>` comes from the task title, `<subtask-slug>` from the subtask
  title.

## Repository documents

- **AGENTS.md**: the rules for working in this repository. Read by every agent.
- **CLAUDE.md**: a file beside an `AGENTS.md` that reads exactly `@AGENTS.md`,
  so Claude Code loads the same rules.
- **Reference docs**: the folders under `docs/refs/`, one per subject, holding
  what this repo uses from external sources. Each has a `README.md` index, and
  each file ends with a footer.
- **Footer**: the last block of a reference file: `---`, a blank line, then
  `Reference:` followed by the source URLs.
- **Audit**: the `agent-docs-audit` procedure applied to `AGENTS.md` and
  `docs/refs/`. Its script measures word counts against a base ref and fails on
  the checks it can decide.
- **Base ref**: the git ref the audit compares sizes against. The commit where
  the last audit landed.

## Distribution

- **Skills CLI**: `npx skills`, the command-line tool from Vercel Labs that
  installs skills from a repository into an agent's skills folder.
- **skills.sh**: the directory and leaderboard fed by the skills CLI's anonymous
  install counts. A skill appears there on its first install.
- **Agent Skills specification**: the format for `SKILL.md`, its frontmatter,
  and the skill folder that the CLI, skills.sh, and the agents read.
- **Project scope**: an install into the current project, the CLI default.
- **Global scope**: an install into the user's home directory, with `-g`.
- **Canonical copy**: with several target agents, the single copy under
  `.agents/skills/<name>` that each agent's folder symlinks to.
- **Internal skill**: a skill with `metadata.internal: true` in its frontmatter.
  The CLI hides it until the user opts in.
