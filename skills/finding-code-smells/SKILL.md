---
name: finding-code-smells
description: Reviews existing code for smells and the marks of agent-written code, and lists each finding with its evidence and the refactoring that removes it, changing no code. Use when the user wants code reviewed for smells, AI slop, coupling, or legibility, wants long functions, duplication, or magic numbers found, or asks what needs refactoring.
license: MIT
compatibility: Requires the measuring-code skill. The scan script needs Node.js 22.13 or newer.
argument-hint: "[path...]"
---

# Finding code smells

Review the code under given paths against the smell catalog. List each
finding with its evidence and refactoring, and list the contract.

## Terms

- **Behavior**: what a caller or a user observes of the code: returned values,
  changed state, raised errors, written output, and calls to external systems.
- **Contract**: everything that code or people outside the refactor scope
  depend on. Exported symbols with their signatures, endpoints, command-line
  flags, file formats, database schemas, configuration keys, and the names of
  events, logs, and metrics.

## Hard rules

1. **Read-only on the project.** Write only under `<out>`.
2. **Never ask.** Settle every choice from the invocation text, the code,
   the docs, the tests, and the catalog.
3. **Read before recording.** A measured value or a scan signal alone is
   never a finding. Read the code behind it first.

## Invocation

When the invocation text starts with `from <skill name>:`, another skill
invoked this run. The text then takes this form:

```
from <caller>: paths <path>...[, summary <measurement summary path | none>]
[, ignore <globs>][, out <folder>][, limits <limits>]
```

- `paths`: the paths to review, relative to the repository root.
- `summary`: a measurement summary of those paths, or `none` when the
  caller's measurement produced none.
- `ignore`: the ignore globs, joined by commas with no space. Default the
  ignore globs of the measurement.
- `out`: the output folder. Default `<scratch-dir>/smells`.
- `limits`: the `limits` line of the caller's measurement record, without
  its `limits:` label. It comes last and runs to the end of the text,
  commas included.

Without that prefix, a user invoked this run. Take the paths from the
request, else `.`, and the defaults above.

The return block for a caller:

```
findings: <path of findings.md>
contract: <path of contract.md>
scan: <path of scan.json> | none: <reason>
counts: <smell>: <n>, ...
```

## Workflow

### Step 1: Set the refactor scope

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run in
one each read or command that yields only facts, returned with path and
line.

`<scratch-dir>` is a scratch directory outside the repository (in Claude
Code, the scratchpad directory). Set `<out>` to the `out` option, as an
absolute path. Run every command from the repository root.

The refactor scope is every file under the paths, except generated code,
vendored code, lockfiles, build output, snapshot files, and database
migrations that already ran.

A test file stays in the refactor scope.

With an empty refactor scope, write `None.` into `<out>/findings.md` and
`<out>/contract.md`, and go to Step 5.

### Step 2: List the contract

List every part of the contract that the refactor scope holds:
- every symbol that code outside the refactor scope imports or calls, found
  with the agent's code search or `git grep`;
- in a library that others install, every exported symbol, with or without
  a caller in the repository;
- every endpoint, command-line flag, file format, database schema,
  configuration key, and name of an event, a log, or a metric.

Write the list to `<out>/contract.md`, one line per part, or `None.`:

```
- <contract part>: <name or signature> `<path:line>`
```

### Step 3: Measure and scan

**Summary.** With the `summary` option, take the measurement summary from
it and measure nothing. Without it, invoke the `measuring-code` skill (in
Claude Code, with the `Skill` tool) with
`from finding-code-smells: paths <paths>, out <out>`. Add
`, ignore <globs>` when the invocation gives `ignore`. Take the summary
from the `summary` line of the measurement record it returns. Set:
- the limits: the `limits` option, else `settings` of the summary, else
  the `limits` line of the measurement record, else the catalog defaults;
- the ignore globs: the `ignore` option, else `settings.ignore`, else the
  `ignore` line of the measurement record.

A `summary.md` holds the values that measuring-code took by reading. With
no summary, by the `summary none` option or a `summary: none` line, read
every function against the limits.

When `coverage.functions.top` holds `settings.top` entries, the list is
cut. With a measurement record of this run, run its `measure command`
line again, with `--top <n>` in place of its `--top` value, into
`<out>/full.json`. Run no test again. Use that summary from then on. `<n>`
is the sum of `partly` and `none` in `coverage.functions`. With the
`summary` option, read the tests that import or call each function the cut
list leaves out.

**Scan.** Run the scan script. `<skill-dir>` is the folder holding this
`SKILL.md`:

```bash
node <skill-dir>/scripts/scan.mjs <path>... --ignore "<globs>" \
  > <out>/scan.json
```

Leave out `--ignore` with no glob. Pass `--max-lines <n>` when the project
configures its own file length limit, such as the `max-lines` rule of
ESLint.

Exit codes: `0` signals printed, `1` unexpected failure, `2` invalid
arguments. When the script fails to start, record its first error line as
the `scan` reason. Then search by hand with the agent's code search: catch
blocks, skip markers, URLs and numbers of three digits or more, reflection
calls, and files over 400 lines.

**Coverage.** Record, per function in the refactor scope, whether the
tests ran every line and branch of it:
- with a coverage report, `coverage.functions.top` lists every function
  that falls short. Every function of a file in
  `coverage.filesNotInReport` is uncovered;
- without a coverage report, read the tests that import or call the code.

### Step 4: Find

Read `references/smell-catalog.md`. Findings come from the `top` lists of
the summary, the scan signals, and reading the code. Check nesting by
reading: a finding at 3 levels or deeper. When the summary skips
`complexity`, check length, parameters, and complexity by reading too.

Group the files of the refactor scope by folder and run one subagent per
folder. Give it:
- its files, to read in full, and the path of `references/smell-catalog.md`;
- the limits, and the `top` entries, scan signals, and coverage of Step 3
  that fall in its folder;
- the contract list, and the entry form below with its field rules.

It reads code outside its folder when a smell needs it.

Record one entry per smell and location in `<out>/findings.md`:

```
- <smell>: `<path:line>` (<symbol>)
  evidence: <the clone, the measured value against its limit, or what the
    code shows>
  refactoring: <refactoring from the catalog>[; <refactoring>]... | report
  covered: yes | partly | no
  contract: yes | no
```

- `refactoring`: each refactoring of the catalog entry that the location
  needs, in the order of the catalog line, separated by semicolons.
  `report` for an entry with **Report** in the catalog, except a case that
  its **Report** line sends to a refactoring.
- `covered`: read the tests of the function. `yes` when the tests ran
  every line and branch and a test asserts the result. `no` when no test
  ran the code. Else `partly`.
- `contract`: `yes` when the location holds a part of `contract.md`.

Order the entries by file, the files of `hotspots.top` first in its order,
then by path. Inside a file, order them by line.

### Step 5: Return

Confirm that every entry names a location that exists, that its code was
read, and that no entry holds a credential value. Count the entries per
smell, in the order of the catalog.

For a caller, the final message is the return block of *Invocation* alone.
Write `none` on the `counts` line when no entry exists. Without the `from`
prefix, show the entries of `findings.md` in chat, grouped by file,
hotspot files first. Offer nothing after them.
