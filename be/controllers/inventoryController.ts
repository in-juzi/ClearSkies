import { Request, Response } from 'express';
import Player from '../models/Player';
import itemService from '../services/itemService';
import equipmentService from '../services/equipmentService';
import playerInventoryService from '../services/playerInventoryService';
import { QualityMap, TraitMap, ItemCategory, ConsumableItem, isWeaponItem, isArmorItem } from '@shared/types';
import effectEvaluator from '../services/effectEvaluator';
import { EffectContext } from '@shared/types/effect-system';
import { convertMapsToObjects, convertItemForClient } from '@shared/utils/mongoose-helpers';

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
// Helper Functions (now imported from shared utilities)
// ============================================================================

/**
 * Calculate equipment stats with quality/trait effects
 * TODO: Phase 2 - Migrate this complex logic to equipmentService
 * For now, basic stat aggregation is available via equipmentService.calculateEquipmentStats()
 */
function calculateEquipmentStats(player: any, equippedItems: Record<string, any>) {
  const stats = {
    // Offensive stats
    totalDamage: [] as string[],
    averageAttackSpeed: 0,
    totalCritChance: 0,
    weaponCount: 0,
    // Defensive stats
    totalArmor: 0,
    totalEvasion: 0,
    totalBlockChance: 0,
    armorCount: 0,
    // Other stats
    totalWeight: 0,
    requiredLevel: 0,
    itemCount: 0
  };

  // Iterate through equipped items
  for (const item of Object.values(equippedItems)) {
    const itemDef = itemService.getItemDefinition(item.itemId);
    if (!itemDef) continue;

    const props = itemDef.properties;
    stats.itemCount++;

    // Accumulate weight
    stats.totalWeight += props.weight || 0;

    // Track highest required level
    stats.requiredLevel = Math.max(stats.requiredLevel, props['requiredLevel'] || 0);

    // Weapon stats
    if (isWeaponItem(itemDef)) {
      if (props.damageRoll) {
        // Get damage bonus from traits/qualities for this specific item
        const damageBonus = effectEvaluator.evaluateSingleItemEffects(
          item,
          EffectContext.COMBAT_DAMAGE
        );

        // Format damage as "2d6" or "2d6 +4" if there's a bonus
        let damageDisplay = props.damageRoll;
        if (damageBonus.flatBonus > 0) {
          damageDisplay += `+${damageBonus.flatBonus}`;
        }

        stats.totalDamage.push(damageDisplay);
        stats.weaponCount++;
      }
      if (props.attackSpeed) {
        stats.averageAttackSpeed += props.attackSpeed;
      }
      if (props.critChance) {
        stats.totalCritChance += props.critChance;
      }
    }

    // Armor stats - accumulate base values
    if (isArmorItem(itemDef)) {
      if (props.armor) {
        stats.totalArmor += props.armor;
        stats.armorCount++;
      }
      if (props.evasion) {
        stats.totalEvasion += props.evasion;
      }
      if (props.blockChance) {
        stats.totalBlockChance += props.blockChance;
      }
    }
  }

  // Apply effect bonuses to accumulated base stats
  const armorBonus = effectEvaluator.getCombatStatBonus(player, 'armor');
  stats.totalArmor = effectEvaluator.calculateFinalValue(stats.totalArmor, {
    flatBonus: armorBonus.flat,
    percentageBonus: armorBonus.percentage,
    multiplier: armorBonus.multiplier,
    appliedEffects: [],
    skippedEffects: []
  });

  // Apply effect bonuses to evasion
  const evasionBonus = effectEvaluator.getCombatStatBonus(player, 'evasion');
  stats.totalEvasion = effectEvaluator.calculateFinalValue(stats.totalEvasion, {
    flatBonus: evasionBonus.flat,
    percentageBonus: evasionBonus.percentage,
    multiplier: evasionBonus.multiplier,
    appliedEffects: [],
    skippedEffects: []
  });

  // Apply effect bonuses to crit chance
  const critBonus = effectEvaluator.getCombatStatBonus(player, 'critChance');
  stats.totalCritChance = effectEvaluator.calculateFinalValue(stats.totalCritChance, {
    flatBonus: critBonus.flat,
    percentageBonus: critBonus.percentage,
    multiplier: critBonus.multiplier,
    appliedEffects: [],
    skippedEffects: []
  });

  // Apply effect bonuses to attack speed and calculate average
  if (stats.weaponCount > 0) {
    const baseAvgSpeed = stats.averageAttackSpeed / stats.weaponCount;
    const attackSpeedBonus = effectEvaluator.getCombatStatBonus(player, 'attackSpeed');
    stats.averageAttackSpeed = effectEvaluator.calculateFinalValue(baseAvgSpeed, {
      flatBonus: attackSpeedBonus.flat,
      percentageBonus: attackSpeedBonus.percentage,
      multiplier: attackSpeedBonus.multiplier,
      appliedEffects: [],
      skippedEffects: []
    });
  } else {
    // No weapons equipped - calculate unarmed stats
    const damageBonus = effectEvaluator.getCombatStatBonus(player, 'damage');
    const unarmedDamage = effectEvaluator.calculateFinalValue(1, {
      flatBonus: damageBonus.flat,
      percentageBonus: damageBonus.percentage,
      multiplier: damageBonus.multiplier,
      appliedEffects: [],
      skippedEffects: []
    });

    // Format as fixed damage (not a roll)
    stats.totalDamage.push(`${Math.floor(unarmedDamage)} (Unarmed)`);

    // Unarmed attack speed: 3.0 seconds base (same as combatService.ts:764)
    const attackSpeedBonus = effectEvaluator.getCombatStatBonus(player, 'attackSpeed');
    stats.averageAttackSpeed = effectEvaluator.calculateFinalValue(3.0, {
      flatBonus: attackSpeedBonus.flat,
      percentageBonus: attackSpeedBonus.percentage,
      multiplier: attackSpeedBonus.multiplier,
      appliedEffects: [],
      skippedEffects: []
    });
  }

  return stats;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * Get player's inventory with minimal instance data
 * Frontend enriches with definitions from ItemDataService (no duplication needed)
 */
export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Return minimal instance data only - frontend will enrich with definitions
    const minimalInventory = player.inventory.map(item => {
      const plainItem = convertMapsToObjects(item);
      return {
        instanceId: plainItem.instanceId,
        itemId: plainItem.itemId,
        quantity: plainItem.quantity,
        qualities: plainItem.qualities,
        traits: plainItem.traits,
        equipped: plainItem.equipped || false,
        acquiredAt: plainItem.acquiredAt
      };
    });

    res.json({
      inventory: minimalInventory,
      carryingCapacity: player.carryingCapacity, // in kg
      currentWeight: player.currentWeight, // in kg
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
    playerInventoryService.addItem(player, itemInstance);
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
    playerInventoryService.addItem(player, itemInstance);
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
    const removedItem = playerInventoryService.removeItem(player, instanceId, quantity || null);
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

    const item = playerInventoryService.getItem(player, instanceId);
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

    const item = playerInventoryService.getItem(player, instanceId);
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
      // Get base armor stats
      let armor = itemDef.properties.armor || 0;
      let evasion = itemDef.properties.evasion || 0;

      // Get armor trait effects (only from THIS item)
      const armorEffects = effectEvaluator.evaluateSingleItemEffects(
        item,
        EffectContext.COMBAT_ARMOR
      );

      armor += armorEffects.flatBonus;
      if (armorEffects.percentageBonus !== 0) {
        armor = Math.floor(armor * (1 + armorEffects.percentageBonus));
      }
      if (armorEffects.multiplier !== 1.0) {
        armor = Math.floor(armor * armorEffects.multiplier);
      }

      // Get evasion trait effects (only from THIS item)
      const evasionEffects = effectEvaluator.evaluateSingleItemEffects(
        item,
        EffectContext.COMBAT_EVASION
      );

      evasion += evasionEffects.flatBonus;
      if (evasionEffects.percentageBonus !== 0) {
        evasion = Math.floor(evasion * (1 + evasionEffects.percentageBonus));
      }
      if (evasionEffects.multiplier !== 1.0) {
        evasion = Math.floor(evasion * evasionEffects.multiplier);
      }

      res.json({
        success: true,
        stats: {
          armor,
          evasion,
          blockChance: itemDef.properties.blockChance || 0,
          requiredLevel: itemDef.properties.requiredLevel || 1,
          // Include trait bonus details
          armorTraitBonus: armorEffects.flatBonus,
          evasionTraitBonus: evasionEffects.flatBonus
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

    // Get trait bonuses for damage (only from THIS item)
    const damageEffects = effectEvaluator.evaluateSingleItemEffects(
      item,
      EffectContext.COMBAT_DAMAGE
    );

    const traitDamageBonus = damageEffects.flatBonus;

    // Add skill/attribute bonus + trait bonus
    const totalBonus = totalLevelBonus + traitDamageBonus;

    const minScaledDamage = Math.max(1, minBaseDamage + totalBonus);
    const maxScaledDamage = maxBaseDamage + totalBonus;
    const avgScaledDamage = avgBaseDamage + totalBonus;

    // Get crit chance (base + trait bonuses from THIS item only)
    let critChance = itemDef.properties.critChance || 0.05;

    const critEffects = effectEvaluator.evaluateSingleItemEffects(
      item,
      EffectContext.COMBAT_CRIT_CHANCE
    );

    critChance += critEffects.flatBonus;
    if (critEffects.percentageBonus !== 0) {
      critChance = critChance * (1 + critEffects.percentageBonus);
    }

    // Get attack speed (base + trait bonuses from THIS item only)
    let attackSpeed = itemDef.properties.attackSpeed || 3.0;

    const attackSpeedEffects = effectEvaluator.evaluateSingleItemEffects(
      item,
      EffectContext.COMBAT_ATTACK_SPEED
    );

    attackSpeed += attackSpeedEffects.flatBonus;
    if (attackSpeedEffects.percentageBonus !== 0) {
      attackSpeed = attackSpeed * (1 + attackSpeedEffects.percentageBonus);
    }

    // Format scaled damage roll notation (e.g., "1d6+3")
    const scaledDamageRoll = totalBonus > 0
      ? `${damageRoll}+${totalBonus}`
      : totalBonus < 0
        ? `${damageRoll}${totalBonus}`
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
        attackSpeed: attackSpeed,
        critChance: critChance,

        // Level breakdown
        skillLevel,
        skillBonus,
        attrLevel,
        attrBonus,
        totalLevelBonus,
        skillScalar,

        // Trait bonuses
        traitDamageBonus,
        traitCritBonus: critEffects.flatBonus,
        traitAttackSpeedBonus: attackSpeedEffects.flatBonus
      }
    });
  } catch (error) {
    console.error('Error calculating combat stats:', error);
    res.status(500).json({ message: 'Server error calculating combat stats', error: (error as Error).message });
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
    const result = await playerInventoryService.equipItem(player, instanceId, slotName);

    // Invalidate effect cache since equipment changed
    effectEvaluator.invalidateCache(player._id.toString());

    // Trigger quest system for equipment check (for FullyEquipped quest)
    try {
      const questService = require('../services/questService').default;
      await questService.onItemEquipped(player);
    } catch (error) {
      console.error('Error updating quest progress on item equipped:', error);
    }

    // Get enhanced item details
    const plainItem = convertMapsToObjects(result.item);
    const itemDetails = itemService.getItemDetails(plainItem);

    res.json({
      message: 'Item equipped successfully',
      slot: result.slot,
      item: itemDetails,
      equippedItems: playerInventoryService.getEquippedItems(player)
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
    const result = await playerInventoryService.unequipItem(player, slotName);

    // Invalidate effect cache since equipment changed
    effectEvaluator.invalidateCache(player._id.toString());

    // Trigger quest system for equipment check (for FullyEquipped quest)
    try {
      const questService = require('../services/questService').default;
      await questService.onItemEquipped(player);
    } catch (error) {
      console.error('Error updating quest progress on item unequipped:', error);
    }

    // Get enhanced item details
    const itemDetails = result.item ? itemService.getItemDetails(convertMapsToObjects(result.item)) : null;

    res.json({
      message: 'Item unequipped successfully',
      slot: result.slot,
      item: itemDetails,
      equippedItems: playerInventoryService.getEquippedItems(player)
    });
  } catch (error) {
    console.error('Unequip item error:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

/**
 * Get all equipped items with calculated stats
 */
export const getEquippedItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const equippedItems = playerInventoryService.getEquippedItems(player);

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

    // Calculate equipment stats with quality/trait effects
    const stats = calculateEquipmentStats(player, equippedItems);

    res.json({
      equippedItems: enhancedEquipped,
      slots: allSlots,
      stats
    });
  } catch (error) {
    console.error('Get equipped items error:', error);
    res.status(500).json({ message: 'Error fetching equipped items', error: (error as Error).message });
  }
};

/**
 * Get equipment summary stats with quality/trait effects applied
 * (Standalone endpoint - getEquippedItems also returns stats)
 */
export const getEquipmentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const equippedItems = playerInventoryService.getEquippedItems(player);
    const stats = calculateEquipmentStats(player, equippedItems);

    res.json(stats);
  } catch (error) {
    console.error('Get equipment stats error:', error);
    res.status(500).json({ message: 'Error calculating equipment stats', error: (error as Error).message });
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
    playerInventoryService.removeItem(player, instanceId, 1);

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
