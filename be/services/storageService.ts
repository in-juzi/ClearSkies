import itemService from './itemService';

/**
 * Storage Service
 * Handles validation and operations for storage containers (bank, guild storage, player housing, etc.)
 */
class StorageService {
  /**
   * Validate that a player can deposit an item into a container
   */
  canDeposit(player: any, containerId: string, instanceId: string, quantity: number | null): { valid: boolean; error?: string } {
    try {
      // Find item in inventory
      const inventoryItem = player.getItem(instanceId);
      if (!inventoryItem) {
        return { valid: false, error: 'Item not found in inventory' };
      }

      // Check if equipped
      if (inventoryItem.equipped) {
        return { valid: false, error: 'Cannot deposit equipped items' };
      }

      // Check quantity
      const depositQuantity = quantity === null ? inventoryItem.quantity : quantity;
      if (depositQuantity > inventoryItem.quantity) {
        return { valid: false, error: 'Cannot deposit more than you have' };
      }

      // Check container exists
      let container;
      try {
        container = player.getContainer(containerId);
      } catch (err) {
        return { valid: false, error: 'Container not found' };
      }

      // Check if we need a new slot (item doesn't stack with existing)
      const existingContainerItem = container.items.find((item: any) =>
        itemService.canStack(item, inventoryItem)
      );

      if (!existingContainerItem) {
        // Will need a new slot
        const currentSlots = container.items.length;
        if (currentSlots >= container.capacity) {
          return { valid: false, error: `Container is full (${container.capacity} slots used)` };
        }
      }

      return { valid: true };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Unknown error' };
    }
  }

  /**
   * Validate that a player can withdraw an item from a container
   */
  canWithdraw(player: any, containerId: string, instanceId: string, quantity: number | null): { valid: boolean; error?: string } {
    try {
      // Check container exists
      let container;
      try {
        container = player.getContainer(containerId);
      } catch (err) {
        return { valid: false, error: 'Container not found' };
      }

      // Find item in container
      const containerItem = container.items.find((item: any) => item.instanceId === instanceId);
      if (!containerItem) {
        return { valid: false, error: 'Item not found in container' };
      }

      // Check quantity
      const withdrawQuantity = quantity === null ? containerItem.quantity : quantity;
      if (withdrawQuantity > containerItem.quantity) {
        return { valid: false, error: 'Cannot withdraw more than you have' };
      }

      // Check weight capacity
      const itemDef = itemService.getItemDefinition(containerItem.itemId);
      const itemWeight = itemDef?.properties?.weight || 0;
      const totalItemWeight = itemWeight * withdrawQuantity;
      const currentWeight = player.currentWeight;
      const capacity = player.carryingCapacity;

      if (currentWeight + totalItemWeight > capacity) {
        const available = capacity - currentWeight;
        return {
          valid: false,
          error: `Cannot carry ${totalItemWeight.toFixed(1)}kg (${available.toFixed(1)}kg capacity remaining)`
        };
      }

      return { valid: true };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Unknown error' };
    }
  }

  /**
   * Process depositing an item into a container
   * Returns the result of the deposit operation
   */
  async processDeposit(player: any, containerId: string, instanceId: string, quantity: number | null): Promise<any> {
    // Validate first
    const validation = this.canDeposit(player, containerId, instanceId, quantity);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Perform deposit using Player method
    const result = player.depositToContainer(containerId, instanceId, quantity);

    // Save player
    await player.save();

    return result;
  }

  /**
   * Process withdrawing an item from a container
   * Returns the result of the withdrawal operation
   */
  async processWithdraw(player: any, containerId: string, instanceId: string, quantity: number | null): Promise<any> {
    // Validate first
    const validation = this.canWithdraw(player, containerId, instanceId, quantity);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Perform withdrawal using Player method
    const result = player.withdrawFromContainer(containerId, instanceId, quantity);

    // Save player
    await player.save();

    return result;
  }

  /**
   * Get container info (capacity, used slots, items)
   */
  getContainerInfo(player: any, containerId: string): any {
    const container = player.getContainer(containerId);
    const items = player.getContainerItems(containerId);

    return {
      containerId: container.containerId,
      containerType: container.containerType,
      name: container.name,
      capacity: container.capacity,
      usedSlots: container.items.length,
      items
    };
  }

  /**
   * Get the bank container specifically (convenience method for backward compatibility)
   */
  getBankInfo(player: any): any {
    return this.getContainerInfo(player, 'bank');
  }

  /**
   * Check if a player can access a container
   * TODO: Implement guild permission checks when guild storage is added
   */
  canAccessContainer(player: any, containerId: string, operation: 'view' | 'deposit' | 'withdraw'): { allowed: boolean; reason?: string } {
    try {
      // Check if container exists
      const container = player.getContainer(containerId);

      // For now, all player-owned containers (bank, future house storage) are accessible
      // Future: Add guild permission checks here
      if (container.containerType === 'bank' || container.containerType === 'house') {
        return { allowed: true };
      }

      // Guild containers will need permission checks
      if (container.containerType === 'guild') {
        // TODO: Check guild membership and permissions
        return { allowed: false, reason: 'Guild storage not yet implemented' };
      }

      return { allowed: true };
    } catch (err: any) {
      return { allowed: false, reason: 'Container not found' };
    }
  }
}

export default new StorageService();
