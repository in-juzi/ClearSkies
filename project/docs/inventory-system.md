# Inventory System Documentation

## Overview

The ClearSkies inventory system is a flexible, extensible framework for managing items with dynamic qualities and traits. It supports items from canonical definitions that can have unique properties, making each item instance potentially unique while maintaining easy balancing and extensibility.

## Architecture

### Three-Tier System

1. **Item Definitions** (Canonical Items)
   - Base templates stored in JSON files
   - Define item properties, allowed qualities, and traits
   - Easy to edit and balance without code changes

2. **Quality & Trait Definitions**
   - Separate definitions for reusable properties
   - Define effects and applicability
   - Support dynamic price and gameplay calculations

3. **Item Instances** (Player Inventory)
   - References to base items
   - Unique quality values (0-1 scale)
   - Applied traits
   - Stacking logic for identical items

## File Structure

```
be/
├── data/items/
│   ├── definitions/
│   │   ├── resources.json      # Wood, ore, fish
│   │   ├── equipment.json      # Weapons, armor
│   │   └── consumables.json    # Food, potions
│   ├── qualities/
│   │   └── qualities.json      # woodGrain, purity, freshness, etc.
│   └── traits/
│       └── traits.json         # fragrant, pristine, cursed, etc.
├── services/
│   └── itemService.js          # Item management logic
├── controllers/
│   └── inventoryController.js  # API endpoints
├── routes/
│   └── inventory.js            # Route definitions
└── models/
    └── Player.js               # Updated with inventory

ui/src/app/
├── models/
│   └── inventory.model.ts      # TypeScript interfaces
├── services/
│   └── inventory.service.ts    # API service with signals
└── components/game/inventory/
    ├── inventory.component.ts
    ├── inventory.component.html
    └── inventory.component.css
```

## Item Categories

- **Resource**: Raw materials (logs, ore, fish)
- **Equipment**: Weapons, armor, tools
- **Consumable**: Food, potions
- **Crafted**: Player-made items

## Qualities

Qualities are numeric values (0-1) that represent gradual variations:

- **woodGrain**: Affects structural integrity (wood items)
- **moisture**: Dryness of wood
- **age**: How aged the material is
- **purity**: Quality of ore/metal
- **freshness**: How fresh food is

Each quality has effects on:
- Vendor price modifiers
- Crafting bonuses
- Alchemy potency
- And more...

## Traits

Traits are special properties with rarity levels:

- **Common**: knotted
- **Uncommon**: fragrant, weathered
- **Rare**: pristine, cursed
- **Epic**: blessed, masterwork

Traits provide:
- Price multipliers
- Bonus properties for alchemy/crafting
- Combat effects
- Unique mechanics

## API Endpoints

### Inventory Management

**GET** `/api/inventory`
- Returns player's full inventory with enhanced details
- Includes capacity, size, and total value

**GET** `/api/inventory/items/:instanceId`
- Get details for a specific item instance

**POST** `/api/inventory/items`
- Add item to inventory
- Body: `{ itemId, quantity, qualities, traits }`

**POST** `/api/inventory/items/random`
- Add item with randomly generated qualities/traits
- Body: `{ itemId, quantity }`
- Qualities based on item tier
- Traits based on rarity chances

**DELETE** `/api/inventory/items`
- Remove item from inventory
- Body: `{ instanceId, quantity? }`

### Item Definitions

**GET** `/api/inventory/definitions`
- Get all item definitions
- Optional query param: `?category=resource`

**GET** `/api/inventory/definitions/:itemId`
- Get single item definition

**POST** `/api/inventory/reload`
- Hot-reload item definitions without server restart

## Player Model Updates

New fields:
```javascript
inventory: [{
  instanceId: String,      // Unique instance ID
  itemId: String,          // Reference to definition
  quantity: Number,        // Stack size
  qualities: Map,          // Quality values
  traits: [String],        // Applied traits
  equipped: Boolean,       // For equipment
  acquiredAt: Date         // Timestamp
}]
inventoryCapacity: Number  // Max items (default: 100)
```

New methods:
- `addItem(itemInstance)` - Add with stacking logic
- `removeItem(instanceId, quantity)` - Remove items
- `getItem(instanceId)` - Get single item
- `getItemsByItemId(itemId)` - Get all of one type
- `getInventorySize()` - Total item count
- `getInventoryValue()` - Total vendor price

## ItemService Features

### Core Functions

- `loadDefinitions()` - Load all JSON definitions into memory
- `reloadDefinitions()` - Hot-reload without restart
- `createItemInstance()` - Create item with validation
- `calculateVendorPrice()` - Dynamic pricing based on qualities/traits
- `getItemDetails()` - Full details with calculated properties
- `canStack()` - Check if items can stack together

### Random Generation

- `generateRandomQualities(itemId)` - Tier-based quality generation
- `generateRandomTraits(itemId)` - Rarity-based trait generation

**Quality Generation Logic:**
```javascript
baseValue = 0.3 + (tier * 0.1)  // T1: 0.4, T2: 0.5, T3: 0.6
value = baseValue ± 0.3 variance
```

