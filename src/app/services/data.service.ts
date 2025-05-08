import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Customer, Order } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private customers: Customer[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      status: 'active',
      dateJoined: new Date(2023, 0, 15),
      totalOrders: 12
    },
    {
      id: 2,
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      status: 'active',
      dateJoined: new Date(2023, 2, 7),
      totalOrders: 8
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      status: 'inactive',
      dateJoined: new Date(2022, 11, 3),
      totalOrders: 3
    },
    {
      id: 4,
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com',
      status: 'pending',
      dateJoined: new Date(2023, 5, 22),
      totalOrders: 0
    },
    {
      id: 5,
      name: 'William Wilson',
      email: 'william.wilson@example.com',
      status: 'active',
      dateJoined: new Date(2022, 8, 14),
      totalOrders: 15
    },
    {
      id: 6,
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      status: 'active',
      dateJoined: new Date(2023, 3, 19),
      totalOrders: 7
    },
    {
      id: 7,
      name: 'James Taylor',
      email: 'james.taylor@example.com',
      status: 'inactive',
      dateJoined: new Date(2022, 7, 30),
      totalOrders: 5
    }
  ];

  private orders: Order[] = [
    {
      id: 101,
      customerId: 1,
      product: 'Laptop Pro',
      quantity: 1,
      price: 1299.99,
      orderDate: new Date(2023, 5, 15),
      status: 'completed'
    },
    {
      id: 102,
      customerId: 1,
      product: 'Wireless Mouse',
      quantity: 2,
      price: 29.99,
      orderDate: new Date(2023, 6, 2),
      status: 'completed'
    },
    {
      id: 103,
      customerId: 1,
      product: 'External SSD 1TB',
      quantity: 1,
      price: 159.99,
      orderDate: new Date(2023, 7, 10),
      status: 'shipped'
    },
    {
      id: 104,
      customerId: 2,
      product: 'Smartphone X',
      quantity: 1,
      price: 899.99,
      orderDate: new Date(2023, 4, 22),
      status: 'completed'
    },
    {
      id: 105,
      customerId: 2,
      product: 'Bluetooth Headphones',
      quantity: 1,
      price: 199.99,
      orderDate: new Date(2023, 5, 8),
      status: 'completed'
    },
    {
      id: 106,
      customerId: 3,
      product: 'Tablet Mini',
      quantity: 1,
      price: 499.99,
      orderDate: new Date(2023, 2, 15),
      status: 'cancelled'
    },
    {
      id: 107,
      customerId: 5,
      product: 'Smart Watch',
      quantity: 1,
      price: 349.99,
      orderDate: new Date(2023, 6, 17),
      status: 'processing'
    },
    {
      id: 108,
      customerId: 5,
      product: 'Wireless Earbuds',
      quantity: 2,
      price: 149.99,
      orderDate: new Date(2023, 7, 5),
      status: 'shipped'
    }
  ];

  getCustomers(): Observable<Customer[]> {
    // Simulate network delay
    return of(this.customers).pipe(delay(500));
  }

  getCustomerById(id: number): Observable<Customer | undefined> {
    return of(this.customers.find(customer => customer.id === id)).pipe(delay(300));
  }

  getOrdersByCustomerId(customerId: number): Observable<Order[]> {
    return of(this.orders.filter(order => order.customerId === customerId)).pipe(delay(500));
  }
}