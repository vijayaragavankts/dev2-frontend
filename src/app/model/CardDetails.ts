import { Customer } from './Customer';

export interface CardDetails {
  id?: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate?: string; // Can store as string (e.g., 'MM/YY')
  expMonth?: string; // Expiry month (MM)
  expYear?: string;
  cvv: string;
  cardType: string;
  customerId: string;
  
}
