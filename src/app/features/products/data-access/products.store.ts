import { Injectable, inject, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { ProductsApiService } from './products-api.service';
import type { ProductListItem, PagedResult, ProductListParams } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly api = inject(ProductsApiService);

  private readonly list = signal<PagedResult<ProductListItem> | null>(null);
  private readonly listParams = signal<ProductListParams>({
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'UpdatedAt',
    sortDir: 'desc',
  });

  readonly listResult = computed(() => this.list());
  readonly listParamsState = computed(() => this.listParams());

  loadList(params?: Partial<ProductListParams>): void {
    const next = { ...this.listParams(), ...params };
    this.listParams.set(next);
    this.api.getList(next).pipe(
      tap((result) => this.list.set(result)),
    ).subscribe();
  }

  setParams(params: Partial<ProductListParams>): void {
    this.listParams.update((p) => ({ ...p, ...params }));
  }
}
