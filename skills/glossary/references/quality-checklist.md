# Quality checklist

Run every check over the draft before showing it to the user. A single failure
blocks delivery. Fix the failure, or return to the interview for the one open
decision, then run the whole checklist again.

## Form

- [ ] Every entry has the form `- **Term**: definition.` on one bullet.
- [ ] Every section is a `##` heading, and the entries inside it are in
      alphabetical order.
- [ ] The header names the document set.

## Entry test

- [ ] Every term has, at one usage at least, two readings that lead to
      different actions.
- [ ] No term has a word or phrase with one reading that fits every usage.
- [ ] No term has its reading settled by the sentence around every usage.
- [ ] No definition holds a path, a placeholder, a format, a list of allowed
      values, a section list, or a condition.

## Definitions

- [ ] Every definition starts with a noun phrase that names the kind of thing.
- [ ] Every definition has at most two sentences, and no sentence has more
      than 25 words.
- [ ] No definition uses its own term.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks. No alternatives: no `either ... or`, no `one of`.
- [ ] No definition says how the thing works instead of what it is.

## Meaning

- [ ] Every term has exactly one entry.
- [ ] No two entries define the same thing.
- [ ] Every conflict from research ends as a rename in the glossary report,
      with a qualifier or its own word per thing. The bare word has no entry.
- [ ] Every synonym pair from research ends as one word, and the retired word
      appears in the glossary report.
- [ ] Every term has at least one usage in the document set.
- [ ] Every restatement matches its entry word for word, or the mismatch
      appears in the glossary report.

## Report

- [ ] Every usage that disagrees with the glossary appears in the report with
      its path and line.
- [ ] Every entry removed appears in the report with the condition it failed
      or the word `unused`.
- [ ] Every fact taken out of a definition appears in the report with the
      document and line that use it.
- [ ] The open-decisions list from research is empty.

## Grep helpers

Banned words, questions, and alternatives. Run this over the draft. Remove
every hit, unless it sits inside quoted text or code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like|either .* or|one of the' \
  <draft-file>
```

Facts of an instruction inside a definition: a path, a placeholder, a
section list, or a condition. Read every hit and move the fact to the
glossary report.

```bash
grep -nE -e '`[^`]*/[^`]*`|<[a-z-]+>|sections? of|in order:' \
  -e '\bwhen (a|the|it|no) ' <draft-file>
```

Terms with two definition texts across the draft and every document that
restates entries. Every word printed is a failure.

```bash
awk 'FNR == 1 { t = (FILENAME == "<draft-file>") }
     /^## / { if (e) print e; e = "" }
     FILENAME != "<draft-file>" && /^## (Terms|Definitions|Glossary)/ {
       t = 1; next }
     FILENAME != "<draft-file>" && /^## / { t = 0 }
     /^- \*\*/ { if (e) print e; e = ""; if (t) e = $0; next }
     e && /^  / { sub(/^ +/, " "); e = e $0; next }
     END { if (e) print e }' <draft-file> <restating-files> \
  | sort -u | sed -E 's/^- \*\*([^*]+)\*\*.*/\1/' | uniq -d
```

Sentences over 25 words, with a code span counted as one word. Every line
printed is a failure.

```bash
awk '/^```/ { c = !c; next } c || !NF { next }
     /^#|^ *[-*] / { print "." } { print }' <draft-file> \
  | tr '\n' ' ' | sed -E 's/`[^`]*`/X/g' | tr '.!?;:' '\n\n\n\n\n' \
  | awk 'NF > 25'
```
