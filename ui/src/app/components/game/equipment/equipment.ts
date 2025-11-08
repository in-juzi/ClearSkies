import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../../../services/equipment.service';
import { InventoryService } from '../../../services/inventory.service';
import { ItemDetails, EquipmentSlot } from '../../../models/inventory.model';

interface SlotConfig {
  name: EquipmentSlot;
  label: string;
  icon: string;
  position: { row: number; col: number };
}

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipment.html',
  styleUrl: './equipment.scss',
})
export class Equipment {
  equipmentService = inject(EquipmentService);
  inventoryService = inject(InventoryService);

  // Slot configuration with grid positions
  slotConfigs: SlotConfig[] = [
    { name: 'head', label: 'Head', icon: '🛡️', position: { row: 1, col: 2 } },
    { name: 'gloves', label: 'Gloves', icon: '🧤', position: { row: 2, col: 1 } },
    { name: 'body', label: 'Body', icon: '👔', position: { row: 2, col: 2 } },
    { name: 'necklace', label: 'Necklace', icon: '📿', position: { row: 2, col: 3 } },
    { name: 'mainHand', label: 'Main Hand', icon: '⚔️', position: { row: 3, col: 1 } },
    { name: 'belt', label: 'Belt', icon: '⛓️', position: { row: 3, col: 2 } },
    { name: 'offHand', label: 'Off Hand', icon: '🛡️', position: { row: 3, col: 3 } },
    { name: 'ringLeft', label: 'Ring (L)', icon: '💍', position: { row: 4, col: 1 } },
    { name: 'boots', label: 'Boots', icon: '🥾', position: { row: 4, col: 2 } },
    { name: 'ringRight', label: 'Ring (R)', icon: '💍', position: { row: 4, col: 3 } }
  ];

  // Computed signal for equipped items
  equippedItems = computed(() => this.equipmentService.equippedItems());

  // Drag-over state for visual feedback
  dragOverSlot: EquipmentSlot | null = null;

  /**
   * Handle drag over event for equipment slot
   */
  onDragOver(event: DragEvent, slotName: EquipmentSlot): void {
    event.preventDefault();
    this.dragOverSlot = slotName;
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(): void {
    this.dragOverSlot = null;
  }

  /**
   * Handle drop event - equip item to slot
   */
  onDrop(event: DragEvent, slotName: EquipmentSlot): void {
    event.preventDefault();
    this.dragOverSlot = null;

    const itemData = event.dataTransfer?.getData('application/json');
    if (!itemData) return;

    const item: ItemDetails = JSON.parse(itemData);

    // Validate item can be equipped to this slot
    if (item.definition.category !== 'equipment') {
      console.warn('Item is not equippable');
      return;
    }

    if (item.definition.slot !== slotName) {
      console.warn(`Item cannot be equipped to ${slotName} slot. It can only be equipped to ${item.definition.slot}`);
      return;
    }

    // Equip the item
    this.equipmentService.equipItem(item.instanceId, slotName).subscribe({
      next: () => {
        // Reload inventory to update equipped status
        this.inventoryService.getInventory().subscribe();
      },
      error: (error) => {
        console.error('Error equipping item:', error);
      }
    });
  }

  /**
   * Handle right-click to unequip item
   */
  onSlotContextMenu(event: MouseEvent, slotName: EquipmentSlot): void {
    event.preventDefault();

    const item = this.equippedItems()[slotName];
    if (!item) return;

    // Unequip the item
    this.equipmentService.unequipItem(slotName).subscribe({
      next: () => {
        // Reload inventory to update equipped status
        this.inventoryService.getInventory().subscribe();
      },
      error: (error) => {
        console.error('Error unequipping item:', error);
      }
    });
  }

  /**
   * Get item in a specific slot
   */
  getItemInSlot(slotName: EquipmentSlot): ItemDetails | null {
    return this.equippedItems()[slotName] || null;
  }

  /**
   * Check if slot is being dragged over
   */
  isSlotDraggedOver(slotName: EquipmentSlot): boolean {
    return this.dragOverSlot === slotName;
  }

  /**
   * Get rarity color class
   */
  getRarityClass(rarity: string): string {
    return `rarity-${rarity}`;
  }
}
