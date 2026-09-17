# Scripts in skills

## Referencing scripts

- Paths in `SKILL.md` and in `references/*.md` are relative to the skill root:
  `scripts/validate.sh`. The convention assumes the agent runs commands from the
  skill directory.
- Name each script in `SKILL.md` with one line on what it does, then give the
  exact command in the step that uses it.
- A script that must run from another directory, such as the repository it
  audits, says so and names the skill directory explicitly. This repo writes
  `<skill-dir>/scripts/<file>` and defines `<skill-dir>` as the folder holding
  the `SKILL.md`.
- Prerequisites such as Node.js or git go in the `compatibility` frontmatter
  field.

## Designing for agents

- Never prompt interactively. Take input from flags, environment variables, or
  stdin, and fail with a message that names the missing flag and its options.
- Provide `--help` with a short description, flags, and examples.
- Errors say what went wrong, what was expected, and what to try.
- Structured output (JSON, CSV, TSV) on stdout; diagnostics on stderr.
- Idempotent operations, closed input sets, `--dry-run` for destructive work,
  distinct documented exit codes, safe defaults with `--force` for the risky
  path.
- Bound output size; many harnesses truncate tool output past 10 to 30 thousand
  characters.

---

Reference: https://agentskills.io/skill-creation/using-scripts
