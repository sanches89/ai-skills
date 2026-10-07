# Writing the description

The description is the only thing an agent reads before deciding to load a
skill. Too narrow and it never triggers; too broad and it triggers on the wrong
tasks.

## Rules

- Imperative phrasing: "Use when the user..." rather than "This skill does...".
- Describe the user's intent, not the skill's mechanics.
- Be pushy: list the contexts where it applies, including ones where the user
  does not name the domain.
- A few sentences. The hard limit is 1024 characters. This repo keeps every
  description to one or two sentences and at most 350 characters, by the
  Frontmatter rule in `AGENTS.md`.
- Agents skip skills for one-step requests they can do with basic tools.
  Descriptions matter most for specialized workflows.
- Third person, always: "Processes Excel files", never "I can help you" or "You
  can use this". The description lands in the system prompt, and a shift of
  person breaks discovery.
- Name the key terms a request holds, because the agent picks one skill out of a
  hundred by the description alone.
- Never summarize the workflow in it. An agent that reads the steps in the
  description follows them and skips the body.

## Before and after

```yaml
description: Process CSV files.
```

```yaml
description: >
  Analyze CSV and tabular data files: compute summary statistics,
  add derived columns, generate charts, and clean messy data. Use this
  skill when the user has a CSV, TSV, or Excel file and wants to
  explore, transform, or visualize the data, even if they don't
  explicitly mention "CSV" or "analysis."
```

The published example folds the value with `>`. This repo keeps every
frontmatter value on one line, by the Line width rule in `AGENTS.md`.

---

Reference: https://agentskills.io/skill-creation/optimizing-descriptions,
https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md,
https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
