import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, HostBinding } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Directive({
  selector: '[appCountUp]' 
})
export class CountUpDirective implements OnChanges, OnDestroy {
  @Input('appCountUp') targetValue: number = 0; // The final value to count up to
  @Input() duration: number = 1000; // The total animation duration in milliseconds
  @Input() currencySymbol: string = ''; // Dynamic currency symbol (e.g., "$", "€", "ریال")

  private subscription: Subscription | null = null; // Stores the interval subscription

  @HostBinding('innerText') displayValue: string = '0'; // Binds the directive output to the element's inner text

  /**
   * Detects input changes and starts counting animation if `targetValue` changes.
   * @param changes - Contains the new and old values of the input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['targetValue'] && changes['targetValue'].currentValue !== undefined) {
      this.startCounting(0, changes['targetValue'].currentValue);
    }
  }

  /**
   * Starts counting from `start` to `end` over a set duration.
   * @param start - The starting number (default: 0).
   * @param end - The target number.
   */
  startCounting(start: number, end: number) {
    // Unsubscribe from any previous interval to avoid multiple animations running simultaneously
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const steps = 50; // Number of steps in the animation
    const stepValue = (end - start) / steps; // Amount to increase or decrease per step
    let current = start; // Current value of the counter

    // Create an interval to update the value gradually
    this.subscription = interval(this.duration / steps).subscribe(() => {
      current += stepValue;

      // Ensure we don't overshoot the target value (for both positive and negative targets)
      if ((end >= start && current >= end) || (end < start && current <= end)) {
        current = end; // Set to final value when target is reached
        this.subscription?.unsubscribe(); // Unsubscribe to stop further updates
      }

      // Automatically decide the number of decimals based on the value
      this.displayValue = `${this.currencySymbol}${this.formatNumber(current)}`;
    });
  }

  /**
   * Format the number to dynamically display appropriate decimals.
   * @param value - The value to format
   * @returns A formatted number string
   */
  private formatNumber(value: number): string {
    // Get the decimal part of the number
    const decimalPart = value % 1;
    
    if (decimalPart === 0) {
      // If there's no decimal part, return the number as an integer
      return value.toFixed(0);
    }

    // Otherwise, return the number with up to 2 decimal places
    return value.toFixed(2);
  }

  /**
   * Cleanup method to prevent memory leaks when the directive is destroyed.
   */
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
