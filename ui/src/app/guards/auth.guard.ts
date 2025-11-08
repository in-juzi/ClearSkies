import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs/operators';

/**
 * Auth guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth service to initialize before checking authentication
  return authService.initialized$.pipe(
    filter(initialized => initialized),
    take(1),
    map(() => {
      const isAuth = authService.isAuthenticated();

      if (isAuth) {
        return true;
      }

      // Store the attempted URL for redirecting after login
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });

      return false;
    })
  );
};

/**
 * Guest guard to prevent authenticated users from accessing login/register
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth service to initialize before checking authentication
  return authService.initialized$.pipe(
    filter(initialized => initialized),
    take(1),
    map(() => {
      if (!authService.isAuthenticated()) {
        return true;
      }

      // Redirect authenticated users to game
      router.navigate(['/game']);
      return false;
    })
  );
};
