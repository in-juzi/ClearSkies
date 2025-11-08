import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AttributesResponse, AttributeName } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {
  private apiUrl = `${environment.apiUrl}/attributes`;

  // Signal to hold attributes data
  attributes = signal<AttributesResponse | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Get all attributes for the current player
   */
  getAllAttributes(): Observable<AttributesResponse> {
    return this.http.get<AttributesResponse>(this.apiUrl).pipe(
      tap(attributes => this.attributes.set(attributes))
    );
  }

  /**
   * Get a specific attribute
   */
  getAttribute(attributeName: AttributeName): Observable<any> {
    return this.http.get(`${this.apiUrl}/${attributeName}`);
  }

  /**
   * Add experience to an attribute (for testing purposes)
   */
  addAttributeExperience(attributeName: AttributeName, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${attributeName}/experience`, { amount }).pipe(
      tap(() => this.getAllAttributes().subscribe()) // Refresh attributes after adding XP
    );
  }

  /**
   * Clear attributes data (e.g., on logout)
   */
  clearAttributes(): void {
    this.attributes.set(null);
  }
}
