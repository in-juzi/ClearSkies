# ClearSkies Development Journal

## Project Overview
Medieval fantasy browser game built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)

## Development Possibilities

### Game Mechanics
- Character creation system
- Combat system
- Inventory management
- Quest system
- Character progression/leveling
- Skills and abilities

### World Building
- Locations and map system
- NPCs (Non-Player Characters)
- Items database
- Lore and storytelling
- Factions and reputation

### User Authentication
- Player accounts
- Session management
- User profiles
- Password security
- Account recovery

### Real-time Features
- WebSocket integration for multiplayer
- Live chat system
- Real-time updates (combat, events)
- Player interactions
- Notifications

### UI/UX
- Game interface design
- Interactive map display
- Character sheets
- Inventory interface
- Quest log
- Combat visualization
- Responsive design for mobile/desktop

## Implementation Status

### ✅ Completed: User Authentication & Session Management

**Backend Implementation:**
- User model with secure password hashing (bcrypt)
- Player model with character stats, inventory, and progression
- JWT-based authentication system
- Auth middleware for route protection
- Auth controller with register, login, logout, and profile endpoints
- Input validation using express-validator
- CORS support for frontend integration

**Frontend Implementation:**
- TypeScript models for User and Player
- AuthService with Angular signals for reactive state management
- HTTP interceptor for automatic JWT token attachment
- Auth guard for protecting routes
- Guest guard for redirecting authenticated users
- Environment configuration for API URLs

**API Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

**Features:**
- Secure password storage with bcrypt hashing
- JWT tokens with configurable expiration
- Automatic last login tracking
- Player profile creation on registration
- Character name uniqueness validation
- Experience and leveling system
- Gold management system
- Stats tracking (health, mana, strength, dexterity, intelligence, vitality)

## UI/UX Design Decisions

### Inventory Item Layout (2025-01-09)

**Implemented: Vertical Stack Layout**

Current implementation uses a vertical stack layout for inventory items to prevent text truncation when items have multiple qualities/traits:

```
┌─────────────────────────────────┐
│ [🪓] Oak Log x12                │
│      WG5 AG3 MC4 MST2           │
├─────────────────────────────────┤
│ [⚔️] Iron Sword                 │
│      PR4 BLS3                   │
└─────────────────────────────────┘
```

**Structure:**
- Icon on left (40x40px, fixed)
- Content area stacked vertically:
  - Top row: Item name + quantity (name can use full width)
  - Bottom row: Quality/trait badges (wrap if needed)

**Alternative Layout Options (for future consideration):**

1. **Wrap Badges to New Line**
   - Keep horizontal left/right split
   - Allow badges to wrap when space runs out
   - Maintains the original left/right concept

   ```
   ┌─────────────────────────────────┐
   │ [🪓] Oak Log x12    WG5 AG3     │
   │                     MC4 MST2    │
   └─────────────────────────────────┘
   ```

2. **Two-Row Layout**
   - First row: Icon + Name (full width)
   - Second row: Quantity + Badges
   - Very compact, clear hierarchy

   ```
   ┌─────────────────────────────────┐
   │ [🪓] Oak Log                    │
   │ x12          WG5 AG3 MC4 MST2   │
   └─────────────────────────────────┘
   ```

3. **Smaller Badge Font/Spacing**
   - Reduce badge size to fit more horizontally
   - Quick fix but doesn't scale well with 5+ badges
   - May reduce readability

**Why Vertical Stack?**
- No truncation of item names (critical for item identification)
- All badges always visible
- Clean, scannable layout
- Scales well with any number of qualities/traits
- Similar to successful inventory systems (Diablo, Path of Exile)
- Badges can wrap naturally if needed

## Skill System Implementation Status (2025-01-09)

### Overview: 12 Skills Defined, 5 Actively Used

The game defines **12 skills** across three categories, but only **5 have functional gameplay**. The remaining **7 skills are scaffolding only** (defined in the database schema but not connected to any activities or systems).

### Skill Categories and Status

#### ✅ **Fully Functional Skills** (5 skills)

| Skill | Linked Attribute | Activities | Status |
|-------|-----------------|------------|--------|
| **woodcutting** | Strength | 1 activity | ✅ FUNCTIONAL |
| **mining** | Strength | 1 activity | ✅ FUNCTIONAL |
| **fishing** | Endurance | 3 activities | ✅ FUNCTIONAL |
| **herbalism** | Will | 6 activities | ✅ FUNCTIONAL |

**What Works:**
- All gathering skills have working activities in `be/data/locations/activities/`
- Activities award XP and items via drop tables
- Require appropriate tools to be equipped (axes, pickaxes, rods)
- XP scales based on player level vs activity level
- XP flows to linked attributes (50% passthrough)
- Shown in UI with progress bars and tooltips

**Total Gathering Activities:** 11 functional activities across 4 locations

---

#### ⚠️ **Stub Implementation** (1 skill)

