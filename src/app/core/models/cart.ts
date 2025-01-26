import { IProduct } from '@/core/models/product';

export interface ICart {
  id: string;
  total: string;
  cartItems: ICartItem[];
}

export interface ICartItem {
  id: string;
  quantity: number;
  product: IProduct;
}
