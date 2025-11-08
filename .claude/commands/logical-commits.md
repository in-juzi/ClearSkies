---
description: Break unstaged changes into logical commits with related features grouped together
---

You are tasked with analyzing the current unstaged changes and creating logical, atomic commits that group related changes together.

## Your Task

1. **Analyze Current Changes**:
   - Run `git status` to see all modified, added, and deleted files
   - Run `git diff` to see the actual changes in each file
   - Understand what changes have been made and how they relate to each other

2. **Identify Logical Groups**:
   Group changes by:
   - **Feature**: Changes that implement a single feature together (e.g., all files for a new skills system)
   - **Fix**: Bug fixes and their related test/documentation updates
   - **Refactor**: Code improvements without functional changes
   - **Style**: UI/styling changes that belong together
   - **Docs**: Documentation updates
   - **Config**: Configuration or build system changes
   - **Dependencies**: Related changes across backend and frontend for the same feature

3. **Create Commit Groups**:
   For each logical group, identify:
   - All files that belong to this group
   - A clear, descriptive commit message following the format:
     ```
     <type>: <short description>

     <detailed explanation if needed>

     🤖 Generated with [Claude Code](https://claude.com/claude-code)

     Co-Authored-By: Claude <noreply@anthropic.com>
     ```
   - Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`

4. **Execute Commits**:
   - Stage files for each logical group using `git add <files>`
   - Create commit with appropriate message
   - Verify with `git status` after each commit
   - Continue until all changes are committed

## Guidelines

- **Atomic Commits**: Each commit should represent one logical change
- **Clear Messages**: Use descriptive commit messages that explain WHY, not just WHAT
- **Order Matters**: Commit in logical order (e.g., backend models before frontend that depends on them)
- **Related Changes**: Keep frontend and backend changes for the same feature together if they're interdependent
- **Separate Concerns**: Don't mix unrelated changes (e.g., don't combine a new feature with a bug fix)
- **Documentation**: Include documentation updates with the feature they document

## Example Groupings

**Good Grouping:**
- Commit 1: `feat: add skills system to Player model and API`
  - `be/models/Player.js` (skills schema)
  - `be/controllers/skillsController.js`
  - `be/routes/skills.js`
  - `be/index.js` (route registration)

- Commit 2: `feat: implement skills UI with progress tracking`
  - `ui/src/app/models/user.model.ts` (skill interfaces)
  - `ui/src/app/services/skills.service.ts`
  - `ui/src/app/components/game/skills/*`

- Commit 3: `fix: resolve session persistence circular dependency`
  - `ui/src/app/interceptors/auth.interceptor.ts`
  - `ui/src/app/guards/auth.guard.ts`
  - `ui/src/app/services/auth.service.ts`

**Bad Grouping:**
- ❌ Mixing skills system with auth fixes
- ❌ Combining unrelated backend and frontend changes
- ❌ Grouping multiple features into one commit

## Process

1. First, explain to the user what logical groups you've identified
2. Ask for confirmation or adjustments before proceeding
3. Execute the commits in order
4. Provide a summary of all commits created

## Important Notes

- DO NOT commit files that likely contain secrets (.env, credentials.json, etc.)
- DO NOT push to remote unless user explicitly requests it
- Use heredoc format for commit messages to ensure proper formatting
- After all commits, run `git log --oneline -n <count>` to show what was created
