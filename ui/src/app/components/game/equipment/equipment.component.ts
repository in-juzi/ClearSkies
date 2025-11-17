import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../../../services/equipment.service';
import { InventoryService } from '../../../services/inventory.service';
import { ItemDetails, EquipmentSlot } from '../../../models/inventory.model';
import { IconComponent } from '../../shared/icon/icon.component';
import { ItemDetailsPanelComponent } from '../../shared/item-details-panel/item-details-panel.component';
import { RarityNamePipe } from '../../../pipes/rarity-name.pipe';

interface SlotConfig {
  name: EquipmentSlot;
  label: string;
  icon: string;
  position: { row: number; col: number };
}

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, IconComponent, ItemDetailsPanelComponent, RarityNamePipe],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss',
})
export class Equipment {
  equipmentService = inject(EquipmentService);
  inventoryService = inject(InventoryService);

  // Selected item for details panel
  selectedItem: ItemDetails | null = null;

  // Slot configuration with grid positions
  slotConfigs: SlotConfig[] = [
    { name: 'head', label: 'Head', icon: 'assets/icons/item-categories/item_cat_body.svg', position: { row: 1, col: 2 } },
    { name: 'gloves', label: 'Gloves', icon: 'assets/icons/item-categories/item_cat_glove.svg', position: { row: 2, col: 1 } },
    { name: 'body', label: 'Body', icon: 'assets/icons/item-categories/item_cat_body.svg', position: { row: 2, col: 2 } },
    { name: 'necklace', label: 'Necklace', icon: 'assets/icons/item-categories/item_cat_amulet.svg', position: { row: 2, col: 3 } },
    { name: 'mainHand', label: 'Main Hand', icon: 'assets/icons/item-categories/item_cat_sword.svg', position: { row: 3, col: 1 } },
    { name: 'belt', label: 'Belt', icon: 'assets/icons/item-categories/item_cat_belt.svg', position: { row: 3, col: 2 } },
    { name: 'offHand', label: 'Off Hand', icon: 'assets/icons/item-categories/item_cat_shield.svg', position: { row: 3, col: 3 } },
    { name: 'ringLeft', label: 'Ring (L)', icon: 'assets/icons/item-categories/item_cat_ring.svg', position: { row: 4, col: 1 } },
    { name: 'boots', label: 'Boots', icon: 'assets/icons/item-categories/item_cat_boot.svg', position: { row: 4, col: 2 } },
    { name: 'ringRight', label: 'Ring (R)', icon: 'assets/icons/item-categories/item_cat_ring.svg', position: { row: 4, col: 3 } }
  ];

  // Computed signal for equipped items
  equippedItems = computed(() => this.equipmentService.equippedItems());

  // Computed signal for equipment summary stats (from backend with quality/trait effects)
  equipmentSummary = computed(() => this.equipmentService.equipmentStats());

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
   * Handle click on equipped item - show details panel
   */
  onItemClick(slotName: EquipmentSlot): void {
    const item = this.getItemInSlot(slotName);
    if (item) {
      this.selectedItem = item;
    }
  }

  /**
   * Close item details panel
   */
  closeItemDetails(): void {
    this.selectedItem = null;
  }

  /**
   * Handle equip action from details panel
   * (Not typically used in equipment component, but included for completeness)
   */
  equipItem(instanceId: string): void {
    // The shared panel might emit this, but items are already equipped in this view
  }

  /**
   * Handle unequip action from details panel
   */
  unequipItem(instanceId: string): void {
    if (!this.selectedItem) return;

    const slot = this.selectedItem.definition.slot;
    if (!slot) {
      console.error('Item has no slot defined');
      return;
    }

    this.equipmentService.unequipItem(slot).subscribe({
      next: () => {
        this.inventoryService.getInventory().subscribe();
        this.selectedItem = null;
      },
      error: (error) => {
        console.error('Error unequipping item:', error);
      }
    });
  }

  /**
   * Handle use item action from details panel
   * (Not applicable for equipped items, but included for interface completeness)
   */
  useItem(instanceId: string): void {
  }

  /**
   * Handle remove item action from details panel
   * (Cannot drop equipped items)
   */
  removeItem(instanceId: string): void {
  }

  /**
   * Handle remove all action from details panel
   * (Cannot drop equipped items)
   */
  removeAllItems(instanceId: string): void {
  }

  /**
   * Calculate damage range tooltip for display
   * Parses damage rolls like "2d6 +4" and returns min/max/avg
   * Also handles unarmed damage like "1 (Unarmed)"
   */
  getDamageRangeTooltip(damageRolls: string[]): string {
    if (!damageRolls || damageRolls.length === 0) {
      return '';
    }

    const ranges = damageRolls.map(roll => {
      // Check for unarmed damage format: "1 (Unarmed)"
      const unarmedMatch = roll.match(/^(\d+)\s*\(Unarmed\)$/);
      if (unarmedMatch) {
        const damage = parseInt(unarmedMatch[1]);
        return `Unarmed: ${damage} fixed damage`;
      }

      // Parse damage roll format: "2d6 +4" or "1d8" or "2d6"
      const match = roll.match(/(\d+)d(\d+)(?:\s*\+(\d+))?/);
      if (!match) return null;

      const numDice = parseInt(match[1]);
      const dieSize = parseInt(match[2]);
      const bonus = match[3] ? parseInt(match[3]) : 0;

      const min = numDice * 1 + bonus;
      const max = numDice * dieSize + bonus;
      const avg = ((numDice * (dieSize + 1) / 2) + bonus).toFixed(1);

      return `${roll}: ${min}-${max} (avg ${avg})`;
    });

    return ranges.filter(r => r !== null).join('\n');
  }
}
