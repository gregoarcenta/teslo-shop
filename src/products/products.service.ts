import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  private readonly limit: number;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.limit = this.configService.get('DEFAULT_LIMIT');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return product;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findAll(limit: number, offset: number) {
    if (isNaN(limit) || limit < 1) limit = this.limit;
    if (isNaN(offset) || offset < 0) offset = 0;

    try {
      return this.productsRepository.find({
        take: limit,
        skip: offset,
        order: { title: 'ASC' },
        // TODO: relations
      });
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findOne(term: string) {
    try {
      const id = isUUID(term) ? term : null;
      const product = await this.productsRepository.findOne({
        where: [{ id }, { title: ILike(term) }, { slug: term }],
      });

      /*const queryBuilder = this.productsRepository.createQueryBuilder();
        product = await queryBuilder
          .where('LOWER(title) = :title or slug = :slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase(),
          }).getOne()
      }*/

      if (!product) throw new NotFoundException(`Product ${term} not found`);

      return product;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productsRepository.preload({
        id,
        ...updateProductDto,
      });

      if (!product) throw new NotFoundException(`Product ${id} not found`);

      await this.productsRepository.save(product);
      return product;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      const productRemoved = await this.productsRepository.remove(product);
      return `Product ${productRemoved.title} has been removed`;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  private handleExceptions(error: any) {
    if (!!error.response) throw error;

    if (error.code == 23505) throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error occurred - check server logs',
    );
  }
}
