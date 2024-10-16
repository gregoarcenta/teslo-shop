import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product, ProductImage } from './entities';
import { HandlerException } from '../common/exceptions/handler.exception';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, HandlerException],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
