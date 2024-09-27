export interface Customer {
  customerId: string;
  customer_createdAt: string; // Assuming it's a string; consider using Date if you're parsing it
  email: string;
  id: number;
  name: string;
  phoneNumber: string;
}
