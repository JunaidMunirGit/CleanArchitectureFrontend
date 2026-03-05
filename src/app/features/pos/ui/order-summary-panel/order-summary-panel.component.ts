import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import type { OrderLine } from '../../data-access/order-cart.service';

@Component({
  selector: 'app-order-summary-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DecimalPipe,
  ],
  templateUrl: './order-summary-panel.component.html',
  styleUrl: './order-summary-panel.component.css',
})
export class OrderSummaryPanelComponent {
  @Input() orderId = '';
  @Input() lines: OrderLine[] = [];
  @Input() subtotal = 0;
  @Input() tax = 0;
  @Input() discount = 0;
  @Input() total = 0;
  @Input() orderType = 'Dine-in';
  @Input() selectedTable = 'A-12B';

  @Output() removeLine = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{ lineId: string; quantity: number }>();
  @Output() confirmPayment = new EventEmitter<void>();

  onRemove(lineId: string): void {
    this.removeLine.emit(lineId);
  }

  onQtyChange(lineId: string, qty: number): void {
    this.updateQuantity.emit({ lineId, quantity: qty });
  }

  onConfirm(): void {
    this.confirmPayment.emit();
  }

  trackByLineId(_: number, line: OrderLine): string {
    return line.id;
  }
}
