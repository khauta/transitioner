import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Customer, Order } from '../../models/data.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
    <div class="breadcrumb mb-16" (click)="goBack()">
      <mat-icon>arrow_back</mat-icon>
      <span>Back to customers</span>
    </div>
    
    <div class="customer-info mb-16" *ngIf="customer">
      <h2>Orders for {{customer.name}}</h2>
      <p>Email: {{customer.email}} | Status: 
        <mat-chip [ngClass]="{
          'active-chip': customer.status === 'active',
          'inactive-chip': customer.status === 'inactive',
          'pending-chip': customer.status === 'pending'
        }">
          {{customer.status}}
        </mat-chip>
      </p>
    </div>
    
    <div class="search-container">
      <mat-form-field class="search-field">
        <mat-label>Search orders</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search by product" #input>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>

    <div class="responsive-table">
      <div class="loading-shade" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      
      <table mat-table [dataSource]="filteredData" matSort (matSortChange)="sortData($event)" class="mat-elevation-z1">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Order ID </th>
          <td mat-cell *matCellDef="let order"> {{order.id}} </td>
        </ng-container>

        <!-- Product Column -->
        <ng-container matColumnDef="product">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Product </th>
          <td mat-cell *matCellDef="let order"> {{order.product}} </td>
        </ng-container>

        <!-- Quantity Column -->
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Quantity </th>
          <td mat-cell *matCellDef="let order"> {{order.quantity}} </td>
        </ng-container>

        <!-- Price Column -->
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Price </th>
          <td mat-cell *matCellDef="let order"> {{order.price | currency}} </td>
        </ng-container>

        <!-- Total Column -->
        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Total </th>
          <td mat-cell *matCellDef="let order"> {{order.price * order.quantity | currency}} </td>
        </ng-container>

        <!-- Order Date Column -->
        <ng-container matColumnDef="orderDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Order Date </th>
          <td mat-cell *matCellDef="let order"> {{order.orderDate | date:'MMM d, y'}} </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let order">
            <mat-chip [ngClass]="{
              'completed-chip': order.status === 'completed',
              'processing-chip': order.status === 'processing',
              'shipped-chip': order.status === 'shipped',
              'cancelled-chip': order.status === 'cancelled'
            }">
              {{order.status}}
            </mat-chip>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr 
          mat-row 
          *matRowDef="let row; columns: displayedColumns;"
          class="order-row"></tr>

        <!-- Row shown when no matching data -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="7">
            <ng-container *ngIf="orders.length === 0; else noMatchingData">
              No orders found for this customer
            </ng-container>
            <ng-template #noMatchingData>
              No data matching the filter "{{input.value}}"
            </ng-template>
          </td>
        </tr>
      </table>

      <mat-paginator 
        [pageSizeOptions]="[5, 10, 25]"
        [pageSize]="5"
        showFirstLastButtons
        aria-label="Select page of orders"
        (page)="handlePageEvent($event)">
      </mat-paginator>
    </div>
  `,
  styles: `
    .order-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .order-row:hover {
      background-color: #f5f5f5;
    }
    
    .completed-chip {
      background-color: #4caf50 !important;
      color: white !important;
    }
    
    .processing-chip {
      background-color: #2196f3 !important;
      color: white !important;
    }
    
    .shipped-chip {
      background-color: #9c27b0 !important;
      color: white !important;
    }
    
    .cancelled-chip {
      background-color: #f44336 !important;
      color: white !important;
    }
    
    .customer-info {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .customer-info h2 {
      margin: 0;
    }
    
    .customer-info p {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .active-chip {
      background-color: #4caf50 !important;
      color: white !important;
    }
    
    .inactive-chip {
      background-color: #f44336 !important;
      color: white !important;
    }
    
    .pending-chip {
      background-color: #ff9800 !important;
      color: white !important;
    }
    
    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 56px;
      right: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      color: #3f51b5;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .breadcrumb:hover {
      color: #303f9f;
      text-decoration: underline;
    }
  `
})
export class OrdersTableComponent implements OnInit {
  @Input() customer?: Customer;
  @Output() navigateBack = new EventEmitter<void>();
  
  displayedColumns: string[] = ['id', 'product', 'quantity', 'price', 'total', 'orderDate', 'status'];
  orders: Order[] = [];
  filteredData: Order[] = [];
  isLoading = true;
  
  constructor(private dataService: DataService) {}
  
  ngOnInit(): void {
    if (this.customer) {
      this.loadOrders();
    }
  }
  
  loadOrders(): void {
    if (!this.customer) return;
    
    this.isLoading = true;
    this.dataService.getOrdersByCustomerId(this.customer.id).subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.filteredData = this.orders.filter(order => 
      order.product.toLowerCase().includes(filterValue)
    );
  }
  
  sortData(sort: Sort): void {
    const data = [...this.filteredData];
    
    if (!sort.active || sort.direction === '') {
      this.filteredData = data;
      return;
    }
    
    this.filteredData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'product': return this.compare(a.product, b.product, isAsc);
        case 'quantity': return this.compare(a.quantity, b.quantity, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'total': return this.compare(a.price * a.quantity, b.price * b.quantity, isAsc);
        case 'orderDate': return this.compare(a.orderDate.getTime(), b.orderDate.getTime(), isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        default: return 0;
      }
    });
  }
  
  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  handlePageEvent(event: PageEvent): void {
    // Handle pagination if needed
  }
  
  goBack(): void {
    this.navigateBack.emit();
  }
}