/**
 * Equipment Service
 * Handles equipment stat calculations and equipment-related operations
 */
import { IPlayer } from '../models/Player';
import itemService from './itemService';
import { EquipmentItem, WeaponItem, ArmorItem, isWeaponItem, isArmorItem } from '@shared/types';

export interface EquipmentStats {
  // Weapon stats
  totalDamage: number;
  weaponSpeed: number | null;
  damageType: string | null;
  damageRoll: string | null;
  attackRange: number | null;

  // Armor stats
  totalArmor: number;
  totalEvasion: number;

  // Tool stats
  woodcuttingPower: number;
  miningPower: number;
  fishingPower: number;
  gatheringPower: number;

  // Item counts
  totalItems: number;
  weaponCount: number;
  armorCount: number;
  toolCount: number;
}

class EquipmentService {
  /**
   * Calculate total equipment stats from all equipped items
   * @param player - Player with equipped items
   * @returns Aggregated equipment stats
   */
  calculateEquipmentStats(player: IPlayer): EquipmentStats {
    const stats: EquipmentStats = {
      totalDamage: 0,
      weaponSpeed: null,
      damageType: null,
      damageRoll: null,
      attackRange: null,
      totalArmor: 0,
      totalEvasion: 0,
      woodcuttingPower: 0,
      miningPower: 0,
      fishingPower: 0,
      gatheringPower: 0,
      totalItems: 0,
      weaponCount: 0,
      armorCount: 0,
      toolCount: 0
    };

    // Get equipped items
    const equippedItems = this.getEquippedItemsWithDefinitions(player);
    stats.totalItems = equippedItems.length;

    for (const { instance, definition } of equippedItems) {
      if (!definition) continue;

      // Weapon stats
      if (isWeaponItem(definition)) {
        stats.weaponCount++;
        stats.totalDamage += definition.properties.damageBonus || 0;

        // Store weapon speed (use mainHand weapon)
        if (instance.equipped && player.equipmentSlots.get('mainHand') === instance.instanceId) {
          stats.weaponSpeed = definition.properties.weaponSpeed || null;
          stats.damageType = definition.properties.damageType || null;
          stats.damageRoll = definition.properties.damageRoll || null;
          stats.attackRange = definition.properties.attackRange || null;
        }
      }

      // Armor stats
      if (isArmorItem(definition)) {
        stats.armorCount++;
        stats.totalArmor += definition.properties.armor || 0;
        stats.totalEvasion += definition.properties.evasion || 0;
      }

      // Tool stats
      if (definition.category === 'equipment' && definition.subcategories.includes('tool')) {
        stats.toolCount++;

        if (definition.subcategories.includes('woodcutting-axe')) {
          stats.woodcuttingPower += definition.properties.toolPower || 0;
        }
        if (definition.subcategories.includes('pickaxe')) {
          stats.miningPower += definition.properties.toolPower || 0;
        }
        if (definition.subcategories.includes('fishing-rod')) {
          stats.fishingPower += definition.properties.toolPower || 0;
        }
        if (definition.subcategories.includes('gathering-tool')) {
          stats.gatheringPower += definition.properties.toolPower || 0;
        }
      }
    }

    return stats;
  }

  /**
   * Get all equipped items with their definitions
   * @param player - Player instance
   * @returns Array of equipped items with definitions
   */
  getEquippedItemsWithDefinitions(player: IPlayer): Array<{
    slot: string;
    instance: any;
    definition: EquipmentItem | null;
  }> {
    const equippedItems: Array<{ slot: string; instance: any; definition: EquipmentItem | null }> = [];

    for (const [slot, instanceId] of player.equipmentSlots.entries()) {
      if (!instanceId) continue;

      const instance = player.inventory.find(item => item.instanceId === instanceId);
      if (!instance) continue;

      const definition = itemService.getItemDefinition(instance.itemId) as EquipmentItem;
      equippedItems.push({ slot, instance, definition });
    }

    return equippedItems;
  }

  /**
   * Get equipped item in a specific slot
   * @param player - Player instance
   * @param slot - Equipment slot name
   * @returns Equipped item or null
   */
  getEquippedItemInSlot(player: IPlayer, slot: string): { instance: any; definition: EquipmentItem | null } | null {
    const instanceId = player.equipmentSlots.get(slot);
    if (!instanceId) return null;

    const instance = player.inventory.find(item => item.instanceId === instanceId);
    if (!instance) return null;

    const definition = itemService.getItemDefinition(instance.itemId) as EquipmentItem;
    return { instance, definition };
  }
}

export default new EquipmentService();
