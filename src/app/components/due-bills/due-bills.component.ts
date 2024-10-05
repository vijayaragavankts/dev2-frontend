import { Component } from '@angular/core';
import { Bill } from '../../model/Bill';
import { BillService } from '../../service/bill/bill.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../service/theme/theme.service';

@Component({
  selector: 'app-due-bills',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './due-bills.component.html',
  styleUrls: ['./due-bills.component.css'], // Corrected to styleUrls
})
export class DueBillsComponent {
  customerId: string = '';
  unpaidBills: Bill[] = [];
  loading: boolean = true; // Loading state
  selectedBill: Bill | null = null;

  constructor(
    private billService: BillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.fetchInvoices();
  }

  fetchInvoices() {
    this.loading = true; // Set loading state to true before fetching
    this.billService.getBills(this.customerId).subscribe(
      (data) => {
        this.unpaidBills = data.filter(
          (bill) => bill.status === 'PENDING' || bill.status === 'PARTIALLY'
        );
        this.loading = false; // Set loading to false once data is fetched
      },
      (error) => {
        console.error('Error fetching invoices', error);
        this.loading = false; // Set loading to false in case of error
      }
    );
  }

  openBillDetails(bill: Bill) {
    this.selectedBill = bill; // Set the selected bill
    this.router.navigate(['/dashboard/payment-gateway'], {
      queryParams: { billId: bill.invoice_id },
    });
  }

  closeModal() {
    this.selectedBill = null; // Clear the selected bill to close the modal
  }
}
