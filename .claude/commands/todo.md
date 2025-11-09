---
description: Save the last AI response as a todo task (project)
---

Create a new markdown file in the `project/tasks/todo/` directory.

**ARGUMENTS**: If arguments are provided, use them as the title/description for the todo task. If no arguments, use the AI's last response.

Instructions:
1. If ARGUMENTS provided:
   - Use ARGUMENTS as the task title/description
   - Generate a short, descriptive filename based on ARGUMENTS (kebab-case, e.g., "implement-combat-system.md")
   - Create a minimal todo file with:
     - Title (# heading from ARGUMENTS)
     - Date created
     - Brief description/context
2. If NO ARGUMENTS:
   - Review the content of your last response
   - Generate a short, descriptive filename (kebab-case, e.g., "implement-combat-system.md")
   - Create the file with the following structure:
     - Title (# heading based on the main topic)
     - Date created
     - Description/overview from the response
     - Any action items or steps mentioned
     - Relevant context or notes
3. Confirm the file was created and show the filename

Make the content well-formatted and easy to reference later.