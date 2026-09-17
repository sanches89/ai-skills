# ai-skills

AI skills for development work.

A collection of agent skills that extend AI coding assistants with reusable, task-specific capabilities. Every skill is agent-agnostic: it works in any coding agent that loads `SKILL.md` files.

## Skills

| Skill | What it does |
| --- | --- |
| [task-create](skills/task-create/SKILL.md) | Explores an idea by researching code, docs, and MCP servers, interviews you one question at a time, and writes one precise task with no assumptions or open questions. |
| [task-breakdown](skills/task-breakdown/SKILL.md) | Takes a task from a project-management item, a task file, or text and splits it into commit-sized subtasks, each self-contained with one verification command. |
| [agent-docs-audit](skills/agent-docs-audit/SKILL.md) | Audits and compresses a repo's `AGENTS.md` files and `docs/refs` so they cost less context without losing a rule. |

task-create and task-breakdown form a pipeline: the first writes `docs/tasks/###-<task-slug>/task.md`, the second adds `docs/tasks/###-<task-slug>/###-<subtask-slug>.md` next to it. With a project-management MCP server connected, both write items there instead.

## Structure

Each skill lives in its own directory with a `SKILL.md` describing when and how it should be used.

```
skills/
  <skill-name>/
    SKILL.md          # frontmatter (name, description) + instructions
    references/       # templates and checklists the instructions cite
    scripts/          # executables the instructions run
```

## Usage

Install with the `skills` CLI, which supports Claude Code, Codex, Cursor, and other agents:

```bash
npx skills add sanches89/ai-skills
```

Add `--skill <name>` to pick one skill, `-a <agent>` to pick an agent, and `-g` to install for the user instead of the project. The skills are also listed on [skills.sh](https://skills.sh/sanches89/ai-skills).

Without the CLI, clone this repo into your agent's skills folder (e.g. `~/.claude/skills/`).

## Contributing

Rules for writing skills in this repo are in [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE)
