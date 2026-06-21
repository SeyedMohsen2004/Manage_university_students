import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkThemeClass = 'dark';

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains(this.darkThemeClass)) {
      htmlElement.classList.remove(this.darkThemeClass);
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.classList.add(this.darkThemeClass);
      localStorage.setItem('theme', 'dark');
    }
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add(this.darkThemeClass);
    } else {
      document.documentElement.classList.remove(this.darkThemeClass);
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains(this.darkThemeClass);
  }
}