---
name: disambiguating-text
description: Rewrites a text so that every sentence has one reading, with its meaning kept, and reports each ambiguity resolved. Use when the user wants a document, spec, prompt, rule, or instruction clarified, tightened, or made precise, or says it is vague, misread, confusing, or open to interpretation.
license: MIT
argument-hint: <file path | text>
---

# Disambiguating text

Rewrite one text, the input text, so that every sentence has one reading
and the meaning stays.

The glossary is `GLOSSARY.md` at the repository root, unless the user names
another path. A word passes the entry test when Gate A or Gate B holds.

Gate A, the conflict test. All three hold:
- at one usage at least, a reader can take the word in two ways that lead
  to different actions;
- no word or phrase with one reading fits every usage;
- the sentence around that usage does not settle the reading.

Gate B, the sense test. All three hold:
- the project gives the word a meaning that its ordinary sense and its
  common sense in the project's field do not give;
- no document defines that meaning where the word is used;
- a reader who takes the ordinary sense acts wrongly.

## Terms

These words have one meaning in this skill.

- **Ambiguity**: a passage of the input text with more than one reading, or
  one that breaks a clarity rule.
- **Term**: a word or phrase with an entry in the project's glossary.
- **Undefined word**: a word that passes the entry test and has no glossary
  entry.

## Hard rules

1. **The meaning stays.** Never add, drop, or change a fact or an
   instruction.
2. **Read-only on the project.** Write only the input file, in Step 7. Write
   drafts in a scratch directory outside the repository (in Claude Code,
   the scratchpad directory).
3. **Never ask what research can answer.** Consult the input text, the
   glossary, the code, and the docs the text names first.
4. **Never assume.** When a reading changes the rewrite and research cannot
   settle it, ask the user.
5. **Write nothing outside the scratch directory before the user approves
   the full rewrite** (Step 6).

## Workflow

### Step 1: Load the input text

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in
one each read or command that yields only facts, returned with path and
line.

When the invocation text starts with `from <skill name>:`, that skill
invoked this run, and a file path follows the prefix. The file's content is
the input text. Step 7 writes the rewrite to the file.

Without that prefix, a user invoked this run: read `references/user-run.md`
first.

Record the prose wrap width of the input text: the length of its longest
prose line when lines end before the end of a sentence, else `none`.

### Step 2: Research

**2a. The input text.** Read `references/clarity-rules.md`, then the input
text in full, yourself. Record every ambiguity with its location, its
ambiguity kind, and its readings.

**2b. The glossary.** Read the glossary, when it exists, and every
`## Terms`, `## Definitions`, or `## Glossary` section of the input text.
Read each glossary entry in the form `- **Term**: definition.`, one bullet
per term. Record every term the input text uses with its definition. Run
Gate A on every word a reader can take in two ways. Run Gate B on every word
whose sense in the text differs from its common sense. Record every
undefined word with the readings a reader can take.

**2c. Referents.** For every referent without a name, search the input text,
the code, and the docs the text names for the thing it points at. Record the
name and where it was found.

**2d. Conventions.** When the input text belongs to a project, read its rules
for documents: AGENTS.md, CLAUDE.md, CONTRIBUTING, a style guide. Record the
rules that bind the rewrite: line width, headings, section names, required
words.

**2e. Research notes.** Write a private file in the scratch directory:
1. *Facts*: every ambiguity with its readings and, when settled, the reading
   that holds with the path and line, identifier, or URL that settled it.
2. *Open decisions*: every ambiguity research did not settle, with the
   passage it affects.

### Step 3: Interview

Order the open decisions: passages with two readings, referents,
quantities, terms and names, then wording.

For each open decision:
- State it in one sentence. Quote the passage and its readings.
- Give each reading as an option, worded as the sentence that replaces the
  passage.
- Name the option you recommend.

After each answer, record the decision as a fact in the research notes and
add every new decision the answer creates.

Never ask about:
- a reading the text, the glossary, the code, or the docs settle;
- a rule in `references/clarity-rules.md` with one fix;
- wording that changes no reading.
Continue until no open decision remains.

### Step 4: Rewrite

Rewrite the input text sentence by sentence, in the scratch directory. Apply
the fix of every rule in `references/clarity-rules.md`, with:
- the name found in 2c for a referent without a name;
- the terms decided in Step 3 for a word with two meanings, and the
  glossary's term for a synonym;
- the decision from Step 3 for a banned word, a question, an alternative,
  or a passage with two readings.
Use every term as the glossary defines it. Keep every code block, code span,
URL, and quoted string byte-identical. Keep every heading, its level, and
its order, and never move content between sections. Wrap prose at the width
recorded in Step 1.

### Step 5: Quality check

Run every check in `references/quality-checklist.md`, grep helpers included,
over the draft. Fix every failure. When a failure needs a decision, return to
Step 3 for that decision, then run the checks again.

### Step 6: Approval

Show the complete rewrite in chat, then the clarity report as it stands. Ask
whether the user approves the rewrite as written or wants a change. Apply
each change, run Step 5 again, and ask again until the user approves.

### Step 7: Save

For a file path, write the approved rewrite to that file, unchanged.
Finish with the clarity report:
- *Resolved*: one bullet per ambiguity, at most 2 lines: its ambiguity
  kind, the passage before and after, and what settled it: the path and
  line, identifier, or URL, or the user's answer.
- *Undefined words*: every undefined word, with its readings and the
  reading the rewrite uses, or `None.` when the `writing-glossaries` skill
  defined them all.

Ask nothing else.
