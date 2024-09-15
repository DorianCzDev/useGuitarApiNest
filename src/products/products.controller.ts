import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Get()
  getAllProducts(@Query() query: Partial<GetAllProductsDto>) {
    return this.productsService.getAll(query);
  }

  @Get(':name')
  getSingleProduct(@Param('name') name: string) {
    return this.productsService.getByName(name);
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(parseInt(id), body);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(parseInt(id));
  }
}
