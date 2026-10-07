---
name: finding-code-smells
description: Reviews code for smells, design flaws, and the marks of agent-written code, and lists each finding with its evidence and the refactoring that removes it, changing no code. Use when the user wants code reviewed for smells, AI slop, coupling, or legibility, or asks what in the code needs refactoring.
license: MIT
compatibility: Requires the measuring-code skill. The scan script needs Node.js 22.13 or newer.
argument-hint: "[path...]"
---

# Finding code smells

Review the code under given paths against the smell catalog. List every
finding with its location, its evidence, and the refactoring from the
catalog that removes it, and list the contract beside the findings. Every
fact comes from measuring, scanning, and reading the unchanged code.

## Terms

These words have exactly one meaning in this skill.

- **Behavior**: what a caller or a user observes of the code: returned values,
  changed state, raised errors, written output, and calls to external systems.
- **Contract**: everything that code or people outside the refactor scope
  depend on. Exported symbols with their signatures, endpoints, command-line
  flags, file formats, database schemas, configuration keys, and the names of
  events, logs, and metrics.

## Hard rules

1. **Read-only on the project.** Write only under `<out>`. Change no code,
   test, or configuration file. A finding describes the unchanged code, and
   an edit made during the review breaks that.
2. **Never ask.** Settle every choice from the invocation text, the code,
   the docs, the tests, and the catalog. A caller runs this skill with no
   user present.
3. **Read before recording.** A measured value or a scan signal alone is
   never a finding. Read the code behind it first. Many *Leave it when*
   cases show only in the code, so an unread signal becomes a false finding.

## Invocation

When the invocation text starts with `from <skill name>:`, another skill
invoked this run. The text then takes this form:

```
from <caller>: paths <path>...[, summary <measurement summary path | none>]
[, limits <limits>][, ignore <globs>][, out <folder>]
```

- `paths`: the paths to review, relative to the repository root.
- `summary`: a measurement summary of those paths. `none` means the
  caller's measurement produced no summary: Step 3 measures nothing.
  Without `summary`, Step 3 measures the paths.
- `limits`: the `limits` line of the caller's measurement record.
- `ignore`: the ignore globs, joined by commas with no space. Default the
  ignore globs of the measurement.
- `out`: the folder of the files this skill writes. Default
  `<scratch-dir>/smells`.

Without that prefix, a user invoked this run. Take the paths from the
request, else `.`, and the defaults above.

The final message for a caller is this block, and nothing else:

```
findings: <path of findings.md>
contract: <path of contract.md>
scan: <path of scan.json> | none: <reason>
counts: <smell>: <n>, ...
```

## Workflow

### Step 1: Set the refactor scope

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

Read the options as *Invocation* states. `<scratch-dir>` is a scratch
directory outside the repository (in Claude Code, the scratchpad
directory). Set `<out>` to the `out` option, else `<scratch-dir>/smells`, as
an absolute path. Write every note under `<out>`. Run every command from
the repository root.

The refactor scope is every file under the paths, except:
- generated code, vendored code, lockfiles, build output, and snapshot
  files;
- database migrations that already ran.

