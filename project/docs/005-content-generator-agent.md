# Content Generator Agent

## Overview

The Content Generator Agent is a specialized Claude Code agent that creates game content (locations, facilities, activities, and drop tables) for ClearSkies. It works autonomously in the background, allowing you to continue development while it handles content creation with comprehensive validation.

## Key Features

- **AI-Powered Creation**: Natural language requests for content generation
- **Autonomous Operation**: Works in the background while you code
- **Comprehensive Validation**: Ensures all item references exist and data is valid
- **Intelligent Suggestions**: Recommends balanced drop rates, XP rewards, and durations
- **Medieval Fantasy Writing**: Generates evocative descriptions matching game's tone
- **Complete Workflow**: Handles entire creation process from drop tables to locations

## How to Use

### Basic Invocation

Simply describe what content you want to add in natural language:

```
"Add a mountain mine where players can mine copper ore"
```

The agent will:
1. ✓ Verify copper_ore item exists
2. ✓ Create drop table with balanced weights
3. ✓ Create mining activity with requirements
4. ✓ Create mountain mine facility
5. ✓ Create location with mountain biome
6. ✓ Report back with summary

### Example Requests

**Simple Resource Gathering:**
```
"Create a fishing spot for catching tuna in deep water"
```

**Complex Location:**
```
"I need a forest clearing with logging and a small market.
Players should be able to chop birch trees (level 5 woodcutting)"
```

**Drop Table Only:**
```
"Create a drop table for rare gemstone mining with
rubies (5%), sapphires (10%), and common ore (85%)"
```

**Activity Chain:**
```
"Add salmon fishing to the Kennik dock.
Requires level 10 fishing and better rewards than shrimp"
```

## What the Agent Creates

### 1. Drop Tables
Weighted loot pools with item validation.

**What You Say:**
```
"Create a drop table for mackerel fishing"
```

**What It Creates:**
```json
{
  "dropTableId": "fishing-mackerel",
  "name": "Mackerel Catch",
  "description": "Fresh mackerel from the deep waters",
  "drops": [
    {
      "itemId": "mackerel",
      "weight": 70,
      "quantity": { "min": 1, "max": 3 },
      "qualityBonus": 0.1,
      "comment": "Common catch"
    },
    {
      "itemId": "mackerel",
      "weight": 20,
      "quantity": { "min": 3, "max": 5 },
      "qualityBonus": 0.2,
      "comment": "Good haul"
    },
    {
      "dropNothing": true,
      "weight": 10,
      "comment": "The fish escaped"
    }
  ]
}
```

**Saved to:** `be/data/locations/drop-tables/fishing-mackerel.json`

### 2. Activities
Actions with requirements and rewards.

**What You Say:**
```
"Add a mackerel fishing activity requiring level 5 fishing"
```

**What It Creates:**
```json
{
  "activityId": "activity-fish-mackerel",
  "name": "Fish for Mackerel",
  "description": "Cast your line into deeper waters, where mackerel swim in silvery schools beneath the waves",
  "type": "resource-gathering",
  "duration": 10,
  "requirements": {
    "skills": { "fishing": 5 },
    "equipped": [{ "subtype": "fishing-rod" }]
  },
  "rewards": {
    "experience": { "fishing": 50 },
    "dropTables": ["fishing-mackerel"]
  }
}
```

**Saved to:** `be/data/locations/activities/activity-fish-mackerel.json`

### 3. Facilities
Buildings that house activities.

**What You Say:**
```
"Create a deep water dock facility for mackerel and tuna fishing"
```

**What It Creates:**
```json
{
  "facilityId": "deep-water-dock",
  "name": "Deep Water Dock",
  "description": "Sturdy wooden planks extend far into the harbor, where the water runs deep and cold",
  "type": "resource-gathering",
  "icon": "fishing",
  "activities": [
    "activity-fish-mackerel",
    "activity-fish-tuna"
  ]
}
```

**Saved to:** `be/data/locations/facilities/deep-water-dock.json`

### 4. Locations
Areas with facilities and navigation.

**What You Say:**
```
"Add a coastal village with the deep water dock, 2 minutes travel from Kennik"
```

