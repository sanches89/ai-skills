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
tier costs 1,416 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill                | Startup | SKILL.md | References | Scripts |   Total |
|----------------------|--------:|---------:|-----------:|--------:|--------:|
| analyzing-code       |      77 |    1,125 |      2,903 |       0 |   4,813 |
| breaking-down-tasks  |      70 |    2,829 |        292 |       0 |   4,201 |
| creating-tasks       |      67 |    1,796 |         69 |       0 |   2,831 |
| disambiguating-text  |      72 |    1,554 |      2,024 |       0 |   4,389 |
| finding-code-smells  |      79 |    1,875 |      4,232 |   5,137 |  12,202 |
| finding-dev-commands |      72 |    1,412 |        328 |       0 |   2,538 |
| finding-trackers     |      70 |      916 |        662 |       0 |   2,413 |
| formatting-tasks     |      63 |    1,088 |      2,956 |       0 |   4,987 |
| implementing-tasks   |      65 |    2,747 |      2,249 |       0 |   8,320 |
| loading-tasks        |      88 |    1,532 |          0 |       0 |   2,341 |
| measuring-code       |      74 |    2,185 |      4,733 |       0 |   7,956 |
| orchestrating-tasks  |      81 |    3,672 |      2,544 |       0 |  11,334 |
| refactoring-code     |      85 |    3,305 |      4,411 |       0 |   9,019 |
| saving-tasks         |      69 |      916 |      1,236 |       0 |   3,150 |
| updating-packages    |      65 |    3,555 |      4,940 |   1,864 |  11,301 |
| writing-agent-docs   |      96 |    1,276 |      1,954 |   3,658 |   7,870 |
| writing-clean-code   |      79 |    2,109 |        254 |       0 |   3,145 |
| writing-glossaries   |      79 |    2,164 |      1,782 |       0 |   4,922 |
| writing-unit-tests   |      65 |    2,074 |      1,114 |       0 |   3,956 |
| **All skills**       |   1,416 |   38,130 |     38,683 |  10,659 | 111,688 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   109 |   726 |  1,125 |
| `evals/evals.json`                          |    23 |   313 |    501 |
| `evals/trigger-queries.json`                |    12 |   160 |    284 |
| `references/analysis-rules.md`              |   135 |   995 |  1,400 |
| `references/measurement-report-template.md` |    84 |   548 |    940 |
| `references/quality-checklist.md`           |    55 |   331 |    563 |
| **Total**                                   |   418 | 3,073 |  4,813 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   236 | 1,834 |  2,829 |
| `evals/evals.json`                |    23 |   420 |    680 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    31 |   216 |    292 |
| **Total**                         |   302 | 2,706 |  4,201 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   167 | 1,181 |  1,796 |
| `evals/evals.json`                |    23 |   363 |    562 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    15 |    51 |     69 |
| **Total**                         |   217 | 1,846 |  2,831 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   156 | 1,102 |  1,554 |
| `evals/evals.json`                |    23 |   299 |    452 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    67 |   639 |  1,006 |
| `references/quality-checklist.md` |    72 |   412 |    694 |
| `references/user-run.md`          |    30 |   223 |    324 |
| **Total**                         |   360 | 2,879 |  4,389 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   184 | 1,183 |  1,875 |
| `evals/evals.json`            |    23 |   450 |    706 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/finding-entry.md` |    21 |   132 |    217 |
| `references/smell-catalog.md` |   362 | 2,817 |  4,015 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     | 1,002 | 6,253 | 12,202 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   128 |   842 |  1,412 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| `references/runners.md`      |    27 |   167 |    328 |
| **Total**                    |   190 | 1,477 |  2,538 |

### finding-trackers

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |    93 |   608 |    916 |
| `evals/evals.json`           |    23 |   342 |    550 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| `references/gh-map.md`       |    23 |   158 |    325 |
| `references/mcp-map.md`      |    25 |   238 |    337 |
| **Total**                    |   176 | 1,524 |  2,413 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   112 |   720 |  1,088 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    30 |   162 |    263 |
| `references/quality-checklist.md` |    89 |   629 |    971 |
| `references/task-format.md`       |   147 |   647 |  1,126 |
| `references/user-run.md`          |    28 |   191 |    280 |
| `references/writing-rules.md`     |    24 |   224 |    316 |
| **Total**                         |   465 | 3,099 |  4,987 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   243 | 1,922 |  2,747 |
| `evals/evals.json`                   |    42 |   555 |  1,090 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    79 |   564 |    842 |
| `references/target-with-subtasks.md` |    32 |   300 |    487 |
| `references/work-report-template.md` |    90 |   586 |    920 |
| `evals/files/ (16 files)`            |   303 | 1,044 |  1,878 |
| **Total**                            |   801 | 5,146 |  8,320 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   142 | 1,009 |  1,532 |
| `evals/evals.json`           |    23 |   280 |    501 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   177 | 1,440 |  2,341 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   191 | 1,354 |  2,185 |
| `evals/evals.json`               |    23 |   468 |    762 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/ignore-globs.md`     |    14 |    62 |    145 |
| `references/measure-tool.md`     |   145 | 1,045 |  2,088 |
| `references/mutation-reports.md` |   118 |   789 |  1,543 |
| `references/test-reports.md`     |    86 |   485 |    957 |
| **Total**                        |   589 | 4,373 |  7,956 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   284 | 2,351 |  3,672 |
| `evals/evals.json`                            |    43 |   489 |  1,051 |
| `evals/trigger-queries.json`                  |    12 |   206 |    380 |
| `references/job-prompt-template.md`           |    37 |   200 |    284 |
| `references/orchestration-report-template.md` |   102 |   647 |  1,061 |
| `references/plan-template.md`                 |    17 |    68 |    122 |
| `references/quality-checklist.md`             |    87 |   572 |    879 |
| `references/report-prompt.md`                 |    17 |   121 |    198 |
| `evals/files/ (18 files)`                     |   459 | 1,927 |  3,687 |
| **Total**                                     | 1,058 | 6,581 | 11,334 |

