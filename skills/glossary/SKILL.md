---
name: glossary
description: Create or update a project's GLOSSARY.md so that every word with a special meaning in the project's documents has one definition and one meaning. Use when the user wants to create, update, clean up, or audit a glossary, define the project's terms, or settle words that the documents use with two meanings or two words used for one thing.
license: MIT
argument-hint: <glossary path | files to cover | words to define>
---

# Glossary

Find the words with a special meaning in a project's documents and write the
glossary that defines each of them once. Write only the glossary. Report where
the other documents disagree with it. When the `unambiguity` skill is
available, use it to rewrite the documents that disagree.

## Terms

These words have exactly one meaning in this skill.

- **Glossary**: the file that defines the words with a special meaning in a
  project's documents: `GLOSSARY.md` at the repository root, unless the user
  names another path.
- **Invocation text**: the text passed with the skill invocation.
- **Term**: a word or phrase with a special meaning in the project's
  documents.
- **Definition**: the text of a glossary entry after the colon: what the term
  is, in at most two sentences.
- **Document set**: the files the glossary covers: every Markdown file tracked
  by git, plus the files the user names, minus the files the user excludes.
- **Usage**: one occurrence of a term in the document set, identified by path
  and line.
- **Candidate**: a term that has no glossary entry yet.
- **Conflict**: one term used with two meanings in the document set.
- **Synonym pair**: two terms used with one meaning in the document set.
- **Qualifier**: a fixed word placed before a term to split one word into two
  terms: `backend component` and `frontend component`.
- **Restatement**: a glossary entry copied into another document, such as a
  `## Terms` section.
- **Origin**: where a piece of information was taken from: a file path with
  line numbers, an identifier, or a URL.
- **Banned words**: words that mark an assumption or an open question: `TBD`,
  `TBC`, `TODO`, `maybe`, `might`, `probably`, `possibly`, `perhaps`,
  `ideally`, `consider`, `could`, `should we`, `if needed`, `if necessary`,
  `as appropriate`, `as needed`, `etc`, `and so on`, `or similar`,
  `something like`.
- **Draft**: the output of this skill before approval, kept in the scratch
  directory.
- **Research notes**: the private file in the scratch directory that holds
  the facts and the open decisions found in Step 2.
- **Open decision**: a decision that research did not settle. Each one becomes
  one question in Step 3.
- **Scratch directory**: a temporary location outside the repository. In Claude
  Code, the session's scratchpad directory. In any other agent, the system temp
  directory.
- **Glossary report**: the final message of this skill: what changed in the
  glossary and every usage that disagrees with it.

## Hard rules

1. **Read-only on the project.** Never edit, create, or delete project files.
   Write only the glossary, in Step 7. Write drafts in the scratch directory,
   never in the repository.
2. **Never ask what research can answer.** Consult the document set, the
   code, and the existing glossary before the first question.
3. **Never assume.** When a definition changes the glossary and research
   cannot settle it, ask the user.
4. **One word, one meaning.** Give every term exactly one definition. Settle
   a conflict with a qualifier or a new word for each meaning, never with a
   definition that lists two meanings.
5. **One name per thing.** Settle a synonym pair on one term. Put the retired
   word in the glossary report with its usages, never in the glossary.
6. **Every entry has a usage.** Define a term only when a document in the set
   uses it. Remove an entry that no document uses, after the user confirms.
7. **A definition says what the term is.** Start it with a noun phrase that
   names the kind of thing. Write no banned word, no description of how the
   thing works, and no definition that uses its own term.
8. **Never edit another document yourself.** Put a usage that disagrees with
   the glossary in the glossary report, with its path and line. When Step 7
   invokes the `unambiguity` skill, that skill rewrites a document under its
   own rules and approval.
9. **One question at a time.** Write every question in chat in the *Question
   format* below, then end the turn and wait for the answer. Never use an
   agent's built-in question or form tool (in Claude Code, `AskUserQuestion`).
   Write questions as plain chat text.
10. **Write nothing before the user approves the full glossary text**
    (Step 6).

## Question format

Use this exact layout, and nothing else, for every question to the user in
every step. Ask one question per message. After printing it, end the turn and
wait.

```
❓ QUESTION
<question>

📚 CONTEXT
<what research found and what depends on the answer - max of 520 chars>

☑️ OPTIONS
<options, use an ordered list, numbers -> letters -> roman numerals>

👉 MY SUGGESTION
<suggestion - max of 180 chars>
```

- **QUESTION**: one decision, one sentence.
- **CONTEXT**: what research found and what in the glossary depends on the
  answer. Maximum 520 characters.
- **OPTIONS**: an ordered list. Use numbers at the top level (`1.`, `2.`),
  letters at the next level (`a.`, `b.`), then roman numerals (`i.`, `ii.`).
  Make options concrete and grounded in research: name real files, symbols,
  values, and identifiers. The user answers with a number or with free text.
- **MY SUGGESTION**: the option you recommend and why, in at most 180
  characters. Write `None` only when research gives no basis to prefer one.

## Workflow

### Step 1: Restate the target

- Take the glossary path, the document set, and the words to define from the
  invocation text, or from the conversation. Without a path, use
  `GLOSSARY.md` at the repository root. Without named files, use every
  Markdown file tracked by git.
