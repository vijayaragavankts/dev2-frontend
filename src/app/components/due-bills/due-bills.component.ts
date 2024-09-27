import { Component } from '@angular/core';
import { Bill } from '../../model/Bill';
import { BillService } from '../../service/bill/bill.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-due-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './due-bills.component.html',
  styleUrl: './due-bills.component.css',
})
export class DueBillsComponent {
  customerId: string = '';
  bills: Bill[] = [];
  unpaidBills: Bill[] = [];
  selectedBill: Bill | null = null;

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.fetchInvoices();
  }

  constructor(private billService: BillService) {}

  fetchInvoices() {
    this.billService.getBills(this.customerId).subscribe(
      (data) => {
        this.bills = data;
        console.log(this.bills);
        this.filterUnpaidBills();
      },
      (error) => {
        console.error('Error fetching invoices', error);
      }
    );
  }
  filterUnpaidBills() {
    // Assuming the Bill model has a 'status' property
    this.unpaidBills = this.bills.filter((bill) => bill.status === 'PENDING');
    console.log(this.unpaidBills); // Log unpaid bills
  }

  openBillDetails(bill: Bill) {
    this.selectedBill = bill; // Set the selected bill
  }

  closeModal() {
    this.selectedBill = null; // Clear the selected bill to close the modal
  }
}
