# Quality checklist

Run every check over the draft before showing it to the user. A single failure
blocks delivery. Fix the failure, or return to the interview for the one open
decision, then run the whole checklist again.

## Meaning

- [ ] Every fact and every instruction of the input text is in the rewrite.
- [ ] No fact or instruction is in the rewrite that the input text or a Step 3
      answer does not hold.
- [ ] Every passage with two readings is written in the one reading that
      research or the user settled.
- [ ] Every code block, code span, URL, and quoted string is byte-identical
      to the input text.

## Words

- [ ] Every word has one meaning across the rewrite. Every split meaning has
      its own term, and the bare word is gone.
- [ ] Every thing has one name across the rewrite, the glossary's when the
      glossary has one.
- [ ] Every term keeps the glossary's meaning.
- [ ] No pronoun has two possible antecedents, and no `the <noun>` points at
      a thing the sentence does not name.
- [ ] Every quantity is a number with a unit.
- [ ] No banned words: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks, except inside quoted text or code.
- [ ] No alternatives: no `either ... or`, no `one of`, no
      `option A / option B`, no ungrouped `and/or`.

## Sentences

- [ ] No sentence over 25 words, with a code span counted as one word.
- [ ] Every instruction is one command in the active voice with one action.
- [ ] Every group of three or more parallel items is a list, one item per
      line.
- [ ] Every ordered sequence is a numbered list.

## Structure

- [ ] Every heading of the input text is in the rewrite, at the same level
      and in the same order.
- [ ] Prose wraps at the width recorded in Step 1.
- [ ] The rewrite follows every project rule recorded in Step 2d.

## Report

- [ ] Every ambiguity from research appears under *Resolved* with its
      decision.
- [ ] Every candidate appears under *Candidates*.
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

Passive voice. Read every hit. Rewrite it as a command when it is an
instruction. A definition or a state stays.

```bash
grep -nE '\b(is|are|was|were|be|been|being) +([a-z]+ly +)?[a-z]+(ed|en)\b' \
  <draft-file>
```

Sentences over 25 words, with a code span counted as one word. Every line
printed is a failure.

```bash
awk '/^```/ { c = !c; next } c || !NF { next }
     /^#|^ *[-*] |^\|/ { print "." } { print }' <draft-file> \
  | tr '\n' ' ' | sed -E 's/`[^`]*`/X/g' | tr '.!?;:' '\n\n\n\n\n' \
  | awk 'NF > 25'
```
