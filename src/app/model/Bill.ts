import { Customer } from './Customer';

export interface Bill {
  invoice_id: number;
  start_date: string; // You can use Date if you parse the date string
  due_date: string; // Same as above
  unit_consumed: number;
  amount: number;
  single_discount_amount: number;
  double_discount_amount: number;
  invoice_createdAt: string; // You can use Date if you parse the date string
  status: string;
  customer: Customer; // Link to Customer model
}
