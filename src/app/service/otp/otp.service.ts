import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  sendOtp(customerId: string): Observable<string> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.post(
      `${this.baseUrl}/validate`,
      {},
      { params, responseType: 'text' }
    );
  }

  validateOtp(enteredOtp: string): Observable<string> {
    const params = new HttpParams().set('enteredOtp', enteredOtp);
    return this.http.post(
      `${this.baseUrl}/validateOtp`,
      {},
      { params, responseType: 'text' }
    );
  }
}
