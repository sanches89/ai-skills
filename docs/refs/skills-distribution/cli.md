# The skills CLI

Runs with `npx skills`. No install step.

## Install from this repo

```bash
npx skills add sanches89/ai-skills
npx skills add sanches89/ai-skills --skill task-create task-breakdown
npx skills add sanches89/ai-skills --skill '*' -a claude-code codex -y
npx skills add . --list
```

- `-s, --skill <names...>`: install these skills; `'*'` means all.
- `-a, --agent <agents...>`: target these agents, for example `claude-code`,
  `codex`, `cursor`.
- `-g, --global`: install to the user directory instead of the project.
- `-y, --yes`: skip confirmation prompts.
- `-l, --list`: list the skills the source offers without installing.

## Update installed skills

```bash
npx skills update                # every installed skill
npx skills update task-create    # one skill
```

`-g` limits it to global installs, `-p` to project installs, `-y` skips the
scope prompt.

## Telemetry

`skills add` sends anonymous install counts, which is what ranks the skills.sh
leaderboard. `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1` turns it off.

---

Reference: https://github.com/vercel-labs/skills, https://skills.sh/docs/cli
