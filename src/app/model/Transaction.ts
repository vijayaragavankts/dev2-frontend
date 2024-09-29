import { Bill } from './Bill';
import { CardDetails } from './CardDetails';
import { Customer } from './Customer';
import { WalletDetails } from './WalletDetails';

export interface Transaction {
  transactionId: number;
  customer: Customer;
  invoice: Bill;
  amount: number;
  status: string;
  transactionDate: string; // ISO string format for LocalDateTime
  paymentMethod: string;
  isEarly: boolean;
  invoice_status: string;
  cardDetails?: CardDetails; // Optional since it's nullable
  walletDetails?: WalletDetails; // Optional since it's nullable
}
