# Measurement report template

The measurement report is all the user keeps from a run: make every line a
fact that changes what the user does next. Keep the headings exactly as
written. Replace every `<placeholder>`.

Rules for filling:
- At most 60 non-blank lines, 2 lines per bullet, and 25 words per sentence.
- Present tense. Name real things: paths, symbols, branch names, test
  names, configuration files.
- `a | b` on a template line means: write a or b, never both.
- The single word `None.` in a section with nothing to say. No section
  beyond the ones below.

What each section keeps:
- **Result**: `done` when the measurement record of Step 2 names a
  `summary.json`, else `blocked` with the reason Step 2 gives.
- **Scope**: `files` of the summary, the repository root, and the `ignore`
  line of the measurement record.
- **Code**: `working tree` without a name, else the name with the short
  hash of the measured commit.
- **Limits**: the `limits` line of the measurement record: the three limits
  and the clone floor, then the configuration file that set each limit, or
  `all defaults`.
- **Tools**: the `tool` value of `duplication`; the `tool` value of
  `complexity`, or `no lizard`; the test runner of the measurement
  record's `test command` line, or `no test command` when that line reads
  `none`;
  the mutation tool of its `mutation command` line, or `no mutation
  command` when that line reads `none`.
- **Measurements**: one line per measurement. A measurement whose line in
  the measurement record is not `ok` gets `skipped` with the reason on that
  line.
- **Findings**: the findings of Step 3 in rank order, numbered.
- **Skipped**: every measurement whose line in the measurement record is
  not `ok`, with its reason. The count of findings left out per finding kind.

What the report leaves out:
- the steps taken, and attempts that failed;
- command output, logs, stack traces, and the JSON of the summary;
- the request restated;
- praise, apologies, offers, questions, and next-step suggestions.

---

## Measurement report

```markdown
# Measurement report: <repository name> at <working tree | name>

**Result:** done | blocked: <reason>
**Scope:** <number> files under `<repository root>`, ignore: <globs> | none
**Code:** working tree | <name> at <short hash>
**Limits:** ccn <n>, length <n>, params <n>, clone <n> lines and <n>
tokens; <limits> from `<configuration file>`, <...> | all defaults
**Tools:** <jscpd version>, <lizard version> | no lizard, <test runner> |
no test command, <mutation tool> | no mutation command

## Measurements

- Duplication: <number> clones, <number> duplicated lines, <percent> of
  <number> lines. | skipped: <reason>
- Complexity: <number> functions, <number> over ccn, <number> over length,
  <number> over params, highest ccn <number>. | skipped: <reason>
- Hotspots: `<file>` leads with <number> commits and ccn | lines <number>,
  then `<file>` and `<file>`. | skipped: <reason>
- Unit tests: <number> tests, <number> failed, <number> skipped, <number>
  seconds. | skipped: <reason>
- Coverage: lines <percent>, branches <percent> | none, <number> uncovered
  lines, <number> files in no report, <number> untested functions. |
  skipped: <reason>
- Mutation: score <percent> of <number> mutants, <number> survived,
  <number> with no coverage. | skipped: <reason>

## Findings

1. <finding kind> at `<path:line>` (<symbol>): <evidence>. Action:
   <action>.
2. <...>
<... or the single word: None.>

## Skipped

- <measurement>: <reason>. | None.
- <number> findings of <finding kind> left out after the 12th.
```
