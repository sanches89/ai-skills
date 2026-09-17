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

The CLI symlinks each agent's skill folder to one canonical copy, so an update
lands once.

- Project scope, the default: `./<agent folder>/skills/<name>`, for Claude Code
  `./.claude/skills/<name>`.
- Global scope, with `-g`: `~/<agent folder>/skills/<name>`, for Claude Code
  `~/.claude/skills/<name>`.

---

Reference: https://github.com/vercel-labs/skills
