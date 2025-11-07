---
description: Move a todo task to completed
---

Move a todo file from `project/tasks/todo/` to `project/tasks/complete/`.

Instructions:
1. Ask the user which todo file they want to mark as complete (if not already specified in their message)
2. Use the `mv` command to move the file from `project/tasks/todo/` to `project/tasks/complete/`
3. Update the file to add:
   - Completion date at the top
   - "Status: ✅ COMPLETE" marker
4. Confirm the file was moved successfully

Example usage:
- User: "/todo-done implement-combat-system.md"
- User: "/todo-done combat" (you should find the matching file)
