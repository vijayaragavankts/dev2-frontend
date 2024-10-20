import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transaction } from '../../model/Transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api/transactions';
  constructor(private http: HttpClient) {}

  // Create a new transaction
  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}`, transaction, {});
  }

  // Get a transaction by ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  // Get transactions by Customer ID
  getTransactionsByCustomerId(customerId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/customer/${customerId}`
    );
  }

  // Get all transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/all`);
  }
  downloadReceipt(transactionId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/pdf/${transactionId}`, {
      responseType: 'blob', // Specify response type as Blob for file download
    });
  }
}
