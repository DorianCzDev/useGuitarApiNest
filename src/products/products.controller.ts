import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDto } from './dto/get-all-products.dto';
import { ProductsService } from './products.service';
import { Request } from 'express';
import { Products } from './products.entity';

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
  @UseInterceptors(FilesInterceptor('images[]'))
  updateProduct(
    @Body() body: Partial<Products>,
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 2 })
        .build({ fileIsRequired: false }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.productsService.update(parseInt(id), body, images);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(parseInt(id));
  }

  @Delete('image/:name')
  @UseGuards(AdminGuard)
  deleteProductImage(
    @Param('name') name: string,
    @Query('public_id') publicId: string,
  ) {
    return this.productsService.deleteImage(name, publicId);
  }

  @Patch('inventory/:name')
  @UseGuards(AdminGuard)
  changeProductInventory(
    @Param('name') name: string,
    @Query('operation') operation: string,
    @Query('quantity') quantity: string,
  ) {
    return this.productsService.changeInventory(
      name,
      operation,
      parseInt(quantity),
    );
  }
}
