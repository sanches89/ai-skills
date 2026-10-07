# Tracker map through an MCP server

Read the name and the input schema of every tool of the server. Fill:

- tracker with the tracker's name, and reached through with the server's name;
- read parent with the tool or the field that returns an item's parent, else
  `none`;
- list children with the tool or the field that returns an item's children, else
  `none`;
- link child with the tool and the field of the tracker's relation for children:
  a sub-issue, a child, or a parent field. Without such a relation, write
  `none: children linked in the body`;
- unlink child with the tool and the field that remove a child from that
  relation, else `none`;
- completed status with the name of every status in the tracker's completed or
  done category, read with the tracker's tools. When no tool lists them, write
  `unsettled`;
- destinations with `one` or `several`: the count of teams, projects, or boards
  that the tracker's tools list for new items. When no tool lists them, write
  `unsettled`;
- required fields with every field that the input schema of the create tool
  marks required, for an item and for a child item. Leave out the title, the
  body, the parent field, and the team, project, or board field. Give each field
  the value the docs of rule 1 of Step 1 in `SKILL.md` name, else `unsettled`.
  With no such field, write `none`.
