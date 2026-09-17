# Repository layout for discovery

The `skills` CLI resolves a source (`owner/repo`, a git URL, a direct path to a
skill inside a repo, or a local path) and scans it for `SKILL.md` files.

## Scanned locations

- The repo root, when it holds a `SKILL.md`.
- `skills/`, plus `skills/.curated/`, `skills/.experimental/`,
  `skills/.system/`.
- The agent-specific folders such as `.agents/skills/` and `.claude/skills/`.
- Skills declared in `.claude-plugin/marketplace.json` or
  `.claude-plugin/plugin.json`.

The walk goes three levels deep, so `skills/<category>/<name>/SKILL.md` is found
too, and a `SKILL.md` at a shallower level shadows anything nested below it.
This repo stays flat, `skills/<name>/SKILL.md`, so the path of an installed
skill never changes.

## Hiding a skill

```yaml
metadata:
  internal: true
```

An internal skill is skipped by discovery and by `--list`. It is visible only
when the user sets `INSTALL_INTERNAL_SKILLS=1`. Use it for work in progress.

## Where installs land

Verified with the CLI against this repo:

- One target agent: the skill is copied straight into that agent's project
  folder, for Claude Code `./.claude/skills/<name>`.
- Several target agents: one canonical copy goes to `./.agents/skills/<name>`
  and each agent's folder gets a symlink to it, so an update lands once.
  `--copy` copies into every agent folder instead.
- `-g` uses the same layout under the home directory, for Claude Code
  `~/.claude/skills/<name>`.

---

Reference: https://github.com/vercel-labs/skills
