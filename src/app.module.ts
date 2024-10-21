import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: envValidationSchema }),
    TypeOrmModule.forRoot({
      ssl: process.env.NODE_ENV === 'production',
      extra:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : null,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    SeedModule,
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
