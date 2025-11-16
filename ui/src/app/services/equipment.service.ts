import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  EquippedItemsResponse,
  EquipItemRequest,
  UnequipItemRequest,
  EquipmentResponse,
  ItemDetails,
  EquipmentStats
} from '../models/inventory.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventory/equipment`;

  // Signals for reactive state
  equippedItems = signal<{ [slotName: string]: ItemDetails }>({});
  slots = signal<{ [slotName: string]: string | null }>({});
  equipmentStats = signal<EquipmentStats>({
    totalDamage: [],
    averageAttackSpeed: 0,
    totalCritChance: 0,
    weaponCount: 0,
    totalArmor: 0,
    totalEvasion: 0,
    totalBlockChance: 0,
    armorCount: 0,
    totalWeight: 0,
    requiredLevel: 0,
    itemCount: 0
  });

  constructor() {
    // Load equipped items and stats on service initialization
    this.loadEquippedItems().subscribe();
  }

  /**
   * Get all equipped items, slots, and stats (combined endpoint)
   */
  loadEquippedItems(): Observable<EquippedItemsResponse> {
    return this.http.get<EquippedItemsResponse>(this.apiUrl).pipe(
      tap(response => {
        this.equippedItems.set(response.equippedItems);
        this.slots.set(response.slots);
        this.equipmentStats.set(response.stats);
      })
    );
  }

  /**
   * Equip an item to a slot
   */
  equipItem(instanceId: string, slotName: string): Observable<EquipmentResponse> {
    const request: EquipItemRequest = { instanceId, slotName };
    return this.http.post<EquipmentResponse>(`${this.apiUrl}/equip`, request).pipe(
      tap(() => {
        // Reload equipped items and stats after equipping (single API call)
        this.loadEquippedItems().subscribe();
      })
    );
  }

  /**
   * Unequip an item from a slot
   */
  unequipItem(slotName: string): Observable<EquipmentResponse> {
    const request: UnequipItemRequest = { slotName };
    return this.http.post<EquipmentResponse>(`${this.apiUrl}/unequip`, request).pipe(
      tap(() => {
        // Reload equipped items and stats after unequipping (single API call)
        this.loadEquippedItems().subscribe();
      })
    );
  }

  /**
   * Check if a slot is occupied
   */
  isSlotOccupied(slotName: string): boolean {
    return !!this.slots()[slotName];
  }

  /**
   * Get item equipped in a specific slot
   */
  getItemInSlot(slotName: string): ItemDetails | null {
    return this.equippedItems()[slotName] || null;
  }
}
