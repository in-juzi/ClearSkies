import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ItemDetails } from '../models/inventory.model';
import { environment } from '../../environments/environment';

export interface BankInfo {
  containerId: string;
  containerType: string;
  name: string;
  capacity: number;
  usedSlots: number;
  items: ItemDetails[];
}

export interface BankResponse {
  message: string;
  bank: BankInfo;
}

export interface DepositRequest {
  instanceId: string;
  quantity?: number | null;
}

export interface WithdrawRequest {
  instanceId: string;
  quantity?: number | null;
}

export interface CapacityResponse {
  capacity: number;
  usedSlots: number;
  availableSlots: number;
}

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = `${environment.apiUrl}/bank`;
  private http = inject(HttpClient);

  // Signals for reactive state
  bankItems = signal<ItemDetails[]>([]);
  bankCapacity = signal<number>(200);
  bankUsedSlots = signal<number>(0);
  bankAvailableSlots = signal<number>(200);
  isOpen = signal<boolean>(false);

  /**
   * Get bank items and info
   */
  getBankItems(): Observable<BankResponse> {
    return this.http.get<BankResponse>(`${this.apiUrl}/items`).pipe(
      tap(response => {
        this.bankItems.set(response.bank.items);
        this.bankCapacity.set(response.bank.capacity);
        this.bankUsedSlots.set(response.bank.usedSlots);
        this.bankAvailableSlots.set(response.bank.capacity - response.bank.usedSlots);
      })
    );
  }

  /**
   * Get bank capacity info
   */
  getBankCapacity(): Observable<CapacityResponse> {
    return this.http.get<CapacityResponse>(`${this.apiUrl}/capacity`).pipe(
      tap(response => {
        this.bankCapacity.set(response.capacity);
        this.bankUsedSlots.set(response.usedSlots);
        this.bankAvailableSlots.set(response.availableSlots);
      })
    );
  }

  /**
   * Deposit item to bank
   */
  depositItem(request: DepositRequest): Observable<BankResponse> {
    return this.http.post<BankResponse>(`${this.apiUrl}/deposit`, request).pipe(
      tap(response => {
        this.bankItems.set(response.bank.items);
        this.bankUsedSlots.set(response.bank.usedSlots);
        this.bankAvailableSlots.set(response.bank.capacity - response.bank.usedSlots);
      })
    );
  }

  /**
   * Withdraw item from bank
   */
  withdrawItem(request: WithdrawRequest): Observable<BankResponse> {
    return this.http.post<BankResponse>(`${this.apiUrl}/withdraw`, request).pipe(
      tap(response => {
        this.bankItems.set(response.bank.items);
        this.bankUsedSlots.set(response.bank.usedSlots);
        this.bankAvailableSlots.set(response.bank.capacity - response.bank.usedSlots);
      })
    );
  }

  /**
   * Open the bank UI
   */
  openBank(): void {
    this.isOpen.set(true);
    this.getBankItems().subscribe();
  }

  /**
   * Close the bank UI
   */
  closeBank(): void {
    this.isOpen.set(false);
  }

  /**
   * Toggle bank UI
   */
  toggleBank(): void {
    if (this.isOpen()) {
      this.closeBank();
    } else {
      this.openBank();
    }
  }
}
