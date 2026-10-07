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
- Medium freedom is a template with parameters: a preferred pattern with some
  variation allowed.
- Test the skill with every model it will run on. A small model shows where
  guidance is missing, and a large one shows where the skill over-explains.
- Teach the approach to a class of problems, not the answer to one instance.
  Templates, constraints, and tool-specific instructions still belong.

## Naming

- The `name` field holds at most 64 characters: lowercase letters, digits, and
  hyphens. No XML tag, and never the words `anthropic` or `claude`.
- Anthropic suggests the gerund form, `processing-pdfs`, and accepts a noun
  phrase, `pdf-processing`, or an action, `process-pdfs`.
- Avoid a vague name such as `helper`, `utils`, or `tools`, and a generic one
  such as `documents`, `data`, or `files`.
- Keep one pattern across a collection. A mixed collection is harder to
  reference, to search, and to read at a glance.
- The name and the description are what the agent reads before it decides to
  trigger a skill, so both say what the skill does.

## Content

- No time-sensitive fact. A rule that holds before one date and not after it
  goes wrong on that date. Keep the current method in the body and an old form
  in a section of its own, marked deprecated with its date.
- One term per concept, used every time: always "field", never "field" in one
  place and "box" in the next. A mix of terms makes the agent parse instead of
  follow.
- Forward slashes in every path, on every platform.
- A reference file over 100 lines opens with its table of contents, so that a
  partial read still shows the whole scope.

## Patterns

- **Gotchas**: environment facts that defy reasonable assumptions, kept in
  `SKILL.md` where they are read before the situation arises. Add one each time
  an agent has to be corrected.
- **Templates**: a concrete structure for required output beats a prose
  description of it. Long or conditional templates go in `assets/` or
  `references/`.
- **Examples**: input and output pairs, when the quality of the output depends
  on seeing the style. Three pairs convey a format better than a description of
  it.
- **Conditional workflow**: a decision point that names the branch to follow,
  with each branch's steps under a heading of its own. A workflow that grows
  large moves to a file that the step names.
- **Checklists**: explicit progress lists for multi-step work with dependencies
  or gates.
- **Validation loops**: do the work, run a validator, fix, repeat until it
  passes.
- **Plan, validate, execute**: for batch or destructive operations, write a
  structured plan, check it against the authoritative data, then run it.
- **Bundled scripts**: when traces show the agent rebuilding the same logic
  every run, write it once under `scripts/`.

## Evaluations

- Build the evaluations before the documentation. Run the agent on three
  representative tasks without the skill, record each failure, and write the
  evaluation that tests it.
- Measure the baseline without the skill, write the least content that passes,
  then iterate against the baseline. The evaluations decide whether the skill
  works.
- Watch how the agent moves through the skill: a file read in an unexpected
  order, a reference it never follows, a file it reads on every run, or a file
  it never opens. Each one names a change: a clearer link, content moved into
  `SKILL.md`, or a file removed.

---

Reference: https://agentskills.io/skill-creation/best-practices,
https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
