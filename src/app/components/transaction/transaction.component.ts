import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../model/Transaction';
import { TransactionService } from '../../service/transaction/transaction.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  customerId: string = '';
  transactions: Transaction[] = [];
  loading: boolean = true; // New loading state

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    console.log('Hi');
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
        (data) => {
          this.transactions = data;
          console.log(this.transactions);
          this.loading = false;
        },
        (error) => {
          console.log('Error in fetching transactions' + error);
          this.loading = false;
        }
      );
  }
  navigateToBills() {
    this.router.navigate(['/dashboard/due-bills']); // Adjust the route as necessary
  }
}
