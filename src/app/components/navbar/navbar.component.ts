import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  confirmLogout(): void {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
      // Clear user session data
      localStorage.removeItem('customerId');

      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }
}
