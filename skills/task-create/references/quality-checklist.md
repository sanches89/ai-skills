# Quality checklist

Run every check over the draft before showing it to the user. A single failure
blocks delivery. Fix the failure, or return to the interview for the one missing
decision, then run the whole checklist again.

## Ambiguity

- [ ] No banned words in Summary, Success criteria, Approach, Decisions, or
      Verification: `TBD`, `TBC`, `TODO`, `maybe`, `might`, `probably`,
      `possibly`, `perhaps`, `ideally`, `consider`, `could`, `should we`,
      `if needed`, `if necessary`, `as appropriate`, `as needed`, `etc`,
      `and so on`, `or similar`, `something like`.
- [ ] No question marks anywhere, except inside quoted user-interface text or
      code.
- [ ] No alternatives in Approach or Decisions: no `option A / option B`, no
      `either ... or`, no `one of`.
- [ ] Every quantity is a number with a unit. No `fast`, `small`, `large`,
      `reasonable`, `a few`.
- [ ] Every named thing is specific: file path, symbol, endpoint, table,
      environment variable, command. No `the service`, `the config`,
      `the relevant tests`, `the usual place`.

## Completeness

- [ ] The open-decisions list from research is empty.
- [ ] Every decision recorded during the interview appears in Approach or
      Decisions.
- [ ] Every success criterion is produced by at least one component listed in
      Approach.
- [ ] Every path and symbol in Approach and Context was verified to exist during
      research or is marked `(new)`.
- [ ] Every success criterion is proved by at least one step in Verification.
- [ ] Verification lists concrete commands or steps. `Run the tests` alone fails
      this check.
- [ ] Subtasks contains exactly the word `None.`

## Scope

- [ ] Every Approach bullet traces to the confirmed restated idea or to a
      confirmed in-scope deliverable.
- [ ] Out of scope contains only topics that came up during research or
      interview and that a reader would expect in this task.
- [ ] No sections beyond the template. No Risks, Considerations, Alternatives,
      Future work, Nice to have, Notes.
- [ ] No estimates, priorities, or timelines unless the user asked for them.

## Executability

- [ ] A reader with only the task and the repository can start implementing
      without asking anything.
- [ ] Each success criterion is binary: it is either met or not, and someone
      other than the author can check it.
- [ ] The `task-breakdown` skill can split the task without new research: every
      component in Approach has a path, and the commands to build and test are
      in Context.

## Grep helper

Run this over the draft file. Every hit is removed or is inside quoted
user-interface text or code.

```bash
grep -nEi \
  -e '\?|\bTBD\b|\bTBC\b|\bTODO\b|\bmaybe\b|\bmight\b|\bprobably\b' \
  -e '\bpossibly\b|\bperhaps\b|\bideally\b|\bconsider\b|\bcould\b' \
  -e 'should we|if needed|if necessary|as appropriate|as needed' \
  -e '\betc\b|and so on|or similar|something like|either .* or|one of the' \
  <draft-file>
```
