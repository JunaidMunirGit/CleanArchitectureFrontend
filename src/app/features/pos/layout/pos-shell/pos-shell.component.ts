import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../../../core/loading.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { OrderCartService } from '../../data-access/order-cart.service';
import { OrderSummaryPanelComponent } from '../../ui/order-summary-panel/order-summary-panel.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pos-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    OrderSummaryPanelComponent,
    DatePipe,
  ],
  templateUrl: './pos-shell.component.html',
  styleUrl: './pos-shell.component.css',
})
export class PosShellComponent {
  readonly loading = inject(LoadingService);
  private readonly auth = inject(AuthService);
  private readonly cart = inject(OrderCartService);

  readonly user = this.auth.currentUser;
  readonly userDisplayName = computed(() => {
    const u = this.user();
    if (!u) return 'Account';
    if (u.firstName && u.lastName) return `${u.firstName} ${u.lastName}`.trim();
    return u.email || 'Account';
  });
  readonly userAvatarLetter = computed(() => {
    const u = this.user();
    if (!u) return '?';
    if (u.firstName) return u.firstName[0].toUpperCase();
    if (u.email) return u.email[0].toUpperCase();
    return '?';
  });
  readonly now = computed(() => new Date());
  manageTableOpen = false;

  readonly orderId = this.cart.orderId;
  readonly lines = this.cart.lines;
  readonly subtotal = this.cart.subtotal;
  readonly tax = this.cart.tax;
  readonly discount = this.cart.discount;
  readonly total = this.cart.total;

  onRemoveLine(lineId: string): void {
    this.cart.removeLine(lineId);
  }

  onUpdateQuantity(lineId: string, quantity: number): void {
    this.cart.updateQuantity(lineId, quantity);
  }

  onConfirmPayment(): void {
    this.cart.confirmOrder();
  }

  logout(): void {
    this.auth.logout();
  }
}
