/** Matches backend PagedResult<T> and DTOs */

export interface ProductListItem {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  sellingPrice: number;
  effectivePrice?: number;
  isActive: boolean;
  updatedAt: string;
  primaryBarcode?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  unitOfMeasureId: string;
  unitOfMeasureName?: string;
  costPrice: number;
  sellingPrice: number;
  effectivePrice?: number;
  discountable: boolean;
  trackInventory: boolean;
  reorderLevel: number;
  taxCategoryId: string;
  taxCategoryName?: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  rowVersion: string;
  barcodes: string[];
  primaryBarcode?: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductListParams {
  q?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  branchId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  unitOfMeasureId: string;
  costPrice: number;
  sellingPrice: number;
  discountable: boolean;
  trackInventory: boolean;
  reorderLevel: number;
  taxCategoryId: string;
  imageUrl?: string;
  barcodes: string[];
  primaryBarcode?: string;
}

export interface UpdateProductRequest {
  rowVersion: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  unitOfMeasureId: string;
  costPrice: number;
  sellingPrice: number;
  discountable: boolean;
  trackInventory: boolean;
  reorderLevel: number;
  taxCategoryId: string;
  imageUrl?: string;
  barcodes: string[];
  primaryBarcode?: string;
}

export interface ProductByBarcode {
  id: string;
  sku: string;
  name: string;
  sellingPrice: number;
  effectivePrice?: number;
  isActive: boolean;
}

export interface ProductPriceItem {
  branchId?: string;
  branchName?: string;
  price: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface BulkImportItem {
  idempotencyKey?: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId?: string;
  unitOfMeasureId: string;
  costPrice: number;
  sellingPrice: number;
  discountable: boolean;
  trackInventory: boolean;
  reorderLevel: number;
  taxCategoryId: string;
  imageUrl?: string;
  barcodes: string[];
  primaryBarcode?: string;
}

export interface BulkImportResult {
  total: number;
  successCount: number;
  failedCount: number;
  results: BulkImportItemResult[];
}

export interface BulkImportItemResult {
  index: number;
  sku: string;
  success: boolean;
  productId?: string;
  errorCode?: string;
  errorMessage?: string;
}
