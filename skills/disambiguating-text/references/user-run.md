# User run

Read this file when a user invoked this run. Each section adds to the step
of `SKILL.md` with the same number.

## Step 1: Load the input text

Resolve the invocation text, or the text in the conversation, as one of:
- **A file path**: the file's content is the input text. Step 7 writes the
  rewrite to the file.
- **Pasted text**: the input text. Step 7 writes no file: the rewrite shown
  in Step 6 is the output.
- **Nothing**: ask for the text first.

## Step 2: Research

**2b. The glossary.** Define the undefined words with the
`writing-glossaries` skill when all of these hold:
- there is at least one undefined word;
- the input text is a file inside a git repository;
- a skill named `writing-glossaries` is available to the agent.

Invoke the `writing-glossaries` skill (in Claude Code, with the `Skill` tool)
with `from disambiguating-text: glossary <glossary path>,
files <input file path>, words <the undefined words>`. Wait for it to finish.
Read the glossary again and record each undefined word it defined as a term.
Read the input file again. When it changed, run 2a again on the new content.
The rewrite keeps that skill's change. When a condition fails, keep the
undefined words for the clarity report.
