# Combat System Documentation

## Overview

The combat system provides fast-paced, interactive player-vs-monster battles with auto-attacks, instant abilities with turn-based cooldowns, and equipment-based stat scaling. Combat occurs at special combat facilities and continues until victory, defeat, or the player flees.

**Current Version**: 1.0 (First Iteration)
**Status**: ✅ Complete and functional

---

## Core Mechanics

### Combat Flow

1. **Initiation**: Player selects a combat activity at a combat facility
2. **Auto-Attacks**: Both combatants auto-attack based on weapon attack speed timers
3. **Abilities**: Player can use instant abilities that have turn-based cooldowns
4. **Resolution**: Combat ends when either combatant reaches 0 HP, or player flees
5. **Rewards**: Victory grants gold, XP, and loot from drop tables

### Combat Timing

- **Auto-Attack Timers**: Each combatant has independent attack timers based on weapon attack speed
- **Attack Speed**: Defined in seconds (e.g., 2.4s, 2.6s, 4.0s)
- **Real-Time Combat**: Server tracks `playerNextAttackTime` and `monsterNextAttackTime`
- **Status Polling**: Frontend polls combat status every 500ms for real-time updates

### Turn-Based Cooldowns

- **Turn Definition**: One turn = one auto-attack by the player
- **Cooldown Tracking**: Abilities store "available turn number" = current turn + cooldown duration
- **Example**: 3-turn cooldown ability used on turn 5 becomes available on turn 8
- **Turn Counter**: Increments with each player auto-attack (not monster attacks)

---

## Damage Calculation

### Complete Damage Formula

```javascript
// 1. Roll base damage from weapon dice
let baseDamage = rollDice(weapon.damageRoll); // e.g., "1d3" → 1-3

// 2. Apply ability multiplier (if using ability)
if (isAbility) {
  baseDamage = Math.floor(baseDamage * abilityPower); // e.g., 2x for Heavy Strike
}

// 3. Add skill/attribute scaling bonuses
const skillBonus = Math.min(2, Math.floor(skillLevel / 10)); // Max +2
const attrBonus = Math.min(2, Math.floor(attrLevel / 10));   // Max +2
const scaledDamage = baseDamage + skillBonus + attrBonus;

// 4. Check for critical hit (doubles damage)
const isCrit = Math.random() < critChance; // e.g., 5% = 0.05
if (isCrit) {
  finalDamage = Math.floor(scaledDamage * 2);
}

// 5. Check for dodge/evasion
const dodgeChance = evasion / (evasion + 1000); // Diminishing returns
const isDodge = Math.random() < dodgeChance;
if (isDodge) return { damage: 0, isDodge: true };

// 6. Apply armor reduction
const armorReduction = armor / (armor + 1000); // Diminishing returns
finalDamage = Math.floor(finalDamage * (1 - armorReduction));

// 7. Ensure minimum damage of 1 (if not dodged)
finalDamage = Math.max(1, finalDamage);
```

### Dice Notation Parsing

- **Format**: `NdF+M` where N=number of dice, F=faces per die, M=modifier (optional)
- **Examples**:
  - `1d3` → Roll 1 die with 3 faces (1-3 damage)
  - `2d6+2` → Roll 2 dice with 6 faces each, add 2 (4-14 damage)
  - `1d8` → Roll 1 die with 8 faces (1-8 damage)
