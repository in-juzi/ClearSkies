# Quest System Design

**Date**: 2025-01-16
**Status**: Planned
**Type**: System Design Document

## Overview

This document outlines the comprehensive quest system design for ClearSkies, including tutorial quests, skill progression quests, exploration quests, and a separate achievement system. The quest system serves as the primary onboarding mechanism and provides structured progression goals for players.

## Design Goals

1. **Solve the onboarding problem** - New players currently spawn with no guidance or tutorial
2. **Provide meaningful progression milestones** - Give players goals beyond just grinding activities
3. **Gate content intelligently** - Use quests to unlock systems, recipes, and locations progressively
4. **Encourage exploration** - Incentivize discovering new locations and trying different skills
5. **Support future expansion** - Framework for daily/weekly bounties and story content

## Core Design Principles

### Auto-Accept Tutorial System
- Tutorial quests automatically start when prerequisites are met
- Prevents new players from missing critical onboarding content
- Sequential chain ensures proper system introduction order
- No hard location locks (except narrative "leave starter island" milestone)

### Reward Philosophy
- Quest XP rewards: ~50% of one level worth of XP
- Equipment rewards limited to tutorial (free fishing rod only)
- Other tools must be purchased or crafted (maintains economy)
- Unlocks are the primary reward (recipes, quest chains, locations)

### Flexible Progression
- Tutorial chain is auto-accepted but not blocking
- Skill quests are optional and player-driven
- Players can explore freely with 100g starting gold
- Can buy tools from any vendor to pursue preferred activity

### Repeatable Quest Support
- System designed to support future daily/weekly bounties
- Bounty board facility planned but not initially implemented
- Achievement system separate from quest system

## Architecture

### Data Structures

#### Quest Definition (TypeScript)

```typescript
interface Quest {
  questId: string;
  name: string;
  description: string;

  questGiver: {
    npcId: string;
    locationId: string;
    facilityId: string;
  };

  requirements: {
    level?: number;
    skills?: Record<string, number>;
    quests?: string[];           // Prerequisite quests
    items?: string[];            // Required items in inventory
    locations?: string[];        // Must have discovered
  };

  objectives: QuestObjective[];

  rewards: {
    experience?: Record<string, number>;  // Skill/attribute XP
    items?: Array<{ itemId: string; quantity: number }>;
    gold?: number;
    unlocks?: {
      quests?: string[];
      recipes?: string[];
      locations?: string[];
    };
  };

  category: 'tutorial' | 'skills' | 'exploration' | 'combat' | 'crafting' | 'story';
  isRepeatable: boolean;
  resetInterval?: 'daily' | 'weekly' | 'none';
  autoAccept: boolean;

  dialogue: {
    offer: string;
    progress: string;
    complete: string;
    decline?: string;
  };
}

interface QuestObjective {
  objectiveId: string;
  type: 'gather' | 'craft' | 'combat' | 'acquire' | 'visit' | 'talk';
  description: string;

  // Type-specific fields
  activityId?: string;
  itemId?: string;
  monsterId?: string;
  locationId?: string;
  facilityId?: string;
  recipeId?: string;

  quantity: number;
}
```

#### Player Quest State

```typescript
// Added to Player model
quests: {
  active: Array<{
    questId: string;
    startedAt: Date;
    objectives: Array<{
      objectiveId: string;
      type: string;
      current: number;
      required: number;
      completed: boolean;
    }>;
    turnedIn: boolean;
  }>;
  completed: string[];      // Array of completed quest IDs
  available: string[];      // Cached available quest IDs
}
```

### Quest Service Architecture

**File**: `be/services/questService.ts`

Key responsibilities:
- Load quest definitions from TypeScript registry
- Check quest availability based on player state
- Handle quest acceptance/abandonment
- Track objective progress via event handlers
- Distribute quest rewards
- Auto-accept tutorial quests when prerequisites met

**Integration Points**:
- `activityHandler.ts` → `questService.onActivityComplete()`
- `craftingHandler.ts` → `questService.onRecipeCrafted()`
- `combatHandler.ts` → `questService.onMonsterDefeated()`
- `locationController.ts` → `questService.onLocationDiscovered()`
- `Player.addItem()` → `questService.onItemAcquired()`

### Objective Types

| Type | Description | Tracked By | Example |
|------|-------------|------------|---------|
| `gather` | Complete gathering activity | Activity completion + item acquisition | "Catch 5 shrimp" |
| `craft` | Craft specific recipe | Recipe crafted event | "Craft 1 Health Tincture" |
| `combat` | Defeat monsters | Monster defeated event | "Defeat 3 Forest Wolves" |
| `acquire` | Own specific item | Item added to inventory | "Acquire Bamboo Fishing Rod" |
| `visit` | Travel to location/facility | Location/facility visited | "Visit Fishing Dock" |
| `talk` | Interact with NPC | Facility visited (simplified) | "Talk to Dockmaster Halvard" |

