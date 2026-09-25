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
| agent-docs       |      55 |    1,366 |      2,124 |   3,581 |  7,071 |
| code-analysis    |      39 |    2,064 |      7,603 |       0 |  9,667 |
| glossary         |      40 |    2,837 |      1,138 |       0 |  3,975 |
| package-update   |      41 |    4,013 |      4,902 |   1,864 | 10,779 |
| task-breakdown   |      44 |    3,955 |      2,342 |       0 |  6,297 |
| task-create      |      47 |    2,733 |      1,451 |       0 |  4,184 |
| task-orchestrate |      50 |    3,969 |      2,115 |       0 |  6,084 |
| task-refactor    |      51 |    5,309 |      9,326 |       0 | 14,635 |
| task-work        |      42 |    3,649 |      2,563 |       0 |  6,212 |
| unambiguity      |      48 |    1,823 |      1,815 |       0 |  3,638 |
| **All skills**   |     457 |   31,718 |     35,379 |   5,445 | 72,542 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   114 |   944 |  1,366 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   118 |   954 |  1,416 |
| `scripts/audit.mjs`          |   346 | 1,576 |  3,581 |
| **Total**                    |   668 | 3,941 |  7,071 |

### code-analysis

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   187 | 1,293 |  2,064 |
| `references/analysis-rules.md`              |   132 |   959 |  1,343 |
| `references/measure-tool.md`                |   136 | 1,009 |  1,956 |
| `references/measurement-report-template.md` |    83 |   530 |    913 |
| `references/mutation-reports.md`            |   101 |   704 |  1,361 |
| `references/quality-checklist.md`           |    55 |   341 |    564 |
| `references/test-reports.md`                |   130 |   734 |  1,466 |
| **Total**                                   |   824 | 5,570 |  9,667 |

### glossary

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   253 | 2,081 |  2,837 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   561 |    919 |
| **Total**                         |   372 | 2,782 |  3,975 |

### package-update

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   359 | 2,578 |  4,013 |
| `references/package-managers.md`       |    73 |   464 |    829 |
| `references/quality-checklist.md`      |    52 |   339 |    566 |
| `references/update-report-template.md` |   110 |   691 |  1,104 |
| `references/update-rules.md`           |   208 | 1,468 |  2,403 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,022 | 6,461 | 10,779 |

### task-breakdown

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   314 | 2,650 |  3,955 |
| `references/quality-checklist.md` |    93 |   672 |  1,022 |
| `references/task-template.md`     |   159 |   761 |  1,320 |
| **Total**                         |   566 | 4,083 |  6,297 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   223 | 1,844 |  2,733 |
| `references/quality-checklist.md` |    74 |   480 |    750 |
| `references/task-template.md`     |    90 |   417 |    701 |
| **Total**                         |   387 | 2,741 |  4,184 |

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
| `SKILL.md`                             |   425 | 3,536 |  5,309 |
| `references/characterization-tests.md` |    63 |   568 |    761 |
| `references/measurement-tools.md`      |   251 | 1,781 |  2,981 |
| `references/quality-checklist.md`      |    98 |   716 |  1,072 |
| `references/refactoring-rules.md`      |   126 | 1,037 |  1,317 |
| `references/smell-catalog.md`          |   179 | 1,294 |  1,864 |
| `references/task-template.md`          |   159 |   765 |  1,331 |
| **Total**                              | 1,301 | 9,697 | 14,635 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   299 | 2,568 |  3,649 |
| `references/quality-checklist.md`    |    69 |   492 |    736 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    87 |   560 |    871 |
| **Total**                            |   551 | 4,377 |  6,212 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   162 | 1,287 |  1,823 |
| `references/clarity-rules.md`     |    71 |   692 |  1,086 |
| `references/quality-checklist.md` |    76 |   441 |    729 |
| **Total**                         |   309 | 2,420 |  3,638 |
