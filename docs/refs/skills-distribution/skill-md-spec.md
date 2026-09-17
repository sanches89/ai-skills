# SKILL.md specification

The Agent Skills format that the CLI, skills.sh, and the supporting agents read.

## Folder

```
skill-name/
  SKILL.md          # required: frontmatter + instructions
  scripts/          # optional: executable code
  references/       # optional: documentation loaded on demand
  assets/           # optional: templates, images, data
```

## Frontmatter

| Field | Required | Constraint |
| --- | --- | --- |
| `name` | yes | 1 to 64 characters; lowercase `a-z`, `0-9`, hyphens; no leading, trailing, or double hyphen; equals the folder name |
| `description` | yes | 1 to 1024 characters; what the skill does and when to use it, with the keywords that identify matching tasks |
| `license` | no | A license name or the name of a bundled license file |
| `compatibility` | no | 1 to 500 characters; only when the skill needs a specific product, package, or network access, for example `Requires Node.js 18+ and git` |
| `metadata` | no | String-to-string map for client-specific data; use distinctive key names |

## Progressive disclosure

1. `name` and `description` load at startup for every skill, about 100 tokens.
2. The whole `SKILL.md` body loads on activation. Keep it under 500 lines and about 5000 tokens.
3. Files under `scripts/`, `references/`, `assets/` load only when the instructions send the agent there.

Tell the agent when to read each file, not that files exist: "Read `references/api-errors.md` if the API returns a non-200 status".

## File references

Use relative paths from the skill root: `references/REFERENCE.md`, `scripts/extract.py`. Keep references one level deep from `SKILL.md`.

---

Reference: https://agentskills.io/specification
