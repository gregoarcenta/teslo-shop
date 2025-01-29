export interface IOrder {
  id: string;
  totalAmount: string;
  totalItems: number;
  status: string;
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
}
