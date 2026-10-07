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
tier costs 1,420 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill                | Startup | SKILL.md | References | Scripts |   Total |
|----------------------|--------:|---------:|-----------:|--------:|--------:|
| analyzing-code       |      77 |    1,304 |      3,019 |       0 |   5,108 |
| breaking-down-tasks  |      70 |    3,223 |        347 |       0 |   4,641 |
| creating-tasks       |      67 |    2,223 |        143 |       0 |   3,332 |
| disambiguating-text  |      72 |    2,113 |      1,820 |       0 |   4,744 |
| finding-code-smells  |      79 |    2,557 |      4,234 |   5,137 |  12,868 |
| finding-dev-commands |      72 |    1,919 |          0 |       0 |   2,717 |
| finding-trackers     |      70 |    1,721 |          0 |       0 |   2,532 |
| formatting-tasks     |      63 |    1,945 |      2,706 |       0 |   5,594 |
| implementing-tasks   |      65 |    3,625 |      1,750 |       0 |   8,657 |
| loading-tasks        |      88 |    1,840 |          0 |       0 |   2,645 |
| measuring-code       |      74 |    2,623 |      5,268 |       0 |   8,914 |
| orchestrating-tasks  |      81 |    4,244 |      2,323 |       0 |   7,630 |
| refactoring-code     |      85 |    3,645 |      4,545 |       0 |   9,379 |
| saving-tasks         |      69 |    2,544 |          0 |       0 |   3,526 |
| updating-packages    |      65 |    4,299 |      4,992 |   1,864 |  12,084 |
| writing-agent-docs   |      96 |    1,695 |      2,250 |   3,658 |   8,544 |
| writing-clean-code   |      83 |    2,984 |          0 |       0 |   3,720 |
| writing-glossaries   |      79 |    3,033 |      1,161 |       0 |   5,123 |
| writing-unit-tests   |      65 |    3,473 |          0 |       0 |   4,241 |
| **All skills**       |   1,420 |   51,010 |     34,558 |  10,659 | 115,999 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   120 |   864 |  1,304 |
| `evals/evals.json`                          |    23 |   313 |    501 |
| `evals/trigger-queries.json`                |    12 |   160 |    284 |
| `references/analysis-rules.md`              |   142 | 1,062 |  1,489 |
| `references/measurement-report-template.md` |    86 |   560 |    955 |
| `references/quality-checklist.md`           |    56 |   343 |    575 |
| **Total**                                   |   439 | 3,302 |  5,108 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   261 | 2,137 |  3,223 |
| `evals/evals.json`                |    23 |   411 |    671 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    36 |   261 |    347 |
| **Total**                         |   332 | 3,045 |  4,641 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   192 | 1,505 |  2,223 |
| `evals/evals.json`                |    23 |   363 |    562 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    21 |   108 |    143 |
| **Total**                         |   248 | 2,227 |  3,332 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   189 | 1,505 |  2,113 |
| `evals/evals.json`                |    23 |   299 |    452 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    72 |   692 |  1,088 |
| `references/quality-checklist.md` |    76 |   443 |    732 |
| **Total**                         |   372 | 3,143 |  4,744 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   225 | 1,664 |  2,557 |
| `evals/evals.json`            |    23 |   435 |    688 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/smell-catalog.md` |   371 | 2,985 |  4,234 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     | 1,031 | 6,755 | 12,868 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   159 | 1,132 |  1,919 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| **Total**                    |   194 | 1,600 |  2,717 |

### finding-trackers

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   145 | 1,147 |  1,721 |
| `evals/evals.json`           |    23 |   326 |    526 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| **Total**                    |   180 | 1,651 |  2,532 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   171 | 1,322 |  1,945 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    37 |   228 |    369 |
| `references/quality-checklist.md` |    92 |   630 |    969 |
| `references/task-format.md`       |   162 |   788 |  1,368 |
| **Total**                         |   497 | 3,494 |  5,594 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   295 | 2,522 |  3,625 |
| `evals/evals.json`                   |    42 |   538 |  1,060 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    78 |   550 |    825 |
| `references/work-report-template.md` |    90 |   591 |    925 |
| `evals/files/ (16 files)`            |   303 | 1,039 |  1,866 |
| **Total**                            |   820 | 5,415 |  8,657 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   157 | 1,249 |  1,840 |
| `evals/evals.json`           |    23 |   277 |    497 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   192 | 1,677 |  2,645 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   221 | 1,639 |  2,623 |
| `evals/evals.json`               |    23 |   455 |    747 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/measure-tool.md`     |   174 | 1,308 |  2,502 |
| `references/mutation-reports.md` |   129 |   903 |  1,705 |
| `references/test-reports.md`     |    93 |   559 |  1,061 |
| **Total**                        |   652 | 5,034 |  8,914 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   325 | 2,735 |  4,244 |
| `evals/evals.json`                            |    23 |   427 |    683 |
| `evals/trigger-queries.json`                  |    12 |   206 |    380 |
| `references/job-prompt-template.md`           |    41 |   259 |    347 |
| `references/orchestration-report-template.md` |   104 |   669 |  1,092 |
| `references/quality-checklist.md`             |    88 |   577 |    884 |
| **Total**                                     |   593 | 4,873 |  7,630 |

### refactoring-code

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   309 | 2,388 |  3,645 |
| `evals/evals.json`                |    23 |   546 |    812 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    53 |   430 |    624 |
| `references/quality-checklist.md` |    70 |   611 |    813 |
| `references/refactor-sections.md` |   104 |   977 |  1,424 |
| `references/refactoring-rules.md` |   154 | 1,323 |  1,684 |
| **Total**                         |   725 | 6,502 |  9,379 |

### saving-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   201 | 1,662 |  2,544 |
| `evals/evals.json`           |    23 |   389 |    697 |
| `evals/trigger-queries.json` |    12 |   164 |    285 |
| **Total**                    |   236 | 2,215 |  3,526 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   373 | 2,791 |  4,299 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   414 |    630 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/package-managers.md`       |    76 |   466 |    797 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   114 |   709 |  1,129 |
| `references/update-rules.md`           |   214 | 1,536 |  2,500 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,086 | 7,342 | 12,084 |

### writing-agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   138 | 1,184 |  1,695 |
| `evals/evals.json`           |    23 |   372 |    590 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   124 | 1,013 |  1,542 |
| `scripts/audit.mjs`          |   350 | 1,618 |  3,658 |
| **Total**                    |   737 | 4,867 |  8,544 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   383 | 1,998 |  2,984 |
| `evals/evals.json`           |    23 |   293 |    470 |
| `evals/trigger-queries.json` |    12 |   152 |    266 |
| **Total**                    |   418 | 2,443 |  3,720 |

### writing-glossaries

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   264 | 2,217 |  3,033 |
| `evals/evals.json`                |    23 |   404 |    580 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    93 |   570 |    942 |
| **Total**                         |   420 | 3,539 |  5,123 |

### writing-unit-tests

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   312 | 2,577 |  3,473 |
| `evals/evals.json`           |    23 |   313 |    487 |
| `evals/trigger-queries.json` |    12 |   159 |    281 |
| **Total**                    |   347 | 3,049 |  4,241 |