| Skill | Linked Attribute | Activities | Status |
|-------|-----------------|------------|--------|
| **oneHanded** | Strength | 1 stub activity | ⚠️ PLACEHOLDER |

**What Exists:**
- ONE combat activity: `combat-bandits.json`
- Activity explicitly marked with `"stub": true`
- Shows placeholder message when clicked
- Awards XP but has no actual combat mechanics

**What's Missing:**
- No combat system (enemies, battles, damage calculation)
- No health/mana consumption
- No loot drops from enemies
- Just a placeholder showing where combat will go

**File Reference:** `be/data/locations/activities/combat-bandits.json`, `be/controllers/locationController.js:482-496`

---

#### ❌ **Not Implemented** (6 skills)

| Skill | Linked Attribute | Activities | Status |
|-------|-----------------|------------|--------|
| **smithing** | Endurance | 0 | ❌ NO SYSTEM |
| **cooking** | Will | 0 | ❌ NO SYSTEM |
| **dualWield** | Dexterity | 0 | ❌ NO SYSTEM |
| **twoHanded** | Strength | 0 | ❌ NO SYSTEM |
| **ranged** | Dexterity | 0 | ❌ NO SYSTEM |
| **casting** | Magic | 0 | ❌ NO SYSTEM |
| **gun** | Perception | 0 | ❌ NO SYSTEM |

**What Exists:**
- Skills defined in `be/models/Player.js:161-206`
- XP system works (can manually add XP via API)
- Skills shown in UI

**What's Missing:**
- No crafting system (no recipes, UI, or mechanics)
- No combat system (no enemies or battle mechanics)
- No activities to earn XP through gameplay
- No controllers or services for these systems

---

### Missing Advanced Features

The current skill system has a **solid foundation** (XP gain, leveling, requirements) but lacks advanced progression features:

#### ❌ **Skill Perks/Abilities**
- No perks unlocked at skill milestones
- No active or passive abilities
- Skills only provide: level number, XP bar, level requirements

#### ❌ **Skill-Based Quality/Success**
- Equipment has `toolEfficiency` property but it's **never used in code**
- Skills don't affect gathering quality outcomes
- Skills don't affect drop rates or success rates
- No bonus loot from higher skill levels

#### ❌ **Passive Bonuses**
- Skills don't provide stat bonuses (damage, defense, etc.)
- Skills don't affect activity duration
- Skills don't affect vendor prices
- Charisma attribute exists but not used for pricing

#### ❌ **Equipment Durability**
- Equipment has `durability` property but **not tracked or depleted**
- No repair system
- No degradation mechanics
- Tools never break or need maintenance

#### ❌ **Skill Unlocks**
- No skill-based unlock trees
- No mastery bonuses
- No prestige or skill reset systems
- Only level requirements for activities

**File Evidence:**
- `toolEfficiency` defined in `be/data/items/definitions/equipment.json` but never referenced in services
- `durability` property exists but no code consumes it
- No files found for perks, unlocks, or passive systems

---

### Architecture Analysis

#### ✅ **What's Well-Designed:**

1. **XP System** - Robust and flexible
   - 1000 XP per level (consistent across all skills)
   - Automatic leveling
   - XP scaling with diminishing returns (polynomial decay)
   - Skill → Attribute linking (50% XP passthrough)
   - Works perfectly for gathering skills

2. **Activity Requirements** - Clean and extensible
   - Activities check skill levels before allowing start
   - Support for equipped item requirements (by subtype)
   - Support for inventory item requirements
   - User-friendly error messages

3. **Skill-Attribute Links** - Already defined and working
   - Gathering: woodcutting/mining → Strength, fishing → Endurance, herbalism → Will
   - Crafting: smithing → Endurance, cooking → Will
   - Combat: oneHanded/twoHanded → Strength, dualWield/ranged → Dexterity, casting → Magic, gun → Perception

4. **Data Architecture** - JSON-based and easy to extend
   - Activity definitions are simple and clear
   - Drop tables are reusable across activities
   - Easy to add new activities without code changes

#### 🔧 **What Needs Work:**

1. **Crafting System** - Zero implementation
   - No recipe definitions
   - No crafting controller or service
   - No crafting UI
   - No consume-ingredients-create-product mechanics

2. **Combat System** - Only stub placeholder
   - No enemy definitions
   - No battle mechanics
   - No damage calculation
   - No health/mana consumption
   - No combat loot system

3. **Integration** - Defined properties not used
   - `toolEfficiency` exists but no code references it
   - `durability` exists but no degradation system
   - Charisma exists but not used for vendor pricing
   - Quality system exists but skills don't affect it

---

### Next Feature Recommendation: Cooking System

**Rationale:**

The **cooking system** is the ideal next feature because:

1. **Natural Fit with Existing Content**
   - Raw fish items already exist (trout, salmon, cod, shrimp)
   - Cook NPC (Cook Marta) already sells cooked items
   - Creates gameplay loop: fish → cook → sell for profit
   - Vendor system already supports buying/selling

