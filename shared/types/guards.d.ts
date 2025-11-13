/**
 * Type guard utility functions
 *
 * These functions help narrow types at runtime while providing
 * compile-time type safety.
 */
import { Item, EquipmentItem, WeaponItem, ArmorItem, ToolItem, ConsumableItem, ResourceItem } from './items';
import { Activity, GatheringActivity, CombatActivity } from './locations';
/**
 * Check if item is equipment
 */
export declare function isEquipmentItem(item: Item): item is EquipmentItem;
/**
 * Check if item is a weapon
 */
export declare function isWeaponItem(item: Item): item is WeaponItem;
/**
 * Check if item is armor
 */
export declare function isArmorItem(item: Item): item is ArmorItem;
/**
 * Check if item is a tool
 */
export declare function isToolItem(item: Item): item is ToolItem;
/**
 * Check if item is consumable
 */
export declare function isConsumableItem(item: Item): item is ConsumableItem;
/**
 * Check if item is a resource
 */
export declare function isResourceItem(item: Item): item is ResourceItem;
/**
 * Check if equipment has weapon properties
 */
export declare function hasWeaponProperties(item: EquipmentItem): item is WeaponItem;
/**
 * Check if equipment has armor properties
 */
export declare function hasArmorProperties(item: EquipmentItem): item is ArmorItem;
/**
 * Check if activity is gathering
 */
export declare function isGatheringActivity(activity: Activity): activity is GatheringActivity;
/**
 * Check if activity is combat
 */
export declare function isCombatActivity(activity: Activity): activity is CombatActivity;
/**
 * Check if item can be equipped to a specific slot
 */
export declare function canEquipToSlot(item: Item, slotName: string): boolean;
/**
 * Check if item can have a specific quality
 */
export declare function canHaveQuality(item: Item, qualityId: string): boolean;
/**
 * Check if item can have a specific trait
 */
export declare function canHaveTrait(item: Item, traitId: string): boolean;
/**
 * Check if item is stackable
 */
export declare function isStackable(item: Item): boolean;
/**
 * Check if equipment requires a minimum level
 */
export declare function meetsLevelRequirement(item: Item, playerLevel: number): boolean;
//# sourceMappingURL=guards.d.ts.map