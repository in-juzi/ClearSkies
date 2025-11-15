---
description: Check backend TypeScript build for errors and fix them automatically
scope: project
---

Check the backend TypeScript build for errors by running `npm run build` in the `be/` directory.

If there are any compilation errors:
1. Analyze the error messages
2. Fix the errors immediately without prompting the user
3. Re-run the build to verify the fixes
4. Report what was fixed

If the build is successful, report that no errors were found.

IMPORTANT: Do not ask the user if they want to fix errors - proceed directly with fixing them.
