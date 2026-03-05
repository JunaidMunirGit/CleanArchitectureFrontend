import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface PosProductCard {
  id: string;
  name: string;
  sellingPrice: number;
  isActive: boolean;
  imageUrl?: string;
  categoryName?: string;
}

@Component({
  selector: 'app-pos-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, DecimalPipe],
  templateUrl: './pos-product-card.component.html',
  styleUrl: './pos-product-card.component.css',
})
export class PosProductCardComponent {
  @Input() product!: PosProductCard;
  @Input() quantityInCart = 0;
  @Output() addToCart = new EventEmitter<void>();

  onAdd(): void {
    if (this.product.isActive) {
      this.addToCart.emit();
    }
  }
}
