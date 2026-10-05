# Metrics

Which measurements the tools take, with the limits they use, and which ones
predict defects. The defaults of the measure tool, the ranking of findings,
and the batch rule of `code-refactor` come from here.

## Limits in practice

- Cyclomatic complexity counts the independent paths through a function.
  McCabe set 10 as a reasonable upper limit, and Checkstyle, PMD, and
  SonarQube keep 10 as their default. ESLint defaults to 20, RuboCop to 7.
  The measure tool's `--ccn` default is 10.
- Cognitive complexity, from SonarSource, adds one per break in the linear
  flow and one more per nesting level, and counts a `switch` once. Its
  default limit is 15. It is a different measure, so the skill never feeds
  a cognitive limit to `--ccn`.
- Nesting depth: SonarQube, RuboCop, and PMD stop at 3. The catalog reads
  nesting by hand against 3.
- Function length and parameter count vary by tool: RuboCop 10 lines and 5
  parameters, pylint 50 statements and 5 parameters, SonarQube 7
  parameters. The measure tool takes 50 lines and 4 parameters, and the
  project's own linter limit replaces either.
- CRAP, from Savoia and Evans, is the complexity squared times the cube of
  the uncovered share, plus the complexity. At 30, a function with
  complexity 5 and no test equals one with complexity 30 and full
  coverage. Above 30 the function gets tests before it changes.
- A clone, for the measure tool, is at least 50 tokens and 5 lines. The
  rule of three decides whether it becomes a finding.
- A file limit of 400 lines has no source in a tool; ESLint's `max-lines`
  defaults to 300, pylint's module limit to 1,000. The limit comes from
  the context budget in `agent-written-code.md`.

## What predicts defects

- Herraiz and Hassan: across a large body of C code, cyclomatic complexity
  and the Halstead measures track lines of code so closely that they add
  little beyond size. Size is the default signal, and no metric is
  averaged over a file.
- Graves and others, then Nagappan and Ball: the number and the relative
  size of recent changes predict faults better than any static measure of
  the code.
- Nagappan, Murphy, and Basili on Windows Vista: organizational measures
  predicted failure-prone binaries best, code churn second, complexity
  third, test coverage last.
- Tornhill: a hotspot is a file ranked by its commit count times its
  complexity. In one case study, 4 percent of the code held 72 percent of
  the defects. CodeScene reports that hotspots cover about 1 percent of a
  codebase and 45 percent of its bugs.
- Tornhill and Borg, 39 codebases: code of low health has 15 times the
  defects, and an issue in it takes 124 percent longer to resolve.
- Palomba and others, 395 releases: smelly classes change more and fail
  more, and removing a smell did not always improve the code. Mäntylä and
  Lassenius: developers and metrics disagree on which code smells, so both
  are read.

These results set the ranking of `code-refactor`: hotspot score first, so
that a batch of 12 lands in the code that changes most. Complexity that
nothing touches waits.

---

Reference: https://en.wikipedia.org/wiki/Cyclomatic_complexity,
https://checkstyle.sourceforge.io/checks/metrics/cyclomaticcomplexity.html,
https://eslint.org/docs/latest/rules/complexity,
https://docs.rubocop.org/rubocop/latest/cops_metrics.html,
https://www.sonarsource.com/docs/CognitiveComplexity.pdf,
https://rules.sonarsource.com/java/RSPEC-134/,
https://www.artima.com/weblogs/viewpost.jsp?thread=215899,
https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming),
https://www.oreilly.com/library/view/making-software/9780596808310/ch08.html,
https://dblp.org/rec/conf/icse/NagappanB05.html,
http://www.cs.umd.edu/~basili/publications/proceedings/P125.pdf,
https://www.infoq.com/news/2015/03/code-as-a-crime-scene/,
https://codescene.io/docs/guides/technical/hotspots.html,
https://arxiv.org/abs/2203.04374,
https://link.springer.com/article/10.1007/s10664-017-9535-z,
https://link.springer.com/article/10.1007/s10664-006-9002-8
