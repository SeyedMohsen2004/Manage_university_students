import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TabsComponent } from './tabs/tabs.component';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NumberInputComponent } from './number-input/number-input.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ButtonComponent } from './button/button.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TableComponent } from './table/table.component';
import { ModalComponent } from './modal/modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TextInputComponent } from './text-input/text-input.component';




@NgModule({
  declarations: [
    TabsComponent,
    NumberInputComponent,
    TextInputComponent,
    ButtonComponent,
    TableComponent,
    ModalComponent,
  ],
  imports: [
    NzIconModule,
    NzTabsModule,
    CommonModule,
    FormsModule,
    NzInputNumberModule,
    NzButtonModule,
    NzTableModule,
    NzModalModule,
  ],
  exports: [
    TabsComponent,
    NumberInputComponent,
    TextInputComponent,
    ButtonComponent,
    TableComponent,
    ModalComponent,
  ]
})
export class SharedModule { }
