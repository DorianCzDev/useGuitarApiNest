import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Products } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Products) private repo: Repository<Products>) {}

  create(productDto: CreateProductDto) {
    const product = this.repo.create(productDto);
    return this.repo.save(product);
  }

  async getAll() {
    const products = await this.repo.find({});
    return products;
  }
}
