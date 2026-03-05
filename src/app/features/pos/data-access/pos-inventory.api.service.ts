import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import type { LowStockItemDto } from './models/pos-inventory.models';

@Injectable({ providedIn: 'root' })
export class PosInventoryApiService {
  private readonly api = inject(ApiClientService);

  getLowStock(): Observable<LowStockItemDto[]> {
    return this.api.get<LowStockItemDto[]>('/v1/pos/inventory/low-stock');
  }
}
