import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor to attach JWT token to outgoing requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token directly from localStorage to avoid circular dependency
  const token = localStorage.getItem('clearskies_token');

  // Clone request and add authorization header if token exists
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};