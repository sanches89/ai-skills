---
name: unambiguity
description: Rewrite a text so that it is clear and unambiguous, with one word per meaning, one name per thing, every referent and quantity named, short sentences, instructions as commands, and no open questions or assumptions, while its meaning stays the same. Use when the user wants to clarify, disambiguate, tighten, or make precise a document, a rule set, a spec, a README, an AGENTS.md, or any instruction text.
license: MIT
argument-hint: <file path | text>
---

# Unambiguity

Take one text, the input text, and rewrite it so that every sentence has
exactly one reading. Keep the meaning. Ask the user about every passage whose
reading research cannot settle. Write only the file the text came from. When
the `glossary` skill is available, use it to define the terms the text needs
before the rewrite.

An ambiguity is a passage of the input text that has more than one reading,
or that breaks a rule in `references/clarity-rules.md`. A term is a word or
phrase with an entry in the project's glossary, `GLOSSARY.md` at the
repository root unless the user names another path. A candidate is a word
that passes the entry test and has no glossary entry: at one usage at least,
a reader can take it in two ways that lead to different actions; no word or
phrase with one reading fits every usage; and the sentence around that usage
does not settle the reading.

## Hard rules

1. **The meaning stays.** Never add, drop, or change a fact or an
   instruction. When a passage has two readings and research cannot settle
   which one holds, ask the user.
2. **Read-only on the project.** Never edit, create, or delete project files.
   Write only the input file, in Step 7. Write drafts in a scratch directory
   outside the repository (in Claude Code, the session's scratchpad
   directory; in any other agent, the system temp directory). When Step 2b
   invokes the `glossary` skill, that skill writes the glossary under its own
   rules and approval.
3. **Never ask what research can answer.** Consult the input text, the
   glossary, the code, and the docs the text names before the first question.
4. **Never assume.** When a reading changes the rewrite and research cannot
   settle it, ask the user.
5. **Code, URLs, and quotes stay.** Never change a code block, a code span, a
   URL, or a quoted string.
6. **Structure stays.** Keep every heading, its level, and its order. Keep the
   line width the input text uses. Split a sentence or turn a sentence into a
   list, but never move content between sections.
7. **Terms keep the glossary's meaning.** Use a term exactly as the glossary
   defines it. Never write a glossary entry yourself. Put every candidate
   that Step 2b left undefined in the clarity report. A word that fails the
   entry test is no candidate.
8. **One question at a time.** Write every question in chat in the *Question
   format* below, then end the turn and wait for the answer. Never use an
   agent's built-in question or form tool (in Claude Code, `AskUserQuestion`).
   Write questions as plain chat text.
9. **Write nothing before the user approves the full rewrite** (Step 6).

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
- **CONTEXT**: what research found and what in the rewrite depends on the
  answer. Maximum 520 characters.
- **OPTIONS**: an ordered list. Use numbers at the top level (`1.`, `2.`),
  letters at the next level (`a.`, `b.`), then roman numerals (`i.`, `ii.`).
  Make options concrete and grounded in research: name real files, symbols,
  values, and identifiers. The user answers with a number or with free text.
- **MY SUGGESTION**: the option you recommend and why, in at most 180
  characters. Write `None` only when research gives no basis to prefer one.

## Workflow

### Step 1: Load the input text

Resolve the invocation text, or the text given in the conversation, as one
of:
- **`from <skill name>: <file path>`**: that skill invoked this run.
  Read the file. Its content is the input text. Step 7 writes the rewrite to
  this file. Step 2b invokes no skill.
- **A file path**: read the file. Its content is the input text. Step 7
  writes the rewrite to this file.
- **Pasted text**: the text itself is the input text. Step 7 prints nothing
  more than the rewrite already shown.
- **Nothing**: ask for the text as the first question.

Record the width the input text wraps prose at: the length of its longest
prose line, when lines end before the end of a sentence. Record `none` when
the input text does not wrap.

### Step 2: Research

Learn everything the text, the glossary, and the project can tell you, so that
you ask the user only about readings that stay open.

**2a. The input text.** Read `references/clarity-rules.md` now: it lists
every kind of ambiguity, how to find it, and its fix. Then read the input
text in full. Record every ambiguity with its location, its kind, and its
readings.

**2b. The glossary.** When the glossary exists, read it in full. Read every
`## Terms`, `## Definitions`, or `## Glossary` section in the input text.
Record every term the input text uses with its definition. Run the entry test
on every word whose sense in the text differs from its common sense. Record
every candidate with the readings a reader can take.

