import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/icon/icon.component';
import { ItemMiniComponent } from '../../shared/item-mini/item-mini.component';
import { XpMiniComponent } from '../../shared/xp-mini/xp-mini.component';
import { BuffIconComponent } from '../../shared/buff-icon/buff-icon.component';
import { ActiveBuff, ItemInstance } from '@shared/types';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ItemMiniComponent,
    XpMiniComponent,
    BuffIconComponent
  ],
  templateUrl: './design-system.component.html',
  styleUrls: ['./design-system.component.scss']
})
export class DesignSystemComponent {
  // Example data for shared component demos

  // Example icon configurations
  exampleIcons = [
    { path: 'item-categories/item_cat_sword.svg', material: 'iron', label: 'Iron Sword' },
    { path: 'item-categories/item_cat_potion.svg', material: 'health', label: 'Health Potion' },
    { path: 'item-categories/item_cat_ore.svg', material: 'copper', label: 'Copper Ore' },
    { path: 'item-categories/item_cat_fish.svg', material: 'generic', label: 'Fish' }
  ];

  // Example item for ItemMini component (uses any type since ItemMini accepts ItemInstance | any)
  exampleItem: any = {
    instanceId: 'example-1',
    itemId: 'iron_sword',
    name: 'Iron Sword',
    quantity: 1,
    equipped: false,
    qualities: { 'sharpness': 3 },
    traits: { 'hardened': 2 },
    definition: {
      itemId: 'iron_sword',
      name: 'Iron Sword',
      description: 'A well-crafted iron blade',
      category: 'equipment',
      subcategories: ['weapon', 'sword'],
      rarity: 'common',
      baseValue: 100,
      stackable: false,
      icon: {
        path: 'item-categories/item_cat_sword.svg',
        material: 'iron'
      },
      properties: {
        slot: 'mainHand',
        damageRoll: '2d6'
      }
    }
  };

  // Example buff for BuffIcon component
  exampleBuff: ActiveBuff = {
    buffId: 'example-buff',
    abilityId: 'battle_fury',
    name: 'Battle Fury',
    description: 'Increases damage by 30%',
    appliedAt: 1,
    duration: 5,
    target: 'player',
    statModifiers: [
      {
        stat: 'damage',
        type: 'percentage',
        value: 0.3
      }
    ]
  };

  // For triggering notification examples
  showNotification = signal(false);

  triggerNotification(): void {
    this.showNotification.set(true);
    setTimeout(() => this.showNotification.set(false), 3000);
  }
}
