import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate, state } from '@angular/animations';

import { CustomersTableComponent } from '../customers-table/customers-table.component';
import { OrdersTableComponent } from '../orders-table/orders-table.component';
import { Customer } from '../../models/data.model';

@Component({
  selector: 'app-table-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    CustomersTableComponent,
    OrdersTableComponent,
  ],
  template: `
    <mat-card class="table-container">
      <mat-card-header>
        <mat-card-title>{{ isShowingOrders ? 'Customer Orders' : 'Customer Management' }}</mat-card-title>
        <mat-card-subtitle>{{ isShowingOrders ? 'View all orders for this customer' : 'View and manage your customers' }}</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content [@tableAnimation]="isShowingOrders ? 'orders' : 'customers'">
        <div class="table-view" *ngIf="!isShowingOrders" [@fadeAnimation]="'in'">
          <app-customers-table (viewOrders)="showCustomerOrders($event)"></app-customers-table>
        </div>
        
        <div class="table-view" *ngIf="isShowingOrders" [@fadeAnimation]="'in'">
          <app-orders-table 
            [customer]="selectedCustomer" 
            (navigateBack)="goBackToCustomers()">
          </app-orders-table>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .table-container {
      margin: 16px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    mat-card-header {
      padding: 16px 16px 0;
    }
    
    mat-card-content {
      padding: 16px;
      position: relative;
      min-height: 400px;
    }
    
    .table-view {
      position: relative;
    }
  `,
  animations: [
    trigger('fadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('tableAnimation', [
      state('customers', style({ transform: 'translateX(0)' })),
      state('orders', style({ transform: 'translateX(0)' })),
      transition('customers => orders', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('300ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition('orders => customers', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 })),
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class TableContainerComponent {
  isShowingOrders = false;
  selectedCustomer?: Customer;
  
  showCustomerOrders(customer: Customer): void {
    this.selectedCustomer = customer;
    this.isShowingOrders = true;
  }
  
  goBackToCustomers(): void {
    this.isShowingOrders = false;
    this.selectedCustomer = undefined;
  }
}