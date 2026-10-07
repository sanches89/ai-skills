# AGENTS.md

This repository holds agent skills. Each skill is a folder under `skills/` with
a `SKILL.md` and `evals/` for its test prompts and trigger queries. When needed
it also holds `references/` for templates, checklists, and rules, and `scripts/`
for executables. The README lists the skills.

## Words and sentences

These rules hold in every Markdown file of this repository.

- **Entry test.** A word gets a glossary entry only when Gate A or Gate B holds.
  A word that holds every condition of Gate A but the second is renamed, never
  defined. A definition holds no path, placeholder, format, list of allowed
  values, section list, or condition: such a fact goes in the instruction that
  uses it.
  - Gate A, the conflict test. All three hold: at one usage at least, a reader
    can take the word in two ways that lead to different actions; no word or
    phrase with one reading fits every usage; the sentence around that usage
    does not settle the reading.
  - Gate B, the sense test. All three hold: the project gives the word a meaning
    that its ordinary sense and its common sense in the project's field do not
    give; no document defines that meaning where the word is used; a reader who
    takes the ordinary sense acts wrongly.
- **Glossary.** `GLOSSARY.md` holds the entries for words used in `AGENTS.md`,
  `README.md`, and `docs/refs/`. Create the file with the first word that passes
  the entry test and delete it with the last.
- **Terms.** The Terms section of a `SKILL.md` holds the entries for words used
  in that skill. A skill with no word that passes the entry test has no Terms
  section. A Terms section never cites `GLOSSARY.md` or another skill. A word
  defined in two skills, or in a skill and the glossary, has the same definition
  text in each place.
- **One word, one meaning.** A word has one meaning in the whole repository.
  When two things need the same word, give each a fixed qualifier and never
  write the bare word: `Context section` and `context window`, never `context`
  alone.
- **One name per thing.** Name a thing by one technical name and use that name
  every time. Never a synonym.
- **Sentences.** At most 25 words per sentence. An instruction is one command in
  the active voice with one action.
- **No ambiguity.** No open questions, no assumptions, no alternatives left to
  the reader. A banned word never appears in an instruction. The banned words
  are `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`, `possibly`, `perhaps`,
  `ideally`, `consider`, `could`, `should we`, `if needed`, `if necessary`,
  `as appropriate`, `as needed`, `etc`, `and so on`, `or similar`, and
  `something like`.

## Rules for every skill

- **Agent-agnostic.** A skill works in any coding agent that loads `SKILL.md`
  files. Name a feature of one agent only as an aside in prose that other agents
  can skip. Never name it in a command or in a step another agent cannot follow.
  Examples of agent-specific features: Claude Code's `${CLAUDE_SKILL_DIR}`,
  `$ARGUMENTS`, `AskUserQuestion`, the `Explore` subagent, `ToolSearch`, the
  `Skill` tool, the scratchpad directory.
- **Self-contained.** A skill cites only files inside its own folder. Never link
  to another skill's files. When two skills need the same content, move it into
  one skill and invoke that skill by name from the other.
- **Dependencies.** Invoke another skill by name at the step that needs it.
  Write the invocation as: Invoke the `<name>` skill with
  `from <caller>: <args>`. A long invocation text goes in a fenced block after
  the words "with the text below". Add the aside (in Claude Code, with the
  `Skill` tool) after `skill` in the first invocation of each file. Add it also
  to every invocation inside a subagent prompt. A skill that invokes itself
  leaves its own name out of `compatibility`. `<caller>` is the name of the
  invoking skill. The invoked skill then skips its own hand-off and ends with
  its return block. A required skill has no fallback copy, and the caller's
  `compatibility` names it in the sentence `Requires the <a> and <b> skills`. An
  optional skill runs only when the agent has it, and the caller works alone
  without it.
- **Frontmatter.** `name` equals the folder name: lowercase letters, digits, and
  single hyphens, at most 64 characters. Name a new skill in the gerund form
  `<verb>ing-<object>`, as `creating-tasks` and `analyzing-code`, so that the
  collection keeps one pattern. Never a noun phrase, a bare verb, a vague word
  such as `helper`, or the words `anthropic` and `claude`. `description` says
  what the skill produces, then when to use it. It has one or two sentences and
  at most 350 characters: every description loads at the start of every session.
  It names the requests that call for the skill, including ones that do not name
  its domain, because agents under-trigger on a bare summary. It says nothing
  about how the skill works internally. Every skill sets `license: MIT`. The
  format also allows `compatibility` and `metadata`. `argument-hint` and
  `disable-model-invocation` are the only other fields: Claude Code, Cursor, and
  Copilot read them, every other agent ignores them, and claude.ai upload and
  the Skills API reject them. A skill with `disable-model-invocation` states the
  same rule in its description, so that every agent behaves alike, and holds
  `agents/openai.yaml` with `policy.allow_implicit_invocation: false` for Codex.
