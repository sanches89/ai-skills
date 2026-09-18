#!/usr/bin/env node
// Diff two summaries of code-measure: which entries of each list are new,
// gone, or changed, and how each changed file stands in the current summary.
// See HELP for the options and the exit codes.

import { readFileSync } from "node:fs";

const HELP = `Usage: node diff-summaries.mjs <base.json> <current.json> [options]

Reads two summaries of code-measure and prints one JSON object on stdout.
It says which clones, functions over a limit, hotspots, failed tests, and
coverage entries are new, gone, or changed between the base summary and the
current summary, and which compared values got worse, better, or stayed.
Line numbers move when code moves, so a clone is matched by its two files
and its size, and a function by its file and its name. The current summary
must come from a run with --compare. Diagnostics go to stderr.

Options:
  --changed <file>  A file with one path per line: the files that differ
                    between the base and the current code. Every entry in
                    the output then carries "changed": true or false, and
                    "changedFiles" says how each of those files stands in
                    the current summary.
  --limit <n>       Entries per list in the output. Default 25. Each list
                    also carries its full count.
  --help            Print this text.

Exit codes:
  0  the diff is printed
  1  usage error
  2  a summary or the changed file cannot be read, or a summary is not a
     "version": 1 summary of code-measure with a delta

Examples:
  node diff-summaries.mjs base.json current.json
  node diff-summaries.mjs base.json current.json --changed changed.txt`;

// Data and prose formats that code-measure leaves out of every measurement.
const NOT_CODE = [
  "md", "mdx", "txt", "json", "jsonc", "yaml", "yml", "toml", "lock",
  "svg", "snap", "csv", "tsv", "xml", "html", "map",
];

// The lists of a summary that --top cuts, as [name, getter].
const LISTS = [
  ["duplication.top", (s) => s.duplication?.top],
  ["complexity.top", (s) => s.complexity?.top],
  ["hotspots.top", (s) => s.hotspots?.top],
  ["tests.failedTests", (s) => s.tests?.failedTests],
  ["coverage.top", (s) => s.coverage?.top],
  ["coverage.filesNotInReport", (s) => s.coverage?.filesNotInReport],
  ["coverage.functions.top", (s) => s.coverage?.functions?.top],
];

