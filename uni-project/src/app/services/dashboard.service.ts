import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API_GET_DASHBOARD = environment.baseUrl + environment.dashboard.get;

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<any> {
    return this.http.get(this.API_GET_DASHBOARD);
  }
}
