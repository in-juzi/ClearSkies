# Item Requirements System

## Overview

The Item Requirements System allows activities to specify equipment and inventory requirements for players to participate in activities. This enables progression mechanics where players need proper tools (like axes for woodcutting or pickaxes for mining) and consumable items (like bait for fishing or torches for mining).

## Key Features

- **Equipment Requirements**: Require specific item subtypes to be equipped (in any valid slot)
- **Inventory Requirements**: Require specific items to be present in inventory with minimum quantities
- **Flexible Equipment**: Tools can be equipped in different slots (e.g., rare offhand pickaxe for dual-mining)
- **Subtype-Based Matching**: Activities check for subtypes rather than specific items, allowing progression tiers
- **Simple Error Messages**: Clear user-friendly validation feedback

## Item Subtypes

Equipment items now support a `subtype` field that categorizes them by their function:

### Available Subtypes

- **woodcutting-axe**: Axes for chopping trees
- **mining-pickaxe**: Pickaxes for mining ore
- **fishing-rod**: Rods for fishing
- **sword**: Combat weapons
- **shield**: Defensive equipment
- **helm**: Head armor
- **coif**: Light head armor
- **tunic**: Body armor

### Subtype Progression Example

Multiple items can share the same subtype but have different tiers:

```json
{
  "bronze_woodcutting_axe": {
    "subtype": "woodcutting-axe",
    "properties": {
      "tier": 1,
      "toolEfficiency": 1.0
    }
  },
  "iron_woodcutting_axe": {
    "subtype": "woodcutting-axe",
    "properties": {
      "tier": 2,
      "toolEfficiency": 1.5
    }
  }
}
```

Both axes satisfy `"subtype": "woodcutting-axe"` requirements, allowing natural progression.

## Activity Requirements Schema

Activities can specify requirements using the following structure:

```json
{
  "activityId": "activity-chop-oak",
  "name": "Chop Oak Trees",
  "requirements": {
    "skills": {
      "woodcutting": 1
    },
    "equipped": [
      { "subtype": "woodcutting-axe" }
    ],
    "inventory": [
      { "itemId": "torch", "quantity": 2 }
    ]
  }
}
```

### Requirement Types

#### 1. Equipped Requirements

Checks if the player has an item with a specific subtype equipped in **any** slot:

```json
"equipped": [
  { "subtype": "mining-pickaxe" }
]
```

**Validation Logic**:
- Scans all equipped slots (mainHand, offHand, etc.)
- Looks up item definitions for equipped items
- Matches against the `subtype` field
- Returns `true` if any equipped item matches

**Error Message**: `"Requires {subtype} equipped"`

Example: `"Requires mining-pickaxe equipped"`

#### 2. Inventory Requirements

Checks if the player has a specific item in their inventory (equipped or not):

```json
"inventory": [
  { "itemId": "bait", "quantity": 5 }
]
```

**Validation Logic**:
- Searches inventory for items with matching `itemId`
- Sums up quantities across all stacks
- Checks if total meets or exceeds required `quantity`

**Error Message**: `"Requires {quantity}x {itemName} in inventory"`

Example: `"Requires 5x Fishing Bait in inventory"`

**Default Quantity**: If `quantity` is omitted, defaults to `1`.

#### 3. Legacy Item Requirements (Deprecated)

Old-style item requirements are still supported for backward compatibility:

```json
"items": ["oak_log"]
```

**Note**: Use `equipped` or `inventory` arrays instead for new activities.

## Tool Items

### Tool Item Schema

Tools are equipment items with the `equipmentType: "tool"` and a specific `subtype`:

```json
{
  "bronze_mining_pickaxe": {
    "itemId": "bronze_mining_pickaxe",
    "name": "Bronze Mining Pickaxe",
    "category": "equipment",
    "equipmentType": "tool",
    "subtype": "mining-pickaxe",
    "slot": "mainHand",
    "properties": {
      "tier": 1,
      "damage": 3,
      "toolEfficiency": 1.0,
      "durability": 100
    }
  }
}
```

### Current Tool Items

**Woodcutting Axes:**
- `bronze_woodcutting_axe` (tier 1, mainHand)
- `iron_woodcutting_axe` (tier 2, mainHand)

**Mining Pickaxes:**
- `bronze_mining_pickaxe` (tier 1, mainHand)
- `iron_mining_pickaxe` (tier 2, mainHand)
- `rare_iron_mining_pickaxe_offhand` (tier 2, offHand, rare) - Example of flexible slotting

