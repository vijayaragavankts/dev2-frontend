import { Customer } from './Customer';

export interface WalletDetails {
  id: number;
  balance: number;
  customer: Customer;
}
