export interface LowStockItemDto {
  productId: string;
  productName: string;
  sku: string;
  quantityOnHand: number;
  reorderLevel: number;
}
