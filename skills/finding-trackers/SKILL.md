---
name: finding-trackers
description: Finds the issue tracker a project uses and the commands that search, read, create, link, comment on, and close its items, changing nothing. Use when the user asks which tracker a project uses or how to reach its issues, and before any step that reads or writes issues, tickets, or items.
license: MIT
---

# Finding trackers

Find the issue tracker a project uses and the way to reach it, and return the
tracker map.

## Hard rules

1. **Read-only.** Never create, edit, delete, link, unlink, comment on, or close
   an item, and never change a project file.
2. **Never ask.** Settle every line of the map from the docs, the connected
   tools, `git`, and `gh`. Write `unsettled` or `none` where they settle
   nothing.

## Invocation

- `from <caller>: find`: a calling skill invoked this run.
- Invocation text without the `from <skill name>:` prefix: a user invoked this
  run.

## Workflow

### Step 1: Find the tracker

**Subagents.** With subagents (in Claude Code, the `Agent` tool), run each read
or command that yields only facts in a subagent. It returns the facts with path
and line.

The tracker is the project's issue tracker, reached through an MCP server or
`gh`, the GitHub CLI. Take the first rule that applies:

1. the tracker that README, CLAUDE.md, AGENTS.md, CONTRIBUTING, or
   `docs/README.md` names, when an MCP server or `gh` reaches it. When the docs
   name one that nothing reaches, no tracker is connected;
2. the tracker of an MCP server whose tools read and write issues. List the
   agent's MCP tools (in Claude Code they are deferred: search them with
   `ToolSearch` for `issue ticket project linear jira notion asana github`).
   With several, the first listed;
3. GitHub Issues through `gh`, when `git remote get-url origin` prints a
   `github.com` URL and `gh auth status` exits 0;
4. else no tracker is connected.

`gh` reaches GitHub Issues only when both conditions of rule 3 hold.

With no tracker connected, go to Step 3 with the first line
`tracker: none: <reason>`. The reason states in one line what the rules found,
such as `the docs name Jira and nothing reaches it`.

### Step 2: Map the actions

Fill each action line of the tracker map with the tool name or command that
performs the action, else `none`.

For a tracker reached through `gh`, read `references/gh-map.md` and fill the map
by it. For one reached through an MCP server, read `references/mcp-map.md` and
fill the map by it.

**Destination.** Write the team, project, or board that the docs of rule 1 name
for new items, else `none named`.

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
unlink child: <tool or command> | none
completed status: <status names> | unsettled
destination: <team, project, or board the docs name> | none named
destinations: one | several | unsettled
required fields: <field>: <value | unsettled>, ... | none
```

With no tracker connected, the map is the first line alone.

For a calling skill, send the tracker map unchanged as the final message, with
nothing after it. For a user, show it in chat.
