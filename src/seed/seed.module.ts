import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "../products/products.module";

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule],
})
export class SeedModule {}