**What It Creates:**
```json
{
  "locationId": "coastal-village",
  "name": "Coastal Village",
  "description": "A weathered fishing village clings to rocky cliffs above the churning sea. Salt spray fills the air as gulls wheel overhead",
  "biome": "sea",
  "facilities": ["deep-water-dock"],
  "navigationLinks": [
    {
      "targetLocationId": "kennik",
      "name": "Coastal Path",
      "description": "A narrow sandy path winds along the clifftops",
      "travelTime": 120,
      "requirements": {},
      "encounters": []
    }
  ],
  "isStartingLocation": false
}
```

**Saved to:** `be/data/locations/definitions/coastal-village.json`

## Agent Capabilities

### Validation
- ✓ Verifies all item IDs exist before creating drop tables
- ✓ Checks skill names against valid skills
- ✓ Validates biome references
- ✓ Ensures drop tables exist before activities reference them
- ✓ Confirms quantity ranges are valid (min ≤ max)
- ✓ Validates weights are positive

### Intelligent Suggestions
- Balanced drop rates based on rarity (common: 60-80%, rare: 5-15%)
- Appropriate quality bonuses (common: 0.1-0.2, rare: 0.3-0.5)
- Reasonable activity durations (short: 5-15s, medium: 15-60s, long: 60-300s)
- XP rewards matching difficulty (basic: 20-50, advanced: 50-100)
- Skill level requirements for progression
- Tool requirements (woodcutting-axe, mining-pickaxe, fishing-rod)

### Writing Style
Generates medieval fantasy descriptions:
- "Weathered docks creak beneath your feet as seabirds cry overhead"
- "Ancient oaks tower above the forest floor, their branches heavy with years"
- "The rhythmic clang of hammer on anvil echoes through the smoky forge"

### Autonomous Features
- Works in the background while you continue coding
- Handles entire content creation workflow
- Creates related content automatically (drop table → activity → facility → location)
- Reports back with comprehensive summary
- Explains design decisions and balance choices

## Usage Patterns

### Quick Single Item

```
"Add shrimp fishing to Kennik dock, level 1 requirement"
```

Agent creates drop table, activity, and updates facility.

### Full Location Package

```
"Create an iron mine in the mountains. Players need level 15 mining.
Rewards should be better than copper. Include a travel path from the forest clearing."
```

Agent creates:
1. Drop table for iron ore
2. Mining activity with level 15 requirement
3. Mountain mine facility
4. Iron mine location
5. Navigation link from forest clearing

### Content Iteration

```
"The salmon drop rate is too low, increase it"
```

Agent reads current drop table, updates weights, and explains changes.

### Balance Adjustment

```
"Make woodcutting oak trees require level 3 instead of 1"
```

Agent updates activity requirements and suggests XP adjustments.

## Workflow Comparison

### Traditional Approach (Without Agent)
```
1. Research existing content ⏱️ 5 min
2. Create drop table JSON ⏱️ 3 min
3. Validate item IDs exist ⏱️ 2 min
4. Create activity JSON ⏱️ 5 min
5. Validate references ⏱️ 2 min
6. Create facility JSON ⏱️ 3 min
7. Update location JSON ⏱️ 2 min
8. Test in game ⏱️ 5 min
Total: ~27 minutes + context switching
```

### With Agent
```
You: "Add salmon fishing to Kennik dock, level 8 requirement"
Agent: *works in background*
Agent: "Created salmon fishing activity with drop table..." ✅
Total: ~30 seconds of your time
```

## Advanced Features

### Context-Aware Balance

Agent considers existing content:
```
You: "Add another fishing activity at Kennik"

Agent reads existing activities (shrimp, cod, salmon) and suggests:
- Higher level requirement than salmon (10+)
- Better rewards for progression
- Unique fish not already available
```

### Error Prevention

```
You: "Create drop table for golden_fish"

Agent: "The item 'golden_fish' doesn't exist in item definitions.
Available fish items: salmon, trout, shrimp, cod.
Would you like me to suggest creating a new fish item first?"
```

### Consistency Checking

