---
description: Save the last response as a new project documentation file
---

You are tasked with creating a new documentation file in the `project/docs/` directory based on the concept or feature explained in your most recent response to the user (before this command was invoked).

## Your Task

1. **Identify the next sequential number**:
   - List all files in `project/docs/` to find the highest numbered file (e.g., `038-potion-naming-standardization.md`)
   - Increment by 1 to get the next number (e.g., `039`)
   - Format as 3 digits (e.g., `039`)

2. **Generate a filename**:
   - Use the format: `{number}-{descriptive-name}.md`
   - The descriptive name should be kebab-case (lowercase with hyphens)
   - The name should clearly describe the concept/feature being documented
   - Examples: `039-buff-system-mechanics.md`, `040-fishing-minigame.md`

3. **Ask the user for the filename**:
   - Suggest a filename based on the concept from your last response
   - Format: "I'll create documentation for [concept]. Suggested filename: `{number}-{name}.md`. Is this okay, or would you like a different name?"
   - Wait for user confirmation or alternative name

4. **Create the documentation file**:
   - Follow the structure of existing docs in `project/docs/`
   - Include these sections as appropriate:
     - Header with title
     - **Date**: Current date
     - **Status**: (e.g., Completed, In Progress, Planned)
     - **Overview**: Brief summary of the concept
     - **Design Rationale**: Why this approach was chosen
     - **Implementation Details**: How it works
     - **Changes Made**: What files were modified/created
     - **Benefits**: Why this is valuable
     - **Future Expansion**: How this can grow
     - **Related Documentation**: Links to related docs
     - **Implementation Files**: Links to relevant code files

5. **Content Guidelines**:
   - Be comprehensive but concise
   - Use markdown formatting (headers, lists, tables, code blocks)
   - Include specific file paths with links (e.g., `[ItemRegistry.ts](../../be/data/items/ItemRegistry.ts)`)
   - Use tables for comparisons or lists of changes
   - Include code examples where relevant
   - Cross-reference related documentation
   - Focus on "why" and "how", not just "what"

6. **Confirm creation**:
   - After creating the file, tell the user:
     - The filename created
     - A brief summary of what was documented
     - The total number of docs now in `project/docs/`

## Example Workflow

**User runs**: `/project-doc`

**You respond**: "I'll create documentation for the potion naming standardization system. Suggested filename: `039-potion-naming-standardization.md`. Is this okay, or would you like a different name?"

**User**: "That's perfect"

**You**: [Create the file with comprehensive documentation]

**You confirm**: "Created `project/docs/039-potion-naming-standardization.md` documenting the alchemical progression naming system for health and mana potions. The project now has 39 documentation files."

## Important Notes

- DO NOT create the file until the user approves the filename
- If the user was just asking a question (not implementing a feature), ask if they want documentation for that concept
- If your last response was very brief or not documentation-worthy, politely suggest this might not need a separate doc
- Maintain consistency with existing documentation style in `project/docs/`
- Always use the sequential numbering format established in the project
