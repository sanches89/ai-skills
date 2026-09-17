---
name: agent-docs-audit
description: Audit and compress this repo's AGENTS.md files and docs/refs so they cost less context without losing a rule. Finds rules in the wrong folder, repeated or stale rules, ambiguous wording checked against the code, and reference sections the repo does not use. Use when asked to shrink, tidy, dedupe or review AGENTS.md or docs/refs, or after several convention or reference changes.
license: MIT
compatibility: Requires Node.js 18 or newer and git, run inside a git repository.
---

# Agent docs audit

What an `AGENTS.md` and a reference may hold is set in the root `AGENTS.md`,
under "Writing an AGENTS.md" and "Reference docs". This skill is the
procedure for holding the tree to those rules. It adds none: a finding that
needs a new rule is an edit to the root `AGENTS.md`.

## 1. Measure

From the repo root, with `<skill-dir>` being the folder that holds this
`SKILL.md` (in Claude Code, `${CLAUDE_SKILL_DIR}` expands to it):

```bash
node <skill-dir>/scripts/audit.mjs --base <ref>
```

`<ref>` is the commit where the last audit landed, when the request names
it. Otherwise omit `--base`: the default `HEAD` measures this audit's own
edits. The script prints words per `AGENTS.md` and per refs folder against
`<ref>`, and fails on what it can decide: a missing `CLAUDE.md` pair, a
pointer to a parent file, a refs folder no `AGENTS.md` indexes, a README
that misses a file, a missing source footer, a broken relative link or
heading, a cited `docs/refs` path that is gone, inline URLs and padded
tables. `--fix` rewrites the last two; fix the rest by hand. Files over 1000
words are listed as notes. `--help` lists the flags and exit codes.

## 2. AGENTS.md

Read every `AGENTS.md` before editing any: redundancy is only visible across
files. Then, for each rule:

- **Placement.** Find every folder the rule applies to. It moves to the
  deepest folder covering all of them: a rule for two sibling folders goes
  in their parent. A rule about another package's code moves to that
  package (a client-hook rule written in a component package's file belongs
  with the hooks).
- **Redundancy.** Delete it when a parent or sibling states it, the same
  file states it twice (a tree comment and a bullet), a header comment, a
  lint message or the types already say it, or it describes how something
  works rather than what to do.
- **Ambiguity.** Check every claim against the code, never the wording:
  - every path, script, flag, command, export and builder named exists
    (`git ls-files`, `git grep`);
  - "only", "every", "alone" and counts hold across the usages;
  - a referent without a name ("calls two helpers") is replaced by the
    names;
  - a list of triggers ("adds, moves or renames") covers the cases the
    tooling reacts to, deletes included;
  - a mixed and/or condition gets explicit grouping;
  - an example still matches what the code does.
- **Triggers.** A line that sends the agent to a reference file on routine
  work ("read before writing any function") is narrowed to the cases the
  rules in the `AGENTS.md` do not settle.
- **Wording.** Terse imperative bullets. Keep ADR citations; drop a reason
  the ADR already holds.

Never drop a rule to save words. Keep a list of every rule moved, merged or
reworded, for the report.

## 3. docs/refs

For each folder changed since `<ref>`, or all of them when asked:

- Find what the repo uses: read the `AGENTS.md` line that indexes the folder,
  then `git grep` the code it serves for the APIs, options and flags each
  section covers.
- Cut sections and files the repo does not use. A section documenting an
  alternative the repo rejected stays only when the README says so, cut to
  what that choice needs.
- Never move or delete a file that code, an ADR or an `AGENTS.md` cites; the
  script fails when one goes missing.
- When a whole source is cut from a file, drop its link from the footer.
- Rewrite the folder's `README.md` lines for what each file now answers, and
  name what was left at the source.
- Adding a source: copy only the sections needed, one file per section, with
  its `Reference:` footer, then run `--fix`.

## 4. Verify and report

- Re-run the script until it exits 0.
- When a pointer to another file was removed on the grounds that it loads
  anyway, confirm it does: read a file in that folder and check which
  `AGENTS.md` or `CLAUDE.md` files the agent loaded with it.
- Report the size table, each rule moved, merged or reworded, each ambiguity
  resolved with the code that settled it, and anything left for the user to
  decide. Commit only when asked.
