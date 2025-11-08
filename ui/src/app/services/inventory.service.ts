import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  InventoryResponse,
  ItemDetails,
  ItemDefinition,
  ItemDefinitionsResponse,
  AddItemRequest,
  RemoveItemRequest
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:3000/api/inventory';

  // Signals for reactive state
  inventory = signal<ItemDetails[]>([]);
  inventoryCapacity = signal<number>(100);
  inventorySize = signal<number>(0);
  inventoryValue = signal<number>(0);
  itemDefinitions = signal<ItemDefinition[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Fetch player's inventory
   */
  getInventory(): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(this.apiUrl).pipe(
      tap(response => {
        this.inventory.set(response.inventory);
        this.inventoryCapacity.set(response.capacity);
        this.inventorySize.set(response.size);
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
   */
  getItemDefinitions(category?: string): Observable<ItemDefinitionsResponse> {
    const url = category
      ? `${this.apiUrl}/definitions?category=${category}`
      : `${this.apiUrl}/definitions`;

    return this.http.get<ItemDefinitionsResponse>(url).pipe(
      tap(response => {
        this.itemDefinitions.set(response.items);
      })
    );
  }

  /**
   * Get single item definition
   */
  getItemDefinition(itemId: string): Observable<ItemDefinition> {
    return this.http.get<ItemDefinition>(`${this.apiUrl}/definitions/${itemId}`);
  }

  /**
   * Reload item definitions (admin)
   */
  reloadDefinitions(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reload`, {});
  }

  /**
   * Helper: Get items by category
   */
  getItemsByCategory(category: string): ItemDetails[] {
    return this.inventory().filter(item => item.definition.category === category);
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
   * Helper: Format quality value as percentage
   */
  formatQuality(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  /**
   * Helper: Get quality color based on value
   */
  getQualityColor(value: number): string {
    if (value >= 0.8) return 'text-green-400';
    if (value >= 0.6) return 'text-blue-400';
    if (value >= 0.4) return 'text-yellow-400';
    if (value >= 0.2) return 'text-orange-400';
    return 'text-red-400';
  }
}
