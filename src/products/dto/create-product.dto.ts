import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'T-shirt teslo',
    description: 'Product title',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 't-shirt-teslo',
    description: 'Product slug',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 10.99,
    description: 'Product price',
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    required: false,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['shirt'],
    description: 'Product tags',
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];
  
  @ApiProperty({
    example: "men",
    description: 'Product gender',
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
  
  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product sizes',
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
