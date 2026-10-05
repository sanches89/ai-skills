# Agent-written code

What agent-written code gets wrong, by the measurements, and what makes a
codebase cheap for a coding agent to read and change. The *Agent-written code*,
*Legibility*, and *Tests* entries of the `refactoring-code` catalog, and the
400-line file limit, come from here.

## What the measurements show

- GitClear, 623 million changed lines from 2023 to 2026: duplicated blocks
  of five lines or more up 81 percent; moved lines, the sign of a
  refactoring, down to 3.8 percent of changes; calls into other files down
  35 percent; error-masking constructs up 47 percent. The *Reinvented
  function* and *Masked error* entries answer these.
- CodeRabbit, 470 pull requests: agent-written ones carry 10.8 findings
  against 6.5, with readability three times, naming twice, and error
  handling twice as often. Omitted guards and swallowed errors lead the
  error-handling findings.
- Sonar, 4,400 Java tasks: more than 90 percent of the issues are smells,
  and one model's comment density is four times another's. The *Comment
  that explains what* entry and the test rules answer these.
- Hora and Robbes, 1.2 million commits: agent commits add a mock in 36
  percent of cases against 26 percent for people. The *Over-mocked test*
  entry answers this.
- Spracklen and others, 576 thousand samples: the packages a model imports
  do not exist in 5 percent of cases for commercial models and 22 percent
  for open ones. The project's install command catches these, so the
  catalog has no entry.
- Paul, Zhu, and Bayley: Java from language models holds 63 percent more
  smells than the reference solutions, most of them inside one
  implementation.

## What makes code cheap for an agent

Every property below either shrinks the tokens an agent loads before it
acts correctly, or makes those tokens easy to find.

- The context window fills fast and recall falls as it fills. Claude Code's
  own guidance rests on this one constraint. Liu and others measured the
  fall on long inputs, and LongCodeBench measured the same on code: one
  model's score fell from 29 percent to 3 percent between 32 thousand and
  256 thousand tokens. The 400-line file limit keeps a file and its test
  inside a few thousand tokens.
- Names carry the meaning. Removing identifier names degrades every
  understanding task a model does on code, so a name is unique, grep-able,
  and says what the thing means. Beck's agent prompt and Thoughtworks'
  AI-friendly code design say the same.
- Dependencies are explicit. Ronacher found that agents handle Go's
  explicit flow well and lose a check hidden in another file or a fixture
  a framework injects. The *Implicit wiring* entry and the seam rule come
  from here.
- Facts live next to the code. The nearest `AGENTS.md` wins in every agent,
  and Hashimoto keeps one per subsystem with the commands and the gaps of
  that folder. The *Unfindable test* entry keeps a test where a search for
  the unit finds it.
- A fast pass-or-fail check closes the loop. Claude Code, Hashimoto, and
  the Fowler site's harness engineering memo all rest on tests, linters,
  and type checks that answer in seconds. A failing check is the error
  message the agent reads at the moment it matters.
- Structure and behavior never share a commit. Beck's rule for agents is
  the one-refactoring-per-subtask rule of the skill.

---

Reference: https://www.gitclear.com/the_ai_code_quality_maintainability_gap,
https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report,
https://www.sonarsource.com/blog/the-coding-personalities-of-leading-llms/,
https://arxiv.org/abs/2602.00409, https://arxiv.org/abs/2406.10279,
https://arxiv.org/abs/2510.03029,
https://code.claude.com/docs/en/best-practices,
https://arxiv.org/abs/2307.03172, https://arxiv.org/abs/2505.07897,
https://arxiv.org/abs/2510.03178,
https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes,
https://www.thoughtworks.com/en-us/radar/techniques/ai-friendly-code-design,
https://lucumr.pocoo.org/2025/6/12/agentic-coding/,
https://mitchellh.com/writing/my-ai-adoption-journey, https://agents.md/,
https://martinfowler.com/articles/harness-engineering.html
