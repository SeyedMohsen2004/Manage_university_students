import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IAuthCredentials } from '../../interfaces/interfaces';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_REGISTER = environment.baseUrl + environment.studentAuth.register;
  private API_LOGIN = environment.baseUrl + environment.studentAuth.login;
  private API_ME = environment.baseUrl + environment.studentAuth.me;
  private API_REFRESH = environment.baseUrl + '/api/token/refresh/';

  private userProfileSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUserProfile(): void {
    this.getProfile().subscribe({
      next: (profile) => this.userProfileSubject.next(profile),
      error: (error) => console.error('Error loading profile:', error),
    });
  }

  getCurrentUserProfile(): any {
    return this.userProfileSubject.value;
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(this.API_REGISTER, formData);
  }

  login(userData: IAuthCredentials): Observable<any> {
    return this.http.post(this.API_LOGIN, userData).pipe(
      tap((res: any) => {
        if (res.access) {
          localStorage.setItem('token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.userProfileSubject.next(null);
  }

refreshToken(): Observable<any> {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return throwError(() => new Error('No refresh token'));

  return this.http.post(this.API_REFRESH, { refresh }).pipe(
    tap((res: any) => {
      if (res.access) {
        localStorage.setItem('token', res.access);
      }
      if (res.refresh) {
        localStorage.setItem('refresh_token', res.refresh); 
      }
    })
  );
}


  getProfile(): Observable<any> {
    return this.http.get(this.API_ME);
  }
}
