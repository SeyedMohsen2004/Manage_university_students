import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';


@Component({
  selector: 'app-modal',
  standalone: false,
  template: `
   <nz-modal
      [nzVisible]="isVisible"
      [nzTitle]="modalTitle"
      [nzContent]="modalContent"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancel()"
    >
      <ng-template #modalTitle>{{ title }}</ng-template>
      <ng-template #modalContent>
        <ng-content></ng-content>
      </ng-template>
      <ng-template #modalFooter>
        <button nz-button nzType="default" (click)="handleCancel()">Close</button>
        <button
          nz-button
          nzType="primary"
          (click)="handleOk()"
          [nzLoading]="isConfirmLoading"
        >
          {{ confirmBtnText || 'Confirm' }}
        </button>
      </ng-template>
    </nz-modal>
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  modalService = inject(ModalService);
  elementRef = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);

  @Input() modalId = '';
  @Input() title = '';
  @Input() confirmBtnText = 'Confirm';

  @Output() confirmed = new EventEmitter<boolean>();

  isConfirmLoading = false;

  get isVisible(): boolean {
    return this.modalService.isModalOpen(this.modalId);
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isConfirmLoading = false;
      this.modalService.toggleModal(this.modalId);
      this.confirmed.emit(true);
      this.cdr.detectChanges();
    }, 1000);
  }

  handleCancel(): void {
    this.modalService.toggleModal(this.modalId);
    this.confirmed.emit(false);
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.modalService.register(this.modalId);
    document.body.appendChild(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.modalService.unregister(this.modalId);
    if (this.elementRef.nativeElement.parentNode) {
      this.elementRef.nativeElement.parentNode.removeChild(this.elementRef.nativeElement);
    }
  }
}
