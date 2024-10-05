import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OtpService } from '../../service/otp/otp.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  customerForm: FormGroup = new FormGroup({});
  otpForm: FormGroup = new FormGroup({});

  otpSent: boolean = false; // Track whether OTP has been sent
  loading: boolean = false; // Track loading spinner

  countdown = 15; // Timer starting value
  private countdownSubscription: Subscription | null = null;

  customerErrorMessage: string = ''; // Customer ID error message
  otpErrorMessage: string = ''; // OTP error message

  constructor(
    private otpService: OtpService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {
    // Check if customerId exists in localStorage
    const storedCustomerId = localStorage.getItem('customerId');

    if (storedCustomerId) {
      // If customerId is found, navigate to /home directly
      this.router.navigate(['/dashboard/due-bills']);
    } else {
      // Otherwise, initialize forms as usual
      this.createForm();
    }
  }

  createForm() {
    this.customerForm = new FormGroup({
      customerId: new FormControl('', {
        validators: [Validators.required], // Add length validation
      }),
    });

    this.otpForm = new FormGroup({
      enteredOtp: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^\d{6}$/)], // Ensure 6 digits
      }),
    });

    this.customerForm.get('customerId')?.valueChanges.subscribe(() => {
      this.customerErrorMessage = ''; // Clear the error message
    });

    this.otpForm.get('enteredOtp')?.valueChanges.subscribe(() => {
      this.otpErrorMessage = ''; // Clear the error message
    });
  }

  onSendOtp() {
    this.customerForm.get('customerId')?.markAsTouched();
    this.customerErrorMessage = '';
    if (this.customerForm.valid) {
      const customerId = this.customerForm.get('customerId')?.value;
      this.loading = true;
      this.otpService.sendOtp(customerId).subscribe(
        (response) => {
          if (response.success) {
            console.log('OTP Sent successfully', response);
            setTimeout(() => {
              this.loading = false;
              this.otpSent = true;
              this.startCountdown();
            }, 2000);
          } else {
            console.log('OTP Not Sent', response);
          }
        },
        (error) => {
          console.log('Error sending OTP', error);
          this.loading = false; // Hide loading spinner
          this.customerErrorMessage =
            error?.error?.message || 'Invalid Customer ID';
        }
      );
    } else {
      console.log('Form is Invalid');
      this.customerErrorMessage = 'Customer ID is required';
    }
  }

  onValidateOtp() {
    this.otpForm.get('enteredOtp')?.markAsTouched();
    this.otpErrorMessage = '';

    const enteredOtp = this.otpForm.get('enteredOtp')?.value;

    if (enteredOtp && !/^\d{6}$/.test(enteredOtp)) {
      this.otpErrorMessage =
        'OTP must be exactly 6 digits and contain only numbers.';
      return;
    }

    if (this.otpForm.valid) {
      console.log('Validation OTP :' + enteredOtp);
      this.otpService.validateOtp(enteredOtp).subscribe(
        (response) => {
          if (response.success) {
            console.log('OTP Validated Successfully', response);
            const customerId = this.customerForm.get('customerId')?.value; // local storage
            localStorage.setItem('customerId', customerId);
            this.snackBar.open('Login Successful', 'Close', {
              duration: 2000, // Duration of the toast in milliseconds
            });

            // Navigate to home after a slight delay to allow the toast to show
            setTimeout(() => {
              this.router.navigate(['/dashboard/due-bills']);
            }, 2000); // Delay in milliseconds (same as toast duration)
          } else {
            console.log('OTP InValid', response);
            this.snackBar.open('Incorrect Otp', 'Close', {
              duration: 2000, // Duration of the toast in milliseconds
            });
          }
        },
        (error) => {
          this.otpErrorMessage = error?.error?.message || 'Invalid OTP';
          console.log('Error validating OTP', error);
        }
      );
    } else {
      this.otpErrorMessage = 'OTP is required.';
      console.log('OTP form is invalid');
    }
  }

  onResendOtp() {
    if (this.countdown <= 0) {
      // Only allow resend if countdown has ended
      this.customerForm.get('customerId')?.markAsTouched();
      if (this.customerForm.valid) {
        const customerId = this.customerForm.get('customerId')?.value;
        this.loading = true;
        this.otpService.sendOtp(customerId).subscribe(
          (response) => {
            console.log('OTP Resent successfully', response);
            this.loading = false;
            this.countdown = 15; // Reset countdown
            this.startCountdown();
          },
          (error) => {
            console.log('Error resending OTP', error);
            this.loading = false; // Hide loading spinner
          }
        );
      } else {
        console.log('Form is Invalid');
      }
    } else {
      console.log(
        'Please wait for the countdown to finish before resending the OTP.'
      );
    }
  }

  startCountdown() {
    this.countdownSubscription = timer(0, 1000).subscribe((sec) => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdownSubscription?.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {}
}
