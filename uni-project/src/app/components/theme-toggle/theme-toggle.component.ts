import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme/theme.service';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-theme-toggle',
  imports: [NzIconModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  isDarkMode = this.themeService.isDarkMode(); 
  currentIcon: string = this.isDarkMode ? 'moon' : 'sun';
  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode(); 
    this.currentIcon = this.isDarkMode ? 'moon' : 'sun';
  }
}
