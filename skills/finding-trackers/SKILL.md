---
name: finding-trackers
description: Finds the issue tracker a project uses and the commands that search, read, create, link, comment on, and close its items, changing nothing. Use when the user asks which tracker a project uses or how to reach its issues, and before any step that reads or writes issues, tickets, or items.
license: MIT
---

# Finding trackers

Find the issue tracker a project uses and the way to reach it. Return the
tracker map: the tool or command for each action on an item, the completed
status, the destination, the count of destinations, and the required
fields. Change nothing.

## Hard rules

1. **Read-only.** Never create, edit, delete, link, comment on, or close an
   item, and never change a project file. Only read and list. A write here
   happens before the skill or the user that reads the map decides it.
2. **Never ask.** Settle every line of the map from the docs, the connected
   tools, `git`, and `gh`. Write `unsettled` or `none` where they settle
   nothing. A calling skill runs unattended, where no user reads a
   question.

## Invocation

- `from <caller>: find`: another skill invoked this run. Run the workflow
  and send the tracker map as the final message, with nothing else.
- Any invocation text without the `from <skill name>:` prefix: a user
  invoked this skill. Run the workflow, then show the tracker map in chat.

## Workflow

### Step 1: Find the tracker

**Subagents.** When the agent offers subagents, run in one every read whose
whole product is the facts the step records. In Claude Code, that is the
`Agent` tool, with the `Explore` subagent for reads. Run in one every
command whose output the step reduces to a result. Give the subagent the
question, the paths, and the facts to return. It returns only those facts,
each with path and line. The context window then holds those returns, not
the files, and stays small. Without subagents, follow the step yourself and
keep only what it names.

The tracker is the issue tracker the project uses, reached through an MCP
server or through `gh`, the GitHub CLI. Find it in this order, and take the
first that applies:
1. the tracker that README, CLAUDE.md, AGENTS.md, CONTRIBUTING, or
   `docs/README.md` names, when an MCP server or `gh` reaches it. When
   the docs name one that nothing reaches, no tracker is connected;
2. the tracker of an MCP server whose tools read and write issues. List
   the MCP tools of the agent (in Claude Code they are deferred: search
   them with `ToolSearch` for
   `issue ticket project linear jira notion asana github`). With several,
   the first listed;
3. GitHub Issues through `gh`, when `git remote get-url origin` prints a
   `github.com` URL and `gh auth status` exits 0;
4. else no tracker is connected.

`gh` reaches GitHub Issues only when both conditions of rule 3 hold.

With no tracker connected, the tracker map is its first line alone:
`tracker: none: <reason>`. The reason states in one line what the rules
found, such as `the docs name Jira and nothing reaches it`. Go to Step 3.

### Step 2: Map the actions

Fill one line of the tracker map per action, with the exact tool name or
command that performs it. Write `none` on a line whose action no tool of
the tracker performs.

**Through `gh`.** Fill the map with these values:
- tracker: `GitHub Issues`; reached through: `gh`;
- search items: `gh issue list --state all --search "<words>"`;
- read item: `gh issue view <number> --comments`;
- read parent: `gh api repos/{owner}/{repo}/issues/<number>/parent`;
- list children: `gh api repos/{owner}/{repo}/issues/<number>/sub_issues`;
- create item: `gh issue create --title "<title>" --body-file <path>`;
- edit item: `gh issue edit <number> --title "<title>" --body-file <path>`;
- comment on item: `gh issue comment <number> --body-file <path>`;
- close item: `gh issue close <number>`;
- delete item: `none`. A deleted issue is gone for good, so a caller
  closes it;
- link child: a POST with `gh api -X POST` to that `sub_issues` path with
  `-F sub_issue_id=<id>`. `<id>` is the `id` that
  `gh api repos/{owner}/{repo}/issues/<child>` prints. Write both commands;
- completed status: `closed`. A closed issue is in a completed status, and
  `gh` has no other status;
- destinations: `one`. Every issue goes to the repository of `origin`;
- required fields: `none`.

**Through an MCP server.** Read the name and the input schema of every tool
of the server. Then fill:
- tracker with the tracker's name, and reached through with the server's
  name;
- each action line with the tool that performs that action;
- read parent with the tool or the field that returns an item's parent.
  Without such a relation, write `none`;
- list children with the tool or the field that returns an item's
  children. Without such a relation, write `none`;
- link child with the tool and the field of the tracker's relation for
  children: a sub-issue, a child, or a parent field. Without such a
  relation, write `none: children linked in the body`;
- completed status with the name of every status in the tracker's
  completed or done category. Read the statuses with the tracker's tools.
  When no tool lists them, write `unsettled`;
- destinations with `one` or `several`: the count of teams, projects, or
  boards that the tracker's tools list for new items. When no tool lists
  them, write `unsettled`;
- required fields with every field that the input schema of the create
  tool marks required, for an item and for a child item. Leave out the
  title, the body, the parent field, and the team, project, or board
  field: the `destination` lines cover it. Give each field the value the
  docs of rule 1 name, else `unsettled`. With no such field, write `none`.

**Destination.** Write the team, project, or board that the docs of rule 1
name for new items, else `none named`.

### Step 3: Send the tracker map

Fill the tracker map in this form:

```
tracker: <name, such as Linear, Jira, or GitHub Issues> | none: <reason>
reached through: <MCP server name> | gh
search items: <tool or command>
read item: <tool or command>
read parent: <tool or command> | none
list children: <tool or command> | none
create item: <tool or command>
edit item: <tool or command>
comment on item: <tool or command>
close item: <tool or command>
delete item: <tool or command> | none
link child: <tool or command> | none: children linked in the body
completed status: <status names> | unsettled
destination: <team, project, or board the docs name> | none named
destinations: one | several | unsettled
required fields: <field>: <value | unsettled>, ... | none
```

With no tracker connected, the map is the first line alone.

For a calling skill, send the tracker map as the final message, unchanged.
Ask nothing and offer nothing after it. For a user, show the tracker map in
chat.
