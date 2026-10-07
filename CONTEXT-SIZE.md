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
tier costs 1,400 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill                | Startup | SKILL.md | References | Scripts |   Total |
|----------------------|--------:|---------:|-----------:|--------:|--------:|
| analyzing-code       |      76 |    1,301 |      2,905 |       0 |   4,989 |
| breaking-down-tasks  |      74 |    3,191 |        343 |       0 |   4,581 |
| creating-tasks       |      67 |    2,223 |        143 |       0 |   3,317 |
| disambiguating-text  |      72 |    2,109 |      1,819 |       0 |   4,738 |
| finding-code-smells  |      74 |    2,485 |      4,103 |   5,107 |  12,555 |
| finding-dev-commands |      72 |    1,895 |          0 |       0 |   2,693 |
| finding-trackers     |      70 |    1,683 |          0 |       0 |   2,494 |
| formatting-tasks     |      63 |    1,940 |      2,709 |       0 |   5,592 |
| implementing-tasks   |      65 |    3,556 |      1,749 |       0 |   8,587 |
| loading-tasks        |      88 |    1,806 |          0 |       0 |   2,600 |
| measuring-code       |      64 |    2,613 |      5,225 |       0 |   8,861 |
| orchestrating-tasks  |      81 |    4,176 |      2,238 |       0 |   7,464 |
| refactoring-code     |      85 |    3,551 |      4,553 |       0 |   9,293 |
| saving-tasks         |      69 |    2,407 |          0 |       0 |   3,359 |
| updating-packages    |      65 |    4,221 |      4,929 |   1,864 |  11,912 |
| writing-agent-docs   |      96 |    1,638 |      2,227 |   3,604 |   8,410 |
| writing-clean-code   |      75 |    2,846 |          0 |       0 |   3,580 |
| writing-glossaries   |      79 |    3,001 |      1,138 |       0 |   5,067 |
| writing-unit-tests   |      65 |    3,378 |          0 |       0 |   4,166 |
| **All skills**       |   1,400 |   50,020 |     34,081 |  10,575 | 114,258 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   120 |   862 |  1,301 |
| `evals/evals.json`                          |    23 |   312 |    500 |
| `evals/trigger-queries.json`                |    12 |   161 |    283 |
| `references/analysis-rules.md`              |   135 |   980 |  1,378 |
| `references/measurement-report-template.md` |    86 |   558 |    953 |
| `references/quality-checklist.md`           |    56 |   341 |    574 |
| **Total**                                   |   432 | 3,214 |  4,989 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   258 | 2,120 |  3,191 |
| `evals/evals.json`                |    23 |   395 |    647 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    36 |   257 |    343 |
| **Total**                         |   329 | 3,008 |  4,581 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   192 | 1,505 |  2,223 |
| `evals/evals.json`                |    23 |   351 |    547 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/quality-checklist.md` |    21 |   108 |    143 |
| **Total**                         |   248 | 2,215 |  3,317 |

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
| `SKILL.md`                    |   221 | 1,612 |  2,485 |
| `evals/evals.json`            |    23 |   377 |    608 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/smell-catalog.md` |   364 | 2,889 |  4,103 |
| `scripts/scan.mjs`            |   396 | 1,500 |  5,107 |
| **Total**                     | 1,016 | 6,521 | 12,555 |

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
| `SKILL.md`                   |   144 | 1,124 |  1,683 |
| `evals/evals.json`           |    23 |   326 |    526 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| **Total**                    |   179 | 1,628 |  2,494 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   171 | 1,330 |  1,940 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    37 |   228 |    369 |
| `references/quality-checklist.md` |    93 |   635 |    977 |
| `references/task-format.md`       |   162 |   786 |  1,363 |
| **Total**                         |   498 | 3,505 |  5,592 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   291 | 2,483 |  3,556 |
| `evals/evals.json`                   |    42 |   538 |  1,060 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    78 |   548 |    823 |
| `references/work-report-template.md` |    90 |   592 |    926 |
| `evals/files/ (16 files)`            |   303 | 1,039 |  1,866 |
| **Total**                            |   816 | 5,375 |  8,587 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   155 | 1,227 |  1,806 |
| `evals/evals.json`           |    23 |   276 |    486 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   190 | 1,654 |  2,600 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   221 | 1,629 |  2,613 |
| `evals/evals.json`               |    23 |   455 |    747 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/measure-tool.md`     |   174 | 1,308 |  2,502 |
| `references/mutation-reports.md` |   129 |   898 |  1,700 |
| `references/test-reports.md`     |    91 |   543 |  1,023 |
| **Total**                        |   650 | 5,003 |  8,861 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   322 | 2,693 |  4,176 |
| `evals/evals.json`                            |    23 |   415 |    670 |
| `evals/trigger-queries.json`                  |    12 |   206 |    380 |
| `references/job-prompt-template.md`           |    41 |   259 |    347 |
| `references/orchestration-report-template.md` |    99 |   632 |  1,032 |
| `references/quality-checklist.md`             |    87 |   561 |    859 |
| **Total**                                     |   584 | 4,766 |  7,464 |

### refactoring-code

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   303 | 2,320 |  3,551 |
| `evals/evals.json`                |    23 |   546 |    812 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    53 |   423 |    623 |
| `references/quality-checklist.md` |    66 |   569 |    760 |
| `references/refactor-sections.md` |   101 |   937 |  1,372 |
| `references/refactoring-rules.md` |   164 | 1,415 |  1,798 |
| **Total**                         |   722 | 6,437 |  9,293 |

### saving-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   193 | 1,574 |  2,407 |
| `evals/evals.json`           |    23 |   370 |    667 |
| `evals/trigger-queries.json` |    12 |   164 |    285 |
| **Total**                    |   228 | 2,108 |  3,359 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   369 | 2,730 |  4,221 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   387 |    599 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/package-managers.md`       |    76 |   466 |    797 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   112 |   694 |  1,109 |
| `references/update-rules.md`           |   212 | 1,505 |  2,457 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,078 | 7,208 | 11,912 |

### writing-agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   134 | 1,142 |  1,638 |
| `evals/evals.json`           |    23 |   372 |    590 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   123 |   997 |  1,519 |
| `scripts/audit.mjs`          |   347 | 1,587 |  3,604 |
| **Total**                    |   729 | 4,778 |  8,410 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   370 | 1,908 |  2,846 |
| `evals/evals.json`           |    23 |   293 |    470 |
| `evals/trigger-queries.json` |    12 |   150 |    264 |
| **Total**                    |   405 | 2,351 |  3,580 |

### writing-glossaries

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   262 | 2,193 |  3,001 |
| `evals/evals.json`                |    23 |   403 |    579 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   557 |    919 |
| **Total**                         |   416 | 3,501 |  5,067 |

### writing-unit-tests

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   303 | 2,504 |  3,378 |
| `evals/evals.json`           |    23 |   330 |    507 |
| `evals/trigger-queries.json` |    12 |   159 |    281 |
| **Total**                    |   338 | 2,993 |  4,166 |
