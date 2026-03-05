import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pos-analytics-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './pos-analytics-page.component.html',
  styleUrl: './pos-analytics-page.component.css',
})
export class PosAnalyticsPageComponent {
  readonly todayRevenue = 0;
  readonly todayOrders = 0;
  readonly avgOrderValue = 0;
  readonly periodLabel = 'Today';
}
