# Reference line

Write one reference line for the project's agent instructions, in the scratch
directory next to the draft. Its file is the repository root's `AGENTS.md`, or
the root's `CLAUDE.md` when the root has no `AGENTS.md`. The line names the
glossary's path relative to the repository root:

```markdown
- Read `<glossary path>` first. Use every word it defines with that meaning.
```

Its place is the first bullet under that file's first heading, above every other
rule and section. Write no line when that file already names the glossary's
path, or when the root has no `AGENTS.md` and no `CLAUDE.md`. Name either case
in the glossary report.
