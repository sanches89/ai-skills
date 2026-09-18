# AGENTS.md

This repository holds agent skills. Each skill is a folder under `skills/` with
a `SKILL.md` and, when needed, `references/` for templates, checklists, and
rules and `scripts/` for executables. The README lists the skills.

## Words and sentences

These rules hold in every Markdown file of this repository.

- **Entry test.** A word gets a glossary entry only when all three hold: at
  one usage at least, a reader can take it in two ways that lead to different
  actions; no word or phrase with one reading fits every usage; and the
  sentence around that usage does not settle the reading. A word that fails
  the second condition is renamed, never defined. A definition holds no path,
  placeholder, format, list of allowed values, section list, or condition:
  such a fact goes in the instruction that uses it.
- **Glossary.** `GLOSSARY.md` holds the entries for words used in
  `AGENTS.md`, `README.md`, and `docs/refs/`. Create the file with the first
  word that passes the entry test and delete it with the last.
- **Terms.** The Terms section of a `SKILL.md` holds the entries for words
  used in that skill. A skill with no word that passes the entry test has no
  Terms section. A skill never cites `GLOSSARY.md` or another skill. A word
  defined in two skills, or in a skill and the glossary, has the same
  definition text in each place.
- **One word, one meaning.** A word has one meaning in the whole repository.
  When two things need the same word, give each a fixed qualifier and never
  write the bare word: `Context section` and `context window`, never
  `context` alone.
- **One name per thing.** Name a thing by one technical name and use that name
  every time. Never a synonym.
- **Sentences.** At most 25 words per sentence. An instruction is one command
  in the active voice with one action.
- **No ambiguity.** No open questions, no assumptions, no alternatives left to
  the reader. A banned word never appears in an instruction. The banned words
  are `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`, `possibly`,
  `perhaps`, `ideally`, `consider`, `could`, `should we`, `if needed`,
  `if necessary`, `as appropriate`, `as needed`, `etc`, `and so on`,
  `or similar`, and `something like`.

## Rules for every skill

- **Agent-agnostic.** A skill works in any coding agent that loads `SKILL.md`
  files. Name a feature of one agent only as an aside in prose that other
  agents can skip. Never name it in a command or in a step another agent
  cannot follow. Examples of agent-specific features: Claude Code's
  `${CLAUDE_SKILL_DIR}`, `$ARGUMENTS`, `AskUserQuestion`, the `Explore`
  subagent, `ToolSearch`, the `Skill` tool, the scratchpad directory.
- **Self-contained.** A skill cites only files inside its own folder. Never
  link to another skill's files. When two skills need the same content,
  duplicate it and keep the copies identical.
- **Frontmatter.** `name` equals the folder name: lowercase letters, digits,
  and single hyphens, at most 64 characters. `description` says what the skill
  produces and when to use it. It has two or three sentences, at most 1024
  characters, and nothing about how the skill works internally. Every skill
  sets `license: MIT`. The format also allows `compatibility` and
  `metadata`. Any other field, like `argument-hint`, must be one that agents
  without it ignore.
- **Size.** `SKILL.md` stays under 500 lines. Detail goes to `references/`,
  and the instruction that cites a file there says when to read it.
