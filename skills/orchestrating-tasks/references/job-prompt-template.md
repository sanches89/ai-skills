# Job prompt template

Replace every `<placeholder>` and keep every other line.

Rules for filling:

- `a | b` on a template line means: write a or b, never both.
- Copy a fact word for word from the plan. Name real things: paths, symbols,
  commands, identifiers.
- The single word `None.` under a heading with nothing to list.

---

## Prompt

```
Invoke the `implementing-tasks` skill (in Claude Code, with the `Skill`
tool) with `from orchestrating-tasks: <task file path | subtask file path
| item identifier or URL>`. Return its work report as the final message
and nothing else.

Working tree: <absolute path of the tree>
Branch: <branch name> | none: no git repository

Make every change and run every command in the working tree above.

Commit: <one commit for this target on the branch above, by the project's
conventions, when the result is done | none: no git repository>
Never push, open a pull request, change an item's status, or comment on
an item.

Facts from earlier subtasks of this task. Each holds over the task text:
- <job number>: <fact, copied from a work report> | <number or
  identifier>: done
- <... | None.>

Ask nothing.
```
