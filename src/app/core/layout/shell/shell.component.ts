import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../loading.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="shell">
      <mat-toolbar color="primary">
        <a mat-button routerLink="/products">Products</a>
        <a mat-button routerLink="/branches">Branches</a>
      </mat-toolbar>
      @if (loading.isLoading()) {
        <mat-progress-bar mode="indeterminate" class="top-progress" />
      }
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .content {
        flex: 1;
        overflow: auto;
        padding: 1rem;
      }
      .top-progress {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }
    `,
  ],
})
export class ShellComponent {
  readonly loading = inject(LoadingService);
}