## Tutorial Quest Chain

### Design Rationale
- 5 sequential quests that auto-accept
- Introduces one system per quest (vendor → fishing → gathering → crafting → travel)
- Takes ~15-30 minutes to complete
- Rewards total ~250-300 XP across fishing/gathering/alchemy (2-3 levels worth)
- Final quest unlocks all optional skill/exploration quests

### Quest 1: "Welcome to Kennik"

**Prerequisites**: New player
**Auto-Accept**: Yes (on character creation)

**Objectives**:
1. Visit Fishing Dock facility (talk to Dockmaster Halvard)

**Rewards**:
- 50 gold
- Unlocks Quest 2: "First Catch"

**Purpose**: Introduce NPC vendors and facility system

**Dialogue**:
- Offer: "Welcome to Kennik, stranger! If you're going to survive here, you'll need to know the basics. Let me show you around."

---

### Quest 2: "First Catch"

**Prerequisites**: Quest 1 completed
**Auto-Accept**: Yes

**Objectives**:
1. Acquire Bamboo Fishing Rod (rewarded by quest, not purchased!)
2. Catch 5 shrimp at Fishing Dock

**Rewards**:
- 50 fishing XP (~50% of level 1→2)
- 25 endurance XP (attribute linked to fishing)
- 2 Health Tinctures
- Unlocks Quest 3: "Herb Gathering 101"

**Purpose**: Introduce vendor purchases, fishing activity, tool requirements, activity completion

**Dialogue**:
- Offer: "Take this fishing rod - Kennik provides for newcomers. Catch a few shrimp and you'll get the hang of it."
- Progress: "Keep fishing! You're doing great."
- Complete: "Well done! You're a natural. Here, take these potions - you'll need them out there."

**Note**: Only quest that rewards free tool. Rationale: Kennik is well-to-do starter village; remote locations need the gold more.

---

### Quest 3: "Herb Gathering 101"

**Prerequisites**: Quest 2 completed
**Auto-Accept**: Yes

**Objectives**:
1. Visit Herb Garden (talk to Herbalist Miriam)
2. Gather 5 Chamomile at Herb Garden

**Rewards**:
- 50 gathering XP
- 50 will XP (attribute linked to gathering)
- 1 Health Tincture
- Unlocks Quest 4: "Healing Hands"

**Purpose**: Introduce gathering skill (no tool required), second activity type, herb system

**Dialogue**:
- Offer: "Ah, a new face! Would you like to learn about the healing herbs that grow in our garden?"
- Progress: "Chamomile is gentle and restorative. Perfect for beginners."
- Complete: "You have a gentle touch with plants. This will serve you well in your journeys."

---

### Quest 4: "Healing Hands"

**Prerequisites**: Quest 3 completed
**Auto-Accept**: Yes

**Objectives**:
1. Craft 1 Health Tincture at Village Apothecary

**Rewards**:
- 75 alchemy XP
- 50 gold
- Unlocks Quest 5: "Into the Woods"

**Purpose**: Introduce crafting system, alchemy, resource consumption, recipe system

**Dialogue**:
- Offer: "Now that you've gathered chamomile, let me teach you the alchemist's art. Visit the apothecary and craft your first potion."
- Complete: "Excellent work! You've taken your first step into the world of alchemy. Many secrets await you."

---

### Quest 5: "Into the Woods"

**Prerequisites**: Quest 4 completed
**Auto-Accept**: Yes

**Objectives**:
1. Travel to Forest Clearing
2. Visit Logging Camp (talk to Woodsman Bjorn)

**Rewards**:
- 100 gold
- Unlocks all skill introduction quests
- Unlocks all exploration quests
- Marks tutorial as complete (narrative milestone)

**Purpose**: Introduce travel system, new location, zone transitions, "leaving starter island" narrative moment

**Dialogue**:
- Offer: "You've learned the basics of Kennik. The wider world awaits! Travel to Forest Clearing and meet Woodsman Bjorn."
- Complete: "Welcome to the woods, friend! You've proven yourself capable. There's much more to discover out here."

**Note**: This is the narrative "leave starter island" gate, but not a hard lock. Players can still freely explore before/during tutorial.

---

## Optional Skill Quests

These quests become available after completing the tutorial chain. Players can pursue them in any order based on their preferred playstyle.

### "The Woodcutter's Craft" (Woodcutting Introduction)

**Prerequisites**: Level 3, "Into the Woods" completed
**Auto-Accept**: No (player choice)

**Objectives**:
1. Chop 10 Oak Logs
2. Sell 5 Oak Logs to Woodsman Bjorn

**Rewards**:
- 100 woodcutting XP
- 75 gold

**Purpose**: Teach woodcutting activity, vendor selling, resource economy

