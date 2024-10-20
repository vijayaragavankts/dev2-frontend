import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../service/customer/customer.service';
import { Customer } from '../../model/Customer';
import { CommonModule } from '@angular/common';
import { CardDetails } from '../../model/CardDetails';
import { CardService } from '../../service/card/card.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WalletService } from '../../service/wallet/wallet.service';
import { WalletDetails } from '../../model/WalletDetails';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  @ViewChild('cardFormSection') cardFormSection!: ElementRef;
  customerId: string = '';
  walletId: number | null = null;
  customerData: Customer | null = null;
  cardDetailsForm: FormGroup;
  submitted = false;
  paymentMethod: string | null = null;
  cards: CardDetails[] = [];
  walletDetails: WalletDetails | null = null;
  loading: boolean = false;
  selectedCardIndex: number | null = null;

  amountForm: FormGroup;
  submittedCredit = false;

  amount: number = 0; // Model to hold amount from input

  months: string[] = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  years: string[] = [
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
    '2031',
    '2032',
    '2033',
    '2034',
    '2035',
    '2036',
    '2037',
  ];

  constructor(
    private customerService: CustomerService,
    private cardService: CardService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private walletService: WalletService
  ) {
    this.cardDetailsForm = this.fb.group({
      cardType: ['', Validators.required],
      cardHolderName: ['', Validators.required],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/),
        ],
      ],

      expMonth: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      expYear: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      cvv: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3),
          Validators.pattern('^[0-9]{3}$'),
        ],
      ],
      balance: ['', [Validators.required]],
      addAmount: ['', [Validators.min(1)]],
    });
    this.amountForm = this.fb.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/), // Allows only digits
          Validators.min(1), // Value must be greater than 0
        ],
      ],
    });
  }

  editCard(index: number) {
    this.selectedCardIndex = index;
    const card = this.cards[index];

    if (card.expiryDate) {
      const [expMonth, expYear] = card.expiryDate.split('/');
      this.cardDetailsForm.patchValue({
        cardType: card.cardType,
        expMonth: expMonth,
        expYear: expYear,
        cardNumber: card.cardNumber,
        cardHolderName: card.cardHolderName,
        cvv: card.cvv,
        balance: card.balance,
      });

      // Ensure scroll is triggered after form update
      setTimeout(() => {
        this.scrollToCardForm();
      }, 100);
    }
  }

  scrollToCardForm() {
    if (this.cardFormSection) {
      this.cardFormSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      console.log('Scrolling to form section');
    } else {
      console.log('cardFormSection not found');
    }
  }

  ngOnInit(): void {
    this.customerId = localStorage.getItem('customerId') || '';
    console.log('Customer Id');
    this.loadCustomer();
    this.fetchSavedCards();
  }

  loadCustomer() {
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (data: Customer) => {
        this.customerData = data;
        this.walletId = data.id;
        console.log(data);
        this.fetchWalletDetails();
      },
      error: (err) => {
        console.error('Error fetching customer data:', err);
      },
    });
  }
  fetchSavedCards() {
    this.loading = true; // Start loading
    this.cardService.getCardDetails(this.customerId).subscribe(
      (data) => {
        console.log(data);
        this.cards = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching cards:', error);
        this.loading = false;
      }
    );
  }

  fetchWalletDetails() {
    if (this.walletId !== null) {
      this.walletService.getWalletDetails(this.walletId).subscribe(
        (data: WalletDetails) => {
          this.walletDetails = data;
          console.log(this.walletDetails);
        },
        (error) => {
          console.error('Error fetching wallet details:', error);
        }
      );
    }
  }

  onCreditSubmit() {
    this.submittedCredit = true;

    if (this.amountForm.valid) {
      const amount = this.amountForm.get('amount')?.value;
      // Call your service here to credit the wallet
      this.creditWallet(amount);
    }
  }

  creditWallet(amount: number): void {
    if (this.amountForm.invalid) {
      // If the form is invalid, do not proceed
      this.submittedCredit = true; // Set this to show validation errors
      return;
    }
    this.walletService.creditWallet(this.customerId, amount).subscribe(
      (response) => {
        if (response.success) {
          this.snackbar.open('Amount Added to wallet Successfully', 'Close', {
            duration: 4000, // Duration of the toast in milliseconds
          });
          this.amountForm.reset();
          this.submittedCredit = false;
          this.fetchWalletDetails();
        } else {
          this.snackbar.open('Amount not added to the wallet :(', 'Close', {
            duration: 2000, // Duration of the toast in milliseconds
          });
        }
      },
      (error) => {
        console.error('Error crediting wallet:', error);
        this.snackbar.open('Error adding amount to the wallet', 'Close', {
          duration: 2000, // Duration of the toast in milliseconds
        });
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.cardDetailsForm.invalid) {
      return;
    }
    if (this.cardDetailsForm.valid) {
      const amountToAdd = this.cardDetailsForm.get('addAmount')?.value || 0;
      const cardNumberWithoutSpaces = this.cardDetailsForm
        .get('cardNumber')
        ?.value.replace(/\s+/g, '');

      if (this.selectedCardIndex !== null) {
        const selectedCard = this.cards[this.selectedCardIndex];
        const cardId: number | undefined = selectedCard.id; // Assuming this is how you get your cardId

        if (cardId !== undefined) {
          this.cardService.addAmountToCard(cardId, amountToAdd).subscribe(
            (response) => {
              // this.fetchSavedCards();
              console.log('Amount added:', response);
              this.updateCardDetails(cardId, response.balance);
              this.cardDetailsForm.reset({
                cardType: '', // Default empty
                cardHolderName: '',
                cardNumber: '',
                expMonth: '', // Default empty
                expYear: '', // Default empty
                cvv: '',
                addAmount: '',
              });
            },
            (error) => {
              console.error('Error adding amount:', error);
            }
          );
        } else {
          console.error('Card ID is undefined.');
        }
      }
      this.selectedCardIndex = null; // Reset after saving
    }
  }

  updateCardDetails(cardId: number, newBalance: number) {
    const cardNumberWithoutSpaces = this.cardDetailsForm
      .get('cardNumber')
      ?.value.replace(/\s+/g, '');
    // Create a CardDetails object with the updated information from the form
    const updatedCardDetails: CardDetails = {
      id: cardId, // Make sure you set the ID
      customerId: this.customerId,
      cardNumber: cardNumberWithoutSpaces,
      cardHolderName: this.cardDetailsForm.get('cardHolderName')?.value,
      expiryDate:
        this.cardDetailsForm.get('expMonth')?.value +
        '/' +
        this.cardDetailsForm.get('expYear')?.value,
      cvv: this.cardDetailsForm.get('cvv')?.value,
      cardType: this.cardDetailsForm.get('cardType')?.value,
      balance: newBalance, // Update this based on the new balance if necessary
    };

    // Call the update service method
    this.cardService.updateCardDetails(cardId, updatedCardDetails).subscribe(
      (updatedCard) => {
        console.log('Card updated successfully:', updatedCard);
        this.fetchSavedCards(); // Refresh the card list
        this.cardDetailsForm.reset(); // Reset the form
      },
      (error) => {
        console.error('Error updating card details:', error);
      }
    );
  }

  getCardIconClass(cardType: string): string {
    switch (cardType.toLowerCase()) {
      case 'visa':
        return 'fab fa-cc-visa visa-icon';
      case 'mastercard':
        return 'fab fa-cc-mastercard mastercard-icon';
      case 'amex':
        return 'fab fa-cc-amex amex-icon ';
      case 'discover':
        return 'fab fa-cc-discover discover-icon';
      case 'jcb':
        return 'fab fa-cc-jcb jcb-icon';
      case 'dinersclub':
        return 'fab fa-cc-diners-club dinersclub-icon';
      case 'rupay':
        return 'fas fa-credit-card generic-card-icon';
      default:
        return 'fas fa-credit-card generic-card-icon'; // Default icon
    }
  }

  formatCardNumber(cardNumber: string): string {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  formatCardNumberInput(event: any) {
    const input = event.target.value.replace(/\s+/g, ''); // Remove spaces
    event.target.value = input.replace(/(\d{4})(?=\d)/g, '$1 '); // Insert space after every 4 digits
    console.log(event.target.value);
  }
}
