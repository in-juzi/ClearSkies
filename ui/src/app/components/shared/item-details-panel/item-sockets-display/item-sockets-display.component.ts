import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { ItemDetails } from '../../../../models/inventory.model';
import { InventoryService } from '../../../../services/inventory.service';
import { ItemDataService } from '../../../../services/item-data.service';
import { Item, SUBCATEGORY } from '@shared/types';
import { getSocketCount, SOCKET_EXTRACTION_COST } from '@shared/constants/socket-constants';
import { summarizeSocketEffect } from '../../../../utils/socket-effect.utils';

/** One rendered socket: empty, or filled with a resolved sigil definition. */
interface SocketSlot {
  index: number;
  filled: boolean;
  sigil?: Item;
}

/**
 * Renders an equipment item's sockets as pips (filled vs empty) and, for empty
 * sockets, offers an inline picker of socketable sigils from the inventory.
 * Host-centric flow: capacity is derived from rarity (getSocketCount); contents
 * are the host's sparse `sockets` list.
 */
@Component({
  selector: 'app-item-sockets-display',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './item-sockets-display.component.html',
  styleUrl: './item-sockets-display.component.scss'
})
export class ItemSocketsDisplayComponent {
  @Input() item!: ItemDetails;
  /** Emits when the player chooses a sigil to bind into an empty socket. */
  @Output() socket = new EventEmitter<{ hostInstanceId: string; socketableInstanceId: string }>();
  /** Emits when the player extracts a sigil from a filled socket. */
  @Output() extract = new EventEmitter<{ hostInstanceId: string; socketIndex: number }>();

  private itemDataService = inject(ItemDataService);
  private inventoryService = inject(InventoryService);

  /** The reagent + amount an extraction costs. */
  readonly extractionCost = SOCKET_EXTRACTION_COST;

  /** Which empty pip currently has its picker open (null = none). */
  pickerOpenIndex: number | null = null;
  /** Which filled pip currently has its extract popover open (null = none). */
  extractOpenIndex: number | null = null;

  /** Socket capacity, derived from the host's rarity. */
  get capacity(): number {
    return getSocketCount(this.item?.definition?.rarity);
  }

  /** Only equipment with at least one socket shows this section. */
  get hasSockets(): boolean {
    return this.item?.definition?.category === 'equipment' && this.capacity > 0;
  }

  /** The pips to render. Filled sockets are stored sparsely (filled first). */
  get slots(): SocketSlot[] {
    const filled = this.item?.sockets ?? [];
    const slots: SocketSlot[] = [];
    for (let i = 0; i < this.capacity; i++) {
      const entry = filled[i];
      slots.push({
        index: i,
        filled: !!entry,
        sigil: entry ? this.itemDataService.getItemDefinition(entry.socketableItemId) : undefined
      });
    }
    return slots;
  }

  /** Socketable sigils currently held that can be inserted. */
  get availableSocketables(): ItemDetails[] {
    return this.inventoryService.inventory().filter(it =>
      it.quantity > 0 &&
      !!it.definition?.socketEffect &&
      !!it.definition?.subcategories?.includes(SUBCATEGORY.SOCKETABLE)
    );
  }

  togglePicker(index: number): void {
    this.extractOpenIndex = null;
    this.pickerOpenIndex = this.pickerOpenIndex === index ? null : index;
  }

  toggleExtract(index: number): void {
    this.pickerOpenIndex = null;
    this.extractOpenIndex = this.extractOpenIndex === index ? null : index;
  }

  selectSocketable(socketable: ItemDetails): void {
    this.socket.emit({
      hostInstanceId: this.item.instanceId,
      socketableInstanceId: socketable.instanceId
    });
    this.pickerOpenIndex = null;
  }

  confirmExtract(index: number): void {
    this.extract.emit({ hostInstanceId: this.item.instanceId, socketIndex: index });
    this.extractOpenIndex = null;
  }

  /** How many extraction reagents the player currently holds. */
  get reagentOwned(): number {
    return this.inventoryService.inventory()
      .filter(it => it.itemId === this.extractionCost.itemId)
      .reduce((total, it) => total + it.quantity, 0);
  }

  get canAffordExtraction(): boolean {
    return this.reagentOwned >= this.extractionCost.quantity;
  }

  /** Display name of the extraction reagent (falls back to its id). */
  get reagentName(): string {
    return this.itemDataService.getItemDefinition(this.extractionCost.itemId)?.name ?? this.extractionCost.itemId;
  }

  /** One-line effect summary for a sigil definition (picker + tooltip). */
  effectSummary(def?: Item): string {
    return summarizeSocketEffect(def?.socketEffect).join(' ');
  }

  /** Tooltip text for a filled socket: sigil name + its effect. */
  filledTooltip(def?: Item): string {
    if (!def) return '';
    const effect = this.effectSummary(def);
    return effect ? `${def.name} — ${effect}` : def.name;
  }
}