---

### "Mining for Bronze" (Mining Introduction)

**Prerequisites**: Level 3, discovered Mountain Pass
**Auto-Accept**: No

**Objectives**:
1. Travel to Mountain Pass (if not already there)
2. Mine 5 Copper Ore
3. Mine 5 Tin Ore

**Rewards**:
- 150 mining XP
- 100 gold
- Unlocks Quest: "First Forge"

**Purpose**: Introduce mining, ore gathering, Mountain Pass location

---

### "First Forge" (Smithing Introduction)

**Prerequisites**: "Mining for Bronze" completed
**Auto-Accept**: No

**Objectives**:
1. Smelt 3 Bronze Ingots at Village Forge
2. Craft 1 Bronze Sword OR 1 Bronze Mining Pickaxe

**Rewards**:
- 200 smithing XP
- Bronze Helm (free armor piece)
- Recipe unlock: Iron Sword (if Mining 10+)

**Purpose**: Teach smithing, crafting chain (ore → ingot → equipment), equipment progression

**Note**: Last quest to reward free equipment (helm). Reinforces that tutorial generosity is special.

---

### "Trial by Fire" (Combat Introduction)

**Prerequisites**: Level 5, own any weapon
**Auto-Accept**: No

**Objectives**:
1. Defeat 3 Forest Wolves

**Rewards**:
- 150 one-handed XP
- 150 gold
- 3 Health Tinctures

**Purpose**: Introduce combat mechanics, weapon usage, consumable use in combat, monster encounters

---

## Optional Exploration Quests

### "The Goblin Threat"

**Prerequisites**: Level 8, "Trial by Fire" completed
**Auto-Accept**: No

**Objectives**:
1. Discover Goblin Village (if not already)
2. Defeat 1 Goblin Scout

**Rewards**:
- 300 combat XP
- 200 gold
- Unlocks future quest chain: "Goblin Warrior" (not yet implemented)

**Purpose**: Encourage exploration, introduce harder combat, Goblin Village location

---

### "The Mountain Mine Mystery"

**Prerequisites**: Mining 5
**Auto-Accept**: No

**Objectives**:
1. Mine 10 Iron Ore at Mountain Pass
2. Deliver 10 Iron Ore to Mountain Mine Merchant (visit facility while carrying ore)

**Rewards**:
- 300 mining XP
- Recipe unlock: Iron Sword
- 250 gold

**Purpose**: Iron tier introduction, delivery quest mechanic (carry items to NPC)

---

### "Rare Herbs of the Moonlit Meadow"

**Prerequisites**: Gathering 10
**Auto-Accept**: No

**Objectives**:
1. Gather 5 Moonpetal at Moonlit Meadow (Mountain Pass facility)
2. Craft 1 Empowering Elixir (any tier)

**Rewards**:
- 400 gathering XP
- 300 alchemy XP
- 3 Empowering Elixirs

**Purpose**: Advanced gathering location, trait-based potion crafting, high-tier alchemy

---

## Achievement System

### Design Philosophy
- **Separate from quests** - Achievements track long-term milestones, not one-time goals
- **Incremental tracking** - Count kills, items gathered, gold earned, etc.
- **Cosmetic rewards** - Titles and chat decorations, not gameplay advantages
- **Social display** - Active title appears in chat as `[Title] Username`

### Achievement Structure

```typescript
interface Achievement {
  achievementId: string;
  name: string;
  description: string;
  category: 'combat' | 'crafting' | 'gathering' | 'exploration' | 'social' | 'wealth';

  requirement: {
    type: 'count' | 'threshold' | 'collection';
    target: number;
    metric: string;  // 'monsters_defeated', 'items_gathered', 'gold_earned'
  };

  reward: {
    title?: string;          // "Master Fisher", "Dragon Slayer"
    decoration?: string;     // Chat decoration/badge
  };

  isSecret: boolean;         // Hidden until unlocked
}
```

### Example Achievements

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| "Master Fisher" | Catch 1000 fish | Title: "Master Fisher" |
| "Dragon Slayer" | Defeat 10 dragons | Title: "Dragon Slayer" |
| "Wealthy Merchant" | Earn 100,000 gold | Title: "the Wealthy" |
| "Jack of All Trades" | Reach level 10 in all gathering skills | Title: "Jack of All Trades" |
| "Goblin Bane" | Defeat 100 goblins | Title: "Goblin Bane" |
| "Alchemist Supreme" | Craft 500 potions | Title: "Alchemist Supreme" |
| "Explorer" | Discover all locations | Title: "the Explorer" |

### Title Display System

**Player Schema Addition**:
```typescript
titles: string[];           // Unlocked title IDs
activeTitle: string;        // Currently equipped title
decorations: string[];      // Unlocked chat decorations
```

