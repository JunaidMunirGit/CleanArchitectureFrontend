import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ProductsApiService } from '../../data-access/products-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import type { BulkImportItem, BulkImportResult } from '../../models/product.models';

@Component({
  selector: 'app-bulk-import',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  templateUrl: './bulk-import.component.html',
  styleUrl: './bulk-import.component.css',
})
export class BulkImportComponent {
  private readonly api = inject(ProductsApiService);
  private readonly notification = inject(NotificationService);

  jsonInput = '';
  allOrNothing = false;
  result: BulkImportResult | null = null;
  displayedColumns = ['index', 'sku', 'success', 'productId', 'errorCode', 'errorMessage'];

  onSubmit(): void {
    let items: BulkImportItem[];
    try {
      const parsed = JSON.parse(this.jsonInput) as BulkImportItem[] | { items: BulkImportItem[] };
      items = Array.isArray(parsed) ? parsed : (parsed as { items: BulkImportItem[] }).items ?? [];
    } catch {
      this.notification.error('Invalid JSON');
      return;
    }
    if (items.length === 0) {
      this.notification.error('No items to import');
      return;
    }
    this.api.bulkImport(items, this.allOrNothing).subscribe({
      next: (res) => {
        this.result = res;
        this.notification.success(`Imported: ${res.successCount} succeeded, ${res.failedCount} failed`);
      },
    });
  }

  trackByIndex(_: number, r: { index: number }): number {
    return r.index;
  }
}
