---
description: Organize unstaged changes into logical commits and update documentation
tags: [project]
---

You are tasked with running an automated workflow that:

1. First runs the `/logical-commits` workflow to organize unstaged changes
2. Then automatically runs the `/context-update` workflow to update CLAUDE.md
3. Provides a final summary of all commits created and documentation updated

## Step 1: Run Logical Commits

Execute the `/logical-commits` workflow:
- Analyze current unstaged changes
- Group changes by logical feature/fix/refactor
- Create atomic commits with descriptive messages
- DO NOT ask for confirmation - proceed directly with the groupings you identify

## Step 2: Run Context Update

After all commits are created, execute the `/context-update` workflow:
- Update CLAUDE.md to reflect current codebase state
- Add new features to completed list
- Update project structure, models, API endpoints as needed
- DO NOT ask for confirmation - proceed directly with the updates

## Step 3: Provide Summary

After both workflows complete, provide a concise summary:

```
✅ Checkpoint Complete

Commits Created: [number]
[list commit hashes and titles]

Documentation Updated:
[brief summary of CLAUDE.md changes]

Your changes are now organized and documented!
```

## Important Notes

- Run both workflows automatically without prompting the user
- Only skip if there are no unstaged changes (inform user)
- This is a convenience command for the user's common workflow pattern
- Be thorough but efficient