**Chat Integration**:
- Display format: `[Title] Username: message`
- Example: `[Dragon Slayer] Aragorn: Anyone want to group for raids?`
- Players can select active title from profile UI
- No title equipped shows just username

---

## Repeatable Quest Framework

### Future Bounty Board System

**Design**:
- New facility type: "Bounty Board" (added to major hubs)
- Shows 3-5 rotating daily quests
- Quest pool refreshes at server midnight
- Rewards scale with player level

**Quest Types**:
- **Daily Gathering**: "Collect 20 random herbs" → 500g + 200 XP
- **Daily Combat**: "Defeat 10 wolves" → 750g + 300 XP
- **Daily Crafting**: "Craft 5 bronze items" → 600g + 250 XP

**Implementation**:
```typescript
interface RepeatableQuest extends Quest {
  isRepeatable: true;
  resetInterval: 'daily' | 'weekly';
  completionHistory: Array<{
    completedAt: Date;
    count: number;
  }>;
}
```

**Quest Service Additions**:
- Check if quest is on cooldown before showing as available
- Track completion timestamps per character
- Reset completion flags at configured intervals

**Note**: Bounty board facility and repeatable quests are framework-ready but not implemented in Phase 1.

---

## UI Components

### Quest Tracker (HUD Element)

**Location**: Game component (persistent UI element)

**Features**:
- Shows 1-3 active quests in collapsed format
- Displays quest name + objective checklist
- Example: "First Catch - Shrimp caught: 3/5"
- Progress bars for numeric objectives
- Click to expand full quest journal
- Quest complete notification (green checkmark animation)
- Auto-scrolls to show most recent quest

**Visual Design**:
- Medieval parchment background
- Gold accents for quest titles
- Green checkmarks for completed objectives
- Pulsing animation for quest completion

---

### Quest Journal Modal

**Tabs**:
1. **Active Quests** - In-progress quests with full details
2. **Available Quests** - Quests player qualifies for (manual accept button)
3. **Completed Quests** - Achievement log with timestamps

**Active Tab Features**:
- Quest name, description, quest giver info
- Expandable objective list with progress
- Reward preview (XP, items, gold, unlocks)
- "Abandon Quest" button (tutorial quests cannot be abandoned)
- Turn in button when all objectives complete

