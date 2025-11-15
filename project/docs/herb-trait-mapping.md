# Herb & Tree Trait Mapping - Real-World to Game Mechanics

## Current Herbs Analysis

### Starter Herbs (Levels 1-5)

#### 1. Chamomile (Level 1)
**Real-World Properties:**
- Calming, anti-inflammatory, relaxing
- Used for stress relief, sleep aid, digestive health
- Mild, gentle, restorative

**Current Game Use:**
- Enhanced Health Potion ingredient (L5 recipe)
- Tier 1, Common

**Proposed Trait: Restorative (Calming)**
- **Effect**: Adds Health-over-Time (HoT) to health potions
- **Why**: Real-world calming/restorative properties = gradual healing
- **L1**: Soothing (+2 HP/tick, 5 ticks = +10 HP over 15s)
- **L2**: Regenerative (+4 HP/tick, 5 ticks = +20 HP over 15s)
- **L3**: Miraculous (+7 HP/tick, 5 ticks = +35 HP over 15s)

#### 2. Sage (Level 3)
**Real-World Properties:**
- Protective, purifying, wisdom-enhancing
- Memory improvement, anti-inflammatory
- Strong, aromatic, defensive

**Current Game Use:**
- No specific recipes yet
- Tier 1, Common

**Proposed Trait: Warding (Protective)**
- **Effect**: Adds temporary armor buff when used in potions
- **Why**: Real-world protective/defensive properties = damage reduction
- **L1**: Fortifying (+5 armor for 30s)
- **L2**: Shielding (+10 armor for 30s)
- **L3**: Impervious (+15 armor for 30s)

### Mid-Tier Herbs (Levels 5-10)

#### 3. Nettle (Level 5)
**Real-World Properties:**
- Blood purification, anti-inflammatory, energizing
- Rich in vitamins and minerals
- Stinging defense mechanism, hardy plant

**Current Game Use:**
- No specific recipes yet
- Tier 2, Uncommon

**Proposed Trait: Invigorating (Energizing)**
- **Effect**: Adds attack speed buff when used in potions
- **Why**: Real-world energizing properties = faster actions
- **L1**: Quickening (+10% attack speed for 20s)
- **L2**: Hastening (+20% attack speed for 20s)
- **L3**: Blur (+30% attack speed for 20s)

#### 4. Mandrake Root (Level 8)
**Real-World Properties:**
- Mystical, powerful sedative, hallucinogenic
- Human-shaped root (folklore: screams when pulled)
- Potent, dangerous, magical

**Current Game Use:**
- No specific recipes yet
- Tier 2, Uncommon

**Proposed Trait: Empowering (Magical Potency)**
- **Effect**: Increases spell/ability damage when used in potions
- **Why**: Real-world magical properties = enhanced power
- **L1**: Potent (+10% damage for 30s)
- **L2**: Empowered (+20% damage for 30s)
- **L3**: Devastating (+35% damage for 30s)

### Advanced Herbs (Levels 12-15)

#### 5. Moonpetal (Level 12)
**Real-World Properties:**
- Lunar connection, ethereal, luminescent
- Nighttime blooming, mystical
- Rare, beautiful, otherworldly

**Current Game Use:**
- No specific recipes yet
- Tier 3, Rare

**Proposed Trait: Clarifying (Mental Focus)**
- **Effect**: Reduces ability cooldowns when used in potions
- **Why**: Real-world clarity/focus properties = faster ability recovery
- **L1**: Focused (-10% cooldowns for 30s)
- **L2**: Lucid (-20% cooldowns for 30s)
- **L3**: Transcendent (-30% cooldowns for 30s)

#### 6. Dragon's Breath (Level 15)
**Real-World Properties:**
- Fiery, volcanic, intense heat
- Crimson color, warm to touch
- Powerful, aggressive, stimulating

**Current Game Use:**
- No specific recipes yet
- Tier 3, Rare

**Proposed Trait: Emboldening (Courage/Strength)**
- **Effect**: Increases critical hit chance when used in potions
- **Why**: Real-world fiery/bold properties = more powerful strikes
- **L1**: Fierce (+5% crit chance for 30s)
- **L2**: Savage (+10% crit chance for 30s)
- **L3**: Legendary (+15% crit chance for 30s)

## Wood/Log Traits (Real-World Tree Properties)

### Oak (Current starter wood)
**Real-World Properties:**
- Strong, durable, traditional weapon/tool wood
- Dense grain, long-lasting
- Symbol of strength and endurance

**Proposed Trait: Balanced**
- **Effect**: Tool activity time reduction
- **Why**: Real-world balance and traditional crafting use
- **L1**: Balanced (-1s activity time)
- **L2**: Ergonomic (-2s activity time)
- **L3**: Masterwork (-4s activity time)

### Future Woods

#### Ash
**Real-World Properties:**
- Flexible, shock-absorbent
- Traditional bow and spear wood
- Light yet strong

**Proposed Trait: Flexible**
- **Effect**: Reduces stamina cost for activities/attacks
- **Potential Future Implementation**

#### Maple
**Real-World Properties:**
- Hard, impact-resistant
- Used for baseball bats, bowling pins
- Dense, strong grain

**Proposed Trait: Resilient**
- **Effect**: Tools have chance to not consume durability (if we add durability back)
- **Potential Future Implementation**

## Starter Island Buff Potion Recipes (NEW)

