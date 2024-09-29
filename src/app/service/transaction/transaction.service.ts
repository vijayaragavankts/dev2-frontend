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
    return this.http.post<Transaction>(
      `${this.baseUrl}/create`,
      transaction,
      {}
    );
  }

  // Get a transaction by ID
  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  // Get transactions by Customer ID
  getTransactionsByCustomerId(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  // Get all transactions
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/all`);
  }
}
