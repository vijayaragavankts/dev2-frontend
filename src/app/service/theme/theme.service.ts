import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeColor: string = 'btn-secondary'; // Default color

  setThemeColor(color: string) {
    this.themeColor = color;
  }

  getThemeColor() {
    return this.themeColor;
  }
}
