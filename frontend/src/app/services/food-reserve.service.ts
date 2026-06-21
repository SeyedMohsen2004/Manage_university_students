import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root',
})
export class FoodReserveService {
  private API_GET_FOODSLIST = environment.baseUrl + environment.food.get;

  constructor(private http: HttpClient, private profileService: ProfileService) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getFoods(): Observable<any> {
    return this.http.get(this.API_GET_FOODSLIST, { headers: this.getAuthHeaders() });
  }

  reserveFood(foodId: number | string): Observable<any> {
    const url = environment.baseUrl + environment.food.reserve(foodId);
    return this.http.post(url, {}, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
        if (res.new_amount !== undefined) {
          this.profileService.updateAmount(res.new_amount); 
        }
      })
    );
  }

  cancelReservation(reservationId: number | string): Observable<any> {
    const url = environment.baseUrl + environment.food.cancel(reservationId);
    return this.http.post(url, {}, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
        if (res.new_amount !== undefined) {
          this.profileService.updateAmount(res.new_amount); 
        }
      })
    );
  }
}