- When the invocation text starts with `from <skill name>:`, that skill
  invoked this run. Take the glossary path after `glossary`, the files
  after `files`, and the words after `words`. The document set is the set
  named in the glossary's header plus those files, or those files alone when
  no glossary exists. Step 7 invokes no skill.
- Write one sentence in the form: *The glossary at <path> covers <document
  set>.* Name the files, or the rule that selects them.
- Ask the user to confirm or correct that sentence, in the question format.
  Do not start research until the user confirms it.

### Step 2: Research

Learn everything the documents and the code can tell you, so that you ask the
user only about meanings and choices.

**2a. Existing glossary.** When the glossary exists, read it in full. Record
every term, its definition, and its section.

**2b. Document set.** Read every document in full. Use a read-only subagent
for broad sweeps when the agent offers one (in Claude Code, the `Explore`
subagent); otherwise read directly. Record, with path and line:
- every candidate:
  - a word or phrase defined inline (`X is a ...`, `X: ...`);
  - a bold label at the start of a bullet;
  - a capitalized noun that is not a proper name;
  - an acronym;
  - the name of a role, a state, an artifact, or a step;
  - every word named in the invocation text or by the user;
- every usage of every candidate and of every existing term;
- every restatement: a `## Terms`, `## Definitions`, or `## Glossary`
  section, and every bullet of the form `- **X**: ...` outside the glossary.

**2c. Code.** When the project has code, search it for each candidate. Record
the identifier that carries the term and what the code does with it, so that
the definition matches the code, not the prose.

**2d. Findings.** Compare the records and write each finding with its usages:
- a conflict: one term with two meanings;
- a synonym pair: two terms with one meaning;
- an unused entry: a term in the glossary that no document uses;
- a mismatch: a restatement whose text differs from the glossary;
- a weak definition: one that uses its own term, holds a banned word, or
  says how the thing works instead of what it is. Also one with more than two
  sentences, or with more than 25 words in one sentence.

**2e. Research notes.** Write the research notes in the scratch directory, in
two parts:
1. *Facts*: every candidate and every finding, each with its origin.
2. *Open decisions*: every open decision. State for each the decision to make
   and the entries it affects.
Use part 2 to drive Step 3. Do not show the research notes to the user.

### Step 3: Interview, one question at a time

Order the open decisions: conflicts first, then synonym pairs, then meanings
research did not settle, then unused entries, then sections.

For each open decision:
- Ask it in chat in the question format, then end the turn and wait for the
  answer.
- State the decision in QUESTION. Name the usages that depend on it in
  CONTEXT.
- Give 2 to 4 concrete options grounded in research in OPTIONS. For a
  conflict, offer a qualifier per meaning and a new word per meaning:
  `backend component` and `frontend component`, never `component`. For a
  synonym pair, offer each word as the one name.
- Name the option you recommend in MY SUGGESTION.

After each answer:
- Record the decision as a fact in the research notes.
- When the answer creates new decisions, add them to the list.

Do not ask about:
- a meaning the documents or the code already settle;
- a term with one meaning and one name;
- the wording of a definition when the meaning is settled.

Continue until the open-decisions list is empty.

### Step 4: Write the glossary

Fill `references/glossary-template.md`. Writing rules:
- Write one entry per term, in the form `- **Term**: definition.`
- Start a definition with a noun phrase that names the kind of thing:
  `a user assigned the patient role in the app`, never `handles patients`.
- Keep a definition to at most two sentences. Put what the term is in the
  first sentence and a boundary or an example in the second.
- Group entries under one `##` section per subject. Sort entries
  alphabetically inside a section.
- Write the retired word of a synonym pair in the glossary report, not in the
  glossary.
- Write the header sentence that names the document set.

Write the draft in the scratch directory.

### Step 5: Quality check

Run every check in `references/quality-checklist.md`, including the grep
helpers, over the draft. Fix every failure. When only information you do not
have can fix a failure, return to Step 3 for that single decision, then re-run
the check. Do not show the glossary until every check passes.

### Step 6: Approval

Show the complete glossary text in chat, followed by the glossary report as it
stands. Then ask, in the question format, whether the user approves the
glossary as written or wants a change. Apply changes, re-run Step 5, and ask
again. Loop until the user approves. Write nothing before approval.

### Step 7: Save

Write the approved glossary to its path, unchanged.

Then rewrite the documents that disagree with the `unambiguity` skill when
all of these hold:
- the glossary report holds at least one disagreement;
- a skill named `unambiguity` is available to the agent;
- no other skill invoked this run.
Ask one question in the question format: which documents with disagreements
to rewrite now. Offer every listed document, the documents the user names,
and none. For each chosen document, in the order listed, invoke the
`unambiguity` skill with the invocation text `from glossary: <file path>`.
Invoke it the way the agent invokes a skill (in Claude Code, the `Skill`
tool). Wait for it to finish: it shows its own rewrite, asks its own
approval, and prints its own clarity report.

Finish with the glossary report:
- *Added*: each new term.
- *Changed*: each term whose name or definition changed, with the old text.
- *Removed*: each term removed, and why.
- *Disagreements*: every usage in another document that disagrees with the
  glossary, with its path and line and the change that settles it. Add the
  word `rewritten` when the `unambiguity` skill rewrote that document.
Ask nothing else.
