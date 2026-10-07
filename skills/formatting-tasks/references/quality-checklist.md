# Checks

Sections: Ambiguity; Completeness; Subtasks; Scope; Executability; Grep
helpers.

Run every check and both grep helpers over each draft. One failure blocks
the drafts. Fix it, or record the decision it needs, then run every check
again.

## Ambiguity

- [ ] No alternative in Approach or Decisions: no `option A / option B`.
- [ ] Every quantity is a number with a unit: no `fast`, `small`, `a few`.
- [ ] Every named thing is a path, symbol, endpoint, table, environment
      variable, or command: no `the service`, `the relevant tests`.

## Completeness

- [ ] The research notes hold no open decision.
- [ ] Every decision of the research notes is in the task's Approach or
      Decisions. Every subtask that applies it restates it in its Context.
- [ ] Every path and symbol in Approach, Context, and Changes exists, as
      verified in research, or carries `(new)`.
- [ ] Every References entry has a name, a URL, and what it settles, or the
      section holds exactly `None.`
- [ ] Every fact a reference settles is in the task's Decisions or Context,
      and in the Context of each subtask that lists it.
- [ ] Every section of the format is filled, in the task and in each
      subtask, and no other section exists.
- [ ] The task's Verification holds concrete commands or manual steps.
- [ ] Every success criterion of the task has a Verification step that
      proves it.
- [ ] The task's Subtasks section holds exactly `None.` for a task without
      subtasks. Otherwise it matches the subtasks written: same count,
      order, and titles.

## Subtasks

- [ ] Each subtask has exactly one verification command, or one numbered
      manual sequence.
- [ ] No subtask depends on a subtask with a higher number.
- [ ] Each subtask is mergeable on its own: after it, the project builds and
      every test passes.
- [ ] The union of the subtasks' Changes equals the task's Approach: nothing
      outside it, nothing missing.

## Scope

- [ ] Out of scope holds only topics from the research notes that a reader
      would expect in this task.
- [ ] No section beyond the format. No estimate, priority, or timeline
      unless the user asked.
- [ ] Every line serves the requested change or an *Out of scope* entry: no
      remark or question from the conversation on another topic, no
      mention of another task to create.

## Executability

- [ ] An agent with only the task and the repository can implement it, or
      its first subtask, without asking anything.
- [ ] An agent with only one subtask and the repository can implement it
      without opening the task or asking anything.
- [ ] The task's Context holds the build, lint, and test commands.
- [ ] Approach names every file to change. Each subtask's Changes names
      every file the subtask changes.
- [ ] Every success criterion and acceptance criterion is binary: someone
      else can answer yes or no.

## Grep helpers

Run over the draft. Remove every hit outside quoted user-interface text or
code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like|either .* or|one of the\b' \
  -e 'see task|see parent|as above|same as subtask|as described earlier' \
  <draft-file>
```

Sentences over 25 words, with a code span counted as one word. Every line
printed is a failure.

```bash
awk '/^```/ { c = !c; next } c || !NF { next }
     /^#/ { print "."; next }
     /^ *[-*] |^\|/ { print "." } { print }' <draft-file> \
  | tr '\n' ' ' | sed -E 's/`[^`]*`/X/g' | tr '.!?;:' '\n\n\n\n\n' \
  | awk 'NF > 25'
```
