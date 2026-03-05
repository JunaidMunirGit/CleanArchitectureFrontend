import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ProductsApiService } from '../../data-access/products-api.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import type { Product, ProductPriceItem } from '../../models/product.models';

@Component({
  selector: 'app-branch-price-editor',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    DecimalPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './branch-price-editor.component.html',
  styleUrl: './branch-price-editor.component.css',
})
export class BranchPriceEditorComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ProductsApiService);
  private readonly notification = inject(NotificationService);

  readonly product = signal<Product | null>(null);
  readonly prices = signal<ProductPriceItem[]>([]);

  newBranchId = '';
  newPrice = 0;
  savingBranchId: string | null = null;

  displayedColumns = ['branchName', 'price', 'effectiveFrom', 'effectiveTo', 'actions'];

  private routeId: string | null = null;

  ngOnInit(): void {
    this.routeId = this.route.snapshot.paramMap.get('id');
    const id = this.routeId;
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }
    this.api.getById(id).subscribe({
      next: (p) => this.product.set(p),
      error: () => this.notification.error('Product not found'),
    });
    this.api.getPrices(id).subscribe({
      next: (list) => this.prices.set(list),
    });
  }

  get id(): string {
    return this.routeId ?? this.route.snapshot.paramMap.get('id') ?? '';
  }

  addPrice(): void {
    if (!this.newBranchId.trim() || this.newPrice < 0) return;
    this.savingBranchId = this.newBranchId.trim();
    this.api.setBranchPrice(this.id, this.savingBranchId, this.newPrice).subscribe({
      next: () => {
        this.notification.success('Price set');
        this.api.getPrices(this.id).subscribe((list) => this.prices.set(list));
        this.newBranchId = '';
        this.newPrice = 0;
        this.savingBranchId = null;
      },
      error: () => (this.savingBranchId = null),
    });
  }

  trackByBranch(_: number, p: ProductPriceItem): string {
    return p.branchId ?? 'default';
  }
}
