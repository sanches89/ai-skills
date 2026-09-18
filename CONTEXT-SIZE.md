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

Tokens per skill and tier. With all 9 skills installed, the startup
tier costs 569 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill            | Startup | SKILL.md | References | Scripts |  Total |
|------------------|--------:|---------:|-----------:|--------:|-------:|
| agent-docs-audit |      69 |    1,542 |          0 |   3,581 |  5,123 |
| code-analysis    |      61 |    2,889 |      7,584 |   3,542 | 14,015 |
| glossary         |      57 |    2,755 |      1,499 |       0 |  4,254 |
| package-update   |      59 |    4,758 |      5,627 |   1,864 | 12,249 |
| task-breakdown   |      64 |    3,279 |      2,377 |       0 |  5,656 |
| task-create      |      59 |    2,183 |      1,402 |       0 |  3,585 |
| task-refactor    |      70 |    4,251 |      9,352 |       0 | 13,603 |
| task-work        |      62 |    3,710 |      3,017 |       0 |  6,727 |
| unambiguity      |      68 |    2,156 |      2,009 |       0 |  4,165 |
| **All skills**   |     569 |   27,523 |     32,867 |   8,987 | 69,377 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### agent-docs-audit

| File                | Lines | Words | Tokens |
|---------------------|------:|------:|-------:|
| `SKILL.md`          |   123 | 1,043 |  1,542 |
| `scripts/audit.mjs` |   346 | 1,576 |  3,581 |
| **Total**           |   469 | 2,619 |  5,123 |

### code-analysis

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   250 | 1,768 |  2,889 |
| `references/analysis-rules.md`              |   135 | 1,021 |  1,460 |
| `references/measure-tool.md`                |   153 | 1,131 |  2,131 |
| `references/measurement-report-template.md` |   116 |   825 |  1,416 |
| `references/quality-checklist.md`           |    83 |   643 |  1,002 |
| `references/test-reports.md`                |   135 |   819 |  1,575 |
| `scripts/diff-summaries.mjs`                |   428 | 1,618 |  3,542 |
| **Total**                                   | 1,300 | 7,825 | 14,015 |

### glossary

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   230 | 2,018 |  2,755 |
| `references/glossary-template.md` |    40 |   239 |    344 |
| `references/quality-checklist.md` |   104 |   727 |  1,155 |
| **Total**                         |   374 | 2,984 |  4,254 |

### package-update

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   409 | 3,067 |  4,758 |
| `references/package-managers.md`       |    77 |   537 |    918 |
| `references/quality-checklist.md`      |    90 |   693 |  1,093 |
| `references/update-report-template.md` |   112 |   726 |  1,137 |
| `references/update-rules.md`           |   213 | 1,526 |  2,479 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,121 | 7,470 | 12,249 |

### task-breakdown

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   272 | 2,261 |  3,279 |
| `references/quality-checklist.md` |    98 |   731 |  1,121 |
| `references/task-template.md`     |   149 |   740 |  1,256 |
| **Total**                         |   519 | 3,732 |  5,656 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   197 | 1,536 |  2,183 |
| `references/quality-checklist.md` |    71 |   473 |    752 |
| `references/task-template.md`     |    85 |   399 |    650 |
| **Total**                         |   353 | 2,408 |  3,585 |

### task-refactor

| File                                     | Lines | Words | Tokens |
|------------------------------------------|------:|------:|-------:|
| `SKILL.md`                               |   356 | 2,933 |  4,251 |
| `references/characterization-tests.md`   |    85 |   740 |    950 |
| `references/measurement-tools.md`        |   244 | 1,709 |  2,828 |
| `references/quality-checklist.md`        |   110 |   891 |  1,290 |
| `references/refactor-report-template.md` |   103 |   708 |  1,109 |
| `references/refactoring-rules.md`        |   124 | 1,026 |  1,284 |
| `references/smell-catalog.md`            |   184 | 1,316 |  1,891 |
| **Total**                                | 1,206 | 9,323 | 13,603 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   305 | 2,683 |  3,710 |
| `references/quality-checklist.md`    |    89 |   736 |  1,074 |
| `references/unit-testing.md`         |    98 |   782 |    984 |
| `references/work-report-template.md` |    92 |   638 |    959 |
| **Total**                            |   584 | 4,839 |  6,727 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   186 | 1,531 |  2,156 |
| `references/clarity-rules.md`     |    72 |   700 |  1,096 |
| `references/quality-checklist.md` |    87 |   565 |    913 |
| **Total**                         |   345 | 2,796 |  4,165 |
