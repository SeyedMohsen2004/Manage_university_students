import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-card',
  imports: [CommonModule, CountUpDirective,NzIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() title: string = '';
  @Input() mainValue: any = 0;
  @Input() subText: string = '';
  @Input() iconType: string = 'bar-chart'; 
  @Input() iconTheme: 'outline' | 'fill' | 'twotone' = 'outline';
  @Input() iconBgColor: string = '';
  @Input() iconTextColor: string = '';
  @Input() useCountUp: boolean = false;
  @Input() currencySymbol: string = '';
  @Input() duration: number = 1000;
}


