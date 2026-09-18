---
name: glossary
description: Use when the user wants a project's glossary or GLOSSARY.md created, updated, cleaned up, or audited, or says the documents use one word for two things, two words for one thing, or undefined terms. Not for rewriting the documents themselves.
license: MIT
argument-hint: <glossary path | files to cover | words to define>
---

# Glossary

Find the words that a project's documents use with two readings and that no
other word settles. Write the glossary that defines each of them once. Write
only the glossary. Report where the other documents disagree with it. When
the `unambiguity` skill is available, use it to rewrite the documents that
disagree.

The glossary is `GLOSSARY.md` at the repository root, unless the user names
another path. The document set is the files the glossary covers. A term is a
word or phrase with a glossary entry. A candidate is a word that research
found and that has no entry yet. A usage is one occurrence of a word in the
document set, recorded as path and line. A restatement is a glossary entry
copied into another document, such as a `## Terms` section.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   Write, or delete, only the glossary, in Step 7. Write drafts in a scratch
   directory outside the repository (in Claude Code, the session's scratchpad
   directory; in any other agent, the system temp directory).
2. **Never ask what research can answer.** Consult the document set, the
   code, and the existing glossary before the first question.
3. **Never assume.** When a definition changes the glossary and research
   cannot settle it, ask the user.
4. **The entry test.** Give a word an entry only when all three hold:
   - at one usage at least, a reader can take the word in two ways, and the
     two readings lead to different actions;
   - no word or phrase with one reading fits every usage;
   - the sentence around that usage does not settle the reading.
   A word that fails the second condition gets a rename in the glossary
   report, never an entry. A word that fails the first or the third condition
   is obvious: it gets nothing.
5. **A definition says what the term is.** Start it with a noun phrase that
   names the kind of thing. Add a boundary or an example in a second
   sentence at most. Write no banned word, as listed in
   `references/quality-checklist.md`, no description of how the thing works,
   and no definition that uses its own term.
6. **A definition holds no fact of an instruction.** A path, a placeholder,
   a format, a list of allowed values, a section list, or a condition belongs
   in the instruction that uses it. Put such a fact in the glossary report
   with the document and line that use it, never in a definition.
7. **One word, one meaning.** Give every term exactly one definition. Settle
   a conflict, one word used for two things, with a qualifier or a new word
   for each thing: `backend component` and `frontend component`, never
   `component`. Never write a definition that lists two meanings.
8. **One name per thing.** Settle a synonym pair, two words used for one
   thing, on one word. Put the retired word in the glossary report with its
   usages, never in the glossary.
9. **Every entry has a usage.** Define a term only when a document in the set
   uses it. Remove an entry that no document uses, or that fails the entry
   test, after the user confirms.
10. **Never edit another document yourself.** Put a usage that disagrees with
    the glossary in the glossary report, with its path and line. When Step 7
    invokes the `unambiguity` skill, that skill rewrites a document under its
    own rules and approval.
11. **Write nothing before the user approves the full glossary text**
    (Step 6).

## Workflow

### Step 1: Restate the target

- Take the glossary path, the document set, and the words to define from the
  text passed with the skill invocation, or from the conversation. Without a
  path, use `GLOSSARY.md` at the repository root. Without named files, use
  every Markdown file tracked by git. Leave out the files the user excludes.
- When the invocation text starts with `from <skill name>:`, that skill
  invoked this run. Take the glossary path after `glossary`, the files
  after `files`, and the words after `words`. The document set is the set
  named in the glossary's header plus those files, or those files alone when
  no glossary exists. Step 7 invokes no skill.
- Write one sentence in the form: *The glossary at <path> covers <document
  set>.* Name the files, or the rule that selects them.
- Ask the user to confirm or correct that sentence. Do not start research
  until the user confirms it.

### Step 2: Research

Learn everything the documents and the code can tell you, so that you ask the
user only about meanings and choices.

**2a. Existing glossary.** When the glossary exists, read it in full. Record
every term, its definition, and its section.

**2b. Document set.** Read every document in full. Use a read-only subagent
for broad sweeps when the agent offers one (in Claude Code, the `Explore`
subagent); otherwise read directly. Record, with path and line:
- every candidate:
  - a word whose usages point at two things;
  - a word used in a sense that differs from its common sense or from its
    sense in the project's field. Count it only at a usage whose sentence
    does not settle the sense;
  - a word that a `## Terms`, `## Definitions`, or `## Glossary` section of
    a document defines;
  - every word named in the invocation text or by the user;
- every synonym pair: two words whose usages point at one thing;
- every usage of every candidate and of every existing term;
- every restatement: a `## Terms`, `## Definitions`, or `## Glossary`
  section, and every bullet of the form `- **X**: ...` outside the glossary.

