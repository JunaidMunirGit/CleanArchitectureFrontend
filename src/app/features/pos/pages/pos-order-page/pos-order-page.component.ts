import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductsApiService } from '../../../products/data-access/products-api.service';
import { OrderCartService } from '../../data-access/order-cart.service';
import { PosProductCardComponent, type PosProductCard } from '../../ui/pos-product-card/pos-product-card.component';
import type { ProductListItem } from '../../../products/models/product.models';

@Component({
  selector: 'app-pos-order-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PosProductCardComponent,
  ],
  templateUrl: './pos-order-page.component.html',
  styleUrl: './pos-order-page.component.css',
})
export class PosOrderPageComponent {
  private readonly productsApi = inject(ProductsApiService);
  private readonly cart = inject(OrderCartService);

  readonly searchQ = signal('');
  readonly loading = signal(false);
  readonly products = signal<ProductListItem[]>([]);
  readonly totalCount = signal(0);
  readonly pageSize = 24;
  readonly pageNumber = signal(1);

  readonly productCards = computed(() => {
    const list = this.products();
    return list.map(
      (p): PosProductCard => ({
        id: p.id,
        name: p.name,
        sellingPrice: p.effectivePrice ?? p.sellingPrice,
        isActive: p.isActive,
        imageUrl: undefined,
        categoryName: p.categoryName,
      })
    );
  });

  quantityInCart(productId: string) {
    return this.cart.getQuantityForProduct(productId);
  }

  constructor() {
    this.loadProducts();
  }

  onSearch(): void {
    this.pageNumber.set(1);
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productsApi
      .getList({
        q: this.searchQ() || undefined,
        isActive: true,
        pageNumber: this.pageNumber(),
        pageSize: this.pageSize,
        sortBy: 'Name',
        sortDir: 'asc',
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.items);
          this.totalCount.set(res.totalCount);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  addToCart(p: PosProductCard): void {
    const price = p.sellingPrice;
    this.cart.addProduct(p.id, p.name, price, p.imageUrl);
  }
}
