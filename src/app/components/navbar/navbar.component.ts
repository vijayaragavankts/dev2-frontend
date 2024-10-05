import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../service/theme/theme.service';
import { BrowserModule } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

interface Theme {
  buttonColor: string;
  backgroundColor: string;
}

interface Themes {
  red: Theme;
  green: Theme;
  blue: Theme;
  gray: Theme;
  black: Theme;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isNavbarCollapsed = true;
  constructor(private router: Router, private themeService: ThemeService) {
    this.loadTheme();
  }

  isSidebarCollapsed = false;
  themes = {
    red: {
      buttonColor: 'btn-danger',
      backgroundColor: '#ffcccc',
    },
    green: {
      buttonColor: 'btn-success',
      backgroundColor: '#ccffcc',
    },
    blue: {
      buttonColor: 'btn-primary',
      backgroundColor: '#ccccff',
    },
    gray: {
      buttonColor: 'btn-secondary',
      backgroundColor: '#e0e0e0',
    },
    black: {
      buttonColor: 'btn-dark',
      backgroundColor: '#333333',
    },
    cyan: {
      buttonColor: 'btn-info',
      backgroundColor: '#17a2b8',
    },
    yellow: {
      ButtonColor: 'btn-warning',
      backgroundColor: '#ffc107',
    },
    white: {
      ButtonColor: '#a903f6',
      backgroundColor: '#a903f6',
    },
  };

  // Default theme
  currentTheme = this.themes.gray; // Set your default theme here

  changeTheme(theme: string) {
    // Remove any existing theme classes
    document.body.classList.remove(
      'red-theme',
      'green-theme',
      'blue-theme',
      'gray-theme',
      'black-theme',
      'cyan-theme',
      'yellow-theme',
      'white-theme'
    );

    // Add the selected theme class
    document.body.classList.add(`${theme}-theme`);
  }
  // changeTheme(theme: string) {
  //   document.body.className = ''; // Reset existing classes
  //   document.body.classList.add(theme); // Add selected theme class
  //   localStorage.setItem('theme', theme); // Save theme to local storage
  // }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(savedTheme); // Load saved theme class
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  confirmLogout(): void {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
      // Clear user session data
      localStorage.removeItem('customerId');

      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }
  isMobileMenuOpen = false;
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
