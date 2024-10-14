import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product, ProductImage } from './entities';
import { HandlerException } from "../common/exceptions/handler.exception";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, HandlerException],
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), ConfigModule],
  exports: [ProductsService],
})
export class ProductsModule {}
