import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/authentication/auth.service';
import { catchError, switchMap, throwError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const skipAuthUrls = ['/api/students/register/', '/api/students/login/'];
  const shouldSkip = skipAuthUrls.some((url) => req.url.includes(url));

  if (token && !shouldSkip) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.refreshToken().pipe(
            switchMap((res) => {
              const newToken = authService.getToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              authService.logOut();
              return throwError(() => refreshError);
            })
          );

        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
