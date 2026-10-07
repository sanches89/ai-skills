# Report prompt

Step numbers are those of `SKILL.md`.

```
Read the orchestration record: <path of orchestration.md | the
comments on item <identifier> and on its children, and on every
refactor task item under `rounds` and on its children>. Read the target
<task file path | item identifier or URL> and its subtasks. Read
<skill-dir>/references/orchestration-report-template.md and
<skill-dir>/references/quality-checklist.md. Fill the orchestration
report from the orchestration record and from git in <tree>. The
proof is <pass | fail: <command> (<failing check>) | not run>. The
run is blocked by <the cause from Step 4, 5, or 6 | nothing>. Run
every check in the checklist except those under Run, grep helper
included, and fix every failure. Return the report and nothing else.
```
