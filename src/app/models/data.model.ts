export interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  dateJoined: Date;
  totalOrders: number;
}

export interface Order {
  id: number;
  customerId: number;
  product: string;
  quantity: number;
  price: number;
  orderDate: Date;
  status: 'completed' | 'processing' | 'shipped' | 'cancelled';
}