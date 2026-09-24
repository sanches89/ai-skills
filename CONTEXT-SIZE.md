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
tier costs 457 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill            | Startup | SKILL.md | References | Scripts |  Total |
|------------------|--------:|---------:|-----------:|--------:|-------:|
| agent-docs       |      55 |    1,238 |      2,097 |   3,581 |  6,916 |
| code-analysis    |      39 |    1,892 |      7,620 |       0 |  9,512 |
| glossary         |      40 |    2,736 |      1,138 |       0 |  3,874 |
| package-update   |      41 |    3,885 |      4,902 |   1,864 | 10,651 |
| task-breakdown   |      44 |    3,855 |      2,342 |       0 |  6,197 |
| task-create      |      47 |    2,633 |      1,451 |       0 |  4,084 |
| task-orchestrate |      50 |    3,969 |      2,115 |       0 |  6,084 |
| task-refactor    |      51 |    5,098 |      8,938 |       0 | 14,036 |
| task-work        |      42 |    3,491 |      2,563 |       0 |  6,054 |
| unambiguity      |      48 |    1,684 |      1,815 |       0 |  3,499 |
| **All skills**   |     457 |   30,481 |     34,981 |   5,445 | 70,907 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   105 |   850 |  1,238 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   117 |   939 |  1,389 |
| `scripts/audit.mjs`          |   346 | 1,576 |  3,581 |
| **Total**                    |   658 | 3,832 |  6,916 |

### code-analysis

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   174 | 1,168 |  1,892 |
| `references/analysis-rules.md`              |   132 |   959 |  1,343 |
| `references/measure-tool.md`                |   136 | 1,009 |  1,956 |
| `references/measurement-report-template.md` |    83 |   530 |    913 |
| `references/mutation-reports.md`            |   102 |   710 |  1,378 |
| `references/quality-checklist.md`           |    55 |   341 |    564 |
| `references/test-reports.md`                |   130 |   734 |  1,466 |
| **Total**                                   |   812 | 5,451 |  9,512 |

### glossary

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   245 | 2,005 |  2,736 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   561 |    919 |
| **Total**                         |   364 | 2,706 |  3,874 |

### package-update

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   350 | 2,484 |  3,885 |
| `references/package-managers.md`       |    73 |   464 |    829 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   110 |   691 |  1,104 |
| `references/update-rules.md`           |   208 | 1,468 |  2,403 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,013 | 6,367 | 10,651 |

### task-breakdown

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   307 | 2,574 |  3,855 |
| `references/quality-checklist.md` |    93 |   672 |  1,022 |
| `references/task-template.md`     |   159 |   761 |  1,320 |
| **Total**                         |   559 | 4,007 |  6,197 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   216 | 1,768 |  2,633 |
| `references/quality-checklist.md` |    74 |   480 |    750 |
| `references/task-template.md`     |    90 |   417 |    701 |
| **Total**                         |   380 | 2,665 |  4,084 |

### task-orchestrate

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   323 | 2,520 |  3,969 |
| `references/job-prompt-template.md`           |    40 |   252 |    326 |
| `references/orchestration-report-template.md` |    97 |   621 |  1,005 |
| `references/quality-checklist.md`             |    83 |   519 |    784 |
| **Total**                                     |   543 | 3,912 |  6,084 |

### task-refactor

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   410 | 3,380 |  5,098 |
| `references/characterization-tests.md` |    62 |   554 |    735 |
| `references/measurement-tools.md`      |   226 | 1,575 |  2,619 |
| `references/quality-checklist.md`      |    98 |   716 |  1,072 |
| `references/refactoring-rules.md`      |   126 | 1,037 |  1,317 |
| `references/smell-catalog.md`          |   179 | 1,294 |  1,864 |
| `references/task-template.md`          |   159 |   765 |  1,331 |
| **Total**                              | 1,260 | 9,321 | 14,036 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   288 | 2,452 |  3,491 |
| `references/quality-checklist.md`    |    69 |   492 |    736 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    87 |   560 |    871 |
| **Total**                            |   540 | 4,261 |  6,054 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   153 | 1,188 |  1,684 |
| `references/clarity-rules.md`     |    71 |   692 |  1,086 |
| `references/quality-checklist.md` |    76 |   441 |    729 |
| **Total**                         |   300 | 2,321 |  3,499 |