### 1. Sage Warding Tonic (Level 3)
```typescript
{
  recipeId: 'sage_warding_tonic',
  name: 'Sage Warding Tonic',
  description: 'A protective brew that hardens the skin and fortifies defenses',
  skill: 'alchemy',
  requiredLevel: 3,
  duration: 10,
  ingredients: [
    { itemId: 'sage', quantity: 3 }  // Sage-specific for armor buff
  ],
  outputs: [
    { itemId: 'warding_tonic', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 25,
  unlockConditions: {
    discoveredByDefault: true
  }
}
```
**Potion Effect**: +5 armor for 30 seconds (base, +10 for L2 Warding trait, +15 for L3)

### 2. Nettle Vigor Draught (Level 5)
```typescript
{
  recipeId: 'nettle_vigor_draught',
  name: 'Nettle Vigor Draught',
  description: 'An energizing concoction that quickens reflexes and sharpens strikes',
  skill: 'alchemy',
  requiredLevel: 5,
  duration: 12,
  ingredients: [
    { itemId: 'nettle', quantity: 2 },
    { subcategory: SUBCATEGORY.HERB, quantity: 1 }  // Any herb for base
  ],
  outputs: [
    { itemId: 'vigor_draught', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 35,
  unlockConditions: {
    discoveredByDefault: false,
    requiredRecipes: ['basic_health_tincture']
  }
}
```
**Potion Effect**: +10% attack speed for 20 seconds (base, +20% for L2 trait, +30% for L3)

### 3. Mandrake Power Elixir (Level 8)
```typescript
{
  recipeId: 'mandrake_power_elixir',
  name: 'Mandrake Power Elixir',
  description: 'A potent brew infused with the mystical essence of mandrake',
  skill: 'alchemy',
  requiredLevel: 8,
  duration: 15,
  ingredients: [
    { itemId: 'mandrake_root', quantity: 1 },
    { itemId: 'sage', quantity: 2 }  // Sage for stability
  ],
  outputs: [
    { itemId: 'power_elixir', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 45,
  unlockConditions: {
    discoveredByDefault: false,
    requiredRecipes: ['nettle_vigor_draught']
  }
}
```
**Potion Effect**: +10% damage for 30 seconds (base, +20% for L2 trait, +35% for L3)

### 4. Dragon's Fury Brew (Level 15)
```typescript
{
  recipeId: 'dragons_fury_brew',
  name: "Dragon's Fury Brew",
  description: 'A fiery elixir that ignites the warrior spirit and sharpens killing intent',
  skill: 'alchemy',
  requiredLevel: 15,
  duration: 20,
  ingredients: [
    { itemId: 'dragons_breath', quantity: 2 },
    { itemId: 'mandrake_root', quantity: 1 }  // Mandrake for potency
  ],
  outputs: [
    { itemId: 'fury_brew', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 75,
  unlockConditions: {
    discoveredByDefault: false,
    requiredRecipes: ['mandrake_power_elixir']
  }
}
```
**Potion Effect**: +5% crit chance for 30 seconds (base, +10% for L2 trait, +15% for L3)

## Summary Table

| Herb | Level | Trait | Potion Type | Effect | Real-World Basis |
|------|-------|-------|-------------|--------|------------------|
| Chamomile | 1 | Restorative | Health (HoT) | +2-7 HP/tick | Calming, restorative |
| Sage | 3 | Warding | Armor Buff | +5-15 armor | Protective, purifying |
| Nettle | 5 | Invigorating | Attack Speed | +10-30% speed | Energizing, stimulating |
| Mandrake | 8 | Empowering | Damage Buff | +10-35% damage | Magical potency |
| Moonpetal | 12 | Clarifying | Cooldown Reduction | -10-30% cooldowns | Mental clarity |
| Dragon's Breath | 15 | Emboldening | Crit Chance | +5-15% crit | Fiery, bold strength |

## Player Progression Path (Starter Island)

### Early Game (Levels 1-5)
1. Gather **Chamomile** → Brew Enhanced Health Potions with **HoT** (heal over time in combat)
2. Gather **Sage** → Brew Warding Tonics for **+armor** (survive longer in combat)
3. Unlock **Nettle** → Brew Vigor Draughts for **+attack speed** (kill faster)

### Mid Game (Levels 5-10)
4. Find high-level **Restorative Chamomile** (L2-L3) → Superior HoT potions
5. Combine **Mandrake + Sage** → Power Elixirs for **+damage**
6. Stack buffs: Armor + Attack Speed + Damage = Ready for harder content

### Late Starter Island (Levels 10-15)
7. Gather **Moonpetal** → Cooldown reduction potions (spam abilities)
8. Gather **Dragon's Breath** → Crit chance potions (burst damage)
9. **Ready for Mainland** - Full buff suite, optimized gear, proven combat effectiveness

## Design Philosophy

**Immediate Impact**:
- Level 1-3 herbs available immediately with useful effects
- Buff potions teachable alongside healing potions
- Combat advantage visible from first use

**Real-World Grounding**:
- Chamomile = calming → gradual healing (HoT)
- Sage = protective → armor buff
- Nettle = energizing → attack speed
- Mandrake = magical → damage boost
- Moonpetal = clarity → cooldown reduction
- Dragon's Breath = fiery → critical strikes

**Trait Rarity**:
- Common herbs (Chamomile, Sage): 15-20% trait chance
- Uncommon herbs (Nettle, Mandrake): 25-30% trait chance
- Rare herbs (Moonpetal, Dragon's Breath): 35-40% trait chance
- Higher levels of same trait are progressively rarer

**Strategic Depth**:
- Players choose which buffs to brew based on combat needs
- Trait hunting creates goals ("find L3 Warding Sage for +15 armor")
- Multiple viable strategies (tank with armor, DPS with damage, balance both)