**Trait Generation Chances:**
- Common: 5%
- Uncommon: 15%
- Rare: 30%
- Epic: 50%

## Frontend Integration

### InventoryService (Angular Signals)

Reactive state management:
```typescript
inventory = signal<ItemDetails[]>([])
inventoryCapacity = signal<number>(100)
inventorySize = signal<number>(0)
inventoryValue = signal<number>(0)
```

Helper methods:
- `getItemsByCategory(category)` - Filter by category
- `getEquippedItems()` - Get equipped items
- `getRarityColor(rarity)` - Color class for rarity
- `formatQuality(value)` - Format as percentage
- `getQualityColor(value)` - Color based on quality value

### UI Component Features

- **Category filtering** (All, Resources, Equipment, Consumables)
- **Item grid** with rarity borders
- **Trait indicators** on items
- **Detailed item panel** showing:
  - Full description
  - Quality values with color coding
  - Trait effects
  - Vendor price
  - Action buttons (Use, Equip, Drop)
- **Inventory stats** (size, capacity, weight, total value)
- **Dev tools** for testing (removable in production)

## Adding New Items

### 1. Add Item Definition

Edit the appropriate JSON file in `be/data/items/definitions/`:

```json
{
  "new_item_id": {
    "itemId": "new_item_id",
    "name": "Display Name",
    "description": "Item description",
    "category": "resource|equipment|consumable",
    "baseValue": 100,
    "rarity": "common|uncommon|rare|epic|legendary",
    "stackable": true,
    "maxStack": 100,
    "properties": {
      "weight": 5,
      "material": "wood",
      "tier": 2
    },
    "allowedQualities": ["quality1", "quality2"],
    "allowedTraits": ["trait1", "trait2"]
  }
}
```

### 2. (Optional) Add New Quality

Edit `be/data/items/qualities/qualities.json`:

```json
{
  "newQuality": {
    "qualityId": "newQuality",
    "name": "Display Name",
    "description": "What it affects",
    "applicableCategories": ["resource"],
    "valueType": "numeric",
    "range": [0, 1],
    "effects": {
      "vendorPrice": { "modifier": 0.2 },
      "crafting": { "bonusQuality": 0.3 }
    }
  }
}
```

### 3. (Optional) Add New Trait

Edit `be/data/items/traits/traits.json`:

```json
{
  "newTrait": {
    "traitId": "newTrait",
    "name": "Display Name",
    "description": "What it does",
    "rarity": "uncommon",
    "applicableCategories": ["equipment"],
    "effects": {
      "vendorPrice": { "modifier": 1.5 },
      "combat": { "damageBonus": 0.2 }
    }
  }
}
```

### 4. Reload Definitions

Either:
- Restart server (automatic load)
- Call `POST /api/inventory/reload` endpoint
- Use admin UI (when implemented)

## Current Items

### Resources (9 items)
- **Logs**: oak_log, willow_log, maple_log (T1-T3)
- **Ore**: copper_ore, iron_ore, silver_ore (T1-T3)
- **Fish**: trout, salmon, pike (T1-T3)

### Equipment (3 items)
- copper_sword (T1)
- iron_sword (T2)
- wooden_shield (T1)

### Consumables (3 items)
- cooked_trout (T1)
- cooked_salmon (T2)
- health_potion_minor (T1)

## Future Enhancements

### Planned Features
- Equipment durability system
- Consumable effects system
- Crafting system integration
- Item enchantments
- Item sets with bonuses
- Trading between players
- Auction house
- Item socketing (gems)

### Possible Extensions
- Item icons/sprites
- Item tooltips with comparisons
- Inventory sorting/filtering
- Quick-stack functionality
- Item search
- Favorite items
- Item presets for equipment sets
- Repair system
- Item identification (unknown properties)

## Performance Considerations

- **Definitions cached in memory** - Fast lookups
- **Hot-reload capability** - No server restart needed
- **Stacking logic** - Reduces database size
- **Calculated properties** - Vendor prices computed on-demand
- **Frontend signals** - Reactive updates without re-renders

## Balancing Tips

1. **Adjust base values** in item definitions
2. **Tune quality effects** in quality definitions
3. **Modify trait rarities** and effects
4. **Change tier multipliers** in `generateRandomQualities()`
5. **Adjust stack sizes** for inventory management
6. **Modify capacity** for progression systems

All changes can be made in JSON files without touching code!

## Testing

### Backend Test (using curl or Postman)

```bash
# Get inventory
curl http://localhost:3000/api/inventory -H "Authorization: Bearer YOUR_TOKEN"

# Add random item
curl -X POST http://localhost:3000/api/inventory/items/random \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"itemId": "willow_log", "quantity": 5}'

# Get item definitions
curl http://localhost:3000/api/inventory/definitions
```

### Frontend Testing

Use the Dev Tools section in the inventory UI to add test items with random qualities and traits.

## Version

Initial implementation: January 2025
