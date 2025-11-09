# Utility Scripts

This directory contains helpful utility scripts for ClearSkies development.

## Available Scripts

### Add Item to Player Inventory
**File:** `add-item.js`

Adds items to the player "Juzi" for testing.

```bash
node utils/add-item.js
```

**To modify:**
1. Edit line 28 in the file
2. Change `itemId` and quantity
3. Run the script

**Example item IDs:**
- Resources: `oak_log`, `iron_ore`, `salmon`, `shrimp`
- Equipment: `iron_sword`, `bronze_woodcutting_axe`, `bamboo_fishing_rod`
- Consumables: `bread`, `health_potion`

---

### JSON Safe Serialization
**File:** `jsonSafe.js`

Utility for safely serializing objects with circular references.

```javascript
const { jsonSafe } = require('./utils/jsonSafe');

const obj = { foo: 'bar' };
obj.circular = obj;

console.log(jsonSafe(obj));
// Output: { foo: 'bar', circular: '[Circular]' }
```

**Use cases:**
- Logging complex objects
- API responses with nested Mongoose documents
- Debugging circular reference errors

---

### JWT Utilities
**File:** `jwt.js`

JWT token generation and verification utilities.

```javascript
const { generateToken, verifyToken } = require('./utils/jwt');

const token = generateToken({ userId: '12345' });
const decoded = verifyToken(token);
```

---

### Migration Runner
**File:** `migrations.js`

Database migration utilities (run via npm scripts).

```bash
# Run migrations
npm run migrate

# Check status
npm run migrate:status

# Rollback last migration
npm run migrate:down
```

See [../../CLAUDE.md#database-migrations](../../CLAUDE.md#database-migrations) for migration guide.

---

### Content Generator (Legacy)
**File:** `content-generator.js`

**⚠️ DEPRECATED:** This traditional CLI script has been replaced by the AI-powered Content Generator Agent.

**Use the agent instead:**

Simply describe what content you want in natural language while using Claude Code:

```
"Add a mountain mine where players can mine copper ore"
```

The agent will autonomously create drop tables, activities, facilities, and locations with comprehensive validation.

**Why use the agent:**
- ✅ Natural language interface (no menus)
- ✅ Works in background while you code
- ✅ AI-powered balance suggestions
- ✅ Medieval fantasy description writing
- ✅ Context-aware consistency checking
- ✅ ~30 seconds vs ~27 minutes

**Legacy script still works:**
```bash
node utils/content-generator.js
```

But the agent is recommended for all new content creation.

See [../../project/docs/content-generator-agent.md](../../project/docs/content-generator-agent.md) for agent documentation.

---

## Content Creation with Agent

The recommended way to create game content is via the AI-powered Content Generator Agent.

### Quick Examples

**Simple Resource Gathering:**
```
"Create a fishing spot for catching tuna in deep water"
```

**Complex Location:**
```
"I need a forest clearing with logging and a small market.
Players should be able to chop birch trees at level 5 woodcutting"
```

**Drop Table Only:**
```
"Create a drop table for rare gemstone mining with
rubies (5%), sapphires (10%), and common ore (85%)"
```

**Activity Chain:**
```
"Add salmon fishing to Kennik dock, requires level 10 fishing
and better rewards than shrimp"
```

### What the Agent Does

1. ✅ Reads existing game data for context
2. ✅ Validates all item/skill/biome references
3. ✅ Creates drop tables with balanced weights
4. ✅ Creates activities with requirements
5. ✅ Creates facilities grouping activities
6. ✅ Creates locations with descriptions
7. ✅ Reports back with summary

### Files Created

- Drop Tables: `be/data/locations/drop-tables/{id}.json`
- Activities: `be/data/locations/activities/{id}.json`
- Facilities: `be/data/locations/facilities/{id}.json`
- Locations: `be/data/locations/definitions/{id}.json`

### After Content Creation

1. **Review**: Check `git diff` to see what was created
2. **Restart**: `npm run dev` to load new content
3. **Test**: Try activities in game UI
4. **Adjust**: Ask agent to modify if needed
5. **Commit**: Git commit the new content

---

## Development Tips

### Quick Testing

Add items to test inventory:
```bash
# Edit add-item.js with desired item
node utils/add-item.js
```

Verify in game UI or with MongoDB:
```javascript
// In MongoDB shell
db.players.findOne({ characterName: 'Juzi' }).inventory
```

### Validation Best Practices

The Content Generator Agent validates:
- ✓ Item existence (prevents typos)
- ✓ Skill names (woodcutting, mining, fishing, smithing, cooking)
- ✓ Biome existence (forest, mountain, sea)
- ✓ Drop table integrity
- ✓ Quantity ranges (min ≤ max)
- ✓ Positive weights
- ✓ Balanced rewards and requirements

### Balance Guidelines

When requesting content from the agent:

**Be Specific:**
- ❌ "Add fishing"
- ✅ "Add mackerel fishing at Kennik dock, requires level 5, rewards 50 XP"

**Provide Context:**
- ❌ "Make a mine"
- ✅ "Add an iron mine in the mountains, harder than copper mining (level 15)"

**Reference Existing:**
- ❌ "Add more content"
- ✅ "Add a fishing activity better than salmon but not as hard as tuna"

---

## Common Issues

### "Item does not exist"
The agent will catch this and suggest alternatives or remind you to create the item first.

### "Drop table not found"
The agent creates drop tables before activities reference them, preventing this error.

### "Skill validation failed"
Valid skills: woodcutting, mining, fishing, smithing, cooking

### "Biome not found"
Available biomes: forest, mountain, sea

---

## File Organization

This `utils/` directory contains:
- ✅ **Active utilities**: add-item.js, jsonSafe.js, jwt.js, migrations.js
- ⚠️ **Legacy script**: content-generator.js (use agent instead)

For content creation, use the AI-powered Content Generator Agent via Claude Code.

For database operations, use the migration system.

For testing, use add-item.js to populate player inventory.
