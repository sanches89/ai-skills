#!/usr/bin/env node
// Measures every skill under skills/ and writes CONTEXT-SIZE.md at the repo
// root. Token counts use the cl100k_base encoding of the gpt-tokenizer
// package. Run it with `node scripts/context-size.mjs` from any directory.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');
const outFile = join(root, 'CONTEXT-SIZE.md');

let encode;
try {
  ({ encode } = createRequire(import.meta.url)('gpt-tokenizer'));
} catch {
  console.error('gpt-tokenizer is not installed. Run `pnpm install` at the repo root.');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

function measure(text) {
  return {
    lines: text.split('\n').length - (text.endsWith('\n') ? 1 : 0),
    words: text.split(/\s+/).filter(Boolean).length,
    tokens: encode(text).length,
  };
}

function sum(items, key) {
  return items.reduce((total, item) => total + item[key], 0);
}

function measureSkill(name) {
  const dir = join(skillsDir, name);
  const files = walk(dir).map((path) => ({
    path: relative(dir, path),
    ...measure(readFileSync(path, 'utf8')),
  }));
  const skillMd = readFileSync(join(dir, 'SKILL.md'), 'utf8');
  const frontmatter = skillMd.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? '';
  const startupLines = frontmatter
    .split('\n')
    .filter((line) => /^(name|description):/.test(line));
  const inFolder = (folder) => files.filter((f) => f.path.startsWith(folder));
  return {
    name,
    files,
    startup: encode(startupLines.join('\n')).length,
    skillMd: files.find((f) => f.path === 'SKILL.md').tokens,
    references: sum(inFolder('references/'), 'tokens'),
    scripts: sum(inFolder('scripts/'), 'tokens'),
    total: sum(files, 'tokens'),
  };
}

const format = (value) => value.toLocaleString('en-US');

function table(headers, rows) {
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => String(row[i]).length)),
  );
  const line = (cells) =>
    '| ' +
    cells
      .map((cell, i) =>
        i === 0 ? String(cell).padEnd(widths[i]) : String(cell).padStart(widths[i]),
      )
      .join(' | ') +
    ' |';
  const separator =
    '|' +
    widths
      .map((width, i) =>
        i === 0 ? '-'.repeat(width + 2) : '-'.repeat(width + 1) + ':',
      )
      .join('|') +
    '|';
  return [line(headers), separator, ...rows.map(line)].join('\n');
}

const skills = readdirSync(skillsDir)
  .filter((name) => statSync(join(skillsDir, name)).isDirectory())
  .sort()
  .map(measureSkill);

const summaryRows = skills.map((s) => [
  s.name,
  format(s.startup),
  format(s.skillMd),
  format(s.references),
  format(s.scripts),
  format(s.total),
]);
summaryRows.push([
  '**All skills**',
  format(sum(skills, 'startup')),
  format(sum(skills, 'skillMd')),
  format(sum(skills, 'references')),
  format(sum(skills, 'scripts')),
  format(sum(skills, 'total')),
]);

const sections = [];
sections.push(`# Context size of each skill

This file shows how many tokens each skill takes in an agent's context window.
Every number is an estimate. The counts come from the \`cl100k_base\` encoding
of the \`gpt-tokenizer\` npm package. Each agent's tokenizer gives its own
count. The pre-commit hook regenerates this file from
\`scripts/context-size.mjs\` on every commit. Never edit it by hand.

## Tiers

A skill enters the context window in tiers. Each column of the summary table
counts one tier.

- **Startup**: the \`name\` and \`description\` fields of the frontmatter. An
  agent loads them for every installed skill at the start of a session.
- **SKILL.md**: the whole file, frontmatter included. An agent loads it when
  it uses the skill.
- **References**: every file under \`references/\`. An agent reads one when
  an instruction in \`SKILL.md\` cites it.
- **Scripts**: every file under \`scripts/\`. An agent runs them. Their source
  enters the context window only when the agent reads it.
- **Total**: every file in the skill folder.

## Summary

Tokens per skill and tier. With all ${skills.length} skills installed, the startup
tier costs ${format(sum(skills, 'startup'))} tokens per session. Using one skill then adds its
\`SKILL.md\` and the references it reads.

${table(['Skill', 'Startup', 'SKILL.md', 'References', 'Scripts', 'Total'], summaryRows)}

## Files per skill

Lines, words, and tokens of every file, grouped by skill.
`);

for (const skill of skills) {
  const rows = skill.files.map((f) => [
    '`' + f.path + '`',
    format(f.lines),
    format(f.words),
    format(f.tokens),
  ]);
  rows.push([
    '**Total**',
    format(sum(skill.files, 'lines')),
    format(sum(skill.files, 'words')),
    format(skill.total),
  ]);
  sections.push(`### ${skill.name}\n\n${table(['File', 'Lines', 'Words', 'Tokens'], rows)}\n`);
}

writeFileSync(outFile, sections.join('\n'));
console.log(`Wrote ${relative(process.cwd(), outFile) || 'CONTEXT-SIZE.md'}`);
