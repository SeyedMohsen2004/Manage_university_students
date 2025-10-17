import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { IDateRange } from '../../interfaces/interfaces';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule, NzDatePickerModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  date: Date[] | null = null;

  @Output() selectedDate = new EventEmitter<IDateRange>();

  selectedRange: IDateRange = {
    startDate: '',
    endDate: ''
  };

  onDateChange(result: Date[]): void {
    if (result?.length === 2) {
      this.selectedRange = {
        startDate: format(result[0], 'yyyy-MM-dd'),
        endDate: format(result[1], 'yyyy-MM-dd')
      };

      console.log('📅 Selected Range:', this.selectedRange);

      this.selectedDate.emit(this.selectedRange);
    } else {
      this.selectedRange = { startDate: '', endDate: '' };
    }
  }
}
