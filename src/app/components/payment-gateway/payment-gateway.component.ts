import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bill } from '../../model/Bill';
import { BillService } from '../../service/bill/bill.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css'],
})
export class PaymentGatewayComponent implements OnInit {
  billId: number | null = null;
  walletId: number | null = null;
  selectedBill: Bill | null = null;
  baseDiscount: number = 5; // Default discount percentage
  earlyPaymentDiscount: number = 5; // Additional early payment discount
  finalAmount: number | null = null; // Amount after discounts
  currentDate: Date = new Date(); // Current date
  dueDate: Date | null = null; // Due date

  customerId: string = '';

  constructor(
    private route: ActivatedRoute,
    private billService: BillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.billId = params['billId'] ? +params['billId'] : null;
    });
    this.fetchBillDetails();
    this.customerId = localStorage.getItem('customerId') || '';
  }

  fetchBillDetails() {
    if (this.billId) {
      this.billService.getBillsByInvoiceId(this.billId).subscribe(
        (bill: Bill) => {
          this.selectedBill = bill;
          this.calculateFinalAmount();
          this.walletId = bill.customer.id;
        },
        (error) => {
          console.error('Error fetching bill details', error);
        }
      );
    }
  }

  calculateFinalAmount() {
    if (this.selectedBill) {
      const baseAmount = this.selectedBill.amount;
      const currentDate = new Date();
      const dueDate = new Date(this.selectedBill.due_date);

      if (this.selectedBill.status === 'partially') {
        this.finalAmount = baseAmount;
      } else {
        // Calculate total discount
        let totalDiscount = this.baseDiscount; // Default 5%

        if (currentDate <= dueDate) {
          totalDiscount += this.earlyPaymentDiscount; // Additional 5% for early payment
          this.baseDiscount += this.earlyPaymentDiscount;
        }

        // Calculate the final amount after applying discounts
        this.finalAmount = baseAmount - (baseAmount * totalDiscount) / 100;
      }
    }
  }

  proceedToPay(method: string) {
    console.log(`Proceeding with payment method: ${method}`);
    if (method == 'wallet') {
      this.router.navigate([`/dashboard/paybill`], {
        queryParams: {
          billId: this.selectedBill?.invoice_id,
          walletId: this.walletId,
        },
      });
    } else {
      this.router.navigate([`/dashboard/payments/${method}`], {
        queryParams: { billId: this.selectedBill?.invoice_id },
      });
    }
  }
}
