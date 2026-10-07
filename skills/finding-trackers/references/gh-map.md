# Tracker map through gh

Fill the map with these values:
- tracker: `GitHub Issues`; reached through: `gh`;
- search items: `gh issue list --state all --search "<words>"`;
- read item: `gh issue view <number> --comments`;
- read parent: `gh api repos/{owner}/{repo}/issues/<number>/parent`;
- list children: `gh api repos/{owner}/{repo}/issues/<number>/sub_issues`;
- create item: `gh issue create --title "<title>" --body-file <path>`;
- edit item: `gh issue edit <number> --title "<title>" --body-file <path>`;
- comment on item: `gh issue comment <number> --body-file <path>`;
- close item: `gh issue close <number>`;
- delete item: `none`;
- link child: a POST with `gh api -X POST` to that `sub_issues` path with
  `-F sub_issue_id=<id>`. `<id>` is the `id` that
  `gh api repos/{owner}/{repo}/issues/<child>` prints. Write both commands;
- unlink child: a DELETE with `gh api -X DELETE` to
  `repos/{owner}/{repo}/issues/<number>/sub_issue`, singular, with
  `-F sub_issue_id=<id>`. `<id>` is the child's `id`, as for link child.
  Write both commands;
- completed status: `closed`;
- destinations: `one`;
- required fields: `none`.
