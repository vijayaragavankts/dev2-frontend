import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  sendOtp(customerId: string): Observable<any> {
    const params = new HttpParams().set('customerId', customerId);
    return this.http.post<any>(`${this.baseUrl}/validate`, {}, { params });
  }

  validateOtp(enteredOtp: string): Observable<any> {
    console.log('Otp is :', enteredOtp);

    const params = new HttpParams().set('enteredOtp', enteredOtp);
    return this.http.post<any>(`${this.baseUrl}/validateOtp`, {}, { params });
  }
}
