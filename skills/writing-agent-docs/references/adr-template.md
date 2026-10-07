# Writing an ADR

## When to add one

- Add an ADR only for a decision that spans packages or is costly to
  reverse. Add it only when no other place shows its reason, rejected
  alternative or coupling: code, a code comment, an `AGENTS.md`, a README or
  `docs/refs/`.
- Write in it only what those places do not show. Applying a convention
  needs no ADR.

## The file

- Name it `docs/adrs/NNNN-<kebab-title>.md`, with `NNNN` the next free
  number counted from `0000`.
- Keep that number for the life of the ADR. Never renumber an ADR.
- Add one row to `docs/adrs/README.md`, in number order, linking the file
  under its title.

## The sections

```markdown
# NNNN — Title

Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

- **Title**: the decision in the present tense, never the problem.
- **Date**: the day the decision was taken. An edit sets it to the day of
  the change.
- **Context**: the problem in one paragraph, then one bullet per
  alternative turned down, each with the reason it lost.
- **Decision**: one paragraph with the reason the choice holds, and what it
  leaves out of scope. The rule it creates lives in an `AGENTS.md`.
- **Consequences**: the trade-offs and couplings no other place states.
  Leave the section out when there are none.

## Citing it

- Cite an ADR only from the rule it explains, at the end of that rule's
  bullet, as `(ADR 0002)`.
- Put the citation in the deepest `AGENTS.md` that holds the rule.

## Amending it

- When the decision changes, amend the ADR.
- Edit the ADR in place, keeping its file name.
- Git keeps the history, so write no superseded-by line and add no status
  field.
- Rewrite the title and the `docs/adrs/README.md` row when the subject of
  the decision changes.

## Retiring it

- When its reason no longer holds, or one of the places of *When to add
  one* now shows it, retire the ADR.
- Delete the ADR and its row in `docs/adrs/README.md`.
- List every citation with `git grep -n 'ADR NNNN'`. Delete each one, and
  give the rule a short inline reason when its reason still holds.
