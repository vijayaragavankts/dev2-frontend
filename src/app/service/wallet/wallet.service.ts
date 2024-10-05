import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletDetails } from '../../model/WalletDetails';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = 'http://localhost:8080/api/wallet';
  constructor(private http: HttpClient) {}

  getWalletDetails(walletId: number): Observable<WalletDetails> {
    return this.http.get<WalletDetails>(`${this.apiUrl}/${walletId}`);
  }
}
