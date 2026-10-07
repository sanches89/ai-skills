# ai-skills

AI skills for development work.

A collection of agent skills that extend AI coding assistants with reusable,
task-specific capabilities. Every skill is agent-agnostic: it works in any
coding agent that loads `SKILL.md` files.

## Skills

- [creating-tasks](skills/creating-tasks/SKILL.md): explores an idea by
  researching code, docs, and MCP servers, then interviews you. It writes one
  precise task with no assumptions or open questions.
- [breaking-down-tasks](skills/breaking-down-tasks/SKILL.md): takes a task from
  a project-management item or a task file and splits it into commit-sized
  subtasks. Each subtask is self-contained and has one verification command.
  It also splits a subtask item. Given a subtask file or a task as text, it
  writes nothing. It points to breaking down the file's task, or to
  creating-tasks.
- [implementing-tasks](skills/implementing-tasks/SKILL.md): implements a task or
  subtask within the scope set by its parent tasks and proves every acceptance
  criterion. It writes the code by writing-clean-code and the tests by
  writing-unit-tests. It returns a short work report with only what the rest of
  the work needs.
- [orchestrating-tasks](skills/orchestrating-tasks/SKILL.md): runs a whole task
  from its task file or item: one subtask at a time, each in its own subagent
  with the implementing-tasks skill, each with one commit on a branch. Then it
  runs refactoring-code over the result and the refactor task the same way, for
  up to three rounds. It asks at most where to run, before the first subtask.
  It proves the task and keeps its plan and reports with the task, on its
  items or in its task folder. Every read of the
  task and every project command runs in a subagent, so that its own context
  window stays small.
- [refactoring-code](skills/refactoring-code/SKILL.md): reviews code in any
  language for refactoring, with the findings of finding-code-smells and the
  numbers of measuring-code. It writes a refactor task with at most 12
  subtasks, one per refactoring, each with its tests and one verification
  command. It lists the rest as the next batch and changes no code.
- [writing-agent-docs](skills/writing-agent-docs/SKILL.md): holds the rules for
  a repo's `AGENTS.md` files, READMEs, ADRs, `docs/refs`, and glossary entries,
  which the agent follows whenever it edits one. On request, it audits and
  compresses the `AGENTS.md` files, the `CLAUDE.md` files, and `docs/refs`
  without losing a rule. With the writing-glossaries and disambiguating-text
  skills, it also defines every term once and rewrites the wording.
- [writing-glossaries](skills/writing-glossaries/SKILL.md): finds the words that
  a project's documents use with two readings that no other word settles. It
  also finds the words they use in a sense a reader would not take from the word
  alone. It writes the glossary that defines each of them once and reports where
  the documents disagree with it.
- [disambiguating-text](skills/disambiguating-text/SKILL.md): rewrites one text
  so that every sentence has one reading, with its meaning unchanged. It reports
  each ambiguity it resolved and each word that needs a glossary entry.
- [updating-packages](skills/updating-packages/SKILL.md): updates every
  dependency in every `package.json` of a repository to the highest version that
  the project's install, build, lint, type check, and tests accept. It changes
  only manifests and lockfiles and returns a short update report with what
  moved, what stayed, and why.
- [analyzing-code](skills/analyzing-code/SKILL.md): measures the duplication,
  complexity, hotspots, unit tests, coverage, and mutation score of the working
  tree or of one branch. It reads the code behind every number. It never
  compares two versions. It returns a measurement report with ranked findings
  and changes no code. A run can take hours: the mutation run runs the tests
  once per mutant.

### Building blocks

The skills above invoke these by name. Each holds one piece of content that
used to be copied between skills. You can also invoke each one directly.

- [finding-trackers](skills/finding-trackers/SKILL.md): finds the issue
  tracker a project uses and the commands that reach its items.
- [loading-tasks](skills/loading-tasks/SKILL.md): reads a task or subtask
  with its parent chain and its subtasks in order.
- [formatting-tasks](skills/formatting-tasks/SKILL.md): writes and checks a
  task in the one task format, and counts the code lines a change touches.
- [saving-tasks](skills/saving-tasks/SKILL.md): saves a task and its subtasks
  to the tracker or to numbered task folders.
- [finding-dev-commands](skills/finding-dev-commands/SKILL.md): finds
  a project's build, lint, type-check, format, test, `test one file`, and
  install commands.
- [writing-clean-code](skills/writing-clean-code/SKILL.md): writes code, or
  reviews code against 14 clean code principles, each with a check that a
  diff passes.
- [writing-unit-tests](skills/writing-unit-tests/SKILL.md): writes and
  reviews unit tests, characterization tests included.
- [measuring-code](skills/measuring-code/SKILL.md): measures duplication,
  complexity, hotspots, tests, coverage, and mutation score of given paths.
- [finding-code-smells](skills/finding-code-smells/SKILL.md): finds the
  smells, design flaws, and marks of agent-written code in existing code,
  each with the refactoring that removes it.

### Pipeline

