import { Request, Response } from 'express';
import Player from '../models/Player';
import itemService from '../services/itemService';
import { QualityMap, TraitMap, ItemCategory, ConsumableItem } from '@shared/types';
import { isWeaponItem, isArmorItem } from '../types/guards';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface AddItemRequest {
  itemId: string;
  quantity?: number;
  qualities?: QualityMap;
  traits?: TraitMap;
}

interface AddRandomItemRequest {
  itemId: string;
  quantity?: number;
}

interface RemoveItemRequest {
  instanceId: string;
  quantity?: number;
}

interface EquipItemRequest {
  instanceId: string;
  slotName: string;
}

interface UnequipItemRequest {
  slotName: string;
}

interface UseItemRequest {
  instanceId: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert Mongoose Maps to plain objects for JSON serialization
 */
function convertMapsToObjects(item: any): any {
  const plainItem = item.toObject ? item.toObject() : item;
  if (plainItem.qualities instanceof Map) {
    plainItem.qualities = Object.fromEntries(plainItem.qualities);
  }
  if (plainItem.traits instanceof Map) {
    plainItem.traits = Object.fromEntries(plainItem.traits);
  }
  return plainItem;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * Get player's inventory with full item details
 */
export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Enhance inventory with item details
    const enhancedInventory = player.inventory.map(item => {
      const plainItem = convertMapsToObjects(item);
      const details = itemService.getItemDetails(plainItem);
      return details;
    });

    res.json({
      inventory: enhancedInventory,
      capacity: player.inventoryCapacity, // DEPRECATED: use carryingCapacity instead
      carryingCapacity: player.carryingCapacity, // in kg
      currentWeight: player.currentWeight, // in kg
      size: player.getInventorySize(), // DEPRECATED: item count no longer used for capacity
      totalValue: player.getInventoryValue()
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Error fetching inventory', error: (error as Error).message });
  }
};

/**
 * Add item to player's inventory
 * Body: { itemId, quantity, qualities, traits }
 */
export const addItem = async (req: Request<{}, {}, AddItemRequest>, res: Response): Promise<void> => {
  try {
    const { itemId, quantity = 1, qualities = {}, traits = {} } = req.body;

    if (!itemId) {
      res.status(400).json({ message: 'itemId is required' });
      return;
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Create item instance
    const itemInstance = itemService.createItemInstance(itemId, quantity, qualities, traits);

    // Add to player inventory
    player.addItem(itemInstance);
    await player.save();

    // Get enhanced item details
    const details = itemService.getItemDetails(itemInstance);

    res.status(201).json({
      message: 'Item added to inventory',
      item: details,
      inventorySize: player.getInventorySize()
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ message: 'Error adding item', error: (error as Error).message });
  }
};

/**
 * Add item with random qualities/traits
 * Body: { itemId, quantity }
 */
export const addRandomItem = async (req: Request<{}, {}, AddRandomItemRequest>, res: Response): Promise<void> => {
  try {
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      res.status(400).json({ message: 'itemId is required' });
      return;
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Generate random qualities and traits
    const qualities = itemService.generateRandomQualities(itemId);
    const traits = itemService.generateRandomTraits(itemId);

    // Create item instance
    const itemInstance = itemService.createItemInstance(itemId, quantity, qualities, traits);

    // Add to player inventory
    player.addItem(itemInstance);
    await player.save();

    // Get enhanced item details
    const details = itemService.getItemDetails(itemInstance);

    res.status(201).json({
      message: 'Item added to inventory',
      item: details,
      inventorySize: player.getInventorySize()
    });
  } catch (error) {
    console.error('Add random item error:', error);
    res.status(500).json({ message: 'Error adding item', error: (error as Error).message });
  }
};

/**
 * Remove item from inventory
 * Body: { instanceId, quantity }
 */
export const removeItem = async (req: Request<{}, {}, RemoveItemRequest>, res: Response): Promise<void> => {
  try {
    const { instanceId, quantity } = req.body;

    if (!instanceId) {
      res.status(400).json({ message: 'instanceId is required' });
      return;
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Remove item
    const removedItem = player.removeItem(instanceId, quantity || null);
    await player.save();

    res.json({
      message: 'Item removed from inventory',
      item: removedItem,
      inventorySize: player.getInventorySize()
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ message: 'Error removing item', error: (error as Error).message });
  }
};

/**
 * Get single item details
 */
export const getItem = async (req: Request<{ instanceId: string }>, res: Response): Promise<void> => {
  try {
    const { instanceId } = req.params;

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const item = player.getItem(instanceId);
    if (!item) {
      res.status(404).json({ message: 'Item not found in inventory' });
      return;
    }

    const plainItem = convertMapsToObjects(item);
    const details = itemService.getItemDetails(plainItem);

    res.json(details);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Error fetching item', error: (error as Error).message });
  }
};

/**
 * Get scaled combat stats for a weapon
 * Calculates actual combat stats based on player's current levels
 */
export const getItemCombatStats = async (req: Request<{ instanceId: string }>, res: Response): Promise<void> => {
  try {
    const { instanceId } = req.params;

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const item = player.getItem(instanceId);
    if (!item) {
      res.status(404).json({ message: 'Item not found in inventory' });
      return;
    }

    const itemDef = itemService.getItemDefinition(item.itemId);
    if (!itemDef) {
      res.status(404).json({ message: 'Item definition not found' });
      return;
    }

    // Handle armor items
    if (isArmorItem(itemDef)) {
      res.json({
        success: true,
        stats: {
          armor: itemDef.properties.armor || 0,
          evasion: itemDef.properties.evasion || 0,
          blockChance: itemDef.properties.blockChance || 0,
          requiredLevel: itemDef.properties.requiredLevel || 1
        }
      });
      return;
    }

    // Only calculate for weapons
    if (!isWeaponItem(itemDef)) {
      res.status(400).json({ message: 'Item is not a weapon or armor' });
      return;
    }

    // Get the weapon stats
    const skillScalar = itemDef.properties.skillScalar;
    const skill = (player.skills as any)[skillScalar];
    const skillLevel = skill ? skill.level : 1;

    const mainAttr = skill ? skill.mainAttribute : 'strength';
    const attribute = (player.attributes as any)[mainAttr];
    const attrLevel = attribute ? attribute.level : 1;

    // Calculate level bonuses (same as combat service)
    const skillBonus = Math.min(2, Math.floor(skillLevel / 10));
    const attrBonus = Math.min(2, Math.floor(attrLevel / 10));
    const totalLevelBonus = skillBonus + attrBonus;

    // Parse damage roll to get min/max
    const damageRoll = itemDef.properties.damageRoll;
    const match = damageRoll.match(/^(\d+)d(\d+)([+-]\d+)?$/);

    if (!match) {
      res.status(400).json({ message: 'Invalid damage roll format' });
      return;
    }

    const numDice = parseInt(match[1]);
    const numFaces = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    // Calculate damage ranges
    const minBaseDamage = numDice + modifier;
    const maxBaseDamage = (numDice * numFaces) + modifier;
    const avgBaseDamage = (numDice * (numFaces + 1) / 2) + modifier;

    const minScaledDamage = Math.max(1, minBaseDamage + totalLevelBonus);
    const maxScaledDamage = maxBaseDamage + totalLevelBonus;
    const avgScaledDamage = avgBaseDamage + totalLevelBonus;

    // Get crit chance (base + passive bonuses)
    let critChance = itemDef.properties.critChance || 0.05;
    // TODO: Add passive abilities support when implemented
    // if (player.passiveAbilities) {
    //   for (const ability of player.passiveAbilities) {
    //     if (ability.effects && ability.effects.critChanceBonus) {
    //       critChance += ability.effects.critChanceBonus;
    //     }
    //   }
    // }

    // Format scaled damage roll notation (e.g., "1d6+3")
    const scaledDamageRoll = totalLevelBonus > 0
      ? `${damageRoll}+${totalLevelBonus}`
      : totalLevelBonus < 0
        ? `${damageRoll}${totalLevelBonus}`
        : damageRoll;

    res.json({
      success: true,
      stats: {
        // Base stats
        baseDamageRoll: damageRoll,
        baseDamageRange: `${minBaseDamage}-${maxBaseDamage}`,
        avgBaseDamage: avgBaseDamage.toFixed(1),

        // Scaled stats
        scaledDamageRoll: scaledDamageRoll,
        scaledDamageRange: `${minScaledDamage}-${maxScaledDamage}`,
        avgScaledDamage: avgScaledDamage.toFixed(1),

        // Other combat stats
        attackSpeed: itemDef.properties.attackSpeed || 3.0,
        critChance: critChance,

        // Level breakdown
        skillLevel,
        skillBonus,
        attrLevel,
        attrBonus,
        totalLevelBonus,
        skillScalar
      }
    });
  } catch (error) {
    console.error('Error calculating combat stats:', error);
    res.status(500).json({ message: 'Server error calculating combat stats', error: (error as Error).message });
  }
};

/**
 * Get all available item definitions
 * @deprecated Frontend now uses ItemDataService with direct backend registry import
 * This endpoint is no longer used and can be removed in a future version
 */
export const getItemDefinitions = async (req: Request<{}, {}, {}, { category?: ItemCategory }>, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    let items;
    if (category) {
      items = itemService.getItemsByCategory(category);
    } else {
      items = itemService.getAllItemDefinitions();
    }

    res.json({ items });
  } catch (error) {
    console.error('Get item definitions error:', error);
    res.status(500).json({ message: 'Error fetching item definitions', error: (error as Error).message });
  }
};

/**
 * Get single item definition
 * @deprecated Frontend now uses ItemDataService with direct backend registry import
 * This endpoint is no longer used and can be removed in a future version
 */
export const getItemDefinition = async (req: Request<{ itemId: string }>, res: Response): Promise<void> => {
  try {
    const { itemId } = req.params;

    const item = itemService.getItemDefinition(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item definition not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    console.error('Get item definition error:', error);
    res.status(500).json({ message: 'Error fetching item definition', error: (error as Error).message });
  }
};

/**
 * Reload item definitions (admin function)
 */
export const reloadDefinitions = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await itemService.reloadDefinitions();

    res.json({
      message: 'Item definitions reloaded successfully',
      ...result
    });
  } catch (error) {
    console.error('Reload definitions error:', error);
    res.status(500).json({ message: 'Error reloading definitions', error: (error as Error).message });
  }
};

/**
 * Equip an item to a slot
 * Body: { instanceId, slotName }
 */
export const equipItem = async (req: Request<{}, {}, EquipItemRequest>, res: Response): Promise<void> => {
  try {
    const { instanceId, slotName } = req.body;

    if (!instanceId || !slotName) {
      res.status(400).json({ message: 'instanceId and slotName are required' });
      return;
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Equip the item
    const result = await player.equipItem(instanceId, slotName);

    // Get enhanced item details
    const plainItem = convertMapsToObjects(result.item);
    const itemDetails = itemService.getItemDetails(plainItem);

    res.json({
      message: 'Item equipped successfully',
      slot: result.slot,
      item: itemDetails,
      equippedItems: player.getEquippedItems()
    });
  } catch (error) {
    console.error('Equip item error:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

/**
 * Unequip an item from a slot
 * Body: { slotName }
 */
export const unequipItem = async (req: Request<{}, {}, UnequipItemRequest>, res: Response): Promise<void> => {
  try {
    const { slotName } = req.body;

    if (!slotName) {
      res.status(400).json({ message: 'slotName is required' });
      return;
    }

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Unequip the item
    const result = await player.unequipItem(slotName);

    // Get enhanced item details
    const itemDetails = result.item ? itemService.getItemDetails(convertMapsToObjects(result.item)) : null;

    res.json({
      message: 'Item unequipped successfully',
      slot: result.slot,
      item: itemDetails,
      equippedItems: player.getEquippedItems()
    });
  } catch (error) {
    console.error('Unequip item error:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

/**
 * Get all equipped items
 */
export const getEquippedItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const equippedItems = player.getEquippedItems();

    // Enhance equipped items with details
    const enhancedEquipped: Record<string, any> = {};
    for (const [slot, item] of Object.entries(equippedItems)) {
      enhancedEquipped[slot] = itemService.getItemDetails(convertMapsToObjects(item));
    }

    // Get all available slots
    const allSlots: Record<string, string | null> = {};
    for (const [slot, instanceId] of player.equipmentSlots.entries()) {
      allSlots[slot] = instanceId;
    }

    res.json({
      equippedItems: enhancedEquipped,
      slots: allSlots
    });
  } catch (error) {
    console.error('Get equipped items error:', error);
    res.status(500).json({ message: 'Error fetching equipped items', error: (error as Error).message });
  }
};

/**
 * Use a consumable item
 */
export const useItem = async (req: Request<{}, {}, UseItemRequest>, res: Response): Promise<void> => {
  try {
    const { instanceId } = req.body;

    if (!instanceId) {
      res.status(400).json({ message: 'Instance ID is required' });
      return;
    }

    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Find the item in inventory
    const itemInstance = player.inventory.find(item => item.instanceId === instanceId);

    if (!itemInstance) {
      res.status(404).json({ message: 'Item not found in inventory' });
      return;
    }

    // Get item definition
    const itemDefinition = itemService.getItemDefinition(itemInstance.itemId);

    if (!itemDefinition) {
      res.status(404).json({ message: 'Item definition not found' });
      return;
    }

    // Verify item is consumable
    if (itemDefinition.category !== 'consumable') {
      res.status(400).json({ message: 'Item is not consumable' });
      return;
    }

    // Check if player is at full health and mana (don't waste items)
    const isHealthFull = player.stats.health.current >= player.maxHP;
    const isManaFull = player.stats.mana.current >= player.maxMP;
    const consumableItem = itemDefinition as ConsumableItem;
    const restoresHealth = (consumableItem.properties?.healthRestore || 0) > 0;
    const restoresMana = (consumableItem.properties?.manaRestore || 0) > 0;

    if (restoresHealth && !restoresMana && isHealthFull) {
      res.status(400).json({ message: 'Health is already full' });
      return;
    }

    if (restoresMana && !restoresHealth && isManaFull) {
      res.status(400).json({ message: 'Mana is already full' });
      return;
    }

    if (restoresHealth && restoresMana && isHealthFull && isManaFull) {
      res.status(400).json({ message: 'Health and mana are already full' });
      return;
    }

    // Use the item and apply effects
    // Out-of-combat potions convert HoT to instant healing
    const combatService = require('../services/combatService').default;
    const effects = combatService.useConsumableOutOfCombat(player, itemInstance, itemService);

    // Remove one instance of the item from inventory
    player.removeItem(instanceId, 1);

    await player.save();

    // Get updated combat state if in combat
    let combat = null;
    if (player.isInCombat()) {
      const activeCombat = player.activeCombat!;
      combat = {
        ...convertMapsToObjects(activeCombat),
        playerHealth: {
          current: player.stats.health.current,
          max: player.maxHP
        },
        playerMana: {
          current: player.stats.mana.current,
          max: player.maxMP
        },
        combatLog: activeCombat.combatLog.map(entry => convertMapsToObjects(entry))
      };
    }

    // Build informative message
    let message = 'Item used successfully';
    if (effects.convertedFromHoT > 0) {
      message = `${itemDefinition.name} restored ${effects.healthRestored} HP (${effects.convertedFromHoT} from regeneration)`;
    } else if (effects.healthRestored > 0) {
      message = `${itemDefinition.name} restored ${effects.healthRestored} HP`;
    }

    res.json({
      message,
      effects,
      health: {
        current: player.stats.health.current,
        max: player.maxHP
      },
      mana: {
        current: player.stats.mana.current,
        max: player.maxMP
      },
      combat,
      itemUsed: {
        itemId: itemDefinition.itemId,
        name: itemDefinition.name
      }
    });
  } catch (error) {
    console.error('Use item error:', error);
    res.status(500).json({ message: 'Error using item', error: (error as Error).message });
  }
};
