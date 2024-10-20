import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Bill } from '../../model/Bill';
import { BillService } from '../../service/bill/bill.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { TransactionService } from '../../service/transaction/transaction.service';
import { CardService } from '../../service/card/card.service';
import { CardDetails } from '../../model/CardDetails';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OtpService } from '../../service/otp/otp.service';
import { WalletDetails } from '../../model/WalletDetails';
import { WalletService } from '../../service/wallet/wallet.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  customerId: string = '';
  billId: number | null = null;
  cardId: number | null = null;
  walletId: number | null = null;
  paymentMethod: string | null = null;
  selectedBill: Bill | null = null;
  isEarly: boolean = false;

  baseDiscount: number = 5; // Default discount percentage
  earlyPaymentDiscount: number = 5; // Additional early payment discount
  finalAmount: number | null = null; // Amount after discounts
  paymentForm: FormGroup; // Reactive Form
  otpRequested = false;
  otpForm: FormGroup;
  cardDetails: CardDetails | null = null;
  walletDetails: WalletDetails | null = null;

  isLoading: boolean = false; // Add loader flag

  isPartialPayment: boolean = false;
  isToggleDisabled: boolean = false;
  isInputDisabled: boolean = false;
  isOtpSendDisabled: boolean = false;
  isConfirmButtonDisabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private billService: BillService,
    private transactionService: TransactionService,
    private cardService: CardService,
    private router: Router,
    private fb: FormBuilder, // Inject FormBuilder
    private snackbar: MatSnackBar,
    private otpService: OtpService,
    private walletService: WalletService
  ) {
    // Initialize the reactive form
    this.paymentForm = this.fb.group({
      paymentAmount: ['', [Validators.required, Validators.min(1)]],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.billId = params['billId'];
      this.cardId = params['cardId'];
      this.walletId = params['walletId'];
      this.paymentMethod = this.cardId ? 'card' : 'wallet';
    });
    console.log(this.cardId);
    console.log(this.walletId);

    this.customerId = localStorage.getItem('customerId') || '';
    this.fetchBillDetails();
    if (this.cardId !== undefined) {
      this.getCardDetails();
    }
    if (this.walletId !== undefined) {
      this.getWalletDetails();
    }
  }

  fetchBillDetails() {
    if (this.billId) {
      this.billService.getBillsByInvoiceId(this.billId).subscribe(
        (bill: Bill) => {
          this.selectedBill = bill;
          this.calculateFinalAmount();
          console.log(bill);
        },
        (error) => {
          console.error('Error fetching bill details', error);
        }
      );
    }
  }

  getCardDetails() {
    if (this.cardId !== null) {
      this.cardService.getCardDetailsByCardId(this.cardId).subscribe(
        (data: CardDetails) => {
          this.cardDetails = data;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching card details:', error);
        }
      );
    }
  }

  getWalletDetails() {
    if (this.walletId !== null) {
      this.walletService.getWalletDetails(this.walletId).subscribe(
        (data: WalletDetails) => {
          this.walletDetails = data;
        },
        (error) => {
          console.error('Error fetching wallet details:', error);
        }
      );
    }
  }

  calculateFinalAmount() {
    if (this.selectedBill) {
      const baseAmount = this.selectedBill.amount;
      const dueDate = new Date(this.selectedBill.due_date);
      const currentDate = new Date();

      if (this.selectedBill.status === 'PARTIALLY') {
        this.finalAmount = baseAmount;
        console.log('partial');
      } else {
        console.log('full payment');

        let totalDiscount = this.baseDiscount; // Default 5%
        if (currentDate <= dueDate) {
          this.isEarly = true;
          totalDiscount += this.earlyPaymentDiscount; // Additional 5% for early payment
        }
        this.finalAmount = baseAmount - (baseAmount * totalDiscount) / 100;
      }
    }
  }

  makePayment() {
    // Validate fields before making payment
    const paymentAmount = this.isPartialPayment
      ? this.paymentForm.get('paymentAmount')?.value
      : this.finalAmount;

    if (paymentAmount <= 0 || !paymentAmount) {
      console.error('Invalid payment amount');
      this.isConfirmButtonDisabled = false;
      this.snackbar.open(
        'Invalid payment amount. Please enter a valid amount.',
        'Close',
        {
          duration: 2000, // Duration of the toast in milliseconds
        }
      );
      return;
    }

    const paymentData: any = {
      customerId: this.customerId,
      invoiceId: this.billId,
      amount: paymentAmount,
      paymentMethod: this.paymentMethod,
      cardId: this.cardDetails?.id,
      isEarly: this.isEarly,
      transactionId: 99999, // Optional, can be generated by the backend
      status: 'pending',
      transactionDate: new Date(),
      invoiceStatus: 'pending',
    };

    // Call the service to make payment
    this.transactionService.createTransaction(paymentData).subscribe(
      (response: any) => {
        if (response.success) {
          // Successful payment
          console.log('Payment successful', response);

          this.snackbar.open('Payment Successful', 'Close', {
            duration: 2000, // Duration of the toast in milliseconds
          });
          setTimeout(() => {
            this.router.navigate(['/dashboard/due-bills']);
          }, 1000);
        } else {
          // Handle API error response
          console.error('Payment failed: ', response.message);

          this.snackbar.open(
            response.message || 'Payment failed. Please try again.',
            'Close',
            {
              duration: 2000, // Duration of the toast in milliseconds
            }
          );
        }
      },
      (error) => {
        // Handle HTTP error response
        console.error('Error processing payment', error);
        this.snackbar.open('Payment failed. Please try again.', 'Close', {
          duration: 2000, // Duration of the toast in milliseconds
        });
      }
    );
  }

  requestOTP() {
    this.isOtpSendDisabled = true;
    const paymentAmount = this.isPartialPayment
      ? this.paymentForm.get('paymentAmount')?.value
      : this.finalAmount;

    if (paymentAmount <= 0) {
      this.snackbar.open('Invalid payment amount', 'Close', {
        duration: 2000,
      });
      return;
    }

    if (this.isPartialPayment) {
      // if it is partial payment is enabled we want to disable the toggle
      this.isToggleDisabled = true;
      this.isInputDisabled = true;
      // 20% of the final amount should be paid in partial payment
      if (this.finalAmount !== null && this.finalAmount * 0.2 > paymentAmount) {
        this.snackbar.open(
          'Payment amount must be at least 20% of the total invoice amount.',
          'Close',
          {
            duration: 4000,
          }
        );
        this.isInputDisabled = false;
        this.isOtpSendDisabled = false;
        return;
      } else if (
        this.finalAmount !== null &&
        this.finalAmount * 0.9 < paymentAmount &&
        paymentAmount < this.finalAmount
      ) {
        this.snackbar.open(
          'The remaining balance is too small to allow partial payment. Please pay the full amount.',
          'Close',
          {
            duration: 4000,
          }
        );
        this.isInputDisabled = false;
        this.isOtpSendDisabled = false;
        return;
      }
    } else {
      this.isToggleDisabled = true;
    }

    this.isLoading = true;

    this.otpService.sendOtp(this.customerId).subscribe(
      (response) => {
        if (response.success) {
          this.isLoading = false;
          this.otpRequested = true; // Display the OTP input box
          this.snackbar.open('OTP sent to your email', 'Close', {
            duration: 2000,
          });
        } else {
          this.isLoading = false;
          console.log('Otp not sent');
          console.log(response.message);

          this.snackbar.open('Failed to sent email', 'Close', {
            duration: 2000,
          });
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error requesting OTP', error);
        this.snackbar.open('Failed to send OTP. Please try again.', 'Close', {
          duration: 2000,
        });
      }
    );
  }

  verifyOTP() {
    const otp = this.otpForm.get('otp')?.value;
    this.isConfirmButtonDisabled = true;
    if (!otp) {
      this.snackbar.open('Please enter the OTP', 'Close', {
        duration: 2000,
      });
      return;
    }

    // this.isLoading = true; // Start loader

    this.otpService.validateOtp(otp).subscribe(
      (response) => {
        this.isLoading = false; // Stop loader
        if (response.success) {
          this.makePayment();
        } else {
          this.isConfirmButtonDisabled = false;
          this.snackbar.open('Invalid OTP. Please try again.', 'Close', {
            duration: 2000,
          });
        }
      },
      (error) => {
        this.isLoading = false; // Stop loader
        this.isConfirmButtonDisabled = false;
        console.error('Error verifying OTP', error);
        this.snackbar.open('Error verifying OTP. Please try again.', 'Close', {
          duration: 2000,
        });
      }
    );
  }

  private showSnackbar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right', // Adjust position as needed
      verticalPosition: 'bottom', // Adjust position as needed
    });
  }
}
