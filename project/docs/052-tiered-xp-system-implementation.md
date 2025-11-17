# Tiered XP System Implementation

**Date**: 2025-11-16
**Status**: ✅ Completed
**Related**: [032-xp-system.md](032-xp-system.md)

## Problem Statement

The original XP system used a flat 1000 XP per level with activity XP scaled down based on player level vs activity level. This created several problems:

### Issues with the Old System

1. **Unpredictable Progression**: High-tier endgame activities gave similar XP amounts as starter activities after scaling, making progression feel unrewarding
2. **Player Confusion**: Players couldn't calculate "given X time investment, how much XP they would receive doing a certain activity"
3. **Early Game Bottleneck**: Low levels (1-5) required too much grinding to unlock content, limiting player options
4. **Counterintuitive Design**: Mining end-game ore at level 50 gave about the same scaled XP as mining copper at level 1

### Example of the Problem

**Old System** (with scaling):
- Player Level 1 mines copper (base 45 XP) → receives ~45 XP
- Player Level 50 mines mythril (base 200 XP) → receives ~50 XP (scaled down)
- **Result**: No incentive to progress to higher-tier content

## Solution: Tiered XP Curve with Fixed Activity XP

### Design Goals

1. **Predictable Progression**: Players can calculate exactly how many actions are needed to level
2. **Fast Early Game**: Levels 1-10 require minimal grinding to unlock content quickly
3. **Long-term Engagement**: Higher levels require exponentially more XP, rewarding dedicated players
4. **Tier-Based Content**: Activities are tier-locked, so players naturally progress to higher-tier activities for better XP rates

### XP Curve Design

```typescript
// Tiered XP requirements per level
const XP_TIERS = [
  { minLevel: 1,  maxLevel: 10,  xpPerLevel: 100   }, // Early game (fast unlock)
  { minLevel: 11, maxLevel: 20,  xpPerLevel: 500   }, // Mid-early game
  { minLevel: 21, maxLevel: 30,  xpPerLevel: 1500  }, // Mid game
  { minLevel: 31, maxLevel: 40,  xpPerLevel: 3000  }, // Late game
  { minLevel: 41, maxLevel: 50,  xpPerLevel: 5000  }, // End game
];
```

**Cumulative XP to reach each tier**:
- Level 10: 1,000 XP total (100 XP × 10 levels)
- Level 20: 6,000 XP total (1,000 + 5,000)
- Level 30: 21,000 XP total (6,000 + 15,000)
- Level 40: 51,000 XP total (21,000 + 30,000)
- Level 50: 101,000 XP total (51,000 + 50,000)

### Activity XP Tiers

Activities give **fixed XP** (no player-level scaling):

```typescript
const ACTIVITY_XP_TIERS = {
  T1: 20 XP,   // Levels 1-10  (copper ore, oak logs, shrimp)
  T2: 50 XP,   // Levels 11-20 (iron ore, willow logs, salmon)
  T3: 100 XP,  // Levels 21-30 (steel ore, maple logs, tuna)
  T4: 175 XP,  // Levels 31-40 (mithril ore, yew logs, lobster)
  T5: 300 XP,  // Levels 41-50 (adamant ore, magic logs, shark)
};
```

### Progression Examples

**Example 1: Early Game (Woodcutting 1 → 10)**
- Activity: Chop Oak Trees (20 XP per action, 6 seconds each)
- XP needed: 1,000 XP total
- Actions required: 50 chops (1000 ÷ 20)
- Time investment: 5 minutes (50 × 6 seconds)

**Example 2: Mid Game (Mining 20 → 21)**
- Activity: Mine Iron Ore (20 XP per action, 10 seconds each)
- XP needed: 500 XP for level 21
- Actions required: 25 mines (500 ÷ 20)
- Time investment: ~4 minutes (25 × 10 seconds)
- **Note**: Player should progress to T2 mining for better XP rates

**Example 3: Tier Progression**
- Level 15 player mining copper (T1, 20 XP) vs iron (T2, 50 XP):
  - Copper: 500 XP needed ÷ 20 XP = 25 actions
  - Iron: 500 XP needed ÷ 50 XP = 10 actions
  - **Result**: 2.5× faster progression with tier-appropriate content

## Implementation Details

### Backend Changes

