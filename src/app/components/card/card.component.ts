import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Customer } from '../../model/Customer';
import { CommonModule } from '@angular/common';
import { CardDetails } from '../../model/CardDetails';
import { CardService } from '../../service/card/card.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  billId: number | null = null; // To store billId
  paymentMethod: string | null = null; // To store the dynamic part (like "card")
  loading: boolean = false;
  cardDetailsForm: FormGroup;
  customerId: string = '';
  submitted = false;
  cards: CardDetails[] = [];

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
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cardService: CardService,
    private snackbar: MatSnackBar
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
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((urlSegment) => {
      this.paymentMethod = urlSegment[1] ? urlSegment[1].path : null; // Access the second segment (like "card")
    });

    // Capture the query params (e.g., billId=2)
    this.route.queryParams.subscribe((params) => {
      this.billId = params['billId'] ? +params['billId'] : null; // Convert to number if it exists
    });

    console.log(this.paymentMethod);
    console.log(this.billId);
    this.customerId = localStorage.getItem('customerId') || '';
    this.fetchSavedCards();
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

  onSubmit() {
    this.submitted = true;
    if (this.cardDetailsForm.invalid) {
      return;
    }
    if (this.cardDetailsForm.valid) {
      const cardNumberWithoutSpaces = this.cardDetailsForm
        .get('cardNumber')
        ?.value.replace(/\s+/g, '');

      // Combine expMonth and expYear into expiryDate
      const expiryDate = `${this.cardDetailsForm.value.expMonth}/${this.cardDetailsForm.value.expYear}`;

      // Prepare the card details object
      const cardDetails: CardDetails = {
        cardNumber: cardNumberWithoutSpaces,
        cardHolderName: this.cardDetailsForm.value.cardHolderName,
        expiryDate: expiryDate,
        cvv: this.cardDetailsForm.value.cvv,
        cardType: this.cardDetailsForm.value.cardType,
        balance: 5000,
        expMonth: this.cardDetailsForm.value.expMonth,
        expYear: this.cardDetailsForm.value.expMonth,
        customerId: this.customerId, // Use customer ID from local storage
      };

      this.cardService.createCardDetails(cardDetails).subscribe(
        (response) => {
          console.log('Card details saved successfully:', response);
          this.cardDetailsForm.reset({
            cardType: '', // Default empty
            cardHolderName: '',
            cardNumber: '',
            expMonth: '', // Default empty
            expYear: '', // Default empty
            cvv: '',
          });
          this.submitted = false;
          this.fetchSavedCards();
          // Handle successful response (e.g., show a success message)
          this.snackbar.open('Card saved successfully!', 'Close', {
            duration: 2000, // Duration of the toast in milliseconds
          });
        },
        (error) => {
          console.error('Error saving card details:', error);
          // Handle error response (e.g., show an error message)
          this.snackbar.open(
            'Error saving card details. Please try again.',
            'Close',
            {
              duration: 2000,
            }
          );
        }
      );
    }
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

  navigateToPayment(cardId: number | undefined) {
    this.router.navigate(['/dashboard/paybill'], {
      queryParams: { billId: this.billId, cardId: cardId },
    });
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