```
You: "Add tuna fishing"

Agent: "I notice tuna fishing would be similar to salmon (both deep water).
Recommendations:
- Require level 12 fishing (salmon is 10)
- Duration: 12s (salmon is 10s)
- XP: 65 (salmon is 55)
- Higher quality bonus for rarity (0.3 vs salmon's 0.2)
Proceeding with creation..."
```

## Integration with Development

### While You Code

```
# Terminal 1: Your work
You: Working on inventory UI improvements...

# Terminal 2: Background agent
You: "Add a blacksmith facility in Kennik with copper sword crafting"
Agent: *creates content while you continue coding*
Agent: "Blacksmith facility created with copper sword crafting activity..."
```

### Quick Content Testing

```bash
# 1. Request content via agent
"Add gem mining with rubies and sapphires"

# 2. Agent creates everything
# ... works autonomously ...

# 3. Restart server
npm run dev

# 4. Test in game immediately
# Content is already validated and ready
```

## Validation Rules

### Drop Tables
- All `itemId` values MUST exist
- Weights must be positive numbers
- `quantity.min` ≤ `quantity.max`
- `qualityBonus` in range 0-1
- Total weights don't matter (relative ratios: 70/20/10 = 7/2/1)

### Activities
- Skills: woodcutting, mining, fishing, smithing, cooking
- Valid equipment subtypes: woodcutting-axe, mining-pickaxe, fishing-rod, sword, shield, helm, coif, tunic
- All inventory requirement items must exist
- All drop tables referenced must exist
- Duration in seconds (reasonable: 5-300)

### Facilities
- Required: facilityId, name, description, type
- Activities array can reference not-yet-created activities

### Locations
- Biome must exist: forest, mountain, sea
- All facilities must exist
- travelTime in seconds (reasonable: 30-600)

## Tips for Best Results

### Be Specific

❌ "Add fishing"
✅ "Add mackerel fishing at Kennik dock, requires level 5, rewards 50 XP"

### Provide Context

❌ "Make a mine"
✅ "Add an iron mine in the mountains, harder than copper mining (level 15)"

### Reference Existing Content

❌ "Add more content"
✅ "Add a fishing activity better than salmon but not as hard as tuna would be"

### Trust the Agent

The agent will:
- Validate all references
- Balance rewards appropriately
- Write compelling descriptions
- Create proper JSON structure
- Report what it did

You don't need to micromanage - just describe what you want!

## File Locations

Content is saved to:
- Drop Tables: `be/data/locations/drop-tables/{id}.json`
- Activities: `be/data/locations/activities/{id}.json`
- Facilities: `be/data/locations/facilities/{id}.json`
- Locations: `be/data/locations/definitions/{id}.json`

## After Content Creation

1. **Auto-loaded**: Server will load new JSON files on restart
2. **Review**: Check git diff to see what was created
3. **Test**: Run activities in game UI
4. **Adjust**: Ask agent to modify if needed
5. **Commit**: Git commit the new content

## Troubleshooting

### "Item doesn't exist"
Agent will report which item is missing and suggest alternatives or offer to remind you to create it.

### "Drop table not found"
Agent creates drop tables before activities, preventing this error.

### "Balance seems off"
Ask agent to adjust: "Make oak chopping rewards higher" or "Reduce salmon drop rate"

### "Description too generic"
Request: "Make the description more atmospheric" or "Add more sensory details"

## Future Enhancements

The agent can be extended to:
- Create new item definitions
- Generate quest chains
- Design NPC dialogue
- Balance existing content
- Create seasonal events
- Generate dungeon layouts

## Comparison: Traditional Script vs Agent

### Traditional CLI Script (Previous)
```bash
node utils/content-generator.js
# Interactive prompts for each field
# Manual validation
# Fixed logic
# ~10-15 minutes per location
```

### Claude Code Agent (Current)
```
"Add coastal fishing village with tuna and mackerel"
# Agent works autonomously
# AI-powered validation and suggestions
# ~30 seconds of your time
# Continue coding immediately
```

## Getting Started

Just describe what content you want in natural language. The agent handles everything else!

```
"I want to add a gem mine in the mountains where players can find rubies and sapphires.
Make it require level 20 mining since it should be end-game content."
```

The agent will create a complete, validated, balanced location ready to test in game.
