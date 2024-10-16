import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertProducts(adminUser);
    return 'Execute Seed';
  }

  private async deleteTables() {
    await this.productsService.removeAll();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().execute();
  }

  private async insertUsers(): Promise<User> {
    const seedUsers = initialData.users;

    let users: User[] = [];

    for (const user of seedUsers) {
      users.push(
        this.userRepository.create({
          ...user,
          password: bcrypt.hashSync(user.password, 10),
        }),
      );
    }

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertProducts(adminUser: User) {
    const products = initialData.products;

    let insertPromises = [];

    for (const product of products) {
      insertPromises.push(this.productsService.create(product, adminUser));
    }

    await Promise.all(insertPromises);
  }
}
