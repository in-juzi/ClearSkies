import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { Item } from '@shared/types';
import {
  InventoryResponse,
  ItemDetails,
  ItemDefinitionsResponse,
  AddItemRequest,
  RemoveItemRequest
} from '../models/inventory.model';
import { AuthService } from './auth.service';
import { ItemDataService } from './item-data.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private itemDataService = inject(ItemDataService);

  // Signals for reactive state
  inventory = signal<ItemDetails[]>([]);
  inventoryCapacity = signal<number>(100); // DEPRECATED: use carryingCapacity
  carryingCapacity = signal<number>(53); // in kg (base 50 + 1 STR + 1 END)
  currentWeight = signal<number>(0); // in kg
  inventorySize = signal<number>(0); // DEPRECATED: item count
  inventoryValue = signal<number>(0);
  gold = signal<number>(0);
  itemDefinitions = signal<Item[]>([]);

  constructor() {
    // Sync gold from auth service whenever player data changes
    effect(() => {
      const player = this.authService.currentPlayer();
      if (player?.gold !== undefined) {
        this.gold.set(player.gold);
      }
    });
  }

  /**
   * Fetch player's inventory
   */
  getInventory(): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(this.apiUrl).pipe(
      tap(response => {
        this.inventory.set(response.inventory);
        this.inventoryCapacity.set(response.capacity); // DEPRECATED
        this.carryingCapacity.set(response.carryingCapacity);
        this.currentWeight.set(response.currentWeight);
        this.inventorySize.set(response.size); // DEPRECATED
        this.inventoryValue.set(response.totalValue);
      })
    );
  }

  /**
   * Get single item details
   */
  getItem(instanceId: string): Observable<ItemDetails> {
    return this.http.get<ItemDetails>(`${this.apiUrl}/items/${instanceId}`);
  }

  /**
   * Add item to inventory
   */
  addItem(request: AddItemRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, request).pipe(
      tap(() => {
        // Refresh inventory after adding
        this.getInventory().subscribe();
      })
    );
  }

  /**
   * Add item with random qualities/traits
   */
  addRandomItem(itemId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/items/random`, { itemId, quantity }).pipe(
      tap(() => {
        // Refresh inventory after adding
        this.getInventory().subscribe();
      })
    );
  }

  /**
   * Remove item from inventory
   */
  removeItem(request: RemoveItemRequest): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/items`, { body: request }).pipe(
      tap(() => {
        // Refresh inventory after removing
        this.getInventory().subscribe();
      })
    );
  }

  /**
   * Get all item definitions (catalog)
   * Now uses local ItemDataService instead of API calls
   */
  getItemDefinitions(category?: string): Observable<ItemDefinitionsResponse> {
    const items = category
      ? this.itemDataService.getItemsByCategory(category)
      : this.itemDataService.getAllItems();

    this.itemDefinitions.set(items);

    return of({ items });
  }

  /**
   * Get single item definition
   * Now uses local ItemDataService instead of API calls
   */
  getItemDefinition(itemId: string): Observable<Item> {
    const item = this.itemDataService.getItemDefinition(itemId);
    if (!item) {
      throw new Error(`Item definition not found: ${itemId}`);
    }
    return of(item);
  }

  /**
   * Get single item definition synchronously from cache
   * Now uses local ItemDataService instead of cache
   */
  getItemDefinitionSync(itemId: string): Item | undefined {
    return this.itemDataService.getItemDefinition(itemId);
  }

  /**
   * Reload item definitions (admin)
   */
  reloadDefinitions(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reload`, {});
  }

  /**
   * Get scaled combat stats for an item
   */
  getItemCombatStats(instanceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/${instanceId}/combat-stats`);
  }

  /**
   * Helper: Get items by category
   */
  getItemsByCategory(category: string): ItemDetails[] {
    return this.inventory().filter(item => item.definition.category === category);
  }

  /**
   * Helper: Get items by subcategory
   */
  getItemsBySubcategory(subcategory: string): ItemDetails[] {
    return this.inventory().filter(item =>
      item.definition.subcategories && item.definition.subcategories.includes(subcategory)
    );
  }

  /**
   * Helper: Get all unique subcategories from inventory
   */
  getAllSubcategories(): string[] {
    const subcategoriesSet = new Set<string>();
    for (const item of this.inventory()) {
      if (item.definition.subcategories) {
        item.definition.subcategories.forEach(sub => subcategoriesSet.add(sub));
      }
    }
    return Array.from(subcategoriesSet).sort();
  }

  /**
   * Helper: Get equipped items
   */
  getEquippedItems(): ItemDetails[] {
    return this.inventory().filter(item => item.equipped);
  }

  /**
   * Helper: Get rarity color class
   */
  getRarityColor(rarity: string): string {
    const rarityColors: { [key: string]: string } = {
      common: 'text-gray-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-orange-400'
    };
    return rarityColors[rarity] || 'text-gray-400';
  }

  /**
   * Helper: Format quality level (now returns level number, not percentage)
   */
  formatQuality(level: number): string {
    return `Level ${level}`;
  }

  /**
   * Helper: Get quality color based on level (1-5)
   */
  getQualityColor(level: number): string {
    if (level >= 5) return 'text-purple-400'; // Perfect
    if (level >= 4) return 'text-green-400';  // Fine
    if (level >= 3) return 'text-blue-400';   // Good
    if (level >= 2) return 'text-yellow-400'; // Fair
    return 'text-red-400';                     // Poor
  }

  /**
   * Helper: Get trait color based on level (1-3)
   */
  getTraitLevelColor(level: number): string {
    if (level >= 3) return 'text-purple-400'; // Max level
    if (level >= 2) return 'text-blue-400';   // Mid level
    return 'text-green-400';                   // Base level
  }

  /**
   * Set gold amount (used by vendor service)
   */
  setGold(amount: number): void {
    this.gold.set(amount);
  }

  /**
   * Set inventory (used by vendor service after transactions)
   */
  setInventory(items: ItemDetails[]): void {
    this.inventory.set(items);
    this.inventorySize.set(items.reduce((sum, item) => sum + item.quantity, 0));
  }

  /**
   * Calculate total quality+trait score for an item (for sorting)
   */
  calculateItemScore(item: ItemDetails): number {
    let score = 0;

    // Sum all quality levels
    if (item.qualities) {
      Object.values(item.qualities).forEach(level => {
        score += level;
      });
    }

    // Sum all trait levels
    if (item.traits) {
      Object.values(item.traits).forEach(level => {
        score += level;
      });
    }

    return score;
  }

  /**
   * Get sorted inventory by quality+trait score (descending)
   */
  getSortedInventory(): ItemDetails[] {
    return [...this.inventory()].sort((a, b) => {
      return this.calculateItemScore(b) - this.calculateItemScore(a);
    });
  }

  /**
   * Get sorted items by category
   */
  getSortedItemsByCategory(category: string): ItemDetails[] {
    const filtered = this.inventory().filter(item => item.definition.category === category);
    return filtered.sort((a, b) => {
      return this.calculateItemScore(b) - this.calculateItemScore(a);
    });
  }

  /**
   * Equip an item to a specific slot
   */
  equipItem(instanceId: string, slot: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipment/equip`, { instanceId, slotName: slot }).pipe(
      tap(() => this.getInventory().subscribe())
    );
  }

  /**
   * Unequip an item from a specific slot
   */
  unequipItem(slot: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipment/unequip`, { slotName: slot }).pipe(
      tap(() => this.getInventory().subscribe())
    );
  }

  /**
   * Use a consumable item
   */
  useItem(instanceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/use`, { instanceId }).pipe(
      tap((response) => {
        // Refresh inventory to show updated quantities
        this.getInventory().subscribe();
        // Refresh player data to update health/mana
        this.authService.getProfile().subscribe();
      })
    );
  }
}