**2c. Code.** When the project has code, search it for each candidate. Record
the identifier that carries the word and what the code does with it, so that
the definition matches the code, not the prose.

**2d. Findings.** Run the entry test of hard rule 4 on every candidate and on
every existing entry. Write each finding with its usages:
- a conflict: one word used for two things;
- a synonym pair: two words used for one thing;
- a candidate that passes the entry test;
- an entry, in the glossary or in a restatement, that fails the entry test,
  with the condition it fails;
- a fact of an instruction inside a definition, with the document and line
  that use the fact;
- an unused entry: a term in the glossary that no document uses;
- a mismatch: a restatement whose text differs from the glossary;
- a weak definition: one that uses its own term, holds a banned word, or
  says how the thing works instead of what it is. Also one with more than two
  sentences, or with more than 25 words in one sentence.

**2e. Research notes.** Write the research notes, a private file in the
scratch directory, in two parts:
1. *Facts*: every candidate and every finding, each with the path and line
   it was found at.
2. *Open decisions*: every decision that research did not settle. State for
   each the decision to make and the entries it affects.
Use part 2 to drive Step 3. Do not show the research notes to the user.

### Step 3: Interview

Order the open decisions: conflicts first, then synonym pairs, then entries
to remove, then meanings research did not settle, then sections.

For each open decision:
- State the decision in one sentence. Name the usages that depend on it.
- Give 2 to 4 concrete options grounded in research. For a conflict, offer a
  qualifier per thing and a new word per thing: `backend component` and
  `frontend component`, never `component`. For a synonym pair, offer each
  word as the one name. For the entries to remove, ask one question that
  lists every entry with the condition it fails. Offer to remove all, some by
  name, or none.
- Name the option you recommend.

After each answer:
- Record the decision as a fact in the research notes.
- When the answer creates new decisions, add them to the list.

Do not ask about:
- a candidate that fails the entry test: drop it;
- a meaning the documents or the code already settle;
- a word with one reading and one name;
- the wording of a definition when the meaning is settled.

Continue until the open-decisions list is empty.

### Step 4: Write the glossary

Fill `references/glossary-template.md` with the terms that pass the entry
test. Writing rules:
- Write one entry per term, in the form `- **Term**: definition.`
- Start a definition with a noun phrase that names the kind of thing:
  `a user assigned the patient role in the app`, never `handles patients`.
- Keep a definition to at most two sentences. Put what the term is in the
  first sentence and a boundary or an example in the second.
- Group entries under one `##` section per subject. Sort entries
  alphabetically inside a section.
- Write the retired word of a synonym pair, and the words of a settled
  conflict, in the glossary report, not in the glossary.
- Write the header sentence that names the document set.

Write the draft in the scratch directory.

When no term passes the entry test, write no draft. Go to Step 6 with the
glossary report alone, and ask whether the user confirms that the glossary
holds no entry. On confirmation, Step 7 deletes an existing glossary and
writes no new one.

### Step 5: Quality check

Run every check in `references/quality-checklist.md`, including the grep
helpers, over the draft. Fix every failure. When only information you do not
have can fix a failure, return to Step 3 for that single decision, then re-run
the check. Do not show the glossary until every check passes.

### Step 6: Approval

Show the complete glossary text in chat, followed by the glossary report as it
stands. Then ask whether the user approves the glossary as written or wants a
change. Apply changes, re-run Step 5, and ask again. Loop until the user
approves. Write nothing before approval.

### Step 7: Save

Write the approved glossary to its path, unchanged. When Step 4 found no
term, delete the existing glossary instead, and write no file.

Then rewrite the documents that disagree with the `unambiguity` skill when
all of these hold:
- the glossary report holds at least one disagreement;
- a skill named `unambiguity` is available to the agent;
- no other skill invoked this run.
Ask one question: which documents with disagreements to rewrite now. Offer
every listed document, the documents the user names, and none. For each
chosen document, in the order listed, invoke the `unambiguity` skill with the
invocation text `from glossary: <file path>`. Invoke it the way the agent
invokes a skill (in Claude Code, the `Skill` tool). Wait for it to finish: it
shows its own rewrite, asks its own approval, and prints its own clarity
report.

Finish with the glossary report:
- *Added*: each new term.
- *Changed*: each term whose name or definition changed, with the old text.
- *Removed*: each term removed, with the condition of the entry test it
  failed, or the word `unused`.
- *Renamed*: each word replaced by a word with one reading, with the new
  word and every usage of the old one.
- *Facts to place*: each fact taken out of a definition, with the document
  and line that use it. The `unambiguity` skill adds no fact, so the user
  places these.
- *Disagreements*: every usage in another document that disagrees with the
  glossary, with its path and line and the change that settles it. Add the
  word `rewritten` when the `unambiguity` skill rewrote that document.
Ask nothing else.
