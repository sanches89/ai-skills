# Quality checklist

Run every check over the draft before showing it to the user. A single failure blocks delivery. Fix the failure, or return to the interview for the one missing decision, then run the whole checklist again.

## Ambiguity

- [ ] No banned words in Summary, Success criteria, Decisions, Tasks, or Verification: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`, `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`, `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`, `and so on`, `or similar`, `something like`.
- [ ] No question marks anywhere, except inside quoted user-interface text or code.
- [ ] No alternatives in Decisions or Tasks: no `option A / option B`, no `either ... or`, no `one of`.
- [ ] Every quantity is a number with a unit. No `fast`, `small`, `large`, `reasonable`, `a few`.
- [ ] Every named thing is specific: file path, symbol, endpoint, table, environment variable, command. No `the service`, `the config`, `the relevant tests`, `the usual place`.

## Completeness

- [ ] The open-decisions list from research is empty.
- [ ] Every decision recorded during the interview appears in Decisions or inside a task.
- [ ] Every success criterion is covered by at least one task's acceptance criteria.
- [ ] Every task lists its touched files or areas, and every path and symbol was verified to exist during research or is marked `(new)`.
- [ ] Dependencies form a valid order: no cycles, no reference to a task with a higher number.
- [ ] Verification lists concrete commands or steps. `Run the tests` alone fails this check.

## Scope

- [ ] Every task traces to the confirmed restated idea or to a confirmed in-scope item.
- [ ] Out of scope contains only items that came up during research or interview and that a reader would expect in this work.
- [ ] No sections beyond the template. No Risks, Considerations, Alternatives, Future work, Nice to have, Notes.
- [ ] No estimates, priorities, or timelines unless the user asked for them.

## Executability

- [ ] A reader with only the plan and the repository can start Task 1 without asking anything.
- [ ] Each acceptance criterion is binary: it is either met or not, and someone other than the author can check it.
- [ ] Each task stands alone as a ticket: title, description, touched areas, and acceptance criteria are all present.

## Grep helper

Run this over the draft file. Every hit is removed or is inside quoted user-interface text or code.

```bash
grep -nEi '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b|\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b|should we|if needed|if necessary|as appropriate|as needed|\betc\b|and so on|or similar|something like|either .* or|one of the' <draft-file>
```
