import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-number-input',
  standalone: false,
  template: `
    <nz-input-number
      [(ngModel)]="value"
      (ngModelChange)="onValueChange($event)"
      class="w-full"
    >
      <span nzInputAddonBefore>{{ lable }}</span>
      <span nzInputAddonAfter>$</span>
    </nz-input-number>
  `,
})
export class NumberInputComponent {
  @Input() value: number | null = null;
  @Output() valueChange = new EventEmitter<number>();

  @Input() lable: string = 'Cost';

  onValueChange(val: number) {
    this.valueChange.emit(val);
  }
}



