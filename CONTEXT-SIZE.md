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
| analyzing-code       |      77 |    1,106 |      2,894 |       0 |   4,785 |
| breaking-down-tasks  |      70 |    2,810 |        292 |       0 |   4,182 |
| creating-tasks       |      67 |    1,786 |         69 |       0 |   2,821 |
| disambiguating-text  |      72 |    1,554 |      2,013 |       0 |   4,378 |
| finding-code-smells  |      79 |    2,061 |      4,015 |   5,137 |  12,171 |
| finding-dev-commands |      72 |    1,689 |          0 |       0 |   2,487 |
| finding-trackers     |      70 |    1,507 |          0 |       0 |   2,342 |
| formatting-tasks     |      63 |    1,391 |      2,640 |       0 |   4,974 |
| implementing-tasks   |      65 |    3,219 |      1,759 |       0 |   8,302 |
| loading-tasks        |      88 |    1,532 |          0 |       0 |   2,341 |
| measuring-code       |      74 |    2,306 |      4,588 |       0 |   7,932 |
| orchestrating-tasks  |      81 |    3,954 |      2,224 |       0 |  11,296 |
| refactoring-code     |      85 |    3,305 |      4,411 |       0 |   9,019 |
| saving-tasks         |      69 |    2,091 |          0 |       0 |   3,089 |
| updating-packages    |      65 |    3,771 |      4,672 |   1,864 |  11,249 |
| writing-agent-docs   |      96 |    1,521 |      1,578 |   3,658 |   7,739 |
| writing-clean-code   |      79 |    2,109 |        254 |       0 |   3,145 |
| writing-glossaries   |      79 |    2,515 |      1,368 |       0 |   4,859 |
| writing-unit-tests   |      65 |    2,828 |        305 |       0 |   3,901 |
| **All skills**       |   1,416 |   43,055 |     33,082 |  10,659 | 111,012 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   108 |   712 |  1,106 |
| `evals/evals.json`                          |    23 |   313 |    501 |
| `evals/trigger-queries.json`                |    12 |   160 |    284 |
| `references/analysis-rules.md`              |   134 |   989 |  1,391 |
| `references/measurement-report-template.md` |    84 |   548 |    940 |
| `references/quality-checklist.md`           |    55 |   331 |    563 |
| **Total**                                   |   416 | 3,053 |  4,785 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   235 | 1,823 |  2,810 |
| `evals/evals.json`                |    23 |   420 |    680 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    31 |   216 |    292 |
| **Total**                         |   301 | 2,695 |  4,182 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   167 | 1,173 |  1,786 |
| `evals/evals.json`                |    23 |   363 |    562 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    15 |    51 |     69 |
| **Total**                         |   217 | 1,838 |  2,821 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   156 | 1,102 |  1,554 |
| `evals/evals.json`                |    23 |   299 |    452 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    67 |   639 |  1,006 |
| `references/quality-checklist.md` |    72 |   412 |    694 |
| `references/user-run.md`          |    29 |   216 |    313 |
| **Total**                         |   359 | 2,872 |  4,378 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   198 | 1,306 |  2,061 |
| `evals/evals.json`            |    23 |   450 |    706 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/smell-catalog.md` |   362 | 2,817 |  4,015 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     |   995 | 6,244 | 12,171 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   146 |   980 |  1,689 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| **Total**                    |   181 | 1,448 |  2,487 |

### finding-trackers

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   134 |   953 |  1,507 |
| `evals/evals.json`           |    23 |   342 |    550 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| **Total**                    |   169 | 1,473 |  2,342 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   133 |   940 |  1,391 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    30 |   162 |    263 |
| `references/quality-checklist.md` |    89 |   629 |    971 |
| `references/task-format.md`       |   147 |   647 |  1,126 |
| `references/user-run.md`          |    28 |   191 |    280 |
| **Total**                         |   462 | 3,095 |  4,974 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   274 | 2,216 |  3,219 |
| `evals/evals.json`                   |    42 |   555 |  1,090 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    79 |   564 |    842 |
| `references/work-report-template.md` |    90 |   583 |    917 |
| `evals/files/ (16 files)`            |   303 | 1,044 |  1,878 |
| **Total**                            |   800 | 5,137 |  8,302 |

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
| `SKILL.md`                       |   202 | 1,405 |  2,306 |
| `evals/evals.json`               |    23 |   468 |    762 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/measure-tool.md`     |   145 | 1,045 |  2,088 |
| `references/mutation-reports.md` |   118 |   789 |  1,543 |
| `references/test-reports.md`     |    86 |   485 |    957 |
| **Total**                        |   586 | 4,362 |  7,932 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   310 | 2,515 |  3,954 |
| `evals/evals.json`                            |    43 |   489 |  1,051 |
| `evals/trigger-queries.json`                  |    12 |   206 |    380 |
| `references/job-prompt-template.md`           |    37 |   200 |    284 |
| `references/orchestration-report-template.md` |   102 |   647 |  1,061 |
| `references/quality-checklist.md`             |    87 |   572 |    879 |
| `evals/files/ (18 files)`                     |   459 | 1,927 |  3,687 |
| **Total**                                     | 1,050 | 6,556 | 11,296 |

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

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   173 | 1,341 |  2,091 |
| `evals/evals.json`           |    23 |   401 |    713 |
| `evals/trigger-queries.json` |    12 |   164 |    285 |
| **Total**                    |   208 | 1,906 |  3,089 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   337 | 2,354 |  3,771 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   425 |    643 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/package-managers.md`       |    72 |   416 |    728 |
| `references/quality-checklist.md`      |    52 |   341 |    565 |
| `references/update-report-template.md` |   110 |   680 |  1,099 |
| `references/update-rules.md`           |   203 | 1,384 |  2,280 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,031 | 6,687 | 11,249 |

### writing-agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   130 | 1,048 |  1,521 |
| `evals/evals.json`           |    23 |   401 |    631 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    52 |   262 |    407 |
| `references/audit.md`        |    98 |   781 |  1,171 |
| `scripts/audit.mjs`          |   350 | 1,618 |  3,658 |
| **Total**                    |   665 | 4,323 |  7,739 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   222 | 1,486 |  2,109 |
| `evals/evals.json`           |    23 |   332 |    516 |
| `evals/trigger-queries.json` |    12 |   152 |    266 |
| `references/user-run.md`     |    27 |   181 |    254 |
| **Total**                    |   284 | 2,151 |  3,145 |

### writing-glossaries

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   235 | 1,833 |  2,515 |
| `evals/evals.json`                |    23 |   438 |    627 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    29 |   141 |    218 |
| `references/quality-checklist.md` |    88 |   530 |    893 |
| `references/user-run.md`          |    26 |   176 |    257 |
| **Total**                         |   413 | 3,326 |  4,859 |

### writing-unit-tests

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   271 | 2,078 |  2,828 |
| `evals/evals.json`           |    23 |   313 |    487 |
| `evals/trigger-queries.json` |    12 |   159 |    281 |
| `references/user-run.md`     |    31 |   224 |    305 |
| **Total**                    |   337 | 2,774 |  3,901 |
