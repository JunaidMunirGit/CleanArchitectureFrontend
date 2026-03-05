import { Injectable, signal, computed } from '@angular/core';
import type { CreateOrderRequest, PaymentMethod, CreateOrderPaymentRequest } from './models/pos-order.models';

export interface OrderLine {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  size?: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderCartService {
  private readonly _lines = signal<OrderLine[]>([]);
  private _nextId = 1;

  readonly lines = this._lines.asReadonly();

  readonly subtotal = computed(() =>
    this._lines().reduce((sum, l) => sum + l.price * l.quantity, 0)
  );

  readonly taxRate = 0.1;
  readonly taxPercent = 10;
  readonly tax = computed(() => Math.round(this.subtotal() * this.taxRate * 100) / 100);
  private readonly _discountOverride = signal<number | null>(null);
  readonly discount = computed(() => {
    const over = this._discountOverride();
    if (over !== null && over !== undefined) return Math.max(0, over);
    const sub = this.subtotal();
    return sub >= 50 ? Math.round(sub * 0.1 * 100) / 100 : 0;
  });
  readonly total = computed(() =>
    Math.round((this.subtotal() + this.tax() - this.discount()) * 100) / 100
  );

  readonly orderId = computed(() => `#B${Date.now().toString(36).toUpperCase().slice(-6)}`);
  readonly isEmpty = computed(() => this._lines().length === 0);

  readonly paymentMethod = signal<PaymentMethod>('Cash');
  readonly splitPayments = signal<CreateOrderPaymentRequest[]>([]);

  setDiscountOverride(amount: number | null): void {
    this._discountOverride.set(amount);
  }

  setPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod.set(method);
  }

  setSplitPayments(payments: CreateOrderPaymentRequest[]): void {
    this.splitPayments.set(payments);
  }

  buildCreateOrderPayload(): CreateOrderRequest {
    const lines = this._lines().map((l) => ({ productId: l.productId, quantity: l.quantity }));
    const discountAmount = this.discount();
    const method = this.paymentMethod();
    const split = method === 'Split' ? this.splitPayments() : undefined;
    return {
      lines,
      discountAmount,
      taxPercent: this.taxPercent,
      paymentMethod: method,
      splitPayments: split?.length ? split : undefined,
    };
  }

  addProduct(productId: string, name: string, price: number, imageUrl?: string): void {
    const existing = this._lines().find((l) => l.productId === productId && !l.notes && !l.size);
    if (existing) {
      this.updateQuantity(existing.id, existing.quantity + 1);
      return;
    }
    const line: OrderLine = {
      id: `line-${this._nextId++}`,
      productId,
      name,
      price,
      quantity: 1,
      imageUrl,
    };
    this._lines.update((list) => [...list, line]);
  }

  updateQuantity(lineId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeLine(lineId);
      return;
    }
    this._lines.update((list) =>
      list.map((l) => (l.id === lineId ? { ...l, quantity } : l))
    );
  }

  removeLine(lineId: string): void {
    this._lines.update((list) => list.filter((l) => l.id !== lineId));
  }

  setLineNotes(lineId: string, notes: string): void {
    this._lines.update((list) =>
      list.map((l) => (l.id === lineId ? { ...l, notes } : l))
    );
  }

  setLineSize(lineId: string, size: string): void {
    this._lines.update((list) =>
      list.map((l) => (l.id === lineId ? { ...l, size } : l))
    );
  }

  getQuantityForProduct(productId: string): number {
    return this._lines().reduce(
      (sum, l) => (l.productId === productId ? sum + l.quantity : sum),
      0
    );
  }

  clear(): void {
    this._lines.set([]);
  }

  confirmOrder(): void {
    this.clear();
  }
}
