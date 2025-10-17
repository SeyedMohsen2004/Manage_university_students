import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private message: NzMessageService) {}

  show(type: 'success' | 'error' | 'info' | 'warning' | 'loading', content: string, duration = 3000): void {
    this.message.create(type, content, { nzDuration: duration });
  }

}
