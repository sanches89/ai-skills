# The skills CLI

Runs with `npx skills`. No install step.

## Install from this repo

```bash
npx skills add sanches89/ai-skills
npx skills add sanches89/ai-skills --skill task-create task-breakdown
npx skills add sanches89/ai-skills --skill '*' -a claude-code codex
npx skills add . --list
```

- `-s, --skill <names...>`: install these skills; `'*'` means all.
- `-a, --agent <agents...>`: target these agents, for example `claude-code`,
  `codex`, `cursor`.
- `-g, --global`: install to the user directory instead of the project.
- `-l, --list`: list the skills the repository offers without installing.

---

Reference: https://github.com/vercel-labs/skills, https://skills.sh/docs/cli
