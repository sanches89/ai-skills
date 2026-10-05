# Code improvement

What the `code-refactor` skill rests on: the smells and refactorings, the
design rules, the metrics and their limits, the evidence that ranks
findings, and what makes code cheap for an agent.

- [smells-and-refactorings.md](smells-and-refactorings.md): which
  refactoring removes which smell, and when duplication stays.
- [design-rules.md](design-rules.md): which design rules make code
  maintainable, reusable, and testable, and how a violation shows in code.
- [metrics.md](metrics.md): which measurements the tools take, with the
  limits they use, and which ones predict defects.
- [agent-written-code.md](agent-written-code.md): what agent-written code
  gets wrong, by the measurements, and what makes a codebase cheap for an
  agent to read and change.

Left at the origin:

- the full refactoring catalogs of Fowler and Kerievsky, with their
  mechanics and examples;
- the GRASP patterns, the connascence taxonomy, and the Clean Code naming
  chapter;
- the Maintainability Index, the Halstead measures, and the SIG rating
  bands;
- the installation and the options of each tool beyond its limits;
- the guidance on instruction files, which `agent-docs` holds;
- the security findings of the studies on agent-written code.

---

Reference: https://refactoring.com/catalog/,
https://web.stanford.edu/~ouster/cgi-bin/book.php,
https://codescene.io/docs/guides/technical/hotspots.html,
https://www.gitclear.com/the_ai_code_quality_maintainability_gap
