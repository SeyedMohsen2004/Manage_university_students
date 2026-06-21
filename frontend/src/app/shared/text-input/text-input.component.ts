import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: false,
  template: `
<input
  nz-input
  [placeholder]="placeholder"
  [(ngModel)]="val"
  (ngModelChange)="onValChange($event)"
  class="ant-input w-full"
/>

  `,
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
  @Input() val: string = '';
  @Input() placeholder: string = '';

  @Output() valChange = new EventEmitter<string>()


  onValChange(val: string) {
    this.valChange.emit(val)
  }
}
