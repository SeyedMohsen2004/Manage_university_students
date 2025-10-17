import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  template: `
  <button
  [disabled]="disabled"
  nz-button
  nzType="primary"
  (click)="onClick()"
  [nzLoading]="isLoading"
  style="width: 100%; border-radius: 5px;"
>
{{ label }}
<nz-icon [nzType]="icon" />
</button>

  `,
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() isLoading: boolean = false;
  buttonLabel: string = '';
  @Input() disabled: boolean = false;
  @Input() label: string = '';
  @Input() icon: string = '';
  @Output() clicked = new EventEmitter<any>();



  onClick(): void {
    if (!this.isLoading && !this.disabled) { 
      this.clicked.emit();
    }
  }
}


