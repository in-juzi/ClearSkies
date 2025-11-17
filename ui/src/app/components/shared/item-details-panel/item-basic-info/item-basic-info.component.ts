import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { InventoryService } from '../../../../services/inventory.service';
import { RarityColorPipe } from '../../../../pipes/rarity-color.pipe';

@Component({
  selector: 'app-item-basic-info',
  standalone: true,
  imports: [CommonModule, IconComponent, RarityColorPipe],
  templateUrl: './item-basic-info.component.html',
  styleUrl: './item-basic-info.component.scss'
})
export class ItemBasicInfoComponent {
  @Input() icon: any;
  @Input() itemName: string = '';
  @Input() description: string = '';
  @Input() category: string = '';
  @Input() subcategories: readonly string[] = [];
  @Input() rarity: string = '';
  @Input() quantity: number = 0;
  @Input() weight: number = 0;
  @Input() vendorPrice: number = 0;

  constructor(public inventoryService: InventoryService) {}

  formatSubcategoryName(subcategory: string): string {
    return subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
  }
}
