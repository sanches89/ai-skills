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
  a project-management item, a task file, or text and splits it into
  commit-sized subtasks. Each subtask is self-contained and has one verification
  command.
- [implementing-tasks](skills/implementing-tasks/SKILL.md): implements a task or
  subtask within the scope set by its parent tasks and proves every acceptance
  criterion. It returns a short work report with only what the rest of the work
  needs.
- [orchestrating-tasks](skills/orchestrating-tasks/SKILL.md): runs a whole task
  from its task file or item: one subtask at a time, each in its own subagent
  with the implementing-tasks skill, each with one commit on a branch. Then it
  runs refactoring-code over the result and the refactor task the same way, for
  up to three rounds. It asks nothing, proves the task, and keeps its plan and
  reports with the task, on its items or in its task folder. Every read of the
  task and every project command runs in a subagent, so that its own context
  window stays small.
- [refactoring-code](skills/refactoring-code/SKILL.md): reviews code in any
  language for refactoring, with duplication, complexity, unit tests, and
  coverage measured. Its catalog covers smells inside functions, design between
  modules, the marks of agent-written code, and tests. It writes a refactor task
  with at most 12 subtasks, one per refactoring, each with its tests and one
  verification command. It lists the rest as the next batch and changes no code.
- [writing-agent-docs](skills/writing-agent-docs/SKILL.md): holds the rules for
  a repo's `AGENTS.md` files, READMEs, ADRs, `docs/refs`, and glossary, which
  the agent follows whenever it edits one. On request, it audits and compresses
  them without losing a rule. With the writing-glossaries and
  disambiguating-text skills, it also defines every term once and rewrites the
  wording.
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

creating-tasks, breaking-down-tasks, implementing-tasks, orchestrating-tasks,
and refactoring-code form a pipeline. creating-tasks writes
`<tasks-dir>/###-<task-slug>/task.md`. breaking-down-tasks adds
`<tasks-dir>/###-<task-slug>/###-<subtask-slug>.md` next to it. refactoring-code
writes both from a code review. `<tasks-dir>` is the first that exists of: the
folder you name; the folder README, CLAUDE.md, AGENTS.md, CONTRIBUTING, or
`docs/README.md` names for tasks, plans, or specs; the folder that already holds
task folders; a `tasks`, `plans`, or `specs` folder of the repository. With none
of these, it is a scratch directory outside the repository, which in Claude Code
lives one session. implementing-tasks implements a task or one subtask from
those files. orchestrating-tasks runs implementing-tasks on every subtask of a
task, one at a time, with one commit each. Then it runs refactoring-code and
implementing-tasks over the result, up to three rounds. The tracker is the one
the project docs name, else one an MCP server reaches, else GitHub Issues
through the `gh` CLI. With a tracker connected, the writers create items there
instead, unless you ask for files, and implementing-tasks and
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

updating-packages works alone. It leaves a major version that needs a code
change for creating-tasks to turn into a task.

analyzing-code works alone and changes no code. A finding it reports is input
for creating-tasks or refactoring-code.

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
npx skills add sanches89/ai-skills --skill creating-tasks breaking-down-tasks
```

The first command installs every skill and the second picks skills by name.
Add `-a <agent>` to pick an agent and `-g` to install for the user instead of
the project. The skills are also listed on
[skills.sh](https://skills.sh/sanches89/ai-skills).

Without the CLI, clone this repo into your agent's skills folder (e.g.
`~/.claude/skills/`).

Two skills run only when you ask for them by name: `/analyzing-code` and
`/updating-packages`. Their `disable-model-invocation: true` frontmatter field
stops Claude Code, Cursor, and Copilot from starting them on their own. Their
`agents/openai.yaml` does the same in Codex, and their descriptions state the
rule for every other agent.

## Contributing

Rules for writing skills in this repo are in [AGENTS.md](AGENTS.md),
including the test a word passes before a skill's Terms section or the repo's
glossary defines it.

## License

[MIT](LICENSE)
