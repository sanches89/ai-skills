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
tier costs 621 tokens per session. Using one skill then adds its
`SKILL.md` and the references it reads.

| Skill            | Startup | SKILL.md | References | Scripts |  Total |
|------------------|--------:|---------:|-----------:|--------:|-------:|
| agent-docs-audit |      69 |    1,458 |          0 |   3,581 |  5,039 |
| code-analysis    |      61 |    2,199 |      6,984 |   3,542 | 12,725 |
| glossary         |      57 |    2,207 |      1,115 |       0 |  3,322 |
| package-update   |      59 |    3,895 |      4,886 |   1,864 | 10,645 |
| task-breakdown   |      64 |    2,749 |      1,865 |       0 |  4,614 |
| task-create      |      59 |    1,638 |      1,098 |       0 |  2,736 |
| task-refactor    |     105 |    4,709 |      8,661 |       0 | 13,370 |
| task-work        |      79 |    3,136 |      2,553 |       0 |  5,689 |
| unambiguity      |      68 |    1,704 |      1,773 |       0 |  3,477 |
| **All skills**   |     621 |   23,695 |     28,935 |   8,987 | 61,617 |

## Files per skill

Lines, words, and tokens of every file, grouped by skill.

### agent-docs-audit

| File                | Lines | Words | Tokens |
|---------------------|------:|------:|-------:|
| `SKILL.md`          |   123 |   979 |  1,458 |
| `scripts/audit.mjs` |   346 | 1,576 |  3,581 |
| **Total**           |   469 | 2,555 |  5,039 |

### code-analysis

| File                                        | Lines | Words | Tokens |
|---------------------------------------------|------:|------:|-------:|
| `SKILL.md`                                  |   203 | 1,283 |  2,199 |
| `references/analysis-rules.md`              |   131 |   977 |  1,404 |
| `references/measure-tool.md`                |   149 | 1,084 |  2,066 |
| `references/measurement-report-template.md` |   111 |   763 |  1,335 |
| `references/quality-checklist.md`           |    62 |   431 |    691 |
| `references/test-reports.md`                |   131 |   748 |  1,488 |
| `scripts/diff-summaries.mjs`                |   428 | 1,618 |  3,542 |
| **Total**                                   | 1,215 | 6,904 | 12,725 |

### glossary

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   197 | 1,613 |  2,207 |
| `references/glossary-template.md` |    28 |   134 |    216 |
| `references/quality-checklist.md` |    89 |   547 |    899 |
| **Total**                         |   314 | 2,294 |  3,322 |

### package-update

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   349 | 2,498 |  3,895 |
| `references/package-managers.md`       |    73 |   464 |    829 |
| `references/quality-checklist.md`      |    51 |   335 |    557 |
| `references/update-report-template.md` |   110 |   687 |  1,097 |
| `references/update-rules.md`           |   208 | 1,468 |  2,403 |
| `scripts/set-range.mjs`                |   220 |   921 |  1,864 |
| **Total**                              | 1,011 | 6,373 | 10,645 |

### task-breakdown

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   232 | 1,845 |  2,749 |
| `references/quality-checklist.md` |    68 |   451 |    692 |
| `references/task-template.md`     |   143 |   672 |  1,173 |
| **Total**                         |   443 | 2,968 |  4,614 |

### task-create

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   152 | 1,121 |  1,638 |
| `references/quality-checklist.md` |    54 |   312 |    499 |
| `references/task-template.md`     |    80 |   357 |    599 |
| **Total**                         |   286 | 1,790 |  2,736 |

### task-refactor

| File                                   | Lines | Words | Tokens |
|----------------------------------------|------:|------:|-------:|
| `SKILL.md`                             |   383 | 3,177 |  4,709 |
| `references/characterization-tests.md` |    62 |   554 |    735 |
| `references/measurement-tools.md`      |   226 | 1,575 |  2,617 |
| `references/quality-checklist.md`      |    87 |   645 |    944 |
| `references/refactoring-rules.md`      |   126 | 1,037 |  1,317 |
| `references/smell-catalog.md`          |   179 | 1,294 |  1,864 |
| `references/task-template.md`          |   143 |   676 |  1,184 |
| **Total**                              | 1,206 | 8,958 | 13,370 |

### task-work

| File                                 | Lines | Words | Tokens |
|--------------------------------------|------:|------:|-------:|
| `SKILL.md`                           |   264 | 2,245 |  3,136 |
| `references/quality-checklist.md`    |    69 |   488 |    730 |
| `references/unit-testing.md`         |    96 |   757 |    956 |
| `references/work-report-template.md` |    88 |   560 |    867 |
| **Total**                            |   517 | 4,050 |  5,689 |

### unambiguity

| File                              | Lines | Words | Tokens |
|-----------------------------------|------:|------:|-------:|
| `SKILL.md`                        |   153 | 1,199 |  1,704 |
| `references/clarity-rules.md`     |    70 |   673 |  1,063 |
| `references/quality-checklist.md` |    74 |   426 |    710 |
| **Total**                         |   297 | 2,298 |  3,477 |
