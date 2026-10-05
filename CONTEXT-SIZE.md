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
tier costs 745 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill            | Startup | SKILL.md | References | Scripts |  Total |
|------------------|--------:|---------:|-----------:|--------:|-------:|
| agent-docs       |      79 |    1,430 |      2,159 |   3,581 |  8,104 |
| code-analysis    |      76 |    2,158 |      7,680 |       0 | 10,647 |
| code-refactor    |      85 |    4,816 |     13,557 |   4,962 | 24,432 |
| glossary         |      76 |    2,991 |      1,135 |       0 |  5,049 |
| package-update   |      68 |    4,124 |      4,948 |   1,864 | 11,807 |
| task-breakdown   |      73 |    4,196 |      2,713 |       0 |  7,857 |
| task-create      |      76 |    3,021 |      1,814 |       0 |  5,670 |
| task-orchestrate |      77 |    4,090 |      2,118 |       0 |  7,120 |
| task-work        |      64 |    3,681 |      2,563 |       0 |  7,118 |
| unambiguity      |      71 |    1,947 |      1,819 |       0 |  4,575 |
| **All skills**   |     745 |   32,454 |     40,506 |  10,407 | 92,379 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   117 |   984 |  1,430 |
| `evals/evals.json`           |    23 |   372 |    583 |
| `evals/trigger-queries.json` |    12 |   213 |    351 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   121 |   969 |  1,451 |
| `scripts/audit.mjs`          |   346 | 1,576 |  3,581 |
| **Total**                    |   709 | 4,581 |  8,104 |

### code-analysis

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   190 | 1,369 |  2,158 |
| `agents/openai.yaml`                        |     2 |     3 |     11 |
| `evals/evals.json`                          |    23 |   329 |    515 |
| `evals/trigger-queries.json`                |    12 |   161 |    283 |
| `references/analysis-rules.md`              |   135 |   975 |  1,373 |
| `references/measure-tool.md`                |   139 | 1,021 |  1,975 |
| `references/measurement-report-template.md` |    83 |   530 |    913 |
| `references/mutation-reports.md`            |   103 |   715 |  1,377 |
| `references/quality-checklist.md`           |    55 |   341 |    564 |
| `references/test-reports.md`                |   132 |   742 |  1,478 |
| **Total**                                   |   874 | 6,186 | 10,647 |

### code-refactor

| File                                   | Lines |  Words | Tokens |
|----------------------------------------|------:|-------:|-------:|
| `SKILL.md`                             |   390 |  3,184 |  4,816 |
| `evals/evals.json`                     |    23 |    491 |    720 |
| `evals/trigger-queries.json`           |    12 |    227 |    377 |
| `references/characterization-tests.md` |    71 |    635 |    864 |
| `references/measurement-tools.md`      |   296 |  2,126 |  3,583 |
| `references/quality-checklist.md`      |   112 |    852 |  1,271 |
| `references/refactoring-rules.md`      |   160 |  1,346 |  1,726 |
| `references/smell-catalog.md`          |   343 |  2,681 |  3,858 |
| `references/task-template.md`          |   227 |  1,370 |  2,255 |
| `scripts/scan.mjs`                     |   387 |  1,403 |  4,962 |
| **Total**                              | 2,021 | 14,315 | 24,432 |

### glossary

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   265 | 2,193 |  2,991 |
| `evals/evals.json`                |    23 |   403 |    577 |
| `evals/trigger-queries.json`      |    12 |   208 |    346 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   557 |    916 |
| **Total**                         |   419 | 3,501 |  5,049 |

### package-update

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   364 | 2,672 |  4,124 |
| `agents/openai.yaml`                   |     2 |     3 |     11 |
| `evals/evals.json`                     |    23 |   372 |    577 |
| `evals/trigger-queries.json`           |    12 |   164 |    283 |
| `references/package-managers.md`       |    73 |   464 |    829 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   112 |   694 |  1,109 |
| `references/update-rules.md`           |   211 | 1,495 |  2,444 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,069 | 7,124 | 11,807 |

### task-breakdown

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   324 | 2,826 |  4,196 |
| `evals/evals.json`                |    23 |   343 |    546 |
| `evals/trigger-queries.json`      |    12 |   237 |    402 |
| `references/line-count.md`        |    37 |   226 |    362 |
| `references/quality-checklist.md` |    93 |   673 |  1,024 |
| `references/task-template.md`     |   161 |   764 |  1,327 |
| **Total**                         |   650 | 5,069 |  7,857 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   244 | 2,057 |  3,021 |
| `evals/evals.json`                |    23 |   276 |    431 |
| `evals/trigger-queries.json`      |    12 |   251 |    404 |
| `references/line-count.md`        |    37 |   226 |    362 |
| `references/quality-checklist.md` |    74 |   480 |    751 |
| `references/task-template.md`     |    90 |   417 |    701 |
| **Total**                         |   480 | 3,707 |  5,670 |

### task-orchestrate

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   326 | 2,614 |  4,090 |
| `evals/evals.json`                            |    23 |   340 |    537 |
| `evals/trigger-queries.json`                  |    12 |   202 |    375 |
| `references/job-prompt-template.md`           |    40 |   252 |    326 |
| `references/orchestration-report-template.md` |    97 |   621 |  1,005 |
| `references/quality-checklist.md`             |    83 |   520 |    787 |
| **Total**                                     |   581 | 4,549 |  7,120 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   299 | 2,599 |  3,681 |
| `evals/evals.json`                   |    23 |   332 |    518 |
| `evals/trigger-queries.json`         |    12 |   175 |    356 |
| `references/quality-checklist.md`    |    69 |   492 |    736 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    87 |   560 |    871 |
| **Total**                            |   586 | 4,915 |  7,118 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   174 | 1,382 |  1,947 |
| `evals/evals.json`                |    23 |   298 |    450 |
| `evals/trigger-queries.json`      |    12 |   204 |    359 |
| `references/clarity-rules.md`     |    71 |   692 |  1,087 |
| `references/quality-checklist.md` |    76 |   443 |    732 |
| **Total**                         |   356 | 3,019 |  4,575 |
