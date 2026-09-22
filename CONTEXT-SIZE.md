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
tier costs 459 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill            | Startup | SKILL.md | References | Scripts |  Total |
|------------------|--------:|---------:|-----------:|--------:|-------:|
| agent-docs       |      55 |    1,238 |      2,097 |   3,581 |  6,916 |
| code-analysis    |      41 |    2,481 |      8,907 |   3,621 | 15,009 |
| glossary         |      40 |    2,736 |      1,138 |       0 |  3,874 |
| package-update   |      41 |    3,885 |      4,902 |   1,864 | 10,651 |
| task-breakdown   |      44 |    3,691 |      2,122 |       0 |  5,813 |
| task-create      |      47 |    2,514 |      1,306 |       0 |  3,820 |
| task-orchestrate |      50 |    3,969 |      2,115 |       0 |  6,084 |
| task-refactor    |      51 |    5,074 |      8,791 |       0 | 13,865 |
| task-work        |      42 |    3,466 |      2,563 |       0 |  6,029 |
| unambiguity      |      48 |    1,684 |      1,815 |       0 |  3,499 |
| **All skills**   |     459 |   30,738 |     35,756 |   9,066 | 75,560 |

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
| `SKILL.md`                                  |   226 | 1,441 |  2,481 |
| `references/analysis-rules.md`              |   156 | 1,180 |  1,682 |
| `references/measure-tool.md`                |   167 | 1,226 |  2,354 |
| `references/measurement-report-template.md` |   120 |   842 |  1,477 |
| `references/mutation-reports.md`            |    89 |   600 |  1,189 |
| `references/quality-checklist.md`           |    64 |   447 |    717 |
| `references/test-reports.md`                |   131 |   748 |  1,488 |
| `scripts/diff-summaries.mjs`                |   436 | 1,641 |  3,621 |
| **Total**                                   | 1,389 | 8,125 | 15,009 |

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
| `SKILL.md`                        |   296 | 2,458 |  3,691 |
| `references/quality-checklist.md` |    88 |   617 |    949 |
| `references/task-template.md`     |   143 |   672 |  1,173 |
| **Total**                         |   527 | 3,747 |  5,813 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   208 | 1,683 |  2,514 |
| `references/quality-checklist.md` |    71 |   446 |    707 |
| `references/task-template.md`     |    80 |   357 |    599 |
| **Total**                         |   359 | 2,486 |  3,820 |

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
| `SKILL.md`                             |   408 | 3,366 |  5,074 |
| `references/characterization-tests.md` |    62 |   554 |    735 |
| `references/measurement-tools.md`      |   226 | 1,575 |  2,619 |
| `references/quality-checklist.md`      |    98 |   716 |  1,072 |
| `references/refactoring-rules.md`      |   126 | 1,037 |  1,317 |
| `references/smell-catalog.md`          |   179 | 1,294 |  1,864 |
| `references/task-template.md`          |   143 |   676 |  1,184 |
| **Total**                              | 1,242 | 9,218 | 13,865 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   286 | 2,434 |  3,466 |
| `references/quality-checklist.md`    |    69 |   492 |    736 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    87 |   560 |    871 |
| **Total**                            |   538 | 4,243 |  6,029 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   153 | 1,188 |  1,684 |
| `references/clarity-rules.md`     |    71 |   692 |  1,086 |
| `references/quality-checklist.md` |    76 |   441 |    729 |
| **Total**                         |   300 | 2,321 |  3,499 |
