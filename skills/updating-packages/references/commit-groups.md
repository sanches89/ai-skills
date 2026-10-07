# Commit groups

Take the groups one at a time in plan order:

1. run a trial of the group;
2. on a broken trial, restore the checkpoint. Run a trial of the group at the
   next rung of its ladder. Park the group when no rung remains;
3. on a sound trial, commit. Then replace the checkpoint. A sound trial below
   the candidate versions lowers the group's packages, with the park reason
   `check: <name>` of the first broken trial.
