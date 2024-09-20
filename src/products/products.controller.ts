import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images[]'))
  createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 })],
      }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.productsService.create(body, images);
  }

  @Get()
  getAllProducts(@Query() query: Partial<GetAllProductsDto>) {
    return this.productsService.getAll(query);
  }

  @Get('cart/:id')
  getProductsFromCart(@Param('id') id: string) {
    return this.productsService.getCartProducts(id);
  }

  @Get(':name')
  getSingleProduct(@Param('name') name: string) {
    return this.productsService.getByName(name);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(parseInt(id), body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(parseInt(id));
  }
}
