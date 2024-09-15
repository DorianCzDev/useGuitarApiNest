import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAll(query: Partial<Products>) {
    // const products = await this.repo.find({ relations: { reviews: true } });
    // return products;
    // return this.repo.query(
    //   'SELECT products.id,name, price, AVG(rating) AS avg_rating, COUNT("productId") AS reviews_number FROM products FULL JOIN reviews ON products.id = "productId" GROUP BY products.id;',
    // );

    const result = this.repo
      .createQueryBuilder('products')
      .select('products.id', 'id')
      .addSelect('name')
      .addSelect('category')
      .addSelect('price')
      .addSelect('stock')
      .addSelect('COUNT("productId")', 'reviews_number')
      .addSelect('AVG(rating)', 'avg_rating')
      .leftJoin('reviews', 'reviews', 'products.id = "productId"')
      .groupBy('products.id');
    let queryEntries = Object.entries(query);

    let queryArray = [];

    queryEntries.map((arrayEl: any) => {
      if (arrayEl[1].includes('true')) {
        arrayEl[1] = true;
      } else if (arrayEl[1].includes('false')) {
        arrayEl[1] = false;
      }
      queryArray = [...queryArray, [arrayEl[0], arrayEl[1]]];
    });

    const queryObjectFromArray = queryArray.map((array) => {
      const [key, value] = array;
      const obj = {
        [key]: value,
      };
      return obj;
    });

    for (let obj of queryObjectFromArray) {
      const [array] = Object.entries(obj);
      const [key, value] = array;
      if (key.includes('min')) {
        const field = key.split('-')[1];
        result.andWhere(`${field} >= :${value}`, { [value]: parseInt(value) });
      } else if (key.includes('max')) {
        const field = key.split('-')[1];
        result.andWhere(`${field} <= :${value}`, { [value]: parseInt(value) });
      } else {
        result.andWhere(`${key} = :${value}`, { [value]: value });
      }
    }

    return result.getRawMany();
  }

  async getByName(name: string) {
    const product = await this.repo.findOneBy({ name });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, body: Partial<Products>) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, body);

    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.remove(product);
  }
}