#### 1. XP Curve Generator ([be/utils/generate-xp-curve.ts](../../be/utils/generate-xp-curve.ts))

Utility script to generate XP lookup tables:

```typescript
interface XPTier {
  minLevel: number;
  maxLevel: number;
  xpPerLevel: number;
}

const XP_TIERS: XPTier[] = [
  { minLevel: 1,  maxLevel: 10,  xpPerLevel: 100 },
  { minLevel: 11, maxLevel: 20,  xpPerLevel: 500 },
  { minLevel: 21, maxLevel: 30,  xpPerLevel: 1500 },
  { minLevel: 31, maxLevel: 40,  xpPerLevel: 3000 },
  { minLevel: 41, maxLevel: 50,  xpPerLevel: 5000 },
];

function generateXPCurve(tiers: XPTier[]): number[] {
  const xpPerLevel: number[] = new Array(50).fill(0);

  for (const tier of tiers) {
    for (let level = tier.minLevel; level <= tier.maxLevel; level++) {
      xpPerLevel[level - 1] = tier.xpPerLevel;
    }
  }

  return xpPerLevel;
}
```

**Usage**: `npm run generate:xp-curve`

#### 2. Shared Constants ([shared/constants/attribute-constants.ts](../../shared/constants/attribute-constants.ts))

Added XP lookup table and helper functions:

```typescript
export const XP_PER_LEVEL: number[] = [
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100,  // L1-10
  500, 500, 500, 500, 500, 500, 500, 500, 500, 500,  // L11-20
  1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,  // L21-30
  3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,  // L31-40
  5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000   // L41-50
];

// Get XP needed for a specific level
export function getXPForLevel(level: number): number {
  if (level < 1 || level > 50) return XP_PER_LEVEL[49];
  return XP_PER_LEVEL[level - 1];
}

// Get total cumulative XP needed to reach a level
export function getTotalXPForLevel(targetLevel: number): number {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

// Get XP needed to reach next level from current progress
export function getXPToNextLevel(currentLevel: number, currentXP: number): number {
  const xpNeeded = getXPForLevel(currentLevel);
  return Math.max(0, xpNeeded - currentXP);
}

// Get percentage progress to next level
export function getPercentToNextLevel(currentLevel: number, currentXP: number): number {
  const xpNeeded = getXPForLevel(currentLevel);
  return Math.min(100, (currentXP / xpNeeded) * 100);
}
```

#### 3. Player Model ([be/models/Player.ts](../../be/models/Player.ts))

Updated skill/attribute XP methods:

```typescript
// Before: Simple increment
skill.experience += amount;
if (skill.experience >= 1000) {
  skill.level++;
  skill.experience -= 1000;
}

// After: Level-up loop with tiered XP
let newLevel = skill.level;
let leveledUp = false;

while (skill.experience >= getXPForLevel(newLevel)) {
  skill.experience -= getXPForLevel(newLevel);
  newLevel++;
  leveledUp = true;
}

if (leveledUp) {
  skill.level = newLevel;
}
```

Added enriched data methods:

```typescript
getEnrichedSkills(): Record<string, EnrichedSkillData> {
  const enriched: Record<string, EnrichedSkillData> = {};

  for (const [skillName, skillData] of Object.entries(this.skills)) {
    const xpNeeded = getXPForLevel(skillData.level);
    const totalXP = getTotalXPForLevel(skillData.level) + skillData.experience;

    enriched[skillName] = {
      level: skillData.level,
      experience: skillData.experience,
      xpToNextLevel: xpNeeded - skillData.experience,
      percentToNextLevel: getPercentToNextLevel(skillData.level, skillData.experience),
      totalXP,
      mainAttribute: skillData.mainAttribute
    };
  }

  return enriched;
}
```

#### 4. Controllers

Updated to return enriched data:

```typescript
// Before
res.json({ skills: player.skills });

// After
const enrichedSkills = player.getEnrichedSkills();
res.json({ skills: enrichedSkills });
```

#### 5. Location Service ([be/services/locationService.ts](../../be/services/locationService.ts))

Removed XP scaling entirely:

