# User run

Read this file when a user invoked this run. Each section adds to the step
of `SKILL.md` with the same number.

## Step 1: State the evidence

Take the glossary path, the evidence set, and the words to define from the
invocation text or the conversation. Defaults:
- glossary path: `GLOSSARY.md` at the repository root;
- evidence set: every Markdown file tracked by git, minus the files the
  user excludes.

## Step 7: Save

After the save and before the glossary report, rewrite the documents that
disagree with the `disambiguating-text` skill when both of these hold:
- the glossary report holds at least one disagreement;
- a skill named `disambiguating-text` is available to the agent.

Ask one question: which documents with disagreements to rewrite now. Offer
every listed document that is not a verbatim third-party excerpt, the
documents the user names, and none. For each chosen document, in the order
listed, invoke the `disambiguating-text` skill (in Claude Code, with the
`Skill` tool) with `from writing-glossaries: <file path>`. Wait for each run
to finish.
