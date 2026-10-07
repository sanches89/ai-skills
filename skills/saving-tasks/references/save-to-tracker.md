# Save to the tracker

Step numbers are those of `SKILL.md`.

## Values

Settle these values from the tracker map:

- **Destination.** On `replace`, the replaced item's. Else the `destination`
  option, else the map's `destination` line. When that line reads `none named`
  and the `destinations` line reads `one`, create the items without one. When it
  reads `none named` and `destinations` reads anything else, ask one question:
  which team, project, or board receives the items. With `unattended`, save to
  files by Step 4 instead of asking.
- **Required fields.** Take each value the map's `required fields` line settles.
  Ask one question per field that reads `unsettled`. With `unattended`, save to
  files by Step 4 instead of asking.

## Save

Use the tools and commands of the tracker map:

1. **Task item.** On `replace`, read the item's old body with `read item`. Set
   the item's title to the task's title, unless they are equal, and its body to
   the task draft. When the old body holds a `Task` line, put that line under
   the draft's `#` heading. Without `replace`, create an item at the
   destination, with the task's title, the task draft as body, and the required
   field values.
2. **Old children.** On `replace`, list the item's children with
   `list children`. When that line reads `none`, take them from the links in the
   old body's Subtasks section. Delete each with `delete item`. When the
   `delete item` line reads `none` or the delete fails, close the child with
   `close item`. Unlink each closed child with `unlink child`, unless the
   `unlink child` line reads `none`.
3. **Children.** Create one child item per subtask draft, in subtask order, with
   the subtask's title, its draft as body, and the required field values. Put
   the task's item link on the `Task` line and sibling item links on the
   `Depends on` line. Link each child to the task's item with `link child`. When
   that line starts with `none`, put the child links in the task's body and the
   task's link in each child body.
4. **Subtasks section.** Edit the task item: replace the title and number of
   each entry of its Subtasks section with the link of its child item.

When a tool or command other than a delete fails, stop and end with one line:
`not saved: the tracker failed at <map line>`, with the map line of the action,
such as `create item`.
