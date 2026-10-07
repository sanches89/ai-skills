# User run

A user run follows the steps of `SKILL.md` with the text below.

## Step 1: Load the code

Before the rest of the step, pick the mode from the user's request:

- **Write mode**: the user asks for code written or changed.
- **Review mode**: the user asks for code reviewed or cleaned up. A clean-up
  request asks for changes.

## Step 2: Write

Write mode only. Write the code the user asked for. Apply every principle to the
lines you write or change.

With a test setup, principle 9 asks for tests. Before the first test, invoke the
`writing-unit-tests` skill (in Claude Code, with the `Skill` tool) with
`from writing-clean-code: write`, when the agent has it. Write every test by the
rules it loads.

## Step 4: Fix and report

In write mode, and in review mode when the user asked for changes, fix every
failure inside the diff. In review mode with paths, edit and create no file
outside those paths. Then run Step 3 of `SKILL.md` again. In review mode without
a request for changes, change no file. End with one line per failure that
remains, or `pass`.
