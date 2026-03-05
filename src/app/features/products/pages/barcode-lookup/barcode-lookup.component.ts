import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsApiService } from '../../data-access/products-api.service';
import type { ProductByBarcode } from '../../models/product.models';

@Component({
  selector: 'app-barcode-lookup',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './barcode-lookup.component.html',
  styleUrl: './barcode-lookup.component.css',
})
export class BarcodeLookupComponent {
  private readonly api = inject(ProductsApiService);

  private readonly barcodeInput$ = new Subject<string>();
  readonly product = signal<ProductByBarcode | null>(null);
  readonly loading = signal(false);
  readonly notFound = signal(false);

  barcode = '';

  constructor() {
    this.barcodeInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((code) => {
        const trimmed = code.trim();
        if (!trimmed) {
          this.product.set(null);
          this.notFound.set(false);
          return;
        }
        this.loading.set(true);
        this.notFound.set(false);
        this.api.getByBarcode(trimmed).subscribe({
          next: (p) => {
            this.product.set(p);
            this.notFound.set(p === null);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.notFound.set(true);
          },
        });
      });
  }

  onSearch(): void {
    this.barcodeInput$.next(this.barcode);
  }

  onBarcodeKeyup(): void {
    this.barcodeInput$.next(this.barcode);
  }
}
