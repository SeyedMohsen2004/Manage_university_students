import { Component, Input, Type } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: false,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  @Input() tabs: { name: string; icon: string; content: any }[] = [];
}