- **Size.** `SKILL.md` stays under 500 lines and under 5,000 tokens in
  `CONTEXT-SIZE.md`. Claude Code keeps only the first 5,000 tokens of a skill
  when it compacts the context window. Detail goes to `references/`, and the
  instruction that cites a file there says when to read it. A reference file
  over 100 lines opens with a `Sections:` line that lists its headings,
  separated by semicolons. An agent that reads part of the file then finds the
  rest.
- **Agent readers.** Write skill files for agents alone. Write only what an
  agent acts on, and state each rule once. Write no rationale, no restated rule,
  and no example of a practice agents already know.
- **Subagents.** Every skill except `orchestrating-tasks` holds the
  `**Subagents.**` block at the top of its first step that reads project files
  or runs commands. `writing-agent-docs` has no steps and holds it at the top of
  its Audit section. `orchestrating-tasks` states its stricter hard rule
  instead. Every copy of the block is identical: change it in every skill in the
  same commit.
- **Line width.** Every Markdown line outside frontmatter is at most 80
  characters. Run `pnpm format` after editing Markdown: prettier wraps prose at
  80 columns. Put a code span that does not fit on one line in a fenced block,
  since prettier never splits one. Write tables as lists, since prettier pads
  table cells and the audit script rejects padded rows. Split a long command in
  a code block with `\` line continuations or repeated `-e` patterns.
  Frontmatter values stay on one line however long: Claude Code's frontmatter
  parser does not read YAML block scalars, so a folded `description` breaks
  discovery there.
- **Scripts.** Instructions invoke a script as `<skill-dir>/scripts/<file>` and
  define `<skill-dir>` as the folder holding the `SKILL.md`. A skill with a
  script names its runtime and tools in the `compatibility` frontmatter field.
  Every script has the executable bit set.
- **Hard rules.** Each numbered rule under `## Hard rules` states the rule
  alone, with no sentence on why it exists.
- **Evals.** Every skill holds `evals/evals.json`: three cases of `prompt`,
  `expected_output`, and `files`, in the format of the anthropics/skills
  skill-creator. It also holds `evals/trigger-queries.json`: ten entries of
  `query` and `should_trigger`, five true and five near misses that are false.
  Update both with the description or the step they cover.

## Distribution

- Keep every skill directly under `skills/`, never in a nested category folder,
  so the path of an installed skill never changes.
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
followed by the URLs of the pages it was taken from. Each folder's `README.md`
says what each file answers and names what was left at those pages.

Folders:

- `docs/refs/skills-distribution/`: the `skills` CLI, repository layout for
  discovery, listing on skills.sh, the `SKILL.md` specification, authoring best
  practices, descriptions, and scripts. Read `repository-layout.md` and
  `skill-md-spec.md` before changing folder structure or frontmatter. Read
  `best-practices.md` and `descriptions.md` before writing a new skill. Read
  `scripts.md` before adding a script.

## Skills that depend on each other

- Each shared content has one holder skill. Change it there, and change every
  skill that reads its invocation form or return block in the same commit:
  - `finding-trackers`: the tracker rule and the tracker map;
  - `loading-tasks`: a target, its parent chain, and its subtasks, as the task
    map;
  - `formatting-tasks`: the task format, its writing rules and checks, and the
    code-line count;
  - `saving-tasks`: the tasks directory, the file layout, the numbering rule,
    and the save to the tracker or to files;
  - `finding-dev-commands`: the command map;
  - `writing-clean-code`: the clean code principles;
  - `writing-unit-tests`: the unit test rules, characterization tests included;
  - `measuring-code`: the measure tool, the limits, and the report options;
  - `finding-code-smells`: the smell catalog and the scan script.
- `creating-tasks` writes one task and never writes subtasks.
  `breaking-down-tasks` writes subtasks for a task and never creates a task from
  an idea. `refactoring-code` reviews code and writes one refactor task with one
  subtask per refactoring. It never changes project code and never edits an
  existing task or subtask.
- The file layout is `<tasks-dir>/###-<task-slug>/task.md` and
  `<tasks-dir>/###-<task-slug>/###-<subtask-slug>.md`. `saving-tasks` writes it
  and `loading-tasks` reads it. Change the layout in both in the same commit.
- `loading-tasks`, `saving-tasks`, `creating-tasks`, `breaking-down-tasks`,
  `implementing-tasks`, `orchestrating-tasks`, and `refactoring-code` read the
  section names of `skills/formatting-tasks/references/task-format.md`. Rename a
  section there and in the seven in the same commit.
- `implementing-tasks` implements a task or subtask and never writes or edits
  one. It counts a dependency as done when a caller's fact reads
  `<number or identifier>: done`. `orchestrating-tasks` and the subtask runs of
  `implementing-tasks` write that fact. Change its form in both skills in the
  same commit.