2. **Simpler Scope Than Combat**
   - Combat requires: enemies, AI, damage, health/mana, death, loot
   - Cooking requires: recipes, UI, consume ingredients → create product
   - Much more achievable as next feature
   - Lower risk, faster implementation

3. **Teaches Crafting Architecture**
   - Once cooking works, smithing follows same pattern
   - Recipe system is reusable (alchemy extends it)
   - Establishes patterns for all future crafting
   - Creates template for smithing, alchemy, etc.

4. **Immediate Player Value**
   - Cooked food can restore health/give buffs (useful for future combat)
   - Creates market value (raw vs cooked pricing arbitrage)
   - Gives players productive use for gathered resources
   - New progression path for the Will attribute

5. **Quality System Integration**
   - Can use ingredient quality to affect output quality
   - Higher cooking skill = better quality outcomes
   - Sets up the planned "quality-based crafting" system
   - Demonstrates skill affecting results

---

### Proposed Cooking System Design

#### Core Components:

1. **Recipe Definitions** (`be/data/recipes/cooking/`)
   ```json
   {
     "recipeId": "cook-salmon",
     "name": "Cook Salmon",
     "description": "Grill fresh salmon over an open flame",
     "skill": "cooking",
     "requiredLevel": 5,
     "duration": 10,
     "ingredients": [
       { "itemId": "salmon", "quantity": 1 }
     ],
     "output": {
       "itemId": "cooked_salmon",
       "quantity": 1,
       "qualityModifier": "inherit"
     }
   }
   ```

2. **Crafting Controller** (`be/controllers/craftingController.js`)
   - POST `/api/crafting/start` - Start crafting recipe
   - POST `/api/crafting/complete` - Complete and claim result
   - GET `/api/crafting/recipes` - Get available recipes
   - Validate ingredients, skill level, facilities

3. **Crafting Service** (`be/services/craftingService.js`)
   - Load recipe definitions
   - Calculate quality outcomes (input quality + skill level)
   - Handle ingredient consumption
   - Generate output items
   - Award skill XP

4. **Crafting UI** (`ui/src/app/components/game/crafting/`)
   - Recipe browser (similar to activity list)
   - Ingredient requirements display
   - "Start Crafting" button
   - Progress indicator (time-based like activities)
   - Result display with quality outcome

5. **Cooking Facilities**
   - Add cooking facility to Kennik (kitchen at market)
   - Add campfire facilities to wilderness locations
   - Reuse existing facility architecture

#### Example Gameplay Flow:

1. Player catches raw salmon (quality level 3, freshness level 4)
2. Travels to Kennik Market
3. Selects "Kitchen" facility
4. Opens cooking interface
5. Selects "Cook Salmon" recipe
6. System checks:
   - ✓ Has 1 salmon in inventory
   - ✓ Cooking level 5 (meets requirement)
   - ✓ At cooking facility
7. Clicks "Start Cooking" → 10 second timer
8. Timer completes → Consumes raw salmon
9. Creates cooked_salmon with quality:
   - Base: Inherits freshness from input (level 4)
   - Bonus: +1 quality from cooking skill level 10+
   - Result: cooked_salmon (freshness level 5)
10. Gains 35 cooking XP → 17.5 Will XP
11. Can eat for health or sell to vendor for gold

#### Integration Points:

- ✅ **Inventory System** - Consume/add items (existing methods)
- ✅ **Skill/XP System** - Award cooking XP (existing `addSkillExperience`)
- ✅ **Quality System** - Input quality → output quality (existing quality levels)
- ✅ **Facility System** - Add cooking facilities (existing architecture)
- ✅ **Item Definitions** - Add recipe metadata (existing JSON structure)
- ✅ **Time System** - Duration-based crafting (same as activities)

#### Benefits:

- **Reusable Architecture**: Recipe system works for smithing, alchemy, etc.
- **Quality Integration**: First system to make skills affect item quality
- **Player Engagement**: New progression path and gameplay loop
- **Economic Impact**: Creates market dynamics (raw vs cooked pricing)
- **Combat Prep**: Cooked food framework for future consumable buffs
- **Low Risk**: Builds on proven activity/facility patterns

---

### Alternative: Smithing System

If smithing is preferred, it would follow nearly identical architecture:

**Recipes:**
- Smelt copper_ore → copper_bar
- Forge copper_bar + materials → equipment

**Facilities:**
- Furnace (smelting)
- Anvil (forging)

**Quality:**
- Ore quality affects bar quality
- Bar quality affects equipment quality
- Smithing skill level provides bonus

**Advantage of Smithing:**
- Creates equipment (more valuable than food)
- Natural progression path (gather ore → smelt → forge → equip)

**Advantage of Cooking:**
- More existing content (fish items already exist)
- Simpler items (food vs complex equipment stats)
- Faster to market

**Recommendation:** Start with cooking (simpler), then smithing follows same pattern.

---

## Notes
- Backend server runs on port 3000 by default
- MongoDB connection required (configure in .env file)
- JWT secret should be changed in production
- Frontend assumes backend API at http://localhost:3000/api