- **Implementation**: Regex `/^(\d+)d(\d+)([+-]\d+)?$/` in [combatService.js:85-100](../../be/services/combatService.js#L85-L100)

### Stat Scaling

**Skill Scaling:**
- Each weapon has a `skillScalar` field linking to a combat skill
- Examples: `oneHanded`, `twoHanded`, `ranged`, `casting`, `gun`
- Bonus: +1 die face per 10 skill levels (max +2)
- Affects: Base damage rolls (e.g., `1d3` → `1d4` → `1d5`)

**Attribute Scaling:**
- Each skill links to an attribute (oneHanded→strength, ranged→dexterity, casting→magic)
- Bonus: +1 die face per 10 attribute levels (max +2)
- Cumulative with skill bonuses

**Example Scaling:**
```
Base weapon: 1d3 (1-3 damage)
Level 15 oneHanded skill (+1): 1d4 (1-4 damage)
Level 25 oneHanded skill (+2): 1d5 (1-5 damage)
Level 15 Strength (+1): Additional +1 face
Combined: 1d6 (1-6 damage)
```

### Diminishing Returns Formulas

**Armor Reduction:**
```javascript
armorReduction = armor / (armor + 1000)
```
- 100 armor = 9.1% reduction
- 500 armor = 33.3% reduction
- 1000 armor = 50% reduction
- 2000 armor = 66.7% reduction
- Asymptotic curve approaching 100% (never reaches it)

**Evasion/Dodge Chance:**
```javascript
dodgeChance = Math.min(0.75, evasion / (evasion + 1000))
```
- 100 evasion = 9.1% dodge
- 500 evasion = 33.3% dodge
- 1000 evasion = 50% dodge
- 3000 evasion = 75% dodge (hard cap)

---

## Equipment System

### Weapon Stats

Equipment items with `category: "equipment"` and `slot: "mainHand"` or `slot: "offHand"` can have combat stats:

```json
{
  "itemId": "copper_sword",
  "category": "equipment",
  "slot": "mainHand",
  "subtype": "sword",
  "damageRoll": "1d3",
  "attackSpeed": 2.4,
  "critChance": 0.05,
  "skillScalar": "oneHanded"
}
```

**Weapon Properties:**
- `damageRoll` (string): Dice notation for base damage
- `attackSpeed` (number): Seconds between auto-attacks
- `critChance` (number): Decimal percentage (0.05 = 5%)
- `skillScalar` (string): Linked combat skill name

**Default Weapon (Unarmed):**
- Damage: `1d2` (1-2 damage)
- Attack Speed: 3.0 seconds
- Crit Chance: 2%
- Skill: `oneHanded`

### Armor Stats

Equipment items with armor/evasion provide defensive stats:

```json
{
  "itemId": "iron_helm",
  "category": "equipment",
  "slot": "head",
  "armor": 15,
  "evasion": 0
}
```

**Armor Properties:**
- `armor` (number): Flat armor value (converts to % reduction)
- `evasion` (number): Flat evasion value (converts to % dodge)
- `blockChance` (number): Currently unused (reserved for shields)

### Total Stats Calculation

All equipped items' combat stats are summed:

```javascript
// Sum armor from all equipped items
totalArmor = head.armor + body.armor + gloves.armor + ...

// Sum evasion from all equipped items
totalEvasion = boots.evasion + body.evasion + ...

// Weapon stats come from mainHand only
weapon = equippedItems.mainHand;
```

---

## Monster System

### Monster Structure

Monsters are based on the Player model structure for future compatibility with summons/pets. Each monster is defined as a canonical template that gets deep-copied into a monster instance when combat starts.

**Monster Definition Schema:**
```json
{
  "monsterId": "forest_wolf",
  "name": "Forest Wolf",
  "description": "A wild wolf prowling the forest",
  "level": 3,
  "stats": {
    "health": { "current": 80, "max": 80 },
    "mana": { "current": 0, "max": 0 }
  },
  "skills": {
    "oneHanded": { "level": 1, "experience": 0 }
  },
  "attributes": {
    "strength": { "level": 8, "experience": 0 },
    "endurance": { "level": 5, "experience": 0 }
  },
  "equipment": {
    "mainHand": {
      "itemId": "wolf_fangs",
      "name": "Sharp Fangs",
      "damageRoll": "1d4",
      "attackSpeed": 2.0,
      "critChance": 0.08,
      "skillScalar": "oneHanded"
    }
  },
  "passiveAbilities": [
    {
      "abilityId": "pack_instinct",
      "name": "Pack Instinct",
      "description": "+10% damage when below 50% HP",
      "effects": { "damageMultiplier": 1.1, "healthThreshold": 0.5 }
    }
  ],
  "loot": {
    "baseGold": { "min": 5, "max": 15 },
    "dropTables": ["combat-wolf-basic"]
  }
}
```

**Key Properties:**
- `stats`: HP and mana pools (monsters typically have 0 mana)
- `skills`: Combat skill levels for damage scaling
- `attributes`: Attribute levels for additional scaling
- `equipment`: Equipped items (typically just mainHand weapon)
- `passiveAbilities`: Special monster abilities (currently unused, reserved for future)
- `loot`: Gold range and drop table references

### Current Monsters

**Forest Wolf** (Level 3)
- HP: 80
- Weapon: Sharp Fangs (1d4, 2.0s attack speed, 8% crit)
- Skills: oneHanded 1, Strength 8
- Loot: 5-15 gold, wolf_pelt, wolf_fang, raw_meat

**Bandit Thug** (Level 5)
- HP: 120
- Weapon: Rusty Sword (1d5, 2.8s attack speed, 5% crit)
- Equipment: Tattered Tunic (5 armor)
- Skills: oneHanded 3, Strength 12
- Loot: 10-25 gold, tattered_cloth, leather_scraps, weapons/armor

**Goblin Warrior** (Level 7)
- HP: 140
- Weapon: Crude Axe (1d6, 3.2s attack speed, 6% crit)
- Equipment: Leather Armor (25 armor total)
- Skills: oneHanded 5, Strength 15
- Loot: 15-35 gold, scrap_metal, goblin_tooth, copper_ore, weapons/armor

**File Locations:**
- [be/data/monsters/definitions/forest_wolf.json](../../be/data/monsters/definitions/forest_wolf.json)
- [be/data/monsters/definitions/bandit_thug.json](../../be/data/monsters/definitions/bandit_thug.json)
- [be/data/monsters/definitions/goblin_warrior.json](../../be/data/monsters/definitions/goblin_warrior.json)

---

## Ability System

### Ability Structure

Abilities are instant-cast actions that consume mana and have turn-based cooldowns.

**Ability Definition Schema:**
```json
{
  "abilityId": "heavy_strike",
  "name": "Heavy Strike",
  "description": "A powerful overhead strike dealing 2x weapon damage",
  "type": "damage",
  "powerMultiplier": 2.0,
  "manaCost": 15,
  "cooldown": 3,
  "requiredWeaponTypes": ["oneHanded", "twoHanded"],
  "icon": {
    "path": "abilities/ability_melee_strike.svg",
    "material": "ability-red"
  }
}
```

**Properties:**
- `powerMultiplier`: Damage multiplier (2.0 = 2x weapon damage)
- `manaCost`: Mana required to cast
- `cooldown`: Number of turns before ability can be used again
- `requiredWeaponTypes`: Which weapon types can use this ability
- `type`: `damage`, `heal`, `buff`, `debuff` (currently only damage implemented)

### Current Abilities

**Melee Abilities:**
- **Heavy Strike**: 2x damage, 15 mana, 3-turn cooldown (oneHanded/twoHanded)
- **Quick Slash**: 1.3x damage, 5 mana, 1-turn cooldown (oneHanded/dualWield)

**Ranged Abilities:**
- **Aimed Shot**: 1.5x damage, 10 mana, 2-turn cooldown, +15% crit (ranged/gun)
- **Rapid Fire**: 1.8x damage, 12 mana, 2-turn cooldown (ranged/gun)

**Magic Abilities:**
- **Fire Bolt**: 2.2x damage, 20 mana, 3-turn cooldown (casting)
- **Ice Shard**: 1.7x damage, 15 mana, 2-turn cooldown (casting)

**File Locations:**
- [be/data/abilities/definitions/](../../be/data/abilities/definitions/)

### Ability Availability

Abilities are only available if the player has the required weapon type equipped. The backend checks:

```javascript
const weaponType = weapon.skillScalar; // e.g., "oneHanded"
const availableAbilities = allAbilities.filter(ability =>
  ability.requiredWeaponTypes.includes(weaponType)
);
```

**Example:**
- Player equips copper_sword (skillScalar: "oneHanded")
- Available abilities: Heavy Strike, Quick Slash
- Not available: Aimed Shot, Fire Bolt, etc.

---

## Combat Activities

### Activity Structure

Combat activities are special activity definitions with `type: "combat"` and a `combatConfig` object:

```json
{
  "activityId": "activity-combat-forest-wolf",
  "name": "Fight Forest Wolf",
  "description": "Engage in combat with a wild forest wolf",
  "type": "combat",
  "duration": 0,
  "requirements": {
    "skills": {},
    "equipped": []
  },
  "combatConfig": {
    "monsterId": "forest_wolf"
  },
  "rewards": {
    "experience": {},
    "dropTables": []
  }
}
```

**Key Differences from Regular Activities:**
- `type: "combat"` - Identifies as combat activity
- `duration: 0` - Combat duration is dynamic (based on HP/damage)
- `combatConfig.monsterId` - References monster definition
- `rewards` fields are unused (rewards come from monster definition)

### Combat Facilities

Facilities with `type: "combat"` contain combat activities:

```json
{
  "facilityId": "forest-bandit-camp",
  "name": "Bandit Camp",
  "description": "A dangerous encampment where bandits have taken residence",
  "type": "combat",
  "icon": "combat",
  "activities": [
    "activity-combat-bandit",
    "activity-combat-forest-wolf"
  ]
}
```

**Current Combat Facilities:**
- **Bandit Camp** (Forest Clearing): Forest Wolf, Bandit Thug
- **Goblin Cave** (Mountain Pass): Goblin Warrior

**File Locations:**
- [be/data/locations/activities/activity-combat-*.json](../../be/data/locations/activities/)
- [be/data/locations/facilities/forest-bandit-camp.json](../../be/data/locations/facilities/forest-bandit-camp.json)
- [be/data/locations/facilities/goblin-cave.json](../../be/data/locations/facilities/goblin-cave.json)

---

## Combat Rewards

### Victory Rewards

When the player defeats a monster:

**1. Gold**
- Random amount between monster's `baseGold.min` and `baseGold.max`
- Added directly to player's gold

**2. Experience**
- Awarded to combat skill used (based on weapon's skillScalar)
- XP amount: `monsterLevel * 10` (e.g., level 5 monster = 50 XP)
- Automatic 50% passthrough to linked attribute

**3. Loot Items**
- Rolled from monster's drop tables
- Items added to player inventory with random qualities/traits
- Multiple items possible from weighted drop tables

**4. Skill Progress**
- Potential skill level ups
- Included in reward summary modal

### Defeat Penalties

When the player is defeated:

**1. Gold Loss**
- Player drops ALL gold (100% loss)
- Gold is lost permanently (not awarded to monster)

**2. Respawn**
- Player respawns at full HP and mana
- No XP loss
- No item loss
- No durability loss (not implemented yet)

### Flee Mechanic

Player can flee at any time during combat:

- Always succeeds (100% success rate in first iteration)
- No rewards
- No gold loss
- No penalties
- Combat ends immediately

**Confirmation Required:**
```javascript
if (!confirm('Are you sure you want to flee? You will not receive any rewards.'))
```

---

## Drop Tables

### Combat Drop Table Structure

Combat drop tables follow the same structure as gathering drop tables but are specifically designed for combat loot:

```json
{
  "dropTableId": "combat-wolf-basic",
  "name": "Forest Wolf Basic Loot",
  "drops": [
    {
      "itemId": "wolf_pelt",
      "weight": 60,
      "quantity": { "min": 1, "max": 2 }
    },
    {
      "itemId": "wolf_fang",
      "weight": 40,
      "quantity": { "min": 1, "max": 1 }
    },
    {
      "itemId": "raw_meat",
      "weight": 80,
      "quantity": { "min": 1, "max": 3 }
    },
    {
      "itemId": "hemp_coif",
      "weight": 10,
      "quantity": { "min": 1, "max": 1 },
      "qualityBonus": 2
    }
  ]
}
```

### Current Combat Drop Tables

**combat-wolf-basic**
- Wolf Pelt (60% weight, 1-2 qty)
- Wolf Fang (40% weight, 1 qty)
- Raw Meat (80% weight, 1-3 qty)
- Hemp Coif (10% weight, 1 qty, +2 quality bonus)

**combat-bandit-basic**
- Tattered Cloth (70% weight, 1-3 qty)
- Leather Scraps (50% weight, 1-2 qty)
- Bronze Woodcutting Axe (15% weight, rare)
- Bronze Mining Pickaxe (15% weight, rare)
- Hemp Coif (12% weight, +1 quality)
- Leather Tunic (8% weight, +1 quality)

**combat-goblin-basic**
- Scrap Metal (60% weight, 2-4 qty)
- Goblin Tooth (45% weight, 1-2 qty)
- Copper Ore (30% weight, 1-2 qty)
- Iron Woodcutting Axe (12% weight, +1 quality)
- Iron Mining Pickaxe (12% weight, +1 quality)
- Iron Helm (8% weight, +2 quality)
- Wooden Shield (10% weight, +1 quality)

**File Locations:**
- [be/data/locations/drop-tables/combat-*.json](../../be/data/locations/drop-tables/)

---

## Backend Implementation

### Database Schema

**Player Schema Extensions** ([be/models/Player.js:109-132](../../be/models/Player.js#L109-L132)):

```javascript
activeCombat: {
  monsterId: { type: String },
  monsterInstance: { type: Map, of: mongoose.Schema.Types.Mixed },
  playerLastAttackTime: { type: Date },
  monsterLastAttackTime: { type: Date },
  playerNextAttackTime: { type: Date },
  monsterNextAttackTime: { type: Date },
  turnCount: { type: Number, default: 0 },
  abilityCooldowns: { type: Map, of: Number },
  combatLog: [{
    timestamp: { type: Date, default: Date.now },
    message: { type: String },
    type: { type: String, enum: ['damage', 'heal', 'dodge', 'miss', 'crit', 'ability', 'system'] }
  }],
  startTime: { type: Date }
},

combatStats: {
  monstersDefeated: { type: Number, default: 0 },
  deaths: { type: Number, default: 0 },
  totalDamageDealt: { type: Number, default: 0 },
  totalDamageTaken: { type: Number, default: 0 },
  abilitiesUsed: { type: Number, default: 0 }
}
```

**Migration:**
- [be/migrations/007-add-combat-system.js](../../be/migrations/007-add-combat-system.js)
- Adds combat fields to existing player documents
- Successfully migrated 3 existing players

### Service Layer

**CombatService** ([be/services/combatService.js](../../be/services/combatService.js) - 686 lines):

**Key Methods:**
- `loadMonsters()` - Load monster definitions from JSON
- `loadAbilities()` - Load ability definitions from JSON
- `initializeCombat(player, monsterId)` - Create monster instance, set timers
- `processCombatTurn(player)` - Handle auto-attacks for both combatants
- `useAbility(player, abilityId)` - Execute player ability
- `calculateDamage(attacker, defender, isAbility, abilityPower)` - Complete damage calculation
- `rollDice(diceNotation)` - Parse and roll dice strings
- `calculateArmorReduction(armor)` - Diminishing returns formula
- `calculateEvasionChance(evasion)` - Diminishing returns formula with cap
- `awardCombatRewards(player, monster)` - Grant gold, XP, loot
- `getTotalArmor(player)` - Sum armor from all equipment
- `getTotalEvasion(player)` - Sum evasion from all equipment
- `getEquippedWeapon(player)` - Get mainHand weapon or default

**Loading Process:**
```javascript
// Loads on service initialization
loadMonsters() {
  const files = fs.readdirSync(monstersPath);
  files.forEach(file => {
    const monster = JSON.parse(fs.readFileSync(file));
    this.monsters.set(monster.monsterId, monster);
  });
}
```

### Controller Layer

**CombatController** ([be/controllers/combatController.js](../../be/controllers/combatController.js)):

**Endpoints:**

**POST /api/combat/start** - Start combat with a monster
```javascript
Request: { monsterId: "forest_wolf" }
Response: {
  success: true,
  combat: { ...combatState },
  message: "Combat started with Forest Wolf"
}
```

**POST /api/combat/action** - Execute player action
```javascript
Request: {
  action: "attack" | "ability",
  abilityId?: "heavy_strike"
}
Response: {
  success: true,
  combat: { ...updatedCombatState } || null,
  rewards: { ...rewardsData } || null,
  message: "Action processed"
}
```

**GET /api/combat/status** - Get current combat state
```javascript
Response: {
  inCombat: true,
  combat: { ...combatState } || null,
  rewards: { ...rewardsData } || null
}
```

**POST /api/combat/flee** - Flee from combat
```javascript
Response: {
  success: true,
  message: "Fled from combat"
}
```

**Route Registration:**
- [be/routes/combat.js](../../be/routes/combat.js)
- All routes protected with JWT authentication
- Mounted at `/api/combat` in [be/index.js:77](../../be/index.js#L77)

### Player Model Methods

**Combat-Specific Methods** ([be/models/Player.js:610-733](../../be/models/Player.js#L610-L733)):

```javascript
// Damage and healing
takeDamage(amount)
heal(amount)
useMana(amount)
restoreMana(amount)

// Combat state
isInCombat()
clearCombat()

// Combat log
addCombatLog(message, type)

// Ability cooldowns
isAbilityOnCooldown(abilityId)
setAbilityCooldown(abilityId, turns)
getAbilityCooldownRemaining(abilityId)
```

---

## Frontend Implementation

### Service Layer

**CombatService** ([ui/src/app/services/combat.service.ts](../../ui/src/app/services/combat.service.ts)):

**Signals:**
```typescript
activeCombat = signal<Combat | null>(null);
inCombat = signal<boolean>(false);
lastRewards = signal<CombatRewards | null>(null);
combatError = signal<string | null>(null);
```

**Key Methods:**
```typescript
startCombat(monsterId: string): Observable<any>
executeAction(action: 'attack' | 'ability', abilityId?: string): Observable<any>
flee(): Observable<any>
getCombatStatus(): Observable<any>
canUseAbility(ability: Ability, combat: Combat): boolean
getAbilityCooldownRemaining(abilityId: string): number
```

**Auto-Polling:**
```typescript
constructor() {
  effect(() => {
    const combat = this.activeCombat();
    if (combat) {
      this.startStatusChecks(); // Poll every 500ms
    } else {
      this.stopStatusChecks();
    }
  });
}
```

**State Management:**
- Uses Angular signals for reactive state
- Auto-converts date strings to Date objects
- Auto-starts/stops polling based on combat state
- Refreshes player profile and inventory on combat end

### Component Layer

**CombatComponent** ([ui/src/app/components/game/combat/combat.component.ts](../../ui/src/app/components/game/combat/combat.component.ts)):

**Computed Values:**
```typescript
playerHpPercent = computed(() =>
  (combat.playerHealth.current / combat.playerHealth.max) * 100
);

playerHpColor = computed(() => {
  const percent = this.playerHpPercent();
  if (percent > 60) return '#4ade80'; // green
  if (percent > 30) return '#fbbf24'; // yellow
  return '#ef4444'; // red
});

playerManaPercent = computed(() =>
  (combat.playerMana.current / combat.playerMana.max) * 100
);
```

**Action Methods:**
```typescript
attack(): void
useAbility(ability: Ability): void
flee(): void
canUseAbility(ability: Ability): boolean
getAbilityCooldown(ability: Ability): number
dismissRewards(): void
```

**UI Helpers:**
```typescript
getLogEntryClass(entry: CombatLogEntry): string
getHpBarStyle(percent: number, color: string): any
getManaBarStyle(percent: number): any
```

### UI Components

**Combat Arena** ([combat.component.html](../../ui/src/app/components/game/combat/combat.component.html)):

**Layout Sections:**
1. **Combat Header** - Monster name and level
2. **Combatants Display** - Player and monster info side-by-side
3. **HP/Mana Bars** - Animated bars with color coding
4. **VS Indicator** - Center divider between combatants
5. **Action Bar** - Attack, abilities, and flee buttons
6. **Combat Log** - Scrollable message history with color-coded entries
7. **Turn Counter** - Current turn number display
8. **Rewards Modal** - Fullscreen overlay showing victory/defeat results

**HP Bar Color Coding:**
- Green: > 60% HP
- Yellow: 30-60% HP
- Red: < 30% HP

**Combat Log Types:**
- `log-crit`: Gold text, critical hits
- `log-damage`: Red text, damage dealt
- `log-heal`: Green text, healing
- `log-miss`: Gray text, dodges/misses
- `log-ability`: Blue text, ability usage
- `log-system`: Purple text, combat events

**Styling** ([combat.component.scss](../../ui/src/app/components/game/combat/combat.component.scss)):
- Medieval fantasy theme matching game design
- Purple accent colors for UI elements
- Gold text for player, red for monster
- Gradient backgrounds and hover effects
- Smooth animations on buttons and bars

### Location Integration

**LocationComponent** ([ui/src/app/components/game/location/location.ts:397-418](../../ui/src/app/components/game/location/location.ts#L397-L418)):

```typescript
startActivity(activity: any): void {
  // Detect combat activities
  if (activity.type === 'combat') {
    const monsterId = activity.combatConfig?.monsterId;
    if (!monsterId) {
      console.error('Combat activity missing monsterId');
      return;
    }

    // Start combat via CombatService
    this.combatService.startCombat(monsterId).subscribe({
      next: (response) => {
        // Combat UI automatically shows via inCombat signal
      },
      error: (err) => {
        console.error('Failed to start combat:', err);
      }
    });
  } else {
    // Regular activity flow
    this.locationService.startActivity(activity).subscribe(...);
  }
}
```

**Location Template** ([location.html:223-230](../../ui/src/app/components/game/location/location.html#L223-L230)):

```html
<!-- Combat Section (shows when in combat) -->
<div *ngIf="combatService.inCombat()">
  <app-combat></app-combat>
</div>

<!-- Hide activity list during combat -->
<div *ngIf="!combatService.inCombat()">
  <!-- Activity list UI -->
</div>
```

---

## Testing Guide

### Backend Testing

**1. Test Combat Initialization:**
```bash
curl -X POST http://localhost:3000/api/combat/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monsterId": "forest_wolf"}'
```

Expected: Combat state with initial HP, timers, and available abilities

**2. Test Auto-Attack:**
```bash
curl -X POST http://localhost:3000/api/combat/action \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "attack"}'
```

Expected: Updated combat state with damage dealt, HP changes, combat log entries

**3. Test Ability Usage:**
```bash
curl -X POST http://localhost:3000/api/combat/action \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "ability", "abilityId": "heavy_strike"}'
```

Expected: Ability damage, mana cost deducted, cooldown applied

**4. Test Combat Status:**
```bash
curl http://localhost:3000/api/combat/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: Current combat state or `inCombat: false`

**5. Test Flee:**
```bash
curl -X POST http://localhost:3000/api/combat/flee \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Expected: Combat cleared, no rewards

### Frontend Testing

**Manual Testing Checklist:**

1. **Navigation**
   - [ ] Travel to Forest Clearing
   - [ ] Find Bandit Camp facility
   - [ ] See combat activities listed

2. **Combat Initiation**
   - [ ] Click "Fight Forest Wolf"
   - [ ] Combat UI appears
   - [ ] Activity list hides
   - [ ] Player/monster HP bars show
   - [ ] Mana bar shows

3. **Auto-Attacks**
   - [ ] Wait for attack timer
   - [ ] Damage appears in combat log
   - [ ] HP bars animate
   - [ ] Turn counter increments
   - [ ] Both combatants attack on their timers

4. **Abilities**
   - [ ] Ability buttons show (if weapon equipped)
   - [ ] Click ability
   - [ ] Mana deducts
   - [ ] Cooldown counter appears
   - [ ] Damage higher than normal attack
   - [ ] Ability grays out during cooldown
   - [ ] Ability re-enables after cooldown turns

5. **Combat Log**
   - [ ] Messages appear in reverse order (newest first)
   - [ ] Color coding correct (red=damage, gold=crit, etc.)
   - [ ] Scrollable when many messages
   - [ ] Timestamps show

6. **Victory**
   - [ ] Monster reaches 0 HP
   - [ ] Combat ends
   - [ ] Rewards modal shows
   - [ ] Gold amount displayed
   - [ ] XP gain shown
   - [ ] Loot items listed
   - [ ] Player gold updates
   - [ ] Inventory receives items

7. **Defeat**
   - [ ] Player reaches 0 HP
   - [ ] Combat ends
   - [ ] Defeat modal shows
   - [ ] Gold loss displayed
   - [ ] Player respawns full HP
   - [ ] Gold deducted

8. **Flee**
   - [ ] Click Flee button
   - [ ] Confirmation dialog shows
   - [ ] Combat ends if confirmed
   - [ ] No rewards
   - [ ] No gold loss
   - [ ] Combat continues if cancelled

### Balance Testing

**Damage Testing:**
```javascript
// Test in be/utils/test-combat.js
const testDamage = () => {
  // Level 1 player vs Level 3 wolf
  // Should: Average 2-3 turns to kill player
  // Should: Average 25-30 turns to kill wolf

  // Level 10 player vs Level 3 wolf
  // Should: 5-8 turns to kill wolf
  // Should: Nearly immortal (high armor/evasion)
};
```

**XP Testing:**
```javascript
// Should award appropriate XP per monster level
// Level 3 monster = 30 XP to combat skill
// Level 5 monster = 50 XP to combat skill
// + 50% passthrough to attribute
```

**Loot Testing:**
- Common items should drop frequently
- Rare items should drop occasionally
- Drop rates match expected percentages
- Quality bonuses apply correctly

---

## Known Limitations (First Iteration)

### Not Yet Implemented

1. **Passive Abilities** - Monster `passiveAbilities` defined but not processed
2. **Block Chance** - Shield `blockChance` stat defined but not used
3. **Healing Abilities** - Only damage abilities implemented
4. **Buff/Debuff Abilities** - Framework exists but not functional
5. **Area Effects** - Single-target only
6. **Multi-Monster Combat** - One monster at a time
7. **Summons/Pets** - Monster structure supports it, not implemented
8. **Combat Events** - Random events during combat
9. **Flee Failure** - Flee always succeeds (should have failure chance)
10. **Death Penalties** - Only gold loss, no durability/XP/item loss
11. **Combat Achievements** - Stats tracked but no achievements
12. **Difficulty Scaling** - Monsters have fixed stats

### Technical Debt

1. **Status Polling** - 500ms polling is functional but not optimal (should use WebSockets)
2. **Combat Log** - Limited to recent messages (no persistent history)
3. **Ability Icons** - Defined but not displayed in UI
4. **Monster Respawning** - Combat activities always available (should have cooldowns)
5. **Combat Balance** - Needs extensive playtesting and tuning
6. **Error Handling** - Basic error messages, needs user-friendly feedback
7. **Loading States** - No spinners/indicators during API calls
8. **Animation** - Basic CSS transitions, no advanced effects

---

## Future Enhancements

### Short-Term (Iteration 2)

1. **Passive Abilities**
   - Implement monster passive effects
   - Add conditional damage modifiers
   - Create player passive abilities from gear

2. **Combat Polish**
   - Add damage numbers that float up on hit
   - Animate HP bar changes
   - Add hit/miss animations
   - Sound effects for attacks/abilities

3. **Balance Tuning**
   - Adjust monster HP/damage based on playtesting
   - Fine-tune ability costs/cooldowns
   - Balance drop rates
   - Adjust armor/evasion curves

4. **Monster Variety**
   - Add 5-10 more monsters across level ranges
   - Create boss monsters with unique mechanics
   - Add rare elite variants

### Mid-Term (Iteration 3)

1. **Advanced Abilities**
   - Healing abilities (restore HP)
   - Buff abilities (temporary stat boosts)
   - Debuff abilities (weaken enemy)
   - DoT abilities (damage over time)

2. **Combat Mechanics**
   - Shield block chance implementation
   - Parry/riposte mechanics
   - Combo system for chained abilities
   - Elemental damage types (fire, ice, lightning)

3. **Improved Rewards**
   - Quest drops from specific monsters
   - Rare material drops for crafting
   - Cosmetic drops (skins, titles)
   - Achievement system

### Long-Term (Iteration 4+)

1. **Multiplayer Combat**
   - Party system (2-4 players)
   - Boss raids (8-20 players)
   - PvP arenas
   - Guild wars

2. **Advanced Systems**
   - Monster taming/pet system
   - Summonable allies
   - Strategic combat (turn order, positioning)
   - Combat puzzles (boss mechanics)

3. **World Integration**
   - Random encounters while traveling
   - Dynamic monster spawns
   - Territory control
   - World bosses

---

## Performance Considerations

### Backend Optimization

**Current Implementation:**
- Monsters loaded once at service initialization
- Abilities loaded once at service initialization
- Player combat state stored in database
- Combat calculations are synchronous

**Optimization Opportunities:**
1. Cache monster instances in memory
2. Batch database writes for combat log
3. Use Redis for active combat sessions
4. Implement rate limiting on combat actions

### Frontend Optimization

**Current Implementation:**
- 500ms status polling during combat
- Full combat state sent each poll
- Angular signals for reactive updates
- Computed values for derived state

**Optimization Opportunities:**
1. WebSocket connection for real-time updates
2. Delta updates instead of full state
3. Debounce rapid ability clicks
4. Virtual scrolling for long combat logs

### Database Impact

**Current Load:**
- 1 read per combat start
- 1-2 writes per auto-attack
- 1-2 writes per ability use
- 1 write per combat end

**Scaling Considerations:**
- 1000 concurrent combats = ~2000-4000 writes/sec (manageable)
- MongoDB handles this load easily
- Add indexes on `activeCombat.monsterId` if needed

---

## Troubleshooting

### Common Issues

**1. Combat Doesn't Start**
- Check: Is player already in combat? (`player.activeCombat.monsterId`)
- Check: Does monsterId exist in definitions?
- Check: Does player have sufficient HP?

**2. No Abilities Show**
- Check: Is weapon equipped in mainHand?
- Check: Does weapon have `skillScalar` field?
- Check: Do abilities exist for that weapon type?

**3. Abilities Can't Be Used**
- Check: Does player have enough mana?
- Check: Is ability on cooldown?
- Check: Has enough turns passed since last use?

**4. Damage Seems Wrong**
- Check: Equipment stats (armor, evasion)
- Check: Skill/attribute levels
- Check: Dice notation in weapon definition
- Enable debug logging in combat service

**5. Combat Never Ends**
- Check: Are both combatants dealing damage?
- Check: Are HP values updating correctly?
- Check: Check combat log for errors

### Debug Mode

Add to `combatService.js` for debugging:

```javascript
const DEBUG = process.env.COMBAT_DEBUG === 'true';

if (DEBUG) {
  console.log('Combat Turn:', {
    playerHP: player.activeCombat.monsterInstance.stats.health.current,
    monsterHP: combat.monsterHealth.current,
    playerDamage: damage,
    armorReduction: armorReduction,
    dodgeChance: dodgeChance
  });
}
```

Run with: `COMBAT_DEBUG=true npm run dev`

---

## File Reference

### Backend Files

**Core Services:**
- [be/services/combatService.js](../../be/services/combatService.js) - Combat engine (686 lines)
- [be/controllers/combatController.js](../../be/controllers/combatController.js) - API endpoints
- [be/routes/combat.js](../../be/routes/combat.js) - Route definitions

**Data Definitions:**
- [be/data/monsters/definitions/](../../be/data/monsters/definitions/) - Monster JSON files
- [be/data/abilities/definitions/](../../be/data/abilities/definitions/) - Ability JSON files
- [be/data/locations/activities/activity-combat-*.json](../../be/data/locations/activities/) - Combat activities
- [be/data/locations/facilities/forest-bandit-camp.json](../../be/data/locations/facilities/forest-bandit-camp.json) - Combat facility
- [be/data/locations/drop-tables/combat-*.json](../../be/data/locations/drop-tables/) - Combat loot tables

**Database:**
- [be/models/Player.js:109-132](../../be/models/Player.js#L109-L132) - activeCombat schema
- [be/models/Player.js:610-733](../../be/models/Player.js#L610-L733) - Combat methods
- [be/migrations/007-add-combat-system.js](../../be/migrations/007-add-combat-system.js) - Migration script

### Frontend Files

**Services:**
- [ui/src/app/services/combat.service.ts](../../ui/src/app/services/combat.service.ts) - Combat state management

**Components:**
- [ui/src/app/components/game/combat/combat.component.ts](../../ui/src/app/components/game/combat/combat.component.ts) - Combat logic
- [ui/src/app/components/game/combat/combat.component.html](../../ui/src/app/components/game/combat/combat.component.html) - Combat UI
- [ui/src/app/components/game/combat/combat.component.scss](../../ui/src/app/components/game/combat/combat.component.scss) - Combat styling
- [ui/src/app/components/game/location/location.ts:397-418](../../ui/src/app/components/game/location/location.ts#L397-L418) - Combat integration

---

## Version History

**v1.0 (Current) - Initial Implementation**
- Fast-paced auto-attack system with weapon-based timers
- Instant abilities with turn-based cooldowns
- Damage calculation with skill/attribute scaling, crits, evasion, armor
- 3 monsters (Forest Wolf, Bandit Thug, Goblin Warrior)
- 6 abilities (melee, ranged, magic)
- Victory rewards (gold, XP, loot) and defeat penalties (gold loss)
- Flee mechanic (always succeeds)
- Real-time combat UI with HP bars, action buttons, combat log
- Status polling (500ms) for real-time updates
- Full integration with location system

**Status**: ✅ Complete and functional
**Migration**: 007-add-combat-system.js (completed)
**Build**: All TypeScript/SCSS errors resolved
**Testing**: Ready for in-game testing
