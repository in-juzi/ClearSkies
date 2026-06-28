/**
 * Player Inventory Service
 * Handles all inventory-related operations for players
 * Extracted from Player model to follow Single Responsibility Principle
 */
import { IPlayer, InventoryItem } from '../models/Player';
import itemService from './itemService';
import { getSocketCount, SOCKET_EXTRACTION_COST } from '@shared/constants/socket-constants';

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

    // Validate the slot exists
    if (!player.equipmentSlots.has(slotName)) {
      throw new Error(`Invalid equipment slot: ${slotName}`);
    }

    // Check if item can be equipped to this slot
    if (itemDef.slot !== slotName) {
      throw new Error(`Item cannot be equipped to ${slotName} slot. It can only be equipped to ${itemDef.slot}`);
    }

    // Two-handed weapon logic
    const isTwoHandedWeapon = (itemDef as any).properties?.twoHanded === true;

    if (isTwoHandedWeapon) {
      // Two-handed weapon being equipped to mainHand
      // Must unequip offHand if anything is there
      const offHandEquipped = player.equipmentSlots.get('offHand');
      if (offHandEquipped) {
        await this.unequipItem(player, 'offHand');
      }
    } else if (slotName === 'mainHand' || slotName === 'offHand') {
      // Equipping something to mainHand or offHand
      // Check if a two-handed weapon is currently equipped
      const mainHandInstanceId = player.equipmentSlots.get('mainHand');
      if (mainHandInstanceId) {
        const mainHandItem = this.getItem(player, mainHandInstanceId);
        if (mainHandItem) {
          const mainHandDef = itemService.getItemDefinition(mainHandItem.itemId);
          if ((mainHandDef as any).properties?.twoHanded === true) {
            // Unequip the two-handed weapon
            await this.unequipItem(player, 'mainHand');
          }
        }
      }
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
   * Socket a socketable (e.g. a sigil) into an empty socket on a host item.
   *
   * v1: fills an EMPTY socket only — replacement/extraction is a separate
   * (removable-for-cost) action, not yet built. Capacity is derived from the
   * host's rarity via getSocketCount; contents are the sparse host.sockets list.
   * Consumes one socketable from the inventory stack.
   *
   * Returns the mutated host item. Caller is responsible for player.save() and
   * effectEvaluator.invalidateCache (mirrors equipItem).
   */
  socketItem(
    player: IPlayer,
    hostInstanceId: string,
    socketableInstanceId: string
  ): { host: InventoryItem; socketableItemId: string } {
    const host = this.getItem(player, hostInstanceId);
    if (!host) {
      throw new Error('Host item not found in inventory');
    }

    const hostDef = itemService.getItemDefinition(host.itemId);
    if (!hostDef || hostDef.category !== 'equipment') {
      throw new Error('Only equipment can be socketed');
    }

    // Capacity is derived from rarity; contents are the sparse list.
    const capacity = getSocketCount(hostDef.rarity);
    if (capacity <= 0) {
      throw new Error('This item has no sockets');
    }
    if (!host.sockets) {
      host.sockets = [];
    }
    if (host.sockets.length >= capacity) {
      throw new Error('All sockets on this item are already filled');
    }

    const socketable = this.getItem(player, socketableInstanceId);
    if (!socketable) {
      throw new Error('Socketable item not found in inventory');
    }

    const socketableDef = itemService.getItemDefinition(socketable.itemId);
    if (!socketableDef?.socketEffect) {
      throw new Error('That item is not a socketable');
    }

    // Bind it in, then consume one from the stack.
    host.sockets.push({ socketableItemId: socketableDef.itemId });
    this.removeItem(player, socketableInstanceId, 1);

    return { host, socketableItemId: socketableDef.itemId };
  }

  /**
   * Extract a socketed sigil from a host item (removable-for-a-cost).
   *
   * Consumes one extraction reagent (SOCKET_EXTRACTION_COST), pops the sigil
   * out of the given socket index, and returns it to the inventory as a fresh
   * instance — the sigil keeps its essence and can be reseated elsewhere.
   *
   * Returns the mutated host and the recovered sigil. Caller is responsible for
   * player.save() and effectEvaluator.invalidateCache (mirrors socketItem).
   */
  extractSocket(
    player: IPlayer,
    hostInstanceId: string,
    socketIndex: number
  ): { host: InventoryItem; extractedItemId: string } {
    const host = this.getItem(player, hostInstanceId);
    if (!host) {
      throw new Error('Host item not found in inventory');
    }

    if (!host.sockets || !host.sockets[socketIndex]) {
      throw new Error('No socketed sigil at that position');
    }

    // Pay the extraction cost (a solvent reagent) before mutating the host.
    const { itemId: reagentId, quantity: reagentQty } = SOCKET_EXTRACTION_COST;
    const reagentStacks = this.getItemsByItemId(player, reagentId);
    const reagentOwned = reagentStacks.reduce((total, item) => total + item.quantity, 0);
    if (reagentOwned < reagentQty) {
      const reagentDef = itemService.getItemDefinition(reagentId);
      throw new Error(`Extraction requires ${reagentQty} ${reagentDef?.name ?? reagentId}`);
    }
    let remaining = reagentQty;
    for (const stack of reagentStacks) {
      if (remaining <= 0) break;
      const toRemove = Math.min(remaining, stack.quantity);
      this.removeItem(player, stack.instanceId, toRemove);
      remaining -= toRemove;
    }

    // Pop the sigil out (sparse list — splice keeps remaining sockets contiguous).
    const [removed] = host.sockets.splice(socketIndex, 1);

    // Return the sigil to inventory as a fresh instance.
    const recovered = itemService.createItemInstance(removed.socketableItemId, 1, {}, {}, 'admin');
    this.addItem(player, recovered);

    return { host, extractedItemId: removed.socketableItemId };
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
