/**
 * Player Inventory Service
 * Handles all inventory-related operations for players
 * Extracted from Player model to follow Single Responsibility Principle
 */
import { IPlayer, InventoryItem } from '../models/Player';
import itemService from './itemService';

class PlayerInventoryService {
  /**
   * Add an item to player's inventory
   * Handles stacking logic for items with same itemId, qualities, and traits
   * Includes weight-based carrying capacity validation
   */
  addItem(player: IPlayer, itemInstance: any): any {
    if (!player.inventory) {
      player.inventory = [];
    }

    const itemDef = itemService.getItemDefinition(itemInstance.itemId);

    // Check weight-based carrying capacity
    const itemWeight = itemDef?.properties?.weight || 0;
    const totalItemWeight = itemWeight * (itemInstance.quantity || 1);
    const currentWeight = player.currentWeight; // Uses virtual property
    const capacity = player.carryingCapacity; // Uses virtual property

    if (currentWeight + totalItemWeight > capacity) {
      const available = capacity - currentWeight;
      throw new Error(
        `Cannot carry ${totalItemWeight.toFixed(1)}kg (${available.toFixed(1)}kg capacity remaining, ${capacity.toFixed(1)}kg total)`
      );
    }

    // If item is stackable, try to find existing stack
    if (itemDef?.stackable) {
      const existingItem = player.inventory.find((item: InventoryItem) =>
        itemService.canStack(item as any, itemInstance)
      );

      if (existingItem) {
        existingItem.quantity += itemInstance.quantity || 1;
        return existingItem;
      }
    }

    // Create new stack
    const newItem: InventoryItem = {
      instanceId: itemInstance.instanceId,
      itemId: itemInstance.itemId,
      quantity: itemInstance.quantity || 1,
      qualities: itemInstance.qualities instanceof Map ? itemInstance.qualities : new Map(Object.entries(itemInstance.qualities || {})),
      traits: itemInstance.traits instanceof Map ? itemInstance.traits : new Map(Object.entries(itemInstance.traits || {})),
      equipped: itemInstance.equipped || false,
      acquiredAt: itemInstance.acquiredAt || new Date()
    };

    player.inventory.push(newItem);
    return newItem;
  }

  /**
   * Remove item(s) from player's inventory
   */
  removeItem(player: IPlayer, instanceId: string, quantity?: number | null): InventoryItem {
    const itemIndex = player.inventory.findIndex((item: InventoryItem) => item.instanceId === instanceId);

    if (itemIndex === -1) {
      throw new Error('Item not found in inventory');
    }

    const item = player.inventory[itemIndex];

    // Remove partial quantity
    if (quantity && quantity < item.quantity) {
      item.quantity -= quantity;
      return item;
    }

    // Remove entire stack
    player.inventory.splice(itemIndex, 1);
    return item;
  }

  /**
   * Get a single item from inventory by instanceId
   */
  getItem(player: IPlayer, instanceId: string): InventoryItem | undefined {
    return player.inventory.find((item: InventoryItem) => item.instanceId === instanceId);
  }

  /**
   * Get all items matching a specific itemId
   */
  getItemsByItemId(player: IPlayer, itemId: string): InventoryItem[] {
    return player.inventory.filter((item: InventoryItem) => item.itemId === itemId);
  }

  /**
   * Get total inventory size (sum of all quantities)
   */
  getInventorySize(player: IPlayer): number {
    return player.inventory.reduce((total: number, item: InventoryItem) => total + item.quantity, 0);
  }

  /**
   * Get total value of all items in inventory
   */
  getInventoryValue(player: IPlayer): number {
    return player.inventory.reduce((total: number, item: InventoryItem) => {
      const price = itemService.calculateVendorPrice(item as any);
      return total + (price * item.quantity);
    }, 0);
  }

  /**
   * Check if player has specific item with minimum quantity
   */
  hasInventoryItem(player: IPlayer, itemId: string, minQuantity: number = 1): boolean {
    const totalQuantity = this.getInventoryItemQuantity(player, itemId);
    return totalQuantity >= minQuantity;
  }

  /**
   * Get total quantity of specific item across all stacks
   */
  getInventoryItemQuantity(player: IPlayer, itemId: string): number {
    return player.inventory
      .filter((item: InventoryItem) => item.itemId === itemId && !item.equipped)
      .reduce((total: number, item: InventoryItem) => total + item.quantity, 0);
  }

  /**
   * Equip an item to a specific slot
   */
  async equipItem(player: IPlayer, instanceId: string, slotName: string): Promise<{ slot: string; item: InventoryItem }> {
    const item = this.getItem(player, instanceId);
    if (!item) {
      throw new Error('Item not found in inventory');
    }

    const itemDef = itemService.getItemDefinition(item.itemId);
    if (!itemDef || itemDef.category !== 'equipment') {
      throw new Error('Item cannot be equipped');
    }

    // Unequip existing item in slot if any
    const existingItemId = player.equipmentSlots.get(slotName);
    if (existingItemId) {
      await this.unequipItem(player, slotName);
    }

    // Equip new item
    item.equipped = true;
    player.equipmentSlots.set(slotName, instanceId);

    return { slot: slotName, item };
  }

  /**
   * Unequip an item from a specific slot
   */
  async unequipItem(player: IPlayer, slotName: string): Promise<{ slot: string; item: InventoryItem | undefined }> {
    const instanceId = player.equipmentSlots.get(slotName);
    if (!instanceId) {
      return { slot: slotName, item: undefined };
    }

    const item = this.getItem(player, instanceId);
    if (item) {
      item.equipped = false;
    }

    player.equipmentSlots.set(slotName, null);

    return { slot: slotName, item };
  }

  /**
   * Get all equipped items
   */
  getEquippedItems(player: IPlayer): Record<string, InventoryItem> {
    const equipped: Record<string, InventoryItem> = {};

    for (const [slot, instanceId] of player.equipmentSlots.entries()) {
      if (instanceId) {
        const item = this.getItem(player, instanceId);
        if (item) {
          equipped[slot] = item;
        }
      }
    }

    return equipped;
  }

  /**
   * Check if player has equipped item with specific subtype
   */
  hasEquippedSubtype(player: IPlayer, subtype: string): boolean {
    const equippedItems = this.getEquippedItems(player);

    for (const item of Object.values(equippedItems)) {
      const itemDef = itemService.getItemDefinition(item.itemId);
      if (itemDef?.subcategories?.includes(subtype)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a slot is available (not occupied)
   */
  isSlotAvailable(player: IPlayer, slotName: string): boolean {
    const instanceId = player.equipmentSlots.get(slotName);
    return !instanceId;
  }

  /**
   * Add a new equipment slot to player
   */
  async addEquipmentSlot(player: IPlayer, slotName: string): Promise<string> {
    if (player.equipmentSlots.has(slotName)) {
      throw new Error(`Equipment slot '${slotName}' already exists`);
    }

    player.equipmentSlots.set(slotName, null);
    await player.save();

    return slotName;
  }
}

export default new PlayerInventoryService();
