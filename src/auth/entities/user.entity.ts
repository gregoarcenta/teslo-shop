import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: 'a147db81-1eab-462e-9dd9-c086131c191f',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'test@google.com',
    description: 'User email address',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'Test 1 name',
    description: 'User full name',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'Product isActive',
  })
  @Column('boolean', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['admin'],
    description: 'User roles',
    default: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];
  
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}

/*export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValue = (args.object as any)[args.constraints[0]];
          return value === relatedValue;
        },
      },
    });
  };
}*/
