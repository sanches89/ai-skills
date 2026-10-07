---
name: writing-glossaries
description: Writes or audits a project's GLOSSARY.md from the words its own documents use with two readings or in a project-only sense, never a glossary of general terms. Use when the user wants the project's terms defined or settled, says the docs use one word for two things or a term nobody defined, or asks what a word means in this project.
license: MIT
argument-hint: <glossary path | files to read | words to define>
---

# Writing glossaries

Write the glossary that defines, once each, the words a project's documents use
with two readings or in a project-only sense. Report where other documents
disagree with it.

## Terms

- **Candidate word**: a word research found in the evidence set that has no
  glossary entry yet.
- **Evidence set**: the files research reads for usages.
- **Restatement**: a glossary entry copied into another document, such as a
  `## Terms` section.
- **Term**: a word or phrase with an entry in the project's glossary.
- **Usage**: one occurrence of a word in the evidence set, as path and line.

## Hard rules

1. **Read-only on the project.** Write or delete only the glossary, in Step 7.
   The one exception is the Step 4 reference line, which Step 7 adds to or
   removes from the project's agent instructions. Write drafts in a scratch
   directory outside the repository (in Claude Code, the scratchpad directory).
2. **Never ask what research can answer.** Consult the evidence set, the code,
   and the existing glossary first.
3. **Never assume.** When a definition changes the glossary and research cannot
   settle it, ask the user.
4. **Never edit another document yourself**, beyond the Step 4 reference line. A
   usage that disagrees with the glossary goes in the glossary report. Only the
   `disambiguating-text` skill rewrites a document, when Step 7 invokes it.
5. **Write nothing outside the scratch directory before the user approves the
   full glossary text and that reference line** (Step 6).

## Workflow

### Step 1: State the evidence

When the invocation text starts with `from <skill name>:`, that skill invoked
this run. Take the glossary path after `glossary`, the files after `files`, and
the words after `words`. The evidence set is those files, plus every tracked
Markdown file that uses a term of the existing glossary.

Without that prefix, a user invoked this run: read `references/user-run.md`
first.

Before any research, write one sentence: _Research reads <the files> for usages
of the project's words._ Name the files, or the rule that selects them. Ask one
question: whether that evidence is complete, and which files to add or drop.

### Step 2: Research

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in one
each read or command that yields only facts, returned with path and line.

**2a. Existing glossary.** Read the glossary in full, when it exists. Record
every term, its definition, and its section, or that no glossary exists. Record
whether the repository root has an `AGENTS.md` or a `CLAUDE.md`. Record that
file's reference line, the line that names the glossary's path, when it has one.

**2b. Evidence set.** Read every document in full. Record, with path and line:

- every candidate word:
  - a word whose usages point at two things;
  - a word the project uses in a sense that its ordinary sense and its common
    sense in the project's field do not give;
  - a word that a `## Terms`, `## Definitions`, or `## Glossary` section of a
    document defines;
  - every word named in the invocation text or by the user;
- every synonym pair: two words whose usages point at one thing;
- every usage of every candidate word and of every existing term;
- every restatement: a bullet `- **X**: ...` outside the glossary, where `X` is
  a term of the existing glossary or a candidate word. A candidate word's
  restatement matches the entry Step 4 drafts for it;
- every verbatim third-party excerpt.

A usage inside a verbatim third-party excerpt is evidence of a conflict and
never a rewrite.

**2c. Code.** Search the project's code for each candidate word. Record the
identifier that carries the word and what the code does with it. The definition
matches the code, not the prose.

**2d. Findings.** Run the entry test on every candidate word and every existing
entry. A word passes the entry test when Gate A or Gate B holds.

Gate A, the conflict test. All three hold:

- at one usage at least, a reader can take the word in two ways that lead to
  different actions;
- no word or phrase with one reading fits every usage;
- the sentence around that usage does not settle the reading.

Gate B, the sense test. All three hold:

- the project gives the word a meaning that its ordinary sense and its common
  sense in the project's field do not give;
- no document defines that meaning where the word is used;
- a reader who takes the ordinary sense acts wrongly.

A word that holds every condition of Gate A but the second gets a rename in the
glossary report, never an entry. A word that passes neither gate gets nothing.

Write each finding with its usages:

- a conflict: one word used for two things;
- a synonym pair;
- a candidate word that passes a gate, with the gate;
- an entry, in the glossary or a restatement, that passes neither gate, with the
  gate it comes closest to and the condition it fails;
- a fact of an instruction inside a definition: a path, a placeholder, a format,
  a list of allowed values, a section list, or a condition, with the document
  and line that use it;
- an unused entry: a glossary term that no document uses;
- a mismatch: a restatement whose text differs from the glossary;
- a weak definition: one that breaks a writing rule of Step 4.

**2e. Research notes.** Write a private file in the scratch directory:

1. _Facts_: every candidate word and every finding, with its path and line.
2. _Open decisions_: every decision research did not settle, with the entries it
   affects.

### Step 3: Interview

Order the open decisions: conflicts, synonym pairs, entries to remove, meanings
research did not settle, then sections.

For each open decision:

- State it in one sentence, with the usages that depend on it.
- Give 2 to 4 options grounded in research. For a conflict, offer a qualifier
  per thing and a new word per thing, never the bare word. For a synonym pair,
  offer each word as the one name. For the entries to remove, the entries of 2d
  that pass no gate or are unused, ask one question. It lists each with its gate
  and condition, or the word `unused`: remove all, some by name, or none.
- Name the option you recommend.

After each answer, record the decision as a fact in the research notes and add
every new decision the answer creates.

Never ask about:

- a candidate word that passes neither gate;
- a meaning the documents or the code settle;
- a word with one reading and one name;
- the wording of a settled meaning. Continue until no open decision remains.

### Step 4: Write the glossary

Read `references/glossary-template.md` and fill it, in the scratch directory,
with the words that pass a gate. Read `references/glossary-report-template.md`
and start the glossary report in the scratch directory. Writing rules:

- Start a definition with a noun phrase that says what the thing is.
- Never say how it works, never use its own term, and never use a banned word.
  The grep helper of `references/quality-checklist.md` lists the banned words.
- Write at most two sentences of at most 25 words: what the term is, then a
  boundary or an example.
- Put no fact of an instruction, as 2d lists them, in a definition.
- Give every term one definition, and no definition two meanings.
- Write the retired word of a synonym pair, and the words of a settled conflict,
  in the glossary report, not in the glossary.

When 2a found no glossary, read `references/reference-line.md` and write the
reference line by it.

When no word passes a gate, write no draft and no reference line. Show the
reference line 2a recorded, with its file, under _Instructions_ in the glossary
report. Go to Step 6 with the glossary report alone and ask whether the user
confirms an empty glossary.

### Step 5: Quality check

Run every check in `references/quality-checklist.md`, grep helpers included,
over the draft. Fix every failure. When a failure needs a decision, return to
Step 3 for that decision, then run the checks again.

### Step 6: Approval

Show the complete glossary in chat. Show the Step 4 reference line with its file
and its place in that file. Then show the glossary report as it stands. Ask
whether the user approves the glossary and that line as written or wants a
change. Apply each change, run Step 5 again, and ask again until the user
approves.

### Step 7: Save

Write the approved glossary to its path, unchanged. When Step 4 found no term,
delete the existing glossary instead, and remove the reference line that 2a
recorded. When Step 4 wrote a reference line, add the approved line at the place
Step 4 names. Change nothing else in the file of a reference line.

Finish with the glossary report.

Ask nothing else.
