import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import {
  User,
  Player,
  AuthResponse,
  RegisterRequest,
  LoginRequest
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'clearskies_token';

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private currentPlayerSignal = signal<Player | null>(null);
  private loadingSignal = signal<boolean>(false);
  private initializingSignal = signal<boolean>(true);
  private initializedSubject = new BehaviorSubject<boolean>(false);

  // Public read-only signals
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly currentPlayer = this.currentPlayerSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly initializing = this.initializingSignal.asReadonly();
  readonly initialized$ = this.initializedSubject.asObservable();

  // Computed signals
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly playerLevel = computed(() => this.currentPlayerSignal()?.level ?? 0);
  readonly playerGold = computed(() => this.currentPlayerSignal()?.gold ?? 0);

  constructor() {
    // Check for existing token on init
    this.checkAuth();
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Login user
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap(response => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.loadingSignal.set(true);

    // Call logout endpoint (optional)
    this.http.post(`${this.API_URL}/logout`, {}).subscribe({
      next: () => {
        this.clearAuth();
      },
      error: () => {
        // Clear auth even if request fails
        this.clearAuth();
      }
    });
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<{ success: boolean; data: { user: User; player: Player | null } }> {
    this.loadingSignal.set(true);
    return this.http.get<{ success: boolean; data: { user: User; player: Player | null } }>(
      `${this.API_URL}/me`
    ).pipe(
      tap(response => {
        if (response.success) {
          this.currentUserSignal.set(response.data.user);
          this.currentPlayerSignal.set(response.data.player);
        }
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.loadingSignal.set(false);
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  private checkAuth(): void {
    const token = this.getToken();

    if (token) {
      // Fetch user profile to verify token
      this.getProfile().subscribe({
        next: (response) => {
          this.initializingSignal.set(false);
          this.initializedSubject.next(true);
        },
        error: (error) => {
          // Clear auth without redirect - let the guard handle navigation
          this.clearAuth(false);
          this.initializingSignal.set(false);
          this.initializedSubject.next(true);
        }
      });
    } else {
      this.initializingSignal.set(false);
      this.initializedSubject.next(true);
    }
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.data.token);
    this.currentUserSignal.set(response.data.user);
    this.currentPlayerSignal.set(response.data.player);
    this.loadingSignal.set(false);
  }

  /**
   * Clear authentication state
   */
  private clearAuth(redirect: boolean = true): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSignal.set(null);
    this.currentPlayerSignal.set(null);
    this.loadingSignal.set(false);

    if (redirect) {
      this.router.navigate(['/login']);
    }
  }
}