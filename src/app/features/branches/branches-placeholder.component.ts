import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-branches-placeholder',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Branches</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Branch management placeholder. Implement when backend APIs are ready.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class BranchesPlaceholderComponent {}
