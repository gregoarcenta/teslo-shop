import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth, GetUser, Role } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateProductResponse,
  ApiUpdateProductResponse,
  ApiFindProductResponse,
  ApiFindAllProductResponse,
  ApiDeleteProductResponse,
} from '../documentation/decorators/products';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(Role.Admin)
  @ApiCreateProductResponse()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiFindAllProductResponse()
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.productsService.findAll(limit, offset);
  }

  @Get(':term')
  @ApiFindProductResponse()
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(Role.Admin)
  @ApiUpdateProductResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(Role.Admin)
  @ApiDeleteProductResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
