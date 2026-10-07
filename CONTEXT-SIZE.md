# Context size of each skill

This file shows how many tokens each skill takes in an agent's context window.
Every number is an estimate. The counts come from the `cl100k_base` encoding
of the `gpt-tokenizer` npm package. Each agent's tokenizer gives its own
count. The pre-commit hook regenerates this file from
`scripts/context-size.mjs` on every commit. Never edit it by hand.

## Tiers

A skill enters the context window in tiers. Each column of the summary table
counts one tier.

- **Startup**: the `name` and `description` fields of the frontmatter. An
  agent loads them for every installed skill at the start of a session.
- **SKILL.md**: the whole file, frontmatter included. An agent loads it when
  it uses the skill.
- **References**: every file under `references/`. An agent reads one when
  an instruction in `SKILL.md` cites it.
- **Scripts**: every file under `scripts/`. An agent runs them. Their source
  enters the context window only when the agent reads it.
- **Total**: every file in the skill folder.

## Summary

Tokens per skill and tier. With all 19 skills installed, the startup
tier costs 1,413 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill                | Startup | SKILL.md | References | Scripts |   Total |
|----------------------|--------:|---------:|-----------:|--------:|--------:|
| analyzing-code       |      77 |    1,136 |      2,892 |       0 |   4,813 |
| breaking-down-tasks  |      70 |    2,818 |        291 |       0 |   4,189 |
| creating-tasks       |      67 |    1,800 |         67 |       0 |   2,833 |
| disambiguating-text  |      72 |    1,576 |      2,027 |       0 |   4,414 |
| finding-code-smells  |      79 |    1,864 |      4,226 |   5,137 |  12,185 |
| finding-dev-commands |      72 |    1,438 |        328 |       0 |   2,564 |
| finding-trackers     |      70 |      916 |        660 |       0 |   2,411 |
| formatting-tasks     |      63 |    1,093 |      2,966 |       0 |   5,002 |
| implementing-tasks   |      65 |    2,738 |      2,309 |       0 |   8,367 |
| loading-tasks        |      88 |    1,538 |          0 |       0 |   2,347 |
| measuring-code       |      74 |    2,196 |      4,717 |       0 |   7,951 |
| orchestrating-tasks  |      78 |    3,636 |      2,526 |       0 |  11,284 |
| refactoring-code     |      85 |    3,329 |      4,412 |       0 |   9,044 |
| saving-tasks         |      69 |      933 |      1,232 |       0 |   3,163 |
| updating-packages    |      65 |    3,590 |      4,956 |   1,864 |  11,362 |
| writing-agent-docs   |      96 |    1,292 |      2,023 |   3,658 |   7,955 |
| writing-clean-code   |      79 |    2,109 |        284 |       0 |   3,192 |
| writing-glossaries   |      79 |    2,141 |      1,773 |       0 |   4,890 |
| writing-unit-tests   |      65 |    2,081 |      1,125 |       0 |   3,980 |
| **All skills**       |   1,413 |   38,224 |     38,814 |  10,659 | 111,946 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   111 |   733 |  1,136 |
| `evals/evals.json`                          |    23 |   313 |    501 |
| `evals/trigger-queries.json`                |    12 |   160 |    284 |
| `references/analysis-rules.md`              |   138 |   995 |  1,397 |
| `references/measurement-report-template.md` |    86 |   548 |    938 |
| `references/quality-checklist.md`           |    53 |   331 |    557 |
| **Total**                                   |   423 | 3,080 |  4,813 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   241 | 1,831 |  2,818 |
| `evals/evals.json`                |    23 |   420 |    680 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    30 |   217 |    291 |
| **Total**                         |   306 | 2,704 |  4,189 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   175 | 1,187 |  1,800 |
| `evals/evals.json`                |    23 |   363 |    562 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    14 |    51 |     67 |
| **Total**                         |   224 | 1,852 |  2,833 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   158 | 1,118 |  1,576 |
| `evals/evals.json`                |    23 |   299 |    452 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    66 |   639 |  1,000 |
| `references/quality-checklist.md` |    71 |   412 |    693 |
| `references/user-run.md`          |    37 |   231 |    334 |
| **Total**                         |   367 | 2,903 |  4,414 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   185 | 1,187 |  1,864 |
| `evals/evals.json`            |    23 |   450 |    706 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/finding-entry.md` |    21 |   132 |    217 |
| `references/smell-catalog.md` |   355 | 2,817 |  4,009 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     |   996 | 6,257 | 12,185 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   127 |   856 |  1,438 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| `references/runners.md`      |    28 |   167 |    328 |
| **Total**                    |   190 | 1,491 |  2,564 |

### finding-trackers

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |    93 |   608 |    916 |
| `evals/evals.json`           |    23 |   342 |    550 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| `references/gh-map.md`       |    24 |   158 |    326 |
| `references/mcp-map.md`      |    25 |   238 |    334 |
| **Total**                    |   177 | 1,524 |  2,411 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   109 |   727 |  1,093 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    30 |   162 |    263 |
| `references/quality-checklist.md` |    86 |   629 |    970 |
| `references/task-format.md`       |   148 |   647 |  1,125 |
| `references/user-run.md`          |    31 |   200 |    293 |
| `references/writing-rules.md`     |    24 |   224 |    315 |
| **Total**                         |   463 | 3,115 |  5,002 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   247 | 1,926 |  2,738 |
| `evals/evals.json`                   |    42 |   555 |  1,090 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    79 |   564 |    842 |
| `references/target-with-subtasks.md` |    37 |   340 |    546 |
| `references/work-report-template.md` |    92 |   586 |    921 |
| `evals/files/ (16 files)`            |   298 | 1,044 |  1,874 |
| **Total**                            |   807 | 5,190 |  8,367 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   141 | 1,018 |  1,538 |
| `evals/evals.json`           |    23 |   280 |    501 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   176 | 1,449 |  2,347 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   188 | 1,365 |  2,196 |
| `evals/evals.json`               |    23 |   468 |    762 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/ignore-globs.md`     |    14 |    62 |    145 |
| `references/measure-tool.md`     |   144 | 1,045 |  2,074 |
| `references/mutation-reports.md` |   116 |   789 |  1,538 |
| `references/test-reports.md`     |    88 |   485 |    960 |
| **Total**                        |   585 | 4,384 |  7,951 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   273 | 2,343 |  3,636 |
| `evals/evals.json`                            |    43 |   489 |  1,051 |
| `evals/trigger-queries.json`                  |    12 |   206 |    380 |
| `references/job-prompt-template.md`           |    38 |   200 |    284 |
| `references/orchestration-report-template.md` |   104 |   647 |  1,054 |
| `references/plan-template.md`                 |    17 |    68 |    122 |
| `references/quality-checklist.md`             |    82 |   572 |    868 |
| `references/report-prompt.md`                 |    17 |   121 |    198 |
| `evals/files/ (18 files)`                     |   453 | 1,927 |  3,691 |
| **Total**                                     | 1,039 | 6,573 | 11,284 |

