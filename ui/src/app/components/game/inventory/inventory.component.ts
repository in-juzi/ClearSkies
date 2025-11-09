import { Component, OnInit, inject, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../../services/inventory.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { ItemDetails } from '../../../models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  private confirmDialog = inject(ConfirmDialogService);
  
  selectedItem: ItemDetails | null = null;
  selectedCategory: string = 'all';

  // Drag state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private panelStartX = 0;
  private panelStartY = 0;
  private dragElement: HTMLElement | null = null;

  // Store panel position (defaults to center)
  panelLeft: string = '50%';
  panelTop: string = '50%';
  panelTransform: string = 'translate(-50%, -50%)';
  hasBeenDragged = false;

  categories = [
    { value: 'all', label: 'All Items', shortLabel: 'All' },
    { value: 'resource', label: 'Resources', shortLabel: 'Resources' },
    { value: 'equipment', label: 'Equipment', shortLabel: 'Equipment' },
    { value: 'consumable', label: 'Consumables', shortLabel: 'Consumables' }
  ];

  constructor(
    public inventoryService: InventoryService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (response) => {
        console.log('Inventory loaded:', response);
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
      }
    });
  }

  getFilteredInventory(): ItemDetails[] {
    if (this.selectedCategory === 'all') {
      return this.inventoryService.inventory();
    }
    return this.inventoryService.getItemsByCategory(this.selectedCategory);
  }

  selectItem(item: ItemDetails): void {
    this.selectedItem = item;
  }

  closeItemDetails(): void {
    this.selectedItem = null;
  }

  getRarityClass(rarity: string): string {
    const rarityClasses: { [key: string]: string } = {
      common: 'border-gray-500',
      uncommon: 'border-green-500',
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      legendary: 'border-orange-500'
    };
    return rarityClasses[rarity] || 'border-gray-500';
  }

  getTotalWeight(): number {
    return this.inventoryService.inventory().reduce((total, item) => {
      return total + (item.definition.properties.weight * item.quantity);
    }, 0);
  }

  // Dev helper: Add test item with random qualities
  addTestItem(itemId: string): void {
    this.inventoryService.addRandomItem(itemId, 1).subscribe({
      next: (response) => {
        console.log('Test item added:', response);
      },
      error: (error) => {
        console.error('Error adding test item:', error);
      }
    });
  }

  async removeItem(instanceId: string, quantity?: number): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item?',
      confirmLabel: 'Remove',
      cancelLabel: 'Keep'
    });

    if (!confirmed) {
      return;
    }

    this.inventoryService.removeItem({ instanceId, quantity }).subscribe({
      next: () => {
        console.log('Item removed');
        this.selectedItem = null;
      },
      error: (error) => {
        console.error('Error removing item:', error);
      }
    });
  }

  getQualityKeys(qualities: any): string[] {
    if (!qualities) return [];
    return Object.keys(qualities);
  }

  formatEffectType(effectKey: string): string {
    const typeMap: { [key: string]: string } = {
      'vendorPrice': 'Vendor Price',
      'alchemy': 'Alchemy',
      'smithing': 'Smithing',
      'cooking': 'Cooking',
      'burning': 'Burning',
      'combat': 'Combat',
      'consumption': 'Consumption'
    };
    return typeMap[effectKey] || effectKey;
  }

  formatEffectValue(effectData: any): string {
    if (!effectData) return '';

    const effects: string[] = [];

    // Handle different effect properties
    if (effectData.modifier !== undefined) {
      const percentNum = (effectData.modifier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.potencyMultiplier !== undefined) {
      const percentNum = (effectData.potencyMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Potency ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.qualityBonus !== undefined) {
      const percent = (effectData.qualityBonus * 100).toFixed(0);
      effects.push(`Quality +${percent}%`);
    }

    if (effectData.efficiencyMultiplier !== undefined) {
      const percentNum = (effectData.efficiencyMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Efficiency ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.healingMultiplier !== undefined) {
      const percentNum = (effectData.healingMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Healing ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.damageBonus !== undefined) {
      const percent = (effectData.damageBonus * 100).toFixed(0);
      effects.push(`Damage +${percent}%`);
    }

    if (effectData.healthDrain !== undefined) {
      effects.push(`Health Drain -${effectData.healthDrain}/sec`);
    }

    if (effectData.durabilityMultiplier !== undefined) {
      const percentNum = (effectData.durabilityMultiplier - 1) * 100;
      const percent = percentNum.toFixed(0);
      effects.push(`Durability ${percentNum >= 0 ? '+' : ''}${percent}%`);
    }

    if (effectData.difficultyIncrease !== undefined) {
      effects.push(`Difficulty +${effectData.difficultyIncrease}%`);
    }

    if (effectData.bonusProperties !== undefined && Array.isArray(effectData.bonusProperties)) {
      effects.push(`Grants: ${effectData.bonusProperties.join(', ')}`);
    }

    return effects.join(', ');
  }

  // Drag functionality for item details panel
  onDragStart(event: MouseEvent, element: HTMLElement): void {
    // Only allow dragging from the header
    const target = event.target as HTMLElement;
    if (!target.closest('.details-header') || target.closest('.close-button')) {
      return;
    }

    event.preventDefault();
    this.isDragging = true;
    this.dragElement = element;

    // Get current panel position
    const rect = element.getBoundingClientRect();
    this.panelStartX = rect.left;
    this.panelStartY = rect.top;

    // Store mouse start position
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;

    // Add global mouse listeners
    this.renderer.listen('document', 'mousemove', (e) => this.onDrag(e));
    this.renderer.listen('document', 'mouseup', () => this.onDragEnd());

    // Add dragging class for cursor style
    this.renderer.addClass(element, 'dragging');
  }

  private onDrag(event: MouseEvent): void {
    if (!this.isDragging || !this.dragElement) return;

    event.preventDefault();

    // Calculate new position
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    const newLeft = this.panelStartX + deltaX;
    const newTop = this.panelStartY + deltaY;

    // Update panel position (use px instead of % after first drag)
    this.panelLeft = `${newLeft}px`;
    this.panelTop = `${newTop}px`;
    this.panelTransform = 'none';
    this.hasBeenDragged = true;
  }

  private onDragEnd(): void {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Remove dragging class
    if (this.dragElement) {
      this.renderer.removeClass(this.dragElement, 'dragging');
      this.dragElement = null;
    }
  }

  resetPanelPosition(): void {
    // Reset to center
    this.panelLeft = '50%';
    this.panelTop = '50%';
    this.panelTransform = 'translate(-50%, -50%)';
    this.hasBeenDragged = false;
  }

  // Item drag-and-drop handlers for equipment
  onItemDragStart(event: DragEvent, item: ItemDetails): void {
    if (item.definition.category !== 'equipment') {
      event.preventDefault();
      return;
    }

    // Set the drag data as JSON
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('application/json', JSON.stringify(item));

    // Add visual feedback
    const target = event.target as HTMLElement;
    target.classList.add('dragging-item');
  }

  onItemDragEnd(event: DragEvent): void {
    // Remove visual feedback
    const target = event.target as HTMLElement;
    target.classList.remove('dragging-item');
  }

  // Dev helper: Drop all items in inventory
  async dropAllItems(): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Drop All Items',
      message: 'Are you sure you want to drop ALL items in your inventory? This cannot be undone!',
      confirmLabel: 'Drop All',
      cancelLabel: 'Cancel'
    });

    if (!confirmed) {
      return;
    }


    const items = this.inventoryService.inventory();
    if (items.length === 0) {
      console.log('No items to drop');
      return;
    }

    // Remove all items sequentially to avoid race conditions
    console.log(`Dropping ${items.length} items...`);
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        await this.inventoryService.removeItem({ instanceId: item.instanceId }).toPromise();
        successCount++;
      } catch (error) {
        console.error(`Error dropping item ${item.instanceId}:`, error);
        errorCount++;
      }
    }

    console.log(`Dropped ${successCount} items successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
    this.selectedItem = null;
  }
}
