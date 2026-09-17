# Writing the description

The description is the only thing an agent reads before deciding to load a
skill. Too narrow and it never triggers; too broad and it triggers on the wrong
tasks.

## Rules

- Imperative phrasing: "Use when the user..." rather than "This skill does...".
- Describe the user's intent, not the skill's mechanics.
- Be pushy: list the contexts where it applies, including ones where the user
  does not name the domain.
- A few sentences. The hard limit is 1024 characters.
- Agents skip skills for one-step requests they can do with basic tools.
  Descriptions matter most for specialized workflows.

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

---

Reference: https://agentskills.io/skill-creation/optimizing-descriptions