- `orchestrating-tasks` runs the subtasks of a task through
  `implementing-tasks`, one at a time. It never writes or edits a task, a
  subtask, or the title or body of an item. It comments on items and sets their
  status. It reads the headings of the work report in
  `skills/implementing-tasks/references/work-report-template.md`. It reads the
  final line of `refactoring-code` and sends it the `bounds` option. Change any
  of these in `skills/orchestrating-tasks/` in the same commit. It adds one file
  to the layout, `<tasks-dir>/###-<task-slug>/orchestration.md`, which no other
  skill reads.
- End `creating-tasks`, `breaking-down-tasks`, and `refactoring-code` with the
  line `saving-tasks` returns: the task file path or the task item's identifier,
  and nothing else. A failed save ends with a line that starts with `not saved:`
  and names no path and no identifier. `breaking-down-tasks`,
  `implementing-tasks`, and `orchestrating-tasks` take that line as their input
  without an edit. `refactoring-code` with no finding ends instead with a line
  that starts with `No refactor task:`. `breaking-down-tasks` without a task to
  split ends with a line that starts with `No task to break down:`, and on an
  abort with a line that starts with `Aborted:`.
- Two sets of limits exist. `writing-clean-code` holds the budgets for the lines
  a change writes, and for every line of the paths a review names: 20 lines per
  function, 2 parameters, no repeated block of 3 lines. The flagging limits mark
  existing code. Change each one in every file that holds it, in the same
  commit:
  - cyclomatic complexity 10, 50 lines, 4 parameters: `measuring-code` and the
    smell catalog;
  - clones of 5 lines and 50 tokens: `measuring-code`;
  - nesting from 3 levels: `measuring-code`, `finding-code-smells`, the smell
    catalog, `refactoring-rules.md`, and `analysis-rules.md`;
  - a message chain of 2 method calls: the smell catalog, and the same number as
    a budget in `writing-clean-code`;
  - the rule of three for clones: the smell catalog, `refactoring-rules.md`, and
    `analysis-rules.md`;
  - 400 lines per code file: the smell catalog, `finding-code-smells` with its
    scan script, and `refactoring-rules.md`;
  - a parameter object from 3 places: the smell catalog, `refactoring-rules.md`,
    and `analysis-rules.md`.
- The size budget is 500 code lines. It appears in `formatting-tasks`,
  `creating-tasks`, and `breaking-down-tasks`. Change it in the three in the
  same commit.
- `writing-glossaries` writes the glossary, and its reference line in the root
  `AGENTS.md` or `CLAUDE.md`. It never edits another document.
  `disambiguating-text` reads the glossary and never writes it.
- `writing-glossaries`, `disambiguating-text`, and `writing-agent-docs` read a
  glossary entry in the form `- **Term**: definition.`, one bullet per term.
  Each states Gate A and Gate B in the words of the Entry test rule above.
  Change the form or the test in the three skills and here in the same commit.
- `writing-glossaries` and `disambiguating-text` invoke each other as optional
  skills. `writing-agent-docs` invokes both the same way.

## Workflow in this repo

- Propose the design of a new skill or a structural change to an existing one,
  and get the user's explicit approval before writing files.
- Run `pnpm install` once after cloning so the pre-commit hook in `.githooks/`
  formats the staged Markdown files and regenerates `CONTEXT-SIZE.md` on every
  commit.
- Commit and push only when the user asks.

## Checks before committing a skill

1. Run `node skills/writing-agent-docs/scripts/audit.mjs` from the repo root
   when `AGENTS.md`, `CLAUDE.md`, or `docs/refs/` changed, and fix every error
   it reports.
2. Grep the skill's `SKILL.md` and `references/` for agent-specific tokens and
   confirm each one sits inside an aside:

   ```bash
   grep -rn --include='*.md' --exclude-dir=evals -E \
     -e '\$ARGUMENTS|AskUserQuestion|Explore' \
     -e 'ToolSearch|scratchpad|CLAUDE_SKILL_DIR|Skill. tool|Agent. tool' \
     skills/<name>/
   ```

3. Run the banned-word grep from the skill's own
   `references/quality-checklist.md`, when it has one, over its `SKILL.md` and
   `references/`. Hits are allowed only in lines that quote the banned words as
   a rule.
