import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TableContainerComponent } from './components/table-container/table-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TableContainerComponent
  ],
  providers: [
    provideHttpClient(),
    provideAnimations()
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-header">
        <span>Data Manager</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button aria-label="Help">
          <mat-icon>help_outline</mat-icon>
        </button>
      </mat-toolbar>
      
      <div class="content-container">
        <app-table-container></app-table-container>
      </div>
    </div>
  `,
  styles: `
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .app-header {
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    .content-container {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background-color: #f5f5f5;
    }
    
    @media (max-width: 600px) {
      .content-container {
        padding: 8px;
      }
    }
  `
})
export class AppComponent {
  title = 'Data Manager';
}