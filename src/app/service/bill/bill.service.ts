import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../../model/Bill';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private baseUrl = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) {}

  getBills(customerId: string): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.baseUrl}/${customerId}`);
  }
  getBillsByInvoiceId(invoiceId: number): Observable<Bill> {
    return this.http.get<any>(`${this.baseUrl}/invoice/${invoiceId}`);
  }
}
