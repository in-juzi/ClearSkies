# XP System

Three-tier architecture with intelligent scaling to encourage progression: Skills → Attributes with XP passthrough.

## Core Mechanics

### XP Requirements
- **1000 XP per level** for both skills and attributes
- Flat progression (no exponential scaling)
- Consistent leveling pace throughout game

### Skill-Attribute Linking
- **50% XP passthrough**: Skill XP automatically awards 50% to linked attribute
- Example: 100 woodcutting XP → 50 strength XP
- Passive attribute growth through skill use

### Attribute Links

**Strength** (physical power):
- Woodcutting
- Mining
- One-Handed weapons
- Two-Handed weapons

**Endurance** (stamina):
- Fishing
- Smithing

**Will** (mental fortitude):
- Gathering (herbs/flowers)
- Cooking
- Alchemy

**Dexterity** (agility):
- Dual Wield weapons
- Ranged weapons

**Magic** (arcane power):
- Casting

**Perception** (awareness):
- Gun weapons

**Charisma** (social influence):
- (Future: Trading, persuasion)

## XP Scaling Formula

Activities award scaled XP based on level difference to encourage appropriate content:

```typescript
// Formula: 1 / (1 + 0.3 * (playerLevel - activityLevel - 1))
function calculateScaledXP(playerLevel, activityLevel, baseXP) {
  const levelDiff = playerLevel - activityLevel;

  // Grace range: 0-1 levels above activity = full XP
  if (levelDiff <= 1) {
    return baseXP;
  }

  // Progressive scaling reduction
  const scalingFactor = 1 / (1 + 0.3 * (levelDiff - 1));
  const scaledXP = Math.floor(baseXP * scalingFactor);

  // Minimum floor: always award at least 1 XP
  return Math.max(1, scaledXP);
}
```

### Scaling Examples

**Level 5 activity, 45 base XP**:
- Player L5-6: **45 XP** (100%, grace range)
- Player L7: **34 XP** (75%, scaling starts)
- Player L10: **20 XP** (44%, moderate reduction)
- Player L15: **12 XP** (26%, heavy reduction)
- Player L20+: **1 XP** (minimum floor)

**Grace Range Benefits**:
- Activities 0-1 levels below player award full XP
- Prevents harsh penalties for slight overleveling
- Encourages trying new content without fear of losing progression

### Design Goals

1. **Encourage Level-Appropriate Content**: Reduced rewards for overleveled activities
2. **No Hard Forcing**: Minimum 1 XP floor allows grinding if desired
3. **Smooth Transitions**: Grace range prevents cliff-edge penalties
4. **Passive Attribute Growth**: 50% passthrough ensures attributes keep pace

## Player Methods

**File**: `be/models/Player.js`

### addSkillExperience()
Location: ~L145-165

```javascript
async addSkillExperience(skillName, xpAmount) {
  // Add XP to skill
  const skill = this.skills[skillName];
  skill.experience += xpAmount;

  // Check for level up
  while (skill.experience >= skill.experienceToNextLevel) {
    skill.level++;
    skill.experience -= skill.experienceToNextLevel;
    skill.experienceToNextLevel = 1000; // Flat 1000 XP per level
  }

  // Award 50% XP to linked attribute
  const linkedAttr = skill.mainAttribute;
  const attrXP = Math.floor(xpAmount * 0.5);
  await this.addAttributeExperience(linkedAttr, attrXP);

  return { skill, attribute: this.attributes[linkedAttr] };
}
```

### addAttributeExperience()
Location: ~L167-185

```javascript
async addAttributeExperience(attrName, xpAmount) {
  const attr = this.attributes[attrName];
  attr.experience += xpAmount;

  // Check for level up (same 1000 XP per level)
  while (attr.experience >= attr.experienceToNextLevel) {
    attr.level++;
    attr.experience -= attr.experienceToNextLevel;
    attr.experienceToNextLevel = 1000;
  }

  return attr;
}
```

## Activity Configuration

Activities define base XP rewards in their definitions:

**File**: `be/data/locations/activities/{ActivityId}.ts`

```typescript
export const ChopOak: Activity = {
  activityId: 'chop-oak',
  name: 'Chop Oak Trees',
  duration: 10,
  requirements: {
    skills: { woodcutting: 1 }
  },
  rewards: {
    experience: {
      woodcutting: 25  // Base XP before scaling
    },
    dropTables: ['woodcutting-oak']
  }
};
```

**Balance Guidelines**:
- 5-50 XP per activity (scales with level requirement)
- 5-50 second durations
- XP should scale with time investment
- Consider drop table value when setting XP

## Frontend Display

### XP-Mini Component
**File**: `ui/src/app/components/shared/xp-mini/xp-mini.component.ts`

Displays XP awards with scaling information:
- Shows raw XP vs scaled XP
- Color coding: green (full), yellow (reduced), red (minimum)
- Tooltip explains scaling reason

**Example Display**:
```
+25 XP (45 base, 56% scaled)
```

### Skills Panel
Shows current XP and progress bars for all skills and attributes.

## Testing XP Scaling

**Utility Script**: `be/utils/test-xp-scaling.js`

```bash
cd be && node utils/test-xp-scaling.js
```

Outputs scaling results for various level differences, helping balance activity XP values.

## Future Enhancements

**Potential Improvements**:
- XP multipliers for premium items/buffs
- Rest bonus (increased XP after time offline)
- Group XP bonuses for party play
- XP events (2x XP weekends)
- Skill mastery bonuses (bonus XP at high levels)

## References

- [location-system.md](location-system.md) - Activity XP rewards
- Player.js ~L145-185 - XP methods
- locationService.ts - `calculateScaledXP()` formula
