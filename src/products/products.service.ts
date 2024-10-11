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
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  private readonly limit: number;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly configService: ConfigService,
  ) {
    this.limit = this.configService.get('DEFAULT_LIMIT');
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const productDto = this.buildDtoCreateAndUpdate(createProductDto);

      const product = this.productRepository.create(productDto);

      await this.productRepository.save(product);
      return product;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findAll(limit: number, offset: number) {
    if (isNaN(limit) || limit < 1) limit = this.limit;
    if (isNaN(offset) || offset < 0) offset = 0;

    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        order: { title: 'ASC' },
      });

      return products.map(({ images, ...productProperties }) => ({
        ...productProperties,
        images: images.map((img) => img.url),
      }));
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  private async findOne(term: string) {
    try {
      const id = isUUID(term) ? term : null;
      const product = await this.productRepository.findOne({
        where: [{ id }, { title: ILike(term) }, { slug: term }],
      });

      /*const queryBuilder = this.productsRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where('LOWER(title) = :title or slug = :slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase(),
          })
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne()
      }*/

      if (!product) throw new NotFoundException(`Product ${term} not found`);

      return product;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async findOnePlain(term: string) {
    const product = await this.findOne(term);

    return {
      ...product,
      images: product.images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const originalProduct = await this.findOne(id);
      
      let productDto = this.buildDtoCreateAndUpdate(updateProductDto);
      productDto.slug = this.getValidSlug(originalProduct, productDto);

      const product = await this.productRepository.preload({
        id,
        ...productDto,
      });
      await this.productRepository.save(product);
      return product;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      const productRemoved = await this.productRepository.remove(product);
      return `Product ${productRemoved.title} has been removed`;
    } catch (e) {
      this.handleExceptions(e);
    }
  }

  getValidSlug(originalProduct: Product, newProduct: Product) {
    const originalTitle = originalProduct['title'];
    const originalSlug = originalProduct['slug'];
    const newTitle = newProduct['title'];
    const newSlug = newProduct['slug'];

    if (newSlug) return newSlug;

    if (newTitle && newTitle !== originalTitle) return newTitle;

    return originalSlug;
  }

  private buildDtoCreateAndUpdate(
    dto: UpdateProductDto | CreateProductDto,
  ): Product {
    const { images, ...productProperties } = dto;
    let product: any = { ...productProperties };

    if (images?.length > 0) {
      product.images = images.map((image) =>
        this.productImageRepository.create({ url: image }),
      );
    }
    return product;
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
