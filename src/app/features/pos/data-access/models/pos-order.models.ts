export type PaymentMethod = 'Cash' | 'Card' | 'Split';

export interface CreateOrderLineRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderPaymentRequest {
  method: PaymentMethod;
  amount: number;
}

export interface CreateOrderRequest {
  lines: CreateOrderLineRequest[];
  discountAmount: number;
  taxPercent: number;
  paymentMethod: PaymentMethod;
  splitPayments?: CreateOrderPaymentRequest[];
}

export interface CreateOrderResponse {
  id: string;
}
