import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() listData: any[] = [];
  @Input() columns: Array<{
    title: string;
    key: string;
    sort?: boolean;
    filter?: { text: string; value: string }[];
    pipe?: {
      name: string;
      params?: any;
    };
  }> = [];
  @Input() total = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 1;
  @Input() loading = false;

  @Output() queryParamsChange = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onQueryParamsChange(params: any): void {
    this.queryParamsChange.emit(params);
  }

  resolveData(data: any, key: string, pipe?: { name: string; params?: any }): any {
    const keys = key.split('.');
    const value = keys.reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : ''), data);

    if (!pipe) {
      return value;
    }

    switch (pipe.name) {
      case 'date':
        return this.applyDatePipe(value, pipe.params);
      case 'currency':
        return this.applyCurrencyPipe(value, pipe.params);
      case 'uppercase':
        return this.applyUpperCasePipe(value);
      case 'lowercase':
        return this.applyLowerCasePipe(value);
      default:
        return value;
    }
  }

  private applyDatePipe(value: any, params?: any): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const format = params?.format || 'yyyy-MM-dd';

    const pad = (num: number) => num.toString().padStart(2, '0');

    return format
      .replace('yyyy', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  private applyCurrencyPipe(value: any, params?: any): string {
    if (isNaN(value)) return value;
    const currencySymbol = params?.symbol || '$';
    const decimalPlaces = params?.digits || 2;
    return currencySymbol + parseFloat(value).toFixed(decimalPlaces);
  }

  private applyUpperCasePipe(value: any): string {
    return value?.toString().toUpperCase() || '';
  }

  private applyLowerCasePipe(value: any): string {
    return value?.toString().toLowerCase() || '';
  }

  onEdit(data: any): void {
    this.edit.emit(data);
  }

  onDelete(data: any): void {
    this.delete.emit(data);
  }


}