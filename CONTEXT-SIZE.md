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
tier costs 1,383 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill                | Startup | SKILL.md | References | Scripts |   Total |
|----------------------|--------:|---------:|-----------:|--------:|--------:|
| analyzing-code       |      76 |    1,309 |      2,899 |       0 |   5,002 |
| breaking-down-tasks  |      74 |    3,124 |        536 |       0 |   4,743 |
| creating-tasks       |      67 |    2,170 |        249 |       0 |   3,362 |
| disambiguating-text  |      72 |    1,955 |      1,819 |       0 |   4,584 |
| finding-code-smells  |      74 |    2,384 |      4,031 |   4,962 |  12,233 |
| finding-dev-commands |      72 |    1,897 |          0 |       0 |   2,695 |
| finding-trackers     |      70 |    1,551 |          0 |       0 |   2,346 |
| formatting-tasks     |      63 |    1,881 |      2,709 |       0 |   5,512 |
| implementing-tasks   |      65 |    3,482 |      1,660 |       0 |   8,421 |
| loading-tasks        |      86 |    1,726 |          0 |       0 |   2,520 |
| measuring-code       |      64 |    2,545 |      5,055 |       0 |   8,591 |
| orchestrating-tasks  |      78 |    3,749 |      2,134 |       0 |   6,872 |
| refactoring-code     |      85 |    3,363 |      4,510 |       0 |   9,027 |
| saving-tasks         |      69 |    2,258 |          0 |       0 |   3,209 |
| updating-packages    |      69 |    4,125 |      4,948 |   1,864 |  11,814 |
| writing-agent-docs   |      80 |    1,434 |      2,164 |   3,582 |   8,121 |
| writing-clean-code   |      75 |    2,883 |          0 |       0 |   3,613 |
| writing-glossaries   |      79 |    3,008 |      1,135 |       0 |   5,071 |
| writing-unit-tests   |      65 |    3,286 |          0 |       0 |   4,074 |
| **All skills**       |   1,383 |   48,130 |     33,849 |  10,408 | 111,810 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   121 |   867 |  1,309 |
| `agents/openai.yaml`                        |     2 |     3 |     11 |
| `evals/evals.json`                          |    23 |   312 |    500 |
| `evals/trigger-queries.json`                |    12 |   161 |    283 |
| `references/analysis-rules.md`              |   135 |   975 |  1,373 |
| `references/measurement-report-template.md` |    85 |   557 |    950 |
| `references/quality-checklist.md`           |    56 |   343 |    576 |
| **Total**                                   |   434 | 3,218 |  5,002 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   252 | 2,099 |  3,124 |
| `evals/evals.json`                |    23 |   425 |    681 |
| `evals/trigger-queries.json`      |    12 |   237 |    402 |
| `references/quality-checklist.md` |    52 |   406 |    536 |
| **Total**                         |   339 | 3,167 |  4,743 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   188 | 1,482 |  2,170 |
| `evals/evals.json`                |    23 |   349 |    539 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    29 |   190 |    249 |
| **Total**                         |   252 | 2,272 |  3,362 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   173 | 1,383 |  1,955 |
| `evals/evals.json`                |    23 |   298 |    451 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    71 |   692 |  1,087 |
| `references/quality-checklist.md` |    76 |   443 |    732 |
| **Total**                         |   355 | 3,020 |  4,584 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   215 | 1,549 |  2,384 |
| `evals/evals.json`            |    23 |   373 |    604 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/smell-catalog.md` |   359 | 2,836 |  4,031 |
| `scripts/scan.mjs`            |   387 | 1,403 |  4,962 |
| **Total**                     |   996 | 6,304 | 12,233 |

### finding-dev-commands

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   158 | 1,121 |  1,897 |
| `evals/evals.json`           |    23 |   305 |    523 |
| `evals/trigger-queries.json` |    12 |   163 |    275 |
| **Total**                    |   193 | 1,589 |  2,695 |

### finding-trackers

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   134 | 1,042 |  1,551 |
| `evals/evals.json`           |    23 |   314 |    510 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| **Total**                    |   169 | 1,534 |  2,346 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   166 | 1,296 |  1,881 |
| `evals/evals.json`                |    23 |   314 |    570 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    37 |   228 |    369 |
| `references/quality-checklist.md` |    93 |   635 |    977 |
| `references/task-format.md`       |   162 |   786 |  1,363 |
| **Total**                         |   493 | 3,466 |  5,512 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   284 | 2,429 |  3,482 |
| `evals/evals.json`                   |    42 |   537 |  1,057 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    74 |   504 |    764 |
| `references/work-report-template.md` |    88 |   579 |    896 |
| `evals/files/ (16 files)`            |   303 | 1,039 |  1,866 |
| **Total**                            |   803 | 5,263 |  8,421 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   151 | 1,179 |  1,726 |
| `evals/evals.json`           |    23 |   276 |    486 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   186 | 1,606 |  2,520 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   218 | 1,580 |  2,545 |
| `evals/evals.json`               |    23 |   433 |    715 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/measure-tool.md`     |   166 | 1,252 |  2,345 |
| `references/mutation-reports.md` |   126 |   889 |  1,688 |
| `references/test-reports.md`     |    91 |   542 |  1,022 |
| **Total**                        |   636 | 4,866 |  8,591 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   297 | 2,409 |  3,749 |
| `evals/evals.json`                            |    23 |   375 |    614 |
| `evals/trigger-queries.json`                  |    12 |   202 |    375 |
| `references/job-prompt-template.md`           |    41 |   259 |    342 |
| `references/orchestration-report-template.md` |    97 |   621 |  1,005 |
| `references/quality-checklist.md`             |    83 |   520 |    787 |
| **Total**                                     |   553 | 4,386 |  6,872 |

