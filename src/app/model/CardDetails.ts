import { Customer } from './Customer';

export interface CardDetails {
  id: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string; // Can store as string (e.g., 'MM/YY')
  cvv: string;
  cardType: string;
  customer: Customer;
}