creating-tasks, breaking-down-tasks, implementing-tasks, orchestrating-tasks,
and refactoring-code form a pipeline. creating-tasks writes
`<tasks-dir>/###-<task-slug>/task.md`. breaking-down-tasks adds
`<tasks-dir>/###-<task-slug>/###-<subtask-slug>.md` next to it. refactoring-code
writes both from a code review. saving-tasks writes every one of these files.
`<tasks-dir>` is the folder you name, created when it does not exist. Without
one, it is the first that exists of: the folder README, CLAUDE.md, AGENTS.md,
CONTRIBUTING, or `docs/README.md` names for tasks, plans, or specs; the folder
that already holds task folders; a `tasks`, `plans`, or `specs` folder of the
repository. With none of these, it is a scratch directory outside the
repository, which in Claude Code lives one session. implementing-tasks
implements a task or one subtask from those files. orchestrating-tasks runs
implementing-tasks on every subtask of a task, one at a time, with one commit
each. Then it runs refactoring-code and implementing-tasks over the result,
up to three rounds. The tracker is the one the project docs name. When
neither an MCP server nor the `gh` CLI reaches it, no tracker is connected.
When the docs name none, the tracker is the one an MCP server reaches, else
GitHub Issues through `gh`. With a tracker connected, the writers create
items there instead, unless you ask for files, and implementing-tasks and
orchestrating-tasks read them. Each skill ends with the input of the next, so
these sequences work without an edit in between:

1. an idea, then creating-tasks, breaking-down-tasks, and orchestrating-tasks;
2. an idea, then creating-tasks and implementing-tasks, when the task is one
   commit;
3. code, then refactoring-code and orchestrating-tasks;
4. refactoring-code, then breaking-down-tasks, then orchestrating-tasks, for a
   different split of the refactor task;
5. analyzing-code, then refactoring-code or creating-tasks on a finding;
6. the whole codebase, then refactoring-code with no argument and
   orchestrating-tasks, repeated until refactoring-code writes no task.

implementing-tasks in place of orchestrating-tasks in sequences 1, 3, 4, and 6
runs the same subtasks in the current working tree. It makes no commit and runs
no refactor round.

writing-glossaries and disambiguating-text form a pair: the first writes the
glossary, and the second rewrites a document with the glossary's terms.

updating-packages stands outside the pipeline and requires
finding-dev-commands. It leaves a major version that needs a code change for
creating-tasks to turn into a task.

analyzing-code stands outside the pipeline and changes no code. It measures
one whole version, where measuring-code measures given paths. A finding it
reports is input for creating-tasks or refactoring-code.

## Structure

Each skill lives in its own directory with a `SKILL.md` describing when and how
it should be used.

```
skills/
  <skill-name>/
    SKILL.md          # frontmatter (name, description) + instructions
    references/       # templates, checklists, and rules the skill cites
    scripts/          # executables the instructions run
    evals/            # test prompts and trigger queries for the skill
```

## Usage

Install with the `skills` CLI, which supports Claude Code, Codex, Cursor, and
other agents:

```bash
npx skills add sanches89/ai-skills
npx skills add sanches89/ai-skills --skill measuring-code finding-dev-commands
```

The first command installs every skill and the second picks skills by name.
Add `-a <agent>` to pick an agent and `-g` to install for the user instead of
the project.

A skill invokes the skills it requires by name, and the CLI installs no
dependency. Pick a skill together with every skill it requires, directly or
through another skill:

- creating-tasks: finding-trackers, finding-dev-commands,
  formatting-tasks, saving-tasks;
- breaking-down-tasks: the skills of creating-tasks, plus loading-tasks;
- implementing-tasks: loading-tasks, finding-trackers,
  finding-dev-commands, writing-clean-code, writing-unit-tests;
- refactoring-code: loading-tasks, finding-trackers,
  finding-dev-commands, measuring-code, finding-code-smells,
  writing-unit-tests, formatting-tasks, saving-tasks;
- orchestrating-tasks: implementing-tasks, refactoring-code, and every skill
  the two require;
- analyzing-code and finding-code-smells: measuring-code,
  finding-dev-commands;
- loading-tasks and saving-tasks: finding-trackers;
- measuring-code, writing-clean-code, writing-unit-tests, and
  updating-packages: finding-dev-commands.

The other skills require none. The skills are also listed on
[skills.sh](https://skills.sh/sanches89/ai-skills).

Without the CLI, clone this repo into your agent's skills folder (e.g.
`~/.claude/skills/`).

One skill runs only when you ask for it by name: `/updating-packages`. Its
`disable-model-invocation: true` frontmatter field stops Claude Code, Cursor,
and Copilot from starting it on its own. Its `agents/openai.yaml` does the
same in Codex, and its description states the rule for every other agent.

## Contributing

Rules for writing skills in this repo are in [AGENTS.md](AGENTS.md),
including the test a word passes before a skill's Terms section or the repo's
glossary defines it.

## License

[MIT](LICENSE)
