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
| breaking-down-tasks  |      70 |    3,306 |        347 |       0 |   4,733 |
| creating-tasks       |      67 |    2,223 |        143 |       0 |   3,332 |
| disambiguating-text  |      72 |    2,116 |      1,820 |       0 |   4,747 |
| finding-code-smells  |      79 |    2,609 |      4,277 |   5,137 |  12,981 |
| finding-dev-commands |      72 |    1,919 |          0 |       0 |   2,717 |
| finding-trackers     |      70 |    1,829 |          0 |       0 |   2,664 |
| formatting-tasks     |      63 |    2,013 |      2,795 |       0 |   5,751 |
| implementing-tasks   |      65 |    3,724 |      1,818 |       0 |   8,866 |
| loading-tasks        |      88 |    1,871 |          0 |       0 |   2,680 |
| measuring-code       |      74 |    2,623 |      5,268 |       0 |   8,929 |
| orchestrating-tasks  |      81 |    4,331 |      2,333 |       0 |  11,782 |
| refactoring-code     |      85 |    3,808 |      4,871 |       0 |   9,982 |
| saving-tasks         |      69 |    2,549 |          0 |       0 |   3,547 |
| updating-packages    |      65 |    4,347 |      4,992 |   1,864 |  12,145 |
| writing-agent-docs   |      96 |    1,700 |      2,265 |   3,658 |   8,605 |
| writing-clean-code   |      83 |    3,224 |          0 |       0 |   4,006 |
| writing-glossaries   |      79 |    3,143 |      1,164 |       0 |   5,283 |
| writing-unit-tests   |      65 |    3,473 |          0 |       0 |   4,241 |
| **All skills**       |   1,420 |   52,112 |     35,112 |  10,659 | 122,099 |

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
| `SKILL.md`                        |   267 | 2,201 |  3,306 |
| `evals/evals.json`                |    23 |   420 |    680 |
| `evals/trigger-queries.json`      |    12 |   236 |    400 |
| `references/quality-checklist.md` |    36 |   261 |    347 |
| **Total**                         |   338 | 3,118 |  4,733 |

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
| `SKILL.md`                        |   189 | 1,507 |  2,116 |
| `evals/evals.json`                |    23 |   299 |    452 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    72 |   692 |  1,088 |
| `references/quality-checklist.md` |    76 |   443 |    732 |
| **Total**                         |   372 | 3,145 |  4,747 |

### finding-code-smells

| File                          | Lines | Words | Tokens |
|-------------------------------|------:|------:|-------:|
| `SKILL.md`                    |   228 | 1,696 |  2,609 |
| `evals/evals.json`            |    23 |   450 |    706 |
| `evals/trigger-queries.json`  |    12 |   143 |    252 |
| `references/smell-catalog.md` |   373 | 3,017 |  4,277 |
| `scripts/scan.mjs`            |   400 | 1,528 |  5,137 |
| **Total**                     | 1,036 | 6,834 | 12,981 |

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
| `SKILL.md`                   |   153 | 1,205 |  1,829 |
| `evals/evals.json`           |    23 |   342 |    550 |
| `evals/trigger-queries.json` |    12 |   178 |    285 |
| **Total**                    |   188 | 1,725 |  2,664 |

### formatting-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   175 | 1,372 |  2,013 |
| `evals/evals.json`                |    23 |   319 |    591 |
| `evals/trigger-queries.json`      |    12 |   207 |    352 |
| `references/line-count.md`        |    37 |   228 |    369 |
| `references/quality-checklist.md` |    95 |   673 |  1,024 |
| `references/task-format.md`       |   164 |   814 |  1,402 |
| **Total**                         |   506 | 3,613 |  5,751 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   302 | 2,596 |  3,724 |
| `evals/evals.json`                   |    42 |   555 |  1,090 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    79 |   570 |    850 |
| `references/work-report-template.md` |    93 |   619 |    968 |
| `evals/files/ (16 files)`            |   303 | 1,044 |  1,878 |
| **Total**                            |   831 | 5,559 |  8,866 |

