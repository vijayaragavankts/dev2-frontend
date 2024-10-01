import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  billId: number | null = null; // To store billId
  paymentMethod: string | null = null; // To store the dynamic part (like "card")

  constructor(private route: ActivatedRoute, private router: Router) {}

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
  }
}
