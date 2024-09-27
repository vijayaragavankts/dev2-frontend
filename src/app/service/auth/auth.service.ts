import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn(): boolean {
    // Check local storage or session storage for a valid token
    return !!localStorage.getItem('customerId'); // Example check
  }
}
