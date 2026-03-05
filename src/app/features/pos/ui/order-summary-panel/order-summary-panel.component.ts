import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import type { OrderLine } from '../../data-access/order-cart.service';
import type { PaymentMethod, CreateOrderPaymentRequest } from '../../data-access/models/pos-order.models';

@Component({
  selector: 'app-order-summary-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
  @Input() paymentMethod: PaymentMethod = 'Cash';
  @Input() splitPayments: CreateOrderPaymentRequest[] = [];
  @Input() discountOverride: number | null = null;

  @Output() removeLine = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{ lineId: string; quantity: number }>();
  @Output() confirmPayment = new EventEmitter<void>();
  @Output() paymentMethodChange = new EventEmitter<PaymentMethod>();
  @Output() splitPaymentsChange = new EventEmitter<CreateOrderPaymentRequest[]>();
  @Output() discountOverrideChange = new EventEmitter<number | null>();

  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'Split', label: 'Split' },
  ];

  splitCash = 0;
  splitCard = 0;

  onRemove(lineId: string): void {
    this.removeLine.emit(lineId);
  }

  onQtyChange(lineId: string, qty: number): void {
    this.updateQuantity.emit({ lineId, quantity: qty });
  }

  onConfirm(): void {
    if (this.paymentMethod === 'Split') {
      this.splitPaymentsChange.emit([
        { method: 'Cash', amount: this.splitCash },
        { method: 'Card', amount: this.splitCard },
      ]);
    }
    this.confirmPayment.emit();
  }

  onPaymentMethodChange(method: PaymentMethod): void {
    this.paymentMethodChange.emit(method);
  }

  get splitTotal(): number {
    return Math.round((this.splitCash + this.splitCard) * 100) / 100;
  }

  get splitValid(): boolean {
    return Math.abs(this.splitTotal - this.total) < 0.02;
  }

  trackByLineId(_: number, line: OrderLine): string {
    return line.id;
  }
}
