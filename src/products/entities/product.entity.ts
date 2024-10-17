import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "products" })
export class Product {
  @ApiProperty({
    example: "a147db81-1eab-462e-9dd9-c086131c191f",
    description: "Product ID",
    uniqueItems: true
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @ApiProperty({
    example: "T-shirt Teslo",
    description: "Product title",
    uniqueItems: true
  })
  @Column("text", { unique: true })
  title: string;
  
  @ApiProperty({
    example: "lorem ipsum dolor sit amet",
    description: "Product description",
    default: null
  })
  @Column("text", { nullable: true })
  description: string;
  
  @ApiProperty({
    example: "t-shirt-teslo",
    description: "Product slug",
    uniqueItems: true
  })
  @Column("text", { unique: true })
  slug: string;
  
  @ApiProperty({
    example: 10.99,
    description: "Product price",
    default: 0
  })
  @Column("float", { nullable: false, default: 0 })
  price: number;
  
  @ApiProperty({
    example: 10,
    description: "Product stock",
    default: 0
  })
  @Column("int", { nullable: false, default: 0 })
  stock: number;
  
  @ApiProperty({
    example: ["M", "XL", "XXL"],
    description: "Product sizes"
  })
  @Column("text", { array: true })
  sizes: string[];
  
  @ApiProperty({
    example: "men",
    description: "Product gender"
  })
  @Column("text")
  gender: string;
  
  @ApiProperty({
    example: ["shirt"],
    description: "Product tags",
    default: []
  })
  @Column("text", { nullable: false, array: true, default: [] })
  tags: string[];
  
  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: "Product images"
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true
  })
  images: ProductImage[];
  
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
  
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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase() // Convertir a minúsculas
      .trim() // Eliminar espacios en blanco al principio y al final
      .replace(/[\s\W-]+/g, "-") // Reemplazar espacios y caracteres no alfanuméricos por guiones
      .replace(/^-+|-+$/g, ""); // Eliminar guiones al principio y al final
  }
}
