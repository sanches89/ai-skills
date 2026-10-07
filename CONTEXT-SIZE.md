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
| analyzing-code       |      77 |    1,302 |      3,009 |       0 |   5,095 |
| breaking-down-tasks  |      70 |    3,206 |        343 |       0 |   4,620 |
| creating-tasks       |      67 |    2,223 |        143 |       0 |   3,332 |
| disambiguating-text  |      72 |    2,109 |      1,819 |       0 |   4,738 |
| finding-code-smells  |      79 |    2,553 |      4,224 |   5,137 |  12,853 |
| finding-dev-commands |      72 |    1,895 |          0 |       0 |   2,693 |
| finding-trackers     |      70 |    1,721 |          0 |       0 |   2,532 |
| formatting-tasks     |      63 |    1,945 |      2,701 |       0 |   5,589 |
| implementing-tasks   |      65 |    3,619 |      1,749 |       0 |   8,650 |
| loading-tasks        |      88 |    1,836 |          0 |       0 |   2,630 |
| measuring-code       |      74 |    2,623 |      5,263 |       0 |   8,909 |
| orchestrating-tasks  |      81 |    4,244 |      2,323 |       0 |   7,630 |
| refactoring-code     |      85 |    3,645 |      4,542 |       0 |   9,376 |
| saving-tasks         |      69 |    2,544 |          0 |       0 |   3,526 |
| updating-packages    |      65 |    4,295 |      4,985 |   1,864 |  12,067 |
| writing-agent-docs   |      96 |    1,694 |      2,250 |   3,658 |   8,543 |
| writing-clean-code   |      83 |    2,984 |          0 |       0 |   3,720 |
| writing-glossaries   |      79 |    3,021 |      1,166 |       0 |   5,115 |
| writing-unit-tests   |      65 |    3,474 |          0 |       0 |   4,242 |
| **All skills**       |   1,420 |   50,933 |     34,517 |  10,659 | 115,860 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   120 |   862 |  1,302 |
| `evals/evals.json`                          |    23 |   312 |    500 |
| `evals/trigger-queries.json`                |    12 |   160 |    284 |
| `references/analysis-rules.md`              |   143 | 1,052 |  1,482 |
| `references/measurement-report-template.md` |    86 |   558 |    953 |
| `references/quality-checklist.md`           |    56 |   341 |    574 |
| **Total**                                   |   440 | 3,285 |  5,095 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   260 | 2,130 |  3,206 |
| `evals/evals.json`                |    23 |   411 |    671 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    36 |   257 |    343 |
| **Total**                         |   331 | 3,034 |  4,620 |

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
| `SKILL.md`                        |   188 | 1,503 |  2,109 |
| `evals/evals.json`                |    23 |   298 |    451 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    71 |   692 |  1,087 |
| `references/quality-checklist.md` |    76 |   443 |    732 |
| **Total**                         |   370 | 3,140 |  4,738 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   225 | 1,660 |  2,553 |
| `evals/evals.json`            |    23 |   434 |    687 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/smell-catalog.md` |   371 | 2,975 |  4,224 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     | 1,031 | 6,740 | 12,853 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   158 | 1,119 |  1,895 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| **Total**                    |   193 | 1,587 |  2,693 |

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
| `references/task-format.md`       |   162 |   786 |  1,363 |
| **Total**                         |   497 | 3,492 |  5,589 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   295 | 2,519 |  3,619 |
| `evals/evals.json`                   |    42 |   538 |  1,060 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    78 |   548 |    823 |
| `references/work-report-template.md` |    90 |   592 |    926 |
| `evals/files/ (16 files)`            |   303 | 1,039 |  1,866 |
| **Total**                            |   820 | 5,411 |  8,650 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   157 | 1,248 |  1,836 |
| `evals/evals.json`           |    23 |   276 |    486 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   192 | 1,675 |  2,630 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   221 | 1,639 |  2,623 |
| `evals/evals.json`               |    23 |   455 |    747 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/measure-tool.md`     |   174 | 1,308 |  2,502 |
| `references/mutation-reports.md` |   129 |   898 |  1,700 |
| `references/test-reports.md`     |    93 |   559 |  1,061 |
| **Total**                        |   652 | 5,029 |  8,909 |

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
| `references/refactor-sections.md` |   104 |   975 |  1,421 |
| `references/refactoring-rules.md` |   154 | 1,323 |  1,684 |
| **Total**                         |   725 | 6,500 |  9,376 |

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
| `SKILL.md`                             |   372 | 2,787 |  4,295 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   410 |    624 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/package-managers.md`       |    76 |   466 |    797 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   113 |   703 |  1,121 |
| `references/update-rules.md`           |   214 | 1,537 |  2,501 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,084 | 7,329 | 12,067 |

### writing-agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   138 | 1,183 |  1,694 |
| `evals/evals.json`           |    23 |   372 |    590 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   124 | 1,013 |  1,542 |
| `scripts/audit.mjs`          |   350 | 1,618 |  3,658 |
| **Total**                    |   737 | 4,866 |  8,543 |

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
| `SKILL.md`                        |   263 | 2,207 |  3,021 |
| `evals/evals.json`                |    23 |   403 |    579 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    92 |   575 |    947 |
| **Total**                         |   418 | 3,533 |  5,115 |

### writing-unit-tests

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   312 | 2,578 |  3,474 |
| `evals/evals.json`           |    23 |   313 |    487 |
| `evals/trigger-queries.json` |    12 |   159 |    281 |
| **Total**                    |   347 | 3,050 |  4,242 |