function fail(code, message) {
  process.stderr.write(`diff-summaries: ${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const positional = [];
  const options = { changed: null, limit: 25 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      process.stdout.write(`${HELP}\n`);
      process.exit(0);
    } else if (arg === "--changed") {
      options.changed = argv[i + 1];
      i += 1;
      if (!options.changed) fail(1, "--changed needs a file path");
    } else if (arg === "--limit") {
      const limit = Number(argv[i + 1]);
      i += 1;
      if (!Number.isInteger(limit) || limit < 1) {
        fail(1, "--limit needs a whole number of 1 or more");
      }
      options.limit = limit;
    } else if (arg.startsWith("--")) {
      fail(1, `unknown option ${arg}; run with --help`);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length !== 2) {
    fail(1, "expected <base.json> <current.json>; run with --help");
  }
  return { base: positional[0], current: positional[1], ...options };
}

function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    fail(2, `cannot read ${path}: ${error.message}`);
  }
}

function readSummary(path) {
  let data;
  try {
    data = JSON.parse(readText(path));
  } catch (error) {
    fail(2, `${path} is not valid JSON: ${error.message}`);
  }
  if (!data || data.version !== 1 || !data.settings) {
    fail(2, `${path} is not a "version": 1 summary of code-measure`);
  }
  return data;
}

function readChanged(path) {
  return readText(path)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const ok = (summary, part) => summary[part]?.status === "ok";
const fileOf = (location) => location.slice(0, location.lastIndexOf(":"));
const functionKey = (entry) => `${entry.file}::${entry.function}`;
const cloneKey = (clone) =>
  `${[fileOf(clone.a), fileOf(clone.b)].sort().join("|")}` +
  `|${clone.lines}|${clone.tokens}`;

function extension(file) {
  const base = file.slice(file.lastIndexOf("/") + 1);
  return base.includes(".")
    ? base.slice(base.lastIndexOf(".") + 1).toLowerCase()
    : "";
}

const isCode = (file) => !NOT_CODE.includes(extension(file));

// The status line of one measurement: compared, or why not.
function status(before, after, part) {
  if (ok(before, part) && ok(after, part)) return "compared";
  const describe = (summary, label) => {
    const measurement = summary[part];
    if (!measurement) return `${label} missing`;
    if (measurement.status === "ok") return `${label} ok`;
    return `${label} ${measurement.status}: ${measurement.reason}`;
  };
  return `not compared: ${describe(before, "base")}; ` +
    `${describe(after, "current")}`;
}

// A list cut to the limit, with its full count.
const cut = (entries, limit) => ({
  count: entries.length,
  entries: entries.slice(0, limit),
});

// The entries of `after` whose key is absent from `before`, and the reverse.
function setDiff(before, after, key) {
  const beforeKeys = new Set(before.map(key));
  const afterKeys = new Set(after.map(key));
  return {
    added: after.filter((entry) => !beforeKeys.has(key(entry))),
    removed: before.filter((entry) => !afterKeys.has(key(entry))),
  };
}

// Mark an entry with whether one of its files is a changed file.
function marker(changed) {
  if (changed === null) return (entry) => entry;
  const set = new Set(changed);
  return (entry, files) => ({
    ...entry,
    changed: files.some((file) => set.has(file)),
  });
}

function values(after) {
  const worse = after.worse ?? [];
  const better = [];
  const unchanged = [];
  for (const [name, change] of Object.entries(after.delta ?? {})) {
    if (worse.includes(name)) continue;
    (change.before === change.after ? unchanged : better).push(name);
  }
  return {
    delta: after.delta ?? {},
    worse,
    better,
    unchanged,
    notCompared: after.notCompared ?? [],
  };
}

function cutLists(before, after) {
  const names = new Set();
  for (const summary of [before, after]) {
    for (const [name, pick] of LISTS) {
      const list = pick(summary);
      if (Array.isArray(list) && list.length >= summary.settings.top) {
        names.add(name);
      }
    }
  }
  return [...names];
}

function diffDuplication(before, after, mark, limit) {
  const result = { status: status(before, after, "duplication") };
  if (result.status !== "compared") return result;
  const { added, removed } = setDiff(
    before.duplication.top,
    after.duplication.top,
    cloneKey,
  );
  const files = (clone) => [fileOf(clone.a), fileOf(clone.b)];
  result.added = cut(added.map((clone) => mark(clone, files(clone))), limit);
  result.removed = cut(removed, limit);
  return result;
}

function diffComplexity(before, after, mark, limit) {
  const result = { status: status(before, after, "complexity") };
  if (result.status !== "compared") return result;
  const { added, removed } = setDiff(
    before.complexity.top,
    after.complexity.top,
    functionKey,
  );
  const previous = new Map(
    before.complexity.top.map((entry) => [functionKey(entry), entry]),
  );
  const changed = after.complexity.top
    .filter((entry) => previous.has(functionKey(entry)))
    .map((entry) => {
      const { ccn, length, params } = previous.get(functionKey(entry));
      return { ...entry, before: { ccn, length, params } };
    })
    .filter(
      (entry) =>
        entry.before.ccn !== entry.ccn ||
        entry.before.length !== entry.length ||
        entry.before.params !== entry.params,
    );
  const one = (entry) => mark(entry, [entry.file]);
  result.added = cut(added.map(one), limit);
  result.removed = cut(removed, limit);
  result.changed = cut(changed.map(one), limit);
  return result;
}

function diffHotspots(before, after, mark, limit) {
  const result = { status: status(before, after, "hotspots") };
  if (result.status !== "compared") return result;
  const { added, removed } = setDiff(
    before.hotspots.top,
    after.hotspots.top,
    (entry) => entry.file,
  );
  result.added = cut(added.map((entry) => mark(entry, [entry.file])), limit);
  result.removed = cut(removed, limit);
  return result;
}

function diffTests(before, after, limit) {
  const result = { status: status(before, after, "tests") };
  if (result.status !== "compared") return result;
  const { added, removed } = setDiff(
    before.tests.failedTests,
    after.tests.failedTests,
    (name) => name,
  );
  result.newFailed = cut(added, limit);
  result.fixed = cut(removed, limit);
  result.total = { before: before.tests.total, after: after.tests.total };
  return result;
}

function diffCoverageFiles(before, after, mark, limit) {
  const { added, removed } = setDiff(
    before.coverage.top,
    after.coverage.top,
    (entry) => entry.file,
  );
  const previous = new Map(
    before.coverage.top.map((entry) => [entry.file, entry]),
  );
  const worse = [];
  const better = [];
  for (const entry of after.coverage.top) {
    const was = previous.get(entry.file);
    if (!was) continue;
    const rose =
      entry.uncoveredLines > was.uncoveredLines ||
      entry.uncoveredBranches > was.uncoveredBranches;
    const fell =
      entry.uncoveredLines < was.uncoveredLines ||
      entry.uncoveredBranches < was.uncoveredBranches;
    const shown = {
      ...entry,
      before: {
        uncoveredLines: was.uncoveredLines,
        uncoveredBranches: was.uncoveredBranches,
      },
    };
    if (rose) worse.push(shown);
    else if (fell) better.push(shown);
  }
  const one = (entry) => mark(entry, [entry.file]);
  return {
    worse: cut(worse.map(one), limit),
    better: cut(better, limit),
    added: cut(added.map(one), limit),
    removed: cut(removed, limit),
  };
}

function diffCoverage(before, after, mark, limit) {
  const result = { status: status(before, after, "coverage") };
  if (result.status !== "compared") return result;
  result.files = diffCoverageFiles(before, after, mark, limit);
  const missing = setDiff(
    before.coverage.filesNotInReport,
    after.coverage.filesNotInReport,
    (file) => file,
  );
  result.notInReport = {
    added: cut(missing.added.map((file) => mark({ file }, [file])), limit),
    removed: cut(missing.removed.map((file) => ({ file })), limit),
  };
  const functionsOk =
    before.coverage.functions?.status === "ok" &&
    after.coverage.functions?.status === "ok";
  if (!functionsOk) {
    result.functions = {
      status: "not compared: needs the complexity measurement in both runs",
    };
    return result;
  }
  const functions = setDiff(
    before.coverage.functions.top,
    after.coverage.functions.top,
    functionKey,
  );
  result.functions = {
    status: "compared",
    added: cut(
      functions.added.map((entry) => mark(entry, [entry.file])),
      limit,
    ),
    removed: cut(functions.removed, limit),
  };
  return result;
}

// How one changed file stands in the current summary.
function standing(after, file, limit) {
  const entry = { file };
  if (ok(after, "coverage")) {
    const coverage = after.coverage;
    const top = coverage.top.find((item) => item.file === file);
    if (coverage.filesNotInReport.includes(file)) {
      entry.coverage = "not in report";
    } else if (top) {
      entry.coverage = {
        lines: top.lines,
        branches: top.branches,
        uncoveredLines: top.uncoveredLines,
        uncoveredBranches: top.uncoveredBranches,
      };
    } else {
      entry.coverage = "full";
    }
  } else {
    entry.coverage = "skipped";
  }
  if (ok(after, "complexity")) {
    entry.functionsOverLimit = cut(
      after.complexity.top.filter((item) => item.file === file),
      limit,
    );
  }
  if (ok(after, "duplication")) {
    entry.clones = cut(
      after.duplication.top.filter(
        (clone) => fileOf(clone.a) === file || fileOf(clone.b) === file,
      ),
      limit,
    );
  }
  if (ok(after, "coverage") && after.coverage.functions?.status === "ok") {
    entry.untestedFunctions = cut(
      after.coverage.functions.top.filter((item) => item.file === file),
      limit,
    );
  }
  return entry;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const before = readSummary(args.base);
  const after = readSummary(args.current);
  if (!after.delta) {
    fail(2, `${args.current} holds no delta; run code-measure with --compare`);
  }
  const changed = args.changed === null ? null : readChanged(args.changed);
  const mark = marker(changed);
  const { limit } = args;

  const result = {
    base: { tool: before.tool, paths: before.paths },
    current: { tool: after.tool, paths: after.paths },
    ...values(after),
    cut: cutLists(before, after),
    duplication: diffDuplication(before, after, mark, limit),
    complexity: diffComplexity(before, after, mark, limit),
    hotspots: diffHotspots(before, after, mark, limit),
    tests: diffTests(before, after, limit),
    coverage: diffCoverage(before, after, mark, limit),
  };
  if (changed !== null) {
    const codeFiles = changed.filter(isCode);
    result.changedFiles = cut(
      codeFiles.map((file) => standing(after, file, limit)),
      limit,
    );
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
