import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'product_images'})
export class ProductImage {
  @ApiProperty({
    example: '1',
    description: 'Product image ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({
    example: 'image.jpg',
    description: 'Product url',
  })
  @Column('text')
  url: string;
  
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
