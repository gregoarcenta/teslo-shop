import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'Execute Seed';
  }

  private async insertNewProducts() {
    await this.productsService.removeAll();

    const products = initialData.products;

    let insertPromises = [];

    for (const product of products) {
      insertPromises.push(this.productsService.create(product));
    }

    await Promise.all(insertPromises);
  }
}
