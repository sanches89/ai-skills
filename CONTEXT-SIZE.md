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
tier costs 740 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill            | Startup | SKILL.md | References | Scripts |  Total |
|------------------|--------:|---------:|-----------:|--------:|-------:|
| agent-docs       |      74 |    1,247 |      2,097 |   3,581 |  6,925 |
| code-analysis    |      61 |    2,501 |      8,894 |   3,621 | 15,016 |
| glossary         |      57 |    2,753 |      1,138 |       0 |  3,891 |
| package-update   |      59 |    3,903 |      4,886 |   1,864 | 10,653 |
| task-breakdown   |      64 |    2,958 |      1,961 |       0 |  4,919 |
| task-create      |      59 |    1,867 |      1,178 |       0 |  3,045 |
| task-orchestrate |     114 |    3,648 |      2,102 |       0 |  5,750 |
| task-refactor    |     105 |    4,541 |      8,663 |       0 | 13,204 |
| task-work        |      79 |    3,195 |      2,550 |       0 |  5,745 |
| unambiguity      |      68 |    1,704 |      1,815 |       0 |  3,519 |
| **All skills**   |     740 |   28,317 |     35,284 |   9,066 | 72,667 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### agent-docs

| File                         | Lines | Words | Tokens |
|------------------------------|------:|------:|-------:|
| `SKILL.md`                   |   104 |   864 |  1,247 |
| `references/adr-template.md` |    90 |   467 |    708 |
| `references/audit.md`        |   117 |   939 |  1,389 |
| `scripts/audit.mjs`          |   346 | 1,576 |  3,581 |
| **Total**                    |   657 | 3,846 |  6,925 |

### code-analysis

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   226 | 1,462 |  2,501 |
| `references/analysis-rules.md`              |   156 | 1,180 |  1,682 |
| `references/measure-tool.md`                |   167 | 1,226 |  2,354 |
| `references/measurement-report-template.md` |   120 |   838 |  1,470 |
| `references/mutation-reports.md`            |    89 |   600 |  1,189 |
| `references/quality-checklist.md`           |    64 |   443 |    711 |
| `references/test-reports.md`                |   131 |   748 |  1,488 |
| `scripts/diff-summaries.mjs`                |   436 | 1,641 |  3,621 |
| **Total**                                   | 1,389 | 8,138 | 15,016 |

### glossary

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   245 | 2,017 |  2,753 |
| `references/glossary-template.md` |    28 |   140 |    219 |
| `references/quality-checklist.md` |    91 |   561 |    919 |
| **Total**                         |   364 | 2,718 |  3,891 |

### package-update

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   350 | 2,500 |  3,903 |
| `references/package-managers.md`       |    73 |   464 |    829 |
| `references/quality-checklist.md`      |    51 |   335 |    557 |
| `references/update-report-template.md` |   110 |   687 |  1,097 |
| `references/update-rules.md`           |   208 | 1,468 |  2,403 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,012 | 6,375 | 10,653 |

### task-breakdown

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   245 | 2,012 |  2,958 |
| `references/quality-checklist.md` |    75 |   522 |    788 |
| `references/task-template.md`     |   143 |   672 |  1,173 |
| **Total**                         |   463 | 3,206 |  4,919 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   166 | 1,304 |  1,867 |
| `references/quality-checklist.md` |    60 |   375 |    579 |
| `references/task-template.md`     |    80 |   357 |    599 |
| **Total**                         |   306 | 2,036 |  3,045 |

### task-orchestrate

| File                                          | Lines | Words | Tokens |
|-----------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                    |   296 | 2,319 |  3,648 |
| `references/job-prompt-template.md`           |    40 |   252 |    326 |
| `references/orchestration-report-template.md` |    97 |   617 |    998 |
| `references/quality-checklist.md`             |    83 |   515 |    778 |
| **Total**                                     |   516 | 3,703 |  5,750 |

### task-refactor

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   370 | 3,053 |  4,541 |
| `references/characterization-tests.md` |    62 |   554 |    735 |
| `references/measurement-tools.md`      |   226 | 1,575 |  2,619 |
| `references/quality-checklist.md`      |    87 |   645 |    944 |
| `references/refactoring-rules.md`      |   126 | 1,037 |  1,317 |
| `references/smell-catalog.md`          |   179 | 1,294 |  1,864 |
| `references/task-template.md`          |   143 |   676 |  1,184 |
| **Total**                              | 1,193 | 8,834 | 13,204 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   266 | 2,274 |  3,195 |
| `references/quality-checklist.md`    |    69 |   488 |    730 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    87 |   556 |    864 |
| **Total**                            |   518 | 4,075 |  5,745 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   153 | 1,199 |  1,704 |
| `references/clarity-rules.md`     |    71 |   692 |  1,086 |
| `references/quality-checklist.md` |    76 |   441 |    729 |
| **Total**                         |   300 | 2,332 |  3,519 |