**Fishing Rods:**
- `bamboo_fishing_rod` (tier 1, mainHand)
- `willow_fishing_rod` (tier 2, mainHand)

### Special Cases: Offhand Tools

Some rare tools can be equipped in the offhand slot for unique gameplay:

```json
{
  "rare_iron_mining_pickaxe_offhand": {
    "name": "Twin-Strike Mining Pickaxe",
    "subtype": "mining-pickaxe",
    "slot": "offHand",
    "rarity": "rare"
  }
}
```

This allows players to dual-wield pickaxes (mainHand + offHand) for potential bonuses.

## Backend Implementation

### Player Model Methods

Three new helper methods were added to the Player schema:

#### `hasEquippedSubtype(subtype, itemService)`

Checks if player has any item with the specified subtype equipped.

```javascript
const hasAxe = player.hasEquippedSubtype('woodcutting-axe', itemService);
```

**Parameters**:
- `subtype` (string): The subtype to search for
- `itemService` (ItemService): Required to look up item definitions

**Returns**: `boolean`

#### `hasInventoryItem(itemId, minQuantity)`

Checks if player has an item in inventory with sufficient quantity.

```javascript
const hasBait = player.hasInventoryItem('fishing_bait', 5);
```

**Parameters**:
- `itemId` (string): The item ID to search for
- `minQuantity` (number, default: 1): Minimum quantity required

**Returns**: `boolean`

#### `getInventoryItemQuantity(itemId)`

Gets total quantity of an item across all inventory stacks.

```javascript
const baitCount = player.getInventoryItemQuantity('fishing_bait');
```

**Returns**: `number`

### LocationService Validation

The `meetsActivityRequirements()` method was enhanced to support equipped and inventory checks:

```javascript
meetsActivityRequirements(activity, player) {
  // ... existing skill/attribute checks ...

  // Check equipped requirements
  if (activity.requirements.equipped) {
    for (const { subtype } of activity.requirements.equipped) {
      const hasEquipped = player.hasEquippedSubtype(subtype, itemService);
      if (!hasEquipped) {
        failures.push(`Requires ${subtype} equipped`);
      }
    }
  }

  // Check inventory requirements
  if (activity.requirements.inventory) {
    for (const { itemId, quantity = 1 } of activity.requirements.inventory) {
      const hasItem = player.hasInventoryItem(itemId, quantity);
      if (!hasItem) {
        const itemDef = itemService.getItemDefinition(itemId);
        const itemName = itemDef?.name || itemId;
        failures.push(`Requires ${quantity}x ${itemName} in inventory`);
      }
    }
  }

  return { meets: failures.length === 0, failures };
}
```

## Frontend Implementation

### TypeScript Models

#### Equipment Requirement Interface

```typescript
export interface EquippedRequirement {
  subtype: string;
}
```

#### Inventory Requirement Interface

```typescript
export interface InventoryRequirement {
  itemId: string;
  quantity?: number;
}
```

#### Updated Activity Interface

```typescript
export interface Activity {
  requirements: {
    skills?: { [key: string]: number };
    attributes?: { [key: string]: number };
    items?: string[]; // Deprecated
    equipped?: EquippedRequirement[];
    inventory?: InventoryRequirement[];
  };
}
```

#### Updated Item Definition

```typescript
export interface ItemDefinition {
  subtype?: string; // Item subtype for requirement matching
  // ... other fields
}
```

### UI Display

Requirements are displayed in the activity detail view:

```html
<div class="requirements">
  <h3>Requirements</h3>
  <ul>
    <li *ngFor="let skill of requirements.skills | keyvalue">
      {{ skill.key }} Level {{ skill.value }}
    </li>
    <li *ngFor="let equipped of requirements.equipped">
      {{ equipped.subtype }} equipped
    </li>
    <li *ngFor="let inv of requirements.inventory">
      {{ inv.quantity || 1 }}x {{ inv.itemId }} in inventory
    </li>
  </ul>
</div>
```

## Example Activities

### Woodcutting with Equipment Requirement

```json
{
  "activityId": "activity-chop-oak",
  "name": "Chop Oak Trees",
  "requirements": {
    "skills": {
      "woodcutting": 1
    },
    "equipped": [
      { "subtype": "woodcutting-axe" }
    ]
  }
}
```

### Fishing with Equipment Requirement

