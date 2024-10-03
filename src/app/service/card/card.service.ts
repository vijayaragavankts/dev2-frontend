import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardDetails } from '../../model/CardDetails';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = 'http://localhost:8080/api/card-details'; // Update with your API URL

  constructor(private http: HttpClient) {}

  // Get card details by customer ID
  getCardDetails(customerId: string): Observable<CardDetails[]> {
    return this.http.get<CardDetails[]>(`${this.apiUrl}/${customerId}`);
  }

  // New method: Get card details by card ID
  getCardDetailsByCardId(cardId: number): Observable<CardDetails> {
    return this.http.get<CardDetails>(`${this.apiUrl}/card/${cardId}`);
  }

  // Post card details to the backend
  createCardDetails(cardDetails: CardDetails): Observable<CardDetails> {
    console.log(cardDetails);

    return this.http.post<CardDetails>(this.apiUrl, cardDetails);
  }

  addAmountToCard(cardId: number, amountToAdd: number): Observable<any> {
    const params = new HttpParams().set('amount', amountToAdd);
    return this.http.post<any>(`${this.apiUrl}/${cardId}/credit`, params);
  }

  updateCardDetails(
    cardId: number,
    cardDetails: CardDetails
  ): Observable<CardDetails> {
    return this.http.put<CardDetails>(`${this.apiUrl}/${cardId}`, cardDetails);
  }
}