```typescript
// Before: Scaled XP based on level difference
calculateScaledXP(baseXP: number, playerLevel: number, activityLevel: number): number {
  const levelDiff = playerLevel - activityLevel;
  if (levelDiff <= 1) return baseXP;

  const scalingFactor = 1 / (1 + 0.3 * (levelDiff - 1));
  return Math.max(1, Math.floor(baseXP * scalingFactor));
}

// After: Fixed XP from activity definition
const rewards = {
  experience: activity.rewards.experience || {},
  items: [],
  gold: 0
};
// XP rewards are now fixed per activity (no scaling)
```

### Frontend Changes

#### 1. Type Definitions ([ui/src/app/models/user.model.ts](../../ui/src/app/models/user.model.ts))

Added enriched data fields:

```typescript
export interface SkillWithProgress extends Skill {
  progress: number;
  xpToNextLevel?: number;        // NEW
  percentToNextLevel?: number;   // NEW
  totalXP?: number;              // NEW
}

export interface AttributeWithProgress extends Attribute {
  progress: number;
  xpToNextLevel?: number;        // NEW
  percentToNextLevel?: number;   // NEW
  totalXP?: number;              // NEW
}
```

#### 2. Skills Service ([ui/src/app/services/skills.service.ts](../../ui/src/app/services/skills.service.ts))

Updated to use backend-provided data:

```typescript
// Before: Hardcoded 1000 XP formula
getExperienceToNext(experience: number): number {
  return 1000 - (experience % 1000);
}

// After: Use enriched data from backend
getExperienceToNext(skill: SkillWithProgress): number {
  return skill.xpToNextLevel ?? 0;
}

getSkillProgressPercent(skill: SkillWithProgress): number {
  return skill.percentToNextLevel ?? 0;
}
```

#### 3. UI Components

Updated templates to display dynamic XP requirements:

```html
<!-- Before: Hardcoded 1000 XP -->
<span>{{ skill.experience % 1000 }} / 1000</span>

<!-- After: Dynamic XP per level -->
<span>{{ skill.experience }} / {{ (skill.xpToNextLevel || 0) + (skill.experience || 0) }}</span>
```

### Migration

#### Migration Script ([be/migrations/017-convert-to-new-xp-curve.js](../../be/migrations/017-convert-to-new-xp-curve.js))

Converts player data from old cumulative XP to new level + progress format:

```javascript
function convertXP(totalXP) {
  let currentLevel = 1;
  let remainingXP = totalXP;

  // Consume XP to calculate level
  while (currentLevel <= 50 && remainingXP >= getXPForLevel(currentLevel)) {
    remainingXP -= getXPForLevel(currentLevel);
    currentLevel++;
  }

  // Cap experience at (max XP for level - 1)
  const maxXPInLevel = getXPForLevel(currentLevel);
  const cappedExperience = Math.min(remainingXP, maxXPInLevel - 1);

  return {
    level: currentLevel,
    experience: cappedExperience
  };
}

async function up() {
  const players = await Player.find({});

  for (const player of players) {
    // Convert skills
    for (const skillName of skillNames) {
      const skill = player.skills[skillName];
      const { level, experience } = convertXP(skill.experience);

      skill.level = level;
      skill.experience = experience;
    }

    // Convert attributes
    for (const attrName of attributeNames) {
      const attr = player.attributes[attrName];
      const { level, experience } = convertXP(attr.experience);

      attr.level = level;
      attr.experience = experience;
    }

    await player.save({ validateBeforeSave: false });
  }
}
```

**Result**: Successfully converted 3 players without data loss.

### Activity XP Updates

#### Survey Script ([be/utils/survey-activity-xp.ts](../../be/utils/survey-activity-xp.ts))

Analyzes all activities and recommends tier-appropriate XP values:

```bash
$ npm run survey:activity-xp

=== ACTIVITY XP SURVEY ===

Found 20 activities

=== ANALYSIS BY TIER ===

T1 (Levels 1-10): 20 XP recommended
────────────────────────────────────────────────────
  ⚠️ UPDATE | L 1 woodcutting | Chop Oak Trees    | 30 XP → 20 XP
  ⚠️ UPDATE | L 1 none        | Fight Bandit Thug | 0 XP  → 20 XP
  ✅ OK     | L 5 mining      | Mine Iron Ore     | 20 XP

T2 (Levels 11-20): 50 XP recommended
────────────────────────────────────────────────────
  ⚠️ UPDATE | L12 gathering   | Gather Moonpetal  | 30 XP → 50 XP

=== SUMMARY ===
Total activities: 20
Already correct: 1
Need updates: 19
```

