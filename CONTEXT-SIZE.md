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
| analyzing-code       |      77 |    1,126 |      2,892 |       0 |   4,803 |
| breaking-down-tasks  |      70 |    2,808 |        291 |       0 |   4,179 |
| creating-tasks       |      67 |    1,790 |         67 |       0 |   2,823 |
| disambiguating-text  |      72 |    1,539 |      2,023 |       0 |   4,373 |
| finding-code-smells  |      79 |    1,858 |      4,226 |   5,137 |  12,179 |
| finding-dev-commands |      72 |    1,397 |        328 |       0 |   2,523 |
| finding-trackers     |      70 |      910 |        660 |       0 |   2,405 |
| formatting-tasks     |      63 |    1,087 |      2,966 |       0 |   4,996 |
| implementing-tasks   |      65 |    2,728 |      2,309 |       0 |   8,357 |
| loading-tasks        |      88 |    1,523 |          0 |       0 |   2,332 |
| measuring-code       |      74 |    2,190 |      4,717 |       0 |   7,945 |
| orchestrating-tasks  |      78 |    3,636 |      2,526 |       0 |  11,284 |
| refactoring-code     |      85 |    3,294 |      4,406 |       0 |   9,003 |
| saving-tasks         |      69 |      914 |      1,232 |       0 |   3,144 |
| updating-packages    |      65 |    3,584 |      4,956 |   1,864 |  11,356 |
| writing-agent-docs   |      96 |    1,273 |      1,954 |   3,658 |   7,867 |
| writing-clean-code   |      79 |    2,080 |        271 |       0 |   3,133 |
| writing-glossaries   |      79 |    2,130 |      1,773 |       0 |   4,879 |
| writing-unit-tests   |      65 |    2,075 |      1,125 |       0 |   3,974 |
| **All skills**       |   1,413 |   37,942 |     38,722 |  10,659 | 111,555 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   110 |   726 |  1,126 |
| `evals/evals.json`                          |    23 |   313 |    501 |
| `evals/trigger-queries.json`                |    12 |   160 |    284 |
| `references/analysis-rules.md`              |   138 |   995 |  1,397 |
| `references/measurement-report-template.md` |    86 |   548 |    938 |
| `references/quality-checklist.md`           |    53 |   331 |    557 |
| **Total**                                   |   422 | 3,073 |  4,803 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   240 | 1,824 |  2,808 |
| `evals/evals.json`                |    23 |   420 |    680 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    30 |   217 |    291 |
| **Total**                         |   305 | 2,697 |  4,179 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   174 | 1,180 |  1,790 |
| `evals/evals.json`                |    23 |   363 |    562 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    14 |    51 |     67 |
| **Total**                         |   223 | 1,845 |  2,823 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   156 | 1,094 |  1,539 |
| `evals/evals.json`                |    23 |   299 |    452 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    66 |   639 |  1,000 |
| `references/quality-checklist.md` |    71 |   412 |    693 |
| `references/user-run.md`          |    37 |   228 |    330 |
| **Total**                         |   365 | 2,876 |  4,373 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   184 | 1,183 |  1,858 |
| `evals/evals.json`            |    23 |   450 |    706 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/finding-entry.md` |    21 |   132 |    217 |
| `references/smell-catalog.md` |   355 | 2,817 |  4,009 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     |   995 | 6,253 | 12,179 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   125 |   838 |  1,397 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| `references/runners.md`      |    28 |   167 |    328 |
| **Total**                    |   188 | 1,473 |  2,523 |

### finding-trackers

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |    92 |   604 |    910 |
| `evals/evals.json`           |    23 |   342 |    550 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| `references/gh-map.md`       |    24 |   158 |    326 |
| `references/mcp-map.md`      |    25 |   238 |    334 |
| **Total**                    |   176 | 1,520 |  2,405 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   108 |   723 |  1,087 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    30 |   162 |    263 |
| `references/quality-checklist.md` |    86 |   629 |    970 |
| `references/task-format.md`       |   148 |   647 |  1,125 |
| `references/user-run.md`          |    31 |   200 |    293 |
| `references/writing-rules.md`     |    24 |   224 |    315 |
| **Total**                         |   462 | 3,111 |  4,996 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   245 | 1,919 |  2,728 |
| `evals/evals.json`                   |    42 |   555 |  1,090 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    79 |   564 |    842 |
| `references/target-with-subtasks.md` |    37 |   340 |    546 |
| `references/work-report-template.md` |    92 |   586 |    921 |
| `evals/files/ (16 files)`            |   298 | 1,044 |  1,874 |
| **Total**                            |   805 | 5,183 |  8,357 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   139 | 1,009 |  1,523 |
| `evals/evals.json`           |    23 |   280 |    501 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   174 | 1,440 |  2,332 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   187 | 1,361 |  2,190 |
| `evals/evals.json`               |    23 |   468 |    762 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/ignore-globs.md`     |    14 |    62 |    145 |
| `references/measure-tool.md`     |   144 | 1,045 |  2,074 |
| `references/mutation-reports.md` |   116 |   789 |  1,538 |
| `references/test-reports.md`     |    88 |   485 |    960 |
| **Total**                        |   584 | 4,380 |  7,945 |

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
| `SKILL.md`                        |   295 | 2,166 |  3,294 |
| `evals/evals.json`                |    23 |   639 |    926 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    45 |   351 |    512 |
| `references/quality-checklist.md` |    68 |   612 |    817 |
| `references/refactor-sections.md` |   101 |   958 |  1,405 |
| `references/refactoring-rules.md` |   149 | 1,306 |  1,672 |
| **Total**                         |   693 | 6,259 |  9,003 |

