# Agent docs audit

Sections: 1. Measure; 2. AGENTS.md; 3. docs/refs; 4. Words and sentences;
5. Verify and report.

Hold every `AGENTS.md` and reference doc to the rules of `SKILL.md`, of
`reference-docs.md`, and the doc rules of the repo's root `AGENTS.md`. Add
no rule here: a finding that needs a new rule becomes an edit to the root
`AGENTS.md`.

## 1. Measure

Run from the repo root, with `<skill-dir>` as `SKILL.md` defines it:

```bash
node <skill-dir>/scripts/audit.mjs --base <ref>
```

`<ref>` is the commit where the last audit landed, when the request names
it. Without one, omit `--base` to compare against `HEAD`. The script prints
words per `AGENTS.md` and per refs folder against the base ref. Run `--fix`
to rewrite inline URLs and padded tables. Fix every other failure by hand.
Run `--help` for the flags and exit codes.

## 2. AGENTS.md

Read every `AGENTS.md` before editing any. Then, for each rule:

- **Placement.** Move the rule to the deepest folder covering every folder it
  applies to. Move a rule about another package's code to that package.
- **Redundancy.** Delete the rule when:
  - a parent or sibling `AGENTS.md` states it;
  - the same file states it twice, as a tree comment and a bullet;
  - a header comment, a lint message, or the types already say it;
  - it describes how something works rather than what to do.
- **Lists.** Join a list of short items into its parent line, comma-separated.
- **Ambiguity.** Check every claim against the code, never the wording:
  - confirm every path, script, flag, command, export and builder named
    exists (`git ls-files`, `git grep`);
  - confirm "only", "every", "alone" and counts hold across the usages;
  - replace a referent without a name ("calls two helpers") by the names;
  - make a list of triggers ("adds, moves or renames") cover the cases the
    tooling reacts to, deletes included;
  - group a mixed and/or condition explicitly;
  - confirm an example still matches what the code does.
- **Triggers.** Narrow a line that sends the agent to a reference doc on
  routine work ("read before writing any function"). Keep only the cases
  the rules in the `AGENTS.md` do not settle.
- **ADRs.** Keep ADR citations; drop a reason the ADR already holds.

Never drop a rule to save words. Keep a list of every rule moved, merged or
reworded, for the report.

## 3. docs/refs

For each folder changed since `<ref>`, or all of them when asked:

- Find what the repo uses: read the `AGENTS.md` line that indexes the folder,
  then `git grep` the code it serves for the APIs, options and flags each
  section covers.
- Cut sections and reference docs the repo does not use. Keep a section
  documenting an alternative the repo rejected only when the README says so,
  cut to what that choice needs.
- Never move or delete a reference doc that code, an ADR or an `AGENTS.md`
  cites.
- When nothing taken from one page of the origin is left in a reference doc,
  drop that page's URL from the footer.
- Rewrite the folder's `README.md` lines for what each reference doc now
  answers, and name what was left at the origin.
- After adding a page from an origin, run `--fix`.

## 4. Words and sentences

Run this section after every cut and move of sections 2 and 3.

- **Glossary.** When the agent has the skill, invoke the `writing-glossaries`
  skill (in Claude Code, with the `Skill` tool) with
  `from writing-agent-docs: glossary <path>, files <every AGENTS.md and every
  reference doc>`. Take `<path>` from the request when it names one, else
  `GLOSSARY.md`. Wait for it to finish: it asks its own questions and
  approval. Without that skill, follow the Glossary section of `SKILL.md`
  for each doc this audit edited. State in the audit report that the other
  docs were not checked against the glossary.
- **Wording.** When the agent has the skill, invoke the `disambiguating-text`
  skill with `from writing-agent-docs: <file path>`. Run it one file at a
  time. Cover every `AGENTS.md` and every reference doc changed since
  `<ref>`. Wait for each run to finish: it asks its own approval. Without
  that skill, change no wording, and state in the audit report that the
  wording was not rewritten.

## 5. Verify and report

- Re-run the script until it exits 0.
- When you removed a pointer to another file on the grounds that it loads
  anyway, confirm it does: read a file in that folder and check which
  `AGENTS.md` or `CLAUDE.md` files the agent loaded with it.
- Report:
  - the size table;
  - each rule moved, merged or reworded;
  - each ambiguity resolved, with the code that settled it;
  - each term added to, changed in, or removed from the glossary;
  - each ambiguity the `disambiguating-text` skill resolved;
  - anything left for the user to decide.
- Commit only when asked.