**Available Tab Features**:
- List of quests player meets requirements for
- Grayed out quests with unmet requirements (shows what's needed)
- "Accept Quest" button
- Quest category filters (tutorial, skills, exploration, combat, crafting)

**Completed Tab Features**:
- Historical log of completed quests
- Completion timestamps
- Rewards claimed
- Search/filter by category
- Total quest completion count

---

### Quest Notifications

**Toast Notification System**:
- Quest accepted (auto or manual)
- Objective completed (3/5 → 4/5)
- Quest completed (ready to turn in)
- Quest rewards claimed
- Achievement unlocked

**Visual Feedback**:
- Golden parchment toast popup (3 second duration)
- Sound effects for quest milestones
- Persistent notification badge on quest journal button

---

### NPC Quest Indicators

**Visual Markers on Facilities**:
- Yellow "!" icon = Available quest from this NPC
- Yellow "?" icon = Active quest in progress at this location
- Yellow "✓" icon = Quest ready to turn in

**Integration**:
- Modify `location-facility-list` component
- Add quest indicator overlay on facility cards
- Click facility to auto-complete "talk to NPC" objectives
- Tooltip shows quest name on hover

---

### World Map Quest Markers

**Features**:
- Pulsing icon on locations with active quest objectives
- Color-coded by objective type:
  - Green = Gathering objective
  - Red = Combat objective
  - Blue = Travel/visit objective
- Filter toggle: Show/hide quest markers
- Click marker to view quest details in modal
- Path highlighting for "Travel to X" objectives

---

## Starting Player State Changes

### Current State (Before Quest System)
- Starting gold: 0
- Starting items: None
- Starting quests: None
- Tutorial: None

### New Player State (With Quest System)
- **Starting gold: 100g** (enough to buy tools from any vendor)
- Starting items: None (fishing rod comes from Quest 2 reward)
- **Auto-accepted quest**: "Welcome to Kennik"
- Tutorial: 5-quest auto-accepting chain

**Rationale**:
- 100g allows player choice (can buy axe/pickaxe if they prefer those activities)
- Free fishing rod from quest (Kennik's generosity) teaches quest rewards
- Other tools must be purchased/crafted (maintains economy balance)
- Auto-accepted tutorial ensures no player misses onboarding

---

## API Endpoints

### Quest Endpoints

```
GET /api/quests/available
  Returns: Quest[] - Quests player qualifies for

GET /api/quests/active
  Returns: ActiveQuest[] - Player's in-progress quests with objective progress

GET /api/quests/completed
  Returns: string[] - IDs of completed quests

POST /api/quests/accept/:questId
  Body: { questId: string }
  Returns: { success: boolean, quest: ActiveQuest }
  Note: Only for manual accept quests (tutorials auto-accept)

POST /api/quests/abandon/:questId
  Body: { questId: string }
  Returns: { success: boolean }
  Note: Tutorial quests cannot be abandoned

POST /api/quests/complete/:questId
  Body: { questId: string }
  Returns: { success: boolean, rewards: QuestRewards }
  Note: Claims quest rewards (turn in)

GET /api/quests/:questId/progress
  Returns: QuestProgress - Detailed objective progress for specific quest
```

### Achievement Endpoints

```
GET /api/achievements
  Returns: Achievement[] - All achievements with player's progress

GET /api/achievements/unlocked
  Returns: Achievement[] - Achievements player has unlocked

POST /api/achievements/title/:titleId
  Body: { titleId: string }
  Returns: { success: boolean }
  Note: Sets player's active title for chat display

GET /api/achievements/progress/:achievementId
  Returns: { current: number, required: number, unlocked: boolean }
```

---

## WebSocket Events

### Quest Events (Real-time Updates)

```typescript
// Client → Server
socket.emit('quest:accept', { questId: string });
socket.emit('quest:abandon', { questId: string });
socket.emit('quest:complete', { questId: string });

// Server → Client
socket.on('quest:accepted', (quest: ActiveQuest) => {});
socket.on('quest:objectiveUpdate', (update: { questId: string, objectiveId: string, progress: number }) => {});
socket.on('quest:completed', (questId: string) => {});
socket.on('quest:rewarded', (rewards: QuestRewards) => {});
socket.on('quest:abandoned', (questId: string) => {});
socket.on('quest:error', (error: { message: string }) => {});
```

### Achievement Events

```typescript
// Server → Client (achievements are passive, no client actions)
socket.on('achievement:unlocked', (achievement: Achievement) => {});
socket.on('achievement:progress', (update: { achievementId: string, progress: number }) => {});
```

---

## Database Migration

### Migration File: `be/migrations/020-add-quest-system.js`

**Up Migration**:
```javascript
// Add quest fields to all Player documents
await Player.updateMany({}, {
  $set: {
    'quests.active': [],
    'quests.completed': [],
    'quests.available': [],
    'achievements': [],
    'titles': [],
    'activeTitle': null,
    'decorations': []
  }
});

// Update starting gold for new players (schema default)
// Existing players keep their current gold

// Auto-accept "Welcome to Kennik" for level 1 players
const level1Players = await Player.find({ 'skills.fishing.level': 1 });
for (const player of level1Players) {
  player.quests.active.push({
    questId: 'tutorial_welcome',
    startedAt: new Date(),
    objectives: [{
      objectiveId: 'visit_fishing_dock',
      type: 'visit',
      current: 0,
      required: 1,
      completed: false
    }],
    turnedIn: false
  });
  await player.save();
}
```

**Down Migration**:
```javascript
// Remove quest fields
await Player.updateMany({}, {
  $unset: {
    'quests': '',
    'achievements': '',
    'titles': '',
    'activeTitle': '',
    'decorations': ''
  }
});

// Restore default starting gold (if needed)
```

---

## Integration With Existing Systems

### Activity System Integration

**File**: `be/sockets/activityHandler.ts`

**Change**: After activity completion and reward distribution:
```typescript
// Existing code awards XP and items
// ...

// NEW: Update quest progress
await questService.onActivityComplete(player, activityId, rewardedItems);

// Check if any objectives completed
const updatedQuests = await questService.getActiveQuests(player);
socket.emit('quest:objectiveUpdate', updatedQuests);
```

---

### Crafting System Integration

**File**: `be/sockets/craftingHandler.ts`

**Change**: After recipe crafted:
```typescript
// Existing code creates item and awards XP
// ...

// NEW: Update quest progress
await questService.onRecipeCrafted(player, recipeId, craftedItem);
socket.emit('quest:objectiveUpdate', await questService.getActiveQuests(player));
```

---

### Combat System Integration

**File**: `be/sockets/combatHandler.ts`

**Change**: After monster defeated:
```typescript
// Existing code awards XP and loot
// ...

// NEW: Update quest progress
await questService.onMonsterDefeated(player, monsterId);
socket.emit('quest:objectiveUpdate', await questService.getActiveQuests(player));
```

---

### Location System Integration

**File**: `be/controllers/locationController.ts`

**Change**: On location discovery:
```typescript
// Existing code updates discoveredLocations
// ...

// NEW: Update quest progress and check for new available quests
await questService.onLocationDiscovered(player, locationId);
const newQuests = await questService.checkNewAvailableQuests(player);
if (newQuests.length > 0) {
  socket.emit('quest:newAvailable', newQuests);
}
```

---

### Inventory System Integration

**File**: `be/models/Player.ts` - `addItem()` method

**Change**: After item added to inventory:
```typescript
// Existing code adds item to inventory
// ...

// NEW: Update quest progress for "acquire" objectives
await questService.onItemAcquired(player, itemId, quantity);
```

---

## File Structure

### New Files Created (35+ files)

```
shared/types/
├── quests.ts                          # Quest type definitions
└── achievements.ts                    # Achievement type definitions

be/data/quests/
├── QuestRegistry.ts                   # Central quest registry
├── definitions/
│   ├── tutorial/
│   │   ├── WelcomeToKennik.ts
│   │   ├── FirstCatch.ts
│   │   ├── HerbGathering101.ts
│   │   ├── HealingHands.ts
│   │   └── IntoTheWoods.ts
│   ├── skills/
│   │   ├── WoodcuttersCraft.ts
│   │   ├── MiningForBronze.ts
│   │   ├── FirstForge.ts
│   │   └── TrialByFire.ts
│   └── exploration/
│       ├── GoblinThreat.ts
│       ├── MountainMineMystery.ts
│       └── RareHerbsOfMoonlitMeadow.ts

be/data/achievements/
└── AchievementRegistry.ts             # Achievement definitions

be/services/
├── questService.ts                    # Core quest logic
└── achievementService.ts              # Achievement tracking

be/controllers/
├── questController.ts                 # Quest HTTP endpoints
└── achievementController.ts           # Achievement HTTP endpoints

be/routes/
├── quests.ts                          # Quest routes
└── achievements.ts                    # Achievement routes

be/sockets/
└── questHandler.ts                    # Quest WebSocket events

be/migrations/
└── 020-add-quest-system.js           # Player schema migration

ui/src/app/components/game/
├── quest-tracker/
│   ├── quest-tracker.component.ts
│   ├── quest-tracker.component.html
│   └── quest-tracker.component.scss
├── quest-journal/
│   ├── quest-journal.component.ts
│   ├── quest-journal.component.html
│   └── quest-journal.component.scss
└── achievements/
    ├── achievements.component.ts
    ├── achievements.component.html
    └── achievements.component.scss

ui/src/app/services/
├── quest.service.ts                   # Frontend quest service
└── achievement.service.ts             # Frontend achievement service
```

### Modified Files (8 files)

```
be/models/Player.ts                    # Add quest/achievement fields, helper methods
be/sockets/activityHandler.ts          # Quest integration (onActivityComplete)
be/sockets/craftingHandler.ts          # Quest integration (onRecipeCrafted)
be/sockets/combatHandler.ts            # Quest integration (onMonsterDefeated)
be/controllers/locationController.ts   # Quest integration (onLocationDiscovered)
ui/src/app/components/game/location/location-facility-list/  # Quest indicators
ui/src/app/components/game/world-map/  # Quest markers on map
ui/src/app/components/game/chat/       # Title display in chat
```

---

## Implementation Phases

### Phase 1: Core Quest System Foundation (1-2 days)
- Create shared type definitions (quests.ts, achievements.ts)
- Update Player schema with quest fields
- Create quest registry and tutorial quest definitions
- Implement questService.ts with core logic
- Add integration hooks to activity/crafting/combat/location systems
- Database migration

**Deliverable**: Quest system functional on backend, no UI

---

### Phase 2: Tutorial Quest Chain (1 day)
- Define all 5 tutorial quests in TypeScript
- Implement auto-accept system
- Test quest chain flow (Welcome → First Catch → ... → Into the Woods)
- Verify objective tracking for all types
- Test reward distribution (XP, items, gold, unlocks)

**Deliverable**: Complete tutorial chain functional

---

### Phase 3: Quest UI Components (2-3 days)
- Create quest tracker HUD component
- Create quest journal modal (3 tabs)
- Implement quest notification system
- Add NPC quest indicators to facility list
- Add quest markers to world map
- Frontend quest service with WebSocket integration

**Deliverable**: Full quest UI with real-time updates

---

### Phase 4: Skill & Exploration Quests (1 day)
- Define 4 skill introduction quests
- Define 3 exploration quests
- Test quest unlock chains
- Balance quest rewards
- Verify prerequisite system

**Deliverable**: 12 total quests (5 tutorial + 7 optional)

---

### Phase 5: Achievement System (2 days)
- Create achievement type definitions
- Implement achievementService.ts
- Define initial achievement set (8-10 achievements)
- Create achievement UI component
- Implement title system with chat integration
- Add achievement tracking to game events

**Deliverable**: Achievement system with titles in chat

---

### Phase 6: Repeatable Quest Framework (1 day)
- Add repeatable quest support to quest types
- Implement cooldown/reset logic in questService
- Create data structure for completion history
- Document bounty board facility design (not implemented)

**Deliverable**: Framework ready for future daily/weekly quests

---

## Testing Plan

### Manual Testing Checklist

**Tutorial Chain**:
- [ ] New player auto-accepts "Welcome to Kennik"
- [ ] Quest 1 completes on visiting Fishing Dock
- [ ] Quest 2 auto-accepts and rewards fishing rod
- [ ] Fishing 5 shrimp updates objective counter in real-time
- [ ] Quest 2 rewards XP, tinctures, unlocks Quest 3
- [ ] Quest 3 auto-accepts after Quest 2 completes
- [ ] Gathering 5 chamomile completes Quest 3
- [ ] Quest 4 auto-accepts, crafting tincture completes it
- [ ] Quest 5 auto-accepts, travel + talk completes it
- [ ] After Quest 5, skill/exploration quests become available

**Objective Tracking**:
- [ ] Gather objectives update on activity completion
- [ ] Craft objectives update on recipe crafted
- [ ] Combat objectives update on monster defeated
- [ ] Acquire objectives update on item added to inventory
- [ ] Visit objectives update on location/facility visited

**Quest Rewards**:
- [ ] XP rewards distributed correctly to skills/attributes
- [ ] Gold added to player balance
- [ ] Items added to inventory
- [ ] Recipe unlocks appear in crafting UI
- [ ] Quest unlocks appear in available quests

**UI Components**:
- [ ] Quest tracker shows active quests with progress
- [ ] Quest journal tabs all functional
- [ ] Quest notifications appear on objective/quest completion
- [ ] NPC quest indicators show on facility cards
- [ ] World map shows quest markers on locations
- [ ] Clicking markers opens quest details

**Achievement System**:
- [ ] Achievements track incremental progress (kills, crafts, gathers)
- [ ] Achievements unlock when threshold reached
- [ ] Titles appear in unlocked titles list
- [ ] Active title displays in chat messages
- [ ] Title change updates in real-time

**Edge Cases**:
- [ ] Quest objectives completed while offline count on login
- [ ] Abandoning quest removes progress
- [ ] Cannot abandon tutorial quests
- [ ] Prerequisite quests block locked quests from appearing
- [ ] Level requirements hide quests until qualified
- [ ] Repeatable quest framework tracks completion timestamps

---

## Benefits

### Player Onboarding
- **Eliminates confusion** - New players have clear objectives instead of wandering aimlessly
- **System introduction** - Each quest teaches one mechanic (fishing → gathering → crafting → travel)
- **Progressive difficulty** - Tutorial is gentle, optional quests challenge advanced players
- **Faster time-to-fun** - Players reach engaging content faster with guided path

### Player Retention
- **Clear goals** - Always have something to work toward
- **Reward milestones** - Quest XP and items feel rewarding
- **Achievement hunting** - Long-term collectibles for dedicated players
- **Social status** - Titles provide visible accomplishment recognition

### Content Gating
- **Recipe unlocks** - Quests can gate advanced recipes (Iron Sword at Mining 10)
- **Location discovery** - Incentivize exploration via quest chains
- **Quest chains** - Sequential progression (Mining → Forge → Equipment)
- **Skill requirements** - Natural difficulty curve via level gates

### Developer Flexibility
- **Story expansion** - Quest system supports narrative content
- **Event quests** - Seasonal/limited-time quests possible
- **Bounty system** - Framework for daily/weekly repeatable content
- **Balance tuning** - Quest rewards can be adjusted independently of activities

---

## Future Expansion

### Story Quests
- Main story questline explaining world lore
- NPC character development arcs
- Mystery quests (investigate Goblin hostility, explore ancient ruins)
- Epic quest chains with boss fight conclusions

### Advanced Quest Types
- **Escort quests** - Protect NPC during travel
- **Timed quests** - Complete objectives before deadline
- **Collection quests** - Gather rare items from multiple sources
- **Puzzle quests** - Solve riddles or find hidden items
- **Group quests** - Require party coordination (when party system exists)

### Bounty Board System
- Daily quest rotation (3-5 quests refresh at midnight)
- Weekly challenge quests (harder, better rewards)
- Level-scaled rewards (gold/XP scale to player level)
- Reputation system with bounty board factions

### Achievement Expansion
- **Secret achievements** - Hidden until unlocked
- **Tiered achievements** - Bronze/Silver/Gold tiers for same metric
- **Collection achievements** - Discover all herbs, defeat all monsters
- **Speedrun achievements** - Complete quest chains in record time
- **Hardcore achievements** - Complete content without deaths

### Reputation System
- NPC faction reputation (Kennik Villagers, Mountain Miners, etc.)
- Reputation gates vendor stock (special items at high reputation)
- Reputation affects quest availability
- Reputation titles ("Kennik Hero", "Mountain Ally")

### Quest Journal Enhancements
- Quest map markers clickable from journal
- Quest sharing (send quest to party members)
- Quest abandonment confirmation dialog
- Quest completion statistics (total quests, fastest completion times)

### Dynamic Quests
- Quests generated from player actions (player discovers new fishing spot → NPC asks them to investigate)
- World events trigger temporary quests (goblin raid → defend village quest)
- Player-created bounties (post requests on bounty board for items/services)

---

## Related Documentation

- [Location System](031-location-system.md) - Activity and travel mechanics
- [Inventory System](015-inventory-system.md) - Item acquisition and management
- [Combat System](017-combat-system.md) - Monster encounters and abilities
- [XP System](032-xp-system.md) - Skill progression and attribute scaling
- [Tiered XP Curve](051-tiered-xp-system-implementation.md) - Level-based XP requirements
- [Crafting System](020-alchemy-subcategory-implementation.md) - Recipe system and crafting
- [Content Creation Pitfalls](019-content-creation-pitfalls.md) - Quest definition best practices

---

## Implementation Files

### Backend Core
- Quest Service: [questService.ts](../../be/services/questService.ts)
- Quest Controller: [questController.ts](../../be/controllers/questController.ts)
- Quest Routes: [quests.ts](../../be/routes/quests.ts)
- Quest Handler: [questHandler.ts](../../be/sockets/questHandler.ts)
- Achievement Service: [achievementService.ts](../../be/services/achievementService.ts)

### Player Model
- Player Model: [Player.ts](../../be/models/Player.ts) - Quest state storage

### Quest Definitions
- Quest Registry: [QuestRegistry.ts](../../be/data/quests/QuestRegistry.ts)
- Tutorial Quests: [be/data/quests/definitions/tutorial/](../../be/data/quests/definitions/tutorial/)
- Skill Quests: [be/data/quests/definitions/skills/](../../be/data/quests/definitions/skills/)
- Exploration Quests: [be/data/quests/definitions/exploration/](../../be/data/quests/definitions/exploration/)

### Frontend Components
- Quest Tracker: [quest-tracker.component.ts](../../ui/src/app/components/game/quest-tracker/quest-tracker.component.ts)
- Quest Journal: [quest-journal.component.ts](../../ui/src/app/components/game/quest-journal/quest-journal.component.ts)
- Achievements: [achievements.component.ts](../../ui/src/app/components/game/achievements/achievements.component.ts)

### Frontend Services
- Quest Service: [quest.service.ts](../../ui/src/app/services/quest.service.ts)
- Achievement Service: [achievement.service.ts](../../ui/src/app/services/achievement.service.ts)

### Integration Points
- Activity Handler: [activityHandler.ts](../../be/sockets/activityHandler.ts)
- Crafting Handler: [craftingHandler.ts](../../be/sockets/craftingHandler.ts)
- Combat Handler: [combatHandler.ts](../../be/sockets/combatHandler.ts)
- Location Controller: [locationController.ts](../../be/controllers/locationController.ts)

---

## Success Metrics

### Onboarding Metrics
- **Tutorial completion rate**: Target 80%+ of new players complete all 5 tutorial quests
- **Time to complete tutorial**: Target 15-30 minutes average
- **Drop-off points**: Track which quest has highest abandonment rate
- **Quest skipping**: Monitor if players complete tutorial out of order

### Engagement Metrics
- **Optional quest completion**: Target 50%+ of players complete at least 3 skill quests
- **Achievement hunting**: Target 30%+ of players unlock at least 5 achievements
- **Quest progression**: Average number of quests completed per player session
- **Title usage**: Percentage of players with active title equipped

### Retention Metrics
- **Day 1 retention**: Compare before/after quest system implementation
- **Day 7 retention**: Track long-term engagement improvement
- **Session length**: Monitor if quest system increases average session time
- **Return rate**: Track if quest goals encourage return visits

### System Health Metrics
- **Quest bugs**: Track quest objective tracking failures
- **Reward distribution**: Monitor quest reward errors
- **Auto-accept failures**: Track tutorial quest auto-accept success rate
- **Performance**: Quest service response times for availability checks

---

## Conclusion

The quest system transforms ClearSkies from an open-ended sandbox into a guided experience with clear progression milestones. The auto-accepting tutorial chain solves the critical onboarding problem, while optional skill and exploration quests provide structured goals without restricting player freedom.

The achievement system adds long-term collectible goals and social recognition via titles, creating a complementary progression track alongside the quest system. Together, these systems provide both immediate guidance (quests) and long-term engagement (achievements).

The framework is designed for future expansion with repeatable daily/weekly bounties, story quest chains, and dynamic event quests, ensuring the system can grow with the game's content needs.

**Status**: Planned (pending implementation)
**Estimated Development Time**: 8-10 days
**Priority**: High (solves critical onboarding gap)
