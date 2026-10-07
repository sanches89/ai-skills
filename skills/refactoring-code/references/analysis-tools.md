# Analysis tools

The `measuring-code` skill runs the measure tool and writes the test reports.
This file lists the other tools the review records for the task.

## Tool rules

- Run the project's own analysis tools first, with the project's own
  configuration. The `limits` line of the measurement record already holds the
  limits this configuration sets, PMD CPD and SonarQube included.
- Run each tool below only through the command the project already has.
- Never add a tool to the project's manifest. Never write a tool's configuration
  file or report file inside the repository.
- Skip a tool whose runtime is missing. Read the code against its rule instead.
- In every command of the task and its subtasks, write `<scratch-dir>` in place
  of the scratch directory.

## Tools the project configures

- **Dead-code detection**, such as knip, vulture, `deadcode`, or the unused
  warnings of the compiler. Treat each hit as a signal, proven as Step 5 states.
- **Duplication detection** other than jscpd, such as PMD CPD or SonarQube. Use
  its findings beside the measurement summary.
- **Mutation testing**, such as Stryker, PIT, Infection, or cargo-mutants. The
  `mutation command` line of the measurement record names its command. Name that
  command in the Context section of a `high` risk subtask when it holds
  `<files>`. Put the code files the subtask changes, never a test file, in place
  of `<files>`. For a command without `<files>`, and without a mutation command,
  the subtask states that the implementer breaks the asserted behavior by hand
  once.

## Structural rewrite tools

For a mechanical edit across many files, name in the subtask's Context the first
of these that the project has:

1. the agent's language-server rename or move, when the agent has one;
2. the project's own codemod tool, when it configures one;
3. ast-grep, run as `npx --yes --package @ast-grep/cli ast-grep`. Run it first
   without the rewrite and read every match;
4. hand edits, one file at a time, with a text search for the old form
   afterwards.

State in the subtask that the implementer reviews the full diff after every tool
run.
