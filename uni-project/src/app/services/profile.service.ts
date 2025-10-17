import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_ME = environment.baseUrl + environment.studentAuth.me;
  private API_UPDATE_PROFILE = environment.baseUrl + environment.studentAuth.updateProfile;
  private API_CHANGE_PASSWORD = environment.baseUrl + environment.studentAuth.changePassword;

  private userProfileSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userProfileSubject.asObservable();

  private amountSubject = new BehaviorSubject<string | null>(null);
  amount$ = this.amountSubject.asObservable();

  private profileImageSubject = new BehaviorSubject<string | null>(null);
  profileImage$ = this.profileImageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserProfile();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  loadUserProfile(): void {
    this.getProfile().subscribe({
      next: (profile) => {
        this.userProfileSubject.next(profile);
        if (profile.amount !== undefined) {
          this.amountSubject.next(profile.amount);
        }
        if (profile.profile_image) {
          this.profileImageSubject.next(profile.profile_image);
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
      },
    });
  }

  getCurrentUserProfile(): any {
    return this.userProfileSubject.value;
  }

  getProfile(): Observable<any> {
    return this.http.get(this.API_ME, { headers: this.getAuthHeaders() });
  }

  getProfileText(): Observable<string> {
    const token = localStorage.getItem('token');
    return this.http.get(this.API_ME, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'text', 
    });
  }

updateProfile(profileData: FormData): Observable<any> {
  return this.http.put(this.API_UPDATE_PROFILE, profileData, {
    headers: this.getAuthHeaders()  
  });
}


  changePassword(passwordData: any): Observable<any> {
    return this.http.post(this.API_CHANGE_PASSWORD, passwordData, { headers: this.getAuthHeaders() });
  }

  updateAmount(newAmount: string) {
    this.amountSubject.next(newAmount);
  }
}
