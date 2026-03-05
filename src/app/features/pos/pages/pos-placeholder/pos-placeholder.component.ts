import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pos-placeholder',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="placeholder">
      <mat-icon>construction</mat-icon>
      <h2>Coming soon</h2>
      <p>This section is not implemented yet.</p>
      <a mat-flat-button color="primary" routerLink="/pos/analytics">
        <mat-icon>bar_chart</mat-icon>
        Go to Analytics
      </a>
    </div>
  `,
  styles: [`
    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      padding: 24px;
      text-align: center;
      color: #64748b;
    }
    .placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.6;
    }
    .placeholder h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      color: #1e293b;
    }
    .placeholder p {
      margin: 0 0 20px 0;
      font-size: 0.95rem;
    }
  `],
})
export class PosPlaceholderComponent {}