4. Run `node --check` on every file under `scripts/`.
5. For the seven skills that read section names, confirm that every section name
   printed below is a heading in
   `skills/formatting-tasks/references/task-format.md`:

   ```bash
   for s in loading-tasks saving-tasks creating-tasks breaking-down-tasks \
     implementing-tasks orchestrating-tasks refactoring-code; do
     find "skills/$s" -name '*.md' ! -path '*/evals/*' -exec cat {} +
   done | tr '\n' ' ' \
     | grep -oE '\b[A-Z][a-z]+( [a-z]+)? section\b' | sort -u \
     | grep -vE '^(No|What each) section$'
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

8. List every sentence over 25 words. A code span counts as one word. A heading,
   a list marker, and a table row start a new sentence. A colon and a semicolon
   also end one. Every line printed is a failure:

   ````bash
   for f in $(git ls-files -co --exclude-standard '*.md'); do
     awk 'FNR == 1 && /^---$/ { fm = 1; next } fm && /^---$/ { fm = 0; next }
          /^```/ { c = !c; next } fm || c || !NF { next }
          /^#/ { print "."; next }
          /^ *[-*] |^\|/ { print "." } { print }' "$f" \
       | tr '\n' ' ' | sed -E 's/`[^`]*`/X/g' | tr '.!?;:' '\n\n\n\n\n' \
       | awk -v f="$f" 'NF > 25 { print f ": " $0 }'
   done
   ````

9. Confirm every skill that a `compatibility` field requires exists. Every name
   printed is a failure:

   ```bash
   grep -h '^compatibility:' skills/*/SKILL.md \
     | grep -oE 'Requires the [^.]+ skills?\.' | grep -oE '[a-z]+(-[a-z]+)+' \
     | sort -u | while read -r s; do [ -d "skills/$s" ] || echo "$s"; done
   ```

10. Confirm that every copy of the `**Subagents.**` block is the same. A block
    runs from its label to the next blank line. The line printed must be `1`:

    ```bash
    for f in $(grep -l '^\*\*Subagents\.\*\*' skills/*/SKILL.md); do
      awk '/^\*\*Subagents\.\*\*/ { p = 1 } p && /^$/ { exit } p' "$f" \
        | md5sum
    done | sort -u | wc -l
    ```

11. Confirm every description has at most two sentences and 350 characters.
    Every path printed is a failure:

    ```bash
    awk '/^description:/ { sub(/^description: */, "")
         if (length > 350 || gsub(/[.!?]( |$)/, "&") > 2) print FILENAME }' \
      skills/*/SKILL.md
    ```

12. Confirm that `compatibility` names every skill that a step invokes as a
    required skill. Every line printed is a failure, except a line for an
    optional skill. A skill that invokes itself prints no line:

    ```bash
    for f in skills/*/SKILL.md; do
      cat "$f" "${f%SKILL.md}"references/*.md 2>/dev/null | tr -s '\n ' '  ' \
        | grep -oiE 'invoke the `[a-z-]+` skill' \
        | grep -oE '[a-z]+(-[a-z]+)+' | sort -u | while read -r s; do
          [ "skills/$s/SKILL.md" = "$f" ] && continue
          grep -q "^compatibility:.*$s" "$f" || echo "$f: $s"
        done
    done
    ```

13. Confirm every frontmatter key is one the Agent Skills format allows. Every
    key printed must be `argument-hint` or `disable-model-invocation`:

    ```bash
    awk 'FNR == 1 && /^---$/ { fm = 1; next } fm && /^---$/ { nextfile }
         fm && /^[a-z-]+:/ { k = $1; sub(/:$/, "", k)
           if (k !~ /^(name|description|license|compatibility|metadata)$/ &&
               k != "allowed-tools") print FILENAME ": " k }' skills/*/SKILL.md
    ```

14. Confirm every skill has both eval files in the required shape. Every line
    printed is a failure:

    ```bash
    for d in skills/*/; do
      node -e '
        const fs = require("fs"), d = process.argv[1], n = d.split("/")[1];
        const e = JSON.parse(fs.readFileSync(d + "evals/evals.json"));
        const t = JSON.parse(fs.readFileSync(d + "evals/trigger-queries.json"));
        const yes = t.filter((q) => q.should_trigger === true).length;
        if (e.skill_name !== n || e.evals.length !== 3 || t.length !== 10 ||
            yes !== 5) console.log(d);
      ' "$d" 2>&1 | sed "s#^#$d: #"
    done
    ```

15. Confirm every reference file over 100 lines opens with a `Sections:` line,
    and every script has the executable bit. Every path printed is a failure:

    ```bash
    for f in skills/*/references/*.md; do
      [ "$(wc -l < "$f")" -gt 100 ] && ! head -5 "$f" | grep -q '^Sections:' \
        && echo "$f"
    done
    find skills -path '*/scripts/*' -type f ! -perm -u+x
    ```

16. Run `node scripts/context-size.mjs`, then confirm no `SKILL.md` exceeds
    5,000 tokens. Every skill printed is a failure:

    ```bash
    awk -F'|' '/^\| [a-z-]+ +\|/ { gsub(/[ ,]/, "", $4)
         if ($4 + 0 > 5000) print $2 }' CONTEXT-SIZE.md
    ```
