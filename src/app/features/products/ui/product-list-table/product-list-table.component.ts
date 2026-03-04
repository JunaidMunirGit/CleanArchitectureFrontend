import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { ProductListItem } from '../../models/product.models';

@Component({
  selector: 'app-product-list-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule, DatePipe, DecimalPipe],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="items">
        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef (click)="emitSort('Sku')">SKU</th>
          <td mat-cell *matCellDef="let row">
            <a [routerLink]="['/products', row.id, 'edit']">{{ row.sku }}</a>
          </td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef (click)="emitSort('Name')">Name</th>
          <td mat-cell *matCellDef="let row">{{ row.name }}</td>
        </ng-container>
        <ng-container matColumnDef="sellingPrice">
          <th mat-header-cell *matHeaderCellDef (click)="emitSort('SellingPrice')">Price</th>
          <td mat-cell *matCellDef="let row">{{ row.sellingPrice | number: '1.2-2' }}</td>
        </ng-container>
        <ng-container matColumnDef="isActive">
          <th mat-header-cell *matHeaderCellDef>Active</th>
          <td mat-cell *matCellDef="let row">
            <mat-chip [color]="row.isActive ? 'primary' : 'warn'">
              {{ row.isActive ? 'Yes' : 'No' }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="updatedAt">
          <th mat-header-cell *matHeaderCellDef (click)="emitSort('UpdatedAt')">Updated</th>
          <td mat-cell *matCellDef="let row">{{ row.updatedAt | date: 'short' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <a mat-icon-button [routerLink]="['/products', row.id, 'prices']" matTooltip="Branch prices">
              <mat-icon>attach_money</mat-icon>
            </a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns; trackBy: trackById"></tr>
      </table>

      <mat-paginator
        [length]="totalCount"
        [pageIndex]="pageIndex"
        [pageSize]="pageSize"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="page.emit($event)"
        showFirstLastButtons
      />
    </div>
  `,
  styles: [
    `
      .table-container {
        overflow-x: auto;
      }
      table {
        width: 100%;
      }
      a[mat-icon-button] {
        margin-right: 4px;
      }
    `,
  ],
})
export class ProductListTableComponent {
  @Input() items: ProductListItem[] = [];
  @Input() totalCount = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 20;
  @Input() sortBy = 'UpdatedAt';
  @Input() sortDir: 'asc' | 'desc' = 'desc';

  @Output() page = new EventEmitter<PageEvent>();
  @Output() sort = new EventEmitter<{ sortBy: string; sortDir: 'asc' | 'desc' }>();

  displayedColumns: string[] = ['sku', 'name', 'sellingPrice', 'isActive', 'updatedAt', 'actions'];

  trackById(_: number, item: ProductListItem): string {
    return item.id;
  }

  emitSort(sortBy: string): void {
    const nextDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sort.emit({ sortBy, sortDir: nextDir });
  }
}
