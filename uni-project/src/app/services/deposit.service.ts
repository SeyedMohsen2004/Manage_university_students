import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private API_POST_DEPOSIT = environment.baseUrl + environment.wallet.deposit;

  constructor(private http: HttpClient) {}

  deposit(amount: number): Observable<any> {
    return this.http.post(this.API_POST_DEPOSIT, { amount });
  }
}
