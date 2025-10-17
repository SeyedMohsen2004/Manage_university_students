import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { ProfileService } from './profile.service'; 

@Injectable({
  providedIn: 'root'
})
export class CourseReserveService {
  private amountSubject = new BehaviorSubject<string | null>(null);
  amount$ = this.amountSubject.asObservable();

  constructor(private http: HttpClient, private profileService: ProfileService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getCourses(): Observable<any> {
    return this.http.get(environment.baseUrl + environment.course.get, {
      headers: this.getAuthHeaders()
    });
  }

  reserveCourse(courseId: number | string): Observable<any> {
    const url = environment.baseUrl + environment.course.reserve(courseId);
    return this.http.post(url, {}, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
        if (res.new_amount !== undefined) {
          this.amountSubject.next(res.new_amount);
          this.profileService.updateAmount(res.new_amount);
        }
      })
    );
  }

  cancelReservation(reservationId: number | string): Observable<any> {
    const url = environment.baseUrl + environment.course.cancel(reservationId);
    return this.http.post(url, {}, { headers: this.getAuthHeaders() }).pipe(
      tap((res: any) => {
        if (res.new_amount !== undefined) {
          this.amountSubject.next(res.new_amount);
          this.profileService.updateAmount(res.new_amount); 
        }
      })
    );
  }
}
