/**
 * Type guard utility functions
 *
 * These functions help narrow types at runtime while providing
 * compile-time type safety.
 */

import {
  Item,
  EquipmentItem,
  WeaponItem,
  ArmorItem,
  ToolItem,
  ConsumableItem,
  ResourceItem
} from './items';

import {
  Activity,
  GatheringActivity,
  CombatActivity
} from './locations';

// ===== ITEM TYPE GUARDS =====

/**
 * Check if item is equipment
 */
export function isEquipmentItem(item: Item): item is EquipmentItem {
  return item.category === 'equipment';
}

/**
 * Check if item is a weapon
 */
export function isWeaponItem(item: Item): item is WeaponItem {
  return (
    isEquipmentItem(item) &&
    item.subcategories?.includes('weapon') === true
  );
}

/**
 * Check if item is armor
 */
export function isArmorItem(item: Item): item is ArmorItem {
  return (
    isEquipmentItem(item) &&
    item.subcategories?.includes('armor') === true
  );
}

/**
 * Check if item is a tool
 */
export function isToolItem(item: Item): item is ToolItem {
  return (
    isEquipmentItem(item) &&
    item.subcategories?.includes('tool') === true
  );
}

/**
 * Check if item is consumable
 */
export function isConsumableItem(item: Item): item is ConsumableItem {
  return item.category === 'consumable';
}

/**
 * Check if item is a resource
 */
export function isResourceItem(item: Item): item is ResourceItem {
  return item.category === 'resource';
}

/**
 * Check if equipment has weapon properties
 */
export function hasWeaponProperties(item: EquipmentItem): item is WeaponItem {
  return (
    item.properties.damageRoll !== undefined &&
    item.properties.attackSpeed !== undefined &&
    item.properties.skillScalar !== undefined
  );
}

/**
 * Check if equipment has armor properties
 */
export function hasArmorProperties(item: EquipmentItem): item is ArmorItem {
  return (
    item.properties.defense !== undefined ||
    item.properties.armor !== undefined ||
    item.properties.evasion !== undefined
  );
}

// ===== ACTIVITY TYPE GUARDS =====

/**
 * Check if activity is gathering
 */
export function isGatheringActivity(activity: Activity): activity is GatheringActivity {
  return activity.type === 'resource-gathering';
}

/**
 * Check if activity is combat
 */
export function isCombatActivity(activity: Activity): activity is CombatActivity {
  return activity.type === 'combat';
}

// ===== VALIDATION HELPERS =====

/**
 * Check if item can be equipped to a specific slot
 */
export function canEquipToSlot(item: Item, slotName: string): boolean {
  if (!isEquipmentItem(item)) {
    return false;
  }
  return item.slot === slotName;
}

/**
 * Check if item can have a specific quality
 */
export function canHaveQuality(item: Item, qualityId: string): boolean {
  return item.allowedQualities.includes(qualityId);
}

/**
 * Check if item can have a specific trait
 */
export function canHaveTrait(item: Item, traitId: string): boolean {
  return item.allowedTraits.includes(traitId);
}

/**
 * Check if item is stackable
 */
export function isStackable(item: Item): boolean {
  return item.stackable === true;
}

/**
 * Check if equipment requires a minimum level
 */
export function meetsLevelRequirement(item: Item, playerLevel: number): boolean {
  if (!isEquipmentItem(item)) {
    return true; // Non-equipment has no level requirement
  }
  return playerLevel >= item.properties.requiredLevel;
}
