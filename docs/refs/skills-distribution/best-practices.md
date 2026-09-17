# Authoring best practices

## Ground the skill in real expertise

- Extract from a task done by hand with an agent: the steps that worked, the
  corrections made, the input and output formats, the context the agent lacked.
- Synthesize from project artifacts: runbooks, style guides, schemas, review
  comments, issue history, fixes. Project-specific material beats generic
  articles.
- Run the skill on real tasks and feed every result back, not only failures.
  Read execution traces: wasted steps point at vague instructions, instructions
  that do not apply, or too many options without a default.

## Spend context on what the agent lacks

- For each sentence ask: would the agent get this wrong without it. If not, cut
  it.
- One skill covers one coherent unit of work, like one function. Too narrow
  forces several skills to load for one task; too broad triggers imprecisely.
- Moderate detail wins. Concise stepwise guidance with one working example beats
  exhaustive coverage of edge cases.
- Keep `SKILL.md` under 500 lines. Move detail to `references/` and say when to
  load each file.

## Calibrate control

- Give freedom where several approaches are valid; explain the purpose so the
  agent decides well.
- Be prescriptive where the operation is fragile or the sequence matters: exact
  command, "do not add flags".
- Provide a default with one escape hatch, not a menu of equal options.
- Teach the approach to a class of problems, not the answer to one instance.
  Templates, constraints, and tool-specific instructions still belong.

## Patterns

- **Gotchas**: environment facts that defy reasonable assumptions, kept in
  `SKILL.md` where they are read before the situation arises. Add one each time
  an agent has to be corrected.
- **Templates**: a concrete structure for required output beats a prose
  description of it. Long or conditional templates go in `assets/` or
  `references/`.
- **Checklists**: explicit progress lists for multi-step work with dependencies
  or gates.
- **Validation loops**: do the work, run a validator, fix, repeat until it
  passes.
- **Plan, validate, execute**: for batch or destructive operations, write a
  structured plan, check it against the authoritative data, then run it.
- **Bundled scripts**: when traces show the agent rebuilding the same logic
  every run, write it once under `scripts/`.

---

Reference: https://agentskills.io/skill-creation/best-practices