### saving-tasks

| File                            | Lines | Words | Tokens |
|---------------------------------|------:|------:|-------:|
| `SKILL.md`                      |    96 |   605 |    914 |
| `evals/evals.json`              |    23 |   401 |    713 |
| `evals/trigger-queries.json`    |    12 |   164 |    285 |
| `references/save-to-files.md`   |    50 |   379 |    630 |
| `references/save-to-tracker.md` |    46 |   397 |    602 |
| **Total**                       |   227 | 1,946 |  3,144 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   328 | 2,210 |  3,584 |
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
| **Total**                              | 1,054 | 6,784 | 11,356 |

### writing-agent-docs

| File                           | Lines | Words | Tokens |
|--------------------------------|------:|------:|-------:|
| `SKILL.md`                     |   116 |   866 |  1,273 |
| `evals/evals.json`             |    23 |   401 |    631 |
| `evals/trigger-queries.json`   |    12 |   213 |    351 |
| `references/adr-template.md`   |    63 |   367 |    546 |
| `references/audit.md`          |   109 |   815 |  1,235 |
| `references/reference-docs.md` |    13 |   126 |    173 |
| `scripts/audit.mjs`            |   350 | 1,618 |  3,658 |
| **Total**                      |   686 | 4,406 |  7,867 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   220 | 1,465 |  2,080 |
| `evals/evals.json`           |    23 |   332 |    516 |
| `evals/trigger-queries.json` |    12 |   152 |    266 |
| `references/user-run.md`     |    29 |   194 |    271 |
| **Total**                    |   284 | 2,143 |  3,133 |

### writing-glossaries

| File                                     | Lines | Words | Tokens |
|------------------------------------------|------:|------:|-------:|
| `SKILL.md`                               |   201 | 1,580 |  2,130 |
| `evals/evals.json`                       |    23 |   438 |    627 |
| `evals/trigger-queries.json`             |    12 |   208 |    349 |
| `references/glossary-report-template.md` |    19 |   173 |    245 |
| `references/glossary-template.md`        |    29 |   141 |    216 |
| `references/quality-checklist.md`        |    85 |   530 |    889 |
| `references/reference-line.md`           |    15 |   108 |    160 |
| `references/user-run.md`                 |    28 |   181 |    263 |
| **Total**                                |   412 | 3,359 |  4,879 |

### writing-unit-tests

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   206 | 1,526 |  2,075 |
| `evals/evals.json`                     |    23 |   313 |    493 |
| `evals/trigger-queries.json`           |    12 |   159 |    281 |
| `references/characterization-tests.md` |    36 |   306 |    419 |
| `references/checks.md`                 |    29 |   274 |    394 |
| `references/user-run.md`               |    33 |   228 |    312 |
| **Total**                              |   339 | 2,806 |  3,974 |
