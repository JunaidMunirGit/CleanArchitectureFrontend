import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import type { CreateOrderRequest, CreateOrderResponse } from './models/pos-order.models';

@Injectable({ providedIn: 'root' })
export class PosOrdersApiService {
  private readonly api = inject(ApiClientService);

  createOrder(body: CreateOrderRequest): Observable<CreateOrderResponse> {
    const payload = {
      lines: body.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      discountAmount: body.discountAmount,
      taxPercent: body.taxPercent,
      paymentMethod: body.paymentMethod === 'Cash' ? 0 : body.paymentMethod === 'Card' ? 1 : 2,
      splitPayments:
        body.paymentMethod === 'Split' && body.splitPayments?.length
          ? body.splitPayments.map((p) => ({
              method: p.method === 'Cash' ? 0 : p.method === 'Card' ? 1 : 2,
              amount: p.amount,
            }))
          : undefined,
    };
    return this.api.post<CreateOrderResponse>('/v1/pos/orders', payload);
  }
}
