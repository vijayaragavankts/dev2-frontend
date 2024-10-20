import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../model/Transaction';
import { TransactionService } from '../../service/transaction/transaction.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  customerId: string = '';
  transactions: Transaction[] = [];
  loading: boolean = true; // New loading state
  filteredTransactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;

  searchQuery: string = ''; // For searching
  selectedStatus: string = ''; // For filtering by payment status
  selectedPaymentMethod: string = ''; // For filtering by payment method
  sortOrder: string = 'asc'; // For sorting
  showStatusDropdown: boolean = false;
  showPaymentMethodDropdown: boolean = false;
  showSortDropdown: boolean = false;
  showDateDropdown: boolean = false;
  openTransactionIndex: number | null = null;
  sortDateOrder: string = '';

  statuses: string[] = ['FAILED', 'SUCCESS'];
  paymentMethods: string[] = ['card', 'cash', 'wallet'];
  sortOptions: string[] = ['Early', 'Recent'];

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    this.fetchTransactions();
  }

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  fetchTransactions() {
    this.transactionService
      .getTransactionsByCustomerId(this.customerId)
      .subscribe(
        (data: any) => {
          this.transactions = data;
          this.filteredTransactions = data;
          this.applyFilters();
          this.loading = false;
        },
        (error) => {
          console.log('Error in fetching transactions' + error);
          this.loading = false;
        }
      );
  }

  toggleTransaction(index: number) {
    if (this.openTransactionIndex === index) {
      this.openTransactionIndex = null;
    } else {
      this.openTransactionIndex = index;
    }
  }

  isTransactionOpen(index: number): boolean {
    return this.openTransactionIndex === index;
  }

  applyFilters() {
    // Search filter
    let filtered = this.filteredTransactions.filter((transaction) => {
      const searchString = this.searchQuery.toLowerCase();
      console.log(this.searchQuery);

      // Ensure transactionId and amount are not null/undefined before calling toString()
      const transactionIdString = transaction.transactionId
        ? transaction.transactionId.toString()
        : '';
      const amountString = transaction.amount
        ? transaction.amount.toString()
        : '';

      return (
        transactionIdString.includes(searchString) ||
        amountString.includes(searchString)
      );
    });

    // Filter by payment status
    if (this.selectedStatus) {
      filtered = filtered.filter(
        (transaction) => transaction.status === this.selectedStatus
      );
    }

    // Filter by payment method
    if (this.selectedPaymentMethod) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.paymentMethod === this.selectedPaymentMethod
      );
    }

    // Sort by amount
    if (this.sortOrder === 'asc') {
      filtered.sort((a, b) => a.amount - b.amount);
    } else {
      filtered.sort((a, b) => b.amount - a.amount);
    }

    // Sort by date (Early or Recent)
    if (this.sortDateOrder === 'Early') {
      filtered.sort(
        (a, b) =>
          new Date(a.transactionDate).getTime() -
          new Date(b.transactionDate).getTime()
      ); // Sort oldest first
    } else if (this.sortDateOrder === 'Recent') {
      filtered.sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      ); // Sort newest first
    }

    this.transactions = filtered;
  }

  toggleDropdown(type: 'status' | 'payment' | 'sort' | 'date') {
    if (type === 'status') {
      this.showStatusDropdown = !this.showStatusDropdown;
      this.showPaymentMethodDropdown = false;
      this.showSortDropdown = false;
      this.showDateDropdown = false;
    } else if (type === 'payment') {
      this.showPaymentMethodDropdown = !this.showPaymentMethodDropdown;
      this.showStatusDropdown = false;
      this.showSortDropdown = false;
      this.showDateDropdown = false;
    } else if (type === 'sort') {
      this.showSortDropdown = !this.showSortDropdown;
      this.showStatusDropdown = false;
      this.showPaymentMethodDropdown = false;
      this.showDateDropdown = false;
    } else if (type === 'date') {
      this.showDateDropdown = !this.showDateDropdown;
      this.showStatusDropdown = false;
      this.showPaymentMethodDropdown = false;
      this.showSortDropdown = false;
    }
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }

  selectStatus(status: string) {
    console.log(status);

    this.selectedStatus = status;
    this.applyFilters();
    this.showStatusDropdown = false;
  }

  selectPaymentMethod(method: string) {
    console.log(method);
    this.selectedPaymentMethod = method;
    this.applyFilters();
    this.showPaymentMethodDropdown = false;
  }

  selectSortOrder(order: string) {
    console.log(order);
    this.sortOrder = order;
    this.applyFilters();
    this.showSortDropdown = false;
  }

  selectSortDateOrder(order: string) {
    this.sortDateOrder = order;
    this.applyFilters(); // Re-apply the filters after selecting the sort order
    this.showDateDropdown = false; // Close the dropdown after selection
  }

  openTransactionDetails(transaction: Transaction) {
    this.selectedTransaction = transaction; // Set the selected transaction
    this.router.navigate(['/dashboard/transaction-details'], {
      queryParams: { transactionId: transaction.transactionId },
    });
  }

  retryPayment(bill: number) {
    this.router.navigate(['/dashboard/payment-gateway'], {
      queryParams: { billId: bill },
    });
  }
  navigateToBills() {
    this.router.navigate(['/dashboard/due-bills']); // Adjust the route as necessary
  }

  downloadPdf(trans: Transaction) {
    if (trans !== null) {
      this.transactionService
        .downloadReceipt(trans.transactionId)
        .subscribe((response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'receipt.pdf';
          a.click();

          window.URL.revokeObjectURL(url);
        });
    }
  }
}
