# Equipment System

## Overview

The equipment system allows players to equip items to specific body slots, affecting their character's stats and appearance. The system is designed to be extensible, making it easy to add new equipment slots in the future.

## Architecture

### Equipment Slots

Players have 10 default equipment slots stored as a `Map<string, string|null>`:

- **head** - Helmets, coifs, hats
- **body** - Armor, tunics, robes
- **mainHand** - Primary weapons
- **offHand** - Shields, secondary weapons
- **belt** - Belts, sashes
- **gloves** - Gauntlets, gloves
- **boots** - Boots, greaves
- **necklace** - Necklaces, amulets
- **ringRight** - Right hand ring
- **ringLeft** - Left hand ring

Each slot stores either:
- `null` (empty slot)
- `instanceId` (reference to equipped item in inventory)

### Item Definitions

Equipment items must include a `slot` field indicating which slot they can be equipped to:

```json
{
  "iron_helm": {
    "itemId": "iron_helm",
    "name": "Iron Helm",
    "category": "equipment",
    "equipmentType": "armor",
    "slot": "head",
    "properties": {
      "defense": 5,
      "durability": 120
    }
  }
}
```

**Current Equipment Items:**
- `copper_sword` - mainHand weapon (tier 1)
- `iron_sword` - mainHand weapon (tier 2)
- `wooden_shield` - offHand shield (tier 1)
- `iron_helm` - head armor (tier 2)
- `hemp_coif` - head armor (tier 1)
- `leather_tunic` - body armor (tier 1)

## Database Schema

### Player Model Fields

```javascript
equipmentSlots: {
  type: Map,
  of: String,
  default: () => new Map([
    ['head', null],
    ['body', null],
    ['mainHand', null],
    ['offHand', null],
    ['belt', null],
    ['gloves', null],
    ['boots', null],
    ['necklace', null],
    ['ringRight', null],
    ['ringLeft', null]
  ])
}
```

### Player Methods

**equipItem(instanceId, slotName)**
- Equips an item to the specified slot
- Validates item exists in inventory
- Validates item can be equipped to that slot
- Auto-unequips current item if slot is occupied
- Marks item as `equipped = true`
- Returns: `{ slot, item }`

**unequipItem(slotName)**
- Unequips item from the specified slot
- Marks item as `equipped = false`
- Sets slot to `null`
- Returns: `{ slot, item }`

**getEquippedItems()**
- Returns object with all equipped items
- Format: `{ slotName: itemInstance, ... }`

**isSlotAvailable(slotName)**
- Checks if a slot is empty
- Returns: `boolean`

**addEquipmentSlot(slotName)**
- Adds a new equipment slot dynamically
- For future extensibility (e.g., adding `earrings` slot)
- Returns: `slotName`

## API Endpoints

### GET /api/inventory/equipment
Get all equipped items and available slots.

**Response:**
```json
{
  "equippedItems": {
    "head": { /* enhanced item details */ },
    "mainHand": { /* enhanced item details */ }
  },
  "slots": {
    "head": "inst_abc123",
    "body": null,
    "mainHand": "inst_def456",
    ...
  }
}
```

### POST /api/inventory/equipment/equip
Equip an item to a slot.

**Request Body:**
```json
{
  "instanceId": "inst_abc123",
  "slotName": "head"
}
```

**Response:**
```json
{
  "message": "Item equipped successfully",
  "slot": "head",
  "item": { /* enhanced item details */ },
  "equippedItems": { /* all equipped items */ }
}
```

**Errors:**
- `400` - Missing instanceId or slotName
- `404` - Player not found
- `400` - Item not found in inventory
- `400` - Item cannot be equipped to that slot
- `400` - Invalid equipment slot

### POST /api/inventory/equipment/unequip
Unequip an item from a slot.

**Request Body:**
```json
{
  "slotName": "head"
}
```

**Response:**
```json
{
  "message": "Item unequipped successfully",
  "slot": "head",
  "item": { /* enhanced item details */ },
  "equippedItems": { /* all equipped items */ }
}
```

**Errors:**
- `400` - Missing slotName
- `404` - Player not found
- `400` - No item equipped in slot
- `400` - Invalid equipment slot

## Validation

The system validates:
1. Item exists in player's inventory
2. Item has `category: "equipment"`
3. Item has a `slot` field defined
4. Item's `slot` matches the target slot
5. Slot exists in player's `equipmentSlots`

## Auto-Unequip Behavior

When equipping an item to an occupied slot:
1. Current item is automatically unequipped
2. Current item is marked as `equipped = false`
3. New item is equipped
4. New item is marked as `equipped = true`

This prevents players from having to manually unequip before equipping a new item.

## Extensibility

### Adding New Slots

To add a new equipment slot (e.g., "earrings"):

1. **Update Default Slots** in [Player.js](../../be/models/Player.js:63-74):
```javascript
equipmentSlots: {
  type: Map,
  of: String,
  default: () => new Map([
    // ... existing slots
    ['earrings', null]  // Add new slot
  ])
}
```

2. **Create Migration** to add slot to existing players:
```javascript
async function up() {
  const Player = mongoose.model('Player');
  const players = await Player.find({});
  for (const player of players) {
    player.equipmentSlots.set('earrings', null);
    await player.save();
  }
}
```

3. **Add Items** with the new slot:
```json
{
  "silver_earrings": {
    "slot": "earrings",
    "category": "equipment",
    "equipmentType": "jewelry"
  }
}
```

### Dynamic Slot Addition

For conditional slots (e.g., quest rewards, special abilities), use the `addEquipmentSlot()` method:

```javascript
await player.addEquipmentSlot('trophySlot');
```

This allows adding slots on a per-player basis without affecting all players.

## Migration

Migration `004-add-equipment-slots.js` adds the equipment slot system to all existing players.

**Run migration:**
```bash
cd be
npm run migrate
```

**Rollback migration:**
```bash
cd be
npm run migrate:down
```

## Future Enhancements

- **Equipment Sets** - Bonus stats when wearing matching items
- **Stat Calculations** - Sum defense/damage from all equipped items
- **Equipment Durability** - Items degrade with use
- **Visual Paper Doll** - UI showing equipped items on character
- **Two-Handed Weapons** - Occupy both mainHand and offHand slots
- **Restricted Slots** - Class-based or quest-based slot unlocking
- **Transmog System** - Change appearance while keeping stats
