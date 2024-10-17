import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductImage } from "./entities";
import { User } from '../auth/entities/user.entity';
import { HandlerException } from '../common/exceptions/handler.exception';

@Injectable()
export class ProductsService {
  private readonly limit: number;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly handlerException: HandlerException,
  ) {
    this.limit = this.configService.get('DEFAULT_LIMIT');
  }

  async create(createProductDto: CreateProductDto, user: User) {
    const productDto = this.buildDtoCreateAndUpdate(createProductDto);
    try {
      const product = this.productRepository.create({ ...productDto, user });
      const { id } = await this.productRepository.save(product);
      return await this.findOnePlain(id)
    } catch (err) {
      this.handlerException.handlerDBException(err);
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
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  private async findOne(term: string) {
    const id = isUUID(term) ? term : null;
    let product: Product;
    try {
      product = await this.productRepository.findOne({
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
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }

    if (!product) throw new NotFoundException(`Product ${term} not found`);

    return product;
  }

  async findOnePlain(term: string) {
    const product = await this.findOne(term);

    return {
      ...product,
      images: product.images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    // Busca el producto original
    const originalProduct = await this.findOne(id);

    // Construye un nuevo dto con las instacias de las imagenes
    let productDto = this.buildDtoCreateAndUpdate(updateProductDto);

    // Asigna el id y un slug valido para actualizar
    productDto.slug = this.getValidSlug(originalProduct, productDto);
    productDto.id = id;

    // Carga la instancia del producto a actualizar
    const product = await this.productRepository.preload({
      ...productDto,
      user,
    });

    // Crea un QueryRunner para iniciar una transaccion
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Si existen imagenes nuevas se eliminan las anteriores
      if (product.images) {
        await queryRunner.manager.delete(ProductImage, { product: id });
      }
      // Actualiza el producto
      await queryRunner.manager.save(product);
      // Commit de la transaccion
      await queryRunner.commitTransaction();

      return this.findOnePlain(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.handlerException.handlerDBException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    try {
      const productRemoved = await this.productRepository.remove(product);
      return `Product ${productRemoved.title} has been removed`;
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder();
    try {
      return await query.delete().execute();
    } catch (err) {
      this.handlerException.handlerDBException(err);
    }
  }

  private getValidSlug(originalProduct: Product, newProduct: Product) {
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
}
