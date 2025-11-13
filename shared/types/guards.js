"use strict";
/**
 * Type guard utility functions
 *
 * These functions help narrow types at runtime while providing
 * compile-time type safety.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEquipmentItem = isEquipmentItem;
exports.isWeaponItem = isWeaponItem;
exports.isArmorItem = isArmorItem;
exports.isToolItem = isToolItem;
exports.isConsumableItem = isConsumableItem;
exports.isResourceItem = isResourceItem;
exports.hasWeaponProperties = hasWeaponProperties;
exports.hasArmorProperties = hasArmorProperties;
exports.isGatheringActivity = isGatheringActivity;
exports.isCombatActivity = isCombatActivity;
exports.canEquipToSlot = canEquipToSlot;
exports.canHaveQuality = canHaveQuality;
exports.canHaveTrait = canHaveTrait;
exports.isStackable = isStackable;
exports.meetsLevelRequirement = meetsLevelRequirement;
const item_constants_1 = require("../../be/data/constants/item-constants");
// ===== ITEM TYPE GUARDS =====
/**
 * Check if item is equipment
 */
function isEquipmentItem(item) {
    return item.category === 'equipment';
}
/**
 * Check if item is a weapon
 */
function isWeaponItem(item) {
    return (isEquipmentItem(item) &&
        item.subcategories?.includes(item_constants_1.SUBCATEGORY.WEAPON) === true);
}
/**
 * Check if item is armor
 */
function isArmorItem(item) {
    return (isEquipmentItem(item) &&
        item.subcategories?.includes(item_constants_1.SUBCATEGORY.ARMOR) === true);
}
/**
 * Check if item is a tool
 */
function isToolItem(item) {
    return (isEquipmentItem(item) &&
        item.subcategories?.includes(item_constants_1.SUBCATEGORY.TOOL) === true);
}
/**
 * Check if item is consumable
 */
function isConsumableItem(item) {
    return item.category === 'consumable';
}
/**
 * Check if item is a resource
 */
function isResourceItem(item) {
    return item.category === 'resource';
}
/**
 * Check if equipment has weapon properties
 */
function hasWeaponProperties(item) {
    return (item.properties.damageRoll !== undefined &&
        item.properties.attackSpeed !== undefined &&
        item.properties.skillScalar !== undefined);
}
/**
 * Check if equipment has armor properties
 */
function hasArmorProperties(item) {
    return (item.properties.armor !== undefined ||
        item.properties.evasion !== undefined);
}
// ===== ACTIVITY TYPE GUARDS =====
/**
 * Check if activity is gathering
 */
function isGatheringActivity(activity) {
    return activity.type === 'resource-gathering';
}
/**
 * Check if activity is combat
 */
function isCombatActivity(activity) {
    return activity.type === 'combat';
}
// ===== VALIDATION HELPERS =====
/**
 * Check if item can be equipped to a specific slot
 */
function canEquipToSlot(item, slotName) {
    if (!isEquipmentItem(item)) {
        return false;
    }
    return item.slot === slotName;
}
/**
 * Check if item can have a specific quality
 */
function canHaveQuality(item, qualityId) {
    return item.allowedQualities.includes(qualityId);
}
/**
 * Check if item can have a specific trait
 */
function canHaveTrait(item, traitId) {
    return item.allowedTraits.includes(traitId);
}
/**
 * Check if item is stackable
 */
function isStackable(item) {
    return item.stackable === true;
}
/**
 * Check if equipment requires a minimum level
 */
function meetsLevelRequirement(item, playerLevel) {
    if (!isEquipmentItem(item)) {
        return true; // Non-equipment has no level requirement
    }
    return playerLevel >= item.properties.requiredLevel;
}
//# sourceMappingURL=guards.js.map