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

Tokens per skill and tier. With all 10 skills installed, the startup
tier costs 755 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill               | Startup | SKILL.md | References | Scripts |  Total |
|---------------------|--------:|---------:|-----------:|--------:|-------:|
| analyzing-code      |      76 |    2,160 |      7,680 |       0 | 10,651 |
| breaking-down-tasks |      74 |    4,198 |      2,714 |       0 |  7,861 |
| creating-tasks      |      77 |    3,023 |      1,816 |       0 |  5,676 |
| disambiguating-text |      72 |    1,955 |      1,819 |       0 |  4,584 |
| implementing-tasks  |      65 |    3,683 |      2,563 |       0 |  7,122 |
| orchestrating-tasks |      78 |    4,098 |      2,119 |       0 |  7,132 |
| refactoring-code    |      85 |    4,824 |     13,561 |   4,962 | 24,444 |
| updating-packages   |      69 |    4,125 |      4,948 |   1,864 | 11,814 |
| writing-agent-docs  |      80 |    1,434 |      2,164 |   3,582 |  8,121 |
| writing-glossaries  |      79 |    3,008 |      1,135 |       0 |  5,071 |
| **All skills**      |     755 |   32,508 |     40,519 |  10,408 | 92,476 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### analyzing-code

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   190 | 1,369 |  2,160 |
| `agents/openai.yaml`                        |     2 |     3 |     11 |
| `evals/evals.json`                          |    23 |   329 |    517 |
| `evals/trigger-queries.json`                |    12 |   161 |    283 |
| `references/analysis-rules.md`              |   135 |   975 |  1,373 |
| `references/measure-tool.md`                |   139 | 1,021 |  1,975 |
| `references/measurement-report-template.md` |    83 |   530 |    913 |
| `references/mutation-reports.md`            |   103 |   715 |  1,377 |
| `references/quality-checklist.md`           |    55 |   341 |    564 |
| `references/test-reports.md`                |   132 |   742 |  1,478 |
| **Total**                                   |   874 | 6,186 | 10,651 |

### breaking-down-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   323 | 2,827 |  4,198 |
| `evals/evals.json`                |    23 |   343 |    547 |
| `evals/trigger-queries.json`      |    12 |   237 |    402 |
| `references/line-count.md`        |    37 |   226 |    362 |
| `references/quality-checklist.md` |    93 |   673 |  1,024 |
| `references/task-template.md`     |   161 |   764 |  1,328 |
| **Total**                         |   649 | 5,070 |  7,861 |

### creating-tasks

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   244 | 2,057 |  3,023 |
| `evals/evals.json`                |    23 |   276 |    433 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/line-count.md`        |    37 |   226 |    362 |
| `references/quality-checklist.md` |    74 |   480 |    752 |
| `references/task-template.md`     |    90 |   417 |    702 |
| **Total**                         |   480 | 3,707 |  5,676 |

### disambiguating-text

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   173 | 1,383 |  1,955 |
| `evals/evals.json`                |    23 |   298 |    451 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    71 |   692 |  1,087 |
| `references/quality-checklist.md` |    76 |   443 |    732 |
| **Total**                         |   355 | 3,020 |  4,584 |

### implementing-tasks

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   299 | 2,599 |  3,683 |
| `evals/evals.json`                   |    23 |   332 |    520 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    69 |   492 |    736 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    87 |   560 |    871 |
| **Total**                            |   586 | 4,915 |  7,122 |

### orchestrating-tasks

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   325 | 2,614 |  4,098 |
| `evals/evals.json`                            |    23 |   340 |    540 |
| `evals/trigger-queries.json`                  |    12 |   202 |    375 |
| `references/job-prompt-template.md`           |    40 |   252 |    327 |
| `references/orchestration-report-template.md` |    97 |   621 |  1,005 |
| `references/quality-checklist.md`             |    83 |   520 |    787 |
| **Total**                                     |   580 | 4,549 |  7,132 |

### refactoring-code

| File                                   | Lines |  Words | Tokens |
|----------------------------------------|------:|-------:|-------:|
| `SKILL.md`                             |   389 |  3,184 |  4,824 |
| `evals/evals.json`                     |    23 |    491 |    720 |
| `evals/trigger-queries.json`           |    12 |    227 |    377 |
| `references/characterization-tests.md` |    71 |    635 |    864 |
| `references/measurement-tools.md`      |   296 |  2,126 |  3,583 |
| `references/quality-checklist.md`      |   112 |    852 |  1,271 |
| `references/refactoring-rules.md`      |   160 |  1,346 |  1,726 |
| `references/smell-catalog.md`          |   343 |  2,681 |  3,858 |
| `references/task-template.md`          |   227 |  1,370 |  2,259 |
| `scripts/scan.mjs`                     |   387 |  1,403 |  4,962 |
| **Total**                              | 2,020 | 14,315 | 24,444 |

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

### writing-glossaries

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   262 | 2,194 |  3,008 |
| `evals/evals.json`                |    23 |   403 |    579 |
| `evals/trigger-queries.json`      |    12 |   208 |    349 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   557 |    916 |
| **Total**                         |   416 | 3,502 |  5,071 |
