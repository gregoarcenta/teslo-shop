export interface IOrderPaginate {
  orders: IOrder[];
  totalOrders: number;
}

export interface IOrder {
  id: string;
  totalAmount: string;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
  items: Item[];
}

interface Item {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  images: any[];
}

export enum OrderStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
