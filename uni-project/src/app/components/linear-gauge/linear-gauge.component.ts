import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-linear-gauge',
  imports: [NgxChartsModule], 
  templateUrl: './linear-gauge.component.html',
  styleUrl: './linear-gauge.component.scss'
})
export class LinearGaugeComponent {
 // Chart dimensions
 view: [number, number] = [270, 80];
  
 // Chart configuration
 colorScheme = {
   domain: ['#5AA454'] // Green color
 };
 
 // Data values
 value: number = 65;
 min: number = 0;
 max: number = 100;
 units: string = 'units';
 previousValue: number = 70;
 
 // Display options
 valueDisplay: string = 'absolute'; // can be 'absolute' or 'percent'
 animations: boolean = true;
 
 // Margins
 margin: number = 10;

 constructor() { }
}


