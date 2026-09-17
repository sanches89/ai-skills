# Skills distribution

How the skills in this repo reach other people: the `skills` CLI from Vercel
Labs, the skills.sh directory it feeds, and the Agent Skills format both expect.

- [repository-layout.md](repository-layout.md): how deep the CLI scans and
  why this repo stays flat, how to hide a skill, where installs land.
- [cli.md](cli.md): the install command and flags users run for this repo.
- [skills-sh.md](skills-sh.md): how a skill gets listed and ranked on skills.sh,
  and the page URLs.
- [skill-md-spec.md](skill-md-spec.md): frontmatter fields and limits, skill
  folder layout, progressive disclosure, file references.
- [best-practices.md](best-practices.md): what to put in a skill and what to
  leave out, scope, prescriptiveness, patterns.
- [descriptions.md](descriptions.md): how to write a description that triggers
  on the right prompts.
- [scripts.md](scripts.md): how scripts are referenced from a skill and how to
  design them for agents.

Left at the origin:

- the full list of supported agents and their install folders;
- the other locations the CLI scans, and the canonical-copy layout it uses
  for several target agents;
- the CLI's `find`, `use`, `init`, `list`, `remove`, and `update` commands
  and its `--copy`, `--all`, and `-y` flags;
- the telemetry switches;
- private-repo authentication and download limits;
- the skills.sh badge, API, and packs;
- the `allowed-tools` field, the `assets/` folder, and the `skills-ref`
  validator;
- the trigger-evaluation method for descriptions;
- inline dependency declarations for Python, Deno, Bun, and Ruby scripts.

---

Reference: https://github.com/vercel-labs/skills, https://skills.sh/docs,
https://agentskills.io/specification
