import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss']
})
export class InventoryHeaderComponent {
  @Input() viewMode: 'list' | 'grouped' = 'list';
  @Input() isAltKeyHeld: boolean = false;
  @Input() isVendorOpen: boolean = false;
  @Input() selectedCategory: string = 'all';
  @Input() searchQuery: string = '';
  @Input() categories: Array<{ value: string; label: string; shortLabel: string }> = [];

  @Output() viewModeChange = new EventEmitter<'list' | 'grouped'>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() searchQueryChange = new EventEmitter<string>();

  onViewModeChange(mode: 'list' | 'grouped'): void {
    this.viewModeChange.emit(mode);
  }

  onCategoryChange(category: string): void {
    this.categoryChange.emit(category);
  }

  onSearchQueryChange(query: string): void {
    this.searchQueryChange.emit(query);
  }
}