#### Update Script ([be/utils/update-activity-xp.ts](../../be/utils/update-activity-xp.ts))

Automatically updates activity XP values in TypeScript files:

```typescript
const XP_RECOMMENDATIONS: Record<string, number> = {
  // T1 (Levels 1-10) - 20 XP
  'activity-chop-oak': 20,
  'activity-combat-bandit': 20,
  'activity-mine-copper': 20,
  // ... 15 more T1 activities

  // T2 (Levels 11-20) - 50 XP
  'activity-gather-moonpetal': 50,
  'activity-gather-dragons-breath': 50,
};

function updateActivityFile(activityId: string, newXP: number): boolean {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Pattern 1: Update existing experience value
  const experiencePattern = /"?experience"?\s*:\s*\{\s*"?(\w+)"?\s*:\s*\d+\s*\}/;
  const match = content.match(experiencePattern);

  if (match) {
    const skillName = match[1];
    content = content.replace(
      new RegExp(`"?experience"?\\s*:\\s*\\{\\s*"?${skillName}"?\\s*:\\s*\\d+\\s*\\}`, 'g'),
      `"experience": {\n      "${skillName}": ${newXP}\n    }`
    );
  }

  // Pattern 2: Add rewards.experience to combat activities
  const combatConfigPattern = /"combatConfig":\s*\{[^}]*\}/;
  if (content.match(combatConfigPattern) && !match) {
    // Determine skill from monster type
    let skillName = 'oneHanded';
    if (activityId.includes('goblin-scout')) skillName = 'ranged';
    else if (activityId.includes('goblin-shaman')) skillName = 'casting';

    content = content.replace(
      combatConfigPattern,
      `$&,\n  "rewards": {\n    "experience": {\n      "${skillName}": ${newXP}\n    }\n  }`
    );
  }

  fs.writeFileSync(filePath, content);
  return true;
}
```

**Usage**: `npm run update:activity-xp`

**Results**:
```
=== SUMMARY ===
✅ Successfully updated: 19
❌ Failed: 0

💡 Run 'npm run survey:activity-xp' to verify changes
```

## Results & Benefits

### Progression Comparison

**Old System** (1000 XP/level, scaled rewards):
- Level 1 → 2: ~22 copper mines (45 XP scaled down to ~45 XP each)
- Level 15 → 16: ~22 copper mines (45 XP scaled down to ~45 XP each)
- **Problem**: Same grind at all levels, no incentive to progress

**New System** (tiered XP, fixed rewards):
- Level 1 → 2: 5 copper mines (100 XP needed ÷ 20 XP per mine)
- Level 15 → 16: 25 copper mines OR 10 iron mines (500 XP ÷ 20 vs ÷ 50)
- **Benefit**: Fast early game, clear incentive to tier up

### Predictability

Players can now calculate exactly:
```
Actions needed = XP needed ÷ Activity XP
Time needed = Actions × Activity duration
```

**Example**: "How long to reach Mining 10?"
- XP needed: 1,000 total
- Current progress: Level 5 (400 XP earned)
- Remaining: 600 XP
- Using copper (20 XP, 10s each): 30 mines = 5 minutes
- Using iron (50 XP, 10s each): 12 mines = 2 minutes

### Data Validation

All 20 activities verified with correct tier-appropriate XP:
- ✅ 18 T1 activities: 20 XP
- ✅ 2 T2 activities: 50 XP
- ✅ Combat activities have experience rewards
- ✅ Skill mappings correct (ranged for scouts, casting for shamans, etc.)

## Future Considerations

### Balancing

If progression feels too fast/slow, adjust tier XP values:

```typescript
// Current tuning
const XP_TIERS = [
  { minLevel: 1,  maxLevel: 10,  xpPerLevel: 100 },   // 5 mins to L10
  { minLevel: 11, maxLevel: 20,  xpPerLevel: 500 },   // 25 mins to L20
  // ...
];

// Example: Slower early game
const XP_TIERS = [
  { minLevel: 1,  maxLevel: 10,  xpPerLevel: 200 },   // 10 mins to L10
  { minLevel: 11, maxLevel: 20,  xpPerLevel: 750 },   // 37.5 mins to L20
  // ...
];
```