- **Line width.** Every Markdown line outside frontmatter is at most 80
  characters. Wrap prose with a hanging indent under list markers. Write wide
  tables as lists. Split a long command in a code block with `\` line
  continuations or repeated `-e` patterns. Frontmatter values stay on one
  line however long: Claude Code's frontmatter parser does not read YAML
  block scalars, so a folded `description` breaks discovery there.
- **Scripts.** Instructions invoke a script as `<skill-dir>/scripts/<file>` and
  define `<skill-dir>` as the folder holding the `SKILL.md`. A skill with a
  script names its runtime and tools in the `compatibility` frontmatter field.

## Distribution

- Keep every skill directly under `skills/`, never in a nested category
  folder, so the path of an installed skill never changes.
- A skill that is not ready sets `metadata.internal: true` in its frontmatter.
- Before committing a layout or frontmatter change, run
  `npx skills add . --list` from the repo root and confirm every skill is found.

## Writing an AGENTS.md

- Only the root has one until a folder needs rules of its own. A rule lives in
  the deepest folder that covers everything it applies to.
- A rule is a terse imperative bullet that says what to do and names the file,
  command, or field it applies to.
- No rule that the code, a lint message, or a type already states, and no
  description of how something works.

## Reference docs

Reference docs live under `docs/refs/<folder>/`, one folder per subject. Each
reference doc answers one question about the subject and keeps only what this
repo uses. It ends with a footer: `---`, a blank line, then `Reference:`
followed by the URLs of the pages it was taken from. Each folder's
`README.md` says what each file answers and names what was left at those
pages.

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
- `task-work` implements a task or subtask and never writes or edits one. It
  reads the section names of the task format and the subtask format, and the
  file layout. Change a section name or the layout in `skills/task-work/` in
  the same commit.
- `task-refactor` restructures code and never changes its behavior. It never
  writes or edits a task or a subtask. It reads the section names of the task
  format and the subtask format, and the file layout. Change a section name or
  the layout in `skills/task-refactor/` in the same commit.
- `glossary` writes the glossary and never edits another document.
  `unambiguity` reads the glossary and never writes it. Both read a glossary
  entry as a bullet `- **Term**: definition.`; change that form in both
  skills in the same commit.
- Each of the two invokes the other by its skill name when the agent has it,
  and works alone when it does not. `agent-docs-audit` invokes both the same
  way. An invocation text from a skill starts with `from <skill name>:`, and
  the invoked skill then skips its own hand-off. Change that form in all three
  skills in the same commit.
- `task-refactor` and `code-analysis` both run the measure tool and make the
  project's test command write its reports. The code block of report
  options in `skills/task-refactor/references/measurement-tools.md` and in
  `skills/code-analysis/references/test-reports.md` must stay identical.
  Change them together and diff them afterwards.

## Workflow in this repo

- Propose the design of a new skill or a structural change to an existing one,
  and get the user's explicit approval before writing files.
- Run `pnpm install` once after cloning so the pre-commit hook in
  `.githooks/` regenerates `CONTEXT-SIZE.md` on every commit.
- Commit and push only when the user asks.

## Checks before committing a skill

1. Run `node skills/agent-docs-audit/scripts/audit.mjs` from the repo root when
   `AGENTS.md`, `CLAUDE.md`, or `docs/refs/` changed, and fix every error it
   reports.
2. Grep the skill for agent-specific tokens and confirm each one sits
   inside an aside. The verb "Explore" in the `task-create` description is
   not a token:

   ```bash
   grep -n -E \
     -e '\$ARGUMENTS|AskUserQuestion|Explore' \
     -e 'ToolSearch|scratchpad|CLAUDE_SKILL_DIR|Skill. tool' \
     skills/<name>/SKILL.md
   ```
3. Run the banned-word grep from the skill's own
   `references/quality-checklist.md`, when it has one, over its `SKILL.md` and
   `references/`. Hits are allowed only in lines that quote the banned words as
   a rule.
4. Run `node --check` on every file under `scripts/`.
5. For `task-create` and `task-breakdown`, diff the two task format blocks. For
   `task-work` and `task-refactor`, confirm that every section name printed
   below is a heading in the `## Task` or `## Subtask` block of
   `skills/task-breakdown/references/task-template.md`:

   ```bash
   cat skills/task-work/SKILL.md skills/task-refactor/SKILL.md | tr '\n' ' ' \
     | grep -oE '\b[A-Z][a-z]+( [a-z]+)? section\b' | sort -u
   ```
6. List every word with two definition texts across `GLOSSARY.md`, when it
   exists, and the Terms sections. Every word printed is a failure:

   ```bash
   awk 'FNR == 1 { t = (FILENAME == "GLOSSARY.md") }
        /^## / { if (e) print e; e = "" }
        FILENAME != "GLOSSARY.md" && /^## Terms/ { t = 1; next }
        FILENAME != "GLOSSARY.md" && /^## / { t = 0 }
        /^- \*\*/ { if (e) print e; e = ""; if (t) e = $0; next }
        e && /^  / { sub(/^ +/, " "); e = e $0; next }
        END { if (e) print e }' $(ls GLOSSARY.md 2>/dev/null) \
        skills/*/SKILL.md \
     | sort -u | sed -E 's/^- \*\*([^*]+)\*\*.*/\1/' | uniq -d
   ```
7. Confirm no Markdown line exceeds 80 characters:

   ```bash
   awk 'FNR == 1 && /^---$/ { fm = 1; next }
        fm && /^---$/ { fm = 0; next }
        !fm && length > 80 { print FILENAME ":" FNR }' \
     $(git ls-files -co --exclude-standard '*.md')
   ```
8. List every sentence over 25 words. A code span counts as one word. A
   heading, a list marker, and a table row start a new sentence. Every line
   printed is a failure:

   ```bash
   for f in $(git ls-files -co --exclude-standard '*.md'); do
     awk 'FNR == 1 && /^---$/ { fm = 1; next } fm && /^---$/ { fm = 0; next }
          /^```/ { c = !c; next } fm || c || !NF { next }
          /^#|^ *[-*] |^\|/ { print "." } { print }' "$f" \
       | tr '\n' ' ' | sed -E 's/`[^`]*`/X/g' | tr '.!?;:' '\n\n\n\n\n' \
       | awk -v f="$f" 'NF > 25 { print f ": " $0 }'
   done
   ```
9. For `task-refactor` and `code-analysis`, diff the two code blocks of
   report options. Any output is a failure:

   ```bash
   diff <(awk '/^# Node.js test runner/,/^```$/' \
            skills/task-refactor/references/measurement-tools.md) \
        <(awk '/^# Node.js test runner/,/^```$/' \
            skills/code-analysis/references/test-reports.md)
   ```
