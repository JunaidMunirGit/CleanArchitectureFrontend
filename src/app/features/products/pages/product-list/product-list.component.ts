import { Component, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ProductsStore } from '../../data-access/products.store';
import { ProductListTableComponent } from '../../ui/product-list-table/product-list-table.component';
import type { ProductListItem } from '../../models/product.models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    ProductListTableComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private readonly store = inject(ProductsStore);

  readonly listResult = this.store.listResult;
  readonly listParamsState = this.store.listParamsState;

  searchQ = '';
  searchSku = '';
  filterActive: boolean | undefined = undefined;

  readonly dataSource = computed(() => {
    const result = this.listResult();
    return result?.items ?? [];
  });

  ngOnInit(): void {
    this.store.loadList();
  }

  onSearch(): void {
    this.store.loadList({
      q: this.searchQ || undefined,
      sku: this.searchSku || undefined,
      isActive: this.filterActive,
      pageNumber: 1,
    });
  }

  onPage(event: PageEvent): void {
    this.store.loadList({
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }

  onSort(sortBy: string, sortDir: 'asc' | 'desc'): void {
    this.store.loadList({ sortBy, sortDir, pageNumber: 1 });
  }

  onRefresh(): void {
    this.store.loadList();
  }
}
