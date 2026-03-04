import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import type {
  PagedResult,
  ProductListItem,
  Product,
  ProductListParams,
  CreateProductRequest,
  UpdateProductRequest,
  ProductByBarcode,
  ProductPriceItem,
  BulkImportItem,
  BulkImportResult,
} from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly api = inject(ApiClientService);

  getList(params: ProductListParams): Observable<PagedResult<ProductListItem>> {
    const query: Record<string, string | number | boolean | undefined> = {
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 20,
      sortBy: params.sortBy ?? 'UpdatedAt',
      sortDir: params.sortDir ?? 'desc',
    };
    if (params.q) query['q'] = params.q;
    if (params.sku) query['sku'] = params.sku;
    if (params.barcode) query['barcode'] = params.barcode;
    if (params.categoryId) query['categoryId'] = params.categoryId;
    if (params.isActive !== undefined) query['isActive'] = params.isActive;
    if (params.minPrice !== undefined) query['minPrice'] = params.minPrice;
    if (params.maxPrice !== undefined) query['maxPrice'] = params.maxPrice;
    if (params.branchId) query['branchId'] = params.branchId;
    return this.api.get<PagedResult<ProductListItem>>('/v1/products', query);
  }

  getById(id: string): Observable<Product> {
    return this.api.get<Product>(`/v1/products/${id}`);
  }

  getByBarcode(barcode: string, branchId?: string): Observable<ProductByBarcode | null> {
    const path = `/v1/products/by-barcode/${encodeURIComponent(barcode)}`;
    return this.api.get<ProductByBarcode | null>(path, branchId ? { branchId } : undefined);
  }

  create(body: CreateProductRequest): Observable<string> {
    return this.api.post<{ id: string }>(`/v1/products`, body).pipe(
      map((res) => (typeof res === 'string' ? res : res.id)),
    );
  }

  update(id: string, body: UpdateProductRequest): Observable<void> {
    return this.api.put<void>(`/v1/products/${id}`, { ...body, id });
  }

  delete(id: string, rowVersionBase64: string): Observable<void> {
    return this.api.delete<void>(`/v1/products/${id}`, { rowVersionBase64 });
  }

  activate(id: string): Observable<void> {
    return this.api.patch<void>(`/v1/products/${id}/activate`);
  }

  deactivate(id: string): Observable<void> {
    return this.api.patch<void>(`/v1/products/${id}/deactivate`);
  }

  getPrices(productId: string, branchId?: string): Observable<ProductPriceItem[]> {
    const path = `/v1/products/${productId}/prices`;
    return this.api.get<ProductPriceItem[]>(path, branchId ? { branchId } : undefined);
  }

  setBranchPrice(productId: string, branchId: string, price: number): Observable<void> {
    return this.api.put<void>(`/v1/products/${productId}/prices/branches/${branchId}`, { price });
  }

  bulkImport(items: BulkImportItem[], allOrNothing: boolean): Observable<BulkImportResult> {
    return this.api.post<BulkImportResult>('/v1/products/bulk', { items, allOrNothing });
  }
}
