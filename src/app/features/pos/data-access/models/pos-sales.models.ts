export interface SalesReportResponse {
  dailyRevenue: number;
  topItems: TopItemDto[];
  totalOrders: number;
}

export interface TopItemDto {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}
