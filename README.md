# ai-skills

AI skills for development work.

A collection of agent skills that extend AI coding assistants with reusable,
task-specific capabilities. Every skill is agent-agnostic: it works in any
coding agent that loads `SKILL.md` files.

## Skills

- [task-create](skills/task-create/SKILL.md): explores an idea by researching
  code, docs, and MCP servers, then interviews you. It writes one precise task
  with no assumptions or open questions.
- [task-breakdown](skills/task-breakdown/SKILL.md): takes a task from a
  project-management item, a task file, or text and splits it into commit-sized
  subtasks. Each subtask is self-contained and has one verification command.
- [task-work](skills/task-work/SKILL.md): implements a task or subtask within
  the scope set by its parent tasks and proves every acceptance criterion. It
  returns a short work report with only what the rest of the work needs.
- [task-refactor](skills/task-refactor/SKILL.md): reviews code in any
  language for refactoring, with duplication, complexity, unit tests, and
  coverage measured. It writes a refactor task with one subtask per
  refactoring, each with its tests and one verification command, and changes
  no code.
- [agent-docs](skills/agent-docs/SKILL.md): holds the rules for a repo's
  `AGENTS.md` files, READMEs, ADRs, `docs/refs`, and glossary, which the
  agent follows whenever it edits one. On request, it audits and compresses
  them without losing a rule. With the glossary and unambiguity skills, it
  also defines every term once and rewrites the wording.
- [glossary](skills/glossary/SKILL.md): finds the words that a project's
  documents use with two readings that no other word settles. It also finds
  the words they use in a sense a reader would not take from the word alone.
  It writes
  the glossary that defines each of them once and reports where the documents
  disagree with it.
- [unambiguity](skills/unambiguity/SKILL.md): rewrites one text so that every
  sentence has one reading, with its meaning unchanged. It reports each
  ambiguity it resolved and each word that needs a glossary entry.
- [package-update](skills/package-update/SKILL.md): updates every dependency
  in every `package.json` of a repository to the highest version that the
  project's install, build, lint, type check, and tests accept. It changes
  only manifests and lockfiles and returns a short update report with what
  moved, what stayed, and why.
- [code-analysis](skills/code-analysis/SKILL.md): measures a repository's
  duplication, complexity, hotspots, unit tests, coverage, and mutation
  score, and reads the code behind every number. With a base branch, it
  compares the current branch with it. It returns a measurement report with
  ranked findings and changes no code.

The task-* skills form a pipeline. task-create writes
`docs/tasks/###-<task-slug>/task.md`. task-breakdown adds
`docs/tasks/###-<task-slug>/###-<subtask-slug>.md` next to it. task-refactor
writes both from a code review. task-work implements a task or one subtask
from those files. With a project-management MCP server connected, the writers
create items there instead, unless you ask for files, and task-work reads
them. Each skill ends with the input of the next, so these sequences work
without an edit in between:

1. an idea, then task-create, task-breakdown, and task-work;
2. an idea, then task-create and task-work, when the task is one commit;
3. code, then task-refactor and task-work;
4. task-work, then task-refactor on the same task, then task-work on the
   refactor task, to clean up after a feature;
5. task-refactor, then task-breakdown, then task-work, for a different split
   of the refactor task;
6. code-analysis, then task-refactor or task-create on a finding.

glossary and unambiguity form a pair: the first writes the glossary, and the
second rewrites a document with the glossary's terms.

package-update works alone. It leaves a major version that needs a code change
for task-create to turn into a task.

code-analysis works alone and changes no code. A finding it reports is input
for task-create or task-refactor.

## Structure

Each skill lives in its own directory with a `SKILL.md` describing when and how
it should be used.

```
skills/
  <skill-name>/
    SKILL.md          # frontmatter (name, description) + instructions
    references/       # templates, checklists, and rules the skill cites
    scripts/          # executables the instructions run
```

## Usage

Install with the `skills` CLI, which supports Claude Code, Codex, Cursor, and
other agents:

```bash
npx skills add sanches89/ai-skills
```

Add `--skill <name>` to pick one skill, `-a <agent>` to pick an agent, and `-g`
to install for the user instead of the project. The skills are also listed on
[skills.sh](https://skills.sh/sanches89/ai-skills).

Without the CLI, clone this repo into your agent's skills folder (e.g.
`~/.claude/skills/`).

In Claude Code, two skills run only when you type their command:
`/code-analysis` and `/package-update`. Their
`disable-model-invocation: true` frontmatter field stops the agent from
starting them on its own. An agent that does not support that field starts
them from their descriptions, like the other skills.

## Contributing

Rules for writing skills in this repo are in [AGENTS.md](AGENTS.md),
including the test a word passes before a skill's Terms section or the repo's
glossary defines it.

## License

[MIT](LICENSE)