Then define the candidates with the `glossary` skill when all of these hold:
- there is at least one candidate;
- the input text is a file inside a git repository;
- a skill named `glossary` is available to the agent;
- no other skill invoked this run.
Invoke it the way the agent invokes a skill (in Claude Code, the `Skill`
tool). Pass the invocation text
`from unambiguity: glossary <glossary path>, files <input file path>, words
<the candidates>`. Wait for it to finish: it asks its own questions and
writes the glossary after its own approval. Then read the glossary again and
record each candidate it defined as a term. When a condition fails, keep the
candidates for the clarity report.

**2c. Referents.** For every referent without a name, search the input text,
the code, and the docs the text names for the thing it points at. Record the
name and where it was found. Example: `the service` is `PaymentService` at
`src/payments/service.ts:12`.

**2d. Conventions.** When the input text belongs to a project, read the
project's rules for documents: AGENTS.md, CLAUDE.md, CONTRIBUTING, a style
guide. Record the rules that bind the rewrite: line width, headings, section
names, required words.

**2e. Research notes.** Write the research notes, a private file in the
scratch directory, in two parts:
1. *Facts*: every ambiguity with its readings and, when settled, the reading
   that holds with the path and line, identifier, or URL that settled it.
2. *Open decisions*: every ambiguity research did not settle. State for each
   the decision to make and the passage it affects.
Use part 2 to drive Step 3. Do not show the research notes to the user.

### Step 3: Interview, one question at a time

Order the open decisions: passages with two readings first, then referents,
then quantities, then terms and names, then wording.

For each open decision:
- Ask it in chat in the question format, then end the turn and wait for the
  answer.
- State the decision in QUESTION. Quote the passage and its readings in
  CONTEXT.
- Give each reading as an option in OPTIONS, worded as the sentence that
  replaces the passage. Write
  `Retry the call at most 5 times, then raise the last error.`, never
  `keep the retry behavior`.
- Name the option you recommend in MY SUGGESTION.

After each answer:
- Record the decision as a fact in the research notes.
- When the answer creates new decisions, add them to the list.

Do not ask about:
- a reading the text, the glossary, the code, or the docs already settle;
- a rule in `references/clarity-rules.md` that has one fix;
- wording that changes no reading.

Continue until the open-decisions list is empty.

### Step 4: Rewrite

Apply every rule in `references/clarity-rules.md` to the input text.
Rewriting rules:
- Rewrite sentence by sentence. Keep every fact and every instruction.
- Replace a referent without a name by the name found in 2c.
- Replace a word with two meanings by the terms decided in Step 3: a
  qualifier or a new word for each meaning. Never write the bare word.
- Replace every synonym by the one name, the glossary's when it has one.
- Write every instruction as one command in the active voice with one
  action. Split a sentence with two actions into two sentences.
- Split every sentence over 25 words.
- Write parallel items as a list, one item per line.
- Give every quantity a number and a unit.
- Replace every banned word, as listed in `references/clarity-rules.md`,
  every question, and every alternative by the decision from Step 3.
- Keep code blocks, code spans, URLs, and quoted strings byte-identical.
- Wrap prose at the width recorded in Step 1.

Write the draft in the scratch directory.

### Step 5: Quality check

Run every check in `references/quality-checklist.md`, including the grep
helpers, over the draft. Fix every failure. When only a decision you do not
have can fix a failure, return to Step 3 for that single decision, then re-run
the check. Do not show the rewrite until every check passes.

### Step 6: Approval

Show the complete rewrite in chat, followed by the clarity report as it
stands. Then ask, in the question format, whether the user approves the
rewrite as written or wants a change. Apply changes, re-run Step 5, and ask
again. Loop until the user approves. Write nothing before approval.

### Step 7: Save

For a file path, write the approved rewrite to that file, unchanged. For
pasted text, the rewrite shown in Step 6 is the output. Finish with the
clarity report:
- *Resolved*: one bullet per ambiguity, at most 2 lines: its kind, the
  passage before and after, and the decision that settled it. Name the path
  and line, identifier, or URL that settled it, or the user's answer.
- *Candidates*: every candidate, with its readings and the reading the
  rewrite uses. Write `None.` when the `glossary` skill defined them all.
Ask nothing else.
