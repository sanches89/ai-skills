# Analysis tools

Read this file in Step 3d. The `measuring-code` skill runs the measure tool
and writes the test reports. This file lists the tools the review records
for the task, and how the task names them.

## Tool rules

- Run the project's own analysis tools first, with the project's own
  configuration. The `measuring-code` skill takes the limits that this
  configuration sets, PMD CPD and SonarQube included. The `limits` line of
  the measurement record names the file that set each limit.
- Run each tool below only through the command the project already has.
- Never add a tool to the project's manifest. Never write a tool's
  configuration file or report file inside the repository.
- Skip a tool whose runtime is missing. Read the code against its rule
  instead.
- Write the measure command of the measurement record, with its paths and
  options, into the task's Context and Verification sections. The
  implementer then measures the same way.

## Tools the project configures

- **Dead-code detection**, such as knip, vulture, `deadcode`, or the unused
  warnings of the compiler. Treat each hit as a signal. Prove it by the
  search that *Removing code* in `refactoring-rules.md` requires.
- **Duplication detection** other than jscpd, such as PMD CPD or SonarQube.
  Use its findings beside the measurement summary.
- **Mutation testing**, such as Stryker, PIT, Infection, or cargo-mutants.
  The `mutation command` line of the measurement record names its command.
  Name that command in the Context section of a `high` risk subtask. It is
  the proof that the subtask's tests are able to fail. Put the code files
  the subtask changes, never a test file, in place of `<files>`. A command
  without `<files>` never limits its files. For such a command, and without
  a mutation command, the subtask states that the implementer breaks the
  asserted behavior by hand once.

## Structural rewrite tools

For a mechanical edit across many files, name in the subtask's Context the
first of these that the project has:
1. the agent's language-server rename or move, when the agent has one;
2. the project's own codemod tool, when it configures one;
3. ast-grep, run as `npx --yes --package @ast-grep/cli ast-grep`. It matches
   code by syntax tree in about 25 languages. Run it first without the
   rewrite and read every match;
4. hand edits, one file at a time, with a text search for the old form
   afterwards.

State in the subtask that the implementer reviews the full diff after every
tool run, because a tool also changes strings, comments, and look-alike
symbols.

