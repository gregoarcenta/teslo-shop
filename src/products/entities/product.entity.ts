import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false, unique: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: false, unique: true })
  slug: string;

  @Column('float', { nullable: false, default: 0 })
  price: number;

  @Column('int', { nullable: false, default: 0 })
  stock: number;

  @Column('text', { nullable: false, array: true })
  sizes: string[];

  @Column('text', { nullable: false })
  gender: string;

  @Column('text', { nullable: false, array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    eager: true,
  })
  images?: ProductImage[];

  @BeforeInsert()
  @BeforeUpdate()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.convertToSlug(this.slug);
  }

  private convertToSlug(value: string) {
    this.slug = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase() // Convertir a minúsculas
      .trim() // Eliminar espacios en blanco al principio y al final
      .replace(/[\s\W-]+/g, '-') // Reemplazar espacios y caracteres no alfanuméricos por guiones
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al principio y al final
  }
}
