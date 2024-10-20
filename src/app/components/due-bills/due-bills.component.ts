import { Component } from '@angular/core';
import { Bill } from '../../model/Bill';
import { BillService } from '../../service/bill/bill.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../service/theme/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-due-bills',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './due-bills.component.html',
  styleUrls: ['./due-bills.component.css'], // Corrected to styleUrls
})
export class DueBillsComponent {
  customerId: string = '';
  unpaidBills: Bill[] = [];
  filteredBills: Bill[] = []; // Filtered bills
  loading: boolean = true; // Loading state
  selectedBill: Bill | null = null;

  searchQuery: string = ''; // For searching
  selectedStatus: string = ''; // For filtering by status
  sortOrder: string = 'asc'; // For sorting
  showStatusDropdown: boolean = false;
  showSortDropdown: boolean = false;

  statuses: string[] = ['PENDING', 'PARTIALLY'];

  constructor(private billService: BillService, private router: Router) {}

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
        this.applyFilters();
        this.loading = false; // Set loading to false once data is fetched
      },
      (error) => {
        console.error('Error fetching invoices', error);
        this.loading = false; // Set loading to false in case of error
      }
    );
  }

  applyFilters() {
    // Search filter
    let filtered = this.unpaidBills.filter((bill) => {
      const searchString = this.searchQuery.toLowerCase();
      return (
        bill.invoice_id.toString().includes(searchString) ||
        bill.amount.toString().includes(searchString)
      );
    });

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter((bill) => bill.status === this.selectedStatus);
    }

    // Sort by amount
    if (this.sortOrder === 'asc') {
      filtered.sort((a, b) => a.amount - b.amount);
    } else {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    this.filteredBills = filtered;
  }

  toggleDropdown(type: 'status' | 'sort') {
    if (type === 'status') {
      this.showStatusDropdown = !this.showStatusDropdown;
      this.showSortDropdown = false;
    } else {
      this.showSortDropdown = !this.showSortDropdown;
      this.showStatusDropdown = false;
    }
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
    this.showStatusDropdown = false;
  }

  selectSortOrder(order: string) {
    this.sortOrder = order;
    this.applyFilters();
    this.showSortDropdown = false;
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
