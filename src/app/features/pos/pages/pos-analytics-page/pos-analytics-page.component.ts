import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PosSalesApiService } from '../../data-access/pos-sales.api.service';
import { PosInventoryApiService } from '../../data-access/pos-inventory.api.service';
import type { SalesReportResponse } from '../../data-access/models/pos-sales.models';
import type { LowStockItemDto } from '../../data-access/models/pos-inventory.models';

@Component({
  selector: 'app-pos-analytics-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pos-analytics-page.component.html',
  styleUrl: './pos-analytics-page.component.css',
})
export class PosAnalyticsPageComponent implements OnInit {
  private readonly salesApi = inject(PosSalesApiService);
  private readonly inventoryApi = inject(PosInventoryApiService);

  readonly report = signal<SalesReportResponse | null>(null);
  readonly lowStock = signal<LowStockItemDto[]>([]);
  readonly loading = signal(true);
  readonly lowStockLoading = signal(true);

  readonly todayRevenue = computed(() => this.report()?.dailyRevenue ?? 0);
  readonly todayOrders = computed(() => this.report()?.totalOrders ?? 0);
  readonly avgOrderValue = computed(() => {
    const orders = this.report()?.totalOrders ?? 0;
    const revenue = this.report()?.dailyRevenue ?? 0;
    return orders > 0 ? revenue / orders : 0;
  });
  readonly topItems = computed(() => this.report()?.topItems ?? []);
  readonly lowStockItems = computed(() => this.lowStock());
  readonly periodLabel = 'Today';

  ngOnInit(): void {
    const today = new Date();
    const from = today.toISOString().slice(0, 10);
    const to = from;
    this.loading.set(true);
    this.salesApi.getReport(from, to).subscribe({
      next: (res) => {
        this.report.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.lowStockLoading.set(true);
    this.inventoryApi.getLowStock().subscribe({
      next: (items) => {
        this.lowStock.set(items);
        this.lowStockLoading.set(false);
      },
      error: () => this.lowStockLoading.set(false),
    });
  }
}
