enum Gender {
  MEN = 'men',
  WOMEN = 'women',
  KID = 'kid',
  UNISEX = 'unisex',
}

enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum ProductType {
  SHIRTS = 'shirts',
  PANTS = 'pants',
  HOODIES = 'hoodies',
  HATS = 'hats',
}

export interface IPaginateProducts {
  products: IProduct[];
  totalItems: number;
}

export interface IProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  type: ProductType;
  gender: Gender;
  sizes: Size[];
  tags: string[];
  createdAt: Date;
  createdBy: string;
  images: string[];
}
