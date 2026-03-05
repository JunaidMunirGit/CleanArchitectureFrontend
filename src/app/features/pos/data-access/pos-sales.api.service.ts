import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import type { SalesReportResponse } from './models/pos-sales.models';

@Injectable({ providedIn: 'root' })
export class PosSalesApiService {
  private readonly api = inject(ApiClientService);

  getReport(from?: string, to?: string): Observable<SalesReportResponse> {
    const params: Record<string, string> = {};
    if (from) params['from'] = from;
    if (to) params['to'] = to;
    return this.api.get<SalesReportResponse>('/v1/pos/sales/report', params);
  }
}
