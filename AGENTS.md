# AGENTS.md

This repository holds agent skills. Each skill is a folder under `skills/` with
a `SKILL.md` and, when needed, `references/` for templates and checklists and
`scripts/` for executables. The README lists the skills.

## Rules for every skill

- **Agent-agnostic.** A skill must work in any coding agent that loads
  `SKILL.md` files. A feature of one agent may be named only as an aside in
  prose that other agents can skip, never in a command or in a step another
  agent cannot follow. Examples of agent-specific features: Claude Code's
  `${CLAUDE_SKILL_DIR}`, `$ARGUMENTS`, `AskUserQuestion`, the `Explore`
  subagent, `ToolSearch`, the scratchpad directory.
- **Self-contained.** A skill cites only files inside its own folder. Never link
  to another skill's files. When two skills need the same content, duplicate it
  and keep the copies identical.
- **Unambiguous.** A skill that gives a word a special meaning defines it in
  a Terms section of its `SKILL.md`, and no word carries two meanings. No open
  questions, no assumptions, no alternatives left to the reader. Banned in
  instructions: `TBD`, `maybe`, `might`, `probably`, `possibly`, `perhaps`,
  `ideally`, `consider`, `could`, `if needed`, `if necessary`, `as appropriate`,
  `as needed`, `etc`, `and so on`, `or similar`, `something like`.
- **Frontmatter.** `name` equals the folder name, lowercase letters, digits, and
  single hyphens, at most 64 characters. `description` says what the skill
  produces and when to use it, in two or three sentences, at most 1024
  characters, and nothing about how it works internally. Every skill sets
  `license: MIT`. Other fields the format allows: `compatibility` and
  `metadata`. Any other field, like `argument-hint`, must be one that agents
  without it ignore.
- **Size.** `SKILL.md` stays under 500 lines. Detail goes to `references/`, and
  the instruction that cites a reference file says when to read it.
- **Line width.** Every Markdown line outside frontmatter is at most 80
  characters. Wrap prose with a hanging indent under list markers. Write wide
  tables as lists. Split a long command in a code block with `\` line
  continuations or repeated `-e` patterns. Frontmatter values stay on one
  line however long: Claude Code's frontmatter parser does not read YAML
  block scalars, so a folded `description` breaks discovery there.
- **Scripts.** Instructions invoke a script as `<skill-dir>/scripts/<file>` and
  define `<skill-dir>` as the folder holding the `SKILL.md`. A skill with a
  script names its runtime and tools in the `compatibility` frontmatter field.
- **Questions to the user**, from a skill or from an agent working in this
  repo, are plain chat text, one question per message, in the Question format
  used by `skills/task-create/SKILL.md`. Never use an agent's built-in
  question or form tool.

## Distribution

The skills are installed with the `skills` CLI and listed on skills.sh. Both are
documented under `docs/refs/skills-distribution/`.

- The CLI scans `skills/<name>/SKILL.md`, at most three levels deep. Keep every
  skill directly under `skills/`, never in a nested category folder, so paths
  stay stable for people who already installed them.
- A skill that is not ready sets `metadata.internal: true` in its frontmatter.
  The CLI hides it until the user opts in.
- A skill is listed on skills.sh automatically when someone runs
  `npx skills add sanches89/ai-skills`. There is nothing to submit.
- Before committing a layout or frontmatter change, run
  `npx skills add . --list` from the repo root and confirm every skill is found.

## Writing an AGENTS.md

- Only the root has one until a folder needs rules of its own. A rule lives in
  the deepest folder that covers everything it applies to.
- A rule is a terse imperative bullet that says what to do and names the file,
  command, or field it applies to.
- No rule that the code, a lint message, or a type already states, and no
  description of how something works.
- Every `AGENTS.md` has a `CLAUDE.md` beside it that reads exactly
  `@AGENTS.md`.

## Reference docs

Reference material lives under `docs/refs/<folder>/`, one folder per subject,
and follows the rules the `agent-docs-audit` skill checks:

- Each folder has a `README.md` that links every file in it and says what each
  answers, and names what was left at the source.
- Each file answers one question about the subject, keeps only what this repo
  uses, and ends with a footer of the form `---`, blank line,
  `Reference: <source URLs>`.
- Prose holds no inline links whose text already names the target; the URLs live
  in the footer. Tables are not padded for alignment.
- Every folder is indexed by a line in this file.

Folders:

- `docs/refs/skills-distribution/`: the `skills` CLI, repository layout for
  discovery, listing on skills.sh, the `SKILL.md` specification, authoring best
  practices, descriptions, and scripts. Read `repository-layout.md` and
  `skill-md-spec.md` before changing folder structure or frontmatter. Read
  `best-practices.md` and `descriptions.md` before writing a new skill. Read
  `scripts.md` before adding a script.

## Skills that depend on each other

- `task-create` writes one task and never writes subtasks. `task-breakdown`
  writes subtasks for a task and never creates a task from an idea.
- Both use one task format. The code block in
  `skills/task-create/references/task-template.md` and the `## Task` block in
  `skills/task-breakdown/references/task-template.md` must stay identical except
  for the Subtasks section. Change them together and diff them afterwards.
- Both share the file layout `docs/tasks/###-<task-slug>/task.md` and
  `docs/tasks/###-<task-slug>/###-<subtask-slug>.md`, with the numbering rule
  stated in each `SKILL.md`. A change to the layout is made in both skills in
  the same commit.

## Workflow in this repo

- Propose the design of a new skill or a structural change to an existing one,
  and get the user's explicit approval before writing files.
- Commit and push only when the user asks.

## Checks before committing a skill

1. Run `node skills/agent-docs-audit/scripts/audit.mjs` from the repo root when
   `AGENTS.md`, `CLAUDE.md`, or `docs/refs/` changed, and fix every error it
   reports.
2. Grep the skill for agent-specific tokens and confirm each one sits
   inside an aside:

   ```bash
   grep -n -E \
     -e '\$ARGUMENTS|AskUserQuestion|Explore' \
     -e 'ToolSearch|scratchpad|CLAUDE_SKILL_DIR' \
     skills/<name>/SKILL.md
   ```
3. Run the banned-word grep from the skill's own
   `references/quality-checklist.md`, when it has one, over its `SKILL.md` and
   `references/`. Hits are allowed only in lines that quote the banned words as
   a rule.
4. Run `node --check` on every file under `scripts/`.
5. For `task-create` and `task-breakdown`, diff the two task format blocks.
6. Confirm no Markdown line exceeds 80 characters:

   ```bash
   awk 'FNR == 1 && /^---$/ { fm = 1; next }
        fm && /^---$/ { fm = 0; next }
        !fm && length > 80 { print FILENAME ":" FNR }' $(git ls-files '*.md')
   ```
