# Conversation Management Guide for Claude Code

## TL;DR: Stay in Conversations Longer

**General Rule:** Keep conversations going for entire "feature sessions" rather than starting fresh after each small task. Start new conversations only when switching to completely unrelated work or when you hit context limits.

## Why Longer Conversations Are Better

### 1. Accumulated Context is Valuable
- Claude learns project-specific patterns and your preferences
- Remembers recent changes and why decisions were made
- Understands what you've already tried (avoids repeating failed approaches)
- Can reference earlier work without re-exploring the codebase

### 2. Efficiency
- No need to re-explain context each time
- Claude already knows what files you've been working with
- Faster responses (doesn't need to re-search the same files)
- Better continuity between related tasks

### 3. Problem Solving
- Claude can connect issues across different features
- Remembers known bugs you've mentioned
- Understands your coding style and project conventions

## When to Start a New Conversation

### ✅ DO Start Fresh When:
- Switching to completely unrelated features (e.g., combat system → UI redesign)
- Context window is full (you'll get warnings about truncation)
- Conversation feels "confused" (Claude giving incorrect info based on outdated context)
- Major refactoring completed (clean slate for new architecture)
- You want to test if CLAUDE.md is sufficient without conversation history
- End of coding session for the day (if starting fresh next session)

### ❌ DON'T Start Fresh After:
- Completing one small feature/fix
- Just because you're moving to the next item on a todo list
- Switching between frontend/backend in same feature
- Running into an error (Claude needs context to debug!)
- Minor tweaks or adjustments to recent work

## Examples

### Less Efficient Approach:
```
Chat 1: "Add herbalism skill" → completes → close chat
Chat 2: "Add herb gathering activities" → have to re-explain herbalism
Chat 3: "Fix herb drop tables" → have to re-explain activities
```

### More Efficient Approach:
```
Chat 1:
  - "Add herbalism skill"
  - "Now add herb gathering activities"
  - "The sage drop rate seems high, let's adjust"
  - "Add more herb types to mountain pass"
  → All context preserved, faster iteration
```

## Good Stopping Points for New Conversations

**Feature Sessions:**
- After completing a major feature AND testing it
- After a logical "checkpoint" (use `/checkpoint` command!)
- When switching problem domains (gameplay → infrastructure → UI redesign)

**Rule of Thumb:** If the next task might reference "what we just did," stay in the conversation.

## Token Usage Clarification

### CLAUDE.md Size
- CLAUDE.md is included in context of **every message**
- Current CLAUDE.md: ~15,000 tokens (reasonable size)
- Counts toward input tokens, but **NOT** toward 5x Opus usage limit

### 5x Opus Usage Limit
- The 5x limit refers to using **Claude Opus model** instead of Sonnet
- It's about **model selection**, not token count
- ClearSkies uses **Sonnet 4.5** by default, so CLAUDE.md size doesn't affect this limit

### What Actually Impacts You:
1. **Context window**: Large CLAUDE.md uses space in the 200k token context window
2. **Cost**: More input tokens = higher API costs (if on paid plan)
3. **Latency**: Larger contexts take slightly longer to process
4. **Response quality**: If CLAUDE.md is too large, it might crowd out conversation history

### CLAUDE.md Optimization (Optional)
Only optimize if you're hitting context limits or concerned about costs:
- Move detailed docs to separate files (keep high-level summaries in CLAUDE.md)
- Remove redundant examples
- Condense commit history (keep only last 2-3 commits)
- Simplify file listings (use categories instead of listing every file)

**Recommendation:** Don't optimize yet - current CLAUDE.md is well-sized for active development.

## Best Practice Workflow

1. **Start conversation** for a feature or related set of features
2. **Iterate** on that feature with multiple prompts in same chat
3. **Test and refine** within the conversation
4. **Use `/checkpoint`** when feature is complete to commit + update docs
5. **Continue or close:**
   - Continue if next task is related
   - Close if switching to completely different area

## Benefits Summary

**Staying in longer conversations:**
- ✅ Faster development (less re-explaining)
- ✅ Better context for debugging
- ✅ More intelligent suggestions
- ✅ Continuity between related tasks
- ✅ Less cognitive overhead for you

**Starting fresh conversations:**
- ✅ Clean slate for unrelated work
- ✅ Prevents confusion from outdated context
- ✅ Allows testing CLAUDE.md completeness