### refactoring-code

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   292 | 2,156 |  3,305 |
| `evals/evals.json`                |    23 |   639 |    926 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    46 |   351 |    515 |
| `references/quality-checklist.md` |    71 |   612 |    825 |
| `references/refactor-sections.md` |   103 |   958 |  1,403 |
| `references/refactoring-rules.md` |   151 | 1,299 |  1,668 |
| **Total**                         |   698 | 6,242 |  9,019 |

### saving-tasks

| File                            | Lines | Words | Tokens |
|---------------------------------|------:|------:|-------:|
| `SKILL.md`                      |    97 |   605 |    916 |
| `evals/evals.json`              |    23 |   401 |    713 |
| `evals/trigger-queries.json`    |    12 |   164 |    285 |
| `references/save-to-files.md`   |    50 |   379 |    636 |
| `references/save-to-tracker.md` |    44 |   395 |    600 |
| **Total**                       |   226 | 1,944 |  3,150 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   321 | 2,178 |  3,555 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   425 |    643 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/commit-groups.md`          |     9 |    80 |    105 |
| `references/package-managers.md`       |    72 |   416 |    728 |
| `references/quality-checklist.md`      |    52 |   341 |    565 |
| `references/update-report-template.md` |   110 |   680 |  1,099 |
| `references/update-rules.md`           |   203 | 1,384 |  2,280 |
| `references/verify-failures.md`        |    14 |   123 |    163 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,038 | 6,714 | 11,301 |

### writing-agent-docs

| File                           | Lines | Words | Tokens |
|--------------------------------|------:|------:|-------:|
| `SKILL.md`                     |   112 |   861 |  1,276 |
| `evals/evals.json`             |    23 |   401 |    631 |
| `evals/trigger-queries.json`   |    12 |   213 |    351 |
| `references/adr-template.md`   |    65 |   367 |    551 |
| `references/audit.md`          |   104 |   810 |  1,230 |
| `references/reference-docs.md` |    13 |   126 |    173 |
| `scripts/audit.mjs`            |   350 | 1,618 |  3,658 |
| **Total**                      |   679 | 4,396 |  7,870 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   222 | 1,486 |  2,109 |
| `evals/evals.json`           |    23 |   332 |    516 |
| `evals/trigger-queries.json` |    12 |   152 |    266 |
| `references/user-run.md`     |    27 |   181 |    254 |
| **Total**                    |   284 | 2,151 |  3,145 |

### writing-glossaries

| File                                     | Lines | Words | Tokens |
|------------------------------------------|------:|------:|-------:|
| `SKILL.md`                               |   208 | 1,588 |  2,164 |
| `evals/evals.json`                       |    23 |   438 |    627 |
| `evals/trigger-queries.json`             |    12 |   208 |    349 |
| `references/glossary-report-template.md` |    20 |   173 |    250 |
| `references/glossary-template.md`        |    29 |   141 |    218 |
| `references/quality-checklist.md`        |    88 |   530 |    893 |
| `references/reference-line.md`           |    15 |   108 |    158 |
| `references/user-run.md`                 |    26 |   181 |    263 |
| **Total**                                |   421 | 3,367 |  4,922 |

### writing-unit-tests

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   207 | 1,523 |  2,074 |
| `evals/evals.json`                     |    23 |   313 |    487 |
| `evals/trigger-queries.json`           |    12 |   159 |    281 |
| `references/characterization-tests.md` |    34 |   306 |    416 |
| `references/checks.md`                 |    30 |   264 |    385 |
| `references/user-run.md`               |    32 |   228 |    313 |
| **Total**                              |   338 | 2,793 |  3,956 |
