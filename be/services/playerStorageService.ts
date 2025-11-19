/**
 * Player Storage Service
 * Handles all storage container operations for players (bank, housing, etc.)
 * Extracted from Player model to follow Single Responsibility Principle
 */
import { IPlayer, StorageContainer, InventoryItem } from '../models/Player';
import itemService from './itemService';

class PlayerStorageService {
  /**
   * Get a storage container by ID
   */
  getContainer(player: IPlayer, containerId: string): StorageContainer {
    const container = player.storageContainers.find(c => c.containerId === containerId);

    if (!container) {
      throw new Error(`Storage container '${containerId}' not found`);
    }

    return container;
  }

  /**
   * Get all items in a storage container
   */
  getContainerItems(player: IPlayer, containerId: string): any[] {
    const container = this.getContainer(player, containerId);
    return container.items || [];
  }

  /**
   * Deposit item(s) into a storage container
   * Handles stacking logic similar to inventory
   */
  depositToContainer(player: IPlayer, containerId: string, instanceId: string, quantity?: number | null): any {
    const container = this.getContainer(player, containerId);

    // Find item in player's inventory
    const invItemIndex = player.inventory.findIndex((item: InventoryItem) => item.instanceId === instanceId);
    if (invItemIndex === -1) {
      throw new Error('Item not found in inventory');
    }

    const invItem = player.inventory[invItemIndex];

    // Cannot deposit equipped items
    if (invItem.equipped) {
      throw new Error('Cannot deposit equipped items');
    }

    // Determine quantity to deposit
    const depositQuantity = quantity && quantity < invItem.quantity ? quantity : invItem.quantity;

    // Get item definition
    const itemDef = itemService.getItemDefinition(invItem.itemId);

    // Check if container is at capacity (slot-based, not quantity-based)
    // Only check if we need a new slot (item doesn't stack with existing)
    const needsNewSlot = !itemDef?.stackable || !container.items.find((item: InventoryItem) =>
      item.itemId === invItem.itemId &&
      itemService._sortedMapString(item.qualities) === itemService._sortedMapString(invItem.qualities) &&
      itemService._sortedMapString(item.traits) === itemService._sortedMapString(invItem.traits)
    );

    if (needsNewSlot && container.items.length >= container.capacity) {
      throw new Error('Storage container is at capacity');
    }

    // Try to stack with existing item in container
    if (itemDef?.stackable) {
      const existingItem = container.items.find((item: InventoryItem) =>
        item.itemId === invItem.itemId &&
        itemService._sortedMapString(item.qualities) === itemService._sortedMapString(invItem.qualities) &&
        itemService._sortedMapString(item.traits) === itemService._sortedMapString(invItem.traits)
      );

      if (existingItem) {
        // Stack with existing item
        existingItem.quantity += depositQuantity;

        // Remove from inventory (partial or full)
        if (depositQuantity < invItem.quantity) {
          invItem.quantity -= depositQuantity;
        } else {
          player.inventory.splice(invItemIndex, 1);
        }

        return existingItem;
      }
    }

    // Create new stack in container
    const newContainerItem: InventoryItem = {
      instanceId: invItem.instanceId,
      itemId: invItem.itemId,
      quantity: depositQuantity,
      qualities: invItem.qualities,
      traits: invItem.traits,
      equipped: false,
      acquiredAt: invItem.acquiredAt
    };

    container.items.push(newContainerItem);

    // Remove from inventory (partial or full)
    if (depositQuantity < invItem.quantity) {
      invItem.quantity -= depositQuantity;
    } else {
      player.inventory.splice(invItemIndex, 1);
    }

    return newContainerItem;
  }

  /**
   * Withdraw item(s) from a storage container
   */
  withdrawFromContainer(player: IPlayer, containerId: string, instanceId: string, quantity?: number | null): any {
    const container = this.getContainer(player, containerId);

    // Find item in container
    const containerItemIndex = container.items.findIndex((item: InventoryItem) => item.instanceId === instanceId);
    if (containerItemIndex === -1) {
      throw new Error('Item not found in storage container');
    }

    const containerItem = container.items[containerItemIndex];

    // Determine quantity to withdraw
    const withdrawQuantity = quantity && quantity < containerItem.quantity ? quantity : containerItem.quantity;

    // Check weight capacity
    const itemDef = itemService.getItemDefinition(containerItem.itemId);
    const itemWeight = itemDef?.properties?.weight || 0;
    const totalItemWeight = itemWeight * withdrawQuantity;

    if (player.currentWeight + totalItemWeight > player.carryingCapacity) {
      throw new Error('Not enough carrying capacity');
    }

    // Get item definition
    const stackable = itemDef?.stackable;

    // Try to stack with existing item in inventory
    if (stackable) {
      const existingInvItem = player.inventory.find((item: InventoryItem) =>
        item.itemId === containerItem.itemId &&
        !item.equipped &&
        itemService._sortedMapString(item.qualities) === itemService._sortedMapString(containerItem.qualities) &&
        itemService._sortedMapString(item.traits) === itemService._sortedMapString(containerItem.traits)
      );

      if (existingInvItem) {
        // Stack with existing inventory item
        existingInvItem.quantity += withdrawQuantity;

        // Remove from container (partial or full)
        if (withdrawQuantity < containerItem.quantity) {
          containerItem.quantity -= withdrawQuantity;
        } else {
          container.items.splice(containerItemIndex, 1);
        }

        return existingInvItem;
      }
    }

    // Create new stack in inventory
    const newInvItem: InventoryItem = {
      instanceId: containerItem.instanceId,
      itemId: containerItem.itemId,
      quantity: withdrawQuantity,
      qualities: containerItem.qualities,
      traits: containerItem.traits,
      equipped: false,
      acquiredAt: containerItem.acquiredAt
    };

    player.inventory.push(newInvItem);

    // Remove from container (partial or full)
    if (withdrawQuantity < containerItem.quantity) {
      containerItem.quantity -= withdrawQuantity;
    } else {
      container.items.splice(containerItemIndex, 1);
    }

    return newInvItem;
  }

  /**
   * Get total capacity and used space for a container
   */
  getContainerStats(player: IPlayer, containerId: string): { capacity: number; used: number; available: number } {
    const container = this.getContainer(player, containerId);
    const used = container.items.reduce((total, item) => total + item.quantity, 0);

    return {
      capacity: container.capacity,
      used,
      available: container.capacity - used
    };
  }

  /**
   * Create a new storage container for player
   */
  createContainer(
    player: IPlayer,
    containerId: string,
    containerType: string,
    name: string,
    capacity: number
  ): StorageContainer {
    // Check if container already exists
    const existing = player.storageContainers.find(c => c.containerId === containerId);
    if (existing) {
      throw new Error(`Storage container '${containerId}' already exists`);
    }

    const newContainer: StorageContainer = {
      containerId,
      containerType,
      name,
      capacity,
      items: []
    };

    player.storageContainers.push(newContainer);

    return newContainer;
  }

  /**
   * Get all storage containers for player
   */
  getAllContainers(player: IPlayer): StorageContainer[] {
    return player.storageContainers;
  }

  /**
   * Get containers by type (e.g., 'bank', 'house-storage')
   */
  getContainersByType(player: IPlayer, containerType: string): StorageContainer[] {
    return player.storageContainers.filter(c => c.containerType === containerType);
  }
}

export default new PlayerStorageService();
