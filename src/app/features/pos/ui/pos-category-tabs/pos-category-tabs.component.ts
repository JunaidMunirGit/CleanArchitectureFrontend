import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface PosCategoryTab {
  id: string | null;
  name: string;
  count: number;
}

@Component({
  selector: 'app-pos-category-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './pos-category-tabs.component.html',
  styleUrl: './pos-category-tabs.component.css',
})
export class PosCategoryTabsComponent {
  @Input() label = 'Dish Menu';
  @Input() tabs: PosCategoryTab[] = [];
  @Input() selectedId: string | null = null;

  @Output() categoryChange = new EventEmitter<string | null>();

  select(id: string | null): void {
    this.categoryChange.emit(id);
  }

  trackByTabId(_: number, tab: PosCategoryTab): string {
    return tab.id ?? 'all';
  }
}