```json
{
  "activityId": "activity-fish-shrimp",
  "name": "Fish for Shrimp",
  "requirements": {
    "equipped": [
      { "subtype": "fishing-rod" }
    ]
  }
}
```

### Mining with Equipment Requirement

```json
{
  "activityId": "activity-mine-iron",
  "name": "Mine Iron Ore",
  "requirements": {
    "skills": {
      "mining": 5
    },
    "equipped": [
      { "subtype": "mining-pickaxe" }
    ]
  }
}
```

### Advanced: Multiple Requirements

```json
{
  "activityId": "activity-deep-cave-mining",
  "name": "Deep Cave Mining",
  "requirements": {
    "skills": {
      "mining": 10
    },
    "equipped": [
      { "subtype": "mining-pickaxe" }
    ],
    "inventory": [
      { "itemId": "torch", "quantity": 3 },
      { "itemId": "safety_rope", "quantity": 1 }
    ]
  }
}
```

## Future Enhancements

### Potential Features

1. **Quality Requirements**
   - Require minimum quality levels on equipped items
   - Example: `{ "subtype": "mining-pickaxe", "minQuality": { "purity": 0.7 } }`

2. **Consumable Items**
   - Consume inventory items when starting activity
   - Example: `{ "itemId": "bait", "quantity": 1, "consumed": true }`

3. **Tool Durability**
   - Degrade tool durability during activities
   - Require repairs when durability is low

4. **Multi-Tool Requirements**
   - Require multiple different tools equipped
   - Example: Require both pickaxe AND torch equipped

5. **Conditional Requirements**
   - Different requirements based on player level or other factors
   - Example: Beginners don't need tools, advanced players do

## Files Modified

### Backend
- `be/data/items/definitions/equipment.json` - Added subtypes and new tool items
- `be/models/Player.js` - Added helper methods for requirement checking
- `be/services/locationService.js` - Enhanced activity requirement validation

### Frontend
- `ui/src/app/models/location.model.ts` - Added requirement interfaces
- `ui/src/app/models/inventory.model.ts` - Added subtype field to ItemDefinition
- `ui/src/app/components/game/location/location.html` - Display equipped/inventory requirements

### Data
- `be/data/locations/activities/chop-oak.json` - Added woodcutting-axe requirement
- `be/data/locations/activities/fish-shrimp.json` - Added fishing-rod requirement
- `be/data/locations/activities/mine-iron.json` - Added mining-pickaxe requirement

## Testing the System

### Manual Testing Steps

1. **Start without tools**:
   - Try to start woodcutting activity
   - Verify error: "Requires woodcutting-axe equipped"

2. **Equip a tool**:
   - Add bronze_woodcutting_axe to inventory
   - Equip it in mainHand slot
   - Start woodcutting activity
   - Should succeed

3. **Test tier progression**:
   - Unequip bronze axe
   - Equip iron_woodcutting_axe instead
   - Verify activity still accepts it (same subtype)

4. **Test offhand tools**:
   - Equip rare_iron_mining_pickaxe_offhand in offHand
   - Try mining activity
   - Should succeed (pickaxe is equipped, slot doesn't matter)

5. **Test inventory requirements** (when implemented):
   - Create activity requiring torches
   - Verify without torches: error message
   - Add torches to inventory
   - Verify activity starts successfully

## Best Practices

1. **Use subtypes for tool categories**: Don't require specific itemIds, use subtypes for flexibility
2. **Provide progression tiers**: Create bronze, iron, steel versions with same subtype
3. **Clear naming**: Use descriptive subtype names (woodcutting-axe, not axe1)
4. **Slot flexibility**: Consider rare offhand variants for interesting gameplay
5. **User-friendly errors**: Ensure error messages clearly state what's missing
6. **Document requirements**: Add requirement info to activity descriptions

## Troubleshooting

### Activity won't start despite having tool

**Check**:
1. Is the tool actually equipped? (Look for purple border in inventory)
2. Does the tool have the correct `subtype` field?
3. Is the ItemService properly loaded? (Check server logs)

### Equipment validation not working

**Check**:
1. Verify Player.hasEquippedSubtype() receives itemService parameter
2. Check that item definition includes `subtype` field
3. Ensure locationService properly imports itemService

### Requirements not displaying in UI

**Check**:
1. Verify TypeScript models include `equipped` and `inventory` arrays
2. Check location.html template includes ngFor loops for new requirements
3. Ensure backend sends `equipped`/`inventory` in activity JSON
