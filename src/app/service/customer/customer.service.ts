import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../model/Customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  getCustomer(customerId: string): Observable<Customer> {
    const url = `${this.baseUrl}/${customerId}`;
    return this.http.get<Customer>(url);
  }
}
