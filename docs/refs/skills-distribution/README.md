# Skills distribution

How the skills in this repo reach other people: the `skills` CLI from Vercel Labs, the skills.sh directory it feeds, and the Agent Skills format both expect.

| File | Answers |
| --- | --- |
| [repository-layout.md](repository-layout.md) | Which folders the CLI scans and why this repo stays flat, how to hide a skill, where installs land. |
| [cli.md](cli.md) | The install and update commands users run for this repo, and the telemetry behind the leaderboard. |
| [skills-sh.md](skills-sh.md) | How a skill gets listed and ranked on skills.sh, and the page URLs. |
| [skill-md-spec.md](skill-md-spec.md) | Frontmatter fields and limits, skill folder layout, progressive disclosure, file references. |
| [best-practices.md](best-practices.md) | What to put in a skill and what to leave out, scope, prescriptiveness, patterns. |
| [descriptions.md](descriptions.md) | How to write a description that triggers on the right prompts. |
| [scripts.md](scripts.md) | How scripts are referenced from a skill and how to design them for agents. |

Left at the source: the full list of supported agents and their install folders, the CLI's `find`, `use`, `init`, `list`, and `remove` commands and its `--copy` and `--all` flags, private-repo authentication, download limits, the skills.sh badge, API, and packs, the `allowed-tools` field and the `skills-ref` validator, the trigger-evaluation method for descriptions, and inline dependency declarations for Python, Deno, Bun, and Ruby scripts.

---

Reference: https://github.com/vercel-labs/skills, https://skills.sh/docs, https://agentskills.io/specification
