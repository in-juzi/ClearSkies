import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Vendor,
  VendorResponse,
  BuyItemRequest,
  SellItemRequest,
  TransactionResponse
} from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendors`;

  // Signals for vendor state
  private currentVendorSignal = signal<Vendor | null>(null);
  private isVendorOpenSignal = signal<boolean>(false);

  // Public readonly signals
  readonly currentVendor = this.currentVendorSignal.asReadonly();
  readonly isVendorOpen = this.isVendorOpenSignal.asReadonly();

  /**
   * Get vendor information and stock
   */
  getVendor(vendorId: string): Observable<VendorResponse> {
    return this.http.get<VendorResponse>(`${this.apiUrl}/${vendorId}`).pipe(
      tap(response => {
        this.currentVendorSignal.set(response.vendor);
        this.isVendorOpenSignal.set(true);
      })
    );
  }

  /**
   * Buy an item from a vendor
   */
  buyItem(vendorId: string, itemId: string, quantity: number = 1): Observable<TransactionResponse> {
    const request: BuyItemRequest = { itemId, quantity };
    return this.http.post<TransactionResponse>(`${this.apiUrl}/${vendorId}/buy`, request);
  }

  /**
   * Sell an item to a vendor
   */
  sellItem(vendorId: string, instanceId: string, quantity: number = 1): Observable<TransactionResponse> {
    const request: SellItemRequest = { instanceId, quantity };
    return this.http.post<TransactionResponse>(`${this.apiUrl}/${vendorId}/sell`, request);
  }

  /**
   * Close vendor UI and clear current vendor
   */
  closeVendor(): void {
    this.currentVendorSignal.set(null);
    this.isVendorOpenSignal.set(false);
  }

  /**
   * Set current vendor (used when opening vendor from location)
   */
  setCurrentVendor(vendor: Vendor): void {
    this.currentVendorSignal.set(vendor);
    this.isVendorOpenSignal.set(true);
  }
}