A test file stays in the refactor scope. Inside it, only the entries under
*Tests* in `references/smell-catalog.md` are findings.

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
- <kind>: <name or signature> `<path:line>`
```

### Step 3: Measure and scan

**Summary.** Take the measurement summary from the `summary` option.
Without it, invoke the `measuring-code` skill (in Claude Code, with the
`Skill` tool) with the invocation text
`from finding-code-smells: paths <paths>, out <out>`. Add
`, ignore <globs>` when the invocation gives `ignore`. Take the summary
from the `summary` line of the measurement record it returns. Take from
the summary and the measurement record:
- the limits: the `limits` option, else `settings` of the summary, else
  the `limits` line of the measurement record, else the defaults of the
  catalog;
- the ignore globs: the `ignore` option, else `settings.ignore`, else the
  `ignore` line of the measurement record;
- a `summary.md` holds the values that measuring-code took by reading;
- with no summary, by the `summary none` option or a `summary: none`
  line, read every function against the limits.

When `coverage.functions.top` holds `settings.top` entries, the list is
cut. With a measurement record of this run, run its `measure command`
line again, with `--top <n>` in place of its `--top` value, into
`<out>/full.json`. `<n>` is the sum of `partly` and `none` in
`coverage.functions`. The reports stay the same, so no test runs again.
Use that summary from then on. With the `summary` option, read the tests
that import or call each function the cut list leaves out.

**Scan.** Run the scan script. It lists the signals that the entries under
*Agent-written code*, *Legibility*, and *Tests* in
`references/smell-catalog.md` name, as `path:line` per kind. `<skill-dir>`
is the folder holding this `SKILL.md`:

```bash
node <skill-dir>/scripts/scan.mjs <path>... --ignore "<globs>" \
  > <out>/scan.json
```

Leave out `--ignore` with no glob. Pass `--max-lines <n>` when the project
configures its own file length limit, such as the `max-lines` rule of
ESLint. `--help` lists the other options. Each kind holds its `count` and
a `top` list of `file`, `line`, and `text`: the matched line, cut to 120
characters. A `credential` entry hides its text.

Exit codes: `0` signals printed, `1` unexpected failure, `2` invalid
arguments. The script finds a signal by text. It misses a form it has no
pattern for, and it lists a form that a string or a comment holds. When
the script fails to start, record its first error line as the reason. Then
search by hand with the agent's code search: catch blocks, skip markers,
URLs and numbers of three digits or more, reflection calls, and files over
400 lines.

**Coverage.** Record which functions in the refactor scope a test covers:
- with a coverage report, a function is covered when the tests ran every
  line and every branch of it. `coverage.functions.top` lists every
  function that falls short, highest CRAP score first. Every function of a
  file in `coverage.filesNotInReport` is uncovered;
- a coverage report proves that a test runs the code, never that a test
  asserts its result. Read the tests of every function a finding names;
- without a coverage report, read the tests that import or call the code.

### Step 4: Find

Read `references/smell-catalog.md` now. The subagents below read every file
in the refactor scope in full. Findings come from three origins: the `top`
lists of the summary, the scan signals, and reading the code. Check nesting
by reading: a finding at 3 levels or deeper. When the summary skips
`complexity`, check length, parameters, and complexity by reading too.

Group the files of the refactor scope by folder and run one subagent per
folder. Give it the files to read in full and the path of
`references/smell-catalog.md`. Give it the limits, and the `top` entries,
scan signals, and coverage from Step 3 that fall in its folder. Give it
the contract list and the entry form below. It reads code outside its
folder when a smell needs it.

Record one entry per smell and location in `<out>/findings.md`:

```
- <smell>: `<path:line>` (<symbol>)
  evidence: <the clone, the measured value against its limit, or what the
    code shows>
  refactoring: <refactoring from the catalog> | report
  covered: yes | partly | no
  contract: yes | no
```

- `refactoring`: `report` for an entry with **Report** in the catalog.
- `covered`: `yes` when the tests ran every line and branch and a test
  asserts the result. `no` when no test ran the code. Else `partly`.
- `contract`: `yes` when the location holds a part of `contract.md`.

Order the entries by file: the files of `hotspots.top` first, in its
order, then the other files by path. Inside a file, order them by line.

### Step 5: Return

Confirm that every entry names a location that exists, that its code was
read, and that no entry holds a credential value. Count the entries per
smell, in the order of the catalog.

For a caller, send the block of *Invocation* as the final message. Write
`none` on the `counts` line when no entry exists. Without the `from`
prefix, show the entries of `findings.md` in chat, grouped by file,
hotspot files first. Ask nothing and offer nothing after them.
