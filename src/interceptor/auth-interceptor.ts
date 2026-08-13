import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const authService = inject(AuthService);

  console.log("INTERCEPTOR CALLED");
  console.log('request URL:', req.url);
  const modifiedReq = req.clone({
    withCredentials: true
  })
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 &&
        !req.url.includes('/login') &&
        !req.url.includes('/refresh-token')) {
        authService.logout();
        return throwError(() => error);
      }
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(modifiedReq);
          }),
          catchError((refreshError: any) => {
            authService.clearAuthData();
            router.navigate(['/']);
            return throwError(() => refreshError);
          })
        )
      }
      return throwError(() => error);
    })
  )
};
