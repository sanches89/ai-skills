---
name: agent-docs-audit
description: Audit and compress this repo's AGENTS.md files and docs/refs so they take fewer tokens without losing a rule. Finds rules in the wrong folder, repeated or stale rules, ambiguous wording checked against the code, and reference doc sections the repo does not use. Use when asked to shrink, tidy, dedupe or review AGENTS.md or docs/refs, or after several convention or reference doc changes.
license: MIT
compatibility: Requires Node.js 18 or newer and git, run inside a git repository.
---

# Agent docs audit

The root `AGENTS.md` sets what an `AGENTS.md` and a reference doc may hold,
under "Writing an AGENTS.md" and "Reference docs". Follow this skill to hold
the tree to those rules. Add no rule here: turn a finding that needs a new
rule into an edit to the root `AGENTS.md`.

## Terms

These words have exactly one meaning in this skill.

- **Reference doc**: a file under `docs/refs/<folder>/`. It answers one
  question about the folder's subject and ends with a footer.
- **Footer**: the last block of a reference doc: `---`, a blank line, then
  `Reference:` followed by the URLs of the doc's origin.
- **Origin**: where a piece of information was taken from: a file path with
  line numbers, an identifier, or a URL.
- **Audit**: the procedure of this skill applied to `AGENTS.md` and
  `docs/refs/`. Its script measures word counts against a base ref and
  fails on the checks it can decide.
- **Base ref**, written `<ref>`: the git ref the audit compares sizes
  against. The commit where the last audit landed.
- **Skill directory**, written `<skill-dir>`: the folder holding a `SKILL.md`.

## 1. Measure

Run from the repo root (in Claude Code, `${CLAUDE_SKILL_DIR}` expands to
`<skill-dir>`):

```bash
node <skill-dir>/scripts/audit.mjs --base <ref>
```

Pass the base ref when the request names it. Otherwise omit `--base`: the
default `HEAD` measures this audit's own edits. The script prints words per
`AGENTS.md` and per refs folder against the base ref. It fails on what it can
decide:
- a missing `CLAUDE.md` pair;
- a pointer to a parent file;
- a refs folder no `AGENTS.md` indexes;
- a README that misses a file;
- a missing footer;
- a broken relative link or heading;
- a cited `docs/refs` path that is gone;
- inline URLs and padded tables.
Run `--fix` to rewrite the last two; fix the rest by hand. The script lists
files over 1000 words as notes. Run `--help` for the flags and exit codes.

## 2. AGENTS.md

Read every `AGENTS.md` before editing any: redundancy is only visible across
files. Then, for each rule:

- **Placement.** Find every folder the rule applies to. Move it to the deepest
  folder covering all of them: put a rule for two sibling folders in their
  parent. Move a rule about another package's code to that package: put a
  client-hook rule written in a component package's file with the hooks.
- **Redundancy.** Delete the rule when:
  - a parent or sibling `AGENTS.md` states it;
  - the same file states it twice, as a tree comment and a bullet;
  - a header comment, a lint message, or the types already say it;
  - it describes how something works rather than what to do.
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
  routine work, such as "read before writing any function". Keep only the
  cases the rules in the `AGENTS.md` do not settle.
- **Wording.** Write terse imperative bullets. Keep ADR citations; drop a
  reason the ADR already holds.

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
  cites; the script fails when one goes missing.
- When nothing taken from one page of the origin is left in a reference doc,
  drop that page's URL from the footer.
- Rewrite the folder's `README.md` lines for what each reference doc now
  answers, and name what was left at the origin.
- To add a page from an origin, copy only the sections the repo needs. Write
  one reference doc per section, each with its footer, then run `--fix`.

## 4. Verify and report

- Re-run the script until it exits 0.
- When you removed a pointer to another file on the grounds that it loads
  anyway, confirm it does: read a file in that folder and check which
  `AGENTS.md` or `CLAUDE.md` files the agent loaded with it.
- Report the size table and each rule moved, merged or reworded. Report each
  ambiguity resolved with the code that settled it, and anything left for the
  user to decide. Commit only when asked.
