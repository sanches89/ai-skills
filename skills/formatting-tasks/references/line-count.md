# Line count

## The count tool

The count tool is `cloc`, from `github.com/AlDanial/cloc`. The count command
`<cloc>` is `cloc` when `PATH` has it, otherwise `npx --yes cloc`.

Never install the count tool into the project. When the count command fails to
start, count by hand from the files, with the rule for code lines below.

## Code lines

A code line is a line that is neither blank nor a comment: the `code` field of
`cloc`.

## Count the files the change deletes or rewrites

Run from the project root over those files. Write the test locations as Perl
regular expressions over the full path: folders in `--not-match-d`, files in
`--not-match-f`. Leave an option out when there is nothing to exclude.

```bash
<cloc> --quiet --json --fullpath \
  --not-match-d='<test-folder-regex>' \
  --not-match-f='<test-file-regex>' \
  <path>...
```

`SUM.code` in the output is the code lines the change removes. Add to it the
estimate of the code lines it adds and modifies. Count each file once.