### loading-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   159 | 1,267 |  1,871 |
| `evals/evals.json`           |    23 |   280 |    501 |
| `evals/trigger-queries.json` |    12 |   151 |    308 |
| **Total**                    |   194 | 1,698 |  2,680 |

### measuring-code

| File                             | Lines | Words | Tokens |
|----------------------------------|------:|------:|-------:|
| `SKILL.md`                       |   221 | 1,639 |  2,623 |
| `evals/evals.json`               |    23 |   468 |    762 |
| `evals/trigger-queries.json`     |    12 |   170 |    276 |
| `references/measure-tool.md`     |   174 | 1,308 |  2,502 |
| `references/mutation-reports.md` |   129 |   903 |  1,705 |
| `references/test-reports.md`     |    93 |   559 |  1,061 |
| **Total**                        |   652 | 5,047 |  8,929 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   330 | 2,794 |  4,331 |
| `evals/evals.json`                            |    43 |   489 |  1,051 |
| `evals/trigger-queries.json`                  |    12 |   206 |    380 |
| `references/job-prompt-template.md`           |    42 |   264 |    357 |
| `references/orchestration-report-template.md` |   104 |   669 |  1,092 |
| `references/quality-checklist.md`             |    88 |   577 |    884 |
| `evals/files/ (18 files)`                     |   459 | 1,927 |  3,687 |
| **Total**                                     | 1,078 | 6,926 | 11,782 |

### refactoring-code

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   322 | 2,505 |  3,808 |
| `evals/evals.json`                |    23 |   639 |    926 |
| `evals/trigger-queries.json`      |    12 |   227 |    377 |
| `references/analysis-tools.md`    |    58 |   482 |    698 |
| `references/quality-checklist.md` |    74 |   652 |    877 |
| `references/refactor-sections.md` |   110 | 1,043 |  1,529 |
| `references/refactoring-rules.md` |   158 | 1,378 |  1,767 |
| **Total**                         |   757 | 6,926 |  9,982 |

### saving-tasks

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   201 | 1,670 |  2,549 |
| `evals/evals.json`           |    23 |   401 |    713 |
| `evals/trigger-queries.json` |    12 |   164 |    285 |
| **Total**                    |   236 | 2,235 |  3,547 |

### updating-packages

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   376 | 2,816 |  4,347 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   425 |    643 |
| `evals/trigger-queries.json`           |    12 |   163 |    288 |
| `references/package-managers.md`       |    76 |   466 |    797 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   114 |   709 |  1,129 |
| `references/update-rules.md`           |   214 | 1,536 |  2,500 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,089 | 7,378 | 12,145 |

### writing-agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   138 | 1,188 |  1,700 |
| `evals/evals.json`           |    23 |   401 |    631 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   125 | 1,027 |  1,557 |
| `scripts/audit.mjs`          |   350 | 1,618 |  3,658 |
| **Total**                    |   738 | 4,914 |  8,605 |

### writing-clean-code

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   397 | 2,165 |  3,224 |
| `evals/evals.json`           |    23 |   332 |    516 |
| `evals/trigger-queries.json` |    12 |   152 |    266 |
| **Total**                    |   432 | 2,649 |  4,006 |

### writing-glossaries

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   271 | 2,302 |  3,143 |
| `evals/evals.json`                |    23 |   438 |    627 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    29 |   143 |    222 |
| `references/quality-checklist.md` |    93 |   570 |    942 |
| **Total**                         |   428 | 3,661 |  5,283 |

### writing-unit-tests

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   312 | 2,577 |  3,473 |
| `evals/evals.json`           |    23 |   313 |    487 |
| `evals/trigger-queries.json` |    12 |   159 |    281 |
| **Total**                    |   347 | 3,049 |  4,241 |
