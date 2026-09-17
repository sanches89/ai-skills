# Repository layout for discovery

The `skills` CLI takes a repository and scans it for `SKILL.md` files. A
repository is `owner/repo`, a git URL, a direct path to a skill inside a repo,
or a local path.

## Scan depth

The walk under `skills/` goes three levels deep, so
`skills/<category>/<name>/SKILL.md` is found too. A `SKILL.md` at a
shallower level shadows anything nested below it. This repo stays flat,
`skills/<name>/SKILL.md`, so the path of an installed skill never changes.

## Hiding a skill

```yaml
metadata:
  internal: true
```

An internal skill is skipped by discovery and by `--list`. It is visible only
when the user sets `INSTALL_INTERNAL_SKILLS=1`. Use it for work in progress.

## Where installs land

Verified with the CLI against this repo:

- Project install: the skill is copied into the agent's project folder, for
  Claude Code `./.claude/skills/<name>`.
- `-g`: the same layout under the home directory, for Claude Code
  `~/.claude/skills/<name>`.

---

Reference: https://github.com/vercel-labs/skills