Run `npm run generate:xp-curve` to regenerate lookup table.

### Activity XP Tuning

Use survey/update scripts for balance passes:

```bash
# 1. Survey current state
npm run survey:activity-xp

# 2. Update XP_RECOMMENDATIONS in update-activity-xp.ts
# 3. Run update script
npm run update:activity-xp

# 4. Verify changes
npm run survey:activity-xp
```

### New Tiers

To add T3-T5 activities:

1. Create activity definition with appropriate XP (100/175/300)
2. Set level requirements matching tier (21+/31+/41+)
3. Run survey script to validate

## Testing

### Manual Testing Checklist

- [x] Skills gain XP correctly with level-up loops
- [x] Attributes receive 50% passthrough XP
- [x] UI displays dynamic XP requirements (not hardcoded 1000)
- [x] Progress bars use percentToNextLevel
- [x] Total XP displays cumulative experience
- [x] Combat activities award correct skill XP
- [x] Migration preserves player progression

### Test Cases

```javascript
// Test level-up loop
const player = await Player.findOne({ userId });
await player.addSkillExperience('woodcutting', 250);
// Expected: Level 1 → 3 (100 XP for L2, 100 XP for L3, 50 XP remaining)
assert.equal(player.skills.woodcutting.level, 3);
assert.equal(player.skills.woodcutting.experience, 50);

// Test enriched data
const enriched = player.getEnrichedSkills();
// Expected: L3 with 50/100 XP = 50% progress
assert.equal(enriched.woodcutting.xpToNextLevel, 50);
assert.equal(enriched.woodcutting.percentToNextLevel, 50);
assert.equal(enriched.woodcutting.totalXP, 250);
```

## Related Files

### Backend
- [be/utils/generate-xp-curve.ts](../../be/utils/generate-xp-curve.ts) - XP curve generator
- [be/utils/survey-activity-xp.ts](../../be/utils/survey-activity-xp.ts) - Activity XP analyzer
- [be/utils/update-activity-xp.ts](../../be/utils/update-activity-xp.ts) - Automated activity updater
- [shared/constants/attribute-constants.ts](../../shared/constants/attribute-constants.ts) - XP lookup table + helpers
- [be/models/Player.ts](../../be/models/Player.ts) - Level-up logic + enriched data methods
- [be/controllers/skillsController.ts](../../be/controllers/skillsController.ts) - Skills API
- [be/controllers/attributesController.ts](../../be/controllers/attributesController.ts) - Attributes API
- [be/services/locationService.ts](../../be/services/locationService.ts) - Removed XP scaling
- [be/migrations/017-convert-to-new-xp-curve.js](../../be/migrations/017-convert-to-new-xp-curve.js) - Migration script

### Frontend
- [ui/src/app/models/user.model.ts](../../ui/src/app/models/user.model.ts) - Type definitions
- [ui/src/app/services/skills.service.ts](../../ui/src/app/services/skills.service.ts) - Skills service
- [ui/src/app/components/game/skills/](../../ui/src/app/components/game/skills/) - Skills UI
- [ui/src/app/components/game/attributes/](../../ui/src/app/components/game/attributes/) - Attributes UI
- [ui/src/app/components/game/location/](../../ui/src/app/components/game/location/) - Activity progress UI

### Activity Definitions
- [be/data/locations/activities/](../../be/data/locations/activities/) - All 20 activity files updated

## NPM Scripts

```json
{
  "generate:xp-curve": "Generate XP lookup table",
  "survey:activity-xp": "Analyze activity XP values",
  "update:activity-xp": "Bulk update activity XP",
  "migrate": "Run database migrations"
}
```

## Conclusion

The tiered XP system successfully addresses all design goals:

✅ **Predictable progression** - Players can calculate exact time investment
✅ **Fast early game** - Levels 1-10 unlock quickly (1,000 total XP)
✅ **Long-term engagement** - Exponential XP requirements reward dedication
✅ **Tier-based incentives** - Clear motivation to progress to higher-tier activities
✅ **Maintainable** - Automated tools for balance passes
✅ **Backward compatible** - Migration preserved all player data

The system is production-ready and provides a solid foundation for future content expansion.
