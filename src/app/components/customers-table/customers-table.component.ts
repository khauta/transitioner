import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

import { Customer } from '../../models/data.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-customers-table',
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
    <div class="search-container">
      <mat-form-field class="search-field">
        <mat-label>Search customers</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email" #input>
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
          <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
          <td mat-cell *matCellDef="let customer"> {{customer.id}} </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
          <td mat-cell *matCellDef="let customer"> {{customer.name}} </td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Email </th>
          <td mat-cell *matCellDef="let customer"> {{customer.email}} </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let customer">
            <mat-chip [ngClass]="{
              'active-chip': customer.status === 'active',
              'inactive-chip': customer.status === 'inactive',
              'pending-chip': customer.status === 'pending'
            }">
              {{customer.status}}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Date Joined Column -->
        <ng-container matColumnDef="dateJoined">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Date Joined </th>
          <td mat-cell *matCellDef="let customer"> {{customer.dateJoined | date:'MMM d, y'}} </td>
        </ng-container>

        <!-- Total Orders Column -->
        <ng-container matColumnDef="totalOrders">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Total Orders </th>
          <td mat-cell *matCellDef="let customer"> {{customer.totalOrders}} </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let customer">
            <button 
              mat-mini-fab 
              color="primary" 
              class="action-button" 
              matTooltip="View orders"
              (click)="viewCustomerOrders(customer)">
              <mat-icon>visibility</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr 
          mat-row 
          *matRowDef="let row; columns: displayedColumns;"
          class="customer-row"></tr>

        <!-- Row shown when no matching data -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="7">No data matching the filter "{{input.value}}"</td>
        </tr>
      </table>

      <mat-paginator 
        [pageSizeOptions]="[5, 10, 25]"
        [pageSize]="5"
        showFirstLastButtons
        aria-label="Select page of customers"
        (page)="handlePageEvent($event)">
      </mat-paginator>
    </div>
  `,
  styles: `
    .customer-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .customer-row:hover {
      background-color: #f5f5f5;
    }
    
    .action-button {
      opacity: 0.9;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    
    .action-button:hover {
      opacity: 1;
      transform: scale(1.1);
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
  `
})
export class CustomersTableComponent implements OnInit {
  @Output() viewOrders = new EventEmitter<Customer>();
  
  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'dateJoined', 'totalOrders', 'actions'];
  customers: Customer[] = [];
  filteredData: Customer[] = [];
  isLoading = true;
  
  constructor(private dataService: DataService) {}
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.isLoading = true;
    this.dataService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.isLoading = false;
      }
    });
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.filteredData = this.customers.filter(customer => 
      customer.name.toLowerCase().includes(filterValue) ||
      customer.email.toLowerCase().includes(filterValue)
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
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'email': return this.compare(a.email, b.email, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'dateJoined': return this.compare(a.dateJoined.getTime(), b.dateJoined.getTime(), isAsc);
        case 'totalOrders': return this.compare(a.totalOrders, b.totalOrders, isAsc);
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
  
  viewCustomerOrders(customer: Customer): void {
    this.viewOrders.emit(customer);
  }
}