### refactoring-code

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   290 | 2,201 |  3,363 |
| `evals/evals.json`                |    23 |   518 |    777 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    51 |   403 |    586 |
| `references/quality-checklist.md` |    65 |   566 |    752 |
| `references/refactor-sections.md` |   105 |   975 |  1,418 |
| `references/refactoring-rules.md` |   162 | 1,377 |  1,754 |
| **Total**                         |   708 | 6,267 |  9,027 |

### saving-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   181 | 1,474 |  2,258 |
| `evals/evals.json`           |    23 |   370 |    666 |
| `evals/trigger-queries.json` |    12 |   164 |    285 |
| **Total**                    |   216 | 2,008 |  3,209 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   364 | 2,672 |  4,125 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   372 |    580 |
| `evals/trigger-queries.json`           |    12 |   164 |    286 |
| `references/package-managers.md`       |    73 |   464 |    829 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   112 |   694 |  1,109 |
| `references/update-rules.md`           |   211 | 1,495 |  2,444 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,069 | 7,124 | 11,814 |

### writing-agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   117 |   985 |  1,434 |
| `evals/evals.json`           |    23 |   372 |    590 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   120 |   969 |  1,456 |
| `scripts/audit.mjs`          |   346 | 1,576 |  3,582 |
| **Total**                    |   708 | 4,582 |  8,121 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   379 | 1,903 |  2,883 |
| `evals/evals.json`           |    23 |   290 |    466 |
| `evals/trigger-queries.json` |    12 |   150 |    264 |
| **Total**                    |   414 | 2,343 |  3,613 |

### writing-glossaries

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   262 | 2,194 |  3,008 |
| `evals/evals.json`                |    23 |   403 |    579 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   557 |    916 |
| **Total**                         |   416 | 3,502 |  5,071 |

### writing-unit-tests

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   298 | 2,435 |  3,286 |
| `evals/evals.json`           |    23 |   330 |    507 |
| `evals/trigger-queries.json` |    12 |   159 |    281 |
| **Total**                    |   333 | 2,924 |  4,074 |