### refactoring-code

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   298 | 2,193 |  3,329 |
| `evals/evals.json`                |    23 |   639 |    926 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    45 |   351 |    512 |
| `references/quality-checklist.md` |    68 |   612 |    817 |
| `references/refactor-sections.md` |   101 |   958 |  1,405 |
| `references/refactoring-rules.md` |   149 | 1,313 |  1,678 |
| **Total**                         |   696 | 6,293 |  9,044 |

### saving-tasks

| File                            | Lines | Words | Tokens |
|---------------------------------|------:|------:|-------:|
| `SKILL.md`                      |    96 |   619 |    933 |
| `evals/evals.json`              |    23 |   401 |    713 |
| `evals/trigger-queries.json`    |    12 |   164 |    285 |
| `references/save-to-files.md`   |    50 |   379 |    630 |
| `references/save-to-tracker.md` |    46 |   397 |    602 |
| **Total**                       |   227 | 1,960 |  3,163 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   329 | 2,214 |  3,590 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   433 |    653 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/commit-groups.md`          |    10 |    80 |    105 |
| `references/package-managers.md`       |    74 |   416 |    725 |
| `references/quality-checklist.md`      |    52 |   341 |    566 |
| `references/update-report-template.md` |   109 |   680 |  1,086 |
| `references/update-rules.md`           |   209 | 1,414 |  2,310 |
| `references/verify-failures.md`        |    15 |   123 |    164 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,055 | 6,788 | 11,362 |

### writing-agent-docs

| File                           | Lines | Words | Tokens |
|--------------------------------|------:|------:|-------:|
| `SKILL.md`                     |   117 |   878 |  1,292 |
| `evals/evals.json`             |    23 |   401 |    631 |
| `evals/trigger-queries.json`   |    12 |   213 |    351 |
| `references/adr-template.md`   |    67 |   412 |    609 |
| `references/audit.md`          |   110 |   818 |  1,241 |
| `references/reference-docs.md` |    13 |   126 |    173 |
| `scripts/audit.mjs`            |   350 | 1,618 |  3,658 |
| **Total**                      |   692 | 4,466 |  7,955 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   221 | 1,480 |  2,109 |
| `evals/evals.json`           |    23 |   348 |    533 |
| `evals/trigger-queries.json` |    12 |   152 |    266 |
| `references/user-run.md`     |    29 |   206 |    284 |
| **Total**                    |   285 | 2,186 |  3,192 |

### writing-glossaries

| File                                     | Lines | Words | Tokens |
|------------------------------------------|------:|------:|-------:|
| `SKILL.md`                               |   202 | 1,587 |  2,141 |
| `evals/evals.json`                       |    23 |   438 |    627 |
| `evals/trigger-queries.json`             |    12 |   208 |    349 |
| `references/glossary-report-template.md` |    19 |   173 |    245 |
| `references/glossary-template.md`        |    29 |   141 |    216 |
| `references/quality-checklist.md`        |    85 |   530 |    889 |
| `references/reference-line.md`           |    15 |   108 |    160 |
| `references/user-run.md`                 |    28 |   181 |    263 |
| **Total**                                |   413 | 3,366 |  4,890 |

### writing-unit-tests

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   207 | 1,530 |  2,081 |
| `evals/evals.json`                     |    23 |   313 |    493 |
| `evals/trigger-queries.json`           |    12 |   159 |    281 |
| `references/characterization-tests.md` |    36 |   306 |    419 |
| `references/checks.md`                 |    29 |   274 |    394 |
| `references/user-run.md`               |    33 |   228 |    312 |
| **Total**                              |   340 | 2,810 |  3,980